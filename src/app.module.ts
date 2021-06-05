import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { LocationModule } from './modules/location/location.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (): any => ({
        type: 'mariadb',
        host: process.env.MYSQL_HOST,
        port: 3306,
        username: process.env.MYSQL_USER,
        password: process.env.MYSQL_PWD,
        database: process.env.MYSQL_DATABASE,
        entities: [__dirname + '/**/**/**.entity{.ts,.js}'],
        synchronize: false,
        // logging: true,
        // logger: 'simple-console',
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
        cli: {
          migrationsDir: __dirname + '/migrations'
        },
        charset: 'utf8mb4',
      })
    }),
    ScheduleModule.forRoot(),
    LocationModule
  ]
})

export class AppModule {}
