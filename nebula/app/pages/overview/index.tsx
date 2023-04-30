import * as React from 'react';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Dayjs } from 'dayjs';
import Box from '@mui/material/Box';
import ReactECharts from 'echarts-for-react';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleIcon from '@mui/icons-material/AddCircle';

import './index.css';
import '../../components/pager.css';
import axios from 'axios';

import { Link } from 'react-router-dom';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Card, CardContent, CardHeader, Container, Grid, Typography } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';


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

interface AddVulState {

}
class AddVul extends React.Component<{}, AddVulState> {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  async insertVulner() {
    try {
      await axios({
        url: '/api-db/insertVulner/insert_vulner',
        method: 'post',
        params:{
          space: "AllProjects"
        },
      });
      console.log("ok++++++++++++++++++++++");
      location.reload();
    } catch (error) {
      console.log("error++++++++++++++++++++++");
      alert(error);
    }
  }

  render() {
    return (
      <div>
        <div className="foradd">
          {/* <Button variant="contained" onClick={this.openModalAddInfo} endIcon={<AddCircleIcon />}> */}
          <Button variant="contained" onClick={this.insertVulner} endIcon={<AddCircleIcon />}>
            同步漏洞
          </Button>
        </div>
      </div>
    );
  }
}

function Buttons() {
  const [startValue, setStartValue] = React.useState<Dayjs | null>(null);
  const [endValue, setEndValue] = React.useState<Dayjs | null>(null);

  return(
    <div  id="dateButtons">
      <div>
        <ButtonGroup variant="outlined" aria-label="outlined button group" size='large'>
          <Button>近一月</Button>
          <Button>近三月</Button>
          <Button>近一年</Button>
        </ButtonGroup>
        <div style={{height: 20}}/>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Start Date"
            value={startValue}
            onChange={(newValue) => {
              setStartValue(newValue);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
        <div style={{height: 20}}/>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="End Date"
            value={endValue}
            onChange={(newValue) => {
              setEndValue(newValue);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
      </div>
    </div>
  );
}



const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));


interface StatisticsState {

}
interface StatisticsProps{
  // TotalCount: number,
  // List: any,
  tiers: any,
}

class Statistics extends React.Component<StatisticsState, StatisticsProps> {
  constructor(props) {
    super(props);
    this.state = {
      // TotalCount: -1,
      // List : Array,
      tiers: [],
    };
    this.getTotalCount = this.getTotalCount.bind(this);
  }

  async getTotalCount() {
    try {
      const responseTotalCount = await axios({
        url: '/api-db/vulnermg/get_vulnercount',
        method: 'get',
        params:{
          space: "AllProjects"
        },
      });
      const resultTotalCount = responseTotalCount.data;

      const responseAffect = await axios({
        url: '/api-db/vulnermg/get_vulneraffectNode',
        method: 'get',
        params:{
          space: "AllProjects"
        },
      });
      const resultAffect = responseAffect.data

      this.setState({
        // TotalCount: result,
        tiers:[
          {
            title: '漏洞数',
            num: resultTotalCount[0],
          },
          {
            title: '影响软件数',
            num: resultAffect[0],
          },
          {
            title: '影响器件数',
            num: resultAffect[1],
          },
          {
            title: '影响产品数',
            num: resultAffect[2],
          },
        ],
      });
    } catch (error) {
      console.log(error);
    }
  }

  async componentDidMount() {
    this.getTotalCount();
  }

  render() {
    return (
      <div id="grids">
        <Buttons />
        <Container maxWidth="md" component="main" className="stat">
          <Grid container spacing={5} alignItems="flex-end">
            {this.state.tiers.map((tier) => (
              <Grid
                item
                key={tier.title}
                xs={12}
                sm={6}
                md={3}
              >
                <Card>
                  <CardHeader
                    title={tier.title}
                    titleTypographyProps={{ align: 'center' }}
                    subheaderTypographyProps={{
                      align: 'center',
                    }}
                  />
                  <CardContent>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'baseline',
                        mb: 2,
                      }}
                    >
                      <Typography component="h2" variant="h3" color="text.primary">
                        {tier.num}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </div>
    );
  }
}

interface TrendState {
}
interface TrendProps{
  options:any,
}
class Trend extends React.Component<TrendState, TrendProps>{
  constructor(props) {
    super(props);
    this.state = {
      options : {
        grid: { top: 8, right: 8, bottom: 24, left: 36 },
        xAxis: {
          type: 'category',
          data: [],
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: [],
            type: 'line',
            smooth: true,
          },
        ],
        tooltip: {
          trigger: 'axis',
        },
      }
    };
    this.getTotalCount = this.getTotalCount.bind(this);
  }
  getTotalCount(){
    this.get_vulnerstatistic();
  }
  async get_vulnerstatistic (){
    const history_interval = 7;
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var today = year + "-" + month + "-" + day;
    var a = new Date(year, month, 0).getDate();
    var his_day = (day-history_interval)>0?(day-history_interval):day+(a-history_interval);
    var his_month = his_day<day?month:month-1;
    var his_year = his_month<=month?year:year-1;
    var history = his_year + "-" + his_month + "-" + his_day;
    console.log('获取日期！！！！！！！！！！！！！！！！！！！！漏洞影响的数量');
    try {
      const response = await axios({
        url: '/api-db/vulnermg/get_vulnerstatistic',
        method: 'get',
        params: {
          space: "Allprojects",
          date_begin: history,
          date_end: today,
        },
      });
      const date = Object.keys(response.data).sort();
      console.log(" history++++++++++++++++++++++"+ a);
      const value = date.map(d => response.data[d]);
      console.log(value);

      this.setState({
        options : {
          xAxis: {
            data: date,
          },
          series: [
            {
              data: value,
            },
          ],
        }
      });
      console.log('获取日期！！！！！！！！！！！！！！！！！！！！漏洞影响的数量！！！！！！！！！！成功了！！！！！！！！！！！！！！！！！！！！！！！！');
      console.log(response)
      console.log(this.state.options.xAxis.data)
    } catch (error) {
      console.log(error);
    }
  }
  async componentDidMount() {
    this.getTotalCount();
  }

  render() {
    return(
      <div id='chart'>
        <ReactECharts option={this.state.options} />
      </div>
    );
  }
}

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
function handleClick(num, pageNum, props) {
  return () => {
    if (num === 'first') {
      // 首页
      props.onPageChange(1);
    } else if (num === 'prev') {
      if (props.current !== 1) {
        props.onPageChange(props.current - 1);
      }
    } else if (num === 'next') {
      if (props.current !== pageNum) {
        props.onPageChange(props.current + 1);
      }
    } else if (num === 'end') {
      props.onPageChange(pageNum);
    } else {
      props.onPageChange(num);
    }
  };
}

function Pager(props) {
  const total = props.total[props.type];
  console.log('total: ' + total);
  console.log('size: ' + props.size);
  const pageNum = getPageNum(total, props.size);
  const minPanelNum = getMinPanelNum(props.current, props.panel);
  const maxPanelMum =
    minPanelNum + props.panel > pageNum ? pageNum : minPanelNum + props.panel;
  let numPageArr:Array<any> = [];
  for (let i = minPanelNum; i <= maxPanelMum; i++) {
    numPageArr.push(
      <span
        key={i}
        className={i === props.current ? 'item active' : 'item'}
        onClick={handleClick(i, pageNum, props)}
      >
        {i}
      </span>,
    );
  }

  return (
    <div className="tailrow">
      <span
        className={props.current === 1 ? 'item disabled' : 'item'}
        onClick={handleClick('first', pageNum, props)}
      >
        首页
      </span>
      <span
        className={props.current === 1 ? 'item disabled' : 'item'}
        onClick={handleClick('prev', pageNum, props)}
      >
        上一页
      </span>
      {/**数字页码 */}
      {numPageArr.map(item => {
        return item;
      })}
      <span
        className={props.current === pageNum ? 'item disabled' : 'item'}
        onClick={handleClick('next', pageNum, props)}
      >
        下一页
      </span>
      <span
        className={props.current === pageNum ? 'item disabled' : 'item'}
        onClick={handleClick('end', pageNum, props)}
      >
        尾页
      </span>
      <span style={{ color: 'black', fontSize: '15px' }}>
        {props.current} / {pageNum}
      </span>
    </div>
  );
}

const tableHead = {
  "vulner": ["published", "affect_Library", "affect_Package", "affect_File", "summary"],
  "product": ["lib_name", "include_Vulner"],
}

interface BasicTableState{
}
interface BasicTableProps{
  totalRows:any;
  current:number;
  type:string;
  size:number;
}
class BasicTable extends React.Component <BasicTableProps,BasicTableState> {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  sendPara = (id, type, space, cur) => {
    sessionStorage.id = id;
    sessionStorage.type = type;
    sessionStorage.space = space;
    sessionStorage.cur = cur;
  };
  render() {
    return (
      <TableContainer component={Paper}>
        <Table style={{ marginTop: '40px' }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Name</TableCell>
              {tableHead[this.props.type].map(head => (
                <TableCell align="center" id={head}>{head}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {this.props.totalRows[this.props.type].slice((this.props.current - 1) * this.props.size, this.props.current * this.props.size).map(row => (
              <TableRow key={row.id} id={row.id}>
                <TableCell component="th" scope="row" align="center" id="name">
                  <Link
                    to={{
                      pathname:'/graphInfo',
                    }}
                  >
                    <Button
                      // className="openinfo_button"
                      onClick={() => this.sendPara(row.id, this.props.type, "AllProjects", this.props.current)}
                    >
                      {row.id}
                    </Button>
                  </Link>
                </TableCell>
                {/* <TableCell align="center">{row["id"]}</TableCell> */}
                {tableHead[this.props.type].map(head => (
                  <TableCell align="center">{row[head]}</TableCell>
                ))}

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
}


interface DetailState{
  total: any,
  type: string,
  size: number,
  current: number,
  panel: number,
  rows: any,
  totalRows: any,
}
interface DetailProps{}


class Detail extends React.Component<DetailProps, DetailState>{
  constructor(props){
    super(props);
    this.onVulnerClick = this.onVulnerClick.bind(this)
    this.onProductClick = this.onProductClick.bind(this)
    this.ColorToggleButton = this.ColorToggleButton.bind(this)
    this.state = {
      total: {
        "vulner": 0,
        "product": 0,
      },
      type: "vulner",
      size: 10,
      current: 1,
      panel: 5,
      rows: [],
      totalRows: {
        "vulner": [],
        "product": [],
      },
    };
  }

  async get_View (){
    console.log('获取视图！！！！！！！！！！！！！！！！！！！！');
    console.log("Total rows: "+ this.state.totalRows);
    try {
      const responseV = await axios({
        url: '/api-db/view/get_View',
        method: 'get',
        params: {
          tagname: 'vulner',
          space: 'AllProjects',
        },
      });
      const responseP = await axios({
        url: '/api-db/view/get_View',
        method: 'get',
        params: {
          tagname: 'Library',
          space: 'AllProjects',
        },
      });
      this.setState({
        totalRows: {
          "vulner": responseV.data,
          "product": responseP.data,
        },
        total:
          {
            "vulner": responseV.data.length,
            "product": responseP.data.length,
          },
      });
      this.getRows();
      console.log("Library: "+ responseP.data);
    } catch (error) {
      console.log(error);
    }
  }

  getRows() {
    this.setState({
      rows: this.state.totalRows[this.state.type].slice((this.state.current - 1) * this.state.size, this.state.current * this.state.size),
    });
  }

  async componentDidMount() {
    this.get_View();
    const cur = parseInt(sessionStorage.getItem('cur'));
    const type = sessionStorage.getItem('type');
    if(cur != null && type != null){
      this.setState({
        type: type,
        current: cur,
      });
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
        this.getRows();
      },
    );
  };

  onVulnerClick = () => {
    console.log("选择查看漏洞");
    this.setState(
      {
        type: "vulner",
        current: 1,
      },
    );
    // this.getRows();
  };

  onProductClick = () => {
    console.log("选择查看软件");
    this.setState(
      {
        type: "product",
        current: 1,
      },
    );
    // this.getRows();
  };

  ColorToggleButton() {
    const [alignment, setAlignment] = React.useState('vulner');
    // setAlignment(this.state.type);
    const handleChange = (
      event: React.MouseEvent<HTMLElement>,
      newAlignment: string,
    ) => {
      setAlignment(newAlignment);
      const tempt = newAlignment;
      console.log('newAlignment的值为'+ tempt + '!!!!!!!!!!!!!!!!!!!!!!!!!!!');
      if(tempt === null){
        console.log('未改变类型');
        setAlignment(this.state.type);
      }else if(tempt === "vulner"){
        try {
          this.onVulnerClick();
        }finally {
        }
      }else{
        try {
          this.onProductClick();
        }finally {

        }
      }
    }
    return (
      <ToggleButtonGroup
        color="primary"
        value={this.state.type}
        exclusive
        onChange={handleChange}
        aria-label="Platform"
      >
        <ToggleButton value="vulner">Vulner</ToggleButton>
        <ToggleButton value="product">Library</ToggleButton>
      </ToggleButtonGroup>
    );
  }

  render(){
    return (
      // <div className='box' title='详情'>
      <div>
        <Box sx={{ flexGrow: 1, padding: 1}}>
          <div id='select'>
            <this.ColorToggleButton />
            {/*<div className='buttons'><AddVul /></div>*/}
            <Paper
              component="form"
              sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
              className='search'
            >
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search"
                inputProps={{ 'aria-label': 'search' }}
              />
              <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                <SearchIcon />
              </IconButton>
            </Paper>
          </div>
          <BasicTable {...this.state}/>
          <Pager {...this.state} onPageChange={this.onPageChange}/>
        </Box>
      </div>
    );
  }
}

const Overview = () => {
  return (
    <div id='background'>
      {/* <Buttons /> */}
      <Statistics />
      <Trend />
      <Detail />
    </div>
  );
};

export default Overview;
