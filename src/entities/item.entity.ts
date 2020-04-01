import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Account, Product } from '.';

@Entity()
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'boolean', default: true })
  available: boolean;

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

  @Column({ type: 'int', nullable: false })
  productId: number;

  @ManyToOne(
    () => Product,
    product => product.items,
    { onDelete: 'CASCADE' }
  )
  @JoinColumn({ name: 'productId' })
  product: Product;
}
