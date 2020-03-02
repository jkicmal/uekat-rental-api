import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

import { Account } from './index';

@Entity()
export class Rental {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  startTime: Date;

  @Column()
  endTime: Date;

  @Column()
  requestedTime: Date;

  @Column()
  cancelledTime: Date;

  @Column()
  status: string;

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
}
