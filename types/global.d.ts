// @ts-ignore

declare type Recordable<T = any> = Record<string, T>;

declare let __APP_INFO__: {
  pkg: {
    name: string;
    version: string;
    dependencies: Recordable<string>;
    devDependencies: Recordable<string>;
  };
  lastBuildTime: string;
};

declare global {
  declare type Recordable<T = any> = Record<string, T>;

  declare function parseInt(s: string | number, radix?: number): number;

  declare type Nullable<T> = T | null;

  declare interface ViteEnv {
    VITE_PORT: number;
    VITE_BASE_URL: string;
    VITE_DROP_CONSOLE: boolean;
  }
}
