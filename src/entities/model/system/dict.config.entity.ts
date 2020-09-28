import { Entity, Column } from 'typeorm';
import { PublicEntity } from '../public.entity';

@Entity('dict')
export class DictConfigEntry extends PublicEntity {
  id: number;

  @Column('varchar', {
    nullable: false,
    length: 50,
    name: 'label',
    comment: 'label值'
  })
  label: string;


  @Column('varchar', {
    nullable: false,
    length: 50,
    name: 'category',
    comment: '分类名称'
  })
  category: string;

  @Column('varchar', {
    nullable: true,
    length: 100,
    name: 'description',
    comment: '描素'
  })
  description: string | null;

}