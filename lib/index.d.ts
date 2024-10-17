import { Plugin } from "rollup";
interface Options {
    mode?: string;
    dto?: string;
    env?: Record<string, string | number | boolean>;
    path?: string;
    [key: string]: string | number | boolean | Record<string, string | number | boolean>;
}
declare const injectEnv: Plugin<Options>;
export default injectEnv;
