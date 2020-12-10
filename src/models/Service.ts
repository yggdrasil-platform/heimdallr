import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class Service extends BaseEntity {
  @Column({
    nullable: false,
  })
  createdAt: Date;

  @Column({
    nullable: false,
    unique: true,
  })
  name: string;

  @Column({
    nullable: false,
  })
  url: string;

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
  })
  updatedAt: Date;
}
