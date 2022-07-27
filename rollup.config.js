import { babel } from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import typescript from '@rollup/plugin-typescript';

import react from 'react';
import reactDom from 'react-dom';

const jsx = require('rollup-plugin-jsx');

const NODE_ENV = process.env.NODE_ENV || "development";

const outputFile = NODE_ENV === "production" ? "./lib/reactory.client.core.min.js" : "./lib/reactory.client.core.js";

export default {
  input: "./src/index.ts",
  output: {
    file: outputFile,
    format: "umd",
    globals: ['React', 'window'],
    external: ['react', 'react-dom'],
    sourcemap: false
  },  
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify(NODE_ENV || "development"),
      preventAssignment: true
    }),
    commonjs({
      include: 'node_modules/**',
      exclude: [
        'node_modules/process-es6/**',
      ],
      namedExports: {
        'node_modules/react/index.js': ['Component', 'PureComponent', 'Fragment', 'Children', 'createElement'],
        'node_modules/react-dom/index.js': ['render'],
        'react': Object.keys(react),
        'react-dom': Object.keys(reactDom)
      }      
    }),
    typescript(),        
    babel({
      exclude: 'node_modules/**',
      include: ['./src/**/*.ts', './src/**/*.js', './src/**/*.tsx'],
      babelHelpers: "bundled",
      sourceMaps: "both",
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      presets: [
        [
          "@babel/preset-env",
          {
            modules: false,
          }
        ],

        [
          "@babel/preset-react",          
        ],

        [
          "@babel/preset-typescript",          
        ]
      ],          
    }),
    jsx({ factory: 'React.createElement' }),
    resolve(),
  ],
};