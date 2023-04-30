package com.fudan.productsupport.controller;

import com.fudan.productsupport.entity.mongodb.VerifyRecordEntity;
import com.fudan.productsupport.form.PageForm;
import com.fudan.productsupport.service.VerifyRecordService;
import com.fudan.productsupport.utils.CommonResult;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;

/**
 * @ClassName VerifyRecordController
 * Description TODO
 * @Author WillemGavin
 * @Date 2021/10/16 21:16
 * Version 0.0.1
 */
@Slf4j
@RestController
@RequestMapping("/verifyRecord")
@Api(tags = "校验记录管理")
public class VerifyRecordController {
    @Resource
    private VerifyRecordService verifyRecordService;

    /**
     * TODO 获取校验记录列表
     * @param page
     * @param rows
     * @param sortBy
     * @param sortDirection
     * @return
     */
    @GetMapping("/list")
    @ApiOperation(value = "获取校验记录列表", httpMethod = "GET")
    public CommonResult<Page<VerifyRecordEntity>> list(
            @ApiParam(value = "页码（从1开始）", required = true, defaultValue = "1") @RequestParam int page,
            @ApiParam(value = "每页最大行数", required = true, defaultValue = "10") @RequestParam int rows,
            @ApiParam(value = "排序基准字段", required = true, defaultValue = "id") @RequestParam String sortBy,
            @ApiParam(value = "排序方向（“DESC”为降序）", defaultValue = "ASE") @RequestParam String sortDirection
    ){
        PageForm pageForm = new PageForm(page, rows, sortBy, sortDirection);
        return CommonResult.success(verifyRecordService.queryAll(pageForm.getPageRequest()));
    }

    /**
     * TODO 删除校验记录
     * @param ids
     * @return
     */
    @DeleteMapping("/delete")
    @ApiOperation(value = "删除校验记录", httpMethod = "DELETE")
    public CommonResult<String> delete(@RequestBody List<String> ids){
        verifyRecordService.delete(ids);
        return CommonResult.success(null, "删除成功！");
    }
}
