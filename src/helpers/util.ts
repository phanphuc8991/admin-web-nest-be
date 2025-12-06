import * as bcrypt from 'bcrypt';
const saltRounds = 10;
import aqp from 'api-query-params';

interface ParseQueryParams {
  limit: number;
  skip: number;
  filter: Record<string, any>;
  sort: Record<string, any>;
};

export const hashPasswordHelper = async (
  plainPassword: string,
): Promise<string> => {
  try {
    return bcrypt.hash(plainPassword, saltRounds);
  } catch (error) {
    console.log(error);
  }
};

export const parseQueryParams = (rawQuery: any): ParseQueryParams => {
  const formatQuery = aqp(rawQuery);
  const { filter, sort } = formatQuery;
  const { page, pageSize, ...restFilter } = filter;
  const skip = (page - 1) * pageSize;
  return {
    limit: pageSize,
    skip,
    filter: restFilter,
    sort,
  };
};
