import typescript from '@rollup/plugin-typescript';
import babel from '@rollup/plugin-babel'
import { readFileSync } from 'fs';
import { builtinModules } from 'module';
import dts from 'rollup-plugin-dts';


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

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));

const external = Object.keys(pkg.dependencies || {})
  .concat(Object.keys(pkg.peerDependencies || {}))
  .concat(builtinModules);

//rollup.config.js
export default [{
  input: "src/index.ts",//打包入口
  //打包出口
  output: [
    {
      file: pkg.main,
      format: "es",//esm模式 用作es6的import导入形式
      plugins: [emitModulePackageFile(),],
      sourcemap: true
    },
    {
      file: pkg.module,
      format: "cjs",//cjs模式 用作commonjs的require导入形式
      exports: "named",
      footer: 'module.exports = Object.assign(exports.default, exports);',
      sourcemap: true,
    }
  ],
  external: external,
  plugins: [
    typescript({ sourceMap: true}),
    babel(),
  ],
  onwarn: (warning) => {
    throw Object.assign(new Error(), warning);
  },
  strictDeprecations: true,
},{
  input: "src/index.ts",
  output: {
    format: "esm",
    file:'lib/index.d.ts'
  },
  plugins: [dts()],
}];
