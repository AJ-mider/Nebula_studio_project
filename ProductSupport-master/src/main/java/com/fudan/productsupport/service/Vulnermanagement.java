package com.fudan.productsupport.service;

import com.vesoft.nebula.client.graph.exception.IOErrorException;
import com.vesoft.nebula.client.graph.net.Session;

import java.io.UnsupportedEncodingException;
import java.util.List;
import java.util.HashMap;


public interface Vulnermanagement {

    List<String> countVulner(Session s, String space) throws UnsupportedEncodingException, IOErrorException;

    List<String> getvulner_id(Session s, String space) throws IOErrorException, UnsupportedEncodingException;

    List<String> getproduct_id(Session s, String space) throws IOErrorException, UnsupportedEncodingException;

    List<Long> countVulneraffectnode(Session s, String space) throws IOErrorException, UnsupportedEncodingException;

    HashMap<String, Long> getvulner_stas(Session s, String space, String date_begin, String date_end) throws IOErrorException;

}
