import { ConfigEnv, UserConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import WindiCSS from 'vite-plugin-windicss';
import { resolve } from 'path';
import pkg from './package.json';
import { format } from 'date-fns';
import { loadEnv } from 'vite';
import { wrapperEnv } from './build/utils';
import { OUTPUT_DIR } from './build/constant';
// @ts-ignore
import Components from 'unplugin-vue-components/vite';
// @ts-ignore
import { ArcoResolver } from 'unplugin-vue-components/resolvers';
const { dependencies, devDependencies, name, version } = pkg;

const __APP_INFO__ = {
  pkg: { dependencies, devDependencies, name, version },
  lastBuildTime: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
};

function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir);
}

export default ({ mode, command }: ConfigEnv): UserConfig => {
  const root = process.cwd();
  const env = loadEnv(mode, root);
  const viteEnv = wrapperEnv(env);
  const { VITE_PORT, VITE_DROP_CONSOLE } = viteEnv;
  const isBuild = command === 'build';
  console.log(isBuild);
  return {
    plugins: [
      vue(),
      WindiCSS(),
      Components({
        resolvers: [ArcoResolver()],
      }),
    ],
    base: 'swagger',
    resolve: {
      alias: [
        {
          find: /\/#\//,
          replacement: pathResolve('types') + '/',
        },
        {
          find: '@',
          replacement: pathResolve('src') + '/',
        },
        {
          find: 'vue-i18n',
          replacement: 'vue-i18n/dist/vue-i18n.cjs.js',
        },
      ],
      dedupe: ['vue'],
    },
    define: {
      __APP_INFO__: JSON.stringify(__APP_INFO__),
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          // Customize stylings here
          modifyVars: {
            // arcoblue-6 is the primary-color :)))
            // TODO: 动态
            'arcoblue-6': '#1DA57A', // 绿色
            // 'arcoblue-6': '#165DFF', // 蓝色
          },
        },
      },
    },
    server: {
      host: true,
      port: VITE_PORT,
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:8080',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    optimizeDeps: {
      include: [],
      exclude: ['vue-demi'],
    },
    build: {
      target: 'es2015',
      outDir: OUTPUT_DIR,
      terserOptions: {
        compress: {
          keep_infinity: true,
          drop_console: VITE_DROP_CONSOLE,
        },
      },
      brotliSize: false,
      chunkSizeWarningLimit: 2000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return id.toString().split('node_modules/')[1].split('/')[0].toString();
            }
          },
          entryFileNames: `assets/[name].js`,
          chunkFileNames: `assets/[name].js`,
          assetFileNames: `assets/[name].[ext]`,
        },
      },
    },
  };
};
