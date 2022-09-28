-- ----------------
-- 创建账号表
-- ----------------
DROP TABLE IF EXISTS `account`;
CREATE TABLE `account` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY key COMMENT '主键id',
  `username` varchar(50)  NOT NULL COMMENT '用户名',
  `password` varchar(100) NOT NULL COMMENT '密码',
  `mobile` varchar(11) DEFAULT NULL COMMENT '手机号码',
  `email` varchar(50)  DEFAULT NULL COMMENT '邮箱',
  `status` tinyint DEFAULT '1' COMMENT '状态,0表示禁止,1表示正常',
  `is_super` tinyint NOT NULL DEFAULT '0' COMMENT '是否为超级管理员1表示是,0表示不是',
	`created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `deleted_at` timestamp(6) NULL DEFAULT NULL COMMENT '软删除时间',
	UNIQUE KEY `username_mobile_email_unique` (`username`,`mobile`,`email`),
	INDEX idx_username (`username`),
	index idx_mobile (`mobile`),
	index idx_email (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_bin COMMENT '账号表';


-- ----------------
-- 登录历史表
-- ----------------
DROP TABLE IF EXISTS `login_history`;
CREATE TABLE `login_history` (
  `id`  int(11) NOT NULL AUTO_INCREMENT PRIMARY key COMMENT '主键id',
	`account_id` int(11) not null COMMENT '关联到账号表的id',
	`login_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最后登录时间',
  `login_ip` varchar(50) DEFAULT NULL COMMENT '最后登录ip地址',
  `nation` varchar(100) DEFAULT NULL COMMENT '国家',
  `province` varchar(100) DEFAULT NULL COMMENT '省份',
  `city` varchar(100) DEFAULT NULL COMMENT '城市',
  `district` varchar(100) DEFAULT NULL COMMENT '地区',
  `adcode` varchar(100) DEFAULT NULL COMMENT '行政区划代码',
	`created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `deleted_at` timestamp(6) NULL DEFAULT NULL COMMENT '软删除时间'
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_bin  COMMENT '登录历史表';

-- ----------------
-- 角色表
-- ----------------
DROP TABLE IF EXISTS `role`;
CREATE TABLE `role` (
  `id`  int(11) NOT NULL AUTO_INCREMENT PRIMARY key COMMENT '主键id',
  `name` varchar(50) UNIQUE NOT NULL COMMENT '角色名称',
  `description` varchar(100)  DEFAULT NULL COMMENT '角色描素',
  `status` tinyint DEFAULT '1' COMMENT '状态1表示正常,0表示不正常',
  `is_default` tinyint DEFAULT '0' COMMENT '针对后期提供注册用,1表示默认角色,0表示非默认角色',
	`created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `deleted_at` timestamp(6) NULL DEFAULT NULL COMMENT '软删除时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_bin  COMMENT '角色表';

-- ----------------
-- 资源表
-- ----------------
DROP TABLE IF EXISTS `resource`;
CREATE TABLE `resource` (
  `id`  int(11) NOT NULL AUTO_INCREMENT PRIMARY key COMMENT '主键id',
  `module_name` varchar(50) DEFAULT NULL COMMENT '模块名称',
  `type` tinyint DEFAULT NULL COMMENT '类型,1:表示模块,2:表示接口(API)',
  `action_name` varchar(100)  DEFAULT NULL COMMENT '操作名称',
  `api_name` varchar(100)  DEFAULT NULL COMMENT '接口名称',
  `url` varchar(100)  DEFAULT NULL COMMENT 'url地址',
  `method` varchar(10) DEFAULT NULL COMMENT '请求方式',
  `status` tinyint DEFAULT '1' COMMENT '状态,0表示禁止,1表示正常',
  `description` varchar(100) COLLATE utf8mb4_0900_bin DEFAULT NULL COMMENT '描素',
	`created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `deleted_at` timestamp(6) NULL DEFAULT NULL COMMENT '软删除时间'
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_bin   COMMENT '资源表';


-- ----------------
-- 菜单表
-- ----------------
DROP TABLE IF EXISTS `menus`;
CREATE TABLE `menus` (
  `id`  int(11) NOT NULL AUTO_INCREMENT PRIMARY key COMMENT '主键id',
	`name` varchar(50) not null COMMENT '菜单名称',
	`icon` varchar(100) DEFAULT NULL COMMENT '小图标',
  `url` varchar(100)  DEFAULT NULL COMMENT 'url地址',
  `is_link` tinyint(4) DEFAULT 1 COMMENT '是否为外部连接,0表示是,1表示不是',
  `parent_id` int NOT NULL DEFAULT 0 COMMENT '父菜单id',
  `sort` int NOT NULL DEFAULT 1 COMMENT '排序',
	`created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `deleted_at` timestamp(6) NULL DEFAULT NULL COMMENT '软删除时间'
)ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_bin   COMMENT '菜单表';

-- ----------
-- 账号token表
-- -----------
DROP TABLE IF EXISTS `account_token`;
CREATE TABLE `account_token` (
  `id`  int(11) NOT NULL AUTO_INCREMENT PRIMARY key COMMENT '主键id',
  `account_id` int(11) UNIQUE NOT NULL COMMENT '关联账号表的Id',
  `token` varchar(100) UNIQUE NOT NULL COMMENT 'token',
  `expire_time` timestamp NOT NULL COMMENT '失效时间',
	`created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `deleted_at` timestamp(6) NULL DEFAULT NULL COMMENT '软删除时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_bin   COMMENT '账号token表';