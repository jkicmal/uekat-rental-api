import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  ManyToMany
} from 'typeorm';

import { Item, Rental, Category } from '.';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ type: 'float' })
  price: number;

  @Column({ type: 'float' })
  deposit: number;

  @Column({ type: 'boolean', default: true })
  showInStore = true;

  /**
   * Relations
   */
  @Column({ type: 'int', nullable: true })
  categoryId: number;

  @ManyToOne(
    () => Category,
    category => category.products,
    { onDelete: 'SET NULL' }
  )
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @OneToMany(
    () => Item,
    item => item.product
  )
  items: Item[];

  @ManyToMany(() => Rental)
  rentals: Rental[];
}
