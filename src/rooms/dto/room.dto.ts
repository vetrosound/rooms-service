import { IsNotEmpty } from 'class-validator';

export class Room {
  @IsNotEmpty({ groups: ['create'] })
  name: string;

  @IsNotEmpty({ groups: ['create'] })
  owner: string;

  type: string;

  created: Date;

  managers: Array<string>;

  lastUpdated: Date;

  isActive: boolean;
}
