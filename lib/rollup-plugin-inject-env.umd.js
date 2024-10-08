(function (factory) {
    typeof define === 'function' && define.amd ? define(factory) :
    factory();
})((function () { 'use strict';

    // It reads the environment variables from the .env file and generates a type definition file for them.
    const { config } = require('dotenv'); // 读取.env文件
    const fs = require('fs');
    const path = require('path');

    const { writeFileSync } = fs;
    /**
     * @typedef {Object} Plugin
     * @property {string} name - Plugin name
     * @property {function} buildStart - Called when the build starts
     * @property {function} renderChunk - Called for each chunk during the build
     * @property {function} buildEnd - Called when the build ends
     */


    /**
     * @typedef {Object} ENV
     * @property {string} [key] - Environment variable key
     * @property {string|number|boolean} [value] - Environment variable value   
     */


    /**
     * @typedef {Object} Options
     * @property {string} [mode='development'] - Build mode
     * @property {string} [path='.env.development'] - Path to the environment variables file
     * @property {string} [dto='env.d.ts'] - Path to the generated type definition file
     * @property {ENV} [env] - Environment variables object (optional)
     */

    /**
     * Rollup plugin to inject environment variables into the bundle and generate a type definition file for them.
     * @constructor
     * @param {Options} options - Plugin options object (optional)
     * @returns {Plugin}
     */
    function injectEnv (options) {


        const transformEnv = (env) => {
            const transformed = {};
            Object.keys(env).forEach(key => {
                const value = env[key];
                if(/^\d+(\.\d+)?$/.test(value)){
                    // 可以转成数字类型
                    transformed[key] = Number(value);
                }else if( value === 'true' || value === 'false'){
                    // 可以转成布尔类型
                    transformed[key] = Boolean(value);
                }else {
                    // 其他类型都转成字符串类型
                    transformed[key] = String(value);
                }
            });
            return transformed;
        };




        if (options === void 0) options = {};
        if (typeof options.mode === 'undefined') {
            options.mode = process.env.NODE_ENV || 'development';    }
        if (typeof options.path === 'undefined') {
            options.path = `.env.${options.mode}`;
        }
        if (typeof options.dto === 'undefined') {
            options.dto = 'env.d.ts';
        }

        if(typeof options.env === 'undefined'){
            options.env = config({ path: options.path }).parsed || {}; // read .env file
        }

        options.env = transformEnv(options.env); // transform env values to number or boolean or string


        const createEnvTypes = () => {
            let envTypes = `/* eslint-disable */
/**
* ${options.dto}
*  This file is automatically generated by 'rollup-plugin-inject-env' plugin. 
*  Use 'dotenv' npm package to load your environment variables from .env file.
*  You can also manually edit this file to add or remove environment variables.
*  Global environment variables.
*/

/**
* Global environment variables.
*/
export interface GlobalEnv {
`;
            Object.keys(options.env).forEach(key => {
                const value = options.env[key];

                if(typeof value === 'number'){
                    // 可以转成数字类型
                    envTypes += `   ${key}: number;\n`;
                }else if(typeof value === 'boolean'){
                    // 可以转成布尔类型
                    envTypes += `   ${key}: boolean;\n`;
                }else {
                    // 其他类型都转成字符串类型
                    envTypes += `   ${key}: string;\n`;
                }
            });

            envTypes += `}\n`;

            envTypes += `declare global{\n  const ENV: GlobalEnv;\n}\nexport {};`;
            

            const dtoPath = path.dirname(options.dto);
            

            if(dtoPath &&!path.isAbsolute(dtoPath)){
                fs.mkdirSync(dtoPath, { recursive: true });
            }
            

            // 写入dist/env.d.ts
            writeFileSync(options.dto, envTypes);
            console.log('rollup-plugin-inject-env global env types：', options.dto, ' generated successfully.');
        };

        return {
            name: 'rollup-plugin-inject-env',
            buildStart() {
                this.addWatchFile(options.path); // listen to .env file changes
            },
            renderChunk(code, chunk) {
                if (chunk.isEntry) {
                    // entry file needs to be modified to inject environment variables
                    return `window.ENV = ${JSON.stringify(options.env)};${code}`;
                }
            },
            buildEnd(){
                // generate type definition file for global environment variables
                createEnvTypes();
            },
        }
    }   


    module.exports = injectEnv;

}));
