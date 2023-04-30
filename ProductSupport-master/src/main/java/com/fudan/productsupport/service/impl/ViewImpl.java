package com.fudan.productsupport.service.impl;

import com.fudan.productsupport.service.View;
import com.fudan.productsupport.service.Vulnermanagement;
import com.vesoft.nebula.client.graph.data.ResultSet;
import com.vesoft.nebula.client.graph.data.ValueWrapper;
import com.vesoft.nebula.client.graph.exception.IOErrorException;
import com.vesoft.nebula.client.graph.net.Session;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Service
@ResponseBody
@Slf4j
public class ViewImpl implements View {
    @Resource
    private Vulnermanagement vulnermanagement;
    @Override
    public ArrayList<HashMap<String, String>> get_View(Session s, String space, String tagname) throws IOErrorException, UnsupportedEncodingException {
        s.execute("Use " + space);
        List<String> idlist = new ArrayList<>();
        if(tagname.equals("vulner")){
            idlist = vulnermanagement.getvulner_id(s, space);
        } else if(tagname.equals("Library")){
            idlist = vulnermanagement.getproduct_id(s, space);
        }
        ArrayList<HashMap<String, String>> viewList = new ArrayList<>();
        for (String node_id: idlist) {
            ResultSet r = s.execute("MATCH (v)  WHERE id(v) == \"" + node_id + "\" RETURN v;");
            HashMap<String, ValueWrapper> view;
            view = r.colValues("v").get(0).asNode().properties(tagname);
            HashMap<String, String> ret = new HashMap<>();
            ret.put("id", node_id);
            for (String key: view.keySet()) {
                ret.put(key, view.get(key).toString());
            }
            if(tagname.equals("vulner")){
                String countimpactnode = "GET SUBGRAPH WITH PROP 1 STEPS FROM \"" + node_id + "\" OUT affected YIELD VERTICES AS nodes";
                ResultSet impact_set = s.execute(countimpactnode);
                ResultSet.Record record_node = impact_set.rowValues(1);
                List<Long> ans = new ArrayList<>();
                ans.add(0, 0L);
                ans.add(1, 0L);
                ans.add(2, 0L);
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
                ret.put("affect_File", ans.get(0).toString());
                ret.put("affect_Library", ans.get(1).toString());
                ret.put("affect_Package", ans.get(2).toString());
            }
            viewList.add(ret);
        }

        return viewList;
    }
}
