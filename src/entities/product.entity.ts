import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from './category.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @Column()
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
}
