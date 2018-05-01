/* eslint-env node */
/* eslint-disable import/no-extraneous-dependencies */

import progress from 'rollup-plugin-progress';
import postcss from 'rollup-plugin-postcss';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import buble from 'rollup-plugin-buble';
import uglify from 'rollup-plugin-uglify';
import autoprefixer from 'autoprefixer';
import clean from 'postcss-clean';
import fileSize from 'rollup-plugin-filesize';
import json from 'rollup-plugin-json';
import eft from 'rollup-plugin-eft';
import replace from 'rollup-plugin-replace';

const getBuildPlan = ({
    enableUglify = true,
    extractCSS = false,
    withConsole = false,
    withSourceMap = false,
} = {}) => ({
    input: 'src/index.js',
    output: {
        file: 'dist/bundle.js',
        format: 'umd',
        name: 'Pomment',
        sourcemap: withSourceMap,
    },
    plugins: [
        progress({
            clearLine: false,
        }),
        replace({
            'process.env.NODE_ENV': "'development'",
        }),
        postcss({
            extract: extractCSS,
            plugins: [
                autoprefixer(),
                clean(),
            ],
        }),
        commonjs(),
        resolve({
            jsnext: true,
            main: true,
            browser: true,
            extensions: [
                '.js',
                '.json',
            ],
        }),
        json(),
        eft(),
        buble({
            transforms: {
                modules: false,
                dangerousForOf: true,
            },
            objectAssign: 'Object.assign',
        }),
        (enableUglify && uglify({
            compress: {
                drop_console: !withConsole,
            },
        })),
        fileSize(),
    ],
});

export default getBuildPlan;
