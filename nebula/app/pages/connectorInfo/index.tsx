import React from 'react';
import './index.css';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import Paper from '@material-ui/core/Paper';
import axios from 'axios';
import moment from 'moment';
// import { AnyFunc } from 'typings/app/service';
// import { List } from 'antd';

const erType_map = {
  0: '节点',
  1: '边',
};
const status_map = {
  // -1: '不查询状态',
  0: '未知',
  1: '正常',
  2: '异常',
  3: '运行中',
};
interface ModalProps {
  id: string;
  visible: boolean;
  buttonVisible_cancel: string;
  buttonVisible_save: string;
  title: string;
  children: any;
  onCancel();
  onConfirm();
}
interface ModalState {
  buttonVisible_cancel:boolean;
  buttonVisible_save:boolean;
  
}
class Modal extends React.Component<ModalProps, ModalState> {
  constructor(props) {
    super(props);
    this.state = {
      buttonVisible_cancel: this.props.buttonVisible_cancel == "true",
      buttonVisible_save: this.props.buttonVisible_save == "true",
    };
  }
  render() {
    // console.log(
    //   '------------buttonVisible_cancel------',
    //   this.state.buttonVisible_cancel,
    // );
    // console.log(
    //   '------------buttonVisible_save------',
    //   this.state.buttonVisible_save,
    // );
    return this.props.visible ? (
      <div className="modal-mask">
        <div className="modal-wrap">
          <div className="header">
            <div className="title">{this.props.title}</div>
          </div>
          <div className="body">{this.props.children}</div>
          <div className="footer">
            {this.state.buttonVisible_cancel ? (
              <div className="cancel" onClick={this.props.onCancel.bind(this)}>
                取消
              </div>
            ) : null}

            {this.state.buttonVisible_save ? (
              <div
                className="confirm"
                onClick={this.props.onConfirm.bind(this)}
              >
                保存
              </div>
            ) : null}
          </div>
        </div>
      </div>
    ) : (
      <span />
    );
  }
}


const type_map = {
  1: 'kafka',
  0: 'restful',
};
interface ConInfoProps{
  id: any;
}
interface ConInfoState{
  id:any;
  rowsConInfo:any;
}
class ConInfo extends React.Component<ConInfoProps, ConInfoState> {
  constructor(props) {
    super(props);
    this.state = {
      id:this.props.id,
      rowsConInfo:[],
      // body_k:[],
      // body_v:[],
    };
  }


  async componentDidMount() {
    // console.log('试试！！！！！！！！！！！start');
    // console.log(this.state.id);

    // 测试搜索连接器（按照Id查询连接器)
    try {
      const result = await axios({
        url:
          '/api-db/connector/info?page=1&rows=10&sortBy=name&sortDirection=desc',
        params: {
          id: this.state.id,
        },
        method: 'get',
      });
      // console.log(result.data.data);
      this.setState({
        rowsConInfo: result.data.data,
      });
      // console.log("??????????"+this.state.rowsConInfo);
      // Object.keys(this.state.rowsConInfo.body).map( key => (
      //   console.log('key?????: 'key+'  val????????: '+typeof (this.state.rowsConInfo.body[key]))
      // ));


    } catch (error) {
      console.log(error);
    }

    // console.log('试试！！！！！！！！！！！end');
  }


  render() {
    return (
      <div style={{ border: "1px solid gray" }}>
        <form className="form-info">
          <div className="form-horizontal">
            <div className="leftside">
              <label className="control-label">名称:</label>
              <text className="form-control">{this.state.rowsConInfo.name}</text>
            </div>
            <div className="rightside">
              <label className="control-label">类型:</label>
              <text className="form-control"></text>
              {type_map[this.state.rowsConInfo.type]}
            </div>
          </div>

          <br />
          <div className="form-horizontal">
            <div className="leftside">
              <label className="control-label">请求uri:</label>
              <text className="form-control">
                {this.state.rowsConInfo.uri}
              </text>
            </div>
            <div className="rightside">
              <label className="control-label">请求方法:</label>
              <text className="form-control">
                {this.state.rowsConInfo.httpMethod}
              </text>
            </div>
          </div>

          <br />
          <div className="form-horizontal">
            <div className="leftside">
              <label className="control-label">body:</label>
              <text className="form-control">
                {JSON.stringify(this.state.rowsConInfo.body)}
              {/*{*/}
              {/*  Object.keys(this.state.rowsConInfo.body).map( key => (*/}
              {/*    console.log("key?????????"+key)*/}
              {/*     // <text className="form-control" key={key}>*/}
              {/*     //   /!*{key} : {this.state.rowsConInfo.body[key]}*!/*/}
              {/*     // </text>*/}
              {/*     // console.log(key, this.state.rowsConInfo.body[key])*/}
              {/*  ))*/}
              {/*}*/}
              </text>
                  </div>
                  <div className="rightside">
                    <label className="control-label">contentType:</label>
                    <text className="form-control">
                      {this.state.rowsConInfo.contentType}
                    </text>
                  </div>
                </div>

                  <br />
                  <div className="form-horizontal">
                    <div className="leftside">
                      <label className="control-label">cron:</label>
                      <text className="form-control">
                        {this.state.rowsConInfo.cron}
                      </text>
                    </div>
                    <div className="rightside">
                      <label className="control-label">状态:</label>
                      <text className="form-control">
                        {status_map[this.state.rowsConInfo.status]}
                      </text>
                    </div>
                  </div>

                  <br />
                  <div className="form-horizontal">
                    <div className="rightside">
                      <label className="control-label">备注:</label>
                      <text className="form-control">
                        {this.state.rowsConInfo.remark}
                      </text>
                    </div>
                  </div>

                </form>
                </div>
      );
    }
}


type ShuXingState = {
  modalInfoVisible: boolean;
  connectorId:string;
  rowsModuleInfo: any;
  index:number;
};
interface ShuXingProps{
  id: any;
}
class ShuXing extends React.Component<ShuXingProps, ShuXingState> {
  constructor(props) {
    super(props);
    this.state = {
      modalInfoVisible: false,
      connectorId:this.props.id,
      // connectorId:'61502f75d1005b07f987d739',
      rowsModuleInfo:[],
      index:0,
    };
    this.openInfo = this.openInfo.bind(this);
  }
  openInfo = index => {
    this.setState({
      modalInfoVisible: true,
      index:index,
    });
    console.log(this.state.index);
    // console.log('id:',this.state.rowsModuleInfo[index]);
   
  }
  deleteModule = index =>{
    const templist:Array<any> =[];
    templist.push(this.state.rowsModuleInfo[index].id);
    console.log('id:',templist);
    try {
      const result = axios({
        method: 'delete',
        url: '/api-db/module/delete',
        data: templist,
      });
      console.log(result);
      location.reload();
    } catch (error) {
      console.log(error);
    }
    this.componentDidMount();
    
  }
  
  async componentDidMount() {
    // console.log('试试/api-db/module/list！！！！！！！！！！！start');

    // 通过连接器id获取模型
    try {
      const result = await axios({
        url:
          '/api-db/module/list',
        params: {
          connectorId: this.state.connectorId,
        },
        method: 'get',
      });
      this.setState({
        rowsModuleInfo: result.data.data,
      })
      console.log(this.state.rowsModuleInfo);
    } catch (error) {
      console.log(error);
    }

    // console.log('试试/api-db/module/list！！！！！！！！！！！end');
  }


  render() {
    return (
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>名称</TableCell>
              <TableCell align="center">类型</TableCell>
              <TableCell align="center">主键</TableCell>
              <TableCell align="center">操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.rowsModuleInfo.map((row,index) => (
              <TableRow key={row.id}>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="center">{erType_map[row.type]}</TableCell>
                <TableCell align="center">{row.key}</TableCell>
                <TableCell align="center">
                  <button className="openinfo_button" onClick={() => this.openInfo(index)}>
                    详情
                  </button>
                  <button className="deleteinfo_button" onClick={() => this.deleteModule(index)} >删除</button>
                  <Modal
                    id="modal"
                    visible={this.state.modalInfoVisible}
                    title="详情"
                    buttonVisible_cancel="true"
                    buttonVisible_save="false"
                    onCancel={() => {
                      console.log("modal close");
                      this.setState({
                        modalInfoVisible: false
                      });
                    }}
                    onConfirm={() => {
                      console.log("点击了确定按钮");
                    }}
                  >
                    <form>
                      <div className="form-horizontal">
                        <div className="leftside">
                          <label className="control-label">名称:</label>
                          <text className="form-control">{this.state.rowsModuleInfo[this.state.index].name}</text>
                        </div>
                        <div className="rightside">
                          <label className="control-label">类型:</label>
                          <text className="form-control">{this.state.rowsModuleInfo[this.state.index].type}</text>
                        </div>
                      </div>

                      <br />
                      <div className="form-horizontal">
                        <div className="leftside">
                          <label className="control-label">主键:</label>
                          <text className="form-control">{this.state.rowsModuleInfo[this.state.index].key}</text>
                        </div>
                        <div className="rightside">
                          <label className="control-label"></label>
                          <text className="form-control"></text>
                        </div>
                      </div>

                      <div
                        style={{
                          fontSize: "15px",
                          textAlign: "left",
                          marginTop: "20px",
                          marginBottom: "10px"
                        }}
                      >
                        属性：
                      </div>

                       <TableContainer component={Paper}>
                        <Table aria-label="simple table">
                          <TableHead>
                            <TableRow>
                              <TableCell>属性名</TableCell>
                              <TableCell align="center">数据类型</TableCell>
                              <TableCell align="center">默认值</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {this.state.rowsModuleInfo[this.state.index].properties.map(propertie => (
                              <TableRow key={propertie.name}>
                                <TableCell component="th" scope="row">
                                  {propertie.name}
                                </TableCell>
                                <TableCell align="center">
                                  {propertie.type}
                                </TableCell>
                                <TableCell align="center">
                                  {propertie.defaultVal}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer> 

                      <div
                        style={{
                          fontSize: "15px",
                          textAlign: "left",
                          marginTop: "20px",
                          marginBottom: "10px"
                        }}
                      >
                        抽取函数：
                      </div>
                      <div
                        style={{
                          fontSize: "15px",
                          textAlign: "left",
                          padding: "10px",
                          border: " 1px solid gray",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {this.state.rowsModuleInfo[this.state.index].code}
                      </div>
                    </form>
                  </Modal>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
      </TableContainer>
    );
  }
}
// function createRecord(id, time, sumtime, state, yuan, er) {
//   return { id, time, sumtime, state, yuan, er };
// }
// const row_records = [
//   createRecord("safafdfafa", "2021-09-12", "33ms", "正常", 0, 0),
//   createRecord("safafdfafa", "2021-09-12", "32ms", "正常", 0, 0),
//   createRecord("safafdfafa", "2021-09-12", "34ms", "正常", 0, 0),
//   createRecord("safafdfafa", "2021-09-12", "0ms", "失败", 0, 0)
// ];
interface RecordProps{
  id: string;
}
type RecordState = {
  showYuanDataInfoVisible: boolean,
  showERDataInfoVisible: boolean,
  connectorId: string,
  recordInfo: any,
};
class Record extends React.Component<RecordProps, RecordState> {
  constructor(props) {
    super(props);
    this.state = {
      showYuanDataInfoVisible: false,
      showERDataInfoVisible: false,
      connectorId: this.props.id,
      recordInfo: [],
    };
    this.showYuanDataInfo_change = this.showYuanDataInfo_change.bind(this);
    this.showERDataInfo_change = this.showERDataInfo_change.bind(this);
  }
  showYuanDataInfo_change() {
    this.setState({
      showYuanDataInfoVisible: true
    });
  }
  showERDataInfo_change() {
    this.setState({
      showERDataInfoVisible: true
    });
  }


  async componentDidMount() {
    console.log('试试/api-db/record/list！！！！！！！！！！！start');
    // console.log(this.state.connectorId);
    // 通过连接器id获取记录
    try {
      const result = await axios({
        url:
          '/api-db/record/list?page=1&rows=10&sortBy=name&sortDirection=desc',
        params: {
          connectorId: this.state.connectorId,
        },
        method: 'get',
      });
      this.setState({
        recordInfo: result.data.data.content,
      })
      console.log(this.state.recordInfo);
    } catch (error) {
      console.log(error);
    }

    console.log('试试/api-db/record/list！！！！！！！！！！！end');
  }


  render() {
    return (
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>id</TableCell>
              <TableCell align="center">访问时间</TableCell>
              <TableCell align="center">耗时/ms</TableCell>
              <TableCell align="center">状态</TableCell>
              <TableCell align="center">原数据</TableCell>
              <TableCell align="center">ER数据</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.recordInfo.map(row_record => (
             // {row_records.map(row_record => (
              <TableRow key={row_record.requestTime.value}>
                <TableCell component="th" scope="row">
                  {row_record.id}
                </TableCell>
                <TableCell align="center">
                  {moment(parseInt(row_record.requestTime.value)).format("YYYY-MM-DD HH:mm:ss")}
                </TableCell>
                <TableCell align="center">{row_record.timeConsuming}</TableCell>
                <TableCell align="center">{status_map[row_record.status]}</TableCell>
                <TableCell align="center">
                  <button
                    className="openinfo_button"
                    onClick={this.showYuanDataInfo_change}
                  >
                    查看
                  </button>
                  <Modal
                    id="modal"
                    visible={this.state.showYuanDataInfoVisible}
                    title="原数据"
                    buttonVisible_cancel="true"
                    buttonVisible_save="false"
                    onCancel={() => {
                      console.log("modal close");
                      this.setState({
                        showYuanDataInfoVisible: false
                      });
                    }}
                    onConfirm={() => {
                      console.log("点击了确定按钮");
                    }}
                  >
                    <form>
                      <div
                        style={{
                          fontSize: "15px",
                          textAlign: "left",
                          padding: "10px",
                          border: " 1px solid gray",
                          whiteSpace: "pre-wrap"
                        }}
                      >{row_record.data}
                        {/*"sadasdasda <br />*/}
                        {/*sdadasd <br />*/}
                        {/*asdasd"*/}
                      </div>
                    </form>
                  </Modal>
                </TableCell>
                <TableCell align="center">
                  <button
                    className="openinfo_button"
                    onClick={this.showERDataInfo_change}
                  >
                    查看
                  </button>
                  <Modal
                    id="modal"
                    visible={this.state.showERDataInfoVisible}
                    title="ER数据"
                    buttonVisible_cancel="true"
                    buttonVisible_save="false"
                    onCancel={() => {
                      console.log("modal close");
                      this.setState({
                        showERDataInfoVisible: false
                      });
                    }}
                    onConfirm={() => {
                      console.log("点击了确定按钮");
                    }}
                  >
                    <form>
                      <div
                        style={{
                          fontSize: "15px",
                          textAlign: "left",
                          padding: "10px",
                          border: " 1px solid gray",
                          whiteSpace: "pre-wrap"
                        }}
                      >{JSON.stringify(row_record.erdata)}
                        {/*"sadasdasda <br />*/}
                        {/*sdadasd <br />*/}
                        {/*asdasd"*/}
                      </div>
                    </form>
                  </Modal>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
}
type ConnectorInfoState = {
  modalInfoVisible: boolean,
  type: any | number,
  id: any,
  name:string,
  properties:any,
  key:string,
  code:string,
};

class ConnectorInfo extends React.Component<{}, ConnectorInfoState> {
  constructor(props) {
    super(props);
    this.state = {
      modalInfoVisible: false,
      id: sessionStorage.getItem('id'),
      type: 0,
      name:"",
      properties:[],
      key:"",
      code:"",
    };
    console.log('id到底传出去了什么！！！！！！！！！！！'+this.state.id);
    this.addInfo = this.addInfo.bind(this);
    this.changeTypeToPoint = this.changeTypeToPoint.bind(this);
    this.changeTypeToEdge = this.changeTypeToEdge.bind(this);
  }
  addInfo() {
    this.setState({
      modalInfoVisible: true,
    });
  }
  changeTypeToPoint() {
    this.setState({
      type: 0,
    });
    // alert("changeTypeToRestful")
  }
  changeTypeToEdge() {
    this.setState({
      type: 1,
    });
  }
  // changeValue(name, e) {
  //   this.setState({
  //     [name]: e.target.value,
  //   });
  // }
  changeValue(name:any, event:any) {
    const newState = { [name]: event.target.value } as Pick<ConnectorInfoState, keyof ConnectorInfoState>;
    this.setState(newState);
    console.log("On Change!");
  }
  // async saveModule(){
    
  // }
  async saveER(){ 
    console.log(this.state.name);
    console.log(this.state.type);
    console.log(this.state.properties);
    try {
      const result = await axios({
        url: '/api-db/module/save',
        data: {
          connectorId: this.state.id,
          type: this.state.type,
          name: this.state.name,
          properties: JSON.parse(this.state.properties),
          key: this.state.key,
          code: this.state.code,
        },
        method: 'post',
      });
      console.log(result);
      // alert("保存成功")
      if(result.status === 200){
        location.reload();
      }
    } catch (error) {
      console.log(error);
      alert(error);
    }
    // this.saveModule();
    // this.setState({
    //   modalInfoVisible: false,
    // })
    
  }
  render() {
    return (
      <div>
        <header>
          <div style={{ margin: "40px" ,backgroundColor:"white"}}>
            <ConInfo id={this.state.id}/>
            <br />
            <div style={{ fontSize: "20px" }}>数据模型：</div>
            <ShuXing id={this.state.id}/>
            <button className="addinfo_button" onClick={this.addInfo}>
              + ER数据增加
            </button>
            <Modal
              id="modal"
              visible={this.state.modalInfoVisible}
              title="新增"
              buttonVisible_cancel="true"
              buttonVisible_save="true"
              onCancel={() => {
                console.log("modal close");
                this.setState({
                  modalInfoVisible: false
                });
              }}
              onConfirm={() => {
                this.setState({
                  modalInfoVisible: false,
                });
                this.saveER();
                console.log('saveer');
              }}
            >
              <form>
                <div className="form-horizontal">
                  <label className="control-label">类型:</label>
                  <div className="form-control">
                    <input
                      type="radio"
                      name="type"
                      value="1"
                      id="radio1"
                      checked={this.state.type == 0}
                      onChange={this.changeTypeToPoint}
                      defaultChecked
                    />
                    <label htmlFor="radio1">节点</label>
                    <input
                      style={{ marginLeft: "20px" }}
                      type="radio"
                      name="type"
                      value="2"
                      id="radio2"
                      checked={this.state.type == 1}
                      onChange={this.changeTypeToEdge}
                    />
                    <label htmlFor="radio2">边</label>
                  </div>
                </div>

                <br />
                <div className="form-horizontal">
                  <label className="control-label">名称:</label>
                  <input
                  name="name"
                  className="form-control"
                  placeholder="请输入名称"
                  onChange={this.changeValue.bind(this, 'name')}
                  />
                </div>

                <br />
                <div className="form-horizontal">
                  <label className="control-label">主键:</label>
                  <input
                  name="key"
                  className="form-control"
                  placeholder="请输入名称"
                  onChange={this.changeValue.bind(this, 'key')}
                  />
                </div>
                {/* <div>
                  <label className="control-label">属性:</label>
                </div>

                <div className="form-horizontal" style={{ marginTop: "5px" }}>
                  <div style={{ width: "33%" }}>
                    <label className="control-label">属性名:</label>
                    <input
                      style={{ width: "100%", height: "15px" }}
                      placeholder="请输入属性名"
                      ref="passwordInput"
                    />
                  </div>
                  <div style={{ width: "33%", marginLeft: "10px" }}>
                    <label className="control-label">数据类型:</label>

                    <select
                      className="connectorInfo-selectvalue"
                      name="value"
                      value={this.state.value}
                    >
                      <option value="未选择">请选择</option>
                      <option value="int">int</option>
                      <option value="string">string</option>
                      <option value="date">date</option>
                    </select>
                  </div>
                  <div style={{ width: "33%", marginLeft: "10px" }}>
                    <label className="control-label">默认值:</label>
                    <input
                      style={{ width: "100%", height: "15px" }}
                      placeholder="请输入默认值"
                      ref="passwordInput"
                    />
                  </div>
                </div> */}

                <br />
                <div>
                  <div>
                    <label className="control-label"> 属性：</label>
                  </div>
                  <input
                  name="properties"
                  className="chouquhanshu"
                  placeholder="JSONArray对象格式，含name、type、defaultVal"
                  onChange={this.changeValue.bind(this, 'properties')}
                  />
                </div>
                <div>
                  <div>
                    <label className="control-label"> 抽取函数：</label>
                  </div>
                  <input
                  name="code"
                  className="chouquhanshu"
                  placeholder="js代码"
                  onChange={this.changeValue.bind(this, 'code')}
                  />
                </div>
              </form>
            </Modal>
            <br />
            <br />
            <div style={{ fontSize: "20px" }}>数据记录：</div>
            <br />
            <Record id={this.state.id}/>
          </div>
        </header>
      </div>
    );
  }
}
export default ConnectorInfo;
