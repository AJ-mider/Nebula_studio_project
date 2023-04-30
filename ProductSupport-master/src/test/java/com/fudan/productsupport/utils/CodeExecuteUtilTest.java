package com.fudan.productsupport.utils;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FileUtils;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.stereotype.Component;
import org.springframework.util.ResourceUtils;


import java.io.*;


@SpringBootTest
@Component
@Slf4j
class CodeExecuteUtilTest {
    @Autowired
    private ETLUtil ETLUtil;

    @Test
    void javaScript() throws IOException {
        String chipCode = "    // 将数据转化为json\n" +
                "    var jsonObj = JSON.parse(data);\n" +
                "    // console.log(jsonObj);\n" +
                "    var chipJson = JSON.stringify(jsonObj, ['chip_id','chip_name'], '  ')\n" +
                "    return chipJson";
        String componentCode = "    // 将数据转化为json\n" +
                "    var jsonObj = JSON.parse(data);\n" +
                "    var componentJson = [];\n" +
                "    for(k in jsonObj){\n" +
                "         for(m in jsonObj[k]['components']){\n" +
                "                componentJson.push(jsonObj[k]['components'][m]);\n" +
                "        }\n" +
                "    }" +
                "    return JSON.stringify(componentJson)";
        String relationCode = "    // 将数据转化为json\n" +
                "    var jsonObj = JSON.parse(data);" +
                "    var chip_component_relationJson= [];" +
                "    for(k in jsonObj){\n" +
                "        for(m in jsonObj[k]){\n" +
                "            if(m === 'components'){\n" +
                "                for(n in jsonObj[k][m]){\n" +
                "                    chip_component_relationJson.push({from:jsonObj[k]['chip_id'],to:jsonObj[k][m][n]['component_id']})\n" +
                "                }\n" +
                "            }\n" +
                "        }\n" +
                "    }" +
                "    return JSON.stringify(chip_component_relationJson)";

        String regionCode = "    // 将数据转化为json\n" +
                "    var jsonObj = JSON.parse(data);" +
                "    var result = [];" +
                "    for(k in jsonObj){\n" +
                "        result.push({id:jsonObj[k]['id'], region:jsonObj[k]['region'], attr01:jsonObj[k]['01attr'], attr02:jsonObj[k]['02attr'], attr03:jsonObj[k]['03attr']})" +
                "    }" +
                "    return JSON.stringify(result)";

        File jsonFile = null;
//        try {
//            jsonFile = ResourceUtils.getFile("classpath:chip.json");
//            String str = FileUtils.readFileToString(jsonFile);
            String str = "[{\n" +
                    "\t\"chip_id\": \"chip-1\",\n" +
                    "\t\"chip_name\": \"电源管理芯片\",\n" +
                    "\t\"components\": [{\n" +
                    "\t\t\"component_id\": \"component-1\",\n" +
                    "\t\t\"component_name\": \"电源管理组件\"\n" +
                    "\t}]\n" +
                    "},\n" +
                    "{\n" +
                    "    \"chip_id\": \"chip-2\",\n" +
                    "    \"chip_name\": \"电池芯片\",\n" +
                    "    \"components\": [{\n" +
                    "        \"component_id\": \"component-3\",\n" +
                    "        \"component_name\": \"电池部分组件\"\n" +
                    "    },{\n" +
                    "        \"component_id\": \"component-2\",\n" +
                    "        \"component_name\": \"芯片组件\"\n" +
                    "    }\n" +
                    "    ]\n" +
                    "}]";
            String j = ETLUtil.executeJavaScript(componentCode, str);


            log.info(j);
//        } catch (FileNotFoundException e) {
//            e.printStackTrace();
//        }



//        JSONObject data = JSON.parseObject(str);
//        CodeExecuteUtil.JavaScript(code, data);
    }
}