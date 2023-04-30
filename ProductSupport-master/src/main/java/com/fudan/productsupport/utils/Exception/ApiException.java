package com.fudan.productsupport.utils.Exception;

/**
 * @ClassName ApiException
 * Description TODO
 * @Author WillemGavin
 * @Date 2021/3/21 13:36
 * Version 0.0.1
 */
public class ApiException extends RuntimeException {
    private IErrorCode errorCode;

    public ApiException(IErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }

    public ApiException(String message) {
        super(message);
    }

    public ApiException(Throwable cause) {
        super(cause);
    }

    public ApiException(String message, Throwable cause) {
        super(message, cause);
    }

    public IErrorCode getErrorCode() {
        return errorCode;
    }
}
