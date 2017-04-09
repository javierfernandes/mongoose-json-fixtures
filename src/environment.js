export const getEnv = () => process.env.NODE_ENV
const is = expected => () => getEnv() === expected

export const isStaging = () => getEnv() === 'staging' || getEnv() === 'production'
export const isTest = () => is('test')
export const isDev = () => is('dev')

export const checkEnv = () => isStaging() || isTest() || isDev()

export const forceDev = () => { process.env.NODE_ENV = 'dev' }
