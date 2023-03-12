---
createdAt: '2018-03-12'
updatedAt: '2018-03-12'
---
Apache Http Components可以在java里方便发送http请求的包，[官网](https://hc.apache.org/ "官网")

目前最新版本到4.5.5，下文使用的是4.5.2。

<!--more-->

先贴代码
```java
package httpClient;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.NameValuePair;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpRequestBase;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

/**
 * Created by cellargalaxy on 18-3-14.
 */
public class HttpClientDeal {
    //使用HttpClients的静态方法创建一个CloseableHttpClient对象。
    //可以理解httpClient就是个浏览器一样，通过httpClient这个浏览器发送http请求
    private static final CloseableHttpClient httpClient = HttpClients.createDefault();
    
    /**
     * 创建一个HttpGet请求的对象，
     * @param url 请求地址
     * @param nameValuePairs 请求参数，key-value参数封装在NameValuePair对象里
     * @return
     */
    public static final HttpGet createHttpGet(String url, List<NameValuePair> nameValuePairs) {
        try {
            if (url == null) {
                return null;
            }
            HttpGet httpGet = new HttpGet(url);
            if (nameValuePairs != null && nameValuePairs.size() > 0) {
                //将参数再封装到UrlEncodedFormEntity的实体对象里。
                //并使用EntityUtils的静态方法转变成url问号后面的key=value。
                //如果有中文什么的也会编码好的。关于UrlEncodedFormEntity类在源码里再说
                String paramsString = EntityUtils.toString(new UrlEncodedFormEntity(nameValuePairs, "utf-8"));
                httpGet.setURI(new URI(httpGet.getURI().toString() + "?" + paramsString));
            }
            return httpGet;
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (URISyntaxException e) {
            e.printStackTrace();
        }
        return null;
    }
    
    /**
     * 跟createHttpGet一样
     * @param url
     * @param nameValuePairs
     * @return
     */
    public static final HttpPost createHttpPost(String url, List<NameValuePair> nameValuePairs) {
        try {
            if (url == null) {
                return null;
            }
            HttpPost httpPost = new HttpPost(url);
            if (nameValuePairs != null && nameValuePairs.size() > 0) {
                String paramsString = EntityUtils.toString(new UrlEncodedFormEntity(nameValuePairs, "utf-8"));
                httpPost.setURI(new URI(httpPost.getURI().toString() + "?" + paramsString));
            }
            return httpPost;
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (URISyntaxException e) {
            e.printStackTrace();
        }
        return null;
    }
    
    public static final String executeHttpRequestBase(HttpRequestBase httpRequestBase, int timeout) {
        return executeHttpRequestBase(httpClient, httpRequestBase, timeout);
    }
    
    /**
     * 使用httpClient请求httpRequestBase对象，并设置其请求的超时时间。
     * httpRequestBase在源码里再说，httpRequestBase是HttpGet和HttpPost的父类
     * @param httpClient
     * @param httpRequestBase
     * @param timeout
     * @return
     */
    public static final String executeHttpRequestBase(CloseableHttpClient httpClient, HttpRequestBase httpRequestBase, int timeout) {
        try {
            //创建请求配置对象，设置超时时间
            RequestConfig requestConfig = RequestConfig.custom().setSocketTimeout(timeout).setConnectTimeout(timeout).build();
            httpRequestBase.setConfig(requestConfig);//将配置对象设置到请求对象里
            HttpResponse httpResponse = httpClient.execute(httpRequestBase);//请求，并返回响应对象
            if (httpResponse.getStatusLine().getStatusCode() == HttpStatus.SC_OK) {//如果响应是200
                HttpEntity entity = httpResponse.getEntity();//获取响应实体
                return EntityUtils.toString(entity, "utf-8");//使用EntityUtils的静态方法对实体内容进行编码解析
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }
}
```
```java
package httpClient;

import org.apache.http.NameValuePair;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.config.Registry;
import org.apache.http.config.RegistryBuilder;
import org.apache.http.conn.socket.ConnectionSocketFactory;
import org.apache.http.conn.socket.PlainConnectionSocketFactory;
import org.apache.http.conn.ssl.NoopHostnameVerifier;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.impl.conn.PoolingHttpClientConnectionManager;
import org.apache.http.message.BasicNameValuePair;

import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import java.io.IOException;
import java.security.KeyManagementException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by cellargalaxy on 18-3-14.
 */
public class HttpMethod {
    public static void main(String[] args) throws NoSuchAlgorithmException, KeyStoreException, KeyManagementException, IOException {
        getSsl0();
    }
    
    /**
     * 在JDK7及一下会报异常，JDK8倒不会
     * 我使用的是openjdk7，执行以下方法会轮流出现两种错误
     * javax.net.ssl.SSLException: java.lang.RuntimeException: Unexpected error: java.security.InvalidAlgorithmParameterException: the trustAnchors parameter must be non-empty
     * 以及
     * javax.net.ssl.SSLException: Received fatal alert: protocol_version
     * 对于第二个错误的协议版本应该指的是ssl版本的问题，当然我没有设置过于此相关的配置，也不知道怎么搞的，并且这个错误不一定各个https网址都会出现。
     * 但是第一个错误也很是奇怪。这个错误跟网上和我师兄的错误都不一样。。。
     */
    public static void getSsl0() {
        List<NameValuePair> params = new ArrayList<NameValuePair>();
        params.add(new BasicNameValuePair("sex", "man"));
        HttpGet httpGet = HttpClientDeal.createHttpGet("https://hc.apache.org/", params);
        System.out.println(httpGet);
        String result = HttpClientDeal.executeHttpRequestBase(httpGet, 5000);
        System.out.println(result);
    }
    
    /**
     * 使用httpClient访问https网站
     *
     * @throws KeyStoreException
     * @throws NoSuchAlgorithmException
     * @throws KeyManagementException
     * @throws IOException
     */
    public static void getSsl2() throws KeyStoreException, NoSuchAlgorithmException, KeyManagementException, IOException {
        //X509TrustManager好像是java自带，用来检验ssl的接口，实现这些接口，方法体为空就好
        X509TrustManager x509TrustManager = new X509TrustManager() {
            public void checkClientTrusted(X509Certificate[] x509Certificates, String s) throws CertificateException {
                
            }
            
            public void checkServerTrusted(X509Certificate[] x509Certificates, String s) throws CertificateException {
                
            }
            
            public X509Certificate[] getAcceptedIssuers() {
                return new X509Certificate[0];
            }
        };
        
        //指定为应该是最新的TLSv1.2版本
        SSLContext context = SSLContext.getInstance("TLSv1.2");
        //设置X509TrustManager接口
        context.init(null, new TrustManager[]{x509TrustManager}, null);
        //然后构建一个工厂对象
        SSLConnectionSocketFactory sslConnectionSocketFactory = new SSLConnectionSocketFactory(context, NoopHostnameVerifier.INSTANCE);
        
        //不知道是个什么类，看样子是分别指定了http和https的处理
        Registry<ConnectionSocketFactory> registry = RegistryBuilder.<ConnectionSocketFactory>create()
                .register("http", PlainConnectionSocketFactory.INSTANCE)
                .register("https", sslConnectionSocketFactory)
                .build();
        
        //最后又创建了一个不知道什么对象，在创建httpClient时设置进去
        PoolingHttpClientConnectionManager manager = new PoolingHttpClientConnectionManager(registry);
        CloseableHttpClient httpClient = HttpClients.custom().setConnectionManager(manager).build();
        
        HttpGet httpGet = new HttpGet("https://hc.apache.org/");
        String result = HttpClientDeal.executeHttpRequestBase(httpClient, httpGet, 5000);
        System.out.println(result);
    }
    
    /**
     * 使用httpClient post http网站
     */
    public static void post() {
        List<NameValuePair> params = new ArrayList<NameValuePair>();
        params.add(new BasicNameValuePair("sex", "man"));
        HttpPost httpPost = HttpClientDeal.createHttpPost("http://hc.apache.org/", params);
        System.out.println(httpPost);
        httpPost.addHeader("Content-Type", "application/json;charset=utf-8");
        StringEntity stringEntity = new StringEntity("{sex:'man',age:52}", "utf-8");
        stringEntity.setContentEncoding("utf-8");
        stringEntity.setContentType("application/json");
        httpPost.setEntity(stringEntity);
        System.out.println(httpPost);
        String result = HttpClientDeal.executeHttpRequestBase(httpPost, 5000);
        System.out.println(result);
    }
    
    /**
     * 使用httpClient get http网站
     */
    public static void get() {
        List<NameValuePair> params = new ArrayList<NameValuePair>();
        params.add(new BasicNameValuePair("sex", "man"));
        HttpGet httpGet = HttpClientDeal.createHttpGet("http://hc.apache.org/", params);
        System.out.println(httpGet);
        String result = HttpClientDeal.executeHttpRequestBase(httpGet, 5000);
        System.out.println(result);
    }
}
```


# HttpRequestBase
HttpRequestBase是HttpGet和HttpPost的父类，HttpGet，HttpPost对于的是get请求，post请求，那么HttpRequestBase对应就用应该是http请求报文了。我们先回忆一下http请求报文由四部分组成：请求行，请求头，空行和请求体。除去空行，由于头在请求报文和响应报文都有，所以头的部分在别的类里实现。请求体的话由于不是每种请求方法都有，所以请求体也不是在HttpRequestBase里。那么只剩下请求头的请求方法，url和协议版本。请求方法就在子类里了，那最后HttpRequestBase就只剩下url和协议版本了。除此以外，HttpRequestBase还有个请求的配置类，用于配置这个请求。所以httpClient的请求的配置是细颗粒度到每次请求的。
```java
public abstract class HttpRequestBase extends AbstractExecutionAwareRequest implements HttpUriRequest, Configurable {
    private ProtocolVersion version;
    private URI uri;
    private RequestConfig config;
    //。。。
}
```

# BasicHttpResponse
BasicHttpResponse是HttpResponse接口的一个实现类，对于请求报文。同样回忆一下响应报文有状态行，响应头，空行和响应体。响应体跟请求报文的请求体一起作为一个实体类，BasicHttpResponse把实体对象作为成员变量。响应头在别的地方实现了，还有状态行。因此BasicHttpResponse就是这个样：
```java
public class BasicHttpResponse extends AbstractHttpMessage implements HttpResponse {
    private StatusLine statusline;
    private ProtocolVersion ver;
    private int code;
    private String reasonPhrase;
    private HttpEntity entity;
    private final ReasonPhraseCatalog reasonCatalog;
    private Locale locale;

    public BasicHttpResponse(StatusLine statusline, ReasonPhraseCatalog catalog, Locale locale) {
        this.statusline = (StatusLine)Args.notNull(statusline, "Status line");
        this.ver = statusline.getProtocolVersion();
        this.code = statusline.getStatusCode();
        this.reasonPhrase = statusline.getReasonPhrase();
        this.reasonCatalog = catalog;
        this.locale = locale;
    }
    //。。。
}
```

# HttpGet,HttpPost
我们看见HttpGet跟HttpPost的父类并不一样。看名字可以猜到，HttpEntityEnclosingRequestBase继承与HttpRequestBase，比HttpRequestBase，HttpEntityEnclosingRequestBase多了实体的内容。
```java
public class HttpGet extends HttpRequestBase {
    public static final String METHOD_NAME = "GET";
    //。。。
}
public class HttpPost extends HttpEntityEnclosingRequestBase {
    public static final String METHOD_NAME = "POST";
    //。。。
}
```

# AbstractHttpMessage
说了这么久头是在别的地方实现的，是在AbstractHttpMessage里的
```java
public abstract class AbstractHttpMessage implements HttpMessage {
    protected HeaderGroup headergroup;//全部的头信息
    /** @deprecated */
    @Deprecated
    protected HttpParams params;//这个没研究

    /** @deprecated */
    @Deprecated
    protected AbstractHttpMessage(HttpParams params) {
        this.headergroup = new HeaderGroup();
        this.params = params;
    }
    //。。。
}
```

# RequestConfig
RequestConfig的创建方法使用了创建者模式。
```java
RequestConfig requestConfig = RequestConfig.custom().setSocketTimeout(timeout).setConnectTimeout(timeout).build();
```
```java
public class RequestConfig implements Cloneable {
    public static final RequestConfig DEFAULT = (new RequestConfig.Builder()).build();//默认请求配置
    private final boolean expectContinueEnabled;
    private final HttpHost proxy;//http请求使用的代理
    private final InetAddress localAddress;
    private final boolean staleConnectionCheckEnabled;
    private final String cookieSpec;
    private final boolean redirectsEnabled;
    private final boolean relativeRedirectsAllowed;
    private final boolean circularRedirectsAllowed;
    private final int maxRedirects;
    private final boolean authenticationEnabled;
    private final Collection<String> targetPreferredAuthSchemes;
    private final Collection<String> proxyPreferredAuthSchemes;
    private final int connectionRequestTimeout;//超时
    private final int connectTimeout;//超时
    private final int socketTimeout;//超时
    private final boolean contentCompressionEnabled;
    //。。。
}
```

参考文献

[https://hc.apache.org/httpcomponents-client-ga/quickstart.html](https://hc.apache.org/httpcomponents-client-ga/quickstart.html)

[Java HttpClient无证书访问HTTPS请求](https://github.com/imaidev/imaidev.github.io/wiki/Java-HttpClient%E6%97%A0%E8%AF%81%E4%B9%A6%E8%AE%BF%E9%97%AEHTTPS%E8%AF%B7%E6%B1%82 "Java HttpClient无证书访问HTTPS请求")

[轻松把玩HttpClient之配置ssl，采用绕过证书验证实现](https://www.kancloud.cn/longxuan/httpclient-arron/117503 "轻松把玩HttpClient之配置ssl，采用绕过证书验证实现")

[HTTPCLIENT执行HTTPS请求与分析](https://www.debugrun.com/a/8QabvU6.html "HTTPCLIENT执行HTTPS请求与分析")