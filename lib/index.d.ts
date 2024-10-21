import { Plugin } from 'rollup';

interface Options {
    mode?: string;
    dto?: string;
    env?: Record<string, string | number | boolean>;
    path?: string;
}
declare const injectEnv: Plugin<Options>;

export { type Options, injectEnv as default };
