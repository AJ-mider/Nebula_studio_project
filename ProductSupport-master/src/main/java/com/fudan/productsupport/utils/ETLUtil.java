package com.fudan.productsupport.utils;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fudan.productsupport.utils.Exception.ApiException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import javax.script.Invocable;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.flipkart.zjsonpatch.*;
import java.util.*;

/**
 * @ClassName CodeExecuteUtil
 * Description TODO
 * @Author WillemGavin
 * @Date 2021/8/7 11:04
 * Version 0.0.1
 */

@Slf4j
@Component
public class ETLUtil {

    /**
     * 执行javascript代码，输入参数名为data，输入输出格式均为jsonobject
     * @param code
     * @param data
     * @return
     */
    public String executeJavaScript(String code, String data) {
        String result = null;
        ScriptEngineManager manager = new ScriptEngineManager();
        ScriptEngine engine = manager.getEngineByName("JavaScript");
        try {
            engine.eval("function getJson(data) {" + code + "}");
            Invocable funcInvoke = (Invocable)engine;
            Object obj = funcInvoke.invokeFunction("getJson", data);
            result = obj.toString();
//            log.info("result:" + obj);
        } catch (ScriptException | NoSuchMethodException e) {
            throw new ApiException("函数执行失败，请检查！");
        }
        return result;
    }

    /**
     * json数据对比工具
     * @param oldJson old data
     * @param newJson new data
     * @param idName key
     * @return
     * @throws JsonProcessingException
     */
    public JSONObject jsonDiff(JSONArray oldJson, JSONArray newJson, String idName) throws JsonProcessingException {
//        System.out.println(jsonArray1);
        // 转化为 id：jsonobj格式
        JSONObject source_t = new JSONObject();
        for(int i = 0; i < oldJson.size(); i++) {
            source_t.put((String) oldJson.getJSONObject(i).get(idName), oldJson.getJSONObject(i));
        }
        String jsonString1 = JSONObject.toJSONString(source_t);
//        System.out.println(jsonString1);

        JSONObject target_t = new JSONObject();
        for(int i = 0; i < newJson.size();i++) {
            target_t.put((String) newJson.getJSONObject(i).get(idName),newJson.getJSONObject(i));
        }
        String jsonString2 = JSONObject.toJSONString(target_t);

        ObjectMapper mapper = new ObjectMapper();
        JsonNode source = mapper.readTree(jsonString1);
        mapper = new ObjectMapper();
        JsonNode target = mapper.readTree(jsonString2);

        JSONObject rst = new JSONObject();

//        EnumSet<DiffFlags> flags = DiffFlags.dontNormalizeOpIntoMoveAndCopy().clone();
        long startTime = System.currentTimeMillis();
        JsonNode patch = JsonDiff.asJson(source, target);
//        System.out.println(mapper.writeValueAsString(patch));
        JSONArray addArray = new JSONArray();
        JSONArray replaceArray = new JSONArray();
        ArrayList<String> removeArray = new ArrayList<>();
        Set<String> addSet = new HashSet<>();
        Set<String> replaceSet = new HashSet<>();
        Set<String> removeSet = new HashSet<>();
        for (JsonNode jsonNode : patch) {
            if (!jsonNode.isObject()) throw new InvalidJsonPatchException("Invalid JSON Patch payload (not an object)");
            String operation = jsonNode.get("op").textValue();
            String path = jsonNode.get("path").textValue();
            String num = path.split("/")[1];
            JsonNode item;
            String json;
            JSONObject jsonObject;
            switch (operation) {
                case "remove":
                    if (removeSet.contains(num)) {
                        continue;
                    }
                    removeSet.add(num);
                    String item_id = source.get(num).get(idName).textValue();
                    removeArray.add(item_id);
                    break;
                case "add":
                    if (addSet.contains(num)) {
                        continue;
                    }
                    addSet.add(num);
                    item = target.get(num);
                    json = mapper.writeValueAsString(item);
                    jsonObject = JSONObject.parseObject(json);
                    addArray.add(jsonObject);
                    break;
                case "replace":
                    String key = path.split("/")[2];
                    item = target.get(num);
                    ObjectNode objectNode = mapper.createObjectNode();
                    objectNode.put(idName,item.get(idName).textValue());
                    objectNode.put(key,item.get(key).textValue());
                    json = mapper.writeValueAsString(objectNode);
                    jsonObject = JSONObject.parseObject(json);
                    replaceArray.add(jsonObject);
                    break;
            }
        }
        rst.put("add", addArray);
        rst.put("replace", replaceArray);
        rst.put("remove", removeArray);
        long endTime = System.currentTimeMillis();
        log.info("程序运行时间：" + (endTime - startTime) + "ms");
        return rst;
    }
}
