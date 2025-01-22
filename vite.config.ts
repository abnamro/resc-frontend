import { fileURLToPath, URL } from 'node:url';

import tailwindcss from 'tailwindcss';
import { defineConfig, HttpProxy, loadEnv, type ProxyOptions, type UserConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { BootstrapVueNextResolver } from 'bootstrap-vue-next';
import postcssNesting from 'postcss-nesting';

// https://vitejs.dev/config/
const baseConfig = {
  server: {
    port: 8080,
    cors: false,
  },
  css: {
    postcss: {
      plugins: [tailwindcss(), postcssNesting],
    },
  },
  plugins: [
    vue(),
    Components({
      resolvers: [BootstrapVueNextResolver()],
    }),
    nodePolyfills({
      // To add only specific polyfills, add them here. If no option is passed, adds all polyfills
      include: ['buffer', 'crypto', 'stream', 'util'],
      // To exclude specific polyfills, add them to this list. Note: if include is provided, this has no effect
      exclude: [
        // 'http', // Excludes the polyfill for `http` and `node:http`.
      ],
      // Whether to polyfill specific globals.
      globals: {
        Buffer: true, // can also be 'build', 'dev', or false
        // global: true,
        // process: true,
      },
      // Override the default polyfills for specific modules.
      overrides: {
        // Since `fs` is not supported in browsers, we can use the `memfs` package to polyfill it.
        // fs: 'memfs',
      },
      // Whether to polyfill `node:` protocol imports.
      // protocolImports: true,
    }),
  ],
  define: {
    global: 'window',
  },
  resolve: {
    alias: {
      // @ts-ignore-next-line
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      crypto: 'crypto-browserify',
      stream: 'stream-browserify',
      util: '@browsery/util',
    },
  },
  test: {
    reporters: ['verbose', 'vitest-sonar-reporter'],
    outputFile: 'sonar-report.xml',
  },
} as UserConfig;

function defineProxyConfig(url: string) {
  return {
    '/resc': {
      target: url,
      changeOrigin: true,
      secure: true,
      ws: true,
      configure: (proxy: HttpProxy.Server, _options: ProxyOptions) => {
        proxy.on('error', (err, _req, _res) => {
          console.log('proxy error', err);
        });
        proxy.on('proxyReq', (proxyReq, req, _res) => {
          console.log(req.method?.padEnd(4), '=> ', proxyReq.host + req.url);
        });
        proxy.on('proxyRes', (proxyRes, req, _res) => {
          console.log(proxyRes.statusCode?.toString().padEnd(4), '<=', req.url);
        });
      },
    },
  };
}

/** @type {import('vite').UserConfig} */
export default defineConfig(({ command, mode }) => {
  const config = baseConfig;
  const env = loadEnv(mode, process.cwd(), '');

  // We define it but otherwise TS is complaining.
  if (config.server === undefined) {
    throw new Error('server config is missing');
  }

  if (command === 'serve') {
    console.log('LOCAL VITE MODE detected');
    if (env.VITE_HTTP_PROXY_TARGET !== undefined) {
      console.log('api calls will be forwarded to:');
      console.log(env.VITE_HTTP_PROXY_TARGET);
      config.server.proxy = defineProxyConfig(env.VITE_HTTP_PROXY_TARGET);
    }
  }

  return config;
});
