# rollup-plugin-inject-env
基于rollup实现本地.env环境变量文件的注入



## 安装

```bash
npm install --save-dev rollup-plugin-inject-env
```

## 使用

```js
// rollup.config.js
import injectEnv from 'rollup-plugin-inject-env';

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
  ]
};
```