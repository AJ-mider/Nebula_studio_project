package com.fudan.productsupport.controller;

import com.fudan.productsupport.service.Vulnergraph;
import com.vesoft.nebula.client.graph.exception.IOErrorException;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.io.UnsupportedEncodingException;
import java.util.List;

@RestController
@RequestMapping("/vulnerg")
@Api(tags = "漏洞图显示")
public class VulnergraphController {
    @Resource
    private Vulnergraph vulnergraph;

    @GetMapping("/getgraph_node")
    @ApiOperation(value = "获取图中结点ID", httpMethod = "GET")
    public List<String> getgraph_node(@ApiParam("漏洞id") @RequestParam String vulner_id) throws IOErrorException, UnsupportedEncodingException {
        return vulnergraph.getvulner_graph_node(vulner_id);
    }


    @GetMapping("/getgraph_edge")
    @ApiOperation(value = "获取图中边信息", httpMethod = "GET")
    public List<String> getgraph_edge(@ApiParam("漏洞id") @RequestParam String vulner_id) throws IOErrorException, UnsupportedEncodingException {
        return vulnergraph.getvulner_graph_edge(vulner_id);
    }

}
