export class RoomDao {
  _id: string;
  owner: string;
  type: string;
  created: Date;
  managers: Array<string>;
  lastUpdated: Date;
  isActive: boolean;
}
