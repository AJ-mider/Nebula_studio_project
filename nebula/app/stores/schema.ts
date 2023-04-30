import { action, makeAutoObservable, observable } from 'mobx';
import service from '@app/config/service';
import { IAlterForm, IEdge, IIndexList, ISchemaType, ISpace, ITag, ITree, IndexType } from '@app/interfaces/schema';
import { handleKeyword } from '@app/utils/function';
import { findIndex } from 'lodash';
import {
  getAlterGQL,
  getIndexCreateGQL,
} from '@app/utils/gql';

export class SchemaStore {
  spaces: string[] = [];
  currentSpace: string = sessionStorage.getItem('currentSpace') || '';
  spaceVidType: string;
  edgeTypes: string[] = [];
  tagsFields: any[] = [];
  edgesFields: any[] = [];
  indexes: any[] = [];
  tags: any[] = [];
  tagIndexTree: ITree[] = [];
  edgeIndexTree: ITree[] = [];
  spaceList: ISpace[] = [];
  activeMachineNum: number = 1;
  tagList: ITag[] = [];
  edgeList: IEdge[] = [];
  indexList: IIndexList[] = [];
  constructor() {
    makeAutoObservable(this, {
      spaces: observable,
      currentSpace: observable,
      spaceVidType: observable,
      edgeTypes: observable,
      tagsFields: observable,
      edgesFields: observable,
      indexes: observable,
      tags: observable,
      tagIndexTree: observable,
      edgeIndexTree: observable,
      spaceList: observable,
      activeMachineNum: observable,
      tagList: observable,
      edgeList: observable,
      indexList: observable,
      update: action,
      addEdgesName: action,
      addTagsName: action,
    });
  }

  resetModel = () => {
    this.update({
      currentSpace: '',
      spaces: [],
    });
    sessionStorage.removeItem('currentSpace');
  }

  update = (payload: Record<string, any>) =>
    Object.keys(payload).forEach(key => Object.prototype.hasOwnProperty.call(this, key) && (this[key] = payload[key]));


  updateVidType = async (space?: string) => {
    const { code, data } = await this.getSpaceInfo(space || this.currentSpace);
    if(code === 0) {
      this.update({
        spaceVidType: data?.tables?.[0]?.['Vid Type'],
      });
    }
  }

  switchSpace = async (space: string) => {
    const { code, message } = (await service.execNGQL({
      gql: `use ${handleKeyword(space)};`,
    })) as any;

    if (code === 0) {
      this.update({
        currentSpace: space,
      });
      sessionStorage.setItem('currentSpace', space);
      this.updateVidType(space);
    } else {
      return message;
    }
  };


  getSchemaInfo = async () => {
    const [tags, edges] = await Promise.all([this.getTags(), this.getEdges()]);
    this.update({ tags, edgeTypes: edges });
  }

  getSpaces = async () => {
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
  };



  getSpaceInfo = async (space: string) => {
    const { code, data } = (await service.execNGQL({
      gql: `DESCRIBE SPACE ${handleKeyword(space)}`,
    })) as any;
    return { code, data };
  }

  getSpacesList = async () => {
    const res = await this.getSpaces();
    if (res.data) {
      const spaces: ISpace[] = [];
      await Promise.all(
        res.data.map(async (item, i) => {
          const { code, data } = await this.getSpaceInfo(
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
  }

  deleteSpace = async (space: string) => {
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
  }

  cloneSpace = async (name: string, space: string) => {
    const { code, data } = (await service.execNGQL(
      {
        gql: `CREATE SPACE IF NOT EXISTS ${handleKeyword(name)} as ${handleKeyword(space)}`,
      },
      {
        trackEventConfig: {
          category: 'schema',
          action: 'clone_space',
        },
      },
    )) as any;
    return { code, data };
  }

  createSpace = async (gql: string) => {
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
  }

  getMachineNumber = async () => {
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
  }

  // edges
  getEdges = async () => {
    const { code, data } = (await service.execNGQL({
      gql: `
        show edges;
      `,
    })) as any;
    if (code === 0) {
      const edgeTypes = data.tables.map(item => item.Name);
      this.update({ edgeTypes });
      return edgeTypes;
    }
  }

  getEdgeTypesFields = async (payload: { edgeTypes: any[] }) => {
    const { edgeTypes } = payload;
    await Promise.all(
      edgeTypes.map(async item => {
        const { code, data } = await this.getTagOrEdgeInfo('edge', item);
        if (code === 0) {
          const edgeFields = data.tables.map(item => item.Field);
          this.addEdgesName({
            edgeType: item,
            edgeFields: ['type', '_rank', ...edgeFields],
          });
        }
      }),
    );
  }

  getEdgesAndFields = async () => {
    const edgeTypes = await this.getEdges();
    if (edgeTypes) {
      this.getEdgeTypesFields({ edgeTypes });
    }
  }

  getEdgeList = async () => {
    const edgeTypes = await this.getEdges();
    if (edgeTypes) {
      const edgeList: IEdge[] = [];
      await Promise.all(
        edgeTypes.map(async item => {
          const edge: IEdge = {
            name: item,
            fields: [],
          };
          const { code, data } = await this.getTagOrEdgeInfo('edge', item);
          if (code === 0) {
            edge.fields = data.tables;
          }
          edgeList.push(edge);
        }),
      );
      this.update({ edgeList });
    }
  }

  deleteEdge = async (name: string) => {
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
  }

  addEdgesName = async (payload: any) => {
    const { edgeType, edgeFields } = payload;
    const index = findIndex(this.edgesFields, edgeType);
    this.edgesFields[!~index ? this.edgesFields.length : index] = { [edgeType]: edgeFields };
  }

  // tags
  getTags = async () => {
    const { code, data } = (await service.execNGQL({
      gql: `
        SHOW TAGS;
      `,
    })) as any;

    if (code === 0) {
      const tags = data.tables.map(item => item.Name);
      return tags;
    }
  }

  addTagsName = (payload: any) => {
    const { tag, tagFields } = payload;
    const index = findIndex(this.tagsFields, item => item.tag === tag);
    this.tagsFields[!~index ? this.tagsFields.length : index] = { tag, fields: tagFields };
  };

  getTagsFields = async (payload: { tags: any[] }) => {
    const { tags } = payload;
    await Promise.all(
      tags.map(async item => {
        const { code, data } = await this.getTagOrEdgeInfo('tag', item);
        if (code === 0) {
          const tagFields = data.tables.map(item => ({
            field: item.Field,
            type: item.Type,
          }));
          this.addTagsName({ tag: item, tagFields });
        }
      }),
    );
  };

  getTagList = async () => {
    const tags = await this.getTags();
    if (tags) {
      const tagList: ITag[] = [];
      await Promise.all(
        tags.map(async item => {
          const tag: ITag = {
            name: item,
            fields: [],
          };
          const { code, data } = await this.getTagOrEdgeInfo('tag', item);
          if (code === 0) {
            tag.fields = data.tables;
          }
          tagList.push(tag);
        }),
      );
      this.update({ tagList });
    }
  }

  deleteTag = async (name: string) => {
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
  }

  createTagOrEdge = async (payload: {
    type: ISchemaType,
    gql: string
  }) => {
    const { type, gql } = payload;
    const { code, data, message } = (await service.execNGQL(
      {
        gql,
      },
      {
        trackEventConfig: {
          category: 'schema',
          action: `create_${type.toLowerCase()}`,
        },
      },
    )) as any;
    return { code, data, message };
  }

  alterField = async (payload: IAlterForm) => {
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
  }

  getTagOrEdgeDetail = async (type: ISchemaType, name: string) => {
    const gql = `show create ${type} ${handleKeyword(name)}`;
    const { code, data, message } = (await service.execNGQL({
      gql,
    })) as any;
    return { code, data, message };
  }

  getTagOrEdgeInfo = async (type: ISchemaType, name: string) => {
    const gql = `desc ${type}  ${handleKeyword(name)}`;
    const { code, data } = (await service.execNGQL({
      gql,
    })) as any;
    return { code, data };
  }

  // indexes
  getIndexes = async (type: IndexType) => {
    const { code, data } = (await service.execNGQL({
      gql: `
        SHOW ${type} INDEXES
      `,
    })) as any;
    if (code === 0) {
      const key = type === 'tag' ? 'By Tag' : 'By Edge';
      const indexes = data.tables.map(item => {
        return {
          name: item['Index Name'],
          owner: item[key],
        };
      });
      this.update({
        indexes,
      });
      return indexes;
    }
  }

  getIndexComment = async (payload: { type: IndexType; name: string }) => {
    const { type, name } = payload;
    const { code, data } = (await service.execNGQL({
      gql: `
        SHOW CREATE ${type} index ${handleKeyword(name)}
      `,
    })) as any;
    if (code === 0) {
      const _type = type === 'tag' ? 'tag' : 'edge';
      const res = data.tables[0]?.[`Create ${_type} Index`] || '';
      const reg = /comment = "(.+)"/g;
      const result = reg.exec(res);
      const comment = result?.[1] || null;
      return comment;
    } else {
      return null;
    }
  }

  getIndexFields = async (payload: { type: IndexType; name: string }) => {
    const { type, name } = payload;
    const { code, data } = (await service.execNGQL({
      gql: `
        DESCRIBE ${type} INDEX ${handleKeyword(name)}
      `,
    })) as any;
    return { code, data };
  }

  getIndexTree = async (type: IndexType) => {
    const indexes = await this.getIndexes(type);
    if (indexes) {
      const _indexes = await Promise.all(
        indexes.map(async (item: any) => {
          const { code, data } = await this.getIndexFields({
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
      const key = type === 'tag' ? 'tagIndexTree' : 'edgeIndexTree';
      this.update({
        [key]: tree,
      });
      return tree;
    }
  }

  getIndexList = async (type: IndexType) => {
    const indexes = await this.getIndexes(type);
    if (indexes) {
      const indexList: IIndexList[] = [];
      await Promise.all(
        indexes.map(async item => {
          const comment = await this.getIndexComment({
            type,
            name: item.name,
          });
          const index: IIndexList = {
            owner: item.owner,
            comment,
            name: item.name,
            fields: [],
          };

          const { code, data } = await this.getIndexFields({
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
  }

  deleteIndex = async (payload: { type: IndexType; name: string }) => {
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
  }

  createIndex = async (payload: {
    type: IndexType;
    name: string;
    associate: string;
    comment?: string;
    fields: string[];
  }) => {
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
  }

  rebuildIndex = async (payload: { type: IndexType; name: string }) => {
    const { type, name } = payload;
    const { code, data } = (await service.execNGQL(
      {
        gql: `
        REBUILD ${type} INDEX ${handleKeyword(name)}
      `,
      },
      {
        trackEventConfig: {
          category: 'schema',
          action: 'rebuild_index',
        },
      },
    )) as any;
    return { code, data };
  }

  getIndexesStatus = async (type: IndexType) => {
    const { code, data } = (await service.execNGQL({
      gql: `
        SHOW ${type} INDEX STATUS
      `,
    })) as any;
    if (code === 0) {
      return data.tables;
    }
    return null;
  }

  // stats
  submitStats = async () => {
    const { code, data } = (await service.execNGQL(
      {
        gql: `
        SUBMIT JOB STATS
      `,
      },
      {
        trackEventConfig: {
          category: 'schema',
          action: 'submit_stats',
        },
      },
    )) as any;
    return { code, data };
  }

  getStats = async () => {
    const { code, data } = (await service.execNGQL({
      gql: `
        SHOW STATS
      `,
    })) as any;
    return { code, data };
  }

  getJobStatus = async (id?) => {
    const gql = id === undefined ? 'SHOW JOBS' : `SHOW JOB ${id}`;
    const { code, data } = (await service.execNGQL({
      gql,
    })) as any;
    return { code, data };
  }
}

const schemaStore = new SchemaStore();
export default schemaStore;
