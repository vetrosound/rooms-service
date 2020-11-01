import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Room } from './dto/room.dto';
import { RoomDao } from './dao/room.dao';
import { RoomsRepository } from './rooms.repository.mongo';

@Injectable()
export class RoomsService {
  private roomNameRegex;

  constructor(private log: Logger, private roomsRepository: RoomsRepository) {
    this.log.setContext(RoomsService.name);
    this.roomNameRegex = /^[a-zA-Z0-9-_]{8,50}$/;
  }

  findRoom(name: string): Observable<Room> {
    this.log.debug(`Getting room for name: ${name}`);
    this.validateName(name);
    return this.roomsRepository
      .findOne(name)
      .pipe(map(result => this.daoToDto(result)));
  }

  createRoom(room: Room): Observable<Room> {
    this.log.debug(`Creating room: ${JSON.stringify(room)}`);
    this.validateName(room.name);
    const toCreate = this.dtoToDao(room);
    return this.roomsRepository
      .create(toCreate)
      .pipe(map(result => this.daoToDto(result)));
  }

  updateRoom(room: Room): Observable<number> {
    this.log.debug(`Updating room: ${JSON.stringify(room)}`);
    this.validateName(room.name);
    const toUpdate = this.dtoToDao(room);
    return this.roomsRepository.update(toUpdate);
  }

  deleteRoom(name: string): Observable<number> {
    this.log.debug(`Deleting room with name: ${name}`);
    this.validateName(name);
    return this.roomsRepository.delete(name);
  }

  private daoToDto(entity: RoomDao): Room {
    return {
      name: entity._id,
      owner: entity.owner,
      type: entity.type,
      created: entity.created,
      managers: entity.managers,
      lastUpdated: entity.lastUpdated,
      isActive: entity.isActive,
    };
  }

  private dtoToDao(room: Room): RoomDao {
    return {
      _id: room.name,
      owner: room.owner,
      type: room.type,
      created: room.created,
      managers: room.managers || [],
      lastUpdated: room.lastUpdated,
      isActive: room.isActive,
    };
  }

  private validateName(name: string): void {
    if (!name || typeof name !== 'string' || !name.match(this.roomNameRegex)) {
      throw new BadRequestException(`Invalid name: ${name}`);
    }
  }
}
