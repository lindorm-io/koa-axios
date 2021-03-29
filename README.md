# @lindorm-io/koa-axios
Axios Request Handler middleware for @lindorm-io/koa applications.

## Installation
```shell script
npm install --save @lindorm-io/koa-axios
```

### Peer Dependencies
This package has the following peer dependencies:
* [@lindorm-io/axios](https://www.npmjs.com/package/@lindorm-io/axios)
* [@lindorm-io/koa](https://www.npmjs.com/package/@lindorm-io/koa)
* [@lindorm-io/winston](https://www.npmjs.com/package/@lindorm-io/winston)

## Usage

```typescript
koaApp.addMiddleware(axiosMiddleware({
  baseUrl: "http://lindorm.io",
  basicAuth: { username: "secret", password: "secret" },
  middleware: [],
  name: "ClientName",
}))

const response = await ctx.axios.ClientName.get("/path");
```
