package com.fudan.productsupport.service.impl;

import com.fudan.productsupport.entity.mongodb.RecordEntity;
import com.fudan.productsupport.form.PageForm;
import com.fudan.productsupport.service.RecordService;
import com.fudan.productsupport.utils.Constant;
import lombok.extern.slf4j.Slf4j;
import org.bson.BsonTimestamp;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

@Slf4j
@SpringBootTest
class RecordServiceImplTest {
    @Resource
    private RecordService recordService;

    // 测试成功  2021.07.30
    @Test
    void testSave(){
        RecordEntity recordEntity = new RecordEntity("60f6bdf03a2ebd114b6fd8e9",
                -1,
                Constant.ConnectorStatus.NORMAL.getValue());
        recordEntity.setRequestTime(new BsonTimestamp(new Date().getTime()));
        recordService.save(recordEntity);
    }

    // 测试成功 2021.07.30
    @Test
    void testQuery(){
        PageForm pageForm = new PageForm(1,10,"id", "DESC");
        RecordEntity recordEntity = new RecordEntity("", -1, Constant.NOT_USE);
        Calendar startCalendar = Calendar.getInstance();
        startCalendar.setTime(new Date());
        startCalendar.set(Calendar.HOUR_OF_DAY, 0);
        startCalendar.set(Calendar.MINUTE, 0);
        startCalendar.set(Calendar.SECOND, 0);

        Date startTime = startCalendar.getTime();
        startCalendar.add(Calendar.DATE, 1);
        Date endTime = startCalendar.getTime();

        Page<RecordEntity> res = recordService.query(recordEntity, pageForm.getPageRequest(), startTime, endTime);
        log.info(String.valueOf(res.getTotalElements()));
    }

    // 测试成功 2021.07.30
    @Test
    void testDelete(){
        List<RecordEntity> recordEntities = recordService.queryByConnectorId("615036f8d1005b07f987d73c");
        List<String> ids = new ArrayList<>();
        for(RecordEntity recordEntity : recordEntities) {
            ids.add(recordEntity.getId());
        }
        recordService.delete(ids);
    }

}