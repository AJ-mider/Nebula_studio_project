package com.fudan.productsupport.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

/**
 * @ClassName WebSecurityConfig
 * Description TODO Web安全配置
 * @Author WillemGavin
 * @Date 2021/6/26 17:15
 * Version 0.0.1
 */
@Configuration
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                // 关闭csrf保护功能（跨域访问）
                .csrf().disable()
//                .authorizeRequests()
//                .antMatchers("/api/**").permitAll()//访问API下无需登录认证权限
                ;
    }
}
