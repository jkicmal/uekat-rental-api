import { AbstractRepository, BaseEntity } from 'typeorm';

export abstract class Repository<T extends BaseEntity> extends AbstractRepository<T> {}
