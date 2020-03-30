import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Category } from './category.entity';
import { Item } from './item.entity';

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
}
