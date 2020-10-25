import resolve from 'rollup-plugin-node-resolve';
import { terser } from "rollup-plugin-terser";

function onwarn(warning) {
  if (warning.code === 'THIS_IS_UNDEFINED')
    return;
  console.error(warning.message);
}

export default [
  {
    input: `./scripts/home.js`,
    output: {
      file: `./scripts/home.min.js`,
      format: 'iife',
      name: 'ShihnCaHome'
    },
    onwarn,
    plugins: [
      resolve(),
      terser()
    ]
  },
  {
    input: `./scripts/post.js`,
    output: {
      file: `./scripts/post.min.js`,
      format: 'iife',
      name: 'ShihnCaPost'
    },
    onwarn,
    plugins: [
      resolve(),
      terser()
    ]
  }
];