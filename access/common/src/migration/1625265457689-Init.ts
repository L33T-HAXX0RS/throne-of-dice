import { MigrationInterface, QueryRunner } from 'typeorm'
import { stripIndentation } from '@utility/common/string'

export class Init1625265457689 implements MigrationInterface {
  name = 'Init1625265457689'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(stripIndentation`
      create table todo (
        id   text primary key,
        text text not null,
        done bool not null
      )
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`drop table todo`)
  }
}
