---
createdAt: '2020-04-30'
updatedAt: '2020-04-30'
---
自己用keras写了个VAE自编码器，用的是mnist数据集。参考了《Python深度学习》_2018中文版.pdf和[深度学习第52讲：变分自编码器VAE原理以及keras实现](https://zhuanlan.zhihu.com/p/54032548)里的实现

用CPU跑真是慢死了，人生苦短，莫得N卡.

调参调了一整天，噫吁嚱。


<!--more-->

```python
import keras
import matplotlib.pyplot as plt
import numpy as np
from keras import Input, Model
from keras import backend as K
from keras.callbacks import EarlyStopping
from keras.datasets import mnist
from keras.engine.saving import load_model
from keras.layers import Conv2D, Flatten, Dense, Lambda, Reshape, Conv2DTranspose
from scipy.stats import norm

input_shape = (28, 28, 1)
batch_size = 32
latent_dim = 2


def get_data():
    (x_train, _), (x_test, _) = mnist.load_data()
    x_train = x_train.astype('float32') / 255.
    x_test = x_test.astype('float32') / 255.
    # 数据集本来是(None,28,28)的结构的，把它整成图片的三维(None,28,28,1)
    x_train = x_train.reshape((x_train.shape[0],) + input_shape)
    x_test = x_test.reshape((x_test.shape[0],) + input_shape)
    x_train = random_data(x_train)
    x_test = random_data(x_test)
    print('x_train.shape', x_train.shape)
    print('x_test.shape', x_test.shape)
    return x_train, x_test


def random_data(data):
    indexs = np.arange(data.shape[0])
    np.random.shuffle(indexs)
    return data[indexs]


def create_model():
    # 这里的卷积层步长为2，用来缩小下一层的图片大小
    # 我试了一下用池化替代步长，感觉没有步长效果好，但只是感觉
    conv2D_layer1 = Conv2D(32, 3, padding='same', activation='relu', strides=(2, 2))
    # max_pool_layer1 = MaxPooling2D(2, 2)
    conv2D_layer2 = Conv2D(64, 3, padding='same', activation='relu', strides=(2, 2))
    # max_pool_layer2 = MaxPooling2D(2, 2)
    flatten_layer = Flatten()
    # 将卷积层摊平后最好加个全连接层映射一下，效果会有比较明显的提升
    dense_layer1 = Dense(64, activation='relu')
    # 将全连接层分别映射到正态分布的均值和方差，这里的正态分布是二维的，所以latent_dim取2
    mean_layer = Dense(latent_dim)
    variance_layer = Dense(latent_dim)

    # 通过均值和方差，算一个小小的偏移均值的张量
    lambda_layer = Lambda(mean_variance_merge, output_shape=(latent_dim,))

    # 将小小的偏移均值的张量这个潜空间的点映射为全连接
    # 这里的14是取28的一半，方便在Conv2DTranspose层里放大一倍
    # 调参的时候发现loss一直卡在0.26下不去，发现是这层的特征通过太少(我一开始填了1)。要起码增大到32，64效果比较好
    # 这里的np.prod(hide_shape)本来是想跟dense_layer1一致的，感觉对称或许会更好
    # 但为了减少Conv2DTranspose层，意味着hide_shape要足够大，导致dense_layer1的参数暴增
    # 现在抛开对称，dense_layer1特征少，通过均值和方差的两特征，这里映射为(14, 14, 64)这个多特征，还真是有点神奇
    hide_shape = (14, 14, 64)
    dense_layer2 = Dense(np.prod(hide_shape), activation='relu')
    reshape_layer = Reshape(hide_shape)
    # 用Conv2DTranspose层里放大一倍，步长我设置过为4，loss会更糟，出来的图片还是锐利的，但是明显变得大色块
    conv2DTranspose_layer1 = Conv2DTranspose(32, 3, padding='same', activation='relu', strides=(2, 2))
    # 最后加个卷积层拍扁一下特征数，变为1。
    # 其中卷积核大小我试过改为2、3、4、5，效果感觉为越大越好，但其实差别不大
    conv2D_layer4 = Conv2D(1, 5, padding='same', activation='sigmoid')
    # 计算损失的层
    vae_loss_layer = VaeLossLayer()

    input_tensor = Input(shape=input_shape)
    output_tensor = input_tensor
    output_tensor = conv2D_layer1(output_tensor)
    # output_tensor = max_pool_layer1(output_tensor)
    output_tensor = conv2D_layer2(output_tensor)
    # output_tensor = max_pool_layer2(output_tensor)
    output_tensor = flatten_layer(output_tensor)
    output_tensor = dense_layer1(output_tensor)
    mean_output_tensor = mean_layer(output_tensor)
    variance_output_tensor = variance_layer(output_tensor)

    output_tensor = lambda_layer([mean_output_tensor, variance_output_tensor])

    output_tensor = dense_layer2(output_tensor)
    output_tensor = reshape_layer(output_tensor)
    output_tensor = conv2DTranspose_layer1(output_tensor)
    output_tensor = conv2D_layer4(output_tensor)
    output_tensor = vae_loss_layer([input_tensor, output_tensor, mean_output_tensor, variance_output_tensor])

    vae = Model(input_tensor, output_tensor)
    # 模型名字貌似不能用中文，否则在h5文件里恢复模型的时候会报错
    vae.name = 'vae'
    # 这里可以使用add_loss方法替换vae_loss_layer，但是我试过，这样的话，在h5文件里恢复模型的时候会报错
    # vae.add_loss(create_vae_loss_tensor(input_tensor, output_tensor, mean_output_tensor, variance_output_tensor))
    # 已经在损失层里计算损失了，所以loss=None
    vae.compile(optimizer='adam', loss=None)
    vae.summary()

    output_tensor = input_tensor
    output_tensor = conv2D_layer1(output_tensor)
    # output_tensor = max_pool_layer1(output_tensor)
    output_tensor = conv2D_layer2(output_tensor)
    # output_tensor = max_pool_layer2(output_tensor)
    output_tensor = flatten_layer(output_tensor)
    output_tensor = dense_layer1(output_tensor)
    mean_output_layer = mean_layer(output_tensor)
    encoder = Model(input_tensor, mean_output_layer)
    encoder.name = 'encoder'
    encoder.summary()

    input_tensor = Input(shape=lambda_layer.output_shape[1:])
    output_tensor = input_tensor
    output_tensor = dense_layer2(output_tensor)
    output_tensor = reshape_layer(output_tensor)
    output_tensor = conv2DTranspose_layer1(output_tensor)
    output_tensor = conv2D_layer4(output_tensor)
    decoder = Model(input_tensor, output_tensor)
    decoder.name = 'decoder'
    decoder.summary()

    return encoder, decoder, vae


def create_vae_loss_tensor(input_tensor, output_tensor, mean_output_tensor, variance_output_tensor):
    # 要把输入张量与输出张量摊平，才能使用binary_crossentropy方法来计算损失
    input_tensor = K.flatten(input_tensor)
    output_tensor = K.flatten(output_tensor)
    xent_loss_tensor = keras.metrics.binary_crossentropy(input_tensor, output_tensor)
    # K.mean可以使用K.sum来替换，使用K.sum的话，把参数-5e-4改为-0.5就好，按道理应该不会对效果参数影响
    # 上面的xent_loss_tensor是计算输入输出直接的损失，这步应该是用来计算那个正态分布的损失
    # 这里这步计算没看懂，既然K.mean并不重要，那么K.mean里面的才是精髓
    kl_loss_tensor = -5e-4 * K.mean(
        1 + variance_output_tensor - K.square(mean_output_tensor) - K.exp(variance_output_tensor), axis=-1)
    # 然后把两个损失算个平均值一下作为总损失
    vae_loss_tensor = K.mean(xent_loss_tensor + kl_loss_tensor)
    return vae_loss_tensor


class VaeLossLayer(keras.layers.Layer):
    """建一个自定义层用来计算损失"""

    def call(self, inputs):
        input_tensor = inputs[0]
        output_tensor = inputs[1]
        mean_output_tensor = inputs[2]
        variance_output_tensor = inputs[3]
        vae_loss_tensor = create_vae_loss_tensor(input_tensor, output_tensor, mean_output_tensor,
                                                 variance_output_tensor)
        # 这里设置损失，至于inputs有什么用，不是很清楚
        self.add_loss(vae_loss_tensor, inputs=inputs)
        # 这里返回的input_tensor貌似是没有被使用，但是好像说是一定需要返回一个张量，所以就(随便?)返回了input_tensor
        return input_tensor


def mean_variance_merge(args):
    mean_output_tensor, variance_output_tensor = args
    # 以mean_output_tensor的结构，整一个很小的ε张量
    epsilon_tensor = K.random_normal(shape=(K.shape(mean_output_tensor)[0], latent_dim), mean=0., stddev=1.)
    # 将ε乘以方差加上均值，做小小的偏移均值的张量（还是说其实variance_output_tensor应该是标准差才对？）
    return mean_output_tensor + K.exp(variance_output_tensor) * epsilon_tensor


def fit(vae, x_train, x_test):
    early_stopping = EarlyStopping(monitor='val_loss', patience=2)
    return vae.fit(
        x=x_train,
        y=None,
        shuffle=True,
        epochs=10,
        batch_size=batch_size,
        validation_data=(x_test, None),
        callbacks=[early_stopping],
    )


def save_h5(encoder, decoder, vae):
    encoder.save('my_vae-encoder.h5')
    decoder.save('my_vae-decoder.h5')
    vae.save('my_vae-vae.h5')


def load_h5():
    encoder = load_model('my_vae-encoder.h5')
    decoder = load_model('my_vae-decoder.h5')
    # latent_dim和VaeLossLayer会在加载模型的时候用到
    vae = load_model('my_vae-vae.h5', custom_objects={'latent_dim': latent_dim, 'VaeLossLayer': VaeLossLayer})
    encoder.summary()
    decoder.summary()
    vae.summary()
    return encoder, decoder, vae


def show_result(decoder):
    n = 15
    digit_size = 28
    figure = np.zeros((digit_size * n, digit_size * n))
    grid_x = norm.ppf(np.linspace(0.05, 0.95, n))
    grid_y = norm.ppf(np.linspace(0.05, 0.95, n))

    for i, yi in enumerate(grid_x):
        for j, xi in enumerate(grid_y):
            z_sample = np.array([[xi, yi]])
            z_sample = np.tile(z_sample, batch_size).reshape(batch_size, 2)
            x_decoded = decoder.predict(z_sample, batch_size=batch_size)
            digit = x_decoded[0].reshape(digit_size, digit_size)
            figure[i * digit_size: (i + 1) * digit_size, j * digit_size: (j + 1) * digit_size] = digit

    plt.figure(figsize=(10, 10))
    plt.imshow(figure, cmap='Greys_r')
    plt.show()


def show_fit(history):
    if 'acc' in history.history and 'val_acc' in history.history:
        acc = history.history['acc']
        val_acc = history.history['val_acc']
        epochs = range(1, len(acc) + 1)
        plt.plot(epochs, acc, 'bo', label='Training acc')
        plt.plot(epochs, val_acc, 'b', label='Validation acc')
        plt.title('Training and validation accuracy')
        plt.legend()

    if 'loss' in history.history and 'val_loss' in history.history:
        loss = history.history['loss']
        val_loss = history.history['val_loss']
        epochs = range(1, len(loss) + 1)
        plt.figure()
        plt.plot(epochs, loss, 'bo', label='Training loss')
        plt.plot(epochs, val_loss, 'b', label='Validation loss')
        plt.title('Training and validation loss')
        plt.legend()

    plt.show()


# CPU每轮迭代大约一分多钟，第一轮loss会跌到0.22，第二次会跌到0.19，迭代两轮结果已经有模有样
# 迭代个10次就差不多了，三十次左右开始过拟合
# 数据集比较简单，模型行不行，迭代两轮看能不能跌倒0.20就知道了
x_train, x_test = get_data()
encoder, decoder, vae = create_model()
history = fit(vae, x_train, x_test)
save_h5(encoder, decoder, vae)
show_result(decoder)
show_fit(history)

```