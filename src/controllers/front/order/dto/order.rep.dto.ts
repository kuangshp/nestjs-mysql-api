export class OrderRep {
  id: number;
  personNum: string;
  tableId: string;
  goodsId: number;
  num: number;
  remark: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}