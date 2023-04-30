package com.fudan.productsupport.controller;

import com.fudan.productsupport.service.View;
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
import java.util.ArrayList;
import java.util.HashMap;

@RestController
@RequestMapping("/view")
@Api(tags = "视图")
public class ViewController {
    @Resource
    private View view;

    @Resource
    private NebularGraphConfig nebularGraphConfig;

    @GetMapping("/get_View")
    @ApiOperation(value = "获取视图", httpMethod = "GET")
    public ArrayList<HashMap<String, String>> get_vulnerView(@ApiParam("结点类型") @RequestParam String tagname) throws IOErrorException, UnsupportedEncodingException {
        return view.get_View(nebularGraphConfig.getSession(),"boost_all_include", tagname);
    }
}
