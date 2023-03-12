---
createdAt: '2018-03-13'
updatedAt: '2018-03-13'
---
Apache Commons FileUpload是用来处理二进制表单的包，[官网](http://commons.apache.org/ "官网")

FileUpload只能处理`multipart/form-data`类型的表单。如果不是则会抛`FileUploadException`异常。

<!--more-->

判断表单是否是`multipart/form-data`类型，可以通过一下静态方法判断：

```java
//检查表单是否是`multipart/form-data`类型
boolean isMultipart = ServletFileUpload.isMultipartContent(request);
```
我们先来看一个简单例子
```java
//创建一个上传工厂类，这个工厂类保存着许多配置，当有文件上传时，便可以通过工厂类里保存的配置创建一个文件上传对象
DiskFileItemFactory factory = new DiskFileItemFactory();
//对于小文件，文件会保存在内存里。
//但是如果是大文件，那么FileUpload就会把数据保存在一个临时文件里。
//这里设置的就是多大的文件会保存到临时文件
factory.setSizeThreshold(yourMaxMemorySize);
//临时文件保存到哪里
factory.setRepository(yourTempDirectory);
//上传工厂类的创建也可以这样
//DiskFileItemFactory factory = new DiskFileItemFactory(yourMaxMemorySize, yourTempDirectory);

//用工厂的参数创建一个文件上传对象
ServletFileUpload upload = new ServletFileUpload(factory);
//这次上传最多能上传多少数据
upload.setSizeMax(yourMaxRequestSize);

//用文件上传对象解析表单，表单信息封装到了FileItem里
List<FileItem> items = upload.parseRequest(request);
```
获取到了`List<FileItem>`，遍历他便是了。如果item是普通的key-value，那`item.isFormField()`方法会返回true，否则就是文件。
```java
if (item.isFormField()) {
    String name = item.getFieldName();//key
    String value = item.getString();//value
    ...
}
if (!item.isFormField()) {
    String fieldName = item.getFieldName();//key
    String fileName = item.getName();//文件的原名
    String contentType = item.getContentType();//文件类型
    boolean isInMemory = item.isInMemory();//文件是保存在内存里还是保存在临时文件里
    long sizeInBytes = item.getSize();//文件大小
    
    if (writeToFile) {
        File uploadedFile = new File(...);
        item.write(uploadedFile);//把数据保存指定文件里
    } else {
        InputStream uploadedStream = item.getInputStream();//获取流
        ...
        uploadedStream.close();
        
        byte[] data = item.get();//也可以直接把数据拿出来
    }
}
```
有时候我们需要报告文件上传进度，这时候需要在文件上传对象里设置一个进度监听对象
```java
//创建一个进度监听对象
ProgressListener progressListener = new ProgressListener(){
    public void update(long pBytesRead, long pContentLength, int pItems) {
        System.out.println("We are currently reading item " + pItems);
        if (pContentLength == -1) {
            System.out.println("So far, " + pBytesRead + " bytes have been read.");
        } else {
            System.out.println("So far, " + pBytesRead + " of " + pContentLength + " bytes have been read.");
        }
    }
};
upload.setProgressListener(progressListener);//在文件上传对象里设置进度监听对象
```

参考文献

[https://commons.apache.org/proper/commons-fileupload/using.html](https://commons.apache.org/proper/commons-fileupload/using.html)