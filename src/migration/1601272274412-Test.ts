import {MigrationInterface, QueryRunner} from "typeorm";

export class Test1601272274412 implements MigrationInterface {
    name = 'Test1601272274412'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `role` (`id` int NOT NULL AUTO_INCREMENT COMMENT '主键id', `is_del` tinyint NOT NULL COMMENT '是否删除,1表示删除,0表示正常' DEFAULT 0, `created_at` timestamp(6) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP(6), `title` varchar(50) NOT NULL COMMENT '角色名称', `description` varchar(100) NULL COMMENT '角色描素', PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `access` (`id` int NOT NULL AUTO_INCREMENT COMMENT '主键id', `is_del` tinyint NOT NULL COMMENT '是否删除,1表示删除,0表示正常' DEFAULT 0, `created_at` timestamp(6) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP(6), `module_name` varchar(50) NULL COMMENT '模块名称', `action_name` varchar(100) NULL COMMENT '操作名称', `icon` varchar(100) NULL COMMENT '小图标', `url` varchar(100) NULL COMMENT 'url地址', `module_id` int NOT NULL COMMENT '父模块id' DEFAULT -1, `sort` int NOT NULL COMMENT '排序' DEFAULT 1, `description` varchar(100) NULL COMMENT '描素', PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `role_access` (`id` int NOT NULL AUTO_INCREMENT COMMENT '主键id', `is_del` tinyint NOT NULL COMMENT '是否删除,1表示删除,0表示正常' DEFAULT 0, `created_at` timestamp(6) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP(6), `role_id` int NULL COMMENT '角色id', `access_id` int NULL COMMENT '资源id', PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `dict` (`id` int NOT NULL AUTO_INCREMENT COMMENT '主键id', `is_del` tinyint NOT NULL COMMENT '是否删除,1表示删除,0表示正常' DEFAULT 0, `created_at` timestamp(6) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP(6), `label` varchar(50) NOT NULL COMMENT 'label值', `category` varchar(50) NOT NULL COMMENT '分类名称', `description` varchar(100) NULL COMMENT '描素', PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `account` (`id` int NOT NULL AUTO_INCREMENT COMMENT '主键id', `is_del` tinyint NOT NULL COMMENT '是否删除,1表示删除,0表示正常' DEFAULT 0, `created_at` timestamp(6) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP(6), `username` varchar(50) NOT NULL COMMENT '用户名', `password` varchar(100) NOT NULL COMMENT '密码', `platform` int NULL COMMENT '平台', `is_super` tinyint NOT NULL COMMENT '是否为超级管理员1表示是,0表示不是' DEFAULT 0, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `account_role` (`id` int NOT NULL AUTO_INCREMENT COMMENT '主键id', `is_del` tinyint NOT NULL COMMENT '是否删除,1表示删除,0表示正常' DEFAULT 0, `created_at` timestamp(6) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP(6), `account_id` int NOT NULL COMMENT '用户id', `role_id` int NOT NULL COMMENT '角色id', PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE `account_role`", undefined);
        await queryRunner.query("DROP TABLE `account`", undefined);
        await queryRunner.query("DROP TABLE `dict`", undefined);
        await queryRunner.query("DROP TABLE `role_access`", undefined);
        await queryRunner.query("DROP TABLE `access`", undefined);
        await queryRunner.query("DROP TABLE `role`", undefined);
    }

}
