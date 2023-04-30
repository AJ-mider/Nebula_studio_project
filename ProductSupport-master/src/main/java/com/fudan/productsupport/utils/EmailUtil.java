package com.fudan.productsupport.utils;

import com.alibaba.fastjson.JSONObject;
import com.fudan.productsupport.entity.mongodb.VerifyEntity;
import com.fudan.productsupport.entity.mongodb.VerifyRecordEntity;
import com.fudan.productsupport.service.VerifyService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;

/**
 * @ClassName EmailUtil
 * Description TODO
 * @Author WillemGavin
 * @Date 2021/10/17 11:10
 * Version 0.0.1
 */
@Component
@Slf4j
public class EmailUtil {
    @Resource
    private JavaMailSender javaMailSender;

    @Value("${spring.mail.username}")
    private String from;

    /**
     * TODO 邮件发送工具
     * @param to
     * @param mailText
     */
    public void sendMail(String to, String mailText) {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom(from);
        message.setTo(to);
        // 设置邮件主题
        message.setSubject("产品生命周期校验异常通知");
        message.setText(mailText);
        javaMailSender.send(message);
    }
}
