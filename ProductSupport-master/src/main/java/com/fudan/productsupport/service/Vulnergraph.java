package com.fudan.productsupport.service;

import com.vesoft.nebula.Value;
import com.vesoft.nebula.client.graph.data.ResultSet;
import com.vesoft.nebula.client.graph.data.ValueWrapper;
import com.vesoft.nebula.client.graph.exception.IOErrorException;
import com.vesoft.nebula.client.graph.net.Session;

import java.io.UnsupportedEncodingException;
import java.util.List;


public interface Vulnergraph {
    List<String> getvulner_graph_node(String vulner_id) throws IOErrorException, UnsupportedEncodingException;

    List<String> getvulner_graph_edge(String vulner_id) throws IOErrorException;
}
