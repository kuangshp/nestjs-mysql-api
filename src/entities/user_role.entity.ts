import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('user_role')
export class UserRoleEntity {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "id"
  })
  id: number;

  @Column("int", {
    nullable: true,
    name: "role_id"
  })
  roleId: number | null;


  @Column("int", {
    nullable: true,
    name: "user_id"
  })
  userId: number | null;

  @Column("timestamp", {
    nullable: false,
    default: () => "CURRENT_TIMESTAMP",
    name: "created_at"
  })
  createdAt: Date;


  @Column("timestamp", {
    nullable: false,
    default: () => "CURRENT_TIMESTAMP",
    name: "updated_at"
  })
  updatedAt: Date;
}
