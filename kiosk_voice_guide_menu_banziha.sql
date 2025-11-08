-- =========================================

-- KIOSK VOICE GUIDE MENU DB

-- =========================================



-- 0) (MySQL인 경우만) 문자셋 권장

-- ALTER DATABASE <YOUR_DB> CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;



-- 1) 카테고리 (탭)

CREATE TABLE categories (

  id          INTEGER PRIMARY KEY AUTO_INCREMENT,

  name_ko     VARCHAR(50) NOT NULL,        -- 표시명 (예: 돈부리, 카레)

  ui_tab_name VARCHAR(50) NOT NULL,        -- 실제 탭 라벨 텍스트

  sort_order  INT NOT NULL DEFAULT 0,

  UNIQUE KEY (name_ko)

);



-- 2) 메뉴

--  grid_row/grid_col은 현재 화면의 격자 위치(위에서부터 1,1 시작) - 음성 가이드가 "돈부리 탭 1행 1열 '가쯔동'을 누르세요" 같은 안내에 씀

CREATE TABLE menus (

  id              INTEGER PRIMARY KEY AUTO_INCREMENT,

  category_id     INTEGER NOT NULL,

  name_ko         VARCHAR(80) NOT NULL,

  base_price_krw  INT NOT NULL,            -- 원화 정수(원)

  description     VARCHAR(255),

  img_url         VARCHAR(255),

  grid_row        INT,                     -- 버튼 행(index 1부터)

  grid_col        INT,                     -- 버튼 열(index 1부터)

  is_active       TINYINT(1) NOT NULL DEFAULT 1,

  FOREIGN KEY (category_id) REFERENCES categories(id)

);



-- 3) 옵션 그룹 (메뉴를 눌렀을 때 뜨는 모달의 섹션)

--  예: "돈부리 추가 [선택가능: 9개]" / "음료 선택 [선택가능: 1개]"

CREATE TABLE option_groups (

  id            INTEGER PRIMARY KEY AUTO_INCREMENT,

  name_ko       VARCHAR(80) NOT NULL,

  select_min    INT NOT NULL DEFAULT 0,

  select_max    INT NOT NULL DEFAULT 1,   -- 1이면 단일선택, 큰 값이면 다중선택

  sort_order    INT NOT NULL DEFAULT 0

);



-- 4) 옵션 (실제 선택 항목)

CREATE TABLE options (

  id                INTEGER PRIMARY KEY AUTO_INCREMENT,

  option_group_id   INTEGER NOT NULL,

  name_ko           VARCHAR(80) NOT NULL,

  add_price_krw     INT NOT NULL DEFAULT 0,     -- 추가 금액(원)

  is_active         TINYINT(1) NOT NULL DEFAULT 1,

  sort_order        INT NOT NULL DEFAULT 0,

  FOREIGN KEY (option_group_id) REFERENCES option_groups(id)

);



-- 5) 메뉴-옵션그룹 매핑 (메뉴별로 어떤 옵션 그룹을 보일지)

CREATE TABLE menu_option_groups (

  menu_id        INTEGER NOT NULL,

  option_group_id INTEGER NOT NULL,

  sort_order     INT NOT NULL DEFAULT 0,

  PRIMARY KEY (menu_id, option_group_id),

  FOREIGN KEY (menu_id) REFERENCES menus(id),

  FOREIGN KEY (option_group_id) REFERENCES option_groups(id)

);



-- 6) 음성 별칭(동의어) - 사용자가 말한 다양한 표현을 메뉴에 매핑

--   예: "가츠/가쯔/카츠/카쯔", "돈까스 카레" -> '카쯔카레'

CREATE TABLE voice_aliases (

  id        INTEGER PRIMARY KEY AUTO_INCREMENT,

  menu_id   INTEGER NOT NULL,

  alias_ko  VARCHAR(100) NOT NULL,      -- 소리나는대로/별칭

  FOREIGN KEY (menu_id) REFERENCES menus(id)

);



-- =========================================

-- 기본 데이터

-- =========================================



-- 카테고리

INSERT INTO categories (name_ko, ui_tab_name, sort_order) VALUES

('돈부리', '돈부리', 1),

('카레',   '카레',   2);



-- ===== 카레 탭 (사진에서 확인된 항목) =====

-- 행/열은 사진 기준 대략 배치 예시 (필요시 조정)

INSERT INTO menus (category_id, name_ko, base_price_krw, grid_row, grid_col)

SELECT id, '카쯔카레',   10000, 1, 1 FROM categories WHERE name_ko='카레';

INSERT INTO menus (category_id, name_ko, base_price_krw, grid_row, grid_col)

SELECT id, '규카레',     10500, 1, 2 FROM categories WHERE name_ko='카레';

INSERT INTO menus (category_id, name_ko, base_price_krw, grid_row, grid_col)

SELECT id, '에비가쯔카레', 11000, 1, 3 FROM categories WHERE name_ko='카레';

INSERT INTO menus (category_id, name_ko, base_price_krw, grid_row, grid_col)

SELECT id, '에비카레',   12000, 1, 4 FROM categories WHERE name_ko='카레';

INSERT INTO menus (category_id, name_ko, base_price_krw, grid_row, grid_col)

SELECT id, '더블가쯔카레', 14000, 2, 1 FROM categories WHERE name_ko='카레';



-- ===== 돈부리 탭 (사진에서 식별된 항목 위주) =====

INSERT INTO menus (category_id, name_ko, base_price_krw, grid_row, grid_col)

SELECT id, '가쯔동',    9000,  1, 1 FROM categories WHERE name_ko='돈부리';

INSERT INTO menus (category_id, name_ko, base_price_krw, grid_row, grid_col)

SELECT id, '규동',      9500,  1, 2 FROM categories WHERE name_ko='돈부리';

INSERT INTO menus (category_id, name_ko, base_price_krw, grid_row, grid_col)

SELECT id, '오야꼬동',  9000,  1, 3 FROM categories WHERE name_ko='돈부리';

INSERT INTO menus (category_id, name_ko, base_price_krw, grid_row, grid_col)

SELECT id, '에비가쯔동', 10000, 1, 4 FROM categories WHERE name_ko='돈부리';

INSERT INTO menus (category_id, name_ko, base_price_krw, grid_row, grid_col)

SELECT id, '에비동',    11000, 2, 1 FROM categories WHERE name_ko='돈부리';

INSERT INTO menus (category_id, name_ko, base_price_krw, grid_row, grid_col)

SELECT id, '사케동',    12000, 2, 2 FROM categories WHERE name_ko='돈부리';

INSERT INTO menus (category_id, name_ko, base_price_krw, grid_row, grid_col)

SELECT id, '더블사케동', 18000, 2, 3 FROM categories WHERE name_ko='돈부리';   

INSERT INTO menus (category_id, name_ko, base_price_krw, grid_row, grid_col)

SELECT id, '유케동',    11000, 2, 4 FROM categories WHERE name_ko='돈부리';   

INSERT INTO menus (category_id, name_ko, base_price_krw, grid_row, grid_col)

SELECT id, '더블유케동', 17000, 3, 1 FROM categories WHERE name_ko='돈부리';   -

INSERT INTO menus (category_id, name_ko, base_price_krw, grid_row, grid_col)

SELECT id, '유케사케동',  14000, 3, 2 FROM categories WHERE name_ko='돈부리';

INSERT INTO menus (category_id, name_ko, base_price_krw, grid_row, grid_col)

SELECT id, '카라이가쯔동', 10000, 3, 3 FROM categories WHERE name_ko='돈부리';

INSERT INTO menus (category_id, name_ko, base_price_krw, grid_row, grid_col)

SELECT id, '카라이에비가쯔동', 11000, 3, 4 FROM categories WHERE name_ko='돈부리';

INSERT INTO menus (category_id, name_ko, base_price_krw, grid_row, grid_col)

SELECT id, '가라이규동', 10500, 4, 1 FROM categories WHERE name_ko='돈부리'; 

INSERT INTO menus (category_id, name_ko, base_price_krw, grid_row, grid_col)

SELECT id, '더블가쯔동동', 13000, 4, 2 FROM categories WHERE name_ko='돈부리';

INSERT INTO menus (category_id, name_ko, base_price_krw, grid_row, grid_col)

SELECT id, '카라이더블가쯔동', 14000, 4, 3 FROM categories WHERE name_ko='돈부리';
-- ===== 옵션 그룹 정의 =====

-- 카레 모달에서: "카레 추가 [선택가능: 7개]" / "음료 선택 [선택가능: 1개]"

-- 돈부리 모달에서: "돈부리 추가 [선택가능: 9개]" / "음료 선택 [선택가능: 1개]"

INSERT INTO option_groups (name_ko, select_min, select_max, sort_order) VALUES

('카레 추가',   0, 7, 1),

('돈부리 추가', 0, 9, 1),

('음료 선택',   0, 1, 2);



-- ===== 옵션(공통으로 보이는 항목 위주) =====

-- 추가 토핑/사이드 (가격은 사진 기준)

INSERT INTO options (option_group_id, name_ko, add_price_krw, sort_order)

SELECT id, '밥 추가',      1000, 1 FROM option_groups WHERE name_ko='돈부리 추가';

INSERT INTO options (option_group_id, name_ko, add_price_krw, sort_order)

SELECT id, '계란 추가',    1000, 2 FROM option_groups WHERE name_ko='돈부리 추가';

INSERT INTO options (option_group_id, name_ko, add_price_krw, sort_order)

SELECT id, '카레 추가',    3000, 3 FROM option_groups WHERE name_ko='돈부리 추가';



-- 카레 쪽도 동일 토핑 구성(필요 시 분리 관리)

INSERT INTO options (option_group_id, name_ko, add_price_krw, sort_order)

SELECT id, '밥 추가',      1000, 1 FROM option_groups WHERE name_ko='카레 추가';

INSERT INTO options (option_group_id, name_ko, add_price_krw, sort_order)

SELECT id, '계란 추가',    1000, 2 FROM option_groups WHERE name_ko='카레 추가';

INSERT INTO options (option_group_id, name_ko, add_price_krw, sort_order)

SELECT id, '카레 추가',    3000, 3 FROM option_groups WHERE name_ko='카레 추가';



-- 음료 (사진에 보이는 3종)

INSERT INTO options (option_group_id, name_ko, add_price_krw, sort_order)

SELECT id, '코카콜라',      2000, 1 FROM option_groups WHERE name_ko='음료 선택';

INSERT INTO options (option_group_id, name_ko, add_price_krw, sort_order)

SELECT id, '스프라이트',    2000, 2 FROM option_groups WHERE name_ko='음료 선택';

INSERT INTO options (option_group_id, name_ko, add_price_krw, sort_order)

SELECT id, '코카콜라 제로', 2000, 3 FROM option_groups WHERE name_ko='음료 선택';



-- ===== 메뉴별 옵션그룹 연결 =====

-- 카레류: "카레 추가", "음료 선택"

INSERT INTO menu_option_groups (menu_id, option_group_id, sort_order)

SELECT m.id, g.id, 1

FROM menus m JOIN categories c ON m.category_id=c.id

JOIN option_groups g ON g.name_ko='카레 추가'

WHERE c.name_ko='카레';



INSERT INTO menu_option_groups (menu_id, option_group_id, sort_order)

SELECT m.id, g.id, 2

FROM menus m JOIN categories c ON m.category_id=c.id

JOIN option_groups g ON g.name_ko='음료 선택'

WHERE c.name_ko='카레';



-- 돈부리류: "돈부리 추가", "음료 선택"

INSERT INTO menu_option_groups (menu_id, option_group_id, sort_order)

SELECT m.id, g.id, 1

FROM menus m JOIN categories c ON m.category_id=c.id

JOIN option_groups g ON g.name_ko='돈부리 추가'

WHERE c.name_ko='돈부리';



INSERT INTO menu_option_groups (menu_id, option_group_id, sort_order)

SELECT m.id, g.id, 2

FROM menus m JOIN categories c ON m.category_id=c.id

JOIN option_groups g ON g.name_ko='음료 선택'

WHERE c.name_ko='돈부리';



-- ===== 음성 별칭(동의어) =====

-- 카쯔/카츠/가쯔/가츠 등 발음 변형 + 설명형

INSERT INTO voice_aliases (menu_id, alias_ko)

SELECT id, '카츠카레' FROM menus WHERE name_ko='카쯔카레';

INSERT INTO voice_aliases (menu_id, alias_ko)

SELECT id, '가츠카레' FROM menus WHERE name_ko='카쯔카레';

INSERT INTO voice_aliases (menu_id, alias_ko)

SELECT id, '돈까스 카레' FROM menus WHERE name_ko='카쯔카레';



INSERT INTO voice_aliases (menu_id, alias_ko)

SELECT id, '규 카레' FROM menus WHERE name_ko='규카레';



INSERT INTO voice_aliases (menu_id, alias_ko)

SELECT id, '에비 가츠 카레' FROM menus WHERE name_ko='에비가쯔카레';

INSERT INTO voice_aliases (menu_id, alias_ko)

SELECT id, '새우 돈까스 카레' FROM menus WHERE name_ko='에비가쯔카레';



INSERT INTO voice_aliases (menu_id, alias_ko)

SELECT id, '새우 카레' FROM menus WHERE name_ko='에비카레';



INSERT INTO voice_aliases (menu_id, alias_ko)

SELECT id, '더블 가츠 카레' FROM menus WHERE name_ko='더블가쯔카레';



INSERT INTO voice_aliases (menu_id, alias_ko)

SELECT id, '가츠동' FROM menus WHERE name_ko='가쯔동';

INSERT INTO voice_aliases (menu_id, alias_ko)

SELECT id, '돈까스 덮밥' FROM menus WHERE name_ko='가쯔동';



INSERT INTO voice_aliases (menu_id, alias_ko)

SELECT id, '소고기 규동' FROM menus WHERE name_ko='규동';



INSERT INTO voice_aliases (menu_id, alias_ko)

SELECT id, '오야꼬동' FROM menus WHERE name_ko='오야코동';

INSERT INTO voice_aliases (menu_id, alias_ko)

SELECT id, '닭계란 덮밥' FROM menus WHERE name_ko='오야코동';



INSERT INTO voice_aliases (menu_id, alias_ko)

SELECT id, '새우 가츠 동' FROM menus WHERE name_ko='에비가쯔동';



INSERT INTO voice_aliases (menu_id, alias_ko)

SELECT id, '연어 덮밥' FROM menus WHERE name_ko='연어동';

INSERT INTO voice_aliases (menu_id, alias_ko)

SELECT id, '사케 덮밥' FROM menus WHERE name_ko='사케동';



INSERT INTO voice_aliases (menu_id, alias_ko)

SELECT id, '닭 가츠 동' FROM menus WHERE name_ko='닭가쯔동';



INSERT INTO voice_aliases (menu_id, alias_ko)

SELECT id, '가라아게 덮밥' FROM menus WHERE name_ko='가라아게동';

INSERT INTO voice_aliases (menu_id, alias_ko)

SELECT id, '가라아게 가츠 동' FROM menus WHERE name_ko='가라아게가쯔동';

