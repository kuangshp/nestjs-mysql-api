
-- ----------------------------
-- 商户表
-- ----------------------------
DROP TABLE IF EXISTS `tenant`;
CREATE TABLE `tenant` (   
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY key COMMENT '主键id',
   `name` varchar(50) NOT NULL COMMENT '商户名称',
   `username` varchar(50)  DEFAULT NULL COMMENT '商户联系人',
   `mobile` varchar(50) DEFAULT NULL COMMENT '手机号码',
   `balance` decimal(10, 2) default '0.00' COMMENT '余额',
   `expire_time`datetime not null comment '过期时间',
   `status` tinyint(4) DEFAULT 0 COMMENT '状态,0表示正常,1表示禁止',
   `province_id` int(11) DEFAULT null comment '省份id',
   `city_id` int(11) DEFAULT null comment '市id',
   `area_id` int(11) DEFAULT null comment '地区id',
   `address` varchar(200) DEFAULT null comment '具体地址',
   `sort` int(11) DEFAULT 1 COMMENT '排序',
   `description` varchar(255)  DEFAULT NULL COMMENT '描述',
   `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
   `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
   `deleted_at` timestamp NULL DEFAULT NULL COMMENT '软删除时间',
   UNIQUE KEY `UK_name_deleted_at` (`name`,`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商户表';

-- ----------------------------
-- 角色表(也可以当部门表)
-- ----------------------------
DROP TABLE IF EXISTS `role`;
CREATE TABLE `role` (
   `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY key COMMENT '主键id',
   `name` varchar(50) UNIQUE NOT NULL COMMENT '角色名称',
   `description` varchar(255)  DEFAULT NULL COMMENT '描述',
   `status` tinyint(4) DEFAULT 0 COMMENT '状态0是正常,1是禁用',
   `sort` int(11) DEFAULT 1 COMMENT '排序',
   `tenant_id`  int(11) default -1 COMMENT '关联到tenant表主键id',
   `account_id` int(11) default -1 COMMENT '关联account表主键id',
   `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
   `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
   `deleted_at` timestamp NULL DEFAULT NULL COMMENT '软删除时间',
   UNIQUE KEY `UK_name_deleted_at` (`name`,`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色表(也可以当部门表)';


-- ----------------------------
-- 商户下账号表
-- ----------------------------
DROP TABLE IF EXISTS `account`;
CREATE TABLE `account` (
   `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY key COMMENT '主键id',
   `username` varchar(50)  DEFAULT NULL COMMENT '账号',
   `password` varchar(100) NOT null COMMENT '密码',
   `account_type` tinyint(4) DEFAULT 0 COMMENT '账号类型:0普通账号,1是主账号,2是超管',
   `tenant_id` int(11)  NOT NULL COMMENT '关联到tenant表主键id',
   `parent_id` int(11) default "-1" COMMENT '自关联主键id',
   `sort` int(11) DEFAULT 1 COMMENT '排序',
   `status` tinyint(4) DEFAULT 0 COMMENT '状态0是正常,1是禁用',
   `last_login_ip` varchar(30) COMMENT '最后登录ip地址',
   `last_login_nation` varchar(100) COMMENT '最后登录国家',
   `last_login_province` varchar(100) COMMENT '最后登录省份',
   `last_login_city` varchar(100) COMMENT '最后登录城市',
   `last_login_district` varchar(100) COMMENT '最后登录地区',
   `last_login_adcode` varchar(100) COMMENT '最后登录行政区划代码',
   `last_login_date` timestamp(6) COMMENT '最后登录时间',
   `salt` varchar(30) COMMENT '密码盐',
   `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
   `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
   `deleted_at` timestamp NULL DEFAULT NULL COMMENT '软删除时间',
   UNIQUE KEY `UK_username_deleted_at` (`username`,`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商户下账号表';

-- ----------------------------
-- 账号和角色中间表
-- ----------------------------
DROP TABLE IF EXISTS `account_role`;
CREATE TABLE `account_role`  (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY key COMMENT '主键id',
  `account_id` int(11) NOT NULL COMMENT '关联到account表主键id',
  `role_id` int(11) NOT NULL COMMENT '关联到role表主键id',
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `deleted_at` timestamp(6) NULL DEFAULT NULL COMMENT '软删除时间',
  UNIQUE INDEX `UK_account_role`(`account_id`, `role_id`) 
) ENGINE = InnoDB  DEFAULT CHARSET=utf8mb4 COMMENT = '账号和角色中间表';

-- ----------------------------
-- 资源表
-- ----------------------------
DROP TABLE IF EXISTS `resources`;
CREATE TABLE `resources`  (
   `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY key COMMENT '主键id',
  `title` varchar(50)  NOT NULL COMMENT '按钮标题,或菜单标题',
  `url` varchar(100) NOT NULL COMMENT '按钮请求url,或菜单路由',
  `icon` varchar(100) DEFAULT NULL COMMENT '菜单小图标',
  `type` tinyint(4) NULL DEFAULT 0 COMMENT '是否为模块:0,菜单:1,按钮(接口):2',
  `parent_id` int(11) NOT NULL DEFAULT -1 COMMENT '上一级id',
  `sort` int(11) DEFAULT 1 COMMENT '菜单,或按钮排序',
  `status` tinyint(4) DEFAULT 0 COMMENT '状态0是正常,1是禁用',
  `description` varchar(200)  DEFAULT NULL COMMENT '描述',
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `deleted_at` timestamp(6) NULL DEFAULT NULL COMMENT '软删除时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT = '资源表' ;

-- ----------------------------
-- 角色和资源中间表
-- ----------------------------
DROP TABLE IF EXISTS `role_resources`;
CREATE TABLE `role_resources`  (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY key COMMENT '主键id',
  `resources_id` int(11) NOT NULL COMMENT '关联到resources表主键id',
  `role_id` int(11) NOT NULL COMMENT '关联到role表主键id',
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `deleted_at` timestamp(6) NULL DEFAULT NULL COMMENT '软删除时间',
  UNIQUE INDEX `UK_resources_role`(`resources_id`, `role_id`) 
) ENGINE = InnoDB  DEFAULT CHARSET=utf8mb4 COMMENT = '角色和资源中间表';


-- ----------------------------
-- 商户金额记录表
-- ----------------------------
DROP TABLE IF EXISTS `tenant_balance_record`;
CREATE TABLE `tenant_balance_record` (   
   `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY key COMMENT '主键id',
   `tenant_id` int(11) NOT NULL COMMENT '关联到tenant表主键id',
   `account_id` int(11) NOT NULL COMMENT '关联到表account_id',
   `balance` decimal(10, 2) NOT NULL DEFAULT '0.00' COMMENT '余额',
   `type` tinyint(4)  not null DEFAULT 0 COMMENT '交易类型,0表示消费,1表示充值',
   `remark` varchar(100) DEFAULT NULL comment '备注',
   `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `deleted_at` timestamp(6) NULL DEFAULT NULL COMMENT '软删除时间'
)ENGINE = InnoDB  DEFAULT CHARSET=utf8mb4 COMMENT = '商户金额记录表';


-- ----------------------------
-- 后台管理员登陆记录表
-- ----------------------------
DROP TABLE IF EXISTS `account_login_record`;
CREATE TABLE `account_login_record` (   
   `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY key COMMENT '主键id',
   `tenant_id` int(11) NOT NULL COMMENT '关联到tenant表主键id',
   `account_id`int(11) NOT NULL COMMENT '关联到表account_id',
   `ip` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT 'ip地址',
   `device` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '设备',
   `os` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '系统',
   `mobile` tinyint NULL DEFAULT NULL COMMENT '是否为移动端1是，0不是',
   `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `deleted_at` timestamp(6) NULL DEFAULT NULL COMMENT '软删除时间'
)ENGINE = InnoDB  DEFAULT CHARSET=utf8mb4 COMMENT = '后台管理员登陆记录表';