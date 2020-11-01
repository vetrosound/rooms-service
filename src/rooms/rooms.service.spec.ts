import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { of } from 'rxjs';

import { RoomsService } from './rooms.service';
import { RoomsRepository } from './rooms.repository.mongo';
import { RoomDao } from './dao/room.dao';
import { Room } from './dto/room.dto';

describe('RoomsService', () => {
  let service: RoomsService;
  const roomDao: RoomDao = {
    _id: 'room-name',
    owner: 'room-owner',
    type: 'room-type',
    managers: [],
    created: new Date(),
    lastUpdated: new Date(),
    isActive: true,
  };
  const roomDto: Room = {
    name: roomDao._id,
    owner: roomDao.owner,
    type: roomDao.type,
    managers: roomDao.managers,
    created: roomDao.created,
    lastUpdated: roomDao.lastUpdated,
    isActive: roomDao.isActive,
  };
  const roomsRepoMock = {
    findOne: jest.fn(() => of(roomDao)),
    create: jest.fn(() => of(roomDao)),
    update: jest.fn(() => of(1)),
    delete: jest.fn(() => of(1)),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [RoomsService, Logger, RoomsRepository],
    })
      .overrideProvider(RoomsRepository)
      .useValue(roomsRepoMock)
      .compile();

    service = app.get<RoomsService>(RoomsService);
  });

  describe('findRoom', () => {
    it('should return room dto', async () => {
      const found = await service.findRoom(roomDto.name).toPromise();
      expect(found).toEqual(roomDto);
    });
  });

  describe('createRoom', () => {
    it('should return room dto', async () => {
      const created = await service.createRoom(roomDto).toPromise();
      expect(created).toEqual(roomDto);
    });
  });

  describe('updateRoom', () => {
    it('should return 1 as updated room count', async () => {
      const count = await service.updateRoom(roomDto).toPromise();
      expect(count).toEqual(1);
    });
  });

  describe('deleteRoom', () => {
    it('should return 1 as deleted room count', async () => {
      const count = await service.deleteRoom(roomDto.name).toPromise();
      expect(count).toEqual(1);
    });
  });
});
