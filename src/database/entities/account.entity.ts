import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Rental } from './rental.entity';

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  discriminator: string;

  @Column()
  isActive: boolean;

  @OneToMany(
    () => Rental,
    rental => rental.requestedBy
  )
  requestedRentals: Rental[];

  @OneToMany(
    () => Rental,
    rental => rental.acceptedBy
  )
  acceptedRentals: Rental[];
}
