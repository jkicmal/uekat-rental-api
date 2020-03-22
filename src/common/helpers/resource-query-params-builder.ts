import { FindManyOptions } from 'typeorm';

export interface ResourceQueryPathParams {
  skip?: string;
  take?: string;
  relations?: string;
  order?: string;
}

export class ResourceQueryParams<Entity = any> implements FindManyOptions<Entity> {
  public skip?: number;
  public take?: number;
  public relations?: Array<string>;
  public order?: {
    [P in keyof Entity]?: 'ASC' | 'DESC' | 1 | -1;
  };
}

export class ResourceQueryParamsBuilder<T> {
  public resourceQueryParams: ResourceQueryParams<T>;

  constructor(public readonly resourceQueryPathParams: ResourceQueryPathParams) {
    this.resourceQueryParams = new ResourceQueryParams();
  }

  public applyPagination() {
    const { skip, take } = this.resourceQueryPathParams;
    if (skip && take) {
      this.resourceQueryParams.skip = Number(this.resourceQueryPathParams.skip);
      this.resourceQueryParams.take = Number(this.resourceQueryPathParams.take);
    }
    return this;
  }

  public applyRelations(allowedRelations?: Array<string>) {
    const { relations } = this.resourceQueryPathParams;
    if (relations) {
      let appliedRelations = JSON.parse(relations);

      if (allowedRelations)
        appliedRelations = appliedRelations.filter((relation: string) => allowedRelations.includes(relation));

      this.resourceQueryParams.relations = appliedRelations;
    }
    return this;
  }

  public applyOrder() {
    const { order } = this.resourceQueryPathParams;
    if (order) {
      this.resourceQueryParams.order = JSON.parse(order);
    }
    return this;
  }
}
