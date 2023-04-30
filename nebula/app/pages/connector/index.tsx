// import logo from './logo.svg';

// import MenuItem from 'antd/es/menu/MenuItem';
import Paper from '@material-ui/core/Paper';
// import Dialog from '#assets/components/addPages/Dialog';
// import Modal from '#assets/components/addPages/Modal';
// import { connect } from 'react-redux';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
// import FormItem from 'antd/lib/form/FormItem'
import axios from 'axios';
// import { stringify } from 'querystring';
// import {PagerTest} from '../../components/PagerTest';
import React from 'react';
// import * as PropTypes from "prop-types";
import { Link } from 'react-router-dom';

import '../../components/pager.css';
// import Connect from '#assets/components/slidePages/connect';

import './index.css';
// import { ListItemText } from '@material-ui/core';
// import {Modal} from "antd";
// import DeleteBusiness from 'component/manage/business/DeleteBusiness';
// const f = false;
const constants = {
  flag: true,
};

/**
 * 获取总页数
 * @param {*} total
 * @param {*} size
 */
function getPageNum(total, size) {
  const pageNum = Math.ceil(total / size);
  return pageNum;
}

/**
 * 动态获取数字页码最小值
 * @param {*} current
 * @param {*} panel
 */
function getMinPanelNum(current, panel) {
  let minPanelNum = current - Math.floor(panel / 2);
  if (minPanelNum < 1) {
    minPanelNum = 1;
  }
  return minPanelNum;
}

/**
 * 点击翻页事件
 * @param {*} num
 * @param {*} props
 */
// 已经完成前后端consle连接测试
function handleClick(num, props) {
  return () => {
    if (num === 'first') {
      // 首页
      // console.log('测试首页');
      props.onPageChange(1);
    } else if (num === 'prev') {
      if (props.current !== 1) {
        // console.log('测试上🗡');
        props.onPageChange(props.current - 1);
      }
    } else if (num === 'next') {
      if (props.current !== getPageNum(props.total, props.size)) {
        // console.log('测试下🗡');
        props.onPageChange(props.current + 1);
      }
    } else if (num === 'end') {
      // console.log('测试尾部');
      props.onPageChange(getPageNum(props.total, props.size));
    } else {
      // console.log('测试当前页');
      props.onPageChange(num);
    }
  };
}

function Pager(props) {
  console.log('total: ' + props.total);
  console.log('size: ' + props.size);
  const pageNum = getPageNum(props.total, props.size);
  const minPanelNum = getMinPanelNum(props.current, props.panel);
  const maxPanelMum =
    minPanelNum + props.panel > pageNum ? pageNum : minPanelNum + props.panel;
  let numPageArr:Array<any> = [];
  for (let i = minPanelNum; i <= maxPanelMum; i++) {
    numPageArr.push(
      <span
        key={i}
        className={i === props.current ? 'item active' : 'item'}
        onClick={handleClick(i, props)}
      >
        {i}
      </span>,
    );
  }

  return (
    <div className="tailrow">
      <span
        className={props.current === 1 ? 'item disabled' : 'item'}
        onClick={handleClick('first', props)}
      >
        首页
      </span>
      <span
        className={props.current === 1 ? 'item disabled' : 'item'}
        onClick={handleClick('prev', props)}
      >
        上一页
      </span>
      {/**数字页码 */}
      {numPageArr.map(item => {
        return item;
      })}
      <span
        className={props.current === pageNum ? 'item disabled' : 'item'}
        onClick={handleClick('next', props)}
      >
        下一页
      </span>
      <span
        className={props.current === pageNum ? 'item disabled' : 'item'}
        onClick={handleClick('end', props)}
      >
        尾页
      </span>
      <span style={{ color: 'black', fontSize: '15px' }}>
        {props.current} / {pageNum}
      </span>
    </div>
  );
}
interface PagerTestState {
  current: number,
  total: number,
  size: number,
  panel: number,
  type: any,
  name: any,
  rows: any,
}
interface PagerTestProps{
  type:string;
  name:string;
}
// 主要页面组件
class PagerTest extends React.Component<PagerTestProps,PagerTestState> {
  constructor(props) {
    super(props);
    this.state = {
      current: 1,
      total: 0,
      size: 10,
      panel: 5,
      type: this.props.type,
      name: this.props.name,
      rows: [],
    };
    this.changeRow = this.changeRow.bind(this);
  }

  // 调用此函数会刷新页面(可以理解为调用一次render)，因为setState会重绘页面
  async getList() {
    console.log('获取连接器列表');
    // 测试获取连接器的列表
    try {
      const response = await axios({
        url: '/api-db/connector/list?rows=10&sortBy=name&sortDirection=desc',
        params: {
          page: this.state.current,
        },
        method: 'get',
      });
      const result = response.data.data.content;
      this.setState({
        rows: result,
        total: response.data.data.totalElements,
      });
      console.log("看一看total"+ this.state.total)
    } catch (error) {
      console.log(error);
    }
  }

  // 接收查询参数的函数，包含获取列表和参数查询
  // 每次单击上方connector也会执行一遍
  async componentWillReceiveProps(nextProps) {
    this.setState({
      type: nextProps.type,
      name: nextProps.name,
      current: 1,
    });
    console.log('!!!!!!type: ' + this.state.type);
    console.log('!!!!!!name: ' + this.state.name);
    // 若在页面初始化状态下单击上方connector就会是以下if的情况
    if (this.state.type == '未选择' || this.state.type == '-1') {
      // 可以考虑封装一下，放进前面的页面初始化Pager函数里面，令其自动刷新
      // 测试获取连接器的列表
      this.getList();
    }
    // 查询有东西的情况
    else {
      console.log('!!!!!!!!!!按照type和名称查找');
      // 测试搜索连接器（按照type和名称查找)
      const t = this.state.type === '0' ? 0 : 1;
      const n = this.state.name;
      try {
        const response = await axios({
          url:
              '/api-db/connector/info?page=1&rows=10&sortBy=name&sortDirection=desc',
          data: {
            type: t,
            name: n,
            status: -1,
          },
          method: 'post',
        });
        const result = response.data.data.content;
        this.setState({
          rows: result,
          total: response.data.data.totalElements,
        });
      } catch (error) {
        console.log(error);
      }
    }
  }

  // 改变行函数
  async changeRow() {
    if (this.state.type == '未选择' || this.state.type == '-1') {
      console.log('11未选择');
      console.log('11current: ' + this.state.current);
      // 测试获取连接器的列表
      this.getList();
    } else {
      console.log('!!!!!!!!!!按照type和名称查找');
      // 测试搜索连接器（按照type和名称查找)
      const t = this.state.type === '0' ? 0 : 1;
      const n = this.state.name;
      try {
        const response = await axios({
          url: '/api-db/connector/info?rows=10&sortBy=name&sortDirection=desc',
          params: {
            page: this.state.current,
          },
          data: {
            type: t,
            name: n,
            status: -1,
          },
          method: 'post',
        });
        const result = response.data.data.content;
        this.setState({
          rows: result,
          total: response.data.data.totalElements,
        });
      } catch (error) {
        console.log(error);
      }
    }
  }

  // 监听页面变化函数。人话：翻页函数
  onPageChange = current => {
    console.log("onPageChange: " + current);
    this.setState(
        {
          current,
        },
        () => {
          this.changeRow();
        },
    );
  };

  // 初始化加载数据
  async componentDidMount() {
    this.getList();
  }


  render() {
    return (
        <div>
          <BasicTable rows={this.state.rows} />
          <Pager {...this.state} onPageChange={this.onPageChange} />
        </div>
    );
  }
}
interface SelectState {
  // value: string;
  // info: string;
  [x: number]: any;
  total: number;
  size: number;
  type: string;
  name: string;
  t: string;
  n: string;
  rows:any;
}

class Select extends React.Component<{}, SelectState> {
  constructor(props) {
    super(props);
    this.state = {
      type: '未选择',
      t: '未选择',
      name: '请输入名称',
      n: '请输入名称',
      rows: [],
      total: 0,
      size: 10,
    };
    // this.tan=this.tan.bind(this);
    // this.hide=this.hide.bind(this);
    this.getModalButtons = this.getModalButtons.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.showAddBasic = this.showAddBasic.bind(this);
  }

  handleChange(e) {
    const value = e.target.value;
    const name = e.target.name;
    this.setState({
      [name]: value,
    });
  }
  handleSubmit(e) {
    if (this.state.t === '未选择' || this.state.t === '-1') {
      console.log('forsearch-t: ' + this.state.t);
      // console.log('forsearch-n: ' + this.state.n);
      alert('未选择');
    } else { // 这里为啥注释掉了
      // console.log('forsearch-t2: ' + this.state.t);
      // console.log('forsearch-n2: ' + this.state.n);
      // const temp_t = this.state.t;
      // const temp_n = this.state.n;
      // setTimeout(() => {
      //   this.setState(
      //     {
      //       type: temp_t,
      //       name: temp_n,
      //     },
      //     () => {
      //       // this.showAddBasic();
      //       console.log('forsearch-type_wai: ' + this.state.type);
      //       console.log('forsearch-name_wai: ' + this.state.name);
      //     },
      //   );
      //   console.log('forsearch-type: ' + this.state.type);
      //   console.log('forsearch-name: ' + this.state.name);
      // }, 0);
      alert('搜索连接器类型: ' + (this.state.t === '0' ? 'Restful' : 'Kafka') + '；名称关键字: ' + this.state.n);
      this.setState({ t: this.state.t, n: this.state.n,
      });
      e.preventDefault(); // 阻止默认行为，在提交之前需要验证的时候先拦截一下
    }
  }
  getModalButtons() {
    return [
      <a href="www.baidu.com" className="btn btn-sm btn-danger">
        确定删除
      </a>,
    ];
  }

  showAddBasic() {
    return (
      <div>
        <AddCon />
        <PagerTest type={this.state.t} name={this.state.n} />
      </div>
    );
  }

  async componentDidMount() {
    // // 测试获取连接器的列表
    // try {
    //   const response = await axios({
    //     url:
    //       '/api-db/connector/list?page=1&rows=10&sortBy=name&sortDirection=desc',
    //     method: 'get',
    //   });
    //   console.log(
    //     'response.data.data.totalElements： ' +
    //       response.data.data.totalElements,
    //   );
    //   const result = response.data.data.content;
    //   this.setState({
    //     rows: result,
    //     total: response.data.data.totalElements,
    //   });
    //   console.log('total-componentDidMount： ' + this.state.total);
    // } catch (error) {
    //   console.log(error);
    // }
  }

  render() {
    return (
      <div>
        <form className="forsearch" onSubmit={() => this.handleSubmit(event)}>
          <div style={{ textAlign: 'center' }}>
            <label className="tips-value">
              请选择连接器类型以及填入具体信息：{' '}
            </label>
          </div>
          <div style={{ textAlign: 'right' }}>
            <select
              className="selectvalue"
              name="t"
              value={this.state.t}
              onChange={this.handleChange}
            >
              <option value="-1">请选择</option>
              <option value="0">RestFul</option>
              <option value="1">Kafka</option>
            </select>
            <input
              className="inputinfo"
              name="n"
              value={this.state.n}
              onChange={this.handleChange}
            />
            <input className="searchbutton" type="submit" value="搜索" />
          </div>
        </form>
        {this.showAddBasic()}
        {/*<AddCon />*/}

        {/*/!*<BasicTable rows={this.state.rows} />*!/*/}
        {/*<PagerTest*/}
        {/*  type={this.state.type}*/}
        {/*  name={this.state.name}*/}
        {/*  // total={this.state.total}*/}
        {/*  // size={this.state.size}*/}
        {/*/>*/}
      </div>
    );
  }
}
interface ModalProps {
  id: string;
  visible: boolean;
  buttonVisible_cancel:string;
  buttonVisible_save:string;
  title:string;
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
      buttonVisible_cancel: this.props.buttonVisible_cancel == 'true',
      buttonVisible_save: this.props.buttonVisible_save == 'true',
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
    // console.log('111111111111111111111111111111111')
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
interface AddConState {
  modalAddInfoVisible_restful: boolean;
  type: any | number;
  modalAddInfoVisible_kafka: boolean;
  active: any | number;
  updateType: any | number;
  name: any | string;
  uri: any | string;
  header: any | string;
  params: any | string;
  httpMethod: any | string;
  contentType: any | string;
  body: any | string;
  task: any | number;
  cron: any | string;
  remark: any | string;
  topic: any | string;
}
class AddCon extends React.Component<{}, AddConState> {
  constructor(props) {
    super(props);
    this.state = {
      active: 1,
      type: 0,
      modalAddInfoVisible_restful: false,
      modalAddInfoVisible_kafka: false,
      updateType: 0,
      name: '',
      uri: '',
      header: '{}',
      params: '{}',
      httpMethod: 'GET',
      contentType: 'application/json',
      body: '{}',
      task: 0,
      cron: '-1',
      remark: '',

      topic: '',
    };
    this.openModalAddInfo = this.openModalAddInfo.bind(this);
    this.changeType = this.changeType.bind(this);
    this.changeUpdate = this.changeUpdate.bind(this);
    this.changeValue = this.changeValue.bind(this);
    this.changeHttpMethod = this.changeHttpMethod.bind(this);
    this.changeTask = this.changeTask.bind(this);
    this.changeCron = this.changeCron.bind(this);
    this.saveRestful = this.saveRestful.bind(this);
    this.saveKafka = this.saveKafka.bind(this);
  }
  openModalAddInfo() {
    this.setState({
      modalAddInfoVisible_restful: true,
    });
    constants.flag = true;
    // f = true;
    // alert('点击了确定按钮： ' + f);
    // alert('three!!!!!!:::  ' + global.constants.flag);
  }
  changeType() {
    if (this.state.type === 1) {
      this.setState({
        type: 0,
        modalAddInfoVisible_restful: true,
        modalAddInfoVisible_kafka: false,
      });
    } else {
      this.setState({
        type: 1,
        modalAddInfoVisible_restful: false,
        modalAddInfoVisible_kafka: true,
      });
    }
    console.log('type: ' + typeof this.state.type + '  ' + this.state.type);
  }
  changeUpdate() {
    if (this.state.updateType === 1) {
      this.setState({
        updateType: 0,
      });
    } else {
      this.setState({
        updateType: 1,
      });
    }
    // console.log(
    //   'updateType: ' +
    //     typeof this.state.updateType +
    //     '  ' +
    //     this.state.updateType,
    // );
  }
  changeHttpMethod = e => {
    this.setState({
      httpMethod: e.target.value,
    });
  };
  changeTask() {
    if (this.state.task === 1) {
      this.setState({
        task: 0,
      });
    } else {
      this.setState({
        task: 1,
      });
    }
  }
  // changeValue(name:any, e:any) {
  //   this.setState({
  //     [name]: e.target.value,
  //   });
  // }
  changeValue(name:any, event:any) {
    const newState = { [name]: event.target.value } as Pick<AddConState, keyof AddConState>;
    this.setState(newState);
    console.log("On Change!");
  }
  changeCron(e) {
    if (this.state.task === 0) {
      this.setState({
        cron: '-1',
      });
    } else {
      this.setState({
        cron: e.target.value,
      });
    }
  }
  // async postSaveRestful(){

  // }
  async saveRestful() {
    // 测试保存连接器
    try {
      const result = await axios({
        url: '/api-db/connector/save',
        data: {
          type: this.state.type,
          name: this.state.name,
          uri: this.state.uri,
          header: JSON.parse(this.state.header),
          params: JSON.parse(this.state.params),
          httpMethod: this.state.httpMethod,
          contentType: this.state.contentType,
          updateType: this.state.updateType,
          body: JSON.parse(this.state.body),
          cron: this.state.cron,
          remark: this.state.remark,
        },
        method: 'post',
      });
      // 这里的log可以显示，但是只是一瞬间，注释掉下面的location跳转貌似就成功了，所以是跳转有问题。
      // console.log('测试保存连接器');
      console.log(result);
      if(result.status === 200){
        location.reload();
      }
    } catch (error) {
      console.log(error);
      alert(error);
    }
    // this.postSaveRestful();
    // location.reload();
  }
  // async postSaveKafka(){

  // }
  async saveKafka() {
    // console.log('type: ' + this.state.type,typeof this.state.type);
    // console.log('name: ' + this.state.name,typeof this.state.name);
    // console.log('topic: ' + this.state.topic,typeof this.state.topic);
    // console.log('remark: ' + this.state.remark,typeof this.state.remark);
    // 测试保存连接器
    try {
      const result = await axios({
        url: '/api-db/connector/save',
        data: {
          type: this.state.type,
          name: this.state.name,
          topic: this.state.topic,
          remark: this.state.remark,
        },
        method: 'post',
      });
      console.log(result);
      if(result.status === 200){
        location.reload();
      }
    } catch (error) {
      console.log(error);
      alert(error);
    }
    // this.postSaveKafka();
    // location.reload();
  }
  render() {
    return (
      <div>
        <div className="foradd">
          <button className="addbutton" onClick={this.openModalAddInfo}>
            新增
          </button>
          <Modal
            id="modal1"
            visible={this.state.modalAddInfoVisible_restful}
            title="新增"
            buttonVisible_cancel = "true"
            buttonVisible_save = "true"
            onCancel={() => {
              console.log('modal close');
              this.setState({
                modalAddInfoVisible_restful: false,
              });
              constants.flag = false;
              // f = false;
            }}
            onConfirm={() => {
              this.setState({
                modalAddInfoVisible_restful: false,
              });
              this.saveRestful();
              // alert('点击了保存按钮');
            }}
            // className="tankuang"
          >
            <form>
              <div className="form-horizontal">
                <label className="control-label">类型:</label>
                <div className="form-control">
                  <input
                    type="radio"
                    name="type"
                    value="0"
                    id="radio1"
                    checked={this.state.type === 0}
                    onChange={this.changeType}
                    // defaultChecked={true}
                  />
                  <label htmlFor="radio1">restful连接器</label>
                  <input
                    style={{ marginLeft: '20px' }}
                    type="radio"
                    name="type"
                    value="1"
                    id="radio2"
                    checked={this.state.type === 1}
                    onChange={this.changeType}
                  />
                  <label htmlFor="radio2">kafka连接器</label>
                </div>
              </div>

              <br />
              <div className="form-horizontal">
                <label className="control-label">更新方式:</label>
                <div className="form-control">
                  <input
                    type="radio"
                    name="updateType"
                    value="0"
                    id="updateType1"
                    checked={this.state.updateType === 0}
                    onChange={this.changeUpdate}
                    defaultChecked={true}
                  />
                  <label htmlFor="updateType1">全量</label>
                  <input
                    style={{ marginLeft: '20px' }}
                    type="radio"
                    name="updateType"
                    value="1"
                    id="updateType2"
                    checked={this.state.updateType === 1}
                    onChange={this.changeUpdate}
                  />
                  <label htmlFor="updateType2">增量</label>
                </div>
              </div>

              <br />
              <div className="form-horizontal">
                <label className="control-label">名称:</label>
                <input
                  name="name"
                  className="form-control"
                  placeholder="(必填)请输入名称"
                  // ref="passwordInput"
                  onChange={this.changeValue.bind(this, 'name')}
                required={true}/>
              </div>

              <br />
              <div className="form-horizontal">
                <label className="control-label">URI:</label>
                <input
                  name="uri"
                  className="form-control"
                  placeholder="(必填)请输入URI，例：http://www.huawei.com/chip"
                  onChange={this.changeValue.bind(this, 'uri')}
                />
              </div>

              <br />
              <div className="form-horizontal">
                <label className="control-label">header:</label>
                <input
                  name="header"
                  className="form-control"
                  placeholder="请输入请求头"
                  onChange={this.changeValue.bind(this, 'header')}
                />
              </div>

              <br />
              <div className="form-horizontal">
                <label className="control-label">params:</label>
                <input
                  name="params"
                  className="form-control"
                  placeholder="请输入JSONObject格式的body"
                  onChange={this.changeValue.bind(this, 'params')}
                />
              </div>

              <br />
              <div className="form-horizontal">
                <label className="control-label">method:</label>
                <div className="form-control">
                  <input
                    type="radio"
                    name="httpMethod"
                    value="GET"
                    id="httpMethod1"
                    defaultChecked={true}
                    checked={this.state.httpMethod == 'GET'}
                    onChange={e => this.changeHttpMethod(e)}
                  />
                  <label htmlFor="httpMethod1">GET</label>
                  <input
                    style={{ marginLeft: '20px' }}
                    type="radio"
                    name="httpMethod"
                    value="POST"
                    id="httpMethod2"
                    checked={this.state.httpMethod == 'POST'}
                    onChange={e => this.changeHttpMethod(e)}
                  />
                  <label htmlFor="httpMethod2">POST</label>
                </div>
              </div>

              <br />
              <div className="form-horizontal">
                <label className="control-label">contentType:</label>
                <input
                  name="contentType"
                  className="form-control"
                  placeholder="请输入contentType,例：application/json"
                  onChange={this.changeValue.bind(this, 'contentType')}
                />
              </div>

              <br />
              <div className="form-horizontal">
                <label className="control-label">body:</label>
                <input
                  name="body"
                  className="form-control"
                  placeholder="请输入JSONObject格式的body"
                  onChange={this.changeValue.bind(this, 'body')}
                />
              </div>

              <br />
              <div className="form-horizontal">
                <label className="control-label">定时任务:</label>
                <div className="mid">
                  <input
                    type="radio"
                    name="task"
                    value="0"
                    id="task1"
                    defaultChecked={true}
                    checked={this.state.task === 0}
                    onChange={this.changeTask}
                    // onChange={this.changeValue.bind(this, 'task')}
                  />
                  <label htmlFor="task1">关闭</label>
                  <input
                    style={{ marginLeft: '20px' }}
                    type="radio"
                    name="task"
                    value="1"
                    id="task2"
                    checked={this.state.task === 1}
                    onChange={this.changeTask}
                    // onChange={this.changeValue.bind(this, 'task')}
                  />
                  <label htmlFor="task2">开启</label>
                </div>
                <input
                  name="cron"
                  className="rig"
                  placeholder="请输入cron"
                  disabled={this.state.task == 0}
                  onChange={this.changeCron.bind(this)}
                />
              </div>

              <br />
              <div className="form-horizontal">
                <label className="control-label">备注:</label>
                <input
                  name="remark"
                  className="form-control"
                  placeholder="请输入备注"
                  onChange={this.changeValue.bind(this, 'remark')}
                />
              </div>
            </form>
          </Modal>

          <Modal
            id="modal2"
            visible={this.state.modalAddInfoVisible_kafka}
            title="新增"
            buttonVisible_cancel="true"
            buttonVisible_save="true"
            onCancel={() => {
              console.log('modal close');
              this.setState({
                modalAddInfoVisible_kafka: false,
              });
              constants.flag = false;
              // f = false;
            }}
            onConfirm={() => {
              this.saveKafka();
              // alert('点击了保存按钮');
            }}
            // className="tankuang"
          >
            <form>
              <div className="form-horizontal">
                <label className="control-label">类型:</label>
                <div className="form-control">
                  <input
                    type="radio"
                    name="type"
                    value="0"
                    id="radio1"
                    checked={this.state.type === 0}
                    onChange={this.changeType}
                    // defaultChecked={true}
                  />
                  <label htmlFor="radio1">restful连接器</label>
                  <input
                    style={{ marginLeft: '20px' }}
                    type="radio"
                    name="type"
                    value="1"
                    id="radio2"
                    checked={this.state.type === 1}
                    onChange={this.changeType}
                  />
                  <label htmlFor="radio2">kafka连接器</label>
                </div>
              </div>

              <br />
              <div className="form-horizontal">
                <label className="control-label">名称:</label>
                <input
                  className="form-control"
                  placeholder="(必填)请输入名称"
                  onChange={this.changeValue.bind(this, 'name')}
                />
              </div>

              <br />
              <div className="form-horizontal">
                <label className="control-label">topic:</label>
                <input
                  className="form-control"
                  placeholder="(必填)请输入topic"
                  onChange={this.changeValue.bind(this, 'topic')}
                />
              </div>

              <br />
              <div className="form-horizontal">
                <label className="control-label">备注:</label>
                <input
                  className="form-control"
                  placeholder="请输入备注"
                  onChange={this.changeValue.bind(this, 'remark')}
                />
              </div>
            </form>
          </Modal>
        </div>
      </div>
    );
  }
}

const type_map = {
  1: 'kafka',
  0: 'restful',
};

const status_map = {
  // -1: '不查询状态',
  0: '未知',
  1: '正常',
  2: '异常',
  3: '运行中',
};
interface BasicTableState{
  modalUpdateInfoVisible_restful: boolean,
  modalUpdateInfoVisible_kafka: boolean,
  updateType: number,
  name: string,
  uri: string,
  header: string,
  params: string,
  httpMethod: string,
  contentType: string,
  body: string,
  remark: string,
  id: string,
  type: number,
  topic: string,
  cron: any,
}
interface BasicTableProps{
  rows:any;
}
class BasicTable extends React.Component <BasicTableProps,BasicTableState>{
  constructor(props) {
    super(props);
    this.state = {
      modalUpdateInfoVisible_restful: false,
      modalUpdateInfoVisible_kafka: false,
      updateType: 0,
      type: 0,
      topic:'',
      name: '',
      uri: '',
      header: '',
      params: '',
      httpMethod: 'get',
      contentType: '',
      body: '',
      remark: '',
      id: '',
      cron: -1,
    };
    this.deleteConnector = this.deleteConnector.bind(this);
    this.updateInfo = this.updateInfo.bind(this);
    this.changeUpdate = this.changeUpdate.bind(this);
    this.changeHttpMethod = this.changeHttpMethod.bind(this);
    this.changeValue = this.changeValue.bind(this);
    this.saveUpadateRestful = this.saveUpadateRestful.bind(this);
    this.saveUpadateKafka = this.saveUpadateKafka.bind(this);
    this.request = this.request.bind(this);
    this.run = this.run.bind(this);
    this.stop = this.stop.bind(this);
  }
  sendID = id => {
    sessionStorage.id = id;
  };

  async updateInfo(now_id) {
    console.log('id是什么！！' + now_id);
    this.setState({
      id: now_id,
    });
    // 测试搜索连接器（按照Id查询连接器)
    try {
      const result = await axios({
        url:
          '/api-db/connector/info?page=1&rows=10&sortBy=name&sortDirection=desc',
        params: {
          id: now_id,
        },
        method: 'get',
      });
      // console.log(result.data.data);
      if (result.data.data.type === 1) {
        this.setState({
          modalUpdateInfoVisible_kafka: true,
          type: result.data.data.type,
          name: result.data.data.name,
          remark: result.data.data.remark,
          topic: result.data.data.uri,
        });
      } else {
        this.setState({
          modalUpdateInfoVisible_restful: true,
          type: result.data.data.type,
          updateType: result.data.data.updateType,
          name: result.data.data.name,
          uri: result.data.data.uri,
          header: JSON.stringify(result.data.data.header),
          params: JSON.stringify(result.data.data.params),
          httpMethod: result.data.data.httpMethod,
          contentType: result.data.data.contentType,
          body: JSON.stringify(result.data.data.body),
          cron: result.data.data.cron,
          remark: result.data.data.remark,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  deleteConnector(id) {
    // alert("id: "+id);
    const templist: Array<any> = [];
    templist.push(id);
    // console.log(templist);
    // console.log('试试connector/delete！！！！！！！！！！！start');
    // 测试删除连接器
    try {
      const result = axios({
        method: 'delete',
        url: '/api-db/connector/delete',
        data: templist,
      });
      console.log(result);
      alert('删除成功！');
      location.reload();
    } catch (error) {
      console.log(error);
      alert(error);
    }

  }

  changeUpdate() {
    if (this.state.updateType === 1) {
      this.setState({
        updateType: 0,
      });
    } else {
      this.setState({
        updateType: 1,
      });
    }
  }

  changeHttpMethod = e => {
    this.setState({
      httpMethod: e.target.value,
    });
  };

  // changeValue(name, e) {
  //   this.setState({
  //     [name]: e.target.value,
  //   });
  // }
  changeValue(name:any, event:any) {
    const newState = { [name]: event.target.value } as Pick<BasicTableState, keyof BasicTableState>;
    this.setState(newState);
    console.log("On Change!");
  }
  async postSaveUpadateRestful(){

  }
  async saveUpadateRestful() {
    // 测试更新连接器
    try {
      const result = await axios({
        url: '/api-db/connector/update',
        data: {
          id: this.state.id,
          type: this.state.type,
          name: this.state.name,
          uri: this.state.uri,
          header: JSON.parse(this.state.header),
          params: JSON.parse(this.state.params),
          httpMethod: this.state.httpMethod,
          contentType: this.state.contentType,
          updateType: this.state.updateType,
          body: JSON.parse(this.state.body),
          cron: this.state.cron,
          remark: this.state.remark,
        },
        method: 'post',
      });
      console.log(result);
      if(result.status === 200){
        location.reload();
      }
    } catch (error) {
      console.log(error);
      alert(error);
    }
    this.setState({
      modalUpdateInfoVisible_restful:false
    })
    // this.postSaveUpadateRestful();
    // location.reload();
  }
  // async postSaveUpadateKafka(){
  //   // console.log('id: ' + this.state.id, typeof this.state.id);
  //   // console.log('type: ' + this.state.type, typeof this.state.type);
  //   // console.log('name: ' + this.state.name, typeof this.state.name);
  //   // console.log('topic: ' + this.state.topic, typeof this.state.topic);
  //   // console.log('remark: ' + this.state.remark, typeof this.state.remark);
  //   // 测试更新连接器

  // }
  async saveUpadateKafka() {
    try {
      const result = await axios({
        url: '/api-db/connector/update',
        data: {
          id: this.state.id,
          uri: this.state.topic,
          type: this.state.type,
          name: this.state.name,
          remark: this.state.remark,
        },
        method: 'post',
      });
      console.log(result.status);
      if(result.status === 200){
        location.reload();
      }
      // location.reload();
    } catch (error) {
      console.log(error);
      alert(error);
    }
    this.setState({
      modalUpdateInfoVisible_kafka:false
    })
    // this.postSaveUpadateKafka();
  }

  async request(id){
    //测试访问连接器
    try {
      const result = await axios({
        url: '/api-db/connector/request',
        method: 'get',
        params: {
          connectorId:id
        },
      });
      console.log(result);
    } catch (error) {
      console.log(error);
    }

    location.reload();
  }

  async run (id,cron){
    //测试运行连接器定时任务
    try {
      const result = await axios({
        url: '/api-db/connector/run',
        method: 'get',
        params: {
          connectorId: id,
          cron: cron,
        },
      });
      console.log(result);
    } catch (error) {
      console.log(error);
    }
    location.reload();
  }

  async stop(id){
    //测试停止连接器定时任务
    try {
      const result = await axios({
        url: '/api-db/connector/stop',
        method: 'get',
        params: {
          connectorId: id,
        },
      });
      console.log(result);
    } catch (error) {
      console.log(error);
    }
    location.reload();
  }

  async componentDidMount() {
    // console.log('试试！！！！！！！！！！！start');
    // 测试获取连接器的列表
    // try {
    //   const response = await axios({
    //     url:
    //       '/api-db/connector/list?page=1&rows=10&sortBy=name&sortDirection=desc',
    //     method: 'get',
    //   });
    //   const result = response.data.data.content;
    //   this.setState({
    //     rows: result,
    //   });
    //   // rows = result;
    //   console.log(result);
    // } catch (error) {
    //   console.log(error);
    // }
    // 测试搜索连接器（按照type和名称查找)
    // try {
    //     const result = await axios({
    //         url:'/api-db/connector/info?page=1&rows=10&sortBy=name&sortDirection=desc',
    //         data:{
    //             type: 0,
    //             name: 'string'
    //         },
    //         method:'post',
    //     })
    //     console.log(result)
    // } catch(error){
    //     console.log(error)
    // }
    // 测试搜索连接器（按照Id查询连接器)
    // try {
    //   const result = await axios({
    //     url:
    //       '/api-db/connector/info?page=1&rows=10&sortBy=name&sortDirection=desc',
    //     params: {
    //       id: '6146e0e91350e2133a785481',
    //     },
    //     method: 'get',
    //   });
    //   console.log(result);
    // } catch (error) {
    //   console.log(error);
    // }
    // //测试访问连接器   no,不知道connectorId
    // try {
    //   const result = await axios({
    //     url: '/api-db/connector/request',
    //     method: 'get',
    //     params: {
    //       connectorId:''
    //     },
    //   });
    //   console.log(result);
    // } catch (error) {
    //   console.log(error);
    // }
    // //测试运行连接器定时任务   no，不知道connectorId和cron
    // try {
    //   const result = await axios({
    //     url: '/api-db/connector/run',
    //     method: 'get',
    //     params: {
    //       connectorId: '',
    //       cron: '',
    //     },
    //   });
    //   console.log(result);
    // } catch (error) {
    //   console.log(error);
    // }
    // //测试停止连接器定时任务   no,不知道connectorId
    // try {
    //   const result = await axios({
    //     url: '/api-db/connector/stop',
    //     method: 'get',
    //     params: {
    //       connectorId: '',
    //     },
    //   });
    //   console.log(result);
    // } catch (error) {
    //   console.log(error);
    // }
    // 测试保存连接器
    // try {
    //   const result = await axios({
    //     url: '/api-db/connector/save',
    //     data: {
    //       type: 0,
    //       name: 'it_1',
    //       uri: 'http://localhost:8080/record/getJson',
    //       header: {},
    //       params: {},
    //       httpMethod: 'GET',
    //       contentType: 'application/json',
    //       body: {},
    //       cron: '-1',
    //       remark: '',
    //     },
    //     method: 'post',
    //   });
    //   console.log(result);
    // } catch (error) {
    //   console.log(error);
    // }
    // 测试更新连接器
    // try {
    //   const result = await axios({
    //     url: '/api-db/connector/update',
    //     data: {
    //         id: '6146065b1350e2133a78547c',
    //         type:0,
    //         name: 'it_0',
    //         uri: 'http://localhost:8080/record/getJson',
    //         header: {},
    //         params: {},
    //         httpMethod: 'GET',
    //         contentType: 'application/json',
    //         body: {},
    //         cron: '-1',
    //         remark: ''
    //     },
    //     method: 'post',
    //   });
    //   console.log(result);
    // } catch (error) {
    //   console.log(error);
    // }
    // 测试删除连接器
    // try {
    //   const result = await axios({
    //     method: 'delete',
    //     url: '/api-db/connector/delete',
    //     data: ['6146e00a1350e2133a785480'],
    //   });
    //   console.log(result);
    // } catch (error) {
    //   console.log(error);
    // }
    //
    // console.log('试试！！！！！！！！！！！end');
    // console.log('试试！！！！！！！！！！！end2');
  }
  render() {
    // @ts-ignore
    return (
      <TableContainer component={Paper}>
        <Table style={{ marginTop: '40px' }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>名称</TableCell>
              <TableCell align="center">url/topic</TableCell>
              <TableCell align="center">类型</TableCell>
              <TableCell align="center">状态</TableCell>
              <TableCell align="center">操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.props.rows.map(row => (
              // (sessionStorage["id"] = row.id),
              <TableRow key={row.id} id={row.id}>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="center">{row.uri}</TableCell>
                <TableCell align="center">{type_map[row.type]}</TableCell>
                <TableCell align="center">{status_map[row.status]}</TableCell>
                <TableCell align="center">
                  <button
                    className="request_stop_run_button"
                    onClick={() => this.request(row.id)}
                  >
                    * 访问
                  </button>
                  {row.status === 3 ? (
                    (<button
                      className="request_stop_run_button"
                      onClick={() => this.stop(row.id)}
                    >
                      = 暂停
                    </button>)):null
                  }
                  {(row.status === 2 || row.status === 1 ) && (row.cron != -1)? (
                    (<button
                      className="request_stop_run_button"
                      onClick={() => this.run(row.id,row.cron)}
                    >
                      {'>'} 启动
                    </button>)):null
                  }
                  <Link
                    to={{
                      pathname: '/connectorInfo',
                      // state: {
                      //   id: row.id,
                      // },
                    }}
                  >
                    <button
                      className="openinfo_button"
                      onClick={() => this.sendID(row.id)}
                    >
                      详情
                    </button>
                  </Link>

                  {/*编辑*/}
                  <button
                    className="updateinfo_button"
                    onClick={() => this.updateInfo(row.id)}
                  >
                    编辑
                  </button>
                  <Modal
                    id="modal1"
                    visible={this.state.modalUpdateInfoVisible_restful}
                    title="编辑"
                    buttonVisible_cancel="true"
                    buttonVisible_save="true"
                    onCancel={() => {
                      console.log('modal close');
                      this.setState({
                        modalUpdateInfoVisible_restful: false,
                      });
                    }}
                    onConfirm={() => {
                      this.saveUpadateRestful();
                      alert('编辑成功!');
                    }}
                    // className="tankuang"
                  >
                    <form>
                      <div className="form-horizontal">
                        <label className="control-label">更新方式:</label>
                        <div className="form-control">
                          <input
                            type="radio"
                            name="updateType"
                            value="0"
                            id="updateType1"
                            checked={this.state.updateType == 0}
                            onChange={this.changeUpdate}
                          />
                          <label htmlFor="updateType1">全量</label>
                          <input
                            style={{ marginLeft: '20px' }}
                            type="radio"
                            name="updateType"
                            value="1"
                            id="updateType2"
                            checked={this.state.updateType == 1}
                            onChange={this.changeUpdate}
                          />
                          <label htmlFor="updateType2">增量</label>
                        </div>
                      </div>

                      <br />
                      <div className="form-horizontal">
                        <label className="control-label">名称:</label>
                        <input
                          name="name"
                          className="form-control"
                          placeholder={this.state.name}
                          onChange={this.changeValue.bind(this, 'name')}
                        />
                      </div>

                      <br />
                      <div className="form-horizontal">
                        <label className="control-label">URL:</label>
                        <input
                          name="uri"
                          className="form-control"
                          placeholder={this.state.uri}
                          onChange={this.changeValue.bind(this, 'uri')}
                        />
                      </div>

                      <br />
                      <div className="form-horizontal">
                        <label className="control-label">header:</label>
                        <input
                          name="header"
                          className="form-control"
                          placeholder={this.state.header}
                          onChange={this.changeValue.bind(this, 'header')}
                        />
                      </div>

                      <br />
                      <div className="form-horizontal">
                        <label className="control-label">params:</label>
                        <input
                          name="params"
                          className="form-control"
                          placeholder={this.state.params}
                          onChange={this.changeValue.bind(this, 'params')}
                        />

                      </div>

                      <br />
                      <div className="form-horizontal">
                        <label className="control-label">method:</label>
                        <div className="form-control">
                          <input
                            type="radio"
                            name="httpMethod"
                            value="GET"
                            id="httpMethod1"
                            checked={this.state.httpMethod == 'GET'}
                            onChange={e => this.changeHttpMethod(e)}
                          />
                          <label htmlFor="httpMethod1">GET</label>
                          <input
                            style={{ marginLeft: '20px' }}
                            type="radio"
                            name="httpMethod"
                            value="POST"
                            id="httpMethod2"
                            checked={this.state.httpMethod == 'POST'}
                            onChange={e => this.changeHttpMethod(e)}
                          />
                          <label htmlFor="httpMethod2">POST</label>
                        </div>
                      </div>

                      <br />
                      <div className="form-horizontal">
                        <label className="control-label">contentType:</label>
                        <input
                          className="form-control"
                          placeholder={this.state.contentType}
                          onChange={this.changeValue.bind(this, 'contentType')}
                        />
                      </div>

                      <br />
                      <div className="form-horizontal">
                        <label className="control-label">body:</label>
                        <input
                          className="form-control"
                          placeholder={this.state.body}
                          onChange={this.changeValue.bind(this, 'body')}
                        />
                      </div>

                      <br />
                      <div className="form-horizontal">
                        <label className="control-label">备注:</label>
                        <input
                          name="remark"
                          className="form-control"
                          placeholder={this.state.remark}
                          onChange={this.changeValue.bind(this, 'remark')}
                        />
                      </div>
                    </form>
                  </Modal>

                  <Modal
                    id="modal2"
                    visible={this.state.modalUpdateInfoVisible_kafka}
                    title="编辑"
                    buttonVisible_cancel="true"
                    buttonVisible_save="true"
                    onCancel={() => {
                      console.log('modal close');
                      this.setState({
                        modalUpdateInfoVisible_kafka: false,
                      });
                    }}

                    onConfirm={() => {
                      this.setState({
                        modalUpdateInfoVisible_kafka: false,
                      });
                      this.saveUpadateKafka();
                      // alert('编辑成功!');
                    }}
                    // className="tankuang"
                  >

                    <form>
                      <div className="form-horizontal">
                        <label className="control-label">名称:</label>
                        <input
                          className="form-control"
                          placeholder={this.state.name}
                          onChange={this.changeValue.bind(this, 'name')}
                        />
                      </div>

                      <br />
                      <div className="form-horizontal">
                        <label className="control-label">备注:</label>
                        <input
                          className="form-control"
                          placeholder={this.state.remark}
                          onChange={this.changeValue.bind(this, 'remark')}
                        />
                      </div>
                    </form>
                  </Modal>

                  <button
                    className="deleteinfo_button"
                    onClick={() => this.deleteConnector(row.id)}
                  >
                    删除
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
}

// class SlideBar1 extends React.Component {
//   constructor(props) {
//     super(props);
//   }
//
//   render() {
//     return (
//       <Router>
//         <div>
//           {/* <ul className="slidebar" >
//               <li><Link to='./slidePages/connect'>连接器</Link></li>
//               <li><Link to='/about'>一级选项2</Link></li>
//               <li><Link to='/theme'>一级选项3</Link></li>
//             </ul> */}
//           <Route path="./slidePages/connect">
//             <Connect />
//           </Route>
//           {/*<Route path='/about' component={xuanxiangyi}/>*/}
//           {/*<Route path='/theme' component={xuanxianger}/>*/}
//         </div>
//       </Router>
//     );
//   }
// }

const Connector = () => {
  return (
    <div className="App">
      <header className="App-header">
        <div className="connector-body">
          <Select />
          {/*<PagerTest />*/}
        </div>
      </header>
    </div>
  );
};

export default Connector;
