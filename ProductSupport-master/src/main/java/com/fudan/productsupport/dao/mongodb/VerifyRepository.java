package com.fudan.productsupport.dao.mongodb;

import com.fudan.productsupport.entity.mongodb.VerifyEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

/**
 * @ClassName VerifyRepository
 * Description TODO
 * @Author WillemGavin
 * @Date 2021/10/11 15:08
 * Version 0.0.1
 */
@Repository
public interface VerifyRepository extends MongoRepository<VerifyEntity, String> {
}
