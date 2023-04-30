package com.fudan.productsupport.dao.mongodb;

import com.fudan.productsupport.entity.mongodb.ClassificationRelationshipEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

/**
 * @ClassName RoleRelationshipRepository
 * Description TODO
 * @Author WillemGavin
 * @Date 2022/5/13 22:14
 * Version 0.0.1
 */
@Repository
public interface ClassificationRelationshipRepository extends MongoRepository<ClassificationRelationshipEntity, String> {
}
