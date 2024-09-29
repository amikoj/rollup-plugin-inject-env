//rollup.config.js
export default {
    input: "index.js",//打包入口
    //打包出口
    output: [
      {
        file: "lib/rollup-plugin-inject-env.es.js",
        format: "es"//esm模式 用作es6的import导入形式
      },
      {
        file: "lib/rollup-plugin-inject-env.umd.js",
        format: "umd",//umd模式 用作script标签引入形式
        name: "injectEnv"//umd模式需要配置全局变量名
      }
    ]
  };
  