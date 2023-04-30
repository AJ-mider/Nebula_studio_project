package com.fudan.productsupport.dao.mongodb;

import com.fudan.productsupport.entity.mongodb.ClassificationEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

/**
 * @ClassName RoleRepository
 * Description TODO
 * @Author WillemGavin
 * @Date 2022/5/13 21:50
 * Version 0.0.1
 */
@Repository
public interface ClassificationRepository extends MongoRepository<ClassificationEntity, String> {
}
