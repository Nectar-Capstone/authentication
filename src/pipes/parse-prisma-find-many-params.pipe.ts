/* eslint-disable prefer-const */
import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { isNumberString } from 'class-validator';
import { PrismaFindManyDto } from 'src/globalDtos/prisma-find-many.dto';

@Injectable()
export class ParsePrismaFindManyParamsPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata): Promise<any | PrismaFindManyDto> {
    if (metadata.type !== 'query') return value;

    let { page, skip, take, sort_by } = value;
    if (skip == undefined) {
      skip = 0;
    }

    value.where = await this.transformFilters(value);

    if (sort_by) {
      const sort = await this.transformSort(sort_by);
      value.orderBy = sort;
    }

    value.skip = !page || page === 1 ? skip : skip + take * (page - 1);
    delete value.page;
    delete value.sort_by;
    return value;
  }

  async transformSort(sort_by: string) {
    const query = sort_by.split('.');
    let orderBy = {};
    orderBy[query[0]] = query[1];
    return orderBy;
  }

  async transformFilters(value: any) {
    let where = {};
    let mainParams = ['page', 'skip', 'take', 'sort_by', 'filter'];
    for (let [key, values] of Object.entries(value)) {
      if (!mainParams.includes(key)) {
        where[key] = isNumberString(values) ? Number(values) : values;
        if (key == 'name' || key == 'description') {
          where[key] = { startsWith: values.toString() };
        }
        delete value[key];
      }
      if (key == 'filter') {
        for (let [filterName, filterValue] of Object.entries(values)) {
          let splittedOptions = filterName.split(':');
          if (splittedOptions.length == 3) {
            filterValue = eval(filterValue);
            let [name, keyName, operand] = splittedOptions;
            where[name] = { some: { [keyName]: { [operand]: filterValue } } };
          } else if (splittedOptions.length == 2) {
            let searchValue;
            try {
              searchValue = eval(filterValue);
            } catch {
              searchValue = filterValue;
            }
            let [name, keyName] = splittedOptions;
            where[name] = { [keyName]: searchValue };
          }
        }
        delete value[key];
      }
    }
    return where;
  }
}
