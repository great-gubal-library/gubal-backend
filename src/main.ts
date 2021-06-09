import { NestFactory } from '@nestjs/core'
import * as compression from 'compression'
import * as helmet from 'helmet'
import 'moment/locale/fi'
import { AppModule } from './app.module'
import moment = require('moment')

function getCorsOrigin() {
  switch (process.env.NODE_ENV) {
    case 'development':
    default:
      return [
        /^http:\/\/localhost:3000$/,
        /^http:\/\/localhost:3001$/,
        /^http:\/\/localhost:3002$/,
        /^http:\/\/localhost\.com:3000$/,
        /^http:\/\/localhost\.com:3001$/,
        /^http:\/\/localhost\.com:3002$/,
      ];
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: getCorsOrigin(),
      methods: '*',
      allowedHeaders: '*',
      exposedHeaders: [
        'Cache-Control',
        'Content-Length',
        'Content-Type',
      ],
      credentials: true
    }
  })

  app.use(helmet())
  app.use(compression())

  await app.listen(1337)
}

moment.locale('fi')
bootstrap()
