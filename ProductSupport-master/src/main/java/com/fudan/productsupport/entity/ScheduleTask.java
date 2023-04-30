package com.fudan.productsupport.entity;

import com.fudan.productsupport.entity.mongodb.ConnectorEntity;
import com.fudan.productsupport.service.ConnectorService;
import com.fudan.productsupport.utils.CommonResult;
import com.fudan.productsupport.utils.Constant;
import com.fudan.productsupport.utils.Exception.ResultCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * @ClassName ScheduleTask
 * Description TODO 定时任务线程类
 * @Author WillemGavin
 * @Date 2021/8/1 14:55
 * Version 0.0.1
 */
@Slf4j
public class ScheduleTask implements Runnable{
    private static final int TIMEOUT = 30000;

    private String id;
    private ConnectorService connectorService;
    private String keyword;

    public String getId() {
        return id;
    }

    /**
     *
     * @param id
     * @param connectorService
     * @param keyword
     */
    public ScheduleTask(String id, ConnectorService connectorService, String keyword) {
        this.id = id;
        this.connectorService = connectorService;
        this.keyword = keyword;
    }

    @Override
    public void run() {
        ConnectorEntity connectorEntity =  connectorService.queryById(id);
        if(!connectorEntity.getCron().equals("-1")){
            CommonResult commonResult = connectorService.request(id);
            // 访问成功
            if (commonResult.getCode() == ResultCode.SUCCESS.getCode()){
                connectorEntity.setStatus(Constant.ConnectorStatus.RUNNING.getValue());
            }else{
                // 出现异常，则暂停定时任务
                connectorService.stop(id);
            }
            // 更新连接器状态
            connectorService.update(connectorEntity);
        }

    }
}
