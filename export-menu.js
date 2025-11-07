// export-menu.js
// DB에서 메뉴 데이터를 추출하여 menuData.js 파일을 생성하는 스크립트
// 사용법: node export-menu.js

const mysql = require('mysql2/promise');
const fs = require('fs');

// 1. DB 연결 설정 (사용자 환경에 맞게 수정)
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'kiosk_db'
};

async function exportMenuData() {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('✅ DB 연결 성공. 데이터 추출 중...');

        const [categories] = await connection.query('SELECT * FROM categories ORDER BY sort_order');
        const [menus] = await connection.query('SELECT * FROM menus WHERE is_active = 1 ORDER BY category_id, grid_row, grid_col');
        const [optionGroups] = await connection.query('SELECT * FROM option_groups ORDER BY sort_order');
        const [options] = await connection.query('SELECT * FROM options WHERE is_active = 1 ORDER BY sort_order');
        const [menuOptionGroups] = await connection.query('SELECT * FROM menu_option_groups ORDER BY sort_order');
        const [voiceAliases] = await connection.query('SELECT * FROM voice_aliases');

        // 2. 데이터를 구조화 (AI가 이해하기 쉽게)
        const menuData = categories.map(cat => ({
            id: cat.id,
            name: cat.name_ko,
            ui_tab_name: cat.ui_tab_name,
            menus: menus
                .filter(m => m.category_id === cat.id)
                .map(m => {
                    // 이 메뉴에 연결된 옵션 그룹들
                    const relevantGroupIds = menuOptionGroups
                        .filter(mog => mog.menu_id === m.id)
                        .map(mog => mog.option_group_id);

                    // 이 메뉴의 별칭들
                    const aliases = voiceAliases
                        .filter(va => va.menu_id === m.id)
                        .map(va => va.alias_ko);

                    return {
                        id: m.id,
                        name: m.name_ko,
                        price: m.base_price_krw,
                        description: m.description,
                        grid_location: `(${m.grid_row}행, ${m.grid_col}열)`,
                        aliases: [m.name_ko, ...aliases], // 기본 이름도 별칭에 포함
                        option_groups: optionGroups
                            .filter(og => relevantGroupIds.includes(og.id))
                            .map(og => ({
                                id: og.id,
                                name: og.name_ko,
                                select_min: og.select_min,
                                select_max: og.select_max,
                                options: options
                                    .filter(opt => opt.option_group_id === og.id)
                                    .map(opt => ({
                                        id: opt.id,
                                        name: opt.name_ko,
                                        add_price: opt.add_price_krw
                                    }))
                            }))
                    };
                })
        }));

        // 3. JS 파일로 저장 (import해서 쓸 수 있도록)
        const fileContent = `export const menuData = ${JSON.stringify(menuData, null, 2)};`;
        fs.writeFileSync('public/menuData.js', fileContent);
        
        console.log('✅ [public/menuData.js] 파일 생성 완료!');
        console.log(`📊 총 ${categories.length}개 카테고리, ${menus.length}개 메뉴 추출됨`);
    } catch (error) {
        console.error('❌ 오류 발생:', error.message);
        if (error.code === 'ECONNREFUSED') {
            console.error('💡 DB 연결 실패. dbConfig 설정을 확인하세요.');
        }
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

exportMenuData();

