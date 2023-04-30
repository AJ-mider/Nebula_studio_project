function getData(data) {

    // 将数据转化为json
    var jsonObj = JSON.parse(data);
    // console.log(jsonObj);
    // var chipJson = JSON.stringify(jsonObj, ['chip_id','chip_name'], '  ')
    // return chipJson
    var componentJson = [];
    var chip_component_relationJson= [];
    for(k in jsonObj){
        for(m in jsonObj[k]){
            if(m === 'components'){
                for(n in jsonObj[k][m]){
                    componentJson.push(n);
                    chip_component_relationJson.push({src:jsonObj[k]['chip_id'],dst:jsonObj[k][m][n]['component_id']})
                }
            }
        }
    }
    componentJson = JSON.stringify(componentJson)
    chip_component_relationJson = JSON.stringify(chip_component_relationJson)
    console.log('chip:\n', chipJson);
    console.log('components:\n',componentJson);
    console.log('chip_component_relation:\n',chip_component_relationJson);

};