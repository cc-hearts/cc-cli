import { fileURLToPath } from 'url'
import inquirer from 'inquirer'
import { resolve } from 'path'
import { mkdir, readdir, rm } from 'fs/promises'
import { existsSync, createReadStream, createWriteStream } from 'fs'

const selectTemplatePrompt = {
  type: 'list',
  message: 'select a template type',
  name: 'selectTemplateType',
  choices: [
    {
      name: 'ts-node',
      value: 'ts-node',
    },
    {
      name: 'vue3',
      value: 'vue3',
    },
  ],
}
const templateNamePrompt = {
  type: 'input',
  message: 'input a template name',
  name: 'templateName',
}
// override prompt
const overridePrompt = {
  type: 'confirm',
  message: 'override files ?',
  name: 'override',
}

const getOption = async () => {
  const { selectTemplateType } = await inquirer.prompt([selectTemplatePrompt])
  const { templateName } = await inquirer.prompt([templateNamePrompt])
  return {
    selectTemplateType,
    templateName,
  }
}
const checkOverride = async () => {
  return await inquirer.prompt([overridePrompt])
}

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
function createDirAndFile(dirs, rootPath, templatePath) {
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
function getTemplatePath(templateName) {
  return resolve(
    fileURLToPath(import.meta.url),
    '..',
    '..',
    '..',
    'template',
    templateName,
  )
}
function write(targetFilePath, originFilePath) {
  return new Promise((resolve) => {
    const readStream = createReadStream(originFilePath, 'utf-8')
    const writeStream = createWriteStream(targetFilePath)
    readStream.pipe(writeStream)
    writeStream.on('finish', resolve)
  })
}

export { write }
