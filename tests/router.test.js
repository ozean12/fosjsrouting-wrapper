const routes = require('./routes.json');
const generateRouter = require('../router');
const router = require('../router');

describe('Router', () => {
  let api = null;
  let routerContext = null;

  beforeEach(() => {
    expect(api).toBe(null);
    expect(routerContext).toBe(null);

    api = generateRouter(routes);
    routerContext = api.context_;

    expect(api).not.toBe(null);
    expect(routerContext).not.toBe(null);
    expect(routerContext.host).toBe(routes.host);
    expect(routerContext.base_url).toBe(routes.base_url);
    expect(routerContext.scheme).toBe(routes.scheme);
    expect(Object.keys(api.routes_).length).toBe(Object.keys(routes.routes).length);
  });

  afterEach(() => {
    api = null;
    routerContext = null;
  });

  it('constructor', () => {
    expect(routerContext).not.toBe(null);
    const config = Object.assign({}, routes, {
      base_url: 'example.com',
      scheme: 'https'
    });

    api = generateRouter(config);
    routerContext = api.context_;

    expect(routerContext).not.toBe(null);
    expect(routerContext.base_url).toBe('example.com');
    expect(routerContext.scheme).toBe('https');
  });

  it('setHost - getHost', () => {
    api.setHost('example1.com');

    expect(routerContext.host).toBe('example1.com');
    expect(api.getHost()).toBe('example1.com');
  });

  it('setScheme - getScheme', () => {
    api.setScheme('https');

    expect(routerContext.scheme).toBe('https');
    expect(api.getScheme()).toBe('https');
  });

  it('setBaseUrl - getBaseUrl', () => {
    api.setBaseUrl('helloworld.com');

    expect(routerContext.base_url).toBe('helloworld.com');
    expect(api.getBaseUrl()).toBe('helloworld.com');
  });

  it('setApiToken - getApiToken', () => {
    const token = 'someRandomTextAsToken';
    api.setApiToken(token);

    expect(routerContext.apiToken.token).toBe(token);
    expect(api.getApiToken().token).toBe(token);
  });

  it('setRoutes - getRoutes', () => {
    const _routes = {};
    api.setRoutes(_routes);

    expect(Object.keys(api.getRoutes()).length).toBe(0);

    api.setRoutes({ 'new-route': routes.routes['add-item'] });
    const keys = Object.keys(api.getRoutes());
    expect(keys.length).toBe(1);
    expect(keys[0]).toBe('new-route');
  });

  it('setPrefix', () => {
    api.setPrefix('v1');

    expect(routerContext.prefix).toBe('v1');
  });

  it('buildQueryParams', () => {
    const params = { a: 1, b: 'two', c: '' };
    const paramStr = [];

    // add function which needs more elaborate cases
    // though following function just builds string to check of params in QS
    const add = (key, value) => paramStr.push(`${key[1]}=${value}`)
    api.buildQueryParams('', params, add);
    expect(paramStr.join('&')).toBe('a=1&b=two&c=');
  });

  it('getRoute and getRoutePath', () => {
    api.setBaseUrl('');
    expect(api.getRoute('add-item')).toBe(routes.routes['add-item']);
    expect(api.getRoutePath('add-item')).toBe('/items/add');

    const routeKey = 'new-route';
    const routeData = Object.assign({}, routes.routes['get-items'], {
      tokens: [
        ['text', '/items-xyz']
      ]
    });
    api.setRoutes({ [routeKey]: routeData });
    const keys = Object.keys(api.getRoutes());

    expect(keys.length).toBe(1);
    expect(keys[0]).toBe(routeKey);

    expect(
      JSON.stringify(api.getRoute(routeKey))
    ).toBe(JSON.stringify(routeData));
    expect(api.getRoutePath(routeKey)).toBe(routeData.tokens[0][1]);
  });

  it('generate', () => {
    [
      {
        config: {
          scheme: 'https',
          host: '',
          base_url: 'example.com'
        },
        key: 'get-items',
        expectedUrl: 'https://example.com/items'
      },
      {
        config: {
          scheme: 'http',
          host: '',
          base_url: 'example1.com'
        },
        key: 'get-items',
        expectedUrl: 'http://example1.com/items'
      },
      {
        config: {
          scheme: 'http',
          host: '192.168.1.1',
          base_url: '/todos'
        },
        key: 'get-items',
        expectedUrl: 'http://192.168.1.1/todos/items'
      }
    ].forEach((testCase) => {
      const config = Object.assign({}, routes, testCase.config);

      api = generateRouter(config);
      const url = api.generate(testCase.key);

      expect(url).toBe(testCase.expectedUrl);
    });
  });
});
