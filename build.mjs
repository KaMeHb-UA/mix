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
	outfile: resolve(outdir, 'app.mjs'),
	allowOverwrite: true,
	minify: false,
	//minifyIdentifiers: true,
	//minifySyntax: true,
	//minifyWhitespace: true,
	platform: 'neutral',
	target: 'es6',
	format: 'esm',
	metafile: false,
	legalComments: 'none',
	sourcemap: true,
    banner: {},
    mainFields: ['main', 'module'],
    define: {
        global: 'globalThis',
        'process.env.NODE_ENV': '"production"',
    },
	external: [],
};

function sleep(ms) {
	return new Promise((r) => setTimeout(r, ms));
}

try {
	await rm(outdir, { recursive: true, force: true });
	console.log('Building main script...');
	await esbuild(buildOptions);
	buildOptions.entryPoints = [resolve(srcdir, 'worker.ts')];
	buildOptions.format = 'iife';
	buildOptions.banner.js = '"use strict";\nvar AggregateError = Error; var globalThis = this;';
	buildOptions.outfile = resolve(outdir, 'worker.js');
	console.log('Building worker script...');
	await esbuild(buildOptions);
	console.log('Done');
	/*
    const original = readFileSync(buildOptions.outfile, 'utf8');
	writeFileSync(buildOptions.outfile, `.pragma library\nconst globalThis = this;\nconst _exported = Object.create(null);\n${
		exportedNames.map((name) => `function ${name}(...args){ return _exported.${name}(...args) }`).join('\n')
	}\n${original}`);
	*/
} catch(e) {
	await sleep(100);
	throw e;
}
