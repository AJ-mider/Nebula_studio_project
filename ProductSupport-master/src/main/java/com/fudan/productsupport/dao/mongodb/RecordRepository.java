package com.fudan.productsupport.dao.mongodb;

import com.fudan.productsupport.entity.mongodb.ConnectorEntity;
import com.fudan.productsupport.entity.mongodb.RecordEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

/**
 * @ClassName RecordRepository
 * Description TODO
 * @Author WillemGavin
 * @Date 2021/7/28 21:08
 * Version 0.0.1
 */
@Repository
public interface RecordRepository extends MongoRepository<RecordEntity, String> {
}
