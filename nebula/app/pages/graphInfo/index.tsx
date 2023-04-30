import React from "react";
import "./index.css";
import { useStore } from '@app/stores';
// import ExportModal from '../console/ExportModal';
import OutputBox_diy from '../graphInfo/OutputBox_DIY';
import { useEffect, useState } from 'react';
import intl from 'react-intl-universal';
import { message } from 'antd';
import styles from '../console/index.module.less';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import { Link } from 'react-router-dom';

// const Option = Select.Option;

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


const SEMICOLON_REG = /((?:[^;'"]*(?:"(?:\\.|[^"])*"|'(?:\\.|[^'])*')[^;'"]*)+)|;/;
// const tableHead = {
//   "vulner": ["affect_product", "affect_board", "affect_component"],
//   "product": ["product_version", "product_life"],
// };

interface IProps {
  onExplorer?: (params: {
    space: string;
    vertexes: any[],
    edges: any[]
  }) => void,
  templateRender?: (data?) => JSX.Element
}

const graphInfo = (props: IProps) => {
  const { schema, console } = useStore();
  const { onExplorer, templateRender } = props;
  const { getSpaces, switchSpace, currentSpace, spaceVidType, updateVidType } = schema;
  const { runGQL, results, getParams, update } = console;
  const [isUpDown, setUpDown] = useState(false);
  const id = sessionStorage.getItem('id');
  const space = sessionStorage.getItem('space');
  const type = sessionStorage.getItem('type');
  const cur = sessionStorage.getItem('cur');

  useEffect(() => {
    getSpaces(space);
    getParams();
    handleSpaceSwitch(space);
    handleRun();
    if(!spaceVidType && currentSpace) {
      updateVidType();
    }
  }, []);
  const handleSpaceSwitch = (space: string) => {
    switchSpace(space);
    update({
      results: []
    });
  };

  const checkSwitchSpaceGql = (query: string) => {
    const queryList = query.split(SEMICOLON_REG).filter(Boolean);
    const reg = /^USE `?.+`?(?=[\s*;?]?)/gim;
    if (queryList.some(sentence => sentence.trim().match(reg))) {
      return intl.get('common.disablesUseToSwitchSpace');
    }
  };


  const handleRun = async () => {
    const query = (type == "vulner") ?
      "GET SUBGRAPH FROM \"" + id + "\" both affected, Relationship YIELD VERTICES AS nodes, EDGES AS relationships" :
      "GO FROM \"" + id + "\" OVER affected BIDIRECT YIELD src(EDGE) AS id | GET SUBGRAPH FROM $-.id both affected, Relationship YIELD VERTICES AS nodes, EDGES AS relationships";



    if (!query) {
      message.error(intl.get('common.sorryNGQLCannotBeEmpty'));
      return;
    }
    const errInfo = checkSwitchSpaceGql(query);
    if (errInfo) {
      return message.error(errInfo);
    }
    await runGQL(query);
    setUpDown(true);
  };

  const handleReturn = (type, cur) => {
    sessionStorage.type = type;
    sessionStorage.cur = cur;
  };

  return (
    <div className={styles.nebulaConsole}>
      <Link to={{pathname:'/overview',}} >
        <KeyboardReturnIcon className="return" onClick={() => handleReturn(type, cur)}/>
      </Link>
      <div className="studioCenterLayout">
        <div className='BasicTable'>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Type</TableCell>
                  <TableCell align="center">Name</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell align="center" component="th" scope="row">
                    {type}
                  </TableCell>
                  <TableCell align="center">{id}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <div className="result-wrap">
          {results.length > 0 ? results.map((item, index) => (
            <OutputBox_diy
              key={item.id}
              index={index}
              result={item}
              gql={item.gql}
              templateRender={templateRender}
            />
          )) : <OutputBox_diy
            key="empty"
            index={0}
            result={{ code: 0, data: { headers: [], tables: [] } }}
            gql={''}
          />}
        </div>
      </div>
    </div>
  );
};

export default graphInfo;
