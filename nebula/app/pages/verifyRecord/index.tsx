// import logo from './logo.svg';

// import MenuItem from 'antd/es/menu/MenuItem';
import Paper from '@material-ui/core/Paper';
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
          url: '/api-db/verifyRecord/list?rows=10&sortBy=name&sortDirection=desc',
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
      // console.log('!!!!!!!!!!按照type和名称查找');
      // // 测试搜索连接器（按照type和名称查找)
      // const t = this.state.type === '0' ? 0 : 1;
      // const n = this.state.name;
      // try {
      //   const response = await axios({
      //     url:
      //       '/api-db/connector/info?page=1&rows=10&sortBy=name&sortDirection=desc',
      //     data: {
      //       type: t,
      //       name: n,
      //       status: -1,
      //     },
      //     method: 'post',
      //   });
      //   const result = response.data.data.content;
      //   this.setState({
      //     rows: result,
      //     total: response.data.data.totalElements,
      //   });
      // } catch (error) {
      //   console.log(error);
      // }
    }
  }

  async changeRow() {
    if (this.state.type == '未选择' || this.state.type == '-1') {
      console.log('未选择');
      console.log('current: ' + this.state.current);
      // 测试获取连接器的列表
      try {
        const response = await axios({
          url: '/api-db/verifyRecord/list?rows=10&sortBy=name&sortDirection=desc',
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
      // console.log('!!!!!!!!!!按照type和名称查找');
      // // 测试搜索连接器（按照type和名称查找)
      // const t = this.state.type === '0' ? 0 : 1;
      // const n = this.state.name;
      // try {
      //   const response = await axios({
      //     url: '/api-db/connector/info?rows=10&sortBy=name&sortDirection=desc',
      //     params: {
      //       page: this.state.current,
      //     },
      //     data: {
      //       type: t,
      //       name: n,
      //       status: -1,
      //     },
      //     method: 'post',
      //   });
      //   const result = response.data.data.content;
      //   this.setState({
      //     rows: result,
      //     total: response.data.data.totalElements,
      //   });
      // } catch (error) {
      //   console.log(error);
      // }
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
        <PagerTest type={this.state.t} name={this.state.n} />
      </div>
    );
  }
}


interface BasicTableState{
  id : string;
}
interface BasicTableProps{
  rows:any;
}
class BasicTable extends React.Component<BasicTableProps,BasicTableState> {
  constructor(props) {
    super(props);
    this.state = {
      id:'',
    };
  }

  
  deleteVerify(id) {
    const templist:Array<any> = [];
    templist.push(id);
    
    try {
      const result = axios({
        method: 'delete',
        url: '/api-db/verifyRecord/delete',
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
              <TableCell>校验对象类型</TableCell>
              <TableCell align="center">校验对象1</TableCell>
              <TableCell align="center">校验对象2</TableCell>
              <TableCell align="center">校验时间</TableCell>
              <TableCell align="center">校验结果</TableCell>
              <TableCell align="center">操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.props.rows.map(row => (
              // (sessionStorage["id"] = row.id),
              <TableRow key={row.id} id={row.id}>
                <TableCell component="th" scope="row">
                  {row.tag}
                </TableCell>
                <TableCell align="center">{row.entityId1}</TableCell>
                <TableCell align="center">{row.entityId2}</TableCell>
                <TableCell align="center">{row.date}</TableCell>
                <TableCell align="center">{row.inform}</TableCell>
                <TableCell align="center">
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

const VerifyRecord = () => {
  return (
    <div className="App">
      <header className="App-header">
        <div className="connector-body">
        {/* <AddCon />
        <PagerTest type={this.state.t} name={this.state.n} /> */}
          <Select />
        </div>
      </header>
    </div>
  );
};

export default VerifyRecord;
