package com.fudan.productsupport.config;

import com.vesoft.nebula.client.graph.NebulaPoolConfig;
import com.vesoft.nebula.client.graph.data.HostAddress;
import com.vesoft.nebula.client.graph.exception.AuthFailedException;
import com.vesoft.nebula.client.graph.exception.ClientServerIncompatibleException;
import com.vesoft.nebula.client.graph.exception.IOErrorException;
import com.vesoft.nebula.client.graph.exception.NotValidConnectionException;
import com.vesoft.nebula.client.graph.net.NebulaPool;
import com.vesoft.nebula.client.graph.net.Session;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.UnsupportedEncodingException;
import java.net.UnknownHostException;
import java.util.Collections;
import java.util.List;

/**
 * @ClassName NebularGraphhConfig
 * Description TODO
 * @Author WillemGavin
 * @Date 2021/8/12 16:16
 * Version 0.0.1
 */
@Configuration
@Slf4j
public class NebularGraphConfig {


    @Bean
    public Session getSession(){
        NebulaPoolConfig nebulaPoolConfig = new NebulaPoolConfig();
        nebulaPoolConfig.setMaxConnSize(10);
        String uri = "123.60.77.114";
//       String uri = "127.0.0.1";
//        error : No extra connection: Unable to activate object    check the version of Nebula client
        int port = 9669;
        String username = "root";
        String password = "nebula";
        boolean reconnect = true;

        Session session = null;

        List<HostAddress> addresses = Collections.singletonList(new HostAddress(uri, port));
        NebulaPool pool = new NebulaPool();
        try {
            pool.init(addresses, nebulaPoolConfig);
        } catch (UnknownHostException e) {
            log.warn("初始化nebular连接池失败！");
            e.printStackTrace();
        }
        try {
            session = pool.getSession(username, password, reconnect);
        } catch (NotValidConnectionException | IOErrorException | AuthFailedException | ClientServerIncompatibleException e) {
            log.warn("nebuar连接失败！");
            e.printStackTrace();
        }
        return session;
    }
}
