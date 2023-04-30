package com.fudan.productsupport.service.impl;

import com.fudan.productsupport.dao.mongodb.RecordRepository;
import com.fudan.productsupport.entity.mongodb.RecordEntity;
import com.fudan.productsupport.service.RecordService;
import com.fudan.productsupport.utils.Constant;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

/**
 * @ClassName RecordServiceImpl
 * Description TODO
 * @Author WillemGavin
 * @Date 2021/7/29 10:21
 * Version 0.0.1
 */
@Service
@ResponseBody
@Slf4j
public class RecordServiceImpl implements RecordService {

    @Resource
    private RecordRepository recordRepository;
    @Resource
    private MongoTemplate mongoTemplate;

    /**
     * TODO 保存记录信息
     * @param recordEntity
     */
    @Override
    public void save(RecordEntity recordEntity){
        log.info("保存记录" + recordEntity.getConnectorId());
        recordRepository.save(recordEntity);
    }

    /**
     * 查询连接器的数据记录
     * @param id
     * @return
     */
    @Override
    public Page<RecordEntity> queryByConnectorId(String id, PageRequest pageRequest){
        log.info("查询connector的记录" + id);
        Query query = new Query();
        query.addCriteria(Criteria.where("connectorId").is(id));
        List<RecordEntity> items = mongoTemplate.find(query, RecordEntity.class);
        long total = mongoTemplate.count(query, RecordEntity.class);
        return new PageImpl<>(items, pageRequest, total);
    }

    /**
     * 查询连接器的数据记录
     * @param id
     * @return
     */
    @Override
    public List<RecordEntity> queryByConnectorId(String id){
        log.info("查询connector的记录" + id);
        Query query = new Query();
        query.addCriteria(Criteria.where("connectorId").is(id));
        List<RecordEntity> items = mongoTemplate.find(query, RecordEntity.class);
        return items;
    }

    /**
     * TODO 查询
     * @param recordEntity
     * @param pageRequest
     * @return
     */
    @Override
    public Page<RecordEntity> query(RecordEntity recordEntity, PageRequest pageRequest, Date startTime, Date endTime){
        log.info("查询记录" + recordEntity.getConnectorId());
        ExampleMatcher matcher = ExampleMatcher.matching()
                .withStringMatcher(ExampleMatcher.StringMatcher.CONTAINING) //改变字符串为：模糊查询
                .withIgnorePaths("requestTime")
                .withIgnorePaths("timeConsuming")
                .withIgnorePaths("fileId")
                .withIgnorePaths("data")
                .withIgnorePaths("id")
                .withIgnoreNullValues();
        if(recordEntity.getStatus() == Constant.NOT_USE)
            matcher = matcher.withIgnorePaths("status");
        Example<RecordEntity> example = Example.of(recordEntity, matcher);
        Criteria criteria = Criteria.byExample(example);


        // 用query方便查询时间段
        Query query = new Query();
        query.addCriteria(criteria);

        if(startTime != null && endTime != null){
            //处理时间，改为日期
            startTime = getDate(startTime).getTime();
            Calendar endCalender = getDate(endTime);
            // 获取截至日期后一天的0点
            endCalender.add(Calendar.DATE, 1);
            endTime = endCalender.getTime();
            query.addCriteria(Criteria.where("requestTime").gte(startTime).lte(endTime));

        }
        List<RecordEntity> items = mongoTemplate.find(query, RecordEntity.class);
        long total = mongoTemplate.count(query, RecordEntity.class);
        return new PageImpl<>(items, pageRequest, total);
    }

    /**
     * TODO 删除记录
     * @param ids
     */
    @Override
    public void delete(List<String> ids){
        log.info("删除记录：" + ids);
        for(String id : ids){
            recordRepository.deleteById(id);
        }
    }

    /**
     * 通过id获取记录
     * @param id
     * @return
     */
    @Override
    public RecordEntity queryById(String id){
        log.info("获取记录：" + id);
        return recordRepository.findById(id).get();
    }

    /**
     * 获取当前时间日期的0点
     * @param date
     * @return
     */
    private Calendar getDate(Date date){
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        return calendar;
    }

    /**
     * 查询连接器的上一条记录
     * @param connectorId
     * @return
     */
    public RecordEntity queryLast(String connectorId){
        Query query = new Query();
        query.addCriteria(Criteria.where("connectorId").is(connectorId));
        // 按requestTime降序排序
        query.with(Sort.by(Sort.Order.desc("requestTime")));
        List<RecordEntity> items = mongoTemplate.find(query, RecordEntity.class);
        long total = mongoTemplate.count(query, RecordEntity.class);
        if (total > 1){
            // 获取倒数第二个，倒数第一个为最新的
            return items.get(1);
        }
        return null;
    }
}
