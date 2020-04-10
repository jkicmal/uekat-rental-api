import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn
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

  @Column({ type: 'float' })
  depositTotal: number;

  @Column({ type: 'float' })
  priceTotal: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

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

  @ManyToOne(
    () => Account,
    account => account.finalizedRentals
  )
  @JoinColumn({ name: 'finalizedBy' })
  finalizedBy: Account;

  @ManyToOne(
    () => Account,
    account => account.cancelledRentals
  )
  @JoinColumn({ name: 'cancelledBy' })
  cancelledBy: Account;

  @ManyToOne(
    () => Account,
    account => account.rejectedRentals
  )
  @JoinColumn({ name: 'rejectedBy' })
  rejectedBy: Account;

  @ManyToMany(() => Product)
  @JoinTable()
  products: Product[];

  @ManyToMany(() => Item)
  @JoinTable()
  items: Item[];
}
