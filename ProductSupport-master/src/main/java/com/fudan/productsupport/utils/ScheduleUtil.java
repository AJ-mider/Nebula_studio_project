package com.fudan.productsupport.utils;

import com.fudan.productsupport.entity.ScheduleTask;
import com.fudan.productsupport.entity.mongodb.ConnectorEntity;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.scheduling.support.CronTrigger;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ScheduledFuture;

/**
 * @ClassName ScheduleUtil
 * Description TODO 定时任务工具类
 * @Author WillemGavin
 * @Date 2021/8/1 14:48
 * Version 0.0.1
 */
@Component
@Slf4j
public class ScheduleUtil {
    private static ThreadPoolTaskScheduler threadPoolTaskScheduler = new ThreadPoolTaskScheduler();
    private static Map<String, ScheduledFuture<?>> scheduledFutureMap = new HashMap<>();

    static {
        threadPoolTaskScheduler.initialize();
        log.info("定时任务线程池启动");
    }

    /**
     * TODO 启动定时任务
     * @param scheduleTask
     * @param corn
     * @return
     */
    public static boolean start(ScheduleTask scheduleTask, String corn){
        log.info("启动定时任务，taskId：" + scheduleTask.getId());
        ScheduledFuture<?> scheduledFuture = threadPoolTaskScheduler.schedule(
                scheduleTask, new CronTrigger(corn));

        if(scheduledFutureMap.containsKey(scheduleTask.getId()))
            return false;
        scheduledFutureMap.put(scheduleTask.getId(), scheduledFuture);
        return true;
    }

    /**
     * TODO 取消定时任务
     * @param scheduleTask
     * @return
     */
    public static boolean stop(ScheduleTask scheduleTask){
        log.info("停止定时任务，taskId：" + scheduleTask.getId());
        ScheduledFuture<?> scheduledFuture = scheduledFutureMap.get(scheduleTask.getId());
        if(scheduledFuture != null && !scheduledFuture.isCancelled()){
            scheduledFuture.cancel(false);
        }
        if(!scheduledFutureMap.containsKey(scheduleTask.getId()))
            return false;
        scheduledFutureMap.remove(scheduleTask.getId());
        return true;
    }

    /**
     * TODO 重置
     * @param scheduleTask
     * @param corn
     * @return
     */
    public static boolean reset(ScheduleTask scheduleTask, String corn){
        //先取消定时任务
        stop(scheduleTask);
        //然后启动新的定时任务
        start(scheduleTask, corn);
        return true;
    }
}
