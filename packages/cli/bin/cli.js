import { intro, text, isCancel, cancel, confirm } from '@clack/prompts';

const create = async () => {
    intro('create  a package ');
    const name = await text({
        message: 'package name?',
        placeholder: 'packages'
    });
    console.log(name);
    if (isCancel(name)) {
        cancel('opt canceled');
        return process.exit(0);
    }
    const isInstall = await confirm({
        message: 'is install?'
    });
    const npmConfig = process.env.npm_config_user_agent;
    console.log(npmConfig, '-------');
    console.log(isInstall);
};
create();

export { create };
