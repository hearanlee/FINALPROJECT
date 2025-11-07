-- =========================================

-- ISAAC TOAST – VOICE GUIDE MENU DB

-- (categories, menus, option groups, options, mapping, voice aliases)

-- =========================================



-- =========================================

-- ISAAC TOAST – 토스트 카테고리(페이지네이션 반영) 전용 SQL

--  - 카테고리 탭 내: page_no(1부터), grid_row/col(1부터)

--  - SOLD OUT, 비고/주석 컬럼 포함

-- =========================================



-- 1) 카테고리(상단 탭)

CREATE TABLE categories (

  id           INTEGER PRIMARY KEY AUTO_INCREMENT,

  name_ko      VARCHAR(40) NOT NULL,     -- 표기명: 추천/토스트 세트/토스트/사이드/커피/음료

  sort_order   INT NOT NULL DEFAULT 0,

  UNIQUE KEY (name_ko)

);



-- 2) 메뉴

--  is_featured: 추천 탭 노출

--  page_no: 카테고리 내 페이지 번호(1쪽/2쪽…)

--  grid_row/col: 해당 페이지의 버튼 위치(음성 안내용, 1부터 시작)

--  is_sold_out: 품절 표시

--  note: 비고/주석 (흐릿/불명확 코멘트 보관)

CREATE TABLE menus (

  id               INTEGER PRIMARY KEY AUTO_INCREMENT,

  category_id      INTEGER NOT NULL,

  name_ko          VARCHAR(100) NOT NULL,

  base_price_krw   INT NOT NULL,

  description      VARCHAR(255),

  img_url          VARCHAR(255),

  page_no          INT NOT NULL DEFAULT 1,  -- 카테고리 내 페이지 번호(1쪽/2쪽…)

  grid_row         INT,                     -- 해당 페이지의 버튼 행(1부터)

  grid_col         INT,                     -- 해당 페이지의 버튼 열(1부터)

  is_featured      TINYINT(1) NOT NULL DEFAULT 0,

  is_sold_out      TINYINT(1) NOT NULL DEFAULT 0,

  is_active        TINYINT(1) NOT NULL DEFAULT 1,

  note             VARCHAR(255),            -- 흐릿/불명확 코멘트 보관

  FOREIGN KEY (category_id) REFERENCES categories(id)

);



-- 3) 옵션 그룹(메뉴 상세 모달의 섹션)

CREATE TABLE option_groups (

  id           INTEGER PRIMARY KEY AUTO_INCREMENT,

  name_ko      VARCHAR(80) NOT NULL,     -- 예: 사이드(필수), 음료(필수)

  select_min   INT NOT NULL DEFAULT 0,   -- 최소 선택 수

  select_max   INT NOT NULL DEFAULT 1,   -- 최대 선택 수(1=단일, 그 이상=다중)

  sort_order   INT NOT NULL DEFAULT 0

);



-- 4) 옵션

CREATE TABLE options (

  id                INTEGER PRIMARY KEY AUTO_INCREMENT,

  option_group_id   INTEGER NOT NULL,

  name_ko           VARCHAR(100) NOT NULL,

  add_price_krw     INT NOT NULL DEFAULT 0,

  is_sold_out       TINYINT(1) NOT NULL DEFAULT 0,

  sort_order        INT NOT NULL DEFAULT 0,

  FOREIGN KEY (option_group_id) REFERENCES option_groups(id)

);



-- 5) 메뉴-옵션그룹 매핑(어떤 메뉴에 어떤 그룹을 노출할지)

CREATE TABLE menu_option_groups (

  menu_id        INTEGER NOT NULL,

  option_group_id INTEGER NOT NULL,

  sort_order     INT NOT NULL DEFAULT 0,

  PRIMARY KEY (menu_id, option_group_id),

  FOREIGN KEY (menu_id) REFERENCES menus(id),

  FOREIGN KEY (option_group_id) REFERENCES option_groups(id)

);



-- 6) 음성 별칭(동의어)

CREATE TABLE voice_aliases (

  id        INTEGER PRIMARY KEY AUTO_INCREMENT,

  menu_id   INTEGER NOT NULL,

  alias_ko  VARCHAR(100) NOT NULL,

  FOREIGN KEY (menu_id) REFERENCES menus(id)

);



-- =========================================

-- 기본 데이터

-- =========================================



INSERT INTO categories (name_ko, sort_order) VALUES

('추천',1),('토스트 세트',2),('토스트',3),('사이드',4),('커피',5),('음료',6);



-- =========================================

-- 토스트 카테고리: 1쪽(첫 번째 사진)

-- =========================================



-- 1행: 브리오슈 2종 + SOLD OUT 2종

INSERT INTO menus (category_id, name_ko, base_price_krw, page_no, grid_row, grid_col, is_sold_out, note)

SELECT id, '프렌치 크림 브리오슈', 4100, 1, 1, 1, 0, NULL FROM categories WHERE name_ko='토스트';

INSERT INTO menus (category_id, name_ko, base_price_krw, page_no, grid_row, grid_col, is_sold_out, note)

SELECT id, '애플 크림 브리오슈', 3700, 1, 1, 2, 0, NULL FROM categories WHERE name_ko='토스트';



-- SOLD OUT 2칸(사진 도장으로 품절, 정확 상품명/가격 미확정)

--INSERT INTO menus (category_id, name_ko, base_price_krw, page_no, grid_row, grid_col, is_sold_out, note)

--SELECT id, '브리오슈(품절-좌측)', 5100, 1, 1, 3, 1, 'TODO: 실제 표기명/가격 확인 필요' FROM categories WHERE name_ko='토스트';

--INSERT INTO menus (category_id, name_ko, base_price_krw, page_no, grid_row, grid_col, is_sold_out, note)

--SELECT id, '브리오슈(품절-우측)', 5000, 1, 1, 4, 1, 'TODO: 실제 표기명/가격 확인 필요' FROM categories WHERE name_ko='토스트';

-- 2행: 

INSERT INTO menus (category_id, name_ko, base_price_krw, page_no, grid_row, grid_col, is_sold_out, note)

SELECT id, '복숭아잼 에그마요',   4400, 1, 2, 1, 0, NULL FROM categories WHERE name_ko='토스트';

INSERT INTO menus (category_id, name_ko, base_price_krw, page_no, grid_row, grid_col, is_sold_out, note)

SELECT id, '복숭아잼 베이컨 베스트',   4400, 1, 2, 2, 0, NULL FROM categories WHERE name_ko='토스트';

INSERT INTO menus (category_id, name_ko, base_price_krw, page_no, grid_row, grid_col, is_sold_out, note)

SELECT id, '게란후라이 햄치즈',   4000, 1, 2, 3, 0, NULL FROM categories WHERE name_ko='토스트';

INSERT INTO menus (category_id, name_ko, base_price_krw, page_no, grid_row, grid_col, is_sold_out, note)

SELECT id, '계란후라이 스페셜',   4200, 1, 2, 4, 0, NULL FROM categories WHERE name_ko='토스트';



-- 3행: 

INSERT INTO menus (category_id, name_ko, base_price_krw, page_no, grid_row, grid_col, is_sold_out, note)

SELECT id, '프렌치 에그마요',     3900, 1, 3, 1, 0, NULL FROM categories WHERE name_ko='토스트';

INSERT INTO menus (category_id, name_ko, base_price_krw, page_no, grid_row, grid_col, is_sold_out, note)

SELECT id, '콘베이컨 에그마요',   4300, 1, 3, 2, 0, NULL FROM categories WHERE name_ko='토스트';

INSERT INTO menus (category_id, name_ko, base_price_krw, page_no, grid_row, grid_col, is_sold_out, note)

SELECT id, '포테이토 에그마요',   4700, 1, 3, 3, 0, NULL FROM categories WHERE name_ko='토스트';

INSERT INTO menus (category_id, name_ko, base_price_krw, page_no, grid_row, grid_col, is_sold_out, note)

SELECT id, '프렌치 햄 치즈',   3800, 1, 3, 4, 0, NULL FROM categories WHERE name_ko='토스트';



-- 4행:

INSERT INTO menus (category_id, name_ko, base_price_krw, page_no, grid_row, grid_col, is_sold_out, note)

SELECT id, '스크램블 햄치즈',     3900, 1, 4, 1, 0, NULL FROM categories WHERE name_ko='토스트';

INSERT INTO menus (category_id, name_ko, base_price_krw, page_no, grid_row, grid_col, is_sold_out, note)

SELECT id, '스크램블 베이컨',     4800, 1, 4, 2, 0, NULL FROM categories WHERE name_ko='토스트';

INSERT INTO menus (category_id, name_ko, base_price_krw, page_no, grid_row, grid_col, is_sold_out, note)

SELECT id, '감자 스페셜',         4800, 1, 4, 3, 0, NULL FROM categories WHERE name_ko='토스트';

INSERT INTO menus (category_id, name_ko, base_price_krw, page_no, grid_row, grid_col, is_sold_out, note)

SELECT id, '햄치즈 포테이토',     4400, 1, 4, 4, 0, 'TODO: 실제 표기 ''햄치즈 포테이토'' 맞는지 확인' FROM categories WHERE name_ko='토스트';







-- =========================================

-- 토스트 카테고리: 2쪽(두 번째 사진)

-- =========================================



-- 1행:

INSERT INTO menus (category_id, name_ko, base_price_krw, page_no, grid_row, grid_col, is_sold_out, note)

SELECT id, '딥치즈 베이컨 포테이토', 5300, 2, 1, 1, 0, NULL FROM categories WHERE name_ko='토스트';

INSERT INTO menus (category_id, name_ko, base_price_krw, page_no, grid_row, grid_col, is_sold_out, note)

SELECT id, '햄스페셜 토스트',     3800, 2, 1, 2, 0, NULL FROM categories WHERE name_ko='토스트';

INSERT INTO menus (category_id, name_ko, base_price_krw, page_no, grid_row, grid_col, is_sold_out, note)

SELECT id, '베이컨 베스트',       4300, 2, 1, 3, 0, NULL FROM categories WHERE name_ko='토스트';

INSERT INTO menus (category_id, name_ko, base_price_krw, page_no, grid_row, grid_col, is_sold_out, note)

SELECT id, '그릴드 불갈비',       5000, 2, 1, 4, 0, NULL FROM categories WHERE name_ko='토스트';



-- 2행:

INSERT INTO menus (category_id, name_ko, base_price_krw, page_no, grid_row, grid_col, is_sold_out, note)

SELECT id, '딥치즈 베이컨',       4600, 2, 2, 1, 0, NULL FROM categories WHERE name_ko='토스트';

INSERT INTO menus (category_id, name_ko, base_price_krw, page_no, grid_row, grid_col, is_sold_out, note)

SELECT id, '햄치즈 토스트',       3300, 2, 2, 2, 0, NULL FROM categories WHERE name_ko='토스트';

INSERT INTO menus (category_id, name_ko, base_price_krw, page_no, grid_row, grid_col, is_sold_out, note)

SELECT id, '베이컨 포테이토 피자',5400, 2, 2, 3, 0, NULL FROM categories WHERE name_ko='토스트';






-- ===== 토스트 세트(옵션 필수: 사이드 1개, 음료 1개) =====

INSERT INTO menus (category_id, name_ko, base_price_krw, is_featured, grid_row, grid_col)

SELECT id,'프렌치 크림 브리오슈 세트',7000,1,1,1 FROM categories WHERE name_ko='토스트 세트';

INSERT INTO menus (category_id, name_ko, base_price_krw, is_featured, grid_row, grid_col)

SELECT id,'애플 크림 브리오슈 세트',6600,1,1,2 FROM categories WHERE name_ko='토스트 세트';



INSERT INTO menus (category_id, name_ko, base_price_krw, is_featured, grid_row, grid_col)

SELECT id,'프렌치 에그마요 세트',6800,0,2,1 FROM categories WHERE name_ko='토스트 세트';

INSERT INTO menus (category_id, name_ko, base_price_krw, is_featured, grid_row, grid_col)

SELECT id,'콘베이컨 에그마요 세트',7200,0,2,2 FROM categories WHERE name_ko='토스트 세트';

INSERT INTO menus (category_id, name_ko, base_price_krw, is_featured, grid_row, grid_col)

SELECT id,'포테이토 에그마요 세트',7000,0,2,3 FROM categories WHERE name_ko='토스트 세트';



INSERT INTO menus (category_id, name_ko, base_price_krw, is_featured, grid_row, grid_col)

SELECT id,'스크램블 햄치즈 세트',6800,0,3,1 FROM categories WHERE name_ko='토스트 세트';

INSERT INTO menus (category_id, name_ko, base_price_krw, is_featured, grid_row, grid_col)

SELECT id,'스크램블 베이컨 세트',7700,0,3,2 FROM categories WHERE name_ko='토스트 세트';

INSERT INTO menus (category_id, name_ko, base_price_krw, is_featured, grid_row, grid_col)

SELECT id,'감자 스페셜 세트',7700,0,3,3 FROM categories WHERE name_ko='토스트 세트';



INSERT INTO menus (category_id, name_ko, base_price_krw, is_featured, grid_row, grid_col)

SELECT id,'계란라이스 햄치즈 세트',7100,0,4,1 FROM categories WHERE name_ko='토스트 세트';

INSERT INTO menus (category_id, name_ko, base_price_krw, is_featured, grid_row, grid_col)

SELECT id,'계란라이스 스페셜 세트',7100,0,4,2 FROM categories WHERE name_ko='토스트 세트';



-- ===== 사이드 단품 =====

INSERT INTO menus (category_id,name_ko,base_price_krw,grid_row,grid_col,is_featured)

SELECT id,'포테이토 팝',2100,1,1,0 FROM categories WHERE name_ko='사이드';

INSERT INTO menus (category_id,name_ko,base_price_krw,is_sold_out)

SELECT id,'치즈 팝',2800,1 FROM categories WHERE name_ko='사이드'; -- SOLD OUT

INSERT INTO menus (category_id,name_ko,base_price_krw,is_sold_out)

SELECT id,'어니언 포테이토 팝',2800,1 FROM categories WHERE name_ko='사이드'; -- SOLD OUT

INSERT INTO menus (category_id,name_ko,base_price_krw,grid_row,grid_col,is_featured)

SELECT id,'포테이토 팝(시즈닝)',2400,1,4,1 FROM categories WHERE name_ko='사이드';

INSERT INTO menus (category_id,name_ko,base_price_krw,grid_row,grid_col,is_featured)

SELECT id,'시즈닝',300,2,1,0 FROM categories WHERE name_ko='사이드';

INSERT INTO menus (category_id,name_ko,base_price_krw,grid_row,grid_col,is_featured)

SELECT id,'코울슬로',2900,2,2,0 FROM categories WHERE name_ko='사이드';



-- ===== 커피/음료(가격은 옵션에도 쓰이므로 기본 등록) =====

INSERT INTO menus (category_id,name_ko,base_price_krw)

SELECT id,'핫 아메리카노',2900 FROM categories WHERE name_ko='커피';

INSERT INTO menus (category_id,name_ko,base_price_krw)

SELECT id,'아이스 아메리카노',2900 FROM categories WHERE name_ko='커피';

INSERT INTO menus (category_id,name_ko,base_price_krw)

SELECT id,'핫 디카페인 아메리카노',3400 FROM categories WHERE name_ko='커피';

INSERT INTO menus (category_id,name_ko,base_price_krw)

SELECT id,'아이스 디카페인 아메리카노',3400 FROM categories WHERE name_ko='커피';


INSERT INTO menus (category_id,name_ko,base_price_krw)

SELECT id,'아이스티',0 FROM categories WHERE name_ko='음료';

INSERT INTO menus (category_id,name_ko,base_price_krw)

SELECT id,'오렌지주스',0 FROM categories WHERE name_ko='음료';

INSERT INTO menus (category_id,name_ko,base_price_krw)

SELECT id,'콜라',0 FROM categories WHERE name_ko='음료';

INSERT INTO menus (category_id,name_ko,base_price_krw)

SELECT id,'제로 콜라',0 FROM categories WHERE name_ko='음료';

INSERT INTO menus (category_id,name_ko,base_price_krw)

SELECT id,'사이다',0 FROM categories WHERE name_ko='음료';

INSERT INTO menus (category_id,name_ko,base_price_krw)

SELECT id,'제로 사이다',0 FROM categories WHERE name_ko='음료';




-- =========================================

-- 옵션 그룹 & 옵션 (세트 공통)

-- =========================================



-- 세트용 사이드: [선택 1-1]

INSERT INTO option_groups (name_ko, select_min, select_max, sort_order)

VALUES ('사이드(필수)',1,1,1);



-- 세트용 음료: [선택 1-1]

INSERT INTO option_groups (name_ko, select_min, select_max, sort_order)

VALUES ('음료(필수)',1,1,2);



-- 사이드 옵션 (사진 기준)

INSERT INTO options (option_group_id,name_ko,add_price_krw,is_sold_out,sort_order)

SELECT id,'포테이토 팝',0,0,1 FROM option_groups WHERE name_ko='사이드(필수)';

INSERT INTO options (option_group_id,name_ko,add_price_krw,is_sold_out,sort_order)

SELECT id,'치즈 팝',700,1,2 FROM option_groups WHERE name_ko='사이드(필수)';     -- SOLD OUT

INSERT INTO options (option_group_id,name_ko,add_price_krw,is_sold_out,sort_order)

SELECT id,'어니언 포테이토 팝',700,1,3 FROM option_groups WHERE name_ko='사이드(필수)'; -- SOLD OUT

INSERT INTO options (option_group_id,name_ko,add_price_krw,is_sold_out,sort_order)

SELECT id,'포테이토 팝(버터갈릭)',300,0,4 FROM option_groups WHERE name_ko='사이드(필수)';

INSERT INTO options (option_group_id,name_ko,add_price_krw,is_sold_out,sort_order)

SELECT id,'포테이토 팝(칠리)',300,0,5 FROM option_groups WHERE name_ko='사이드(필수)';

INSERT INTO options (option_group_id,name_ko,add_price_krw,is_sold_out,sort_order)

SELECT id,'포테이토 팝(치즈즈)',300,0,6 FROM option_groups WHERE name_ko='사이드(필수)'; -- TODO: 정확명 확인

INSERT INTO options (option_group_id,name_ko,add_price_krw,is_sold_out,sort_order)

SELECT id,'코울슬로',800,0,7 FROM option_groups WHERE name_ko='사이드(필수)';



-- 음료 옵션 (사진 기준: 캔탄산 0원, 아메리카노 유료)

INSERT INTO options (option_group_id,name_ko,add_price_krw,sort_order)

SELECT id,'콜라',0,1 FROM option_groups WHERE name_ko='음료(필수)';

INSERT INTO options (option_group_id,name_ko,add_price_krw,sort_order)

SELECT id,'제로 콜라',0,2 FROM option_groups WHERE name_ko='음료(필수)';

INSERT INTO options (option_group_id,name_ko,add_price_krw,sort_order)

SELECT id,'사이다',0,3 FROM option_groups WHERE name_ko='음료(필수)';

INSERT INTO options (option_group_id,name_ko,add_price_krw,sort_order)

SELECT id,'제로 사이다',0,4 FROM option_groups WHERE name_ko='음료(필수)';

INSERT INTO options (option_group_id,name_ko,add_price_krw,sort_order)

SELECT id,'핫 아메리카노',800,5 FROM option_groups WHERE name_ko='음료(필수)';

INSERT INTO options (option_group_id,name_ko,add_price_krw,sort_order)

SELECT id,'아이스 아메리카노',800,6 FROM option_groups WHERE name_ko='음료(필수)';

INSERT INTO options (option_group_id,name_ko,add_price_krw,sort_order)

SELECT id,'핫 디카페인 아메리카노',1300,7 FROM option_groups WHERE name_ko='음료(필수)';

INSERT INTO options (option_group_id,name_ko,add_price_krw,sort_order)

SELECT id,'아이스 디카페인 아메리카노',1300,8 FROM option_groups WHERE name_ko='음료(필수)';

INSERT INTO options (option_group_id,name_ko,add_price_krw,sort_order)

SELECT id,'오렌지주스',400,9 FROM option_groups WHERE name_ko='음료(필수)';



-- 세트 메뉴 ↔ 옵션그룹 연결(모든 세트에 공통 적용)

INSERT INTO menu_option_groups (menu_id, option_group_id, sort_order)

SELECT m.id, og.id, 1

FROM menus m

JOIN categories c ON c.id=m.category_id AND c.name_ko='토스트 세트'

JOIN option_groups og ON og.name_ko='사이드(필수)';



INSERT INTO menu_option_groups (menu_id, option_group_id, sort_order)

SELECT m.id, og.id, 2

FROM menus m

JOIN categories c ON c.id=m.category_id AND c.name_ko='토스트 세트'

JOIN option_groups og ON og.name_ko='음료(필수)';



-- =========================================

-- 음성 별칭 (대표만 예시)

-- =========================================

INSERT INTO voice_aliases (menu_id,alias_ko)

SELECT id,'브리오슈' FROM menus WHERE name_ko='프렌치 크림 브리오슈';

INSERT INTO voice_aliases (menu_id,alias_ko)

SELECT id,'애플 브리오슈' FROM menus WHERE name_ko='애플 크림 브리오슈';



INSERT INTO voice_aliases (menu_id,alias_ko)

SELECT id,'프렌치 크림 세트' FROM menus WHERE name_ko='프렌치 크림 브리오슈 세트';

INSERT INTO voice_aliases (menu_id,alias_ko)

SELECT id,'애플 브리오슈 세트' FROM menus WHERE name_ko='애플 크림 브리오슈 세트';



INSERT INTO voice_aliases (menu_id,alias_ko)

SELECT id,'햄 스페셜' FROM menus WHERE name_ko='햄스페셜 토스트';

INSERT INTO voice_aliases (menu_id,alias_ko)

SELECT id,'베이컨 베스트' FROM menus WHERE name_ko='베이컨 베스트';

INSERT INTO voice_aliases (menu_id,alias_ko)

SELECT id,'불고기 토스트' FROM menus WHERE name_ko='그릴드 불고기';



INSERT INTO voice_aliases (menu_id,alias_ko)

SELECT id,'스크램블 햄치즈 세트' FROM menus WHERE name_ko='스크램블 햄치즈 세트';

INSERT INTO voice_aliases (menu_id,alias_ko)

SELECT id,'감자 스페셜 세트' FROM menus WHERE name_ko='감자 스페셜 세트';



-- =========================================

-- 조회 예시 (음성 안내용)

-- =========================================

-- 1) 사용자가 "토스트 2쪽 그릴드 불고기"라고 말했을 때 버튼 위치 찾기

-- SELECT page_no, grid_row, grid_col

-- FROM menus m JOIN categories c ON m.category_id=c.id

-- WHERE c.name_ko='토스트' AND m.name_ko='그릴드 불고기';

--

-- 2) "토스트 1쪽 1행 2열 뭐야?" (버튼명/가격 질의)

-- SELECT name_ko, base_price_krw, is_sold_out, note

-- FROM menus m JOIN categories c ON m.category_id=c.id

-- WHERE c.name_ko='토스트' AND m.page_no=1 AND m.grid_row=1 AND m.grid_col=2;



/* ============================================================

   1) 토스트 세트 → 토스트와 이름·위치 동기화 (가격은 그대로 유지)

   - 세트 이름: <토스트 이름> + ' 세트'

   - 세트 버튼 위치: 토스트와 같은 page_no / grid_row / grid_col

   - base_price_krw(가격)는 변경하지 않음

   ============================================================ */



-- 토스트/토스트 세트 카테고리 id 확보용 (옵션)

-- SELECT * FROM categories;



UPDATE menus s

JOIN categories cset   ON cset.id = s.category_id AND cset.name_ko = '토스트 세트'

JOIN categories ctoast ON ctoast.name_ko = '토스트'

JOIN menus t           ON t.category_id = ctoast.id

-- 세트 이름이 이미 "<토스트 이름> 세트" 이거나, "<세트에서 세트 제거>" 가 토스트 이름인 경우 매칭

   AND ( s.name_ko = CONCAT(t.name_ko, ' 세트')

      OR REPLACE(s.name_ko, ' 세트', '') = t.name_ko )

SET s.name_ko = CONCAT(t.name_ko, ' 세트'),

    s.page_no = t.page_no,

    s.grid_row = t.grid_row,

    s.grid_col = t.grid_col

-- 가격(s.base_price_krw)은 유지

;



-- 만약 세트 메뉴 중 토스트에 대응하는 항목이 없어서 매칭이 실패한 것이 있으면,

-- 아래 쿼리로 확인 후 수동 매핑/생성해 주세요.

-- SELECT s.id, s.name_ko AS set_name, s.base_price_krw, s.page_no, s.grid_row, s.grid_col

-- FROM menus s JOIN categories cset ON cset.id=s.category_id AND cset.name_ko='토스트 세트'

-- LEFT JOIN menus t ON t.name_ko=REPLACE(s.name_ko,' 세트','')

-- WHERE t.id IS NULL;  -- TODO: 결과 있으면 이름 오탈자/누락 확인



/* ============================================================

   2) 토스트(단품) 추가 옵션(사진 반영)

   - 그룹명: "토핑 추가(토스트)"  [선택가능: 0~10]  (각 항목 1개 한정)

   - 항목: 햄(+600), 치즈(+600), 기본 계란(+600), 야채(+600), 감자(+1,200)

   - 적용 대상: '토스트' 카테고리의 모든 단품

     (특정 메뉴만 허용해야 하면 WHERE 절에 이름 필터를 추가해 주세요)

   ============================================================ */



-- 옵션 그룹 생성 (이미 있으면 생략)

INSERT INTO option_groups (name_ko, select_min, select_max, sort_order)

SELECT '토핑 추가(토스트)', 0, 10, 1

WHERE NOT EXISTS (

  SELECT 1 FROM option_groups WHERE name_ko='토핑 추가(토스트)'

);



-- 그룹 id 확보

-- SELECT id FROM option_groups WHERE name_ko='토핑 추가(토스트)';



-- 옵션 항목들(중복 방지 삽입)

INSERT INTO options (option_group_id, name_ko, add_price_krw, is_sold_out, sort_order)

SELECT og.id, '햄', 600, 0, 1

FROM option_groups og

WHERE og.name_ko='토핑 추가(토스트)'

  AND NOT EXISTS (SELECT 1 FROM options o WHERE o.option_group_id=og.id AND o.name_ko='햄');



INSERT INTO options (option_group_id, name_ko, add_price_krw, is_sold_out, sort_order)

SELECT og.id, '치즈', 600, 0, 2

FROM option_groups og

WHERE og.name_ko='토핑 추가(토스트)'

  AND NOT EXISTS (SELECT 1 FROM options o WHERE o.option_group_id=og.id AND o.name_ko='치즈');



INSERT INTO options (option_group_id, name_ko, add_price_krw, is_sold_out, sort_order)

SELECT og.id, '기본 계란', 600, 0, 3

FROM option_groups og

WHERE og.name_ko='토핑 추가(토스트)'

  AND NOT EXISTS (SELECT 1 FROM options o WHERE o.option_group_id=og.id AND o.name_ko='기본 계란');



INSERT INTO options (option_group_id, name_ko, add_price_krw, is_sold_out, sort_order)

SELECT og.id, '야채', 600, 0, 4

FROM option_groups og

WHERE og.name_ko='토핑 추가(토스트)'

  AND NOT EXISTS (SELECT 1 FROM options o WHERE o.option_group_id=og.id AND o.name_ko='야채');



INSERT INTO options (option_group_id, name_ko, add_price_krw, is_sold_out, sort_order)

SELECT og.id, '감자', 1200, 0, 5

FROM option_groups og

WHERE og.name_ko='토핑 추가(토스트)'

  AND NOT EXISTS (SELECT 1 FROM options o WHERE o.option_group_id=og.id AND o.name_ko='감자');



-- 토스트 카테고리 모든 단품에 옵션 그룹 연결(중복 방지)

INSERT INTO menu_option_groups (menu_id, option_group_id, sort_order)

SELECT m.id, og.id, 1

FROM menus m

JOIN categories c ON c.id=m.category_id AND c.name_ko='토스트'

JOIN option_groups og ON og.name_ko='토핑 추가(토스트)'

WHERE NOT EXISTS (

  SELECT 1 FROM menu_option_groups mog

  WHERE mog.menu_id = m.id AND mog.option_group_id = og.id

);



-- ※ 필요 시, 특정 토스트만 토핑 허용/제외하려면 위 WHERE 절에

--    AND m.name_ko IN ('프렌치 크림 브리오슈', '애플 크림 브리오슈', ...) / NOT IN (...) 으로 조정



/* ============================================================

   3) QA용 점검 쿼리

   ============================================================ */



-- 세트가 토스트와 동일 위치로 동기화되었는지 점검

-- SELECT t.name_ko AS toast, t.page_no, t.grid_row, t.grid_col,

--        s.name_ko AS toast_set, s.base_price_krw AS set_price

-- FROM menus t

-- JOIN categories ct ON ct.id=t.category_id AND ct.name_ko='토스트'

-- JOIN menus s ON s.name_ko=CONCAT(t.name_ko,' 세트')

-- JOIN categories cs ON cs.id=s.category_id AND cs.name_ko='토스트 세트'

-- ORDER BY t.page_no, t.grid_row, t.grid_col;



-- 토스트 단품에 토핑 그룹이 연결되었는지 점검

-- SELECT m.name_ko, m.page_no, m.grid_row, m.grid_col, og.name_ko AS option_group

-- FROM menus m

-- JOIN categories c ON c.id=m.category_id AND c.name_ko='토스트'

-- JOIN menu_option_groups mog ON mog.menu_id=m.id

-- JOIN option_groups og ON og.id=mog.option_group_id

-- WHERE og.name_ko='토핑 추가(토스트)'

-- ORDER BY m.page_no, m.grid_row, m.grid_col;

