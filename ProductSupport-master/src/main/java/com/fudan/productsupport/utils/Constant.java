package com.fudan.productsupport.utils;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * @ClassName Constant
 * Description TODO 常量集
 * @Author WillemGavin
 * @Date 2021/6/23 16:22
 * Version 0.0.1
 */
@Component
public class Constant {
    /**
     *  不使用用该字段
     */
    public static final int NOT_USE = -1;

    /**
     *  降序排序
     */
    public static final String DESC = "DESC";


    /**
     * 手动运行
     */
    public static final String MANUAL = "-1";

    /**
     * topic的基础名称，便于listen监听
     */
    public static final String TOPIC_FIRST_NAME = "connector";

    /**
     * 发送校验规则数据的topic
     */
    public static final String VERIFY_DATA = "verify_data";

    /**
     * 接收校验规则结果的topic
     */
    public static final String VERIFY_RESULT = "verify_result";

    /**
     * 连接器类型
     */
    public enum ConnectorType{
        /**
         * RestFul 连接器
         */
        RESTFUL(0),

        /**
         * Kafka连接器
         */
        KAFKA(1);

        private final int value;

        ConnectorType(int value){
            this.value = value;
        }

        public int getValue(){
            return value;
        }
    }

    /**
     * 更新类型
     */
    public enum UpdateType{
        /**
         * 全量更新
         */
        FULL(0),

        /**
         * 增量更新
         */
        INCREMENT(1);

        private final int value;

        UpdateType(int value){
            this.value = value;
        }

        public int getValue(){
            return value;
        }
    }

    /**
     * 通知方式
     */
    public enum InformType{
        /**
         * 仅标注
         */
        REMARK(0),

        /**
         * 邮件
         */
        EMAIL(1);

        private final int value;

        InformType(int value){
            this.value = value;
        }

        public int getValue(){
            return value;
        }
    }

    /**
     * 连接状态
     */
    public enum ConnectorStatus{
        /**
         * 未知状态（未访问）
         */
        UNKONW(0),

        /**
         * 正常
         */
        NORMAL(1),

        /**
         * 异常
         */
        EXCEPTION(2),

        /**
         * 运行中
         */
        RUNNING(3);


        private final int value;

        ConnectorStatus(int value){
            this.value = value;
        }

        public int getValue(){
            return value;
        }
    }

    /**
     * 模型类型
     */
    public enum ModuleType{
        /**
         * 节点
         */
        ENTITY(0),

        /**
         * 关系
         */
        RELATION(1);

        private final int value;

        ModuleType(int value){
            this.value = value;
        }

        public int getValue(){
            return value;
        }
    }

    /**
     * nebular数据类型
     */
    public enum NebularDataType{
        /**
         * 整形
         */
        INT("int"),

        /**
         * 浮点型
         */
        DOUBLE("double"),

        /**
         * 布尔型
         */
        BOOL("bool"),

        /**
         * 字符串
         */
        STRING("string"),

        /**
         * 日期
         */
        DATE("date"),

        /**
         * 时间
         */
        TIME("time"),

        /**
         * 日期和时间
         */
        DATETIME("datetime"),

        /**
         * 时间戳
         */
        TIMESTAMP("timestamp");

        private final String value;

        NebularDataType(String value) {
            this.value = value;
        }

        public String getValue(){
            return value;
        }
    }
}
