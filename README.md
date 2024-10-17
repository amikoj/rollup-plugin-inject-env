# rollup-plugin-inejct-dotenv 使用说明
基于rollup实现本地.env环境变量文件的注入， 支持.env.development和.env.production文件， 同时支持输出类型定义文件。



## 安装

```bash
npm install --save-dev rollup-plugin-inejct-dotenv
```

## 支持配置

- `dto` (string) - 输出的类型定义文件路径，默认值为`typings/env.d.ts`
- `mode` (string) - 环境模式，`development`或`production`，对应读取`.env.development`或`.env.production`文件，不设置的时候会默认从`process.env.NODE_ENV`获取，不设置从`.env`文件读取
- `path` (string) - 环境变量文件路径，若设置`path`，则会读取该文件，否则会通过`mode`配置获取文件地址


## 使用

```js
// rollup.config.js
import injectEnv from 'rollup-plugin-inejct-dotenv';

export default {
  input: 'index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'cjs'
  },
  plugins: [    
    injectEnv({
        dto: 'typings/env.d.ts', // 输出的类型定义文件路径
        mode: 'development' // 环境模式，development或production，对应读取.env.development或.env.production文件, 不设置的时候会默认从process.env.NODE_ENV获取，不设置从.env文件读取
        path: '.env' // 环境变量文件路径，若设置path，则会读取该文件，否则会通过mode配置获取文件地址
    }),
    // other plugins
  ]
};
```

## 注意事项
- 若`.env`文件不存在，则不会注入任何环境变量
- 需保证```rollup-plugin-inejct-dotenv``` 插件在解析前执行，否则可能导致环境变量未注入，建议放在```plugins```数组的第一个位置