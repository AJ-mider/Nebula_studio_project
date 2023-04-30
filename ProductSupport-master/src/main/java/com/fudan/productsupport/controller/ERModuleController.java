package com.fudan.productsupport.controller;

import com.alibaba.fastjson.JSONArray;
import com.fudan.productsupport.entity.mongodb.ERModuleEntity;
import com.fudan.productsupport.service.ERModuleService;
import com.fudan.productsupport.service.RecordService;
import com.fudan.productsupport.utils.CommonResult;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;

/**
 * @ClassName ERModuleController
 * Description TODO
 * @Author WillemGavin
 * @Date 2021/8/18 11:43
 * Version 0.0.1
 */

@Slf4j
@RestController
@RequestMapping("/module")
@Api(tags = "实体/关系抽取模型")
public class ERModuleController {
    @Resource
    private ERModuleService erModuleService;
    @Resource
    private RecordService recordService;
    /**
     * TODO 保存模型
     * @param erModuleEntity
     * @return
     */
    @PostMapping("/save")
    @ApiOperation(value = "保存模型", httpMethod = "POST")
    public CommonResult<String> save(@RequestBody ERModuleEntity erModuleEntity){
        return CommonResult.success(erModuleService.save(erModuleEntity));
    }

    /**
     * TODO 通过连接器id获取模型
     * @param connectorId
     * @return
     */
    @GetMapping("/list")
    @ApiOperation(value = "通过连接器id获取模型", httpMethod = "GET")
    public CommonResult<List<ERModuleEntity>> list(@ApiParam("连接器id") @RequestParam String connectorId){
        return CommonResult.success(erModuleService.queryByConnectorId(connectorId));
    }

    /**
     * TODO 通过连接器id获取模型
     * @param id
     * @return
     */
    @GetMapping("/info")
    @ApiOperation(value = "通过id获取模型", httpMethod = "GET")
    public CommonResult<ERModuleEntity> info(@ApiParam("模型id") @RequestParam String id){
        return CommonResult.success(erModuleService.queryById(id));
    }


    /**
     * 删除模型
     * @param ids
     * @return
     */
    @DeleteMapping("/delete")
    @ApiOperation(value = "删除模型", httpMethod = "DELETE")
    public CommonResult<String> delete(@ApiParam("连接器ids") @RequestBody List<String> ids){
        erModuleService.delete(ids);
        return CommonResult.success(null, "删除成功！");
    }

    /**
     * 运行数据任务
     * @param recordId
     * @return
     */
    @GetMapping("/run")
    @ApiOperation(value = "运行数据任务", httpMethod = "GET")
    public CommonResult<String> run(@ApiParam("记录的id") @RequestParam String recordId){
        erModuleService.dataHandle(recordService.queryById(recordId));
        return CommonResult.success("数据处理任务运行成功！");
    }

    /**
     * 抽取函数测试
     * @param recordId
     * @param code
     * @return
     */
    @PostMapping("/functionTest")
    @ApiOperation(value = "测试ER抽取函数", httpMethod = "POST")
    public CommonResult<JSONArray> functionTest(
            @ApiParam(value = "记录id") @RequestParam String recordId,
            @RequestBody String code
    ){
        return CommonResult.success(erModuleService.codeTest(recordId, code));
    }
}
