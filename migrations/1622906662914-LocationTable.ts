import * as fs from 'fs';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class LocationTable1622906662914 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const script: string[] = fs.readFileSync('./migrations/location.sql').toString().split(`\n\n`);
        await script.reduce((acc, s) =>
            acc.then(() => queryRunner.query(s))
            , Promise.resolve(null) as Promise<any>);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
