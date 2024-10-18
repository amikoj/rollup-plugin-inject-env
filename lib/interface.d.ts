export interface Options {
    mode?: string;
    dto?: string;
    env?: Record<string, string | number | boolean>;
    path?: string;
    [key: string]: string | number | boolean | Record<string, string | number | boolean>;
}
