package com.fudan.productsupport.controller;

import com.fudan.productsupport.entity.mongodb.ClassificationRelationshipEntity;
import com.fudan.productsupport.form.PageForm;
import com.fudan.productsupport.service.ClassificationRelationshipService;
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
 * @ClassName RoleRelationshipController
 * Description TODO
 * @Author WillemGavin
 * @Date 2022/5/14 15:40
 * Version 0.0.1
 */
@Slf4j
@RestController
@RequestMapping("/classificationRelationship")
@Api(tags = "类别关联信息管理")
public class ClassificationRelationshipController {
    @Resource
    private ClassificationRelationshipService classificationRelationshipService;

    /**
     * 保存类别关联信息
     * @param classificationRelationshipEntity
     * @return
     */
    @PostMapping("/save")
    @ApiOperation(value = "保存类别关联信息", httpMethod = "POST")
    public CommonResult<String> save(@RequestBody ClassificationRelationshipEntity classificationRelationshipEntity){
        classificationRelationshipService.save(classificationRelationshipEntity);
        return CommonResult.success("类别关联信息保存成功");
    }
    /**
     * 删除类别关联信息
     * @param ids
     * @return
     */
    @PostMapping("/delete")
    @ApiOperation(value = "删除类别关联信息", httpMethod = "POST")
    public CommonResult<String> delete(@ApiParam("类别关联信息ids") List<String> ids){
        classificationRelationshipService.delete(ids);
        return CommonResult.success("类别关联信息删除成功");
    }

    /**
     * 获取所有类别关联信息
     * @return
     */
    @GetMapping("/list")
    @ApiOperation(value = "获取所有类别关联信息", httpMethod = "GET")
    public CommonResult<Page<ClassificationRelationshipEntity>> list(
            @ApiParam(value = "页码（从1开始）", required = true, defaultValue = "1") @RequestParam int page,
            @ApiParam(value = "每页最大行数", required = true, defaultValue = "10") @RequestParam int rows,
            @ApiParam(value = "排序基准字段", required = true, defaultValue = "id") @RequestParam String sortBy,
            @ApiParam(value = "排序方向（“DESC”为降序）", defaultValue = "ASE") @RequestParam String sortDirection
    ){
        PageForm pageForm = new PageForm(page, rows, sortBy, sortDirection);
        return CommonResult.success(classificationRelationshipService.queryAll(pageForm.getPageRequest()));
    }

    /**
     * 查询类别关联信息
     * @return
     */
    @PostMapping("/list")
    @ApiOperation(value = "查询类别关联信息", httpMethod = "POST")
    public CommonResult<Page<ClassificationRelationshipEntity>> list(
            @RequestBody ClassificationRelationshipEntity classificationRelationshipEntity,
            @ApiParam(value = "页码（从1开始）", required = true, defaultValue = "1") @RequestParam int page,
            @ApiParam(value = "每页最大行数", required = true, defaultValue = "10") @RequestParam int rows,
            @ApiParam(value = "排序基准字段", required = true, defaultValue = "id") @RequestParam String sortBy,
            @ApiParam(value = "排序方向（“DESC”为降序）", defaultValue = "ASE") @RequestParam String sortDirection
    ){
        PageForm pageForm = new PageForm(page, rows, sortBy, sortDirection);
        return CommonResult.success(classificationRelationshipService.query(classificationRelationshipEntity,pageForm.getPageRequest()));
    }
}
