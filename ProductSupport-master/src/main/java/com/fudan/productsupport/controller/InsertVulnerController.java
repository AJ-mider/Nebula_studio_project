package com.fudan.productsupport.controller;

import com.fudan.productsupport.config.NebularGraphConfig;
import com.fudan.productsupport.service.TestInsertVulner;
import com.vesoft.nebula.client.graph.exception.IOErrorException;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;

@RestController
@RequestMapping("/insertVulner")
@Api(tags = "插入漏洞")
public class InsertVulnerController {
    @Resource
    private TestInsertVulner testInsertVulner;

    @Resource
    private NebularGraphConfig nebularGraphConfig;

    @PostMapping("/inset_vulner")
    @ApiOperation(value = "插入漏洞", httpMethod = "POST")
    public void insertTest(@ApiParam(value = "漏洞id") @RequestParam String vulner_id,
                           @ApiParam(value = "漏洞描述") @RequestParam String summary,
                           @ApiParam(value = "发布日期") @RequestParam String published,
                           @ApiParam(value = "漏洞所属文件id") @RequestParam String file_id) throws IOErrorException {
        testInsertVulner.Insert_vulner(nebularGraphConfig.getSession(), "AllProjects", vulner_id, summary, published, file_id);
    }

}
