import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BeforeInsert, ManyToMany, JoinTable } from 'typeorm';
import bcrypt from 'bcrypt';
import Container from 'typedi';
import { Rental } from './rental.entity';
import { AccountType } from '../enums';
import { Role } from './role.entity';
import { ConfigToken, JWTToken } from '../common/tokens';

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  type: AccountType;

  @Column()
  addressLine1: string;

  @Column()
  addressLine2: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  postalCode: string;

  @Column()
  country: string;

  @Column()
  phone: string;

  @Column()
  bankAccount: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  avatar: number;

  @Column({ type: 'varchar', nullable: true })
  token: string | null;

  @Column({ default: true })
  tokenRefreshRequired: boolean;

  /**
   * Relations
   */
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

  @ManyToMany(
    () => Role,
    role => role.accounts
  )
  @JoinTable()
  roles: Role[];

  /**
   * Listeners
   */
  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  /**
   * Methods
   */
  validatePassword(password: string) {
    return bcrypt.compare(password, this.password);
  }

  generateToken() {
    const config = Container.get(ConfigToken);
    const jwt = Container.get(JWTToken);
    this.token = jwt.sign({ data: 'data' }, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn
    });
  }
}
