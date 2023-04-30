package com.fudan.productsupport.utils;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.fudan.productsupport.config.NebularGraphConfig;
import com.vesoft.nebula.client.graph.data.Node;
import com.vesoft.nebula.client.graph.data.ResultSet;
import com.vesoft.nebula.client.graph.data.ValueWrapper;
import com.vesoft.nebula.client.graph.exception.IOErrorException;
import com.vesoft.nebula.client.graph.net.Session;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import javax.annotation.Resource;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

/**
 * @ClassName NebularTest
 * Description TODO
 * @Author WillemGavin
 * @Date 2021/8/19 14:07
 * Version 0.0.1
 */
@SpringBootTest
@Slf4j
public class NebularTest {
    @Resource
    private NebularGraphConfig nebularGraphConfig;

    @Resource
    private NebularGraphUtil nebularGraphUtil;

    @Test
    void showTags(){
        Session session = nebularGraphConfig.getSession();
        String nGQL = "USE demo; SHOW tags;";
        try {
            ResultSet resp = session.execute(nGQL);
            log.info(resp.toString());
        } catch (IOErrorException e) {
            e.printStackTrace();
        }
    }

    @Test
    void showVERTEX(){
        Session session = nebularGraphConfig.getSession();
        String nGQL = "USE demo;INSERT VERTEX IF NOT EXISTS chip(tag, chip_id, chip_name, chip_specification, chip_batch, chip_eox) VALUES \"chip_290\":(\"chip\", \"chip_290\", \"chip_290\", \"chip_290\", \"chip_290\", \"1620625091\");";
//        String nGQL = "USE test; MATCH (v:board) RETURN v;";
        JSONObject jsonObject = null;
        try {
            ResultSet resp = session.execute(nGQL);
            List<ValueWrapper> rows = resp.colValues("v");
            Node n = rows.get(0).asNode();
            log.info(n.properties(n.tagNames().get(0)).get("chip_name").toString());
        } catch (IOErrorException | UnsupportedEncodingException e) {
            e.printStackTrace();
        }
    }

    @Test
    void insertVERTEX(){
        Session session = nebularGraphConfig.getSession();
        String nGQL = "USE test4;INSERT VERTEX vulnerability (name, age) VALUES 11:(\"n1\", 12);";
//        String nGQL = "USE test; MATCH (v:board) RETURN v;";
        JSONObject jsonObject = null;
        try {
            ResultSet resp = session.execute(nGQL);
            List<ValueWrapper> rows = resp.colValues("v");
            Node n = rows.get(0).asNode();
            log.info(n.properties(n.tagNames().get(0)).get("chip_name").toString());
        } catch (IOErrorException | UnsupportedEncodingException e) {
            e.printStackTrace();
        }
    }

    @Test
    void dropTag(){
        Session session = nebularGraphConfig.getSession();
        String nGQL = "USE demo; DROP TAG board;";
        try {
            ResultSet resp = session.execute(nGQL);
            log.info(resp.toString());
        } catch (IOErrorException e) {
            e.printStackTrace();
        }
    }

    @Test
    void getTAGs(){
        JSONArray tags = nebularGraphUtil.getTags();
        log.info(String.valueOf(tags.contains("chip")));
    }

    @Test
    void getTAGDESC(){
        Session session = nebularGraphConfig.getSession();
        String nGQL = "USE demo; DESC TAG chip;";
        try {
            ResultSet resp = session.execute(nGQL);
            log.info(resp.colValues("Field").toString());
        } catch (IOErrorException e) {
            e.printStackTrace();
        }
//        JSONArray tagDESC = nebularGraphUtil.getTagDescription("chip");
//        log.info(tagDESC.toString());
    }

    @Test
    void createTAG(){
//                USE test;CREATE TAG IF NOT EXISTS board(board_id_ string, board_name_ string, board_description_ string, board_version_ string, board_generation_ string, board_eox_ string, board_bom_ string, board_final_ string);
        Session session = nebularGraphConfig.getSession();
        String nGQL = "USE test; CREATE TAG IF NOT EXISTS board11(`board_id` string, `board_name` string)";
        try {
            ResultSet resp = session.execute(nGQL);
            log.info(resp.toString());
        } catch (IOErrorException e) {
            e.printStackTrace();
        }
    }

    @Test
    void getSubGraph(){
        Session session = nebularGraphConfig.getSession();
        String nGQL = "USE Vulnerability;MATCH p=(v)<-[e:`include`*1..5]-(v2) \n" +
                "WHERE id(v) IN [\"`component_004`\"] \n" +
                "RETURN DISTINCT p as pathList;";
        try {
            ResultSet resp = session.execute(nGQL);
            log.info(resp.colValues("pathList").get(0).toString());
            List<ValueWrapper> pathList = resp.colValues("pathList");
            log.info(pathList.get(0).asPath().getNodes().toString());
        } catch (IOErrorException | UnsupportedEncodingException e) {
            e.printStackTrace();
        }
    }

    @Test
    void getVertiexProperty(){
        log.info(nebularGraphUtil.getVertiexProperty("chip_290", "chip_name").toString());
    }
}
