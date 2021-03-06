import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import css from 'rollup-plugin-css-only';

const production = !process.env.ROLLUP_WATCH;

function serve(start = "start") {
	let server;
	console.log(production);
	console.log(start);

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require('child_process').spawn('npm', ['run', start, '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

export default [
	{ // Dashboard
		input: 'frontend/dashboard/src/main.js',
		output: {
			sourcemap: true,
			format: 'iife',
			file: 'frontend/dashboard/public/build/main.js'
		},
		plugins: [
			svelte({
				compilerOptions: {
					dev: !production
				}
			}),
			css({ output: 'dashboard.css' }),
			resolve({
				browser: true,
				dedupe: ['svelte']
			}),
			commonjs(),
			terser()
		],
	},
	{ // Display
		input: 'frontend/display/src/main.js',
		output: {
			sourcemap: true,
			format: 'iife',
			file: 'frontend/display/public/build/main.js'
		},
		plugins: [
			svelte({
				compilerOptions: {
					dev: !production
				}
			}),
			css({ output: 'display.css' }),
			resolve({
				browser: true,
				dedupe: ['svelte']
			}),
			commonjs(),
			production ? serve() : serve("start-nodemon"),
			production && terser()
		],
		watch: {
			clearScreen: false
		}
	}
];
