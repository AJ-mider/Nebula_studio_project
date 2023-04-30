package com.fudan.productsupport.utils.Exception;

/**
 * @ClassName IErrorCode
 * Description TODO 封装API的错误码，参考github Mall项目
 * @Author WillemGavin
 * @Date 2021/3/21 13:29
 * Version 0.0.1
 */
public interface IErrorCode {
    long getCode();

    String getMessage();
}
