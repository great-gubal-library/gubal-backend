module.exports = {
    type: 'mariadb',
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PWD,
    database: process.env.MYSQL_DATABASE,
    entities: [__dirname + '/**/**/**.entity{.ts,.js}'],
    migrations: [__dirname + '/migrations/*{.ts,.js}'],
    synchronize: false,
    cli: {
      migrationsDir: __dirname + '/migrations'
    },
    charset: 'utf8mb4'
}
