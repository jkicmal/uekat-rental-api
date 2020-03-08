import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, Unique } from 'typeorm';
import { Account } from './account.entity';
import { IsAlpha } from 'class-validator';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Unique(['name'])
  @IsAlpha()
  name: string;

  /**
   * Relations
   */
  @ManyToMany(
    () => Account,
    account => account.roles
  )
  accounts: Account[];
}
