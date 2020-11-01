import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { of } from 'rxjs';

import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { Room } from './dto/room.dto';

describe('RoomsController', () => {
  let controller: RoomsController;
  const roomDto: Room = {
    name: 'room-name',
    owner: 'room-owner',
    type: 'room-type',
    managers: [],
    created: new Date(),
    lastUpdated: new Date(),
    isActive: true,
  };
  const roomsServiceMock = {
    findRoom: jest.fn(() => of(roomDto)),
    createRoom: jest.fn(() => of(roomDto)),
    updateRoom: jest.fn(() => of(1)),
    deleteRoom: jest.fn(() => of(1)),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [RoomsController],
      providers: [RoomsService, Logger],
    })
      .overrideProvider(RoomsService)
      .useValue(roomsServiceMock)
      .compile();

    controller = app.get<RoomsController>(RoomsController);
  });

  describe('findRoom', () => {
    it('should return room', async () => {
      const found = await controller.findRoom(roomDto.name).toPromise();
      expect(found).toEqual(roomDto);
    });
  });

  describe('createRoom', () => {
    it('should return room', async () => {
      const created = await controller.createRoom(roomDto).toPromise();
      expect(created).toEqual(roomDto);
    });
  });

  describe('updateRoom', () => {
    it('should return 1 as count', async () => {
      const count = await controller.updateRoom(roomDto).toPromise();
      expect(count).toEqual(1);
    });
  });

  describe('deleteRoom', () => {
    it('should return 1 as count', async () => {
      const count = await controller.deleteRoom(roomDto.name).toPromise();
      expect(count).toEqual(1);
    });
  });
});
