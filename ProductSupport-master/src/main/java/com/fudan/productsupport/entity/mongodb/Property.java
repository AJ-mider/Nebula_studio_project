package com.fudan.productsupport.entity.mongodb;

import lombok.Data;

/**
 * @ClassName Property
 * Description TODO
 * @Author WillemGavin
 * @Date 2021/8/18 15:06
 * Version 0.0.1
 */
@Data
public class Property{
    // 属性名
    private String name;
    // 属性类型
    private String type;
    // 默认值
    private Object defaultVal;
}

