import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Unique,
  BeforeInsert,
  ManyToMany,
  JoinTable
} from 'typeorm';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { IsEmail, IsAlpha, Length, IsEnum, IsString, IsMobilePhone, IsNumberString } from 'class-validator';
import { Rental } from './rental.entity';
import { AccountType } from '../enums';
import { Role } from './role.entity';

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Length(2, 20)
  @IsAlpha('pl-PL')
  firstName: string;

  @Column()
  @Length(2, 20)
  @IsAlpha('pl-PL')
  lastName: string;

  @Column()
  // TODO: Uncomment this after testing
  // @Unique(['email'])
  @IsEmail()
  email: string;

  @Column()
  @IsEnum(AccountType)
  type: AccountType;

  @Column()
  @Length(0, 40)
  addressLine1: string;

  @Column()
  @Length(0, 40)
  addressLine2: string;

  @Column()
  @IsString()
  city: string;

  @Column()
  @IsString()
  state: string;

  @Column()
  @IsString()
  postalCode: string;

  @Column()
  @IsString()
  country: string;

  @Column()
  @IsMobilePhone('pl-PL')
  phone: string;

  @Column()
  @IsNumberString()
  bankAccount: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  avatar: number;

  @Column({ nullable: true })
  token: string;

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
    this.token = jwt.sign({ data: 'data' }, 'secret', {
      expiresIn: '30 seconds'
    });
  }
}
