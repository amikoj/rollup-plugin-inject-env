export interface Options {
    mode?: string; // development | production | test | etc.
    dto?: string; // env.d.ts file path, 生成的dts文件路径
    env?: Record<string, string | number | boolean>; // env variables, 附属环境变量
    path?: string; // path to the env file, 环境变量文件路径
    [key: string]: string | number | boolean | Record<string, string | number | boolean>; 
}