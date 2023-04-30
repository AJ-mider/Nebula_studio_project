import { Button, List, Modal, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import intl from 'react-intl-universal';
import { observer } from 'mobx-react-lite';
import Icon from '@app/components/Icon';
import { useStore } from '@app/stores';

import styles from './index.module.less';


interface IProps {
  onGqlSelect: (gql: string) => void;
}
const FavoriteBtn = (props: IProps) => {
  const { onGqlSelect } = props;
  const { console: { favorites, updateFavorites } } = useStore();
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState([]);
  const [curAccount] = useState(sessionStorage.getItem('curAccount'));

  useEffect(() => {
    const curAccount = sessionStorage.getItem('curAccount');
    if (favorites[curAccount]) {
      setData(favorites[curAccount]);
    }
  }, [favorites]);


  const handleClear = () => {
    if(!data.length) {
      return; 
    }
    const _favorites = { ...favorites };
    _favorites[curAccount] = [];
    updateFavorites(_favorites);
    setVisible(false);
  };

  const handleSelect = (gql: string) => {
    onGqlSelect(gql);
    setVisible(false);
  };

  const renderStr = (str: string) => {
    if (str.length < 300) {
      return str;
    }
    return str.substring(0, 300) + '...';
  };

  return (
    <>
      <Tooltip title={intl.get('console.favorites')} placement="top">
        <Icon className={styles.btnOperations} type="icon-studio-btn-save" onClick={() => setVisible(true)} />
      </Tooltip>
      <Modal
        title={
          <>
            <span >
              {intl.get('console.favorites')}
            </span>
            <Button type="link" onClick={handleClear}>
              {intl.get('console.clearFavorites')}
            </Button>
          </>
        }
        visible={visible}
        className={styles.favoriteList}
        footer={null}
        onCancel={() => setVisible(false)}
      >
        <List
          itemLayout="horizontal"
          dataSource={data}
          renderItem={(item: string) => (
            <List.Item
              style={{ cursor: 'pointer', wordBreak: 'break-all' }}
              onClick={() => handleSelect(item)}
            >
              {renderStr(item)}
            </List.Item>
          )}
        />
      </Modal>
    </>
  );
};
export default observer(FavoriteBtn);
