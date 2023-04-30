package com.fudan.productsupport.service;

import com.vesoft.nebula.client.graph.exception.IOErrorException;
import com.vesoft.nebula.client.graph.net.Session;

public interface TestInsertVulner {
    void Insert_vulner(Session s, String space, String vulner_id, String summary, String published, String file_id) throws IOErrorException;
}
