import colors from 'colors/safe';

const info = (namespace: string, args: string) =>
    console.info(colors.blue(`[${timeStamp()}] [INFO] [${namespace}] ${args}`));

const error = (namespace: string, args: string) =>
    console.error(colors.red(`[${timeStamp()}] [ERROR] [${namespace}] ${args}`));

const warn = (namespace: string, args: string) =>
    console.warn(colors.yellow(`[${timeStamp()}] [WARNING] [${namespace}] ${args}`));

const timeStamp = (): string => new Date().toISOString()


const logger = { warn, error, info }
export default logger

