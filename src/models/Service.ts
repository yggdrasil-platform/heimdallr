import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class Service extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
    unique: true,
  })
  alias: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({
    nullable: false,
  })
  public: boolean;

  @Column({
    nullable: false,
  })
  url: string;
}
