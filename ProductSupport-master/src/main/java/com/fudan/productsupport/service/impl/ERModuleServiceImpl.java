package com.fudan.productsupport.service.impl;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fudan.productsupport.dao.mongodb.ERModuleRepository;
import com.fudan.productsupport.entity.mongodb.ERModuleEntity;
import com.fudan.productsupport.entity.mongodb.RecordEntity;
import com.fudan.productsupport.service.ConnectorService;
import com.fudan.productsupport.service.ERModuleService;
import com.fudan.productsupport.service.RecordService;
import com.fudan.productsupport.service.VulnerabilityAnnotationService;
import com.fudan.productsupport.utils.Constant;
import com.fudan.productsupport.utils.ETLUtil;
import com.fudan.productsupport.utils.Exception.ApiException;
import com.fudan.productsupport.utils.NebularGraphUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import java.util.List;

/**
 * @ClassName ERModuleServiceImpl
 * Description TODO
 * @Author WillemGavin
 * @Date 2021/8/18 10:25
 * Version 0.0.1
 */
@Service
@ResponseBody
@Slf4j
public class ERModuleServiceImpl implements ERModuleService {

    @Resource
    private ERModuleRepository erModuleRepository;
    @Resource
    private MongoTemplate mongoTemplate;
    @Resource
    private ETLUtil etlUtil;
    @Resource
    private NebularGraphUtil nebularGraphUtil;
    @Resource
    private ConnectorService connectorService;
    @Resource
    private RecordService recordService;
    @Resource
    private VulnerabilityAnnotationService vulnerabilityAnnotationService;

    /**
     * TODO 保存模型
     * @param erModuleEntity
     * @return
     */
    @Override
    public String save(ERModuleEntity erModuleEntity) {
        log.info("保存nebular TAG" + erModuleEntity.getConnectorId());
        // 校验连接器
        if(connectorService.queryById(erModuleEntity.getConnectorId()) == null){
            log.info("连接器不存在！");
            throw new ApiException("连接器不存在！");
        }
        // 校验模型
        if(this.isExist(erModuleEntity.getConnectorId(), erModuleEntity.getName(), erModuleEntity.getType())){
            log.info("该连接器中ER模型已存在！");
            throw new ApiException("该连接器中ER模型已存在！");
        }
        // 校验是否已有tag
        JSONArray tags = nebularGraphUtil.getTags();
        if(tags.contains(erModuleEntity.getName())){
            erModuleRepository.save(erModuleEntity);
            return "Tag: " + erModuleEntity.getName() + "已存在，模型保存成功！";
        }
        // 新增nebular TAG
        if(erModuleEntity.getType() == Constant.ModuleType.ENTITY.getValue() &&
                nebularGraphUtil.createTag(erModuleEntity.getName(), erModuleEntity.getProperties())) {
            log.info("保存节点模型："+ erModuleEntity.getConnectorId());
            erModuleRepository.save(erModuleEntity);
        }else if(erModuleEntity.getType() == Constant.ModuleType.RELATION.getValue() &&
                nebularGraphUtil.createEdge(erModuleEntity.getName(), erModuleEntity.getProperties())){
            log.info("保存边模型："+ erModuleEntity.getConnectorId());
            erModuleRepository.save(erModuleEntity);
        }else
            throw new ApiException("模型保存失败！");
        return "模型和Tag均保存成功";
    }

    /**
     * TODO 通过连接器id查找对应的模型
     * @param connectorId
     * @return
     */
    @Override
    public List<ERModuleEntity> queryByConnectorId(String connectorId) {
        log.info("查询connector的模型" + connectorId);
        Query query = new Query();
        query.addCriteria(Criteria.where("connectorId").is(connectorId));
        // 按type升序排序，则节点数据在前面
        query.with(Sort.by(Sort.Order.asc("type")));
        return mongoTemplate.find(query, ERModuleEntity.class);
    }

    /**
     * TODO 通过id获取模型
     * @param id
     * @return
     */
    @Override
    public ERModuleEntity queryById(String id){
        return erModuleRepository.findById(id).get();
    }

    /**
     * TODO 通过名称查模型
     * @param name
     * @return
     */
    @Override
    public List<ERModuleEntity> queryByName(String name){
        log.info("根据名字查模型" + name);
        Query query = new Query();
        query.addCriteria(Criteria.where("name").is(name));
        return mongoTemplate.find(query, ERModuleEntity.class);
    }

    /**
     * TODO 删除模型
     * @param ids
     */
    @Override
    public void delete(List<String> ids) {
        log.info("删除模型：" + ids);
        for(String id : ids){
            // 如果仅剩这一个同名的模型后删除TAG
            ERModuleEntity erModuleEntity = this.queryById(id);
            if(this.queryByName(erModuleEntity.getName()).size() == 1)
                nebularGraphUtil.dropTag(erModuleEntity.getName());
            erModuleRepository.deleteById(id);
        }
    }

    /**
     * 处理数据
     * @param recordEntity
     */
    @Override
    public void dataHandle(RecordEntity recordEntity){
        log.info("抽取记录信息：" + recordEntity.getId());

        // 获取对应连接器的实体关系抽取和代码
        List<ERModuleEntity> erModuleEntities = this.queryByConnectorId(recordEntity.getConnectorId());
        // 尚未保存模型数据，暂不处理
        if(erModuleEntities.size() == 0){
            log.info("连接器无ER模型数据:" + recordEntity.getConnectorId());
            return;
        }

        // 获取更新类型
        int updateType = connectorService.queryById(recordEntity.getConnectorId()).getUpdateType();

        // 查询是否有上次记录
        RecordEntity lastRecordEntity = recordService.queryLast(recordEntity.getConnectorId());
        JSONObject lastERData = null;
        if(lastRecordEntity != null)
            lastERData = lastRecordEntity.getERData();

        JSONObject eRData = new JSONObject();
        // 便利与该连接器关联的eRModule
        for(ERModuleEntity erModuleEntity : erModuleEntities){
            // 先通过etl工具获得正确格式的数据
            JSONArray data = JSON.parseArray(etlUtil.executeJavaScript(erModuleEntity.getCode(), recordEntity.getData()));

            if(updateType == Constant.UpdateType.FULL.getValue() && lastERData != null){
                // 暂时不对边进行比对
                if (erModuleEntity.getType() == Constant.ModuleType.RELATION.getValue()) {
                    nebularGraphUtil.insertEdge(erModuleEntity, data);
                }else {
                    JSONObject jsonObject = null;
                    // 数据对比
                    try {
                        jsonObject = etlUtil.jsonDiff(lastERData.getJSONArray(erModuleEntity.getName()), data, erModuleEntity.getKey());
                        // 插入新增的数据
                        nebularGraphUtil.insertVertex(erModuleEntity, jsonObject.getJSONArray("add"));
                        // 如果为漏洞节点
                        if(!erModuleEntity.getAffected().isEmpty()){
                            this.handleVulnerability(erModuleEntity, jsonObject.getJSONArray("add"));
                        }
                        // 修改的数据
                        nebularGraphUtil.updateVertiex(erModuleEntity, jsonObject.getJSONArray("replace"));
                        // 执行删除的数据
                        nebularGraphUtil.deleteVertiex((List<String>) jsonObject.get("remove"));
                    } catch (JsonProcessingException e) {
                        throw new ApiException("数据对比失败，请检查数据格式！");
                    }
                }

            }else{// 增量更新
                // 将数据保存到nebular
                if(erModuleEntity.getType() == Constant.ModuleType.ENTITY.getValue()){
                    nebularGraphUtil.insertVertex(erModuleEntity, data);
                    // 如果为漏洞节点
                    if(!erModuleEntity.getAffected().isEmpty()){
                        this.handleVulnerability(erModuleEntity, data);
                    }
                }else{
                    nebularGraphUtil.insertEdge(erModuleEntity, data);
                }
            }
            // 抽取数据归档
            eRData.put(erModuleEntity.getName(), data);

        }
        recordEntity.setERData(eRData);
        // 更新记录信息
        recordService.save(recordEntity);

    }


    /**
     * 判断模型是否存在
     * @param connectorId
     * @param name
     * @param type
     * @return
     */
    @Override
    public boolean isExist(String connectorId, String name, int type) {
        log.info("查询connector的模型" + connectorId);
        Query query = new Query();
        query.addCriteria(Criteria.where("connectorId").is(connectorId));
        query.addCriteria(Criteria.where("name").is(name));
        query.addCriteria(Criteria.where("type").is(type));
        List<ERModuleEntity> result = mongoTemplate.find(query, ERModuleEntity.class);
        return result.size() != 0;
    }

    public void handleVulnerability(ERModuleEntity erModuleEntity, JSONArray data){
        // 进行漏洞标注
        for(int i = 0; i < data.size(); i++){
            JSONObject vulnerability = data.getJSONObject(i);
            String sourceId = vulnerability.getString(erModuleEntity.getKey());
            String targetId = vulnerability.getString(erModuleEntity.getAffected());
            vulnerabilityAnnotationService.tracking(sourceId, targetId);
        }
    }
    /**
     * 测试函数
     * @param recordId
     * @param code
     * @return
     */
    @Override
    public JSONArray codeTest(String recordId, String code){
        return JSON.parseArray(etlUtil.executeJavaScript(code, recordService.queryById(recordId).getData()));
    }
}
