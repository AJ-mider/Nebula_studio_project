import { Button, Col, Form, Input, Row, Select, message } from 'antd';
import React, { useEffect, useState } from 'react';
import Breadcrumb from '@app/components/Breadcrumb';
import { observer } from 'mobx-react-lite';
import { useStore } from '@app/stores';
import { trackPageView } from '@app/utils/stat';
import intl from 'react-intl-universal';
import cls from 'classnames';
import { useHistory } from 'react-router-dom';
import { POSITIVE_INTEGER_REGEX } from '@app/utils/constant';
import styles from './index.module.less';
import PasswordInputModal from './PasswordInputModal';
import SchemaConfig from './SchemaConfig';
import FileSelect from './FileSelect';
const Option = Select.Option;
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 11,
  },
};

interface IProps {
  needPwdConfirm?: boolean;
}
const TaskCreate = (props: IProps) => {
  const { dataImport, schema, files } = useStore();
  const { basicConfig, verticesConfig, edgesConfig, updateBasicConfig, importTask } = dataImport;
  const { spaces, getSpaces, updateSpaceInfo, currentSpace } = schema;
  const { getFiles } = files;
  const { batchSize } = basicConfig;
  const [modalVisible, setVisible] = useState(false);
  const history = useHistory();
  const { needPwdConfirm = true } = props;
  const [loading, setLoading] = useState(false);
  const routes = [
    {
      path: '/import/tasks',
      breadcrumbName: intl.get('import.taskList'),
    },
    {
      path: '#',
      breadcrumbName: intl.get('import.createTask'),
    },
  ];

  const checkConfig = () => {
    try {
      check();
      needPwdConfirm ? setVisible(true) : handleStartImport();
    } catch (err) {
      console.log('err', err);
    }
  };
  const handleStartImport = async (password?: string) => {
    setVisible(false);
    setLoading(true);
    const code = await importTask({
      name: basicConfig.taskName, 
      password
    });
    setLoading(false);
    if(code === 0) {
      message.success(intl.get('import.startImporting'));
      history.push('/import/tasks');
    }
  };


  const check = () => {
    verticesConfig.forEach(config => {
      if(config.idMapping === null) {
        message.error(`vertexId ${intl.get('import.indexNotEmpty')}`);
        throw new Error();
      }
      if(config.tags.length === 0) {
        message.error(`Tag Mapping ${intl.get('import.isEmpty')}`);
        throw new Error();
      }
      config.tags.forEach(tag => {
        if (!tag.name) {
          message.error(`Tag ${intl.get('import.isEmpty')}`);
          throw new Error();
        }
        tag.props.forEach(prop => {
          if (prop.mapping === null && !prop.isDefault) {
            message.error(`${prop.name} ${intl.get('import.indexNotEmpty')}`);
            throw new Error();
          }
        });
      });
    });
    edgesConfig.forEach(edge => {
      if (!edge.type) {
        message.error(`edgeType ${intl.get('import.isEmpty')}`);
        throw new Error();
      }
      edge.props.forEach(prop => {
        if (prop.mapping === null && prop.name !== 'rank' && !prop.isDefault) {
          message.error(`${prop.name} ${intl.get('import.indexNotEmpty')}`);
          throw new Error();
        }
      });
    });
    if(batchSize && !batchSize.match(POSITIVE_INTEGER_REGEX)) {
      message.error(`${intl.get('import.batchSize')} ${intl.get('formRules.numberRequired')}`);
      throw new Error();
    }
  };

  const clearConfig = (type?: string) => {
    const params = {
      verticesConfig: [],
      edgesConfig: []
    } as any;
    if(type === 'all') {
      params.basicConfig = { taskName: '' };
    }
    dataImport.update(params);
  };
  const handleSpaceChange = (space: string) => {
    clearConfig();
    updateSpaceInfo(space);
  };

  const initTaskDir = async () => {
    updateBasicConfig('taskName', `task-${Date.now()}`);
  };
  useEffect(() => {
    initTaskDir();
    getSpaces();
    getFiles();
    if(currentSpace) {
      updateSpaceInfo(currentSpace);
    }
    trackPageView('/import/create');
    return () => clearConfig('all');
  }, []);
  return (
    <div className={styles.importCreate}>
      <Breadcrumb routes={routes} />
      <div className={cls(styles.createForm, 'studioCenterLayout')}>
        <Form className={styles.basicConfig} layout="vertical" {...formItemLayout}>
          <Row>
            <Col span={12}>
              <Form.Item label={intl.get('common.space')} required={true}>
                <Select value={currentSpace || null} placeholder={intl.get('console.selectSpace')} onChange={value => handleSpaceChange(value)}>
                  {spaces.map(space => (
                    <Option value={space} key={space}>
                      {space}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={intl.get('import.taskName')} required={true}>
                <Input value={basicConfig.taskName} onChange={e => updateBasicConfig('taskName', e.target.value)} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label={intl.get('import.batchSize')} name="batchSize" rules={[{
                pattern: POSITIVE_INTEGER_REGEX,
                message: intl.get('formRules.numberRequired'),
              }]}>
                <Input placeholder="60" value={basicConfig.batchSize} onChange={e => updateBasicConfig('batchSize', e.target.value)} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <div className={styles.mapConfig}>
          <Form className={styles.configColumn} layout="vertical">
            <Form.Item label={intl.get('import.vertices')} required={true}>
              <div className={styles.container}>
                <FileSelect type="vertices" />
                {verticesConfig.map((item, index) => <SchemaConfig type="vertices" key={item.name} data={item} configIndex={index} />)}
              </div>
            </Form.Item>
          </Form>
          <Form className={styles.configColumn} layout="vertical">
            <Form.Item label={intl.get('import.edge')} required={true}>
              <div className={styles.container}>
                <FileSelect type="edge" />
                {edgesConfig.map((item, index) => <SchemaConfig type="edge" key={item.name} data={item} configIndex={index} />)}
              </div>
            </Form.Item>
          </Form>
        </div>
      </div>
      <div className="studioFormFooter">
        <Button onClick={() => history.push('/import/tasks')}>{intl.get('common.cancel')}</Button>
        <Button type="primary" disabled={
          basicConfig.taskName === ''
          || (!verticesConfig.length && !edgesConfig.length)
        } onClick={checkConfig} loading={!needPwdConfirm && loading}>{intl.get('import.runImport')}</Button>
      </div>
      {needPwdConfirm && <PasswordInputModal 
        visible={modalVisible} 
        onConfirm={handleStartImport} 
        onCancel={() => setVisible(false)}
      />}
    </div>
  );
};

export default observer(TaskCreate);
