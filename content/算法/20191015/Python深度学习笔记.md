---
createdAt: '2019-10-15'
updatedAt: '2019-10-15'
---

<!--more-->

```python
import numpy as np
from keras import layers
from keras import models
from keras.datasets import imdb

# 仅保留训练数据中前 10 000 个最常出现的单词,便于处理
(train_data, train_labels), (test_data, test_labels) = imdb.load_data(num_words=10000)

# train_data和test_data的结构是[3, 5]，转换为one-hot
def vectorize_sequences(sequences, dimension=10000):
    results = np.zeros((len(sequences), dimension))
    for i, sequence in enumerate(sequences):
        results[i, sequence] = 1.
    return results


x_train = vectorize_sequences(train_data)
x_test = vectorize_sequences(test_data)

# 将标签数组转换为浮点的向量
y_train = np.asarray(train_labels).astype('float32')
y_test = np.asarray(test_labels).astype('float32')

model = models.Sequential()
model.add(layers.Dense(16, activation='relu', input_shape=(10000,)))
model.add(layers.Dense(16, activation='relu'))
model.add(layers.Dense(1, activation='sigmoid'))

model.compile(optimizer='rmsprop', loss='binary_crossentropy', metrics=['accuracy'])

# 从训练集里哇一部分作为验证集
x_val = x_train[:10000]
partial_x_train = x_train[10000:]
y_val = y_train[:10000]
partial_y_train = y_train[10000:]

history = model.fit(partial_x_train, partial_y_train, epochs=10, batch_size=512, validation_data=(x_val, y_val))
```

```
Epoch 1/20
15000/15000 [==============================] - 3s 188us/step - loss: 0.5439 - accuracy: 0.7667 - val_loss: 0.4117 - val_accuracy: 0.8565
```

1. 在20次迭代，可以看到验证集的val_loss的val_accuracy最好结果停留在第四次迭代，之后就过拟合了
2. 增加层，会令最优迭代提前，最结果影响貌似不大
3. 增加层的单元，最优迭代不变，会令结果变差，反之则反之
4. 将binary_crossentropy用mse替代，感觉比binary_crossentropy变化要平稳，貌似没那么多跳动
5. 将relu用tanh替代，没什么太大感觉，但貌似最优迭代提前了