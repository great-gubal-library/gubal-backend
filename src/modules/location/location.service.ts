import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLocationDto, UpdateLocationDto } from './location.dto';
import { Location } from './location.entity';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) { }

  async list(skip: number | undefined, take: number | undefined): Promise<{ results: Location[], total: number }> {
    const [results, total] = await this.locationRepository.findAndCount({ skip, take });
    return { results, total };
  }

  async get(id: number): Promise<Location | undefined> {
    return this.locationRepository.findOne({ where: { id } });
  }

  async create(parameters: CreateLocationDto): Promise<Location> {
    const location = Location.create(parameters);
    return this.locationRepository.save(location);
  }

  async update(id: number, parameters: UpdateLocationDto): Promise<Location> {
    const location = await this.locationRepository.findOneOrFail({ where: { id } });
    location.updateValues({ ...parameters });
    return this.locationRepository.save(location);
  }

  async delete(id: number) {
    const location = await this.get(id);

    if (!location)
      throw new Error(`Location id [${id}] is invalid`);

    await this.locationRepository.delete(id);
  }
}
