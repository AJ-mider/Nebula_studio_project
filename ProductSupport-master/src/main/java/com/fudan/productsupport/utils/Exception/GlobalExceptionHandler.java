package com.fudan.productsupport.utils.Exception;

import com.fudan.productsupport.utils.CommonResult;
import groovy.lang.GroovyRuntimeException;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.conn.HttpHostConnectException;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

import java.io.IOException;
import java.net.ConnectException;
import java.net.URISyntaxException;

/**
 * @ClassName ExceptionHandlerAdvice
 * Description TODO 异常处理器
 * @Author WillemGavin
 * @Date 2021/3/10 23:10
 * Version 0.0.1
 */
@ControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ResponseBody
    @ExceptionHandler(value = ApiException.class)
    public CommonResult handleApiException(ApiException e) {
        if (e.getErrorCode() != null) {
            return CommonResult.failed(e.getErrorCode());
        }
        return CommonResult.failed(e.getMessage());
    }

    @ResponseBody
    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    public CommonResult handleValidException(MethodArgumentNotValidException e) {
        BindingResult bindingResult = e.getBindingResult();
        String message = null;
        if (bindingResult.hasErrors()) {
            FieldError fieldError = bindingResult.getFieldError();
            if (fieldError != null) {
                message = fieldError.getField()+fieldError.getDefaultMessage();
            }
        }
        return CommonResult.validateFailed(message);
    }

    @ResponseBody
    @ExceptionHandler(value = BindException.class)
    public CommonResult handleBindException(BindException bindException) {
        BindingResult bindingResult = bindException.getBindingResult();
        String message = null;
        if (bindingResult.hasErrors()) {
            FieldError fieldError = bindingResult.getFieldError();
            if (fieldError != null) {
                message = fieldError.getField()+fieldError.getDefaultMessage();
            }
        }
        return CommonResult.validateFailed(message);
    }

//    /**
//     * 处理HttpClientURI错误异常
//     * @param e
//     * @return
//     */
//    @ResponseBody
//    @ExceptionHandler(value = URISyntaxException.class)
//    public CommonResult handleURISyntaxException(URISyntaxException e){
//        log.error("message" + e.getMessage());
//        log.error("reason" + e.getReason());
//        return CommonResult.failed("接口异常！");
//    }

    /**
     * 处理IO异常
     * @param e
     * @return
     */
    @ResponseBody
    @ExceptionHandler(value = IOException.class)
    public CommonResult handleIOException(IOException e){
        log.error("message:" + e.getMessage());
        log.error("cause:" + e.getCause());
        return CommonResult.failed("连接器接口访问异常！");
    }

//    /**
//     * 处理httpClient请求访问异常
//     * @param e
//     * @return
//     */
//    @ResponseBody
//    @ExceptionHandler(value = HttpHostConnectException.class)
//    public CommonResult handleHttpException(HttpHostConnectException e){
//        log.error("message:" + e.getMessage());
//        log.error("cause:" + e.getCause());
//        return CommonResult.failed("接口拒绝访问！");
//    }

    /**
     * 处理RestAssured格式异常
     * @param e
     * @return
     */
    @ResponseBody
    @ExceptionHandler(value = GroovyRuntimeException.class)
    public CommonResult handleGroovyRuntimeException(GroovyRuntimeException e){
        log.error("message:" + e.getMessage());
        log.error("cause:" + e.getCause());
        return CommonResult.failed("数据异常！");
    }

//    /**
//     * 处理Connector无法访问
//     * @param e
//     * @return
//     */
//    @ResponseBody
//    @ExceptionHandler(value = ConnectException.class)
//    public CommonResult handleConnectExceptionn(ConnectException e){
//        log.error("message:" + e.getMessage());
//        log.error("cause:" + e.getCause());
//        return CommonResult.failed("拒绝访问！");
//    }

}