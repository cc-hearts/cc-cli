import { readdir } from "node:fs/promises";
import { fileURLToPath, } from "node:url"
import { resolve } from 'path'
import inquirer from 'inquirer'

interface CliOptions {
  selectTemplateType: string
  templateName: string
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

async function getTemplatePrompt() {
  const templatePath = resolve(fileURLToPath(import.meta.url), '..', '..', '..', 'template');
  const dirs = await readdir(templatePath, { 'withFileTypes': true })
  const choices = dirs.filter(dir => dir.isDirectory() && !dir.name.startsWith('.')).map(dir => ({ name: dir.name, value: dir.name }))

  return {
    type: 'list',
    message: 'select a template type',
    name: 'selectTemplateType',
    choices
  }
}

export const getOption: () => Promise<CliOptions> = async () => {
  const { selectTemplateType } = await inquirer.prompt([await getTemplatePrompt()])
  const { templateName } = await inquirer.prompt([templateNamePrompt])

  return {
    selectTemplateType,
    templateName,
  }
}

export const checkOverride = async () => {
  return await inquirer.prompt([overridePrompt])
}