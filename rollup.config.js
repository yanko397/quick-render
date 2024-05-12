import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import copy from 'rollup-plugin-copy'

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/bundle.js',
    format: 'iife',
    name: 'MyModule',
  },
  plugins: [
    typescript(),
    resolve(),
    commonjs(),
    copy({
      targets: [
        { src: 'src/*.html', dest: 'dist' },
        { src: 'src/*.css', dest: 'dist' },
        { src: 'res/*', dest: 'dist' },
      ]
    }),
  ],
};