const defaultConfig = {
  type: 'postgres',
  synchronize: false,
  username: 'postgres',
  password: 'postgres',
  entities: ['src/entity/*.{js,ts}'],
  migrations: ['src/migration/*.{js,ts}'],
  subscribers: ['src/subscriber/*.{js,ts}'],
  cli: {
    entitiesDir: 'src/entity',
    migrationsDir: 'src/migration',
    subscribersDir: 'src/subscriber',
  },
}

module.exports = [
  {
    ...defaultConfig,
    name: 'default',
    database: 'main',
    logging: false,
  },
  {
    ...defaultConfig,
    name: 'integration',
    dropSchema: true,
    database: 'integration',
    loggerLevel: 'debug',
  },
]
