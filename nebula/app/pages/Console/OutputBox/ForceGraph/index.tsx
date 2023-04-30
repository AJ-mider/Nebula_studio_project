import { observer } from 'mobx-react-lite';
import { Spin } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { parseSubGraph } from '@app/utils/parseData';
import { v4 as uuidv4 } from 'uuid';
import { useStore } from '@app/stores';
import { GraphStore } from '@app/stores/graph';
import { initTooltip } from './Tootip';
import DisplayPanel from './DisplayPanel';
import OperationPanel from './OperationPanel';
import Menu from './Menu';
import { initBrushSelect } from './BrushSelect';
import styles from './index.module.less';

interface IProps {
  data: any;
  spaceVidType: string;
  onGraphInit: (graph: GraphStore) => void;
}
const ForceGraphBox = (props: IProps) => {
  const [uuid ] = useState(uuidv4());
  const { graphInstances: { graphs, initGraph, clearGraph } } = useStore();
  const grapfDomRef = useRef<any>();
  const { data, spaceVidType, onGraphInit } = props;
  const [loading, setLoading] = useState(false);
  const init = async () => {
    const { vertexes, edges } = parseSubGraph(data, spaceVidType);
    setLoading(true);
    await initGraph({
      container: grapfDomRef.current,
      id: uuid,
      data: { vertexes, edges }
    });
    onGraphInit(graphs[uuid]);
    initTooltip({ container: grapfDomRef.current, id: uuid });
    initBrushSelect({ container: grapfDomRef.current, id: uuid });
    setLoading(false);
  };

  useEffect(() => {
    init();
    return () => {
      clearGraph(uuid);
    };
  }, []);

  const currentGraph = graphs[uuid];
  const { nodes, links, nodesSelected, linksSelected } = currentGraph || {};
  const selected = nodesSelected && (nodesSelected.size > 0 || linksSelected.size > 0);
  return (
    <div className="explore-main-canvas">
      {loading && <Spin className={styles.graphLoading} />}
      <div id={uuid} className={styles.forceGraph} ref={grapfDomRef} />
      {currentGraph && <>
        <OperationPanel graph={currentGraph} />
        <Menu id={uuid} />
        <DisplayPanel
          data={
            selected ? {
              nodes: [...nodesSelected],
              links: [...linksSelected]
            } : {
              nodes: [...nodes || []],
              links: [...links || []]
            }} 
          spaceVidType={spaceVidType} />
      </>}
    </div>
  );
};

export default observer(ForceGraphBox);
