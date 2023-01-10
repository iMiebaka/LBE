import colors from 'colors/safe';
const timeStamp = (): string => new Date().toISOString()


const success = (namespace: string, args: string): void => {
    console.log(colors.green(`[${timeStamp()}] [INFO] [${namespace}] ${args}`));
}

const info = (namespace: string, args: string): void => {
    console.log(colors.blue(`[${timeStamp()}] [INFO] [${namespace}] ${args}`));
}

const error = (namespace: string, args: string): void => {
    console.log(colors.red(`[${timeStamp()}] [ERROR] [${namespace}] ${args}`));
}

const warn = (namespace: string, args: string): void => {
    console.log(colors.yellow(`[${timeStamp()}] [WARNING] [${namespace}] ${args}`));
}

const logger = { warn, error, info, success }
export default logger

