import { createModel } from '@rematch/core';
import { message } from 'antd';
import cookies from 'js-cookie';
import _ from 'lodash';
import intl from 'react-intl-universal';

import service from '#assets/config/service';
import { handleKeyword } from '#assets/utils/function';
import {
  getAlterGQL,
  getIndexCreateGQL,
  getSpaceCreateGQL,
  getTagOrEdgeCreateGQL,
} from '#assets/utils/gql';

interface IState {
  spaces: string[];
  currentSpace: string;
  spaceVidType: string;
  edgeTypes: string[];
  host: string;
  username: string;
  password: string;
  tagsFields: any[];
  edgesFields: any[];
  indexes: any[];
  tagIndexTree: ITree[];
  edgeIndexTree: ITree[];
  spaceList: ISpace[];
  activeMachineNum: number;
  // tag
  tagList: ITag[];
  // edge
  edgeList: IEdge[];
  // index
  indexList: IIndexList[];
}

interface IIndex {
  indexName: string;
  props: IField[];
}
interface ITree {
  name: string;
  indexes: IIndex[];
}

interface IField {
  Field: string;
  Type: string;
}

interface ISpace {
  serialNumber: number;
  Name: string;
  ID: number;
  Charset: string;
  Collate: string;
  'Partition Number': string;
  'Replica Factor': string;
}

interface ITag {
  name: string;
  fields: IField[];
}
interface IEdge {
  name: string;
  fields: IField[];
}
interface IIndexList {
  name: string;
  owner: string;
  comment?: string;
  fields: IField[];
}

interface IProperty {
  name: string;
  type: string;
  value?: string;
  allowNull?: boolean;
  fixedLength?: string;
}

type IndexType = 'TAG' | 'EDGE';
type AlterType = 'ADD' | 'DROP' | 'CHANGE' | 'TTL' | 'COMMENT';
interface IAlterConfig {
  fields?: IProperty[];
  comment?: string;
  ttl?: {
    col?: string;
    duration?: string;
  };
}

export const nebula = createModel({
  state: {
    username: cookies.get('nu'),
    host: cookies.get('nh'),
    password: cookies.get('np'),
    spaces: [],
    currentSpace: '',
    spaceVidType: '',
    edgeTypes: [],
    tags: [],
    tagsFields: [],
    edgesFields: [],
    indexes: [],
    tagIndexTree: [] as ITree[],
    edgeIndexTree: [] as ITree[],
    spaceList: [] as ISpace[],
    activeMachineNum: 1,
    // tag
    tagList: [],
    // edge
    edgeList: [],
    // index
    indexList: [],
  },
  reducers: {
    update: (state: IState, payload: any) => {
      return {
        ...state,
        ...payload,
      };
    },

    addEdgesName: (state: IState, payload: any) => {
      const { edgesFields } = state;
      const { edgeType, edgeFields } = payload;
      const index = _.findIndex(edgesFields, edgeType);
      if (index === -1) {
        edgesFields.push({
          [edgeType]: edgeFields,
        });
      } else {
        edgesFields[index] = {
          [edgeType]: edgeFields,
        };
      }
      return {
        ...state,
        edgesFields,
      };
    },

    addTagsName: (state: IState, payload: any) => {
      const { tagsFields } = state;
      const { tag, tagFields } = payload;
      const index = _.findIndex(tagsFields, tag);
      if (index === -1) {
        tagsFields.push({
          [tag]: tagFields,
        });
      } else {
        tagsFields[index] = {
          [tag]: tagFields,
        };
      }
      return {
        ...state,
        tagsFields,
      };
    },
  },
  // TODO dispatch type interface
  effects: (dispatch: any) => ({
    async asyncConfigServer(payload: {
      host: string;
      username: string;
      password: string;
    }) {
      const { host, username, password } = payload;
      if (host.startsWith('http://')) {
        payload.host = host.substr(7);
      }
      if (host.startsWith('https://')) {
        payload.host = host.substr(8);
      }
      const [address, _port] = host.split(':');
      const port = Number(_port);
      const { code, message: errorMessage } = (await service.connectDB(
        {
          address,
          port,
          username,
          password,
        },
        {
          trackEventConfig: {
            category: 'user',
            action: 'sign_in',
          },
        },
      )) as any;
      if (code === 0) {
        message.success(intl.get('configServer.success'));
        cookies.set('nh', host);
        cookies.set('nu', username);
        cookies.set('np', password);
        this.update({
          host,
          username,
          password,
        });
        return true;
      } else {
        message.error(`${intl.get('configServer.fail')}: ${errorMessage}`);
        this.update({
          host: '',
          username: '',
          password: '',
        });
        cookies.remove('nh');
        cookies.remove('nu');
        cookies.remove('np');
        return false;
      }
    },
    async asyncClearConfigServer() {
      await service.disconnectDB(
        {},
        {
          trackEventConfig: {
            category: 'user',
            action: 'sign_out',
          },
        },
      );
      this.update({
        host: '',
        username: '',
        password: '',
        spaces: [],
        currentSpace: '',
      });
      cookies.remove('nh');
      cookies.remove('nu');
      cookies.remove('np');
      sessionStorage.removeItem('currentSpace');
      dispatch({ type: 'RESET_APP' });
    },
    // spaces
    async asyncGetSpaces() {
      const { code, data } = (await service.execNGQL({
        gql: 'show spaces;',
      })) as any;
      if (code === 0) {
        const spaces = data.tables.map(item => item.Name).sort();
        this.update({
          spaces,
        });
        return { code, data: spaces };
      } else {
        return { code, data };
      }
    },
    async asyncGetSpaceInfo(space: string) {
      const { code, data } = (await service.execNGQL({
        gql: `DESCRIBE SPACE ${handleKeyword(space)}`,
      })) as any;
      return { code, data };
    },

    async asyncGetSpacesList(_payload) {
      const res = await dispatch.nebula.asyncGetSpaces();
      if (res.data) {
        const spaces: ISpace[] = [];
        await Promise.all(
          res.data.map(async (item, i) => {
            const { code, data } = await dispatch.nebula.asyncGetSpaceInfo(
              item,
            );
            if (code === 0) {
              const space = (data.tables && data.tables[0]) || {};
              space.serialNumber = i + 1;
              spaces.push(space);
            }
          }),
        );
        this.update({
          spaceList: spaces.sort((a, b) => a.serialNumber - b.serialNumber),
        });
      }
    },

    async asyncDeleteSpace(space: string) {
      const { code, data } = (await service.execNGQL(
        {
          gql: `DROP SPACE ${handleKeyword(space)}`,
        },
        {
          trackEventConfig: {
            category: 'schema',
            action: 'delete_space',
          },
        },
      )) as any;
      return { code, data };
    },

    async asyncCreateSpace(payload: {
      name: string;
      options: any;
      comment?: string;
    }) {
      const gql = getSpaceCreateGQL(payload);
      const { code, data, message } = (await service.execNGQL(
        {
          gql,
        },
        {
          trackEventConfig: {
            category: 'schema',
            action: 'create_space',
          },
        },
      )) as any;
      return { code, data, message };
    },

    async asyncSwitchSpace(space: string) {
      const { code } = (await service.execNGQL({
        // HACK: Processing keyword
        gql: 'use' + '`' + space + '`;',
      })) as any;

      if (code === 0) {
        const { data } = await dispatch.nebula.asyncGetSpaceInfo(space);
        let spaceVidType = 'FIXED_STRING(8)';
        if (data && data.tables && data.tables[0]) {
          spaceVidType = data.tables[0]['Vid Type'];
        }
        this.update({
          currentSpace: space,
          spaceVidType,
        });
        sessionStorage.setItem('currentSpace', space);
      }
    },

    // tags
    async asyncGetTags() {
      const { code, data } = (await service.execNGQL({
        gql: `
          SHOW TAGS;
        `,
      })) as any;

      if (code === 0) {
        const tags = data.tables.map(item => item.Name);
        this.update({
          tags,
        });
        return { code, data: data.tables };
      } else {
        return { code, data };
      }
    },

    async asyncGetTagInfo(tag: string) {
      const { code, data } = (await service.execNGQL({
        gql: 'desc tag ' + '`' + tag + '`;',
      })) as any;
      return { code, data };
    },

    async asyncGetTagsFields(payload: { tags: any[] }) {
      const { tags } = payload;
      await Promise.all(
        tags.map(async item => {
          const { code, data } = await dispatch.nebula.asyncGetTagInfo(item);
          if (code === 0) {
            const tagFields = data.tables.map(item => item.Field);
            this.addTagsName({ tag: item, tagFields });
          }
        }),
      );
    },

    async asyncGetTagList() {
      const res = await dispatch.nebula.asyncGetTags();
      if (res.code === 0) {
        const tagList: ITag[] = [];
        await Promise.all(
          res.data.map(async item => {
            const tag: ITag = {
              name: item.Name,
              fields: [],
            };
            const { code, data } = await dispatch.nebula.asyncGetTagInfo(
              item.Name,
            );
            if (code === 0) {
              tag.fields = data.tables;
            }
            tagList.push(tag);
          }),
        );
        this.update({ tagList });
      }
    },

    async asyncDeleteTag(name: string) {
      const { code, data, message } = (await service.execNGQL(
        {
          gql: `
          DROP TAG ${handleKeyword(name)}
        `,
        },
        {
          trackEventConfig: {
            category: 'schema',
            action: 'delete_tag',
          },
        },
      )) as any;
      return { code, data, message };
    },

    async asyncCreateTag(payload: {
      name: string;
      comment?: string;
      fields?: IProperty[];
      ttlConfig?: {
        ttl_col: string;
        ttl_duration: number;
      };
    }) {
      const gql = await getTagOrEdgeCreateGQL({ ...payload, type: 'TAG' });
      const { code, data, message } = (await service.execNGQL(
        {
          gql,
        },
        {
          trackEventConfig: {
            category: 'schema',
            action: 'create_tag',
          },
        },
      )) as any;
      return { code, data, message };
    },

    async asyncGetTagDetail(name: string) {
      const gql = `SHOW CREATE TAG ${handleKeyword(name)}`;
      const { code, data, message } = (await service.execNGQL({
        gql,
      })) as any;
      return { code, data, message };
    },

    async asyncAlterField(payload: {
      type: IndexType;
      name: string;
      action: AlterType;
      config: IAlterConfig;
    }) {
      const gql = getAlterGQL(payload);
      const { code, data, message } = (await service.execNGQL(
        {
          gql,
        },
        {
          trackEventConfig: {
            category: 'schema',
            action: `{payload.action === 'DROP' ? 'delete' : 'update'}_${payload.type.toLowerCase()}_property`,
          },
        },
      )) as any;
      return { code, data, message };
    },
    // edges
    async asyncGetEdges() {
      const { code, data } = (await service.execNGQL({
        gql: `
          show edges;
        `,
      })) as any;
      if (code === 0) {
        const edgeTypes = data.tables.map(item => item.Name);
        this.update({
          edgeTypes,
        });
        return { code, data: data.tables };
      } else {
        return { code, data };
      }
    },

    async asyncGetEdgeInfo(edge: string) {
      const { code, data } = (await service.execNGQL({
        gql: 'desc edge' + '`' + edge + '`;',
      })) as any;
      return { code, data };
    },

    async asyncGetEdgeTypesFields(payload: { edgeTypes: any[] }) {
      const { edgeTypes } = payload;
      await Promise.all(
        edgeTypes.map(async item => {
          const { code, data } = await dispatch.nebula.asyncGetEdgeInfo(
            item.Name,
          );
          if (code === 0) {
            const edgeFields = data.tables.map(item => item.Field);
            this.addEdgesName({
              edgeType: item.Name,
              edgeFields: ['type', '_rank', ...edgeFields],
            });
          }
        }),
      );
    },

    async asyncGetEdgesAndFields() {
      const res = await dispatch.nebula.asyncGetEdges();
      if (res.data) {
        this.asyncGetEdgeTypesFields({ edgeTypes: res.data });
      }
    },

    async asyncGetEdgeList() {
      const res = await dispatch.nebula.asyncGetEdges();
      if (res.code === 0) {
        const edgeList: IEdge[] = [];
        await Promise.all(
          res.data.map(async item => {
            const edge: IEdge = {
              name: item.Name,
              fields: [],
            };
            const { code, data } = await dispatch.nebula.asyncGetEdgeInfo(
              item.Name,
            );
            if (code === 0) {
              edge.fields = data.tables;
            }
            edgeList.push(edge);
          }),
        );
        this.update({ edgeList });
      }
    },

    async asyncDeleteEdge(name: string) {
      const { code, data, message } = (await service.execNGQL(
        {
          gql: `
          DROP EDGE ${handleKeyword(name)}
        `,
        },
        {
          trackEventConfig: {
            category: 'schema',
            action: 'delete_edge',
          },
        },
      )) as any;
      return { code, data, message };
    },

    async asyncCreateEdge(payload: {
      name: string;
      comment?: string;
      fields?: IProperty[];
      ttlConfig?: {
        ttl_col: string;
        ttl_duration: number;
      };
    }) {
      const gql = await getTagOrEdgeCreateGQL({ ...payload, type: 'EDGE' });
      const { code, data, message } = (await service.execNGQL(
        {
          gql,
        },
        {
          trackEventConfig: {
            category: 'schema',
            action: 'create_edge',
          },
        },
      )) as any;
      return { code, data, message };
    },

    async asyncGetEdgeDetail(name: string) {
      const gql = `SHOW CREATE EDGE ${handleKeyword(name)}`;
      const { code, data, message } = (await service.execNGQL({
        gql,
      })) as any;
      return { code, data, message };
    },

    // indexes
    async asyncGetIndexes(type: IndexType) {
      const { code, data } = (await service.execNGQL({
        gql: `
          SHOW ${type} INDEXES
        `,
      })) as any;
      if (code === 0) {
        const indexes = data.tables.map(item => {
          return {
            name: item['Index Name'],
            owner: item['By Tag'],
          };
        });
        this.update({
          indexes,
        });
        return { code, data: indexes };
      }
      return { code, data };
    },

    async asyncGetIndexComment(payload: { type: IndexType; name: string }) {
      const { type, name } = payload;
      const { code, data } = (await service.execNGQL({
        gql: `
          SHOW CREATE ${type} index ${handleKeyword(name)}
        `,
      })) as any;
      if (code === 0) {
        const _type = type === 'TAG' ? 'Tag' : 'Edge';
        const res =
          (data.tables && data.tables[0][`Create ${_type} Index`]) || '';
        const reg = /comment = "(.+)"/g;
        const result = reg.exec(res);
        const comment = result ? result[1] : null;
        return comment;
      } else {
        return null;
      }
    },

    async asyncGetIndexFields(payload: { type: IndexType; name: string }) {
      const { type, name } = payload;
      const { code, data } = (await service.execNGQL({
        gql: `
          DESCRIBE ${type} INDEX ${handleKeyword(name)}
        `,
      })) as any;
      return { code, data };
    },

    async asyncGetIndexTree(type: IndexType) {
      const { code, data } = await dispatch.nebula.asyncGetIndexes(type);
      if (code === 0) {
        const _indexes = await Promise.all(
          data.map(async (item: any) => {
            const { code, data } = await dispatch.nebula.asyncGetIndexFields({
              type,
              name: item.name,
            });
            return {
              indexName: item.name,
              indexOwner: item.owner,
              props: code === 0 ? data.tables : [],
            };
          }),
        );
        const tree = [] as ITree[];
        await Promise.all(
          _indexes.map(async (item: any) => {
            const tag = tree.filter(i => i.name === item.indexOwner);
            if (tag.length > 0) {
              tag[0].indexes.push(item);
            } else {
              tree.push({
                name: item.indexOwner,
                indexes: [item],
              });
            }
            return tree;
          }),
        );
        // Explain: tags/edges format:
        /* [{  name: 'xxx',
             indexes: [{
               indexName: 'xxx',
               props: [{
                 Field: 'name',
                 Type: 'string'
               }]
             }]
          }] */
        const key = type === 'TAG' ? 'tagIndexTree' : 'edgeIndexTree';
        this.update({
          [key]: tree,
        });
        return tree;
      }
    },

    async asyncGetIndexList(type: IndexType) {
      const res = await dispatch.nebula.asyncGetIndexes(type);
      if (res.code === 0) {
        const indexList: IIndexList[] = [];
        await Promise.all(
          res.data.map(async item => {
            const comment = await dispatch.nebula.asyncGetIndexComment({
              type,
              name: item.name,
            });
            const index: IIndexList = {
              owner: item.owner,
              comment,
              name: item.name,
              fields: [],
            };

            const { code, data } = await dispatch.nebula.asyncGetIndexFields({
              type,
              name: item.name,
            });
            if (code === 0) {
              index.fields = data.tables;
            }
            indexList.push(index);
          }),
        );
        this.update({ indexList });
      }
    },

    async asyncDeleteIndex(payload: { type: IndexType; name: string }) {
      const { type, name } = payload;
      const { code, data } = (await service.execNGQL(
        {
          gql: `
          DROP ${type} INDEX ${handleKeyword(name)}
        `,
        },
        {
          trackEventConfig: {
            category: 'schema',
            action: 'delete_index',
          },
        },
      )) as any;
      return { code, data };
    },

    async asyncGetMachineNumber() {
      const { code, data } = (await service.execNGQL({
        gql: `SHOW HOSTS`,
      })) as any;
      if (code === 0) {
        const activeMachineNum = data.tables.filter(i => i.Status === 'ONLINE')
          .length;
        this.update({
          activeMachineNum: activeMachineNum || 1,
        });
      }
      return { code, data };
    },

    async asyncCreateIndex(payload: {
      type: IndexType;
      name: string;
      associate: string;
      comment?: string;
      fields: string[];
    }) {
      const gql = getIndexCreateGQL(payload);
      const { code, data, message } = (await service.execNGQL(
        {
          gql,
        },
        {
          trackEventConfig: {
            category: 'schema',
            action: 'create_index',
          },
        },
      )) as any;
      return { code, data, message };
    },
  }),
});
