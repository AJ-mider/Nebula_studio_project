package com.fudan.productsupport.service.impl;

import com.fudan.productsupport.service.TestInsertVulner;
import com.fudan.productsupport.service.VulnerabilityAnnotationService;
import com.vesoft.nebula.client.graph.exception.IOErrorException;
import com.vesoft.nebula.client.graph.net.Session;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

@Service
@Slf4j
public class TestInsertVulnerImpl implements TestInsertVulner {
    @Resource
    private VulnerabilityAnnotationService vulnerabilityAnnotationService;

    @Override
    public void Insert_vulner(Session s, String space, String vulner_id, String summary, String published, String file_id) throws IOErrorException {
        s.execute("Use " + space);
        String insertVulner_nGQL = "INSERT VERTEX vulner (summary, published) VALUES \"" + vulner_id + "\":(\"" + summary + "\", \"" + published + "\");";
        String insertEdge_nGQL = "INSERT EDGE Include () VALUES \"" + file_id + "\"->\"" + vulner_id + "\":();";
        s.execute(insertVulner_nGQL);
        s.execute(insertEdge_nGQL);
        vulner_id = "`" + vulner_id + "`";
        file_id = "`" + file_id + "`";
        vulnerabilityAnnotationService.tracking(vulner_id, file_id);
    }
}