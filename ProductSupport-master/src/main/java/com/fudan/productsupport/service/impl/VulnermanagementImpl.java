package com.fudan.productsupport.service.impl;


import com.fudan.productsupport.service.Vulnermanagement;
import com.vesoft.nebula.client.graph.data.ResultSet;
import com.vesoft.nebula.client.graph.data.ValueWrapper;
import com.vesoft.nebula.client.graph.exception.IOErrorException;
import com.vesoft.nebula.client.graph.net.Session;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ResponseBody;

import java.io.UnsupportedEncodingException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
@ResponseBody
@Slf4j
public class VulnermanagementImpl implements Vulnermanagement {
    @Override
    public List<String> countVulner(Session s,String space) throws UnsupportedEncodingException, IOErrorException {
        Date day = new Date();
        SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
        long ans = 0;
        s.execute("Use " + space);
        // String count = "submit job stats;" + "show stats";
        String count = "show stats";
        ResultSet resp = s.execute(count);
        for (int i = 0; i < resp.rowsSize(); i++) {
            ResultSet.Record record = resp.rowValues(i);
            boolean flag = false;
            for (ValueWrapper value : record.values()) {
                if (flag) {
                    ans = value.asLong();
                    break;
                }
                if (value.isString()) {
                    if (value.asString().equals("vulner")) {
                        flag = true;
                    }
                }
            }
        }
        List<String> ret = new ArrayList<>();
        String num = String.valueOf(ans);
        ret.add(num);
        ret.add(df.format(day));
        return ret;
    }

    @Override
    public List<String> getvulner_id(Session s, String space) throws IOErrorException, UnsupportedEncodingException {
        s.execute("Use "+space);
        ResultSet vulner_set = s.execute("LOOKUP ON vulner YIELD id(vertex)");
        List<String> ans = new ArrayList<>();
        int idx = 0;
        for (int i = 0; i < vulner_set.rowsSize(); i++) {
            ResultSet.Record record_vulner = vulner_set.rowValues(i);
            for (ValueWrapper value : record_vulner.values()) {
                ans.add(idx++, value.asString());
            }
        }
        return ans;
    }

    @Override
    public List<String> getproduct_id(Session s, String space) throws IOErrorException, UnsupportedEncodingException{
        s.execute("Use "+space);
        ResultSet vulner_set = s.execute("LOOKUP ON Library YIELD id(vertex)");
        List<String> ans = new ArrayList<>();
        int idx = 0;
        for (int i = 0; i < vulner_set.rowsSize(); i++) {
            ResultSet.Record record_product = vulner_set.rowValues(i);
            for (ValueWrapper value : record_product.values()) {
                ans.add(idx++, value.asString());
            }
        }
        return ans;
    }

    @Override
    public List<Long> countVulneraffectnode(Session s, String space) throws IOErrorException, UnsupportedEncodingException {
        List<String> vulner_set;
        s.execute("Use "+ space);
        vulner_set = getvulner_id(s, space);
        List<Long> ans= new ArrayList<>(3);
        ans.add(0, 0L);
        ans.add(1, 0L);
        ans.add(2, 0L);
        for (String value : vulner_set) {
            String countimpactnode = "GET SUBGRAPH WITH PROP 1 STEPS FROM \"" + value + "\" OUT affected YIELD VERTICES AS nodes";
            ResultSet impact_set = s.execute(countimpactnode);
            ResultSet.Record record_node = impact_set.rowValues(1);
            for (ValueWrapper v : record_node) {
                for (ValueWrapper node : v.asList()) {
                    if (node.asNode().tagNames().toString().equals("[File]")) {
                        ans.set(0, ans.get(0) + 1);
                    }
                    if (node.asNode().tagNames().toString().equals("[Library]")) {
                        ans.set(1, ans.get(1) + 1);
                    }
                    if (node.asNode().tagNames().toString().equals("[Package]")) {
                        ans.set(2, ans.get(2) + 1);
                    }
                }
            }
        }
        return ans;
    }

    @Override
    public HashMap<String, Long> getvulner_stas(Session s, String space, String date_begin, String date_end) throws IOErrorException {
        HashMap<String, Long> ans = new HashMap<>();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        Date d1;
        Date d2;
        try {
            d1 = sdf.parse(date_begin);
            d2 = sdf.parse(date_end);
        } catch (ParseException e) {
            throw new RuntimeException(e);
        }
        int daycount = differentDays(d1, d2);
        s.execute("Use " + space);

        for (int i = 0; i < daycount; i++) {
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(d1);
            calendar.add(Calendar.DAY_OF_MONTH, i);
            String dateStr = sdf.format(calendar.getTime());
            String get_statsNode_begin = "MATCH (v) WHERE id(v) == \"" + dateStr + "\" RETURN v.statistic_vulner.vulnerable_num AS num;";
            ResultSet r1 = s.execute(get_statsNode_begin);
            ResultSet.Record record1 = r1.rowValues(0);
            ans.put(dateStr, record1.values().get(0).asLong());
        }
        return ans;
    }

    private int differentDays(Date date1, Date date2) {
        Calendar cal1 = Calendar.getInstance();
        cal1.setTime(date1);

        Calendar cal2 = Calendar.getInstance();
        cal2.setTime(date2);
        int day1 = cal1.get(Calendar.DAY_OF_YEAR);
        int day2 = cal2.get(Calendar.DAY_OF_YEAR);

        int year1 = cal1.get(Calendar.YEAR);
        int year2 = cal2.get(Calendar.YEAR);
        if (year1 != year2) {//同一年
            int timeDistance = 0;
            for (int i = year1; i < year2; i++) {
                if (i % 4 == 0 && i % 100 != 0 || i % 400 == 0)    //闰年
                {
                    timeDistance += 366;
                } else    //不是闰年
                {
                    timeDistance += 365;
                }
            }

            return timeDistance + (day2 - day1);
        } else {// 不同年
            System.out.println("判断day2 - day1 : " + (day2 - day1));
            return day2 - day1;
        }
    }
}
