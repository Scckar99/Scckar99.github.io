import { existsSync, readdirSync } from 'node:fs'
import { lstat, mkdir, rm, symlink } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(scriptDir, '..')
const sourceDir = path.join(rootDir, 'packages', 'pure')
const targetDir = path.join(rootDir, 'node_modules', 'astro-pure')
const sourceNodeModulesDir = path.join(sourceDir, 'node_modules')
const rootNodeModulesDir = path.join(rootDir, 'node_modules')
const pnpmStoreDir = path.join(rootNodeModulesDir, '.pnpm')
const requiredExtraDeps = ['zod', 'rehype', 'unified', 'unist-util-visit', 'ultrahtml', 'vfile']

async function recreateLink(from, to) {
  if (existsSync(to)) {
    const stat = await lstat(to)
    if (stat.isDirectory() || stat.isFile() || stat.isSymbolicLink()) {
      await rm(to, { recursive: true, force: true })
    }
  }

  const linkType = process.platform === 'win32' ? 'junction' : 'dir'
  await symlink(from, to, linkType)
}

function findPnpmAstroPureNodeModules() {
  if (!existsSync(pnpmStoreDir)) return null

  const candidates = readdirSync(pnpmStoreDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name.startsWith('astro-pure@file+packages+'))
    .map((entry) => path.join(pnpmStoreDir, entry.name, 'node_modules'))
    .filter((dir) => existsSync(dir))

  return candidates[0] ?? null
}

function findPnpmPackagePath(pkgName) {
  if (!existsSync(pnpmStoreDir)) return null
  const encodedPrefix = `${pkgName.replace('/', '+')}@`
  const matched = readdirSync(pnpmStoreDir, { withFileTypes: true }).find(
    (entry) => entry.isDirectory() && entry.name.startsWith(encodedPrefix)
  )
  if (!matched) return null
  const pkgPath = path.join(pnpmStoreDir, matched.name, 'node_modules', pkgName)
  return existsSync(pkgPath) ? pkgPath : null
}

async function ensureDepAvailable(depNodeModulesDir, depName) {
  const depInTarget = path.join(depNodeModulesDir, depName)
  if (existsSync(depInTarget)) return

  const depFromStore = findPnpmPackagePath(depName)
  if (!depFromStore) {
    console.warn(`[link-astro-pure] warning: cannot locate "${depName}" in .pnpm store`)
    return
  }

  await mkdir(path.dirname(depInTarget), { recursive: true })
  await symlink(depFromStore, depInTarget, process.platform === 'win32' ? 'junction' : 'dir')
  console.log(`[link-astro-pure] linked extra dep: ${depInTarget} -> ${depFromStore}`)
}

async function linkLocalPackage() {
  if (!existsSync(sourceDir)) {
    throw new Error(`Local package not found: ${sourceDir}`)
  }

  await mkdir(path.dirname(targetDir), { recursive: true })

  await recreateLink(sourceDir, targetDir)
  console.log(`[link-astro-pure] linked: ${targetDir} -> ${sourceDir}`)

  const depNodeModulesDir = findPnpmAstroPureNodeModules() ?? rootNodeModulesDir
  if (!existsSync(depNodeModulesDir)) {
    throw new Error(`Cannot locate dependency node_modules for astro-pure: ${depNodeModulesDir}`)
  }

  await recreateLink(depNodeModulesDir, sourceNodeModulesDir)
  console.log(
    `[link-astro-pure] linked: ${sourceNodeModulesDir} -> ${depNodeModulesDir} (for local package deps)`
  )

  for (const depName of requiredExtraDeps) {
    await ensureDepAvailable(depNodeModulesDir, depName)
  }
}

linkLocalPackage().catch((error) => {
  console.error(`[link-astro-pure] failed: ${error instanceof Error ? error.message : error}`)
  process.exit(1)
})
