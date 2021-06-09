import { IsInt, IsOptional, IsEmail, IsString, IsBoolean, IsIn } from 'class-validator';
import { Transform } from 'class-transformer';
import { Location } from './location.entity';
import * as _ from 'lodash';

export class LocationListDto {
  readonly results: LocationListItemDto[];
  readonly total: number;
}

export class LocationListItemDto {
  readonly id: number;
  readonly name: string;
  readonly inGameLocation: string;
  readonly owner: string;
  readonly description: string;
  readonly externalLink: string;
  readonly tags: string;
  readonly server: string;
  readonly datacenter: string;
}

export class LocationDto {
  readonly id: number;
  readonly name: string;
  readonly inGameLocation: string;
  readonly owner: string;
  readonly description: string;
  readonly externalLink: string;
  readonly tags: string;
  readonly server: string;
  readonly datacenter: string;

  static fromLocation({
    id,
    name,
    inGameLocation,
    owner,
    description,
    externalLink,
    tags,
    server,
    datacenter,
  }: Location): LocationDto {
    return {
      id,
      name,
      inGameLocation,
      owner,
      description,
      externalLink,
      tags,
      server,
      datacenter,
    };
  }
}

export class GetLocationsDto {
  @IsOptional()
  @IsInt()
  @Transform(value => Number(value))
  readonly skip?: number

  @IsOptional()
  @IsInt()
  @Transform(value => Number(value))
  readonly take?: number

  @IsOptional()
  @IsString()
  readonly orderBy?: string

  @IsOptional()
  @IsString()
  @IsIn(['ASC', 'DESC'])
  readonly orderByDirection?: 'ASC' | 'DESC'
}

export class CreateLocationDto {
  @IsString()
  readonly name: string

  @IsString()
  readonly inGameLocation: string

  @IsString()
  readonly server: string

  @IsString()
  readonly datacenter: string

  @IsOptional()
  @IsString()
  readonly owner?: string | null

  @IsOptional()
  @IsString()
  readonly description?: string | null

  @IsOptional()
  @IsString()
  readonly externalLink?: string | null

  @IsOptional()
  @IsString()
  readonly tags: string | null
}

export class UpdateLocationDto {
  @IsString()
  readonly name: string

  @IsString()
  readonly inGameLocation: string

  @IsString()
  readonly server: string

  @IsString()
  readonly datacenter: string

  @IsOptional()
  @IsString()
  readonly owner?: string | null

  @IsOptional()
  @IsString()
  readonly description?: string | null

  @IsOptional()
  @IsString()
  readonly externalLink?: string | null

  @IsOptional()
  @IsString()
  readonly tags: string | null
}

export class DeleteLocationDto {
  @IsInt()
  @Transform(value => Number(value))
  readonly id: number
}
