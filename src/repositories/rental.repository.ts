import { Service } from 'typedi';
import { Repository, EntityRepository } from 'typeorm';
import { Rental } from '../entities';

@Service()
@EntityRepository(Rental)
export class RentalRepository extends Repository<Rental> {}
