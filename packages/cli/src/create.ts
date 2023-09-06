import inquirer from 'inquirer'
import {
  overridePrompt,
  selectTemplatePrompt,
  templateNamePrompt,
} from './prompt.js'

interface CliOptions {
  selectTemplateType: string
  templateName: string
}

export const getOption: () => Promise<CliOptions> = async () => {
  const { selectTemplateType } = await inquirer.prompt([selectTemplatePrompt])
  const { templateName } = await inquirer.prompt([templateNamePrompt])

  return {
    selectTemplateType,
    templateName,
  }
}

export const checkOverride = async () => {
  return await inquirer.prompt([overridePrompt])
}
