export const selectTemplatePrompt = {
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
