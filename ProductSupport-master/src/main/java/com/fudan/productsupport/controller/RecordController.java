package com.fudan.productsupport.controller;

import com.fudan.productsupport.entity.mongodb.RecordEntity;
import com.fudan.productsupport.form.PageForm;
import com.fudan.productsupport.service.RecordService;
import com.fudan.productsupport.utils.CommonResult;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import javax.annotation.Resource;
import java.util.Date;
import java.util.List;

/**
 * @ClassName RecordController
 * Description TODO
 * @Author WillemGavin
 * @Date 2021/7/30 16:10
 * Version 0.0.1
 */
@Slf4j
@RestController
@RequestMapping("/record")
@Api(tags = "数据记录管理")
public class RecordController {
    @Resource
    private RecordService recordService;

    /**
     * TODO 通过连接器id获取（查询）数据记录
     * @param page
     * @param rows
     * @param sortBy
     * @param sortDirection
     * @return
     */
    @GetMapping("/list")
    @ApiOperation(value = "获取数据记录", httpMethod = "GET")
    public CommonResult<Page<RecordEntity>> list(
            @ApiParam(value = "连接器id", required = true) @RequestParam String connectorId,
            @ApiParam(value = "页码（从1开始）", required = true, defaultValue = "1") @RequestParam int page,
            @ApiParam(value = "每页最大行数", required = true, defaultValue = "10") @RequestParam int rows,
            @ApiParam(value = "排序基准字段", required = true, defaultValue = "id") @RequestParam String sortBy,
            @ApiParam(value = "排序方向（“DESC”为降序）", defaultValue = "ASE") @RequestParam String sortDirection
    ){
        PageForm pageForm = new PageForm(page, rows, sortBy, sortDirection);
        return CommonResult.success(recordService.queryByConnectorId(connectorId, pageForm.getPageRequest()));
    }

    /**
     * TODO 获取（查询）数据记录
     * @param recordEntity
     * @param page
     * @param rows
     * @param sortBy
     * @param sortDirection
     * @param startTime
     * @param endTime
     * @return
     */
    @PostMapping("/list")
    @ApiOperation(value = "获取数据记录", httpMethod = "POST")
    public CommonResult<Page<RecordEntity>> list(
            @RequestBody RecordEntity recordEntity,
            @ApiParam(value = "页码（从1开始）", required = true, defaultValue = "1") @RequestParam int page,
            @ApiParam(value = "每页最大行数", required = true, defaultValue = "10") @RequestParam int rows,
            @ApiParam(value = "排序基准字段", required = true, defaultValue = "id") @RequestParam String sortBy,
            @ApiParam(value = "排序方向（“DESC”为降序）", defaultValue = "ASE") @RequestParam String sortDirection,
            @ApiParam(value = "开始日期") @RequestParam(value = "startTime", required = false) Date startTime,
            @ApiParam(value = "截至日期") @RequestParam(value = "endTime", required = false) Date endTime
            ){
        PageForm pageForm = new PageForm(page, rows, sortBy, sortDirection);
        return CommonResult.success(recordService.query(recordEntity, pageForm.getPageRequest(), startTime, endTime));
    }

    /**
     * 删除数据记录
     * @param ids
     * @return
     */
    @DeleteMapping("/delete")
    @ApiOperation(value = "删除数据记录", httpMethod = "DELETE")
    public CommonResult<String> delete(@RequestBody List<String> ids){
        recordService.delete(ids);
        return CommonResult.success(null, "删除成功！");
    }
}
