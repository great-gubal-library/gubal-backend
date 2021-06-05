import { config } from 'dotenv';
import { createConnection, getRepository } from 'typeorm';
import { LocationSeed } from './location.seed';

config();

async function runSeed() {
  console.log('Running Location seed')
  await getRepository('location').save(LocationSeed);
}

const databaseConfig = {
  type: 'mariadb',
  host: process.env.MYSQL_HOST,
  port: parseInt(process.env.MYSQL_PORT),
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PWD,
  database: process.env.MYSQL_DATABASE,
  entities: [__dirname + '/../**/**/**.entity{.ts,.js}'],
  synchronize: false,
  charset: 'utf8mb4'
};

createConnection(databaseConfig as any)
  .then(runSeed)
  .catch(err => { console.log(err); process.exit() })
  .then(() => process.exit());
