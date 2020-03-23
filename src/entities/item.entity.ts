import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Account } from '.';
import { Product } from './product.entity';

@Entity()
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Relations
   */
  @Column({ type: 'int', nullable: true })
  ownerId: number;

  @ManyToOne(
    () => Account,
    account => account.ownedItems,
    { onDelete: 'SET NULL' }
  )
  @JoinColumn({ name: 'ownerId' })
  owner: Account;

  @Column({ type: 'int', nullable: true })
  productId: number;

  @ManyToOne(
    () => Product,
    product => product.items,
    { onDelete: 'CASCADE' }
  )
  @JoinColumn({ name: 'productId' })
  product: Product;
}
