import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

//rollup.config.js
export default [{
  input: "index.ts",//打包入口
  //打包出口
  output: [
    {
      file: "lib/rollup-plugin-inject-dotenv.mjs",
      format: "es"//esm模式 用作es6的import导入形式
    },
    {
      file: "lib/rollup-plugin-inject-dotenv.umd.js",
      format: "umd",//umd模式 用作script标签引入形式
      name: "injectEnv"//umd模式需要配置全局变量名
    },{
      file: "lib/rollup-plugin-inject-dotenv.cjs",
      format: "cjs"//cjs模式 用作commonjs的require导入形式
    }
  ],
  plugins: [
    nodeResolve(),//nodeResolve插件
    commonjs(),//commonjs插件
    typescript({
    }), // 编译 ts 文件 
    json(), // 转换 json 文件
  ]
},
];
