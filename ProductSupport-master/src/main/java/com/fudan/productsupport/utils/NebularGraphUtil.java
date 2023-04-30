package com.fudan.productsupport.utils;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.fudan.productsupport.config.NebularGraphConfig;
import com.fudan.productsupport.entity.mongodb.ERModuleEntity;
import com.fudan.productsupport.entity.mongodb.Property;
import com.fudan.productsupport.service.VerifyService;
import com.fudan.productsupport.utils.Exception.ApiException;
import com.vesoft.nebula.client.graph.data.Node;
import com.vesoft.nebula.client.graph.data.ResultSet;
import com.vesoft.nebula.client.graph.data.ValueWrapper;
import com.vesoft.nebula.client.graph.exception.IOErrorException;
import com.vesoft.nebula.client.graph.net.Session;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import javax.annotation.Resource;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * @ClassName NebularGraphUtil
 * Description TODO
 * @Author WillemGavin
 * @Date 2021/8/18 14:55
 * Version 0.0.1
 */
@Slf4j
@Component
public class NebularGraphUtil {

    @Resource
    private NebularGraphConfig nebularGraphConfig;
    @Resource
    private VerifyService verifyService;

    @Value("boost_all_include")
    private String space;

    /**
     * TODO 执行创建Tag nGQL
     * @param name
     * @param properties
     * @return
     * @throws InterruptedException
     */
    public boolean createTag(String name, List<Property> properties){


//        USE test;CREATE TAG IF NOT EXISTS board(board_id_ string, board_name_ string, board_description_ string, board_version_ string, board_generation_ string, board_eox_ string, board_bom_ string, board_final_ string);
        log.info("创建TAG：" + name);

        // 拼接nGQL语句
        StringBuilder createSchema = new StringBuilder();
        // 使用空间
        createSchema.append("USE ").append(space).append(";");
        // 设置TAG名称
        createSchema.append("CREATE TAG IF NOT EXISTS `").append(name).append("`(");
        //将tag也保存为属性
        createSchema.append("`tag` string, ");
        // 拼接tag参数属性
        for(Property property : properties){
            createSchema.append("`").append(property.getName()).append("` ").append(property.getType());
            if(property.getDefaultVal() != null)
                createSchema.append(" DEFAULT ").append(property.getDefaultVal());
            createSchema.append(", ");
        }
        // 删除尾部 ", "
        createSchema.delete(createSchema.length() - 2, createSchema.length());
        createSchema.append(");");

        try {
            Session session = nebularGraphConfig.getSession();
            ResultSet resp = session.execute(createSchema.toString());
            if (!resp.isSucceeded()) {
                log.error(String.format("Execute: `%s', failed: %s",
                        createSchema.toString(), resp.getErrorMessage()));
                return false;
            }

        } catch (IOErrorException e) {
            e.printStackTrace();
            log.info("操作失败，请稍后！");
            return false;
        }
        return true;
    }

    /**
     * 删除TAG
     * @param name
     * @return
     */
    public boolean dropTag(String name){
//        DROP TAG test;
        log.info("删除TAG：" + name);

        // 拼接nGQL语句
        StringBuilder nGQL = new StringBuilder();
        // 使用空间
        nGQL.append("USE ").append(space).append(";");
        // 拼接nGQL
        nGQL.append("DROP TAG IF EXISTS `").append(name).append("`;");

        try {
            Session session = nebularGraphConfig.getSession();
            ResultSet resp = session.execute( nGQL.toString());
            if (!resp.isSucceeded()) {
                log.error(String.format("Execute: `%s', failed: %s",
                        nGQL.toString(), resp.getErrorMessage()));
                throw new ApiException("操作异常，请检查参数！");
            }

        } catch (IOErrorException e) {
            e.printStackTrace();
            log.info("操作失败，请稍后！");
            return false;
        }
        return true;
    }

    /**
     * 获取所有的TAG
     * @return
     */
    public JSONArray getTags(){
//        DROP TAG test;
        log.info("获取所有的TAG：");

        // 拼接nGQL语句
        StringBuilder nGQL = new StringBuilder();
        // 使用空间
        nGQL.append("USE ").append(space).append(";");
        // 拼接nGQL
        nGQL.append("SHOW TAGS").append(";");

        JSONArray result = null;
        try {
            Session session = nebularGraphConfig.getSession();
            ResultSet resp = session.execute( nGQL.toString());
            if (!resp.isSucceeded()) {
                log.error(String.format("Execute: `%s', failed: %s",
                        nGQL.toString(), resp.getErrorMessage()));
            }
            result = JSON.parseArray(resp.colValues("Name").toString());

        } catch (IOErrorException e) {
            e.printStackTrace();
            log.info("操作失败，请稍后！");
        }
        return result;
    }

    /**
     * 获取所有的TAGDESC
     * @return
     */
    public JSONArray getTagDescription(String tag){
//        DROP TAG test;
        log.info("获取所有的TAGDESC：");

        // 拼接nGQL语句
        StringBuilder nGQL = new StringBuilder();
        // 使用空间
        nGQL.append("USE ").append(space).append(";");
        // 拼接nGQL
        nGQL.append("DESC TAG ").append(tag).append(";");

        JSONArray result = null;
        try {
            Session session = nebularGraphConfig.getSession();
            ResultSet resp = session.execute( nGQL.toString());
            if (!resp.isSucceeded()) {
                log.error(String.format("Execute: `%s', failed: %s",
                        nGQL.toString(), resp.getErrorMessage()));
                throw new ApiException("操作失败，请检查参数！");
            }
            result = JSON.parseArray(resp.colValues("Field").toString());
        } catch (IOErrorException e) {
            e.printStackTrace();
            log.info("操作失败，请稍后！");
        }
        return result;
    }

    /**
     * TODO 执行创建Edge nGQL
     * @param name
     * @param properties
     * @return
     * @throws InterruptedException
     */
    public boolean createEdge(String name, List<Property> properties){

        log.info("创建Edge：" + name);
        // 拼接nGQL语句
        StringBuilder createSchema = new StringBuilder();
        // 使用空间
        createSchema.append("USE ").append(space).append(";");
        // 设置TAG名称
        createSchema.append("CREATE EDGE IF NOT EXISTS ").append(name).append("(");
        // 拼接tag参数属性
        if(properties != null && properties.size() != 0){
            for(Property property : properties){
                createSchema.append('`').append(property.getName()).append("` ").append(property.getType());
                if(property.getDefaultVal() != null)
                    createSchema.append(" DEFAULT ").append(property.getDefaultVal());
                createSchema.append(", ");
            }
            // 删除尾部 ", "
            createSchema.delete(createSchema.length() - 2, createSchema.length());
            createSchema.append(");");
        }else
            createSchema.append(");");

        try {
            Session session = nebularGraphConfig.getSession();
            ResultSet resp = session.execute(createSchema.toString());
            if (!resp.isSucceeded()) {
                log.error(String.format("Execute: `%s', failed: %s",
                        createSchema.toString(), resp.getErrorMessage()));
                return false;
            }

        } catch (IOErrorException e) {
            e.printStackTrace();
            log.info("操作失败，请稍后！");
            return false;
        }
        return true;
    }

    /**
     * TODO 向nebular插入data中的实体数据
     * @param data
     * @param erModuleEntity
     */
    public void insertVertex(ERModuleEntity erModuleEntity, JSONArray data){

        if (data.isEmpty())
            return;

        Session session = nebularGraphConfig.getSession();
//         INSERT 遇到相同id的数据不会进行修改
//        String insertVertexe = "INSERT VERTEX person(name, age) VALUES "
//                + "'Bob':('Bob', 10), "
//                + "'Lily':('Lily', 9), "
//                + "'Tom':('Tom', 10), "
//                + "'Jerry':('Jerry', 13), "
//                + "'John':('John', 11);";
        StringBuilder insertVertexes = new StringBuilder();
        List<String> verifyDataIds = new ArrayList<>();
        // 使用空间
        insertVertexes.append("USE ").append(space).append(";");
        insertVertexes.append("INSERT VERTEX IF NOT EXISTS ").append(erModuleEntity.getName()).append("(");
        insertVertexes.append("`tag`, ");
        // 将属性名加入
        for (Property property : erModuleEntity.getProperties()) {
            insertVertexes.append("`").append(property.getName()).append("`, ");
        }
        // 删除多余空格
        insertVertexes.delete(insertVertexes.length() - 2, insertVertexes.length());
        insertVertexes.append(") VALUES ");
        for (int i = 0; i < data.size(); i++){
            JSONObject row = data.getJSONObject(i);
            // 获取校验所需的信息
            verifyDataIds.add(row.getString(erModuleEntity.getKey()));
            // 获取id，指明操作的节点
            insertVertexes.append("'").append(row.get(erModuleEntity.getKey())).append("':(");
            //保存tag
            insertVertexes.append("'").append(erModuleEntity.getName()).append("', ");
            // 拼接该条记录所有的值
            for (Property property : erModuleEntity.getProperties()) {
                if (property.getType().equals("string"))
                    insertVertexes.append("'").append(row.getString(property.getName())).append("'");
                else if(property.getType().equals(Constant.NebularDataType.DATE.getValue()))
                    insertVertexes.append("date('").append(row.getString(property.getName())).append("')");
                else if(property.getType().equals(Constant.NebularDataType.DATETIME.getValue()))
                    insertVertexes.append("datetime('").append(row.getString(property.getName())).append("')");
                else if(property.getType().equals(Constant.NebularDataType.TIME.getValue()))
                    insertVertexes.append("time('").append(row.getString(property.getName())).append("')");
                else
                    insertVertexes.append(row.getString(property.getName()));
                insertVertexes.append(", ");
            }
            insertVertexes.delete(insertVertexes.length() - 2, insertVertexes.length()).append("), ");
        }

        // 发送需校验的数据
        JSONObject verifyData = new JSONObject();
        verifyData.put("ids", verifyDataIds);
        verifyData.put("tag", erModuleEntity.getName());
        try {
            verifyService.sendVerifyData(verifyData);
        }catch (Exception e){
            e.printStackTrace();
        }

        insertVertexes.delete(insertVertexes.length() - 2, insertVertexes.length()).append(";");
        ResultSet resp = null;
        try {
            resp = session.execute(insertVertexes.toString());
            if (!resp.isSucceeded()) {
                log.error(String.format("Execute: `%s', failed: %s",
                        insertVertexes, resp.getErrorMessage()));
                throw new ApiException("节点插入失败！");
            }
            log.info("插入节点成功!");
        } catch (IOErrorException e) {
            e.printStackTrace();
        }
    }

    /**
     * TODO 向nebular插入data中的关系数据
     * @param erModuleEntity
     * @param data
     */
    public void insertEdge(ERModuleEntity erModuleEntity, JSONArray data){

        if (data.isEmpty())
            return;

        Session session = nebularGraphConfig.getSession();
//         INSERT EDGE的执行方式为覆盖式插入。四元组<起点、终点、Edge type、rank>唯一确定一条边，如果四元组都相同，则覆盖。
//        String insertEdges = "INSERT EDGE like(likeness) VALUES "
//                + "'Bob'->'Lily':(80.0), "
//                + "'Bob'->'Tom':(70.0), "
//                + "'Lily'->'Jerry':(84.0), "
//                + "'Tom'->'Jerry':(68.3), "
//                + "'Bob'->'John':(97.2);";
        StringBuilder insertEdges = new StringBuilder();
        // 使用空间
        insertEdges.append("USE ").append(space).append(";");
        insertEdges.append("INSERT EDGE ").append(erModuleEntity.getName()).append("(");
        // 将属性名加入
        if(erModuleEntity.getProperties() != null && erModuleEntity.getProperties().size() != 0) {
            for (Property property : erModuleEntity.getProperties()) {
                insertEdges.append(property.getName()).append(", ");
            }
            // 删除多余空格
            insertEdges.delete(insertEdges.length() - 2, insertEdges.length());
        }

        insertEdges.append(") VALUES ");
        for (int i = 0; i < data.size(); i++){
            JSONObject row = data.getJSONObject(i);
            // 获取data中实体关系
            insertEdges.append("'").append(row.get("from")).append("'->") ;
            insertEdges.append("'").append(row.get("to")).append("':(");
            // 拼接该条记录所有的值
            if(erModuleEntity.getProperties() != null && erModuleEntity.getProperties().size() != 0) {
                for (Property property : erModuleEntity.getProperties()) {
                    if (property.getType().equals("string"))
                        insertEdges.append("'").append(row.getString(property.getName())).append("'");
                    else if (property.getType().equals(Constant.NebularDataType.DATE.getValue()))
                        insertEdges.append("date('").append(row.getString(property.getName())).append("')");
                    else if (property.getType().equals(Constant.NebularDataType.DATETIME.getValue()))
                        insertEdges.append("datetime('").append(row.getString(property.getName())).append("')");
                    else if (property.getType().equals(Constant.NebularDataType.TIME.getValue()))
                        insertEdges.append("time('").append(row.getString(property.getName())).append("')");
                    else
                        insertEdges.append(row.getString(property.getName()));
                    insertEdges.append(", ");
                }
                insertEdges.delete(insertEdges.length() - 2, insertEdges.length());
            }
            insertEdges.append("), ");
        }

        insertEdges.delete(insertEdges.length() - 2, insertEdges.length()).append(";");
        ResultSet resp = null;
        try {
            resp = session.execute(insertEdges.toString());
            if (!resp.isSucceeded()) {
                log.error(String.format("Execute: `%s', failed: %s",
                        insertEdges, resp.getErrorMessage()));
                throw new ApiException("边插入失败！");
            }
            log.info("边插入成功!");
        } catch (IOErrorException e) {
            e.printStackTrace();
        }
    }

    /**
     * 更新节点数据
     * @param erModuleEntity
     * @param data
     */
    public void updateVertiex(ERModuleEntity erModuleEntity, JSONArray data){
        if (data.isEmpty())
            return;

        Session session = nebularGraphConfig.getSession();
//         INSERT 遇到相同id的数据不会进行修改
//        String nGQL = "UPDATE VERTEX ON player \"player101\" " +
//                "        SET age = age + 2 ";
        StringBuilder nGQL = new StringBuilder();

        for (int i = 0; i < data.size(); i++){
            JSONObject row = data.getJSONObject(i);
            // 使用空间
            nGQL.append("USE ").append(space).append(";");

            nGQL.append("UPDATE VERTEX ON ").append(erModuleEntity.getName()).append(" ");
            // 获取id，指明操作的节点
            nGQL.append(row.getString(erModuleEntity.getKey())).append(" SET ");

            for (Map.Entry<String, Object> stringObjectEntry : row.entrySet()) {
                Map.Entry entry = (Map.Entry) stringObjectEntry;
                StringBuilder executeNGQL = nGQL;
                // 主键字段不更新
                if (erModuleEntity.getKey().compareTo(entry.getKey().toString()) == 0)
                    continue;
                executeNGQL.append("`").append(entry.getKey()).append("` = ").append(entry.getValue()).append(";");
                log.info("执行:" + executeNGQL);
                ResultSet resp = null;
                try {
                    resp = session.execute(executeNGQL.toString());
                    if (!resp.isSucceeded()) {
                        log.error(String.format("Execute: `%s', failed: %s",
                                nGQL, resp.getErrorMessage()));
                        throw new ApiException("更新节点失败！");
                    }
                    log.info("更新节点成功!");
                } catch (IOErrorException e) {
                    e.printStackTrace();
                }
            }

        }
    }

    /**
     * 删除节点数据
     * @param data
     */
    public void deleteVertiex(List<String> data){
        if (data.isEmpty())
            return;

        Session session = nebularGraphConfig.getSession();
//        String nGQL = "DELETE VERTEX "team1", "team2";"
        StringBuilder nGQL = new StringBuilder();
        // 使用空间
        nGQL.append("USE ").append(space).append(";");
        nGQL.append("DELETE VERTEX \"");

        for (int i = 0; i < data.size(); i++){
            nGQL.append(data.get(i)).append("\", ");
        }
        nGQL.delete(nGQL.length() - 2, nGQL.length()).append(";");

        ResultSet resp = null;
        try {
            resp = session.execute(nGQL.toString());
            if (!resp.isSucceeded()) {
                log.error(String.format("Execute: `%s', failed: %s",
                        nGQL, resp.getErrorMessage()));
                throw new ApiException("删除节点失败！");
            }
            log.info("删除节点成功!");
        } catch (IOErrorException e) {
            e.printStackTrace();
        }
    }

    /**
     * TODO 获取某个节点的属性值
     * @param id
     * @param property
     * @return
     */
    public Object getVertiexProperty(String id, String property){
        JSONObject result;
        Session session = nebularGraphConfig.getSession();
//        String nGQL = "MATCH (v) WHERE id(v) == 'player101' RETURN v;"
        StringBuilder nGQL = new StringBuilder();
        nGQL.append("USE ").append(space).append(";");
        nGQL.append("MATCH (v) WHERE id(v) == '").append(id).append("' RETURN v;");
        ResultSet resp = null;
        try {
            resp = session.execute(nGQL.toString());
            if (!resp.isSucceeded()) {
                log.error(String.format("Execute: `%s', failed: %s",
                        nGQL, resp.getErrorMessage()));
                throw new ApiException("查询节点失败！");
            }

            List<ValueWrapper> rows = resp.colValues("v");
            if(!rows.isEmpty()) {
                Node n = rows.get(0).asNode();
                log.info("查询节点" + id + "成功!");
                return n.properties(n.tagNames().get(0)).get(property);
            }
        } catch (IOErrorException | UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * 删除指定边
     * @param srcId
     * @param targetId
     * @param relationship
     */
    public void deleteEdge(String srcId, String targetId, String relationship){
        //DELETE EDGE serve "player100" -> "team204"@0;
        Session session = nebularGraphConfig.getSession();
//        String nGQL = "DELETE VERTEX "team1", "team2";"
        StringBuilder nGQL = new StringBuilder();
        // 使用空间
        nGQL.append("USE ").append(space).append(";");
        nGQL.append("DELETE EDGE ").append(relationship);
        nGQL.append(" \"").append(srcId).append("\" -> \"").append(targetId).append("\";");
        ResultSet resp = null;
        try {
            resp = session.execute(nGQL.toString());
            if (!resp.isSucceeded()) {
                log.error(String.format("Execute: `%s', failed: %s",
                        nGQL, resp.getErrorMessage()));
                throw new ApiException("删除关系失败！");
            }
            log.info("删除关系成功!");
        } catch (IOErrorException e) {
            e.printStackTrace();
        }
    }
    /**
     * TODO 获取子图
     * @param id
     * @return
     */
    public List<ValueWrapper> getSubGraph(String id, String edgeType, int step, boolean isSrc){
        Session session = nebularGraphConfig.getSession();
        StringBuilder nGQL = new StringBuilder();
//        MATCH p=(v)<-[e:`include`*1..5]-(v2) \n" +
//        "WHERE id(v) IN [\"`component_004`\"] \n" +
//                "RETURN DISTINCT p as pathList;";
        nGQL.append("USE ").append(space).append(";");
        // 添加查询的边类型
        nGQL.append("MATCH p=(v)-[e:`").append(edgeType).append("`*1..");
        // 添加查询的最大跳数
        nGQL.append(step).append("]->(v2) WHERE id(");
        if (isSrc) {
            nGQL.append("v");
        } else {
            nGQL.append("v2");
        }
        nGQL.append(") IN [\"");
        // 添加查询起始id
        nGQL.append(id).append("\"] RETURN DISTINCT p as pathList;");
        try {
            ResultSet resp = session.execute(nGQL.toString());
            List<ValueWrapper> pathList = resp.colValues("pathList");
            log.info(pathList.toString());
            return pathList;
        } catch (IOErrorException e) {
            e.printStackTrace();
        }
        return null;
    }
}
