package com.fudan.productsupport.utils;

import com.alibaba.fastjson.JSONObject;
import com.fudan.productsupport.entity.mongodb.VerifyEntity;
import com.fudan.productsupport.entity.mongodb.VerifyRecordEntity;
import com.fudan.productsupport.service.VerifyService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import javax.annotation.Resource;

import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class EmailUtilTest {

    @Resource
    private VerifyService verifyService;

    @Resource
    private EmailUtil emailUtil;
    @Test
    void sendMail() {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("tag", "board");
        jsonObject.put("id", "board_1");
        jsonObject.put("ruleId", "616852fe323f575cf9389db5");
        VerifyEntity verifyEntity = verifyService.queryById("616852fe323f575cf9389db5");
        VerifyRecordEntity verifyRecordEntity = new VerifyRecordEntity("board_1", "chip_1", "board", new Date(), "校验失败");

        StringBuilder mailMsg = new StringBuilder();
        mailMsg.append("产品负责人：\n\t你好!你所负责的").append(verifyRecordEntity.getTag());
        mailMsg.append("类型的产品，编号为\"").append(verifyRecordEntity.getEntityId1()).append("\"的产品");
        mailMsg.append("在《产品全生命系统》中校验结果为：异常！\n");
        mailMsg.append("\t校验对象：").append(verifyEntity.getTag1()).append(".").append(verifyEntity.getProperty1()).append("，");
        mailMsg.append(verifyEntity.getTag2()).append(".").append(verifyEntity.getProperty2()).append("\n");
        mailMsg.append("\t校验规则：").append(verifyEntity.getTag1()).append(".").append(verifyEntity.getProperty1());
        mailMsg.append(" ").append(verifyEntity.getStandard()).append(" ");
        mailMsg.append(verifyEntity.getTag2()).append(".").append(verifyEntity.getProperty2()).append("\n");
        mailMsg.append("\t校验时间：").append(verifyRecordEntity.getDate()).append("\n");
        mailMsg.append("【产品质量管理部】");

        emailUtil.sendMail("wangg20@fudan.edu.cn", mailMsg.toString());
    }
}