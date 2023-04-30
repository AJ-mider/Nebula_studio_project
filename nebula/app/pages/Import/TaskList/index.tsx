import { Button, message, Spin } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import intl from 'react-intl-universal';
import { observer } from 'mobx-react-lite';
import Icon from '@app/components/Icon';
import { useStore } from '@app/stores';
import { trackPageView } from '@app/utils/stat';
import { ITaskStatus } from '@app/interfaces/import';
import LogModal from './TaskItem/LogModal';
import TemplateModal from './TemplateModal';

import styles from './index.module.less';
import TaskItem from './TaskItem';

let isMounted = true;

interface ILogDimension {
  space: string;
  id: number;
  status: ITaskStatus;
}

interface IProps {
  showTemplateModal?: boolean;
  showConfigDownload?: boolean;
  showLogDownload?: boolean;
}

const TaskList = (props: IProps) => {
  const timer = useRef<any>(null);
  const { dataImport, global } = useStore();
  const history = useHistory();
  const { taskList, getTaskList, stopTask, deleteTask, downloadTaskConfig } = dataImport;
  const { username, host } = global;
  const [modalVisible, setVisible] = useState(false);
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showTemplateModal = true, showConfigDownload = true, showLogDownload = true } = props;
  const [logDimension, setLogDimension] = useState<ILogDimension>({} as ILogDimension);
  const handleTaskStop = useCallback(async (id: number) => {
    clearTimeout(timer.current);
    const { code } = await stopTask(id);
    if(code === 0) {
      message.success(intl.get('import.stopImportingSuccess'));
      getTaskList();
    }
  }, []);
  const handleTaskDelete = useCallback(async (id: number) => {
    clearTimeout(timer.current);
    const { code } = await deleteTask(id);
    if(code === 0) {
      message.success(intl.get('import.deleteSuccess'));
      getTaskList();
    }
  }, []);

  const handleLogView = (id: number, space: string, status: ITaskStatus) => {
    setLogDimension({
      space, 
      id,
      status
    });
    setVisible(true);
  };
  const initList = async () => {
    setLoading(true);
    await getTaskList();
    setLoading(false);
  };
  useEffect(() => {
    isMounted = true;
    initList();
    trackPageView('/import/tasks');
    return () => {
      isMounted = false;
      clearTimeout(timer.current);
    };
  }, []);
  useEffect(() => {
    const loadingStatus = [ITaskStatus.StatusProcessing, ITaskStatus.StatusPending];
    const needRefresh = taskList.filter(item => loadingStatus.includes(item.status)).length > 0;
    if(logDimension.id !== undefined && loadingStatus.includes(logDimension.status)) {
      const status = taskList.filter(item => item.id === logDimension.id)[0].status;
      if(!loadingStatus.includes(status)) {
        setLogDimension({
          id: logDimension.id,
          space: logDimension.space,
          status
        });
      }
    }
    if(needRefresh && isMounted) {
      clearTimeout(timer.current);
      timer.current = setTimeout(getTaskList, 1000);
    } else {
      clearTimeout(timer.current);
    }
  }, [taskList]);

  useEffect(() => {
    if(modalVisible === false) {
      setLogDimension({} as ILogDimension);
    }
  }, [modalVisible]);
  return (
    <div className={styles.nebulaDataImport}>
      <div className={styles.taskBtns}>
        <Button
          className="studioAddBtn"
          type="primary"
          onClick={() => history.push('/import/create')}
        >
          <Icon className="studioAddBtnIcon" type="icon-studio-btn-add" />{intl.get('import.createTask')}
        </Button>
        {showTemplateModal && <Button type="default" onClick={() => setImportModalVisible(true)}>
          {intl.get('import.uploadTemp')}
        </Button>}
      </div>
      <h3 className={styles.taskHeader}>{intl.get('import.taskList')} ({taskList.length})</h3>
      <Spin spinning={loading}>
        {taskList.map(item => (
          <TaskItem key={item.id} 
            data={item}
            onViewLog={handleLogView} 
            onTaskStop={handleTaskStop} 
            onTaskDelete={handleTaskDelete} 
            onConfigDownload={downloadTaskConfig} 
            showConfigDownload={showConfigDownload}
          />
        ))}
      </Spin>
      {modalVisible && <LogModal
        showLogDownload={showLogDownload}
        logDimension={logDimension}
        onCancel={() => setVisible(false)}
        visible={modalVisible} />}
      {importModalVisible && <TemplateModal
        onClose={() => setImportModalVisible(false)}
        username={username}
        host={host}
        onImport={getTaskList}
        visible={importModalVisible} />}
    </div>
  );
};

export default observer(TaskList);
