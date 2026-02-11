import { existsSync } from 'node:fs'
import { lstat, mkdir, rm, symlink } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(scriptDir, '..')
const sourceDir = path.join(rootDir, 'packages', 'pure')
const targetDir = path.join(rootDir, 'node_modules', 'astro-pure')

async function linkLocalPackage() {
  if (!existsSync(sourceDir)) {
    throw new Error(`Local package not found: ${sourceDir}`)
  }

  await mkdir(path.dirname(targetDir), { recursive: true })

  if (existsSync(targetDir)) {
    const stat = await lstat(targetDir)
    if (stat.isDirectory() || stat.isFile() || stat.isSymbolicLink()) {
      await rm(targetDir, { recursive: true, force: true })
    }
  }

  const linkType = process.platform === 'win32' ? 'junction' : 'dir'
  await symlink(sourceDir, targetDir, linkType)
  console.log(`[link-astro-pure] linked: ${targetDir} -> ${sourceDir}`)
}

linkLocalPackage().catch((error) => {
  console.error(`[link-astro-pure] failed: ${error instanceof Error ? error.message : error}`)
  process.exit(1)
})
