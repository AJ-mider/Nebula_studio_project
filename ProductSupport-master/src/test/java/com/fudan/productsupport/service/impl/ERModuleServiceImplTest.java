package com.fudan.productsupport.service.impl;

import com.fudan.productsupport.dao.mongodb.ERModuleRepository;
import com.fudan.productsupport.entity.mongodb.ERModuleEntity;
import com.fudan.productsupport.service.ERModuleService;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import javax.annotation.Resource;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Slf4j
class ERModuleServiceImplTest {

    @Resource
    private ERModuleRepository erModuleRepository;
    @Resource
    private ERModuleService erModuleService;

    @Test
    void query() {
        List<ERModuleEntity> erModuleEntities = erModuleRepository.findAll();
        log.info(erModuleEntities.toString());
    }

    @Test
    void delete(){
        List<ERModuleEntity> erModuleEntities = erModuleRepository.findAll();
        for(ERModuleEntity erModuleEntity:erModuleEntities){
            erModuleRepository.delete(erModuleEntity);
        }
    }
}