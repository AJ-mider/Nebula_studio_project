package com.fudan.productsupport.service.impl;

import com.fudan.productsupport.config.NebularGraphConfig;
import com.fudan.productsupport.service.Vulnergraph;
import com.vesoft.nebula.client.graph.data.ResultSet;
import com.vesoft.nebula.client.graph.data.ValueWrapper;
import com.vesoft.nebula.client.graph.exception.IOErrorException;
import com.vesoft.nebula.client.graph.net.Session;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;

@Service
@ResponseBody
@Slf4j
public class VulnergraphImpl implements Vulnergraph {
    @Resource
    NebularGraphConfig nebularGraphConfig;
    @Override
    public List<String> getvulner_graph_node(String vulner_id) throws IOErrorException, UnsupportedEncodingException {
        String getgraph = "GET SUBGRAPH WITH PROP 1 STEPS FROM \"" + vulner_id + "\" OUT affected YIELD VERTICES AS nodes, EDGES AS relationships;";
        Session s = nebularGraphConfig.getSession();
        s.execute("Use boost_all_include");
        ResultSet ans = s.execute(getgraph);
        ResultSet.Record record_node = ans.rowValues(1);
        List<String> ret = new ArrayList<>();
        for(ValueWrapper a: record_node){
            for(ValueWrapper node: a.asList()) {
                ret.add(node.asNode().getId().toString());
            }
        }
        return ret;
    }

    public List<String> getvulner_graph_edge(String vulner_id) throws IOErrorException {
        String getgraph = "GET SUBGRAPH WITH PROP 1 STEPS FROM \"" + vulner_id + "\" OUT affected YIELD VERTICES AS nodes, EDGES AS relationships;";
        Session s = nebularGraphConfig.getSession();
        s.execute("Use boost_all_include");
        ResultSet ans = s.execute(getgraph);
        ResultSet.Record record_edge = ans.rowValues(0);
        List<String> ret = new ArrayList<>();
        for(ValueWrapper a: record_edge){
            for(ValueWrapper edge: a.asList()) {
                if(edge.isEdge()) {
                    System.out.println(edge.asRelationship().toString());
                    ret.add(edge.asRelationship().toString());
                }
            }
        }
        return ret;
    }
}
