import {
  Controller,
  Query,
  Body,
  Get,
  Post,
  Put,
  UsePipes,
  UseGuards,
  Param,
  ParseIntPipe,
  Delete
} from '@nestjs/common'
import { TransformAndValidate } from '../../common/pipes/validate'
import { CreateLocationDto, DeleteLocationDto, GetLocationsDto, LocationDto, LocationListDto, UpdateLocationDto } from './location.dto';
import { LocationService } from './location.service'

@Controller('locations')
export class LocationController {
  constructor(
    private readonly locationService: LocationService
  ) {}

  @Get()
  @UsePipes(TransformAndValidate)
  async getLocations(@Query() request: GetLocationsDto): Promise<LocationListDto> {
    return await this.locationService.list(request.skip || 0, request.take || 10);
  }

  @Get(':id')
  @UsePipes(TransformAndValidate)
  async getLocation(@Param('id', ParseIntPipe) id: number): Promise<LocationDto> {
    const location = await this.locationService.get(id);
    return LocationDto.fromLocation(location);
  }

  @Post()
  @UsePipes(TransformAndValidate)
  async createLocation(@Body() body: CreateLocationDto) {
    return this.locationService.create(body);
  }

  @Put(':id')
  @UsePipes(TransformAndValidate)
  async updateLocation(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateLocationDto): Promise<LocationDto> {
    return this.locationService.update(id, body);
  }

  @Delete(':id')
  @UsePipes(TransformAndValidate)
  async deleteLocation(@Param('id', ParseIntPipe) id: number) {
    await this.locationService.delete(id);
    return { id };
  }
}
