package com.fudan.productsupport.controller;

import com.alibaba.fastjson.JSONArray;
import com.fudan.productsupport.entity.mongodb.VerifyEntity;
import com.fudan.productsupport.form.PageForm;
import com.fudan.productsupport.service.VerifyService;
import com.fudan.productsupport.utils.CommonResult;
import com.fudan.productsupport.utils.NebularGraphUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;

/**
 * @ClassName VerifyController
 * Description TODO
 * @Author WillemGavin
 * @Date 2021/10/11 16:46
 * Version 0.0.1
 */
@Slf4j
@RestController
@RequestMapping("/verify")
@Api(tags = "校验规则管理")
public class VerifyController {
    @Resource
    private VerifyService verifyService;
    @Resource
    private NebularGraphUtil nebularGraphUtil;


    /**
     * TODO 通过tag校验规则列表
     * @param tag
     * @param page
     * @param rows
     * @param sortBy
     * @param sortDirection
     * @return
     */
    @GetMapping("/list")
    @ApiOperation(value = "获取校验规则列表", httpMethod = "GET")
    public CommonResult<Page<VerifyEntity>> list(
            @ApiParam(value = "查询的tag", required = false) @RequestParam(value = "tag", required = false) String tag,
            @ApiParam(value = "页码（从1开始）", required = true, defaultValue = "1") @RequestParam int page,
            @ApiParam(value = "每页最大行数", required = true, defaultValue = "10") @RequestParam int rows,
            @ApiParam(value = "排序基准字段", required = true, defaultValue = "id") @RequestParam String sortBy,
            @ApiParam(value = "排序方向（“DESC”为降序）", defaultValue = "ASE") @RequestParam String sortDirection
    ){
        PageForm pageForm = new PageForm(page, rows, sortBy, sortDirection);
        CommonResult<Page<VerifyEntity>> result = null;
        if (tag == null || tag.length() == 0)
            result = CommonResult.success(verifyService.query(pageForm.getPageRequest()));
        else
            result = CommonResult.success(verifyService.queryByTag(tag, pageForm.getPageRequest()));
        return result;
    }

    /**
     * TODO 根据id获取校验规则
     * @param id
     * @return
     */
    @GetMapping("/info")
    @ApiOperation(value = "根据id校验规则", httpMethod = "GET")
    public CommonResult<VerifyEntity> info(@ApiParam(value = "校验标准的id", required = true) @RequestParam String id){
        return CommonResult.success(verifyService.queryById(id));
    }

    /**
     * TODO 保存/更新校验规则
     * @param verifyEntity
     * @return
     */
    @PostMapping("/save")
    @ApiOperation(value = "保存/更新校验规则", httpMethod = "POST")
    public CommonResult<String> save(@RequestBody VerifyEntity verifyEntity){
        verifyService.save(verifyEntity);
        return CommonResult.success("保存成功！");
    }

    /**
     * TODO 删除校验规则
     * @param ids
     * @return
     */
    @DeleteMapping("/delete")
    @ApiOperation(value = "删除校验规则", httpMethod = "DELETE")
    public CommonResult<String> delete(@RequestBody List<String> ids){
        verifyService.delete(ids);
        return CommonResult.success(null, "删除成功！");
    }

    /**
     * TODO 获取所有的Tags
     * @return
     */
    @GetMapping("/getTags")
    @ApiOperation(value = "获取所有的Tag", httpMethod = "GET")
    public CommonResult<JSONArray> getTags() {
        return CommonResult.success(nebularGraphUtil.getTags());
    }

    /**
     * TODO 获取所有的TagDescription
     * @return
     */
    @GetMapping("/getTagDescription")
    @ApiOperation(value = "获取所有的TagDescription", httpMethod = "GET")
    public CommonResult<JSONArray> getTagDescription(
            @ApiParam(value = "查询的tag", required = true) @RequestParam String tag) {
        return CommonResult.success(nebularGraphUtil.getTagDescription(tag));
    }
}
