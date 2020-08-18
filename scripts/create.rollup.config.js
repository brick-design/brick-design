import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import typescript from 'rollup-plugin-typescript2';
import babel from '@rollup/plugin-babel';
import image from '@rollup/plugin-image';
import { terser } from 'rollup-plugin-terser';
import path from 'path';

const override = { compilerOptions: { declaration: false } };

export function createConfig(pakg, name) {

	return {
		input: path.resolve(__dirname, 'src/index.ts'),
		output: [
			{
				dir: path.resolve(__dirname, 'dist/esm'),
				format: 'esm',
			},
			{
				dir: path.resolve(__dirname, 'dist/cjs'),
				format: 'cjs',
			},
			{
				name,
				format: 'umd',
				file: path.resolve(__dirname, `dist/umd/${name}.min.js`),
				plugins: [
					terser(),
				],
			},
		],
		watch: {
			include: 'src/**',
			exclude: 'src/__tests__/**',
		},
		external: pakg.dependencies && Object.keys(pakg.dependencies),
		plugins: [
			resolve({ browser: true }),
			image(),
			postcss({
				modules: true, // 增加 css-module 功能
				extensions: ['.less', '.css'],
				use: [
					['less', {
						javascriptEnabled: true,
					}],
				],
				inject: true, // dev 环境下的 样式是入住到 js 中的，其他环境不会注入
				extract: false, // 无论是 dev 还是其他环境这个配置项都不做 样式的抽离
			}),
			commonjs(),
			typescript({ tsconfigOverride: override }),
			babel({
				exclude: 'node_modules/**',  // 排除node_modules 下的文件
			})],
	};
}
