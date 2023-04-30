package com.fudan.productsupport.service.impl;

import com.alibaba.fastjson.JSONObject;
import com.fudan.productsupport.dao.mongodb.ConnectorRepository;
import com.fudan.productsupport.form.PageForm;
import com.fudan.productsupport.entity.mongodb.ConnectorEntity;
import com.fudan.productsupport.form.ConnectorForm;
import com.fudan.productsupport.service.ConnectorService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;

import java.util.ArrayList;
import java.util.List;

@SpringBootTest
class ConnectorServiceImplTest {

    @Autowired
    private ConnectorService connectorService;

    @Autowired
    private ConnectorRepository connectorRepository;

    // 测试成功 2021.06.20
    @Test
    void save() {
        ConnectorForm connectorForm = new ConnectorForm();
        connectorForm.setName("连接器1");
        connectorForm.setUri("http://huawei.com");
        connectorForm.setCron("0 0 0 0/7 * * *");
        connectorForm.setRemark("");
        connectorForm.setType(0);
        connectorService.save(connectorForm);
        System.out.println("save Connector success!");
    }

    // 测试成功 2021.06.20
    @Test
    void queryById() {
//        60cf0a3c58244406f7c72b47
        ConnectorEntity result = connectorRepository.findById("60cf0a3c58244406f7c72b47").get();
        System.out.println(result.toString());
    }

    // 测试成功 2021.06.23
    @Test
    void queryAll(){
        PageForm pageForm = new PageForm(1,10,"id", "DESC");
        Page<ConnectorEntity> list = connectorService.queryAll(pageForm.getPageRequest());
        System.out.println(list);
    }

    // 测试成功 2021.06.25
    @Test
    void query(){
        PageForm pageForm = new PageForm(1,10,"id", "DESC");
//        ConnectorEntity connectorEntity = new ConnectorEntity("http://huawei.com", 0, 0, "连接器1", 7);
        ConnectorEntity connectorEntity = new ConnectorEntity(0,"huawei");
        Page<ConnectorEntity> list = connectorService.query(connectorEntity, pageForm.getPageRequest());
        System.out.println(list);
    }

    // 测试成功 2021.06.23
    @Test
    void delete(){
        List<String> ids = new ArrayList<>();
        PageForm pageForm = new PageForm(1,3,"id", "DESC");
        Page<ConnectorEntity> connectorEntities = connectorService.queryAll(pageForm.getPageRequest());
        for (ConnectorEntity e: connectorEntities) {
            ids.add(e.getId());
        }
        connectorService.delete(ids);
    }

    // 测试成功 2021.06.26
    @Test
    void update(){
        ConnectorEntity connectorEntity = new ConnectorEntity( 0, "测试connector");
        connectorEntity.setUri("http://localhost:8080/connector/list");
        connectorEntity.setCron("0 0 0 0/7 0 0 0");
        connectorEntity.setHttpMethod("GET");
        connectorEntity.setId("6100fa8a15914e703fbd3874");
        JSONObject params = new JSONObject();
        params.put("page", 1);
        params.put("rows", 10);
        params.put("sortBy", "name");
        params.put("sortDirection", "DESC");
        connectorEntity.setParams(params);
        connectorService.update(connectorEntity);
    }

    //
    @Test
    void request(){
        connectorService.request("610b9ddb34ba5b3cbc369094");
    }

    @Test
    void run(){
        connectorService.run("615aaeacf33e370d636a717c", "0/5 * * * * ?");
    }

    @Test
    void stop(){
        connectorService.stop("615aaeacf33e370d636a717c");
    }
}