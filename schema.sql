-- PostgreSQL schema for the pet store miniapp backend

CREATE TYPE pet_species AS ENUM ('dog', 'cat', 'other');
COMMENT ON TYPE pet_species IS '宠物种类枚举：狗、猫或其他';

CREATE TYPE pet_gender AS ENUM ('male', 'female', 'unknown');
COMMENT ON TYPE pet_gender IS '宠物性别枚举：公、母或未知';

CREATE TYPE pet_height_class AS ENUM ('small', 'large');
COMMENT ON TYPE pet_height_class IS '宠物肩高分类：小型或大型';

CREATE TYPE pet_type AS ENUM ('dog', 'cat', 'spa', 'other');
COMMENT ON TYPE pet_type IS '服务适用宠物类型：狗、猫、SPA通用或其他';

CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'processing', 'completed', 'cancelled');
COMMENT ON TYPE order_status IS '订单状态枚举：待确认、已确认、服务中、已完成、已取消';

CREATE TYPE membership_status AS ENUM ('active', 'expired', 'cancelled');
COMMENT ON TYPE membership_status IS '会员资格状态枚举：有效、已过期或已取消';

CREATE TABLE membership_levels (
  id                  BIGSERIAL PRIMARY KEY,
  code                TEXT NOT NULL UNIQUE,
  name                TEXT NOT NULL,
  price_cents         INTEGER NOT NULL CHECK (price_cents >= 0),
  points_multiplier   NUMERIC(5, 2) NOT NULL DEFAULT 1.0,
  service_discount    NUMERIC(5, 2),
  product_discount    NUMERIC(5, 2),
  highlight           TEXT,
  description         TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE membership_levels IS '会员等级主数据表';
COMMENT ON COLUMN membership_levels.id IS '主键，自增ID';
COMMENT ON COLUMN membership_levels.code IS '会员等级唯一编码，用于业务标识';
COMMENT ON COLUMN membership_levels.name IS '会员等级名称';
COMMENT ON COLUMN membership_levels.price_cents IS '购买该会员等级所需金额（单位：分）';
COMMENT ON COLUMN membership_levels.points_multiplier IS '消费积分倍率，例如1.5表示积分翻倍1.5倍';
COMMENT ON COLUMN membership_levels.service_discount IS '通用服务折扣比例，NULL表示无统一折扣';
COMMENT ON COLUMN membership_levels.product_discount IS '商品折扣比例，NULL表示无统一折扣';
COMMENT ON COLUMN membership_levels.highlight IS '会员等级卖点短文案';
COMMENT ON COLUMN membership_levels.description IS '会员等级权益详细描述';
COMMENT ON COLUMN membership_levels.created_at IS '创建时间';
COMMENT ON COLUMN membership_levels.updated_at IS '最后更新时间';

CREATE TABLE membership_benefits (
  id                  BIGSERIAL PRIMARY KEY,
  membership_level_id BIGINT NOT NULL REFERENCES membership_levels (id) ON DELETE CASCADE,
  display_order       INTEGER NOT NULL DEFAULT 0,
  label               TEXT NOT NULL
);

COMMENT ON TABLE membership_benefits IS '会员等级对应的权益列表';
COMMENT ON COLUMN membership_benefits.id IS '主键，自增ID';
COMMENT ON COLUMN membership_benefits.membership_level_id IS '关联会员等级ID';
COMMENT ON COLUMN membership_benefits.display_order IS '展示顺序（数值越小越靠前）';
COMMENT ON COLUMN membership_benefits.label IS '权益描述文案';

CREATE TABLE users (
  id                          BIGSERIAL PRIMARY KEY,
  open_id                     VARCHAR(64) NOT NULL UNIQUE,
  union_id                    VARCHAR(64),
  phone                       VARCHAR(32),
  nickname                    VARCHAR(64),
  avatar_url                  TEXT,
  points_balance              INTEGER NOT NULL DEFAULT 0,
  current_membership_level_id BIGINT REFERENCES membership_levels (id),
  membership_expire_at        TIMESTAMPTZ,
  created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE users IS '小程序用户基础信息';
COMMENT ON COLUMN users.id IS '主键，自增ID';
COMMENT ON COLUMN users.open_id IS '微信OpenID，用户在小程序内的唯一标识';
COMMENT ON COLUMN users.union_id IS '微信UnionID，用于跨应用识别用户';
COMMENT ON COLUMN users.phone IS '用户绑定手机号';
COMMENT ON COLUMN users.nickname IS '用户昵称';
COMMENT ON COLUMN users.avatar_url IS '用户头像地址';
COMMENT ON COLUMN users.points_balance IS '当前积分余额';
COMMENT ON COLUMN users.current_membership_level_id IS '当前生效的会员等级ID';
COMMENT ON COLUMN users.membership_expire_at IS '当前会员等级到期时间';
COMMENT ON COLUMN users.created_at IS '创建时间';
COMMENT ON COLUMN users.updated_at IS '最后更新时间';

CREATE TABLE user_memberships (
  id                  BIGSERIAL PRIMARY KEY,
  user_id             BIGINT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  membership_level_id BIGINT NOT NULL REFERENCES membership_levels (id),
  status              membership_status NOT NULL DEFAULT 'active',
  purchased_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  started_at          TIMESTAMPTZ NOT NULL,
  expires_at          TIMESTAMPTZ,
  benefits_snapshot   JSONB,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE user_memberships IS '用户购买的会员记录';
COMMENT ON COLUMN user_memberships.id IS '主键，自增ID';
COMMENT ON COLUMN user_memberships.user_id IS '关联用户ID';
COMMENT ON COLUMN user_memberships.membership_level_id IS '购买的会员等级ID';
COMMENT ON COLUMN user_memberships.status IS '会员状态：有效、过期或已取消';
COMMENT ON COLUMN user_memberships.purchased_at IS '购买时间';
COMMENT ON COLUMN user_memberships.started_at IS '会员权益生效时间';
COMMENT ON COLUMN user_memberships.expires_at IS '会员权益到期时间';
COMMENT ON COLUMN user_memberships.benefits_snapshot IS '购买时的权益快照（JSON），保证历史可追溯';
COMMENT ON COLUMN user_memberships.created_at IS '记录创建时间';

CREATE UNIQUE INDEX user_memberships_one_active_idx
  ON user_memberships (user_id)
  WHERE status = 'active';

CREATE TABLE user_points_ledger (
  id              BIGSERIAL PRIMARY KEY,
  user_id         BIGINT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  change_amount   INTEGER NOT NULL CHECK (change_amount <> 0),
  balance_after   INTEGER NOT NULL,
  reason          TEXT NOT NULL,
  reference_type  TEXT,
  reference_id    BIGINT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE user_points_ledger IS '用户积分变动流水';
COMMENT ON COLUMN user_points_ledger.id IS '主键，自增ID';
COMMENT ON COLUMN user_points_ledger.user_id IS '关联用户ID';
COMMENT ON COLUMN user_points_ledger.change_amount IS '积分变动值，正数表示增加，负数表示减少';
COMMENT ON COLUMN user_points_ledger.balance_after IS '变动后的积分余额';
COMMENT ON COLUMN user_points_ledger.reason IS '积分变动原因描述';
COMMENT ON COLUMN user_points_ledger.reference_type IS '关联业务类型（如订单、活动等）';
COMMENT ON COLUMN user_points_ledger.reference_id IS '关联业务ID';
COMMENT ON COLUMN user_points_ledger.created_at IS '记录生成时间';

CREATE TABLE pets (
  id                    BIGSERIAL PRIMARY KEY,
  user_id               BIGINT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  name                  VARCHAR(64) NOT NULL,
  species               pet_species NOT NULL,
  breed                 VARCHAR(128),
  gender                pet_gender NOT NULL DEFAULT 'unknown',
  birthdate             DATE,
  age_text              VARCHAR(32),
  weight_kg             NUMERIC(6, 2) CHECK (weight_kg IS NULL OR weight_kg >= 0),
  color                 VARCHAR(64),
  shoulder_height_class pet_height_class,
  avatar_url            TEXT,
  neutered              BOOLEAN NOT NULL DEFAULT FALSE,
  vaccinated            BOOLEAN NOT NULL DEFAULT FALSE,
  notes                 TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE pets IS '用户宠物档案信息';
COMMENT ON COLUMN pets.id IS '主键，自增ID';
COMMENT ON COLUMN pets.user_id IS '宠物所属用户ID';
COMMENT ON COLUMN pets.name IS '宠物名称';
COMMENT ON COLUMN pets.species IS '宠物种类（狗、猫或其他）';
COMMENT ON COLUMN pets.breed IS '宠物品种';
COMMENT ON COLUMN pets.gender IS '宠物性别';
COMMENT ON COLUMN pets.birthdate IS '宠物生日';
COMMENT ON COLUMN pets.age_text IS '宠物年龄文本表示（如“2岁”）';
COMMENT ON COLUMN pets.weight_kg IS '宠物体重（千克）';
COMMENT ON COLUMN pets.color IS '宠物毛色';
COMMENT ON COLUMN pets.shoulder_height_class IS '宠物肩高分类（小型或大型）';
COMMENT ON COLUMN pets.avatar_url IS '宠物头像地址';
COMMENT ON COLUMN pets.neutered IS '是否已绝育';
COMMENT ON COLUMN pets.vaccinated IS '是否已接种疫苗';
COMMENT ON COLUMN pets.notes IS '其他备注';
COMMENT ON COLUMN pets.created_at IS '创建时间';
COMMENT ON COLUMN pets.updated_at IS '最后更新时间';

CREATE INDEX pets_user_id_idx ON pets (user_id);

CREATE TABLE stores (
  id               BIGSERIAL PRIMARY KEY,
  name             TEXT NOT NULL,
  slug             TEXT UNIQUE,
  description      TEXT,
  address          TEXT,
  city             TEXT,
  province         TEXT,
  latitude         NUMERIC(9, 6),
  longitude        NUMERIC(9, 6),
  phone            VARCHAR(32),
  wechat_id        VARCHAR(64),
  business_hours   TEXT,
  hero_image_url   TEXT,
  default_discount TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE stores IS '线下门店基础信息';
COMMENT ON COLUMN stores.id IS '主键，自增ID';
COMMENT ON COLUMN stores.name IS '门店名称';
COMMENT ON COLUMN stores.slug IS '门店短链/编码，用于URL或分享';
COMMENT ON COLUMN stores.description IS '门店简介';
COMMENT ON COLUMN stores.address IS '门店详细地址';
COMMENT ON COLUMN stores.city IS '所在城市';
COMMENT ON COLUMN stores.province IS '所在省份';
COMMENT ON COLUMN stores.latitude IS '门店纬度，用于距离计算';
COMMENT ON COLUMN stores.longitude IS '门店经度，用于距离计算';
COMMENT ON COLUMN stores.phone IS '门店联系电话';
COMMENT ON COLUMN stores.wechat_id IS '门店客服微信号';
COMMENT ON COLUMN stores.business_hours IS '营业时间描述';
COMMENT ON COLUMN stores.hero_image_url IS '门店主图或封面图地址';
COMMENT ON COLUMN stores.default_discount IS '门店默认优惠文案';
COMMENT ON COLUMN stores.created_at IS '创建时间';
COMMENT ON COLUMN stores.updated_at IS '最后更新时间';

CREATE TABLE store_images (
  id            BIGSERIAL PRIMARY KEY,
  store_id      BIGINT NOT NULL REFERENCES stores (id) ON DELETE CASCADE,
  image_url     TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE store_images IS '门店轮播或展示图片';
COMMENT ON COLUMN store_images.id IS '主键，自增ID';
COMMENT ON COLUMN store_images.store_id IS '关联门店ID';
COMMENT ON COLUMN store_images.image_url IS '图片地址';
COMMENT ON COLUMN store_images.display_order IS '展示顺序';
COMMENT ON COLUMN store_images.created_at IS '记录创建时间';

CREATE TABLE store_promotions (
  id            BIGSERIAL PRIMARY KEY,
  store_id      BIGINT NOT NULL REFERENCES stores (id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  description   TEXT,
  discount_text TEXT,
  valid_from    DATE,
  valid_to      DATE,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE store_promotions IS '门店优惠活动配置';
COMMENT ON COLUMN store_promotions.id IS '主键，自增ID';
COMMENT ON COLUMN store_promotions.store_id IS '关联门店ID';
COMMENT ON COLUMN store_promotions.title IS '活动标题';
COMMENT ON COLUMN store_promotions.description IS '活动详细描述';
COMMENT ON COLUMN store_promotions.discount_text IS '优惠文案或折扣信息';
COMMENT ON COLUMN store_promotions.valid_from IS '活动开始日期';
COMMENT ON COLUMN store_promotions.valid_to IS '活动结束日期';
COMMENT ON COLUMN store_promotions.is_active IS '是否启用该活动';
COMMENT ON COLUMN store_promotions.created_at IS '记录创建时间';

CREATE TABLE store_reviews (
  id         BIGSERIAL PRIMARY KEY,
  store_id   BIGINT NOT NULL REFERENCES stores (id) ON DELETE CASCADE,
  user_id    BIGINT REFERENCES users (id),
  rating     INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  content    TEXT NOT NULL,
  visited_at DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE store_reviews IS '门店用户评价';
COMMENT ON COLUMN store_reviews.id IS '主键，自增ID';
COMMENT ON COLUMN store_reviews.store_id IS '关联门店ID';
COMMENT ON COLUMN store_reviews.user_id IS '评价用户ID，可为空表示匿名';
COMMENT ON COLUMN store_reviews.rating IS '评分（1-5星）';
COMMENT ON COLUMN store_reviews.content IS '评价内容';
COMMENT ON COLUMN store_reviews.visited_at IS '到店日期';
COMMENT ON COLUMN store_reviews.created_at IS '评价创建时间';

CREATE INDEX store_reviews_store_id_idx ON store_reviews (store_id);

CREATE TABLE homepage_carousel_slides (
  id            BIGSERIAL PRIMARY KEY,
  title         TEXT,
  image_url     TEXT NOT NULL,
  link_url      TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE homepage_carousel_slides IS '首页轮播图配置';
COMMENT ON COLUMN homepage_carousel_slides.id IS '主键，自增ID';
COMMENT ON COLUMN homepage_carousel_slides.title IS '轮播图标题或文案';
COMMENT ON COLUMN homepage_carousel_slides.image_url IS '轮播图图片地址';
COMMENT ON COLUMN homepage_carousel_slides.link_url IS '跳转链接地址';
COMMENT ON COLUMN homepage_carousel_slides.display_order IS '展示顺序';
COMMENT ON COLUMN homepage_carousel_slides.is_active IS '是否展示该轮播图';
COMMENT ON COLUMN homepage_carousel_slides.created_at IS '记录创建时间';

CREATE TABLE service_categories (
  id          BIGSERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  slug        TEXT UNIQUE,
  description TEXT,
  pet_scope   pet_type[] NOT NULL DEFAULT ARRAY['dog', 'cat']::pet_type[],
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE service_categories IS '服务分类，如洗护、医疗等';
COMMENT ON COLUMN service_categories.id IS '主键，自增ID';
COMMENT ON COLUMN service_categories.name IS '分类名称';
COMMENT ON COLUMN service_categories.slug IS '分类编码/短链接';
COMMENT ON COLUMN service_categories.description IS '分类描述';
COMMENT ON COLUMN service_categories.pet_scope IS '分类适用宠物类型集合';
COMMENT ON COLUMN service_categories.created_at IS '创建时间';
COMMENT ON COLUMN service_categories.updated_at IS '最后更新时间';

CREATE TABLE service_items (
  id                BIGSERIAL PRIMARY KEY,
  category_id       BIGINT NOT NULL REFERENCES service_categories (id) ON DELETE CASCADE,
  title             TEXT NOT NULL,
  subtitle          TEXT,
  description       TEXT,
  base_price        NUMERIC(10, 2) NOT NULL CHECK (base_price >= 0),
  duration_minutes  INTEGER,
  cover_image_url   TEXT,
  pet_scope         pet_type[] NOT NULL DEFAULT ARRAY['dog', 'cat']::pet_type[],
  attributes        JSONB,
  is_active         BOOLEAN NOT NULL DEFAULT TRUE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE service_items IS '可售卖的服务项目';
COMMENT ON COLUMN service_items.id IS '主键，自增ID';
COMMENT ON COLUMN service_items.category_id IS '所属服务分类ID';
COMMENT ON COLUMN service_items.title IS '服务名称';
COMMENT ON COLUMN service_items.subtitle IS '服务副标题或简介';
COMMENT ON COLUMN service_items.description IS '服务详细描述';
COMMENT ON COLUMN service_items.base_price IS '基础售价（未折扣）';
COMMENT ON COLUMN service_items.duration_minutes IS '预计服务时长（分钟）';
COMMENT ON COLUMN service_items.cover_image_url IS '封面图片地址';
COMMENT ON COLUMN service_items.pet_scope IS '适用的宠物类型集合';
COMMENT ON COLUMN service_items.attributes IS '可选属性或配置（JSON），如体型区分';
COMMENT ON COLUMN service_items.is_active IS '是否在售';
COMMENT ON COLUMN service_items.created_at IS '创建时间';
COMMENT ON COLUMN service_items.updated_at IS '最后更新时间';

CREATE INDEX service_items_category_idx ON service_items (category_id);

CREATE TABLE service_media (
  id              BIGSERIAL PRIMARY KEY,
  service_item_id BIGINT NOT NULL REFERENCES service_items (id) ON DELETE CASCADE,
  media_url       TEXT NOT NULL,
  media_type      TEXT NOT NULL DEFAULT 'image',
  caption         TEXT,
  display_order   INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE service_media IS '服务项目关联的图文或视频';
COMMENT ON COLUMN service_media.id IS '主键，自增ID';
COMMENT ON COLUMN service_media.service_item_id IS '关联服务项目ID';
COMMENT ON COLUMN service_media.media_url IS '媒体资源地址';
COMMENT ON COLUMN service_media.media_type IS '媒体类型，如image或video';
COMMENT ON COLUMN service_media.caption IS '媒体说明文字';
COMMENT ON COLUMN service_media.display_order IS '展示顺序';
COMMENT ON COLUMN service_media.created_at IS '记录创建时间';

CREATE TABLE store_service_items (
  id              BIGSERIAL PRIMARY KEY,
  store_id        BIGINT NOT NULL REFERENCES stores (id) ON DELETE CASCADE,
  service_item_id BIGINT NOT NULL REFERENCES service_items (id) ON DELETE CASCADE,
  price_override  NUMERIC(10, 2) CHECK (price_override IS NULL OR price_override >= 0),
  discount_text   TEXT,
  is_available    BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE (store_id, service_item_id)
);

COMMENT ON TABLE store_service_items IS '门店维度的服务售卖信息';
COMMENT ON COLUMN store_service_items.id IS '主键，自增ID';
COMMENT ON COLUMN store_service_items.store_id IS '关联门店ID';
COMMENT ON COLUMN store_service_items.service_item_id IS '关联服务项目ID';
COMMENT ON COLUMN store_service_items.price_override IS '门店自定义售价（为空则使用基础价）';
COMMENT ON COLUMN store_service_items.discount_text IS '门店级别的优惠文案';
COMMENT ON COLUMN store_service_items.is_available IS '门店是否提供该服务';

CREATE TABLE orders (
  id                  BIGSERIAL PRIMARY KEY,
  order_no            VARCHAR(40) NOT NULL UNIQUE,
  user_id             BIGINT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  store_id            BIGINT REFERENCES stores (id),
  membership_level_id BIGINT REFERENCES membership_levels (id),
  pet_id              BIGINT REFERENCES pets (id),
  status              order_status NOT NULL DEFAULT 'pending',
  total_amount        NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
  discount_amount     NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (discount_amount >= 0),
  payable_amount      NUMERIC(10, 2) NOT NULL CHECK (payable_amount >= 0),
  appointment_at      TIMESTAMPTZ,
  completed_at        TIMESTAMPTZ,
  cancelled_at        TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE orders IS '服务订单主表';
COMMENT ON COLUMN orders.id IS '主键，自增ID';
COMMENT ON COLUMN orders.order_no IS '业务订单号，确保唯一';
COMMENT ON COLUMN orders.user_id IS '下单用户ID';
COMMENT ON COLUMN orders.store_id IS '服务门店ID，可为空表示未选门店';
COMMENT ON COLUMN orders.membership_level_id IS '下单时使用的会员等级ID';
COMMENT ON COLUMN orders.pet_id IS '关联的宠物ID';
COMMENT ON COLUMN orders.status IS '订单状态';
COMMENT ON COLUMN orders.total_amount IS '订单原价合计';
COMMENT ON COLUMN orders.discount_amount IS '优惠减免金额';
COMMENT ON COLUMN orders.payable_amount IS '实际应付金额';
COMMENT ON COLUMN orders.appointment_at IS '预约服务时间';
COMMENT ON COLUMN orders.completed_at IS '订单完成时间';
COMMENT ON COLUMN orders.cancelled_at IS '订单取消时间';
COMMENT ON COLUMN orders.created_at IS '创建时间';
COMMENT ON COLUMN orders.updated_at IS '最后更新时间';

CREATE INDEX orders_user_id_idx ON orders (user_id);
CREATE INDEX orders_store_id_idx ON orders (store_id);
CREATE INDEX orders_status_idx ON orders (status);

CREATE TABLE order_items (
  id              BIGSERIAL PRIMARY KEY,
  order_id        BIGINT NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
  service_item_id BIGINT REFERENCES service_items (id),
  pet_id          BIGINT REFERENCES pets (id),
  service_type    TEXT,
  service_name    TEXT NOT NULL,
  unit_price      NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
  quantity        INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  notes           TEXT
);

COMMENT ON TABLE order_items IS '订单明细，每条对应一个服务项目';
COMMENT ON COLUMN order_items.id IS '主键，自增ID';
COMMENT ON COLUMN order_items.order_id IS '关联订单ID';
COMMENT ON COLUMN order_items.service_item_id IS '对应的服务项目ID';
COMMENT ON COLUMN order_items.pet_id IS '该服务关联的宠物ID';
COMMENT ON COLUMN order_items.service_type IS '服务类型文本（如洗护/医疗）';
COMMENT ON COLUMN order_items.service_name IS '服务名称快照';
COMMENT ON COLUMN order_items.unit_price IS '单价（下单时）';
COMMENT ON COLUMN order_items.quantity IS '数量';
COMMENT ON COLUMN order_items.notes IS '其他备注信息';

CREATE INDEX order_items_order_idx ON order_items (order_id);

CREATE TABLE order_events (
  id          BIGSERIAL PRIMARY KEY,
  order_id    BIGINT NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
  from_status order_status,
  to_status   order_status NOT NULL,
  remark      TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE order_events IS '订单状态流转记录';
COMMENT ON COLUMN order_events.id IS '主键，自增ID';
COMMENT ON COLUMN order_events.order_id IS '关联订单ID';
COMMENT ON COLUMN order_events.from_status IS '变更前的订单状态';
COMMENT ON COLUMN order_events.to_status IS '变更后的订单状态';
COMMENT ON COLUMN order_events.remark IS '状态变更备注';
COMMENT ON COLUMN order_events.created_at IS '状态变更时间';
