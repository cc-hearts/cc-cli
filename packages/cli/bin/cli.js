import { existsSync, createReadStream, createWriteStream } from 'fs';
import { readdir, mkdir, rm } from 'node:fs/promises';
import { resolve } from 'path';
import { fileURLToPath as fileURLToPath$1 } from 'url';
import inquirer from 'inquirer';
import { fileURLToPath } from 'node:url';

async function getTemplatePrompt() {
    const templatePath = resolve(fileURLToPath(import.meta.url), '..', '..', '..', 'template');
    const dirs = await readdir(templatePath, { 'withFileTypes': true });
    const choices = dirs.filter(dir => dir.isDirectory() && !dir.name.startsWith('.')).map(dir => ({ name: dir.name, value: dir.name }));
    return {
        type: 'list',
        message: 'select a template type',
        name: 'selectTemplateType',
        choices
    };
}
const templateNamePrompt = {
    type: 'input',
    message: 'input a template name',
    name: 'templateName',
};
// override prompt
const overridePrompt = {
    type: 'confirm',
    message: 'override files ?',
    name: 'override',
};
getTemplatePrompt();

const getOption = async () => {
    const { selectTemplateType } = await inquirer.prompt([await getTemplatePrompt()]);
    const { templateName } = await inquirer.prompt([templateNamePrompt]);
    return {
        selectTemplateType,
        templateName,
    };
};
const checkOverride = async () => {
    return await inquirer.prompt([overridePrompt]);
};

async function start() {
    const options = await getOption();
    const { selectTemplateType, templateName } = options;
    const templatePath = getTemplatePath(selectTemplateType);
    const rootName = resolve(process.cwd(), templateName);
    if (!existsSync(rootName)) {
        await mkdir(rootName, { recursive: true });
    }
    else {
        // have exist files
        const dirs = await readdir(rootName, {
            encoding: 'utf-8',
            withFileTypes: true,
            recursive: true,
        });
        if (dirs.length > 0) {
            // prompt to confirm
            const { override } = await checkOverride();
            if (!override)
                return;
            await rm(rootName, { recursive: true });
            await mkdir(rootName, { recursive: true });
        }
    }
    const dirs = await readdir(templatePath, {
        encoding: 'utf-8',
        withFileTypes: true,
        recursive: true,
    });
    createDirAndFile(dirs, rootName, templatePath);
}
start();
function createDirAndFile(dirs, rootPath, templatePath) {
    dirs.forEach(async (dir) => {
        if (dir.isDirectory()) {
            await mkdir(resolve(rootPath, dir.name), { recursive: true });
            const dirs = await readdir(resolve(templatePath, dir.name), {
                encoding: 'utf-8',
                withFileTypes: true,
                recursive: true,
            });
            createDirAndFile(dirs, resolve(rootPath, dir.name), resolve(templatePath, dir.name));
        }
        else {
            const targetFilePath = resolve(rootPath, dir.name);
            const originFilePath = resolve(templatePath, dir.name);
            await write(targetFilePath, originFilePath);
        }
    });
}
function getTemplatePath(templateName) {
    return resolve(fileURLToPath$1(import.meta.url), '..', '..', '..', 'template', templateName);
}
function write(targetFilePath, originFilePath) {
    return new Promise((resolve) => {
        const readStream = createReadStream(originFilePath, 'utf-8');
        const writeStream = createWriteStream(targetFilePath);
        readStream.pipe(writeStream);
        writeStream.on('finish', resolve);
    });
}

export { write };
