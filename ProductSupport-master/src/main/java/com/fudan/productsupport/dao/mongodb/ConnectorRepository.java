package com.fudan.productsupport.dao.mongodb;

import com.fudan.productsupport.entity.mongodb.ConnectorEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;

/**
 * @ClassName ConnectorRepository
 * Description TODO
 * @Author WillemGavin
 * @Date 2021/6/20 15:47
 * Version 0.0.1
 */
@Repository
public interface ConnectorRepository extends MongoRepository<ConnectorEntity, String> {
}
