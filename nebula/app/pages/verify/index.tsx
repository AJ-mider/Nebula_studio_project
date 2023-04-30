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
import axios from 'axios';
// import {PagerTest} from '../../components/PagerTest';
import React from 'react';
import '../../components/pager.css';
import './index.css';
import { Link } from 'react-router-dom';

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
function handleClick(num, props) {
  return () => {
    if (num === 'first') {
      // 首页
      props.onPageChange(1);
    } else if (num === 'prev') {
      if (props.current !== 1) {
        props.onPageChange(props.current - 1);
      }
    } else if (num === 'next') {
      if (props.current !== getPageNum(props.total, props.size)) {
        props.onPageChange(props.current + 1);
      }
    } else if (num === 'end') {
      props.onPageChange(getPageNum(props.total, props.size));
    } else {
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
  const numPageArr:Array<any> = [];
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
class PagerTest extends React.Component <PagerTestProps,PagerTestState>{
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

  async componentWillReceiveProps(nextProps) {
    this.setState({
      type: nextProps.type,
      name: nextProps.name,
      current: 1,
    });
    console.log('!!!!!!!!!!type: ' + this.state.type);
    console.log('!!!!!!!!!!name: ' + this.state.name);
    if (this.state.type == '未选择' || this.state.type == '-1') {
      console.log('未选择');
      console.log('current: ' + this.state.current);
      // 测试获取连接器的列表
      try {
        const response = await axios({
          url: '/api-db/verify/list?rows=10&sortBy=name&sortDirection=desc',
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
      } catch (error) {
        console.log(error);
      }
    } else {
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

  async changeRow() {
    if (this.state.type == '未选择' || this.state.type == '-1') {
      console.log('未选择');
      console.log('current: ' + this.state.current);
      // 测试获取连接器的列表
      try {
        const response = await axios({
          url: '/api-db/verify/list?rows=10&sortBy=name&sortDirection=desc',
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
      } catch (error) {
        console.log(error);
      }
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

  onPageChange = current => {
    console.log(current);
    this.setState(
      {
        current,
      },
      () => {
        this.changeRow();
      },
    );
  };

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
  rows: any;
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
  }

  render() {
    return (
      <div>
        <AddCon />
        <PagerTest type={this.state.t} name={this.state.n} />
      </div>
    );
  }
}
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
interface ModalState{
  buttonVisible_cancel: any;
  buttonVisible_save: any;
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
interface TagSelectorState{
  tagrows:any,
  // tagid:number,
  // tag2rows:any,
  // tag2id:number,
  propertyrows:any,
  // propertyid:number,
  tag:string,
  property:string,
  // property2rows:any,
  // property2id:number,
}
interface TagSelectorProps{
  tag: any;
  property: any;
  onCategoryChange(tag,property);
}
class TagSelector extends React.Component<TagSelectorProps,TagSelectorState>{
  constructor(props) {
    super(props);
    this.state = {
      
      // tagid:this.props.tagid,
      // tag2rows:[],
      // tag2id:0,
      tagrows:[],
      propertyrows:[],
      
      tag:this.props.tag,
      property:this.props.property,
      // propertyid:this.props.propertyid,
      // property2rows:[],
      // property2id:0,
    };
    this.onFirstCategoryChange = this.onFirstCategoryChange.bind(this);
    this.onSecondCategoryChange = this.onSecondCategoryChange.bind(this);
    this.loadFirstCategory = this.loadFirstCategory.bind(this);
    this.loadSecondCategory = this.loadSecondCategory.bind(this);
    this.onPropsCategoryChange = this.onPropsCategoryChange.bind(this);
  }
  async componentDidMount() {
    try {
      const response = await axios({
        url:
          '/api-db/verify/getTags',
        method: 'get',
      });
      console.log(
        'response.data.data： ' +
          response.data.data,
      );
      const result = response.data.data;
      this.setState({
        tagrows: result,
      });
      // console.log('total-componentDidMount： ' + this.state.tagrows);
    } catch (error) {
      console.log(error);
    }
    if(this.state.tag){
      this.loadSecondCategory();
    }
  }
  //一级品类改变事件
  onFirstCategoryChange(e){
    //取一级品类的值，没有的话为0
    let newValue=e.target.value || '';
    // console.log(newValue);
    this.setState({

        tag : newValue,
        //当一级品类改变时清空二级品类
        propertyrows : [],
        property : '',
    },() => {
        //加载二级分类
        this.loadSecondCategory()
    })
  }
  //二级品类改变事件
  onSecondCategoryChange(e){
        //取一级品类的值，没有的话为0
        let newValue=e.target.value || '';
        this.setState({
            property : newValue,
        },() => {
            //加载二级分类
            this.onPropsCategoryChange();
        })
  }
  //加载一级分类
  async loadFirstCategory(){
    
    try {
      const response = await axios({
        url:
          '/api-db/verify/getTags',
        method: 'get',
      });
      console.log(
        'response.data.data： ' +
          response.data.data,
      );
      const result = response.data.data;
      this.setState({
        tagrows: result,
        // tag2rows: result,
      });
      // console.log('total-componentDidMount： ' + this.state.tagrows);
    } catch (error) {
      console.log(error);
    }
    
  }
  // 加载二级分类
  async loadSecondCategory(){
    try {
      const response = await axios({
        url:
          '/api-db/verify/getTagDescription',
        params: {
                  tag: this.state.tag,
                },
        method: 'get',
      });
      console.log(
        'response.data.data： ' +
          response.data.data,
      );
      const result = response.data.data;
      this.setState({
        propertyrows: result,
        // tag2rows: result,
      });
      // console.log('total-componentDidMount： ' + this.state.propertyrows);
    } catch (error) {
      console.log(error);
    }
  }
  // 传给父组件选中的结果
  onPropsCategoryChange(){
    // 判断props里的回调函数存在
    let categoryChangable = typeof this.props.onCategoryChange === 'function';
    // 如果是有二级品类
    if(this.state.propertyrows){
        categoryChangable && this.props.onCategoryChange(this.state.tag,this.state.property);
    }
    // 如果只有一级品类
    else{
        categoryChangable && this.props.onCategoryChange(this.state.tag, '');
    }
  }
  render(){
    return(
      <div className="col-md-10">
        <select name="" onChange={(e) => this.onFirstCategoryChange(e)} className="form-control cate-select" value={this.state.tag}>
            <option value=" ">请选择tag</option>
            {
            //箭头函数=>右边，加上了{}就需要return,不加就不需要return
              this.state.tagrows.map(
                  (category, index) => <option value={category} key={index}>{category}</option>)
            }
        </select>
        { this.state.propertyrows && this.state.propertyrows.length ?
        <select name="" onChange={(e) => this.onSecondCategoryChange(e)} className="form-control cate-select" value={this.state.property}>
            <option value=" ">请选择属性</option>
            {
              this.state.propertyrows.map(
                  (category, index)=> <option value={category} key={index}>{category}</option>
              )
            }
        </select> : null
        }
    </div>
    )
  }

}
interface AddConState {
  modalAddInfoVisible: boolean;
  // modalUpdateInfoVisible:boolean;
  id : string;
  tag1 : string;
  property1 : string;
  standard : string;
  tag2 : string;
  property2 : string;
  type : number;
  email : string;
  emailproperty1 : string;
  emailproperty2 : string;

  // property1id : any;
  // tag1id : any;
  // property2id : any;
  // tag2id : any;
}
class AddCon extends React.Component<{}, AddConState> {
  constructor(props) {
    super(props);
    this.state = {
      modalAddInfoVisible: false,
      id:'',
      tag1:'',
      property1:'',
      standard:'=',
      tag2:'',
      property2:'',
      type:0,
      email:'',
      emailproperty1:'',
      emailproperty2:'',

      // tag1rows:[],
      // tag1id:-1,
      // tag2rows:[],
      // tag2id:-1,
      // property1rows:[],
      // property1id:-1,
      // property2rows:[],
      // property2id:-1,
    };
    this.openModalAddInfo = this.openModalAddInfo.bind(this);
    this.saveVerify = this.saveVerify.bind(this);
    this.onTag1Change = this.onTag1Change.bind(this);
    this.onTag2Change = this.onTag2Change.bind(this);
    this.onStandardChange = this.onStandardChange.bind(this);
    this.onTypeChange = this.onTypeChange.bind(this);
    this.changeValue = this.changeValue.bind(this);
    
  }

  openModalAddInfo() {
    this.setState({
      modalAddInfoVisible: true,
    });
    // constants.flag = true;
    // f = true;
  }
  
  //品类改变事件
  onTag1Change(tag,property){
    this.setState({
      tag1 : tag,
      property1 : property,
    });
    console.log('proid',this.state.property1);
  }
  onTag2Change(tag,property){
    this.setState({
      tag2 : tag,
      property2 : property,
    });
    
  }
  
  onTag1EmailChange(tag,property){
    this.setState({
      emailproperty1 : property,
    });
    console.log('email1',tag,this.state.emailproperty1);
  }

  onTag2EmailChange(tag,property){
    this.setState({
      emailproperty2 : property,
    });
    console.log('email2',tag,this.state.emailproperty2);
  }
  
  changeValue(name:any, event:any) {
    const newState = { [name]: event.target.value } as Pick<AddConState, keyof AddConState>;
    this.setState(newState);
    console.log("On Change!");
  }

  onStandardChange(event){
    this.setState({
        standard:event.target.value
    })
  }
  onTypeChange(event){
    this.setState({
        type:event.target.value
    })
  }
  // async postSaveVerify(){
    
  // }
  async saveVerify() {
    try {
      const result = await axios({
        url: '/api-db/verify/save',
        data: {
          id:this.state.id,
          tag1:this.state.tag1,
          property1:this.state.property1,
          standard:this.state.standard,
          tag2:this.state.tag2,
          property2:this.state.property2,
          type:this.state.type,
          email:this.state.email,
          emailProperty1:this.state.emailproperty1,
          emailProperty2:this.state.emailproperty2,
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
    // this.postSaveVerify();
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
            visible={this.state.modalAddInfoVisible}
            title="新增"
            buttonVisible_cancel="true"
            buttonVisible_save="true"
            onCancel={() => {
              console.log('modal close');
              this.setState({
                modalAddInfoVisible: false,
              });
              constants.flag = false;
              // f = false;
            }}
            onConfirm={() => {
              this.setState({
                modalAddInfoVisible: false,
              });
              this.saveVerify();
              // alert('点击了保存按钮');
            }}
            // className="tankuang"
          >
            <form>
              <div className="form-horizontal">
                <label className="control-label">TAG1:</label>
                <div className="form-control">
                {/* <LazyOptions/> */}
                <TagSelector
                    tag={this.state.tag1}
                    property={this.state.property1}
                    onCategoryChange={ (tag,property) => this.onTag1Change(tag,property)} />
                
                </div>
              </div>

              <br />
              <div className="form-horizontal">
                <label className="control-label">校验规则:</label>
                <div className="form-control">
                
                <select name="standard" 
                            onChange={e=>this.onStandardChange(e)} 
                            value={this.state.standard}>
                        <option value="=">{' = '}</option>
                        <option value=">">{' > '}</option>
                        <option value="<">{' < '}</option>
                </select>
                </div>
              </div>

              <br />
              <div className="form-horizontal">
                <label className="control-label">TAG2:</label>
                <div className="form-control">
                <TagSelector
                    tag={this.state.tag2}
                    property={this.state.property2}
                    onCategoryChange={ (tag,property) => this.onTag2Change(tag,property)} />
                </div>
              </div>

              <br />
              <div className="form-horizontal">
                <label className="control-label">告警类型:</label>
                
                <select name="type"
                  onChange={e=>this.onTypeChange(e)} 
                  value={this.state.type}>
                  <option value="0">仅标注</option>
                  <option value="1">标注且邮箱告知</option>
                </select>
              </div>

              <br />
              <div className="form-horizontal">
                <label className="control-label">TAG1邮箱:</label>
                <div className="form-control">
                <TagSelector
                    tag={this.state.tag1}
                    property={this.state.property1}
                    onCategoryChange={ (tag,property) => this.onTag1EmailChange(tag,property)} />
                </div>
              </div>
              <br />
              <div className="form-horizontal">
                <label className="control-label">TAG2邮箱:</label>
                <div className="form-control">
                <TagSelector
                    tag={this.state.tag2}
                    property={this.state.property2}
                    onCategoryChange={ (tag,property) => this.onTag2EmailChange(tag,property)} />
                </div>
              </div>
              <br />
              <div className="form-horizontal">
                <label className="control-label">通知邮箱:</label>
                <input
                  name="params"
                  className="form-control"
                  placeholder="请输入需要额外通知的邮箱："
                  onChange={this.changeValue.bind(this, 'email')}
                />
              </div>

            </form>
          </Modal>

        </div>
      </div>
    );
  }
}

interface BasicTableState{
  modalAddInfoVisible: boolean;
  modalUpdateInfoVisible: boolean;
  id : string;
  tag1 : string;
  property1 : string;
  standard : string;
  tag2 : string;
  property2 : string;
  type : number;
  email : string;
  emailproperty1 : string;
  emailproperty2 : string;

  // property1id : any;
  // tag1id : any;
  // property2id : any;
  // tag2id : any;
}
interface BasicTableProps{
  rows:any;
}
class BasicTable extends React.Component<BasicTableProps,BasicTableState> {
  constructor(props) {
    super(props);
    this.state = {
      modalAddInfoVisible: false,
      modalUpdateInfoVisible:false,
      id:'',
      tag1:'',
      property1:'',
      standard:'',
      tag2:'',
      property2:'',
      type:0,
      email:'',
      emailproperty1:'',
      emailproperty2:'',

    };
    this.openModalAddInfo = this.openModalAddInfo.bind(this);
    this.updateInfo = this.updateInfo.bind(this);
    this.onTag1Change = this.onTag1Change.bind(this);
    this.onTag2Change = this.onTag2Change.bind(this);
    this.onStandardChange = this.onStandardChange.bind(this);
    this.onTypeChange = this.onTypeChange.bind(this);
    this.changeValue = this.changeValue.bind(this);
  }

  openModalAddInfo() {
    this.setState({
      modalAddInfoVisible: true,
    });
    // constants.flag = true;
    // f = true;
  }
  
  //品类改变事件
  onTag1Change(tag,property){
    this.setState({
      tag1 : tag,
      property1 : property,
    });
    console.log('proid',this.state.property1);
  }
  onTag2Change(tag,property){
    this.setState({
      tag2 : tag,
      property2 : property,
    });
    
  }
  
  onTag1EmailChange(tag,property){
    this.setState({
      emailproperty1 : property,
    });
    console.log('email1',tag,property);
  }

  onTag2EmailChange(tag,property){
    this.setState({
      emailproperty2 : property,
    });
    console.log('email2',tag,property);
  }
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
  onStandardChange(event){
    this.setState({
        standard:event.target.value
    })
  }
  onTypeChange(event){
    this.setState({
        type:event.target.value
    })
  }
  
  async updateInfo(now_id) {
    console.log('id是什么！！' + now_id);
    this.setState({
      id: now_id,
    });
    // 测试搜索verify（按照Id查询)
    try {
      const result = await axios({
        url:
          '/api-db/verify/info',
        params: {
          id: now_id,
        },
        method: 'get',
      });
      console.log(result.data.data);
      this.setState({
        modalUpdateInfoVisible: true,
        id:result.data.data.id,
        tag1:result.data.data.tag1,
        property1:result.data.data.property1,
        standard:result.data.data.standard,
        tag2:result.data.data.tag2,
        property2:result.data.data.property2,
        type:result.data.data.type,
        email:result.data.data.email,
        emailproperty1:result.data.data.emailProperty1,
        emailproperty2:result.data.data.emailProperty2,
      });
      
    } catch (error) {
      console.log(error);
    }
  }
 
  // async postSaveUpdate(){
    
  // }
  async saveUpadate(){
    try {
      const result = await axios({
        url: '/api-db/verify/save',
        data: {
          id:this.state.id,
          tag1:this.state.tag1,
          property1:this.state.property1,
          standard:this.state.standard,
          tag2:this.state.tag2,
          property2:this.state.property2,
          type:this.state.type,
          email:this.state.email,
          emailProperty1:this.state.emailproperty1,
          emailProperty2:this.state.emailproperty2,
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
    // this.postSaveUpdate();
    // location.reload();
  }
  deleteVerify(id) {
    const templist:Array<any> = [];
    templist.push(id);
    
    try {
      const result = axios({
        method: 'delete',
        url: '/api-db/verify/delete',
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

 
  async componentDidMount() {
    
  }
  render() {
    // @ts-ignore
    return (
      <TableContainer component={Paper}>
        <Table style={{ marginTop: '40px' }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>tag1</TableCell>
              {/* <TableCell align="center">property1</TableCell> */}
              <TableCell align="center">验证标准</TableCell>
              <TableCell align="center">tag2</TableCell>
              {/* <TableCell align="center">property2</TableCell> */}
              {/* <TableCell align="center"></TableCell> */}
              <TableCell align="center">操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.props.rows.map(row => (
              // (sessionStorage["id"] = row.id),
              <TableRow key={row.id} id={row.id}>
                <TableCell component="th" scope="row">
                  {row.tag1}-{row.property1}
                </TableCell>
                {/* <TableCell align="center">{row.property1}</TableCell> */}
                <TableCell align="center">{row.standard}</TableCell>
                <TableCell align="center">{row.tag2}-{row.property2}</TableCell>
                {/* <TableCell align="center">{row.emailProperty1}</TableCell> */}
                {/* <TableCell align="center">{row.emailProperty2}</TableCell> */}
                {/* <TableCell align="center">{row.property2}</TableCell> */}
                
                <TableCell align="center">
                  
                  {/*编辑*/}
                  <button
                    className="updateinfo_button"
                    onClick={() => this.updateInfo(row.id)}
                  >
                    编辑
                  </button>
                  <Modal
                    id="modal1"
                    visible={this.state.modalUpdateInfoVisible}
                    title="编辑"
                    buttonVisible_cancel="true"
                    buttonVisible_save="true"
                    onCancel={() => {
                      console.log('modal close');
                      this.setState({
                        modalUpdateInfoVisible: false,
                      });
                    }}
                    onConfirm={() => {
                      this.saveUpadate();
                      alert('编辑成功!');
                    }}
                    // className="tankuang"
                  >
                    <form>
              <div className="form-horizontal">
                <label className="control-label">TAG1:</label>
                <div className="form-control">
                {/* <LazyOptions/> */}
                <TagSelector
                    tag={this.state.tag1}
                    property={this.state.property1}
                    onCategoryChange={ (tag,property) => this.onTag1Change(tag,property)} />
                
                </div>
              </div>

              <br />
              <div className="form-horizontal">
                <label className="control-label">校验规则:</label>
                <div className="form-control">
                
                <select name="standard" 
                            onChange={e=>this.onStandardChange(e)} 
                            value={this.state.standard}>
                        <option value="=">{' = '}</option>
                        <option value=">">{' > '}</option>
                        <option value="<">{' < '}</option>
                </select>
                </div>
              </div>

              <br />
              <div className="form-horizontal">
                <label className="control-label">TAG2:</label>
                <div className="form-control">
                <TagSelector
                    tag={this.state.tag2}
                    property={this.state.property2}
                    onCategoryChange={ (tag,property) => this.onTag2Change(tag,property)} />
                </div>
              </div>

              <br />
              <div className="form-horizontal">
                <label className="control-label">告警类型:</label>
                
                <select name="type"
                  onChange={e=>this.onTypeChange(e)} 
                  value={this.state.type}>
                  <option value="0">仅标注</option>
                  <option value="1">标注且邮箱告知</option>
                </select>
              </div>

              <br />
              <div className="form-horizontal">
                <label className="control-label">TAG1邮箱:</label>
                <div className="form-control">
                <TagSelector
                    tag={this.state.tag1}
                    property={this.state.emailproperty1}
                    onCategoryChange={ (tag,property) => this.onTag1EmailChange(tag,property)} />
                </div>
              </div>
              <br />
              <div className="form-horizontal">
                <label className="control-label">TAG2邮箱:</label>
                <div className="form-control">
                <TagSelector
                    tag={this.state.tag2}
                    property={this.state.emailproperty2}
                    onCategoryChange={ (tag,property) => this.onTag2EmailChange(tag,property)} />
                </div>
              </div>
              <br />
              <div className="form-horizontal">
                <label className="control-label">通知邮箱:</label>
                <input
                  name="params"
                  className="form-control"
                  placeholder={this.state.email}
                  onChange={this.changeValue.bind(this, 'email')}
                />
              </div>

            </form>
                  </Modal>

                  
                  <button
                    className="deleteinfo_button"
                    onClick={() => this.deleteVerify(row.id)}
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

const Verify = () => {
  return (
    <div className="App">
      <header className="App-header">
        <div className="connector-body">
        <div>
          <Link
              to={{
                pathname: '/verifyRecord',
              }}
            >
              <button
                className="recordbutton"
              >
                校验记录
              </button>
            </Link>
        </div>

        {/* <AddCon />
        <PagerTest type={this.state.t} name={this.state.n} /> */}
          <Select />
        </div>
      </header>
    </div>
  );
};

export default Verify;
