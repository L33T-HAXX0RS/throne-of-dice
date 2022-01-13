import { Entity, Column, PrimaryColumn } from 'typeorm'
import { TaskDto } from '@utility/common/dtos'

@Entity()
export class Todo implements TaskDto {
  @PrimaryColumn()
  id: string

  @Column()
  text: string

  @Column()
  done: boolean
}
