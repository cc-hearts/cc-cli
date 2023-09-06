import { fileURLToPath } from 'url'
import { checkOverride, getOption } from './create.js'
import { resolve } from 'path'
import { readdir, mkdir, rm } from 'fs/promises'
import { Dirent } from 'node:fs'
import { createReadStream, createWriteStream, existsSync } from 'fs'

async function start() {
  const options = await getOption()
  const { selectTemplateType, templateName } = options
  const templatePath = getTemplatePath(selectTemplateType)
  const rootName = resolve(process.cwd(), templateName)
  if (!existsSync(rootName)) {
    await mkdir(rootName, { recursive: true })
  } else {
    // have exist files
    const dirs = await readdir(rootName, {
      encoding: 'utf-8',
      withFileTypes: true,
      recursive: true,
    })
    if (dirs.length > 0) {
      // prompt to confirm
      const { override } = await checkOverride()
      if (!override) return
      await rm(rootName, { recursive: true })
      await mkdir(rootName, { recursive: true })
    }
  }

  const dirs = await readdir(templatePath, {
    encoding: 'utf-8',
    withFileTypes: true,
    recursive: true,
  })
  createDirAndFile(dirs, rootName, templatePath)
}

start()

function createDirAndFile(
  dirs: Dirent[],
  rootPath: string,
  templatePath: string,
) {
  dirs.forEach(async (dir) => {
    if (dir.isDirectory()) {
      await mkdir(resolve(rootPath, dir.name), { recursive: true })
      const dirs = await readdir(resolve(templatePath, dir.name), {
        encoding: 'utf-8',
        withFileTypes: true,
        recursive: true,
      })
      createDirAndFile(
        dirs,
        resolve(rootPath, dir.name),
        resolve(templatePath, dir.name),
      )
    } else {
      const targetFilePath = resolve(rootPath, dir.name)
      const originFilePath = resolve(templatePath, dir.name)
      await write(targetFilePath, originFilePath)
    }
  })
}

function getTemplatePath(templateName: string) {
  return resolve(
    fileURLToPath(import.meta.url),
    '..',
    '..',
    '..',
    'template',
    templateName,
  )
}

export function write(targetFilePath: string, originFilePath: string) {
  return new Promise((resolve) => {
    const readStream = createReadStream(originFilePath, 'utf-8')
    const writeStream = createWriteStream(targetFilePath)
    readStream.pipe(writeStream)
    writeStream.on('finish', resolve)
  })
}
