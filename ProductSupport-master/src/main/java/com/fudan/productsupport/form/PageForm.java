package com.fudan.productsupport.form;

import com.fudan.productsupport.utils.Constant;
import com.fudan.productsupport.utils.Exception.ApiException;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;

/**
 * @ClassName Page
 * Description TODO 页面查询表单
 * @Author WillemGavin
 * @Date 2021/6/23 22:40
 * Version 0.0.1
 */
@Data
@ApiModel("分页表单")
public class PageForm {

    @ApiModelProperty("当前页面（从1开始）")
    private int page;

    @ApiModelProperty("每页最大行数")
    private int rows;

    @ApiModelProperty("排序基准字段")
    private String sortBy;

    @ApiModelProperty("排序方向（”DESC“为降序）")
    private String sortDirection;

    public PageForm(int page, int rows, String sortBy, String sortDirection) {
        this.page = page;
        this.rows = rows;
        this.sortBy = sortBy;
        this.sortDirection = sortDirection;
    }

    /**
     * 生成页面请求实例
     * @return
     */
    public PageRequest getPageRequest(){
        if(page < 1)
            throw new ApiException("页号不能小于1！");

        Sort sort = Sort.by(sortBy).ascending();
        if (sortDirection.equals(Constant.DESC)) {
            sort = sort.descending();
        }
        return PageRequest.of(page - 1, rows, sort);
    }
}
