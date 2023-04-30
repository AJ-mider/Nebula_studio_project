package com.fudan.productsupport.dao.mongodb;

import com.fudan.productsupport.entity.mongodb.ERModuleEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

/**
 * @ClassName ERModuleRepository
 * Description TODO
 * @Author WillemGavin
 * @Date 2021/8/18 10:31
 * Version 0.0.1
 */
@Repository
public interface ERModuleRepository extends MongoRepository<ERModuleEntity, String> {
}
