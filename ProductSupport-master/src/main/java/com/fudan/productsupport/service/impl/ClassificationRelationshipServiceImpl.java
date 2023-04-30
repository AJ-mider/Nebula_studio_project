package com.fudan.productsupport.service.impl;

import com.fudan.productsupport.dao.mongodb.ClassificationRelationshipRepository;
import com.fudan.productsupport.entity.mongodb.ClassificationRelationshipEntity;
import com.fudan.productsupport.service.ClassificationRelationshipService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import java.util.List;

/**
 * @ClassName RoleRelationshipServiceImpl
 * Description TODO
 * @Author WillemGavin
 * @Date 2022/5/13 22:16
 * Version 0.0.1
 */
@Service
@ResponseBody
@Slf4j
public class ClassificationRelationshipServiceImpl implements ClassificationRelationshipService {

    @Resource
    private ClassificationRelationshipRepository classificationRelationshipRepository;

    /**
     * TODO 保存角色关联信息
     * @param roleEntity
     */
    @Override
    public void save(ClassificationRelationshipEntity roleEntity) {
        log.info("保存角色关联结果:" + roleEntity.getTagName());
        classificationRelationshipRepository.save(roleEntity);
    }

    /**
     * TODO 删除角色关联信息
     * @param ids
     */
    @Override
    public void delete(List<String> ids) {
        log.info("删除记录:" + ids);
        for(String id : ids){
            classificationRelationshipRepository.deleteById(id);
        }
    }

    /**
     * TODO 获取所有角色关联信息
     * @param pageRequest
     * @return
     */
    @Override
    public Page<ClassificationRelationshipEntity> queryAll(PageRequest pageRequest) {
        log.info("获取所有角色关联信息");
        return classificationRelationshipRepository.findAll(pageRequest);
    }

    /**
     * TODO 查询角色关联信息
     * @param classificationRelationshipEntity
     * @param pageRequest
     * @return
     */
    @Override
    public Page<ClassificationRelationshipEntity> query(ClassificationRelationshipEntity classificationRelationshipEntity, PageRequest pageRequest) {
        log.info("查询角色关联信息：" + classificationRelationshipEntity.toString());
        ExampleMatcher matcher = ExampleMatcher.matching()
                .withStringMatcher(ExampleMatcher.StringMatcher.CONTAINING); //改变字符串为：模糊查询
        Example<ClassificationRelationshipEntity> example = Example.of(classificationRelationshipEntity, matcher);
        return classificationRelationshipRepository.findAll(example, pageRequest);
    }

    /**
     *
     * @param classificationRelationshipEntity
     * @return
     */
    @Override
    public List<ClassificationRelationshipEntity> query(ClassificationRelationshipEntity classificationRelationshipEntity){
        log.info("查询类别的关联信息：" + classificationRelationshipEntity.toString());
        ExampleMatcher matcher = ExampleMatcher.matching()
                .withStringMatcher(ExampleMatcher.StringMatcher.CONTAINING); //改变字符串为：模糊查询
        Example<ClassificationRelationshipEntity> example = Example.of(classificationRelationshipEntity, matcher);
        return classificationRelationshipRepository.findAll(example);
    }
}
