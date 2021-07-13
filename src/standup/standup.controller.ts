import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiHeader, ApiQuery, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Author, AuthorObject } from '../auth/author-headers';
import { TokenGuard } from '../auth/token.strategy';
import { BaseController } from '../commons/base.controller';
import { StandupDTO } from './dto/standup.dto';
import { StandupService } from './standup.service';
@ApiTags('Standup')
@Controller('standup')
export class StandupController extends BaseController {
  constructor(private readonly standupService: StandupService) {
    super(standupService);
  }

  updateConfig<T>(body: T) {
    throw new Error('Method not implemented.');
  }
  async getConfig() {
    return await this.standupService.createConfig({ Baui: 'test' });
  }

  @Post()
  @UseGuards(TokenGuard)
  @ApiSecurity('token')
  async createStandup(@Body() body: StandupDTO) {
    return this.standupService.create(body);
  }

  @Get()
  findAllStandups() {
    return this.standupService.findAll();
  }

  @Get('search')
  @ApiQuery({ name: 'uid', type: 'string' })
  search(@Query('uid') uid: string) {
    return this.standupService.search(uid);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.standupService.findById(id);
  }

  @Delete(':id')
  @UseGuards(TokenGuard)
  @ApiSecurity('token')
  @HttpCode(204)
  @ApiHeader({ name: 'User-Uid', required: true })
  @ApiHeader({ name: 'Platform', required: true })
  deleteStandup(@Param('id') id: string, @AuthorObject() author: Author) {
    return this.standupService.deleteStandup(id, author);
  }
}
