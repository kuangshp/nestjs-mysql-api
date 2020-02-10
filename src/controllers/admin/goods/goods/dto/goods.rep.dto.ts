export class GoodsRep {
  id: number;
  uuid: string;
  title: string;
  subTitle: string;
  goodsImg: string;
  shopPrice: number;
  marketPrice?: number;
  count?: number;
  mostNum?: number;
  sort?: number;
  isDelete?: string;
  isBest?: string;
  isHot?: string;
  isNew?: string;
  content?: string;
  status?: number;
  categoryId: number;
  createdAt?: Date;
  updatedAt?: Date;
}