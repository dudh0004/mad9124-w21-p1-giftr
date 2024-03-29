import mongoose from 'mongoose'
import config from 'config'
import logger from './logger.js'

const log = logger.child({ module: 'connectDB' })

export default async function connectDB() {
  const {
    scheme,
    host,
    port,
    name,
    username,
    password,
    authSource,
  } = config.get('db')
  const credentials = username && password ? `${username}:${password}@` : ''
  let connectionString = `${scheme}://${credentials}${host}`

  if (scheme === 'mongodb') {
    connectionString += `:${port}/${name}?authSource=${authSource}`
  } else {
    connectionString += `/${authSource}?retryWrites=true&w=majority`
  }

  try {
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
      dbName: name,
    })
    log.info(`Connected to MongoDB @ ${name}...`)
  } catch (error) {
    log.error(`Error connecting to MongoDB ...`, error)
    process.exit(1)
  }
}
