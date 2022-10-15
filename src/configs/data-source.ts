import { DataSource } from 'typeorm'
import * as dotenv from 'dotenv'

dotenv.config()

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: '0.0.0.0',
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false,
  entities: [__dirname + '/../**/*.entity.{ts,js}'],
  migrationsRun: true,
  migrations: [__dirname + '/../migrations/**/*.{ts,js}']
})
