import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/kit/vite';
import * as path from 'node:path';

export default {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      // default options are shown. On some platforms
      // these options are set automatically — see below
      pages: 'build',
      assets: 'build',
      fallback: null,
      precompress: false,
      strict: true
    }),
    alias: {
      $components: path.resolve('src/components')
    },
    paths: {
      base: process.env.BASE_PATH ?? ''
    }
  }
};
