import path from 'path'
import 'reflect-metadata'
import dotenv from 'dotenv'
export * from 'typeorm'

dotenv.config({ path: path.join(__dirname, '../../../.env') })

const port =
  (process.env.POSTGRES_PORT && Number(process.env.POSTGRES_PORT)) || 5432

import {
  Connection,
  ConnectionOptionsReader,
  createConnection as typeORMCreateConnection,
} from 'typeorm'

const connectionOptionsReader = new ConnectionOptionsReader({
  root: path.resolve(__dirname, '..'),
})

export const createConnection = async (
  databaseName = 'main',
): Promise<Connection> => {
  const config = await connectionOptionsReader.get(
    databaseName === 'main' ? 'default' : 'integration',
  )
  const preConnection = await typeORMCreateConnection({
    ...config,
    type: 'postgres',
    password: 'postgres',
    database: undefined,
    port,
    entities: [__dirname + '/entity/**/*.{js,ts}'],
    migrations: [__dirname + '/migration/**/*.{js,ts}'],
    subscribers: [__dirname + '/subscriber/**/*.{js,ts}'],
  })
  try {
    await preConnection.query(`create database ${databaseName}`)
  } catch (err) {
    // Postgres is dumb and doesn't have `CREATE DATABASE IF NOT EXISTS` so we have to do it ourselves
    if (!err.message.includes('already exists')) {
      throw err
    }
  } finally {
    await preConnection.close()
  }

  const connection = await typeORMCreateConnection({
    ...config,
    type: 'postgres',
    password: 'postgres',
    database: databaseName,
    port,
    entities: [__dirname + '/entity/**/*.{js,ts}'],
    migrations: [__dirname + '/migration/**/*.{js,ts}'],
    subscribers: [__dirname + '/subscriber/**/*.{js,ts}'],
  })
  await connection.runMigrations()
  return connection
}
