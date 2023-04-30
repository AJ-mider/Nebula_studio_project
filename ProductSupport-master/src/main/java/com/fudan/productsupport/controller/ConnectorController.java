package com.fudan.productsupport.controller;
import com.fudan.productsupport.form.PageForm;
import com.fudan.productsupport.entity.mongodb.ConnectorEntity;
import com.fudan.productsupport.form.ConnectorForm;
import com.fudan.productsupport.service.ConnectorService;
import com.fudan.productsupport.utils.CommonResult;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;

/**
 * @ClassName ControllerController
 * Description TODO 连接器控制层
 * @Author WillemGavin
 * @Date 2021/6/26 10:11
 * Version 0.0.1
 */
@RestController
@RequestMapping("/connector")
@Api(tags = "连接器管理")
public class ConnectorController {
    @Resource
    private ConnectorService connectorService;

    /**
    * @Description: TODO 保存连接器接口
    * @Param: [connectorForm]
    * @return: com.fudan.productsupport.utils.CommonResult<java.lang.String>
    * @Author: WillemGavin
    * @Date: 2021/6/26 15:24
    */
    @PostMapping("/save")
    @ApiOperation(value = "保存连接器", httpMethod = "POST")
    public CommonResult<String> save(
            @RequestBody ConnectorForm connectorForm){
        return CommonResult.success(connectorService.save(connectorForm), "连接器保存成功！");
    }

    /***
    * @Description: TODO 获取连接器
    * @Param: [pageForm]
    * @return: com.fudan.productsupport.utils.CommonResult<org.springframework.data.domain.Page<com.fudan.productsupport.entity.mongodb.ConnectorEntity>>
    * @Author: WillemGavin
    * @Date: 2021/6/26 15:33
    */
    @GetMapping("/list")
    @ApiOperation(value = "获取连接器", httpMethod = "GET")
    public CommonResult<Page<ConnectorEntity>> list(
            @ApiParam(value = "页码（从1开始）", required = true, defaultValue = "1") @RequestParam int page,
            @ApiParam(value = "每页最大行数", required = true, defaultValue = "10") @RequestParam int rows,
            @ApiParam(value = "排序基准字段", required = true, defaultValue = "id") @RequestParam String sortBy,
            @ApiParam(value = "排序方向（“DESC”为降序）", defaultValue = "ASE") @RequestParam String sortDirection){
        PageForm pageForm = new PageForm(page, rows, sortBy, sortDirection);
        return CommonResult.success(connectorService.queryAll(pageForm.getPageRequest()), "连接器获取成功！");
    }

    /***
    * @Description: TODO 通过id查询连接器
    * @Param: [id]
    * @return: com.fudan.productsupport.utils.CommonResult<com.fudan.productsupport.entity.mongodb.ConnectorEntity>
    * @Author: WillemGavin
    * @Date: 2021/6/26 15:34
    */
    @GetMapping("/info")
    @ApiOperation(value = "通过Id查询连接器", httpMethod = "GET")
    public CommonResult<ConnectorEntity> info(
            @ApiParam(value = "连接器id", required = true) @RequestParam String id){
        return CommonResult.success(connectorService.queryById(id), "连接器查询成功！");
    }

    /***
    * @Description: TODO 条件查询连接器
    * @Param: [connectorEntity, pageForm]
    * @return: com.fudan.productsupport.utils.CommonResult<org.springframework.data.domain.Page<com.fudan.productsupport.entity.mongodb.ConnectorEntity>>
    * @Author: WillemGavin
    * @Date: 2021/6/26 15:59
    */
    @PostMapping("/info")
    @ApiOperation(value = "条件查询连接器", httpMethod = "POST")
    public CommonResult<Page<ConnectorEntity>> info(
            @RequestBody ConnectorEntity connectorEntity,
            @ApiParam(value = "页码（从1开始）", required = true, defaultValue = "1") @RequestParam int page,
            @ApiParam(value = "每页最大行数", required = true, defaultValue = "10") @RequestParam int rows,
            @ApiParam(value = "排序基准字段", required = true, defaultValue = "id") @RequestParam String sortBy,
            @ApiParam(value = "排序方向（“DESC”为降序）", defaultValue = "ASE") @RequestParam String sortDirection){
        PageForm pageForm = new PageForm(page, rows, sortBy, sortDirection);
        return CommonResult.success(connectorService.query(connectorEntity, pageForm.getPageRequest()), "连接器查询成功！");
    }

    /***
    * @Description: TODO 更新连接器
    * @Param: [connectorEntity]
    * @return: com.fudan.productsupport.utils.CommonResult<java.lang.String>
    * @Author: WillemGavin
    * @Date: 2021/6/26 23:13
    */
    @PostMapping("/update")
    @ApiOperation(value = "更新连接器", httpMethod = "POST")
    public CommonResult<String> update(@RequestBody ConnectorEntity connectorEntity){
        connectorService.update(connectorEntity);
        return CommonResult.success(null, "更新成功！");
    }
    
    /***
    * @Description: TODO 删除连接器
    * @Param: [ids]
    * @return: com.fudan.productsupport.utils.CommonResult<java.lang.String>
    * @Author: WillemGavin
    * @Date: 2021/6/26 23:29
    */
    @DeleteMapping("/delete")
    @ApiOperation(value = "删除连接器", httpMethod = "DELETE")
    public CommonResult<String> delete(@RequestBody List<String> ids){
        connectorService.delete(ids);
        return CommonResult.success(null, "删除成功！");
    }

    @GetMapping("/request")
    @ApiOperation(value = "访问连接器", httpMethod = "GET")
    public CommonResult request(
            @ApiParam(value = "连接器id", required = true) @RequestParam String connectorId){
        return connectorService.request(connectorId);
    }

    /**
     * 运行连接器定时任务
     * @param connectorId
     * @param cron
     * @return
     */
    @GetMapping("/run")
    @ApiOperation(value = "运行连接器", httpMethod = "GET")
    public CommonResult<String> run(
            @ApiParam(value = "连接器id", required = true) @RequestParam String connectorId,
            @ApiParam(value = "cron表达式", required = true, defaultValue = "-1") @RequestParam String cron){
        if(!connectorService.run(connectorId, cron)){
            return CommonResult.failed("任务已存在！");
        }
        return CommonResult.success("连接器已运行！");
    }

    /**
     * 暂停连接器定时任务
     * @param connectorId
     * @return
     */
    @GetMapping("/stop")
    @ApiOperation(value = "暂停连接器", httpMethod = "GET")
    public CommonResult<String> stop(
            @ApiParam(value = "连接器id", required = true) @RequestParam String connectorId) {
        if(!connectorService.stop(connectorId)){
            return CommonResult.failed("任务不存在！");
        }
        return CommonResult.success("连接器已暂停！");
    }
}
