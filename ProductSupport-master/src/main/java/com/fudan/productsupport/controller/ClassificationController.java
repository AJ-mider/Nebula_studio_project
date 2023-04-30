package com.fudan.productsupport.controller;

import com.fudan.productsupport.entity.mongodb.ClassificationEntity;
import com.fudan.productsupport.service.ClassificationService;
import com.fudan.productsupport.utils.CommonResult;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;

/**
 * @ClassName RoleController
 * Description TODO
 * @Author WillemGavin
 * @Date 2022/5/14 10:39
 * Version 0.0.1
 */
@Slf4j
@RestController
@RequestMapping("/classification")
@Api(tags = "TAG类别管理")
public class ClassificationController {
    @Resource
    private ClassificationService classificationService;

    /**
     * 保存角色
     * @param classificationEntity
     * @return
     */
    @PostMapping("/save")
    @ApiOperation(value = "保存类别", httpMethod = "POST")
    public CommonResult<String> save(@RequestBody ClassificationEntity classificationEntity){
        classificationService.save(classificationEntity);
        return CommonResult.success("类别保存成功");
    }

    /**
     * 删除角色
     * @param ids
     * @return
     */
    @PostMapping("/delete")
    @ApiOperation(value = "删除类别", httpMethod = "POST")
    public CommonResult<String> delete(@ApiParam("类别ids") List<String> ids){
        classificationService.delete(ids);
        return CommonResult.success("类别删除成功");
    }

    /**
     * 获取所有角色
     * @return
     */
    @GetMapping("/list")
    @ApiOperation(value = "获取所有类别", httpMethod = "GET")
    public CommonResult<List<ClassificationEntity>> list(){
        return CommonResult.success(classificationService.getClassification());
    }
}
