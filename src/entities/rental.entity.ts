import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable
} from 'typeorm';

import { Account, Product, Item } from '.';
import { RentalStatus } from '../common/enums';

@Entity()
export class Rental {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column()
  pickupTime: Date;

  @Column({ enum: RentalStatus, default: RentalStatus.NEW })
  status: RentalStatus;

  /**
   * Relations
   */
  @ManyToOne(
    () => Account,
    account => account.requestedRentals
  )
  @JoinColumn({ name: 'requestedBy' })
  requestedBy: Account;

  @ManyToOne(
    () => Account,
    account => account.acceptedRentals
  )
  @JoinColumn({ name: 'acceptedBy' })
  acceptedBy: Account;

  @ManyToMany(() => Product)
  @JoinTable()
  requestedProducts: Product[];

  @ManyToMany(() => Item)
  @JoinTable()
  items: Item[];
}
