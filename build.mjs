import { build as esbuild } from 'esbuild';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { rm } from 'node:fs/promises';
import { readFileSync, writeFileSync } from 'node:fs';
import { Parser } from 'acorn';
import { tsPlugin } from '@sveltejs/acorn-typescript';

const dirname = resolve(fileURLToPath(import.meta.url), '..');
const outdir = resolve(dirname, 'dist');
const srcdir = resolve(dirname, 'src');

const tsParser = Parser.extend(tsPlugin());

const exportedNames = [];

/** @type {Parameters<typeof esbuild>[0]} */
const buildOptions = {
	entryPoints: [resolve(srcdir, 'app.ts')],
	bundle: true,
	outfile: resolve(outdir, 'index.js'),
	allowOverwrite: true,
	minify: false,
	//minifyIdentifiers: true,
	//minifySyntax: true,
	//minifyWhitespace: true,
	platform: 'neutral',
	target: 'es6',
	format: 'iife',
	metafile: false,
	legalComments: 'none',
	sourcemap: true,
    banner: {
        js: 'var AggregateError = Error;',
    },
    mainFields: ['main', 'module'],
    define: {
        global: 'globalThis',
        'process.env.NODE_ENV': '"production"',
    },
	plugins: [{
		name: 'entry',
		setup(build) {
			build.onResolve({ filter: /.*/ }, ({ path, importer }) => {
				if (importer) return;
				const ast = tsParser.parse(readFileSync(path, 'utf8'), { ecmaVersion: 'latest', sourceType: 'module' });
				for (const node of ast.body) {
					if (node.type === 'ExportNamedDeclaration') {
						if (node.declaration) {
							if (node.declaration.type === 'FunctionDeclaration') {
								exportedNames.push(node.declaration.id.name);
							}
						} else if (node.specifiers) {
							for (const specifier of node.specifiers) {
								exportedNames.push(specifier.exported.name);
							}
						}
					}
				}
				return {
					path,
					namespace: 'entry',
				};
			});
			build.onResolve({ filter: /.*/, namespace: 'entry' }, ({ path }) => {
				return {
					path,
				};
			});
			build.onLoad({ filter: /.*/, namespace: 'entry' }, ({ path }) => {
				return {
					contents: `import * as exported from '${path.replaceAll('\\', '\\\\')}';${
							'\n'
						}Object.keys(exported).forEach((name) => { _exported[name] = exported[name]; })`,
				};
			})
		},
	}],
	external: [],
};

function sleep(ms) {
	return new Promise((r) => setTimeout(r, ms));
}

try {
	await rm(outdir, { recursive: true, force: true });
	await esbuild(buildOptions);
    const original = readFileSync(buildOptions.outfile, 'utf8');
	writeFileSync(buildOptions.outfile, `.pragma library\nconst globalThis = this;\nconst _exported = Object.create(null);\n${
		exportedNames.map((name) => `function ${name}(...args){ return _exported.${name}(...args) }`).join('\n')
	}\n${original}`);
} catch(e) {
	await sleep(100);
	throw e;
}
