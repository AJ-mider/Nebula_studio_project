package com.fudan.productsupport.dao.mongodb;

import com.fudan.productsupport.entity.mongodb.VerifyEntity;
import com.fudan.productsupport.entity.mongodb.VerifyRecordEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

/**
 * @ClassName VerifyRecordRepository
 * Description TODO
 * @Author WillemGavin
 * @Date 2021/10/16 16:56
 * Version 0.0.1
 */
@Repository
public interface VerifyRecordRepository extends MongoRepository<VerifyRecordEntity, String> {
}
