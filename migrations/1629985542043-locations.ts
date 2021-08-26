import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class locations1629985542043 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "location",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true
                },
                {
                    name: "name",
                    type: "varchar",
                },
                {
                    name: "in_game_location",
                    type: "varchar",
                },
                {
                    name: "server",
                    type: "varchar",
                },
                {
                    name: "datacenter",
                    type: "varchar",
                },
                {
                    name: "owner",
                    type: "varchar",
                },
                {
                    name: "description",
                    type: "varchar",
                },
                {
                    name: "external_link",
                    type: "varchar",
                },
                {
                    name: "tags",
                    type: "varchar",
                },
                {
                    name: 'created_at',
                    type: 'timestamp',
                    default: 'now()'
                },
                {
                    name: 'updated_at',
                    type: 'timestamp',
                    default: 'now()'
                }
            ]
        }), true)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("location");
        await queryRunner.dropTable("location");
    }

}
