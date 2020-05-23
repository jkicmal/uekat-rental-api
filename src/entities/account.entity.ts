import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BeforeInsert, getConnection } from 'typeorm';
import {
  Length,
  validate,
  ValidationArguments,
  IsEmail,
  IsEnum,
  IsAlpha,
  MinLength,
  IsPhoneNumber
} from 'class-validator';
import bcrypt from 'bcrypt';
import Container from 'typedi';
import { Rental, Item } from '.';
import { AccountType } from '../common/enums';
import { ConfigToken, JWTToken } from '../common/tokens';

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsAlpha('pl-PL', { message: 'First name should contain only characters' })
  @Length(2, 30, {
    message: (args: ValidationArguments) =>
      `First name length should be between ${args.constraints[0]} and ${args.constraints[1]} characters long`
  })
  firstName: string;

  @Column()
  @IsAlpha('pl-PL', { message: 'Last name should contain only characters' })
  @Length(2, 30, {
    message: (args: ValidationArguments) =>
      `Last name length should be between ${args.constraints[0]} and ${args.constraints[1]} characters long`
  })
  lastName: string;

  @Column({ unique: true })
  @IsEmail(undefined, {
    message: (args: ValidationArguments) => `${args.value} is not valid email`
  })
  email: string;

  @Column({ type: 'bool', default: true })
  receiveEmails: boolean;

  /**
   * NOTE:
   * Account is of type CUSTOMER by default
   * so we assume that every new user is a customer
   */
  @Column({ default: AccountType.CUSTOMER })
  @IsEnum(AccountType)
  type: AccountType = AccountType.CUSTOMER;

  @Column({ nullable: true })
  addressLine1: string;

  @Column({ nullable: true })
  addressLine2: string;

  @Column()
  @Column({ nullable: true })
  city: string;

  @Column()
  @Column({ nullable: true })
  state: string;

  @Column()
  @Column({ nullable: true })
  postalCode: string;

  @Column()
  @Column({ nullable: true })
  country: string;

  @Column()
  @IsPhoneNumber('PL', {
    message: `Given phone number is not from Poland`
  })
  phoneNumber: string;

  @Column()
  @MinLength(8, {
    message: (args: ValidationArguments) =>
      `Password should be at least ${args.constraints[0]} characters long`
  })
  password: string;

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
    rental => rental.finalizedBy
  )
  finalizedRentals: Rental[];

  @OneToMany(
    () => Rental,
    rental => rental.cancelledBy
  )
  cancelledRentals: Rental[];

  @OneToMany(
    () => Rental,
    rental => rental.rejectedBy
  )
  rejectedRentals: Rental[];

  @OneToMany(
    () => Rental,
    rental => rental.acceptedBy
  )
  acceptedRentals: Rental[];

  @OneToMany(
    () => Item,
    item => item.owner
  )
  ownedItems: Item[];

  /**
   * Listeners
   */
  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  @BeforeInsert()
  async validate() {
    validate(this);
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
    this.token = jwt.sign({ data: { accountType: this.type } }, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn
    });
  }

  async hasRented(rental: Rental) {
    const rented = await getConnection()
      .getRepository(Rental)
      .findOne(rental.id, { relations: ['requestedBy'] });
    return rented && rented.requestedBy.id === this.id;
  }
}
