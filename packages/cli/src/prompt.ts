import { readdir } from "node:fs/promises";
import { fileURLToPath, } from "node:url"
import { resolve } from 'path'

export async function getTemplatePrompt() {
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

export const templateNamePrompt = {
  type: 'input',
  message: 'input a template name',
  name: 'templateName',
}

// override prompt
export const overridePrompt = {
  type: 'confirm',
  message: 'override files ?',
  name: 'override',
}


getTemplatePrompt()