package com.fudan.productsupport.controller;

import com.fudan.productsupport.service.Vulnermanagement;
import com.fudan.productsupport.config.NebularGraphConfig;
import com.vesoft.nebula.client.graph.exception.IOErrorException;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.io.UnsupportedEncodingException;
import java.util.List;
import java.util.HashMap;

@RestController
@RequestMapping("/vulnermg")
@Api(tags = "漏洞数管理")
public class VulnermanagementController {
    @Resource
    private Vulnermanagement vulnermanagement;

    @Resource
    private NebularGraphConfig nebularGraphConfig;

    @GetMapping("/get_vulnercount")
    @ApiOperation(value = "获取漏洞数量", httpMethod = "GET")
    public List<String> get_vulnercount() throws IOErrorException, UnsupportedEncodingException {
        return vulnermanagement.countVulner(nebularGraphConfig.getSession(),"boost_all_include");
    }

    @GetMapping("/get_vulnerID")
    @ApiOperation(value = "获取漏洞ID", httpMethod = "GET")
    public List<String> get_vulnerID() throws IOErrorException, UnsupportedEncodingException {
        return vulnermanagement.getvulner_id(nebularGraphConfig.getSession(), "boost_all_include");
    }

    @GetMapping("/get_productID")
    @ApiOperation(value = "获取产品ID", httpMethod = "GET")
    public List<String> get_productID() throws IOErrorException, UnsupportedEncodingException {
        return vulnermanagement.getproduct_id(nebularGraphConfig.getSession(), "boost_all_include");
    }

    @GetMapping("/get_vulneraffectNode")
    @ApiOperation(value = "获取漏洞影响数量", httpMethod = "GET")
    public List<Long> get_vulneraffectNode() throws IOErrorException, UnsupportedEncodingException {
        return vulnermanagement.countVulneraffectnode(nebularGraphConfig.getSession(), "boost_all_include");
    }

    @GetMapping("/get_vulnerstatistic")
    @ApiOperation(value = "获取历史漏洞数记录", httpMethod = "GET")
    public HashMap<String, Long> getvulner_stas(@ApiParam("起始日期") @RequestParam String date_begin, @ApiParam("结束日期") @RequestParam String date_end) throws IOErrorException{
        return vulnermanagement.getvulner_stas(nebularGraphConfig.getSession(),"boost_all_include", date_begin, date_end);
    }

}
