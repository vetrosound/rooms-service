import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  HttpCode,
  Param,
  Body,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Room } from './dto/room.dto';
import { RoomsService } from './rooms.service';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly rooms: RoomsService, private log: Logger) {
    this.log.setContext(RoomsController.name);
  }

  @Get('/:id')
  @HttpCode(200)
  findRoom(@Param('id') id: string): Observable<Room> {
    return this.rooms.findRoom(id);
  }

  @Post()
  @HttpCode(201)
  createRoom(
    @Body(
      new ValidationPipe({
        groups: ['create'],
      }),
    )
    room: Room,
  ): Observable<Room> {
    return this.rooms.createRoom(room);
  }

  @Put()
  @HttpCode(200)
  updateRoom(
    @Body(
      new ValidationPipe({
        groups: ['update'],
      }),
    )
    room: Room,
  ): Observable<number> {
    return this.rooms.updateRoom(room);
  }

  @Delete('/:id')
  @HttpCode(200)
  deleteRoom(@Param('id') id: string): Observable<number> {
    return this.rooms.deleteRoom(id);
  }
}
