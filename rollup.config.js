import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import babel from '@rollup/plugin-babel'

export function emitModulePackageFile() {
  return {
    name: 'emit-module-package-file',
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'package.json',
        source: `{"type":"module"}`
      });
    }
  };
}


//rollup.config.js
export default [{
  input: "src/index.ts",//打包入口
  //打包出口
  output: [
    {
      file: "lib/index.esm.js",
      format: "es",//esm模式 用作es6的import导入形式
      footer: 'module.exports = Object.assign(exports.default, exports);',
      plugins: [emitModulePackageFile()],
      sourcemap: true
    },
     {
      file: "lib/index.cjs",
      format: "cjs",//cjs模式 用作commonjs的require导入形式
      exports: "named",
      sourcemap: true
    }
  ],
  plugins: [
    typescript({ sourceMap: true }), // 编译 typescript
    babel({
      presets: [['@babel/preset-env', { targets: { node: 14 } }]],
      babelHelpers: 'bundled'
    }),
  ]
},
];
