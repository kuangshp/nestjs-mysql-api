module.exports = [
  {
    name: 'default',
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_DATABASE,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    synchronize: false,
    logging: false,
    charset: 'utf8',
    entities: [
      'src/entities/**/*.{ts,js}',
      'src/modules/**/entity/*.{ts,js}'
    ],
    migrations: [
      'src/migration/*.ts'
    ],
    subscribers: [
      'src/subscriber/**/*.ts'
    ],
    cli: {
      'entitiesDir': 'src/entities',
      'migrationsDir': 'src/migration',
      'subscribersDir': 'src/subscriber'
    }
  }
]
