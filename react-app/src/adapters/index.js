import { adapterRegistry, installAdapters } from './registry.js';

const adapterModules = import.meta.glob('./{classes,feats,species,spells}/**/*.js');
const loadedPaths = new Set();
const installedAdapters = [];
const speciesPathPattern = /^\.\/species\//;
const featPathPattern = /^\.\/feats\//;
const runtimeConfigPathPattern = /\/runtime-config\.js$/;

function classFolderToken(name) {
  return String(name || '').toLowerCase().replace(/[^a-z0-9]/g, '-');
}

function pathsForClass(name) {
  const token = classFolderToken(name);
  return Object.keys(adapterModules).filter((path) =>
    path.includes(`./classes/${token}/`) || path.includes(`/classes/${token}/`),
  );
}

function pathsForSpecies() {
  return Object.keys(adapterModules).filter((path) => speciesPathPattern.test(path));
}

function pathsForFeats() {
  return Object.keys(adapterModules).filter((path) => featPathPattern.test(path));
}

function pathsForCoreRuntime() {
  return Object.keys(adapterModules).filter((path) => runtimeConfigPathPattern.test(path));
}

async function loadPaths(paths, context) {
  const fresh = paths.filter((path) => !loadedPaths.has(path));
  if (!fresh.length) return;
  const modules = await Promise.all(fresh.map((path) => adapterModules[path]()));
  const adapters = modules.map((module) => module.default).filter(Boolean);
  fresh.forEach((path) => loadedPaths.add(path));
  installedAdapters.push(...adapters);
  installAdapters(adapters, adapterRegistry, context);
}

export const installedRegistry = adapterRegistry;

export async function loadCoreAdapters(context = {}) {
  await Promise.all([
    loadPaths(pathsForSpecies(), context),
    loadPaths(pathsForFeats(), context),
    loadPaths(pathsForCoreRuntime(), context),
  ]);
  return adapterRegistry;
}

export async function loadClassAdapters(classNames, context = {}) {
  const names = Array.isArray(classNames) ? classNames : [classNames];
  const paths = names.flatMap(pathsForClass);
  await loadPaths(paths, context);
  return adapterRegistry;
}

export async function loadSpellsAdapters(context = {}) {
  const spellsPaths = Object.keys(adapterModules).filter((path) => path.startsWith('./spells/'));
  await loadPaths(spellsPaths, context);
  return adapterRegistry;
}

export async function loadConvertedAdapters(context = {}) {
  const all = Object.keys(adapterModules);
  await loadPaths(all, context);
  return adapterRegistry;
}

export function reinstallAdapters(context = {}) {
  installAdapters(installedAdapters, adapterRegistry, context);
}

export { adapterRegistry };
