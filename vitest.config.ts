import { fileURLToPath } from 'node:url';
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config';
import viteConfig from './vite.config';

export default defineConfig((configEnv) =>
  mergeConfig(
    viteConfig(configEnv),
    defineConfig({
      server: {
        port: 8080,
      },
      define: { global: 'window' },
      test: {
        setupFiles: 'tests/setup.ts',
        environment: 'jsdom',
        exclude: [...configDefaults.exclude, 'e2e/*', 'resc-repository-scanner/components/*'],
        root: fileURLToPath(new URL('./', import.meta.url)),
        globals: true,
        coverage: {
          include: ['src/**/*'],
          exclude: ['**/main.ts', '**/axios-config.ts', '**/chartjs.ts', '**/preset.ts'],
          enabled: true,
          provider: 'istanbul',
          all: true,
          reporter: ['lcov', 'text', 'cobertura', 'html'],
          reportsDirectory: 'tests/reports/coverage',
          // Next version of Vite
          // thresholds: {
          //   branches: 95,
          //   functions: 95,
          //   lines: 95,
          //   statements: 95,
          //   'src/**.ts': {
          //     branches: 60,
          //     functions: 60,
          //     lines: 80,
          //     statements: 80,
          //   },
          // },
        },
      },
    }),
  ),
);
