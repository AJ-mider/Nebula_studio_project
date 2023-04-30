import { Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import intl from 'react-intl-universal';
import { LinkObject, NodeObject } from '@vesoft-inc/force-graph';
import ExpandItem from '../ExpandItem';
import styles from './index.module.less';
const TabPane = Tabs.TabPane;

interface IProps {
  data: {
    nodes: NodeObject[];
    links: LinkObject[];
  },
  spaceVidType: string;
}

const DisplayComponent = (props: IProps) => {
  const [tab, setTab] = useState<any>('nodes');
  const { data, spaceVidType } = props;
  
  const { nodes, links } = data;
  const [list, setList] = useState<{
    nodes: NodeObject[];
    links: LinkObject[];
  }>({
    nodes: [],
    links: []
  });
  useEffect(() => {
    setList({
      nodes: flattenVertex(nodes),
      links: flattenEdge(links)
    });
  }, [data]);

  const flattenVertex = (data) => {
    return data.map(item => {
      const _data = [
        {
          key: 'Tag',
          value: item.tags,
        },
        {
          key: 'VID',
          value: item.id,
          vidType: spaceVidType,
        },
      ] as any;
      const properties = item.properties;
      Object.keys(properties).forEach(property => {
        const valueObj = properties[property];
        Object.keys(valueObj).forEach(field => {
          _data.push({
            key: `${property}.${field}`,
            value: valueObj[field],
          });
        });
      });
      return _data;
    });
  };

  const flattenEdge = data => {
    return data.map(item => {
      const _data = [
        {
          key: 'id',
          value: item.id,
        },
      ];
      const name = item.edgeType;
      const properties = item.properties;
      Object.keys(properties).forEach(property => {
        const value = properties[property];
        _data.push({
          key: `${name}.${property}`,
          value,
        });
      });
      return _data;
    });
  };
  return (
    <div className={styles.displayExpand}>
      <Tabs className={styles.headerTab} onChange={setTab} defaultActiveKey={tab}>
        <TabPane
          tab={intl.get('import.vertexText') + `(${nodes.length})`}
          key="nodes"
        />
        <TabPane
          tab={intl.get('import.edgeText') + `(${links.length})`}
          key="links"
        />
      </Tabs>
      <div className={styles.content}>
        {list[tab].length > 0 && list[tab].map((item: NodeObject | LinkObject, index) => (
          <ExpandItem
            key={index}
            data={item}
            title={`${tab} ${index + 1}`}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default DisplayComponent;
