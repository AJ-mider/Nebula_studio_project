import { lazy } from 'react';

const Schema = lazy(() => import('@app/pages/Schema'));
const Console = lazy(() => import('@app/pages/Console'));
const SpaceCreate = lazy(() => import('@app/pages/Schema/SpaceCreate'));
const SchemaConfig = lazy(() => import('@app/pages/Schema/SchemaConfig'));
const Import = lazy(() => import('@app/pages/Import'));
const TaskCreate = lazy(() => import('@app/pages/Import/TaskCreate'));
const Doc = lazy(() => import('@app/pages/Doc'));
const connector = lazy(() => import('@app/pages/connector'));
const verify = lazy(() => import('@app/pages/verify'));
const verifyRecord = lazy(() => import('@app/pages/verifyRecord'));
const connectorInfo = lazy(() => import('@app/pages/connectorInfo'));
const overview = lazy(() => import('@app/pages/overview'));
const graphInfo = lazy(() => import('@app/pages/graphInfo'));
export const RoutesList = [
  {
    path: '/schema',
    component: Schema,
    exact: true,
  },
  {
    path: '/console',
    component: Console,
    exact: true,
  },
  {
    path: '/overview',
    component: overview,
    exact: true,
  },
  {
    path: '/graphInfo',
    component: graphInfo,
    exact: true,
  },
  {
    path: '/connector',
    component: connector,
    exact: true,
  },
  {
    path: '/connectorInfo',
    component: connectorInfo,
    exact: true,
  },
  {
    path: '/verify',
    component: verify,
    exact: true,
  },
  {
    path: '/verifyRecord',
    component: verifyRecord,
    exact: true,
  },
  {
    path: '/schema/space/create',
    component: SpaceCreate,
    exact: true,
  },
  {
    path: '/schema/:type?/:action?/:module?',
    component: SchemaConfig,
  },
  {
    path: '/import/create',
    component: TaskCreate,
    exact: true,
  },
  {
    path: '/import/:type?',
    component: Import,
  },
  {
    path: '/doc',
    component: Doc,
    exact: true,
  },
];

export const MENU_LIST = [
  {
    key: 'schema',
    path: '/schema',
    track: {
      category: 'navigation',
      action: 'view_schema',
      label: 'from_navigation'
    },
    // icon: 'icon-studio-nav-schema',
    intlKey: 'common.schema'
  },
  {
    key: 'import',
    path: '/import/files',
    track: {
      category: 'navigation',
      action: 'view_import',
      label: 'from_navigation'
    },
    // icon: 'icon-studio-nav-import',
    intlKey: 'common.import'
  },
  {
    key: 'connector',
    path: '/connector',
    track: {
      category: 'navigation',
      action: 'view_connector',
      label: 'from_navigation'
    },
    // icon: 'icon-studio-nav-console',
    intlKey: 'common.connector'
  },
  {
    key: 'verify',
    path: '/verify',
    track: {
      category: 'navigation',
      action: 'view_verify',
      label: 'from_navigation'
    },
    // icon: 'icon-studio-nav-console',
    intlKey: 'common.verify'
  },
  {
    key: 'overview',
    path: '/overview',
    track: {
      category: 'navigation',
      action: 'view_overview',
      label: 'from_navigation'
    },
    // icon: 'icon-studio-nav-console',
    intlKey: 'common.overview'
  },
  {
    key: 'console',
    path: '/console',
    track: {
      category: 'navigation',
      action: 'view_console',
      label: 'from_navigation'
    },
    // icon: 'icon-studio-nav-console',
    intlKey: 'common.console'
  },
];