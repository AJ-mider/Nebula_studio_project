package com.fudan.productsupport.service.impl;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.fudan.productsupport.dao.mongodb.VerifyRecordRepository;
import com.fudan.productsupport.entity.mongodb.VerifyEntity;
import com.fudan.productsupport.entity.mongodb.VerifyRecordEntity;
import com.fudan.productsupport.service.VerifyRecordService;
import com.fudan.productsupport.service.VerifyService;
import com.fudan.productsupport.utils.Constant;
import com.fudan.productsupport.utils.EmailUtil;
import com.fudan.productsupport.utils.Exception.ApiException;
import com.fudan.productsupport.utils.NebularGraphUtil;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * @ClassName VerifyRecordService
 * Description TODO
 * @Author WillemGavin
 * @Date 2021/10/16 16:59
 * Version 0.0.1
 */
@Service
@ResponseBody
@Slf4j
public class VerifyRecordServiceImpl implements VerifyRecordService {
    @Resource
    private VerifyRecordRepository verifyRecordRepository;
    @Resource
    private VerifyService verifyService;
    @Resource
    private EmailUtil emailUtil;
    @Resource
    private NebularGraphUtil nebularGraphUtil;

    /**
     * TODO 保存校验结果
     * @param verifyRecordEntity
     */
    @Override
    public void save(VerifyRecordEntity verifyRecordEntity) {
        log.info("保存校验结果:" + verifyRecordEntity.getEntityId1());
        verifyRecordRepository.save(verifyRecordEntity);
    }

    /**
     * TODO 获取所有校验结果
     * @param pageRequest
     * @return
     */
    @Override
    public Page<VerifyRecordEntity> queryAll(PageRequest pageRequest) {
        log.info("获取所有校验结果");
        return verifyRecordRepository.findAll(pageRequest);
    }

    /**
     * TODO 删除校验结果
     * @param ids
     */
    @Override
    public void delete(List<String> ids) {
        log.info("删除校验结果:" + ids);
        for(String id : ids){
            verifyRecordRepository.deleteById(id);
        }
    }

    /**
     * TODO 接收校验结果
     * @param record
     */
    @Override
    @KafkaListener(topics = Constant.VERIFY_RESULT)
    public void receiveVerifyData(ConsumerRecord<?, ?> record) {
        log.info("topic=" +record.topic() + "timestamp" + record.timestamp() + ";offset=" + record.offset());
        JSONObject jsonObject = JSON.parseObject(record.value().toString());
        VerifyEntity verifyEntity = verifyService.queryById(jsonObject.getString("ruleId"));

        VerifyRecordEntity verifyRecordEntity = new VerifyRecordEntity(jsonObject.getString("id1"),
                jsonObject.getString("id2"), jsonObject.getString("tag"), new Date(record.timestamp()), "");

        StringBuilder informMsg = new StringBuilder();
        informMsg.append("异常已标注！");

        // 需要发送邮件
        if(verifyEntity.getType() == Constant.InformType.EMAIL.getValue()){
            StringBuilder mailMsg = new StringBuilder();
            mailMsg.append("产品负责人：\n\t你好!你所负责的").append(verifyRecordEntity.getTag());
            mailMsg.append("类型的产品，编号为\"").append(verifyRecordEntity.getEntityId1()).append("\",");
            mailMsg.append("\"").append(verifyRecordEntity.getEntityId2()).append("\"的产品");
            mailMsg.append("在《产品全生命系统》中校验结果为：异常！\n");
            mailMsg.append("\t校验对象：").append(verifyEntity.getTag1()).append(".").append(verifyEntity.getProperty1()).append("，");
            mailMsg.append(verifyEntity.getTag2()).append(".").append(verifyEntity.getProperty2()).append("\n");
            mailMsg.append("\t校验规则：").append(verifyEntity.getTag1()).append(".").append(verifyEntity.getProperty1());
            mailMsg.append(" ").append(verifyEntity.getStandard()).append(" ");
            mailMsg.append(verifyEntity.getTag2()).append(".").append(verifyEntity.getProperty2()).append("\n");
            mailMsg.append("\t校验时间：").append(verifyRecordEntity.getDate()).append("\n");
            mailMsg.append("【产品质量管理部】");

            List<String> emails = new ArrayList<>();
            if(this.sendEmail(verifyEntity.getEmail(), mailMsg.toString()) != null){
                emails.add("邮箱" + verifyEntity.getEmail() + "发送失败！");
            }

            if(!verifyEntity.getEmailProperty1().isEmpty()) {
                try {
                    String email = nebularGraphUtil.getVertiexProperty(verifyRecordEntity.getEntityId1(), verifyEntity.getEmailProperty1()).toString();
                    if (this.sendEmail(email, mailMsg.toString()) != null) {
                        emails.add("邮箱" + email + "发送失败！");
                    }
                }catch (Exception e){
                    emails.add("节点" + verifyRecordEntity.getEntityId1() + "邮箱获取失败！");
                    e.printStackTrace();
                }
            }

            if(!verifyEntity.getEmailProperty1().isEmpty()) {
                try {
                    String email = nebularGraphUtil.getVertiexProperty(verifyRecordEntity.getEntityId2(), verifyEntity.getEmailProperty2()).toString();
                    if (this.sendEmail(email, mailMsg.toString()) != null) {
                        emails.add("邮箱" + email + "发送失败！");
                    }
                }catch (Exception e){
                    emails.add("节点" + verifyRecordEntity.getEntityId1() + "邮箱获取失败！");
                    e.printStackTrace();
                }
            }

            if(!emails.isEmpty()){
                for(String s : emails){
                    informMsg.append(s);
                }
            }else {
                informMsg.append("邮件发送成功！");
            }
        }

        verifyRecordEntity.setInform(informMsg.toString());
        // 保持校验结果
        this.save(verifyRecordEntity);
    }

    String sendEmail(String email, String mailMsg){
        String result = null;
        if(email != null && !email.isEmpty()){
            try{
                emailUtil.sendMail(email, mailMsg);
            }catch (Exception e){
                log.info("发送给" + email + "的邮件失败");
                e.printStackTrace();
                result = email;
            }
        }
        return result;
    }
}
