import { IsInt, IsOptional, Min, IsString } from 'class-validator';
import { Type } from 'class-transformer';
export class QueryUserDto {
  // Pagination
  @Type(() => Number)
  @IsOptional()
  @IsInt({message: 'page must be a positive integer greater than or equal to 1.'})
  @Min(1,{message: 'page must be a positive integer greater than or equal to 1.'})
  page?: number = 1;

  @Type(() => Number)
  @IsOptional()
  @IsInt({message: 'page size must be a positive integer greater than or equal to 1.'})
  @Min(1,{message: 'page size must be a positive integer greater than or equal to 1.'})
  pageSize?: number = 1;

 
  // filter
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsString()
  email?: string



  // sort 
 @IsOptional()
  @IsString()
  sortBy?: 'name' | 'email' | 'age'


  @IsOptional()
  @IsString()
  order?: 'asc' | 'desc' = 'asc';

  @IsOptional()
  @IsString()
 sort: string

}
