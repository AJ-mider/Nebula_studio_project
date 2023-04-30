package com.fudan.productsupport.service.impl;

import com.fudan.productsupport.dao.mongodb.ClassificationRepository;
import com.fudan.productsupport.entity.mongodb.ClassificationEntity;
import com.fudan.productsupport.service.ClassificationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import java.util.List;

/**
 * @ClassName RoleServiceImpl
 * Description TODO
 * @Author WillemGavin
 * @Date 2022/5/13 21:46
 * Version 0.0.1
 */
@Service
@ResponseBody
@Slf4j
public class ClassificationServiceImpl implements ClassificationService {
    @Resource
    private ClassificationRepository classificationRepository;

    /**
     * TODO 保存类别信息
     * @param classificationEntity
     */
    @Override
    public void save(ClassificationEntity classificationEntity) {
        log.info("保存类别结果:" + classificationEntity.getClassification());
        classificationRepository.save(classificationEntity);
    }

    /**
     * TODO 删除角色
     * @param ids
     */
    @Override
    public void delete(List<String> ids) {
        log.info("删类别:" + ids);
        for(String id : ids){
            classificationRepository.deleteById(id);
        }
    }

    /**
     * TODO 获取所有角色
     * @return
     */
    @Override
    public List<ClassificationEntity> getClassification() {
        return classificationRepository.findAll();
    }
}
