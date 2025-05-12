
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/instituthree/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "redirectTo": "/instituthree/authentication",
    "route": "/instituthree"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-QAHGAGBR.js",
      "chunk-GPEJGZUD.js",
      "chunk-2QV25GQ2.js",
      "chunk-GJBTIFZ6.js"
    ],
    "route": "/instituthree/authentication"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-3NNOCTEW.js",
      "chunk-2QV25GQ2.js",
      "chunk-GJBTIFZ6.js"
    ],
    "route": "/instituthree/login"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-HIGPHDND.js",
      "chunk-GJBTIFZ6.js"
    ],
    "route": "/instituthree/register"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-LEUOOCHC.js",
      "chunk-4GHDTI2M.js",
      "chunk-GPEJGZUD.js",
      "chunk-2QV25GQ2.js",
      "chunk-GJBTIFZ6.js"
    ],
    "route": "/instituthree/user-management"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-B4LGNON2.js",
      "chunk-4GHDTI2M.js",
      "chunk-GPEJGZUD.js",
      "chunk-2QV25GQ2.js",
      "chunk-GJBTIFZ6.js"
    ],
    "route": "/instituthree/roles"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-H7T5KPIE.js",
      "chunk-4GHDTI2M.js",
      "chunk-GPEJGZUD.js",
      "chunk-2QV25GQ2.js",
      "chunk-GJBTIFZ6.js"
    ],
    "route": "/instituthree/permissions"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 368263, hash: 'da1787f192229307fe44210b9e2b4a570d873ffaf6b04812f5a99c0606441963', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 361857, hash: 'f133a7e8b013dff42c396c602cf0c8bd66e09b5c95165fa825c06277af7c5a75', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'login/index.html': {size: 378775, hash: 'e1019eba2d18dfb98c351f7fa85fc97c878f25e96a0663f45a448f6f6ae6c0fa', text: () => import('./assets-chunks/login_index_html.mjs').then(m => m.default)},
    'authentication/index.html': {size: 437710, hash: 'ea5fdd269e5f6fd1659324fda9633c55d370e4d335d4a3eed06356718616c993', text: () => import('./assets-chunks/authentication_index_html.mjs').then(m => m.default)},
    'register/index.html': {size: 379436, hash: '8f29671e17ff0af1a281b08675cc2e53f224a1029bb70f54a4c8147401b985cb', text: () => import('./assets-chunks/register_index_html.mjs').then(m => m.default)},
    'roles/index.html': {size: 428112, hash: 'cac8e2b61cb6898b30c0986a6e8743371ac0e1d96de0a52e32a263399692e471', text: () => import('./assets-chunks/roles_index_html.mjs').then(m => m.default)},
    'permissions/index.html': {size: 428124, hash: '782cba7228d634d6ac100e84cf61357ef2e430cdf70dbabab196585bf211288a', text: () => import('./assets-chunks/permissions_index_html.mjs').then(m => m.default)},
    'user-management/index.html': {size: 493935, hash: '9b5300582f3a333861874ce2d4651a45899cfbf98092e88532681da30d5f9106', text: () => import('./assets-chunks/user-management_index_html.mjs').then(m => m.default)},
    'styles-VJ7WH5Y7.css': {size: 7023, hash: 'F72jV+16sM4', text: () => import('./assets-chunks/styles-VJ7WH5Y7_css.mjs').then(m => m.default)}
  },
};
