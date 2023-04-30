package com.fudan.productsupport.service;

import com.vesoft.nebula.client.graph.exception.IOErrorException;
import com.vesoft.nebula.client.graph.net.Session;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.HashMap;

public interface View {
    ArrayList<HashMap<String, String>> get_View(Session s, String space, String tagname) throws IOErrorException, UnsupportedEncodingException;
}
