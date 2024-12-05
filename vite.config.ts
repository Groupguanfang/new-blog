import fs from 'node:fs'
import path from 'node:path'
import VueI18n from '@intlify/unplugin-vue-i18n/vite'
import Shiki from '@shikijs/markdown-it'
import Vue from '@vitejs/plugin-vue'
import LinkAttributes from 'markdown-it-link-attributes'
import Unocss from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { buildServer, defaultSwcOptions, swc } from 'unplugin-rpc'
import NailyRpc from 'unplugin-rpc/vite'
import { HeadlessUiResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import VueMacros from 'unplugin-vue-macros/vite'
import Markdown from 'unplugin-vue-markdown/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'
import VueRouter from 'unplugin-vue-router/vite'
import { defineConfig, Plugin } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import VueDevTools from 'vite-plugin-vue-devtools'
import Layouts from 'vite-plugin-vue-layouts'
import WebfontDownload from 'vite-plugin-webfont-dl'
import generateSitemap from 'vite-ssg-sitemap'

export default defineConfig(({ isPreview, command }) => {
  const isDevelopment = command === 'serve' && !isPreview

  function FileCopyer(files: Record<string, string>): Plugin {
    return {
      name: 'file-copyer',
      apply: 'build',

      async buildEnd(error) {
        if (error)
          return
        for (const [from, to] of Object.entries(files)) {
          if (!fs.existsSync(from)) {
            this.warn(`File not found: ${from}`)
            continue
          }
          if (!fs.existsSync(path.dirname(to)))
            fs.promises.mkdir(path.dirname(to), { recursive: true })
          fs.promises.copyFile(from, to)
        }
      },
    }
  }

  return {
    resolve: {
      alias: {
        '~/': `${path.resolve(__dirname, 'frontend')}/`,
        '#/': `${path.resolve(__dirname, 'common')}/`,
        '@/': `${path.resolve(__dirname, 'backend')}/`,
      },
    },

    build: {
      outDir: isPreview ? './build/frontend' : './dist/build/frontend',
    },

    // Disable esbuild when using swc
    esbuild: false,

    plugins: [
      // https://github.com/nailyjs/core
      NailyRpc({
        build: {
          on: false,
        },
      }),

      // Internal swc plugin, fork from https://github.com/unplugin/unplugin-swc
      // - esbuild doesn't support `emitDecoratorMetadata` to reflect types in runtime, so we need it
      // - unplugin-swc has some problems to import, so we forked it and buildin to the rpc plugin
      swc.vite(defaultSwcOptions),

      VueMacros({
        plugins: {
          vue: Vue({
            include: [/\.vue$/, /\.md$/],
          }),
        },
      }),

      // https://github.com/posva/unplugin-vue-router
      VueRouter({
        extensions: ['.vue', '.md'],
        dts: isDevelopment ? './frontend/typed-router.d.ts' : false,
        routesFolder: './content',
      }),

      // https://github.com/JohnCampionJr/vite-plugin-vue-layouts
      Layouts({
        layoutsDirs: './frontend/layouts',
        pagesDirs: './content',
      }),

      // https://github.com/antfu/unplugin-auto-import
      AutoImport({
        imports: [
          'vue',
          'vue-i18n',
          '@vueuse/head',
          '@vueuse/core',
          VueRouterAutoImports,
          {
            // add any other imports you were relying on
            'vue-router/auto': ['useLink'],
          },
        ],
        dts: isDevelopment ? './frontend/auto-imports.d.ts' : false,
        dirs: [
          './frontend/composables',
          './frontend/stores',
        ],
        vueTemplate: true,
      }),

      // https://github.com/antfu/unplugin-vue-components
      Components({
        // allow auto load markdown components under `./src/components/`
        extensions: ['vue', 'md'],
        // allow auto import and register components used in markdown
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
        dts: isDevelopment ? './frontend/components.d.ts' : false,
        dirs: [
          './frontend/components',
        ],
        resolvers: [HeadlessUiResolver()],
      }),

      // https://github.com/antfu/unocss
      // see uno.config.ts for config
      Unocss(),

      // https://github.com/unplugin/unplugin-vue-markdown
      // Don't need this? Try vitesse-lite: https://github.com/antfu/vitesse-lite
      Markdown({
        wrapperClasses: 'prose prose-sm m-auto text-left',
        headEnabled: true,
        async markdownItSetup(md) {
          md.use(LinkAttributes, {
            matcher: (link: string) => /^https?:\/\//.test(link),
            attrs: {
              target: '_blank',
              rel: 'noopener',
            },
          })
          md.use(await Shiki({
            defaultColor: false,
            themes: {
              light: 'vitesse-light',
              dark: 'vitesse-dark',
            },
          }))
        },
      }),

      // https://github.com/antfu/vite-plugin-pwa
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.svg', 'safari-pinned-tab.svg'],
        manifest: {
          name: 'Vitesse',
          short_name: 'Vitesse',
          theme_color: '#ffffff',
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable',
            },
          ],
        },
      }),

      // https://github.com/intlify/bundle-tools/tree/main/packages/unplugin-vue-i18n
      VueI18n({
        runtimeOnly: true,
        compositionOnly: true,
        fullInstall: true,
        include: [path.resolve(__dirname, 'locales/**')],
      }),

      // https://github.com/feat-agency/vite-plugin-webfont-dl
      WebfontDownload(),

      // https://github.com/webfansplz/vite-plugin-vue-devtools
      VueDevTools(),

      FileCopyer({
        [path.resolve('vite.config.ts')]: './dist/vite.config.ts',
        [path.resolve('package.json')]: './dist/package.json',
      }),
    ],

    // https://github.com/vitest-dev/vitest
    test: {
      include: ['test/**/*.test.ts'],
      environment: 'jsdom',
    },

    // https://github.com/antfu/vite-ssg
    ssgOptions: {
      script: 'async',
      formatting: 'minify',
      crittersOptions: {
        reduceInlineStyles: false,
      },
      entry: './frontend/main.ts',
      async onFinished() {
        await buildServer({
          build: {
            on: false,
            viteOptions: {
              build: {
                outDir: './dist/build/backend',
              },
            },
          },
        })
        generateSitemap({ outDir: './dist/build/frontend' })
      },
    },

    ssr: {
      // TODO: workaround until they support native ESM
      noExternal: ['workbox-window', /vue-i18n/],
    },
  }
})
