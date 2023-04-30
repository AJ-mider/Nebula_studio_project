package com.fudan.productsupport.service;

import com.alibaba.fastjson.JSONObject;
import com.fudan.productsupport.entity.mongodb.VerifyEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import java.util.List;

/**
 * @ClassName VerifyService
 * Description TODO
 * @Author WillemGavin
 * @Date 2021/10/11 15:10
 * Version 0.0.1
 */
public interface VerifyService {
    //保存校验规则
    void save(VerifyEntity verifyEntity);

    //查看校验规则
    Page<VerifyEntity> query(PageRequest pageRequest);

    //根据id查校验规则
    VerifyEntity queryById(String id);

    //通过tag查询校验规则
    Page<VerifyEntity> queryByTag(String tag, PageRequest pageRequest);

    //通过tag查询校验规则
    List<VerifyEntity> queryByTag(String tag);

    //删除记录
    void delete(List<String> ids);

    //发送需校验的数据
    void sendVerifyData(JSONObject data);
}
