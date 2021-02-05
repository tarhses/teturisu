import svelte from 'rollup-plugin-svelte'
import sveltePreprocess from 'svelte-preprocess'
import css from 'rollup-plugin-css-only'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import strip from '@rollup/plugin-strip'
import { terser } from 'rollup-plugin-terser'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'

const production = !process.env.ROLLUP_WATCH
const port = parseInt(process.env.PORT) || 8000

export default {
  input: 'client/index.ts',

  output: {
    name: 'app',
    file: 'public/build/bundle.js',
    format: 'iife',
    sourcemap: !production,
  },

  plugins: [
    svelte({
      preprocess: sveltePreprocess(),
      compilerOptions: {
        dev: !production,
      },
    }),

    css({
      output: 'bundle.css',
    }),

    resolve({
      browser: true,
      dedupe: ['svelte'],
    }),

    commonjs(),

    typescript({
      sourceMap: !production,
      inlineSources: !production,
    }),

    production && strip({
      include: '**/*.(js|ts)',
    }),

    production && terser(),

    !production && serve({
      open: true,
      contentBase: 'public',
      historyApiFallback: true,
      port,
    }),

    !production && livereload('public'),
  ],

  watch: {
    clearScreen: false,
  },
}
