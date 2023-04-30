//package com.fudan.productsupport.utils;
//
//
//import com.alibaba.fastjson.JSONObject;
//import org.apache.http.Header;
//import org.apache.http.HttpHeaders;
//import org.apache.http.HttpResponse;
//import org.apache.http.client.methods.HttpGet;
//import org.apache.http.client.methods.HttpPost;
//import org.apache.http.client.utils.URIBuilder;
//import org.apache.http.entity.ContentType;
//import org.apache.http.entity.StringEntity;
//import org.apache.http.impl.client.CloseableHttpClient;
//import org.apache.http.impl.client.HttpClientBuilder;
//import org.apache.http.util.EntityUtils;
//import org.springframework.stereotype.Component;
//
//import java.io.IOException;
//import java.io.UnsupportedEncodingException;
//import java.net.URI;
//import java.net.URISyntaxException;
//import java.util.Map;
//
///**
// * @ClassName HttpClientUtill
// * Description TODO
// * @Author WillemGavin
// * @Date 2021/6/28 10:21
// * Version 0.0.1
// */
//@Component
//public class HttpClientUtill {
//
//    private static CloseableHttpClient httpClient;
//
//    /**
//     * 实现 get方式访问接口
//     * @param url
//     * @param header
//     * @param param
//     * @return
//     * @throws URISyntaxException
//     * @throws IOException
//     */
//    public static JSONObject doGet(String url, JSONObject header , JSONObject param) throws URISyntaxException, IOException {
//        httpClient = HttpClientBuilder.create().build();
//
//        HttpGet httpGet = new HttpGet(getUri(url, param));
//
//        //添加header
//        if(header != null && !header.isEmpty())
//            for(Map.Entry<String, Object> entry : header.entrySet())
//                httpGet.addHeader(entry.getKey(), entry.getValue().toString());
//
//        HttpResponse  response = httpClient.execute(httpGet);
//        Header[] headers = response.getAllHeaders();
//
//        //获取结果
//        return JSONObject.parseObject(EntityUtils.toString(response.getEntity()));
//    }
//
//    /**
//     * 实现post方式访问接口
//     * @param url
//     * @param header
//     * @param param
//     * @param body
//     * @return
//     * @throws IOException
//     * @throws URISyntaxException
//     */
//    public static JSONObject doPost(String url, JSONObject header , JSONObject param, JSONObject body) throws UnsupportedEncodingException {
//        httpClient = HttpClientBuilder.create().build();
//
//        HttpPost httpPost = null;
//        try {
//            httpPost = new HttpPost(getUri(url, param));
//        } catch (URISyntaxException uriSyntaxException) {
//            uriSyntaxException.printStackTrace();
//        }
//
//        //添加header
//        if(header != null && !header.isEmpty())
//            for(Map.Entry<String, Object> entry : header.entrySet())
//                httpPost.addHeader(entry.getKey(), entry.getValue().toString());
//
//        httpPost.setHeader("Content-Type", "application/json");
//        //添加body
//        StringEntity stringEntity = new StringEntity(body.toString());
//        stringEntity.setContentEncoding("UTF-8");
//        stringEntity.setContentType("application/json");
//        httpPost.setEntity(stringEntity);
//
//        HttpResponse  response = null;
//        String result = null;
//        try {
//            result = EntityUtils.toString(httpClient.execute(httpPost).getEntity());
//        } catch (IOException e) {
//            e.printStackTrace();
//        }
//        //获取结果
//        return JSONObject.parseObject(result);
//    }
//
//    /**
//     * 生成带param的url
//     * @param url
//     * @param param
//     * @return
//     * @throws URISyntaxException
//     */
//    private static URI getUri(String url, JSONObject param) throws URISyntaxException {
//        URIBuilder uriBuilder = new URIBuilder(url);
//        //添加params
//        if(param != null && !param.isEmpty())
//            for(Map.Entry<String, Object> entry : param.entrySet()){
//                uriBuilder.setParameter(entry.getKey(), entry.getValue().toString());
//            }
//        return uriBuilder.build();
//    }
//}
