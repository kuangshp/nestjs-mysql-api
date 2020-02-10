export class UserRep {
  id: number;
  uuid: string;
  username: string;
  email?: string;
  mobile?: string;
  status?: number;
  platform?: number;
  role_id?: number;
  is_super?: number;
  createAt?: Date;
  updateAt?: Date;
  token?: string;
}