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
  ParseIntPipe
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { TransformAndValidate } from '../../common/pipes/validate'
import { GetLocationsDto, LocationDto, LocationListDto, UpdateLocationDto } from './location.dto';
import { LocationService } from './location.service'

@Controller('locations')
export class LocationController {
  constructor(
    private readonly locationService: LocationService
  ) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(TransformAndValidate)
  async getLocations(@Query() request: GetLocationsDto): Promise<LocationListDto> {
    return await this.locationService.list(request.skip || 0, request.take || 10);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(TransformAndValidate)
  async getLocation(@Param('id', ParseIntPipe) id: number): Promise<LocationDto> {
    const location = await this.locationService.get(id);
    return LocationDto.fromLocation(location);
  }

  @Post()
  @UsePipes(TransformAndValidate)
  async createLocation(@Body() body: LocationDto) {
    return this.locationService.create(body);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(TransformAndValidate)
  async updateLocation(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateLocationDto): Promise<void> {
    await this.locationService.update(id, body);
  }
}
