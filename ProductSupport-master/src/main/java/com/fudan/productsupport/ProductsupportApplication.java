package com.fudan.productsupport;

import com.fudan.productsupport.service.impl.VulnermanagementImpl;
import com.fudan.productsupport.config.NebularGraphConfig;
import com.vesoft.nebula.client.graph.exception.IOErrorException;
import com.vesoft.nebula.client.graph.net.Session;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import springfox.documentation.oas.annotations.EnableOpenApi;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@EnableOpenApi
@EnableConfigurationProperties
@SpringBootApplication
@EnableWebMvc

public class ProductsupportApplication {

    public static void main(String[] args) {
        VulnermanagementImpl vulnermanagement = new VulnermanagementImpl();
        NebularGraphConfig nebularGraphConfig = new NebularGraphConfig();
        ScheduledExecutorService ses = Executors.newScheduledThreadPool(5);
        //按照固定频率执行，每隔1天跑一次
        ses.scheduleAtFixedRate(new Runnable() {
            @Override
            public void run() {
                String stats = "submit job stats;";
                Session s = nebularGraphConfig.getSession();
                try {
                    s.execute(stats);
                } catch (IOErrorException e) {
                    e.printStackTrace();
                }
                List<String> ans = new ArrayList<>();
                try {
                    ans = vulnermanagement.countVulner(s, "boost_all_include");
                } catch (UnsupportedEncodingException | IOErrorException e) {
                    e.printStackTrace();
                }
                String insert_STATS = "INSERT VERTEX statistic_vulner (vulnerable_num) VALUES \"" + ans.get(1) + "\":("+ans.get(0)+")";
                try {
                    s.execute(insert_STATS);
                } catch (IOErrorException e) {
                    e.printStackTrace();
                }
            }
        }, 0, 1, TimeUnit.DAYS);
        SpringApplication.run(ProductsupportApplication.class, args);
    }
}
