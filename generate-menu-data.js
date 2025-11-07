// generate-menu-data.js
// SQL 파일을 파싱하여 menuData.js 파일을 생성하는 스크립트
// 사용법: node generate-menu-data.js

const fs = require('fs');
const path = require('path');

// SQL 파일을 파싱하여 데이터 추출
function parseSQLFile(sqlFilePath) {
    let sqlContent = fs.readFileSync(sqlFilePath, 'utf-8');
    
    // 여러 줄에 걸친 SQL을 한 줄로 정규화 (주석 제거, 공백 정리)
    sqlContent = sqlContent.replace(/--[^\n]*/g, ''); // 주석 제거
    sqlContent = sqlContent.replace(/\n\s*\n/g, '\n'); // 빈 줄 제거
    sqlContent = sqlContent.replace(/\s+/g, ' '); // 여러 공백을 하나로
    
    // 데이터 저장용 객체
    const data = {
        categories: [],
        menus: [],
        optionGroups: [],
        options: [],
        menuOptionGroups: [],
        voiceAliases: []
    };
    
    // 카테고리 파싱
    const categoryMatches = sqlContent.match(/INSERT INTO categories[^;]+;/g);
    if (categoryMatches) {
        categoryMatches.forEach(match => {
            const valuesMatch = match.match(/VALUES\s*\(([^)]+)\)/);
            if (valuesMatch) {
                const values = valuesMatch[1].split(',').map(v => v.trim().replace(/^'|'$/g, ''));
                // banziha: (name_ko, ui_tab_name, sort_order)
                // toast: (name_ko, sort_order)
                if (values.length === 3) {
                    data.categories.push({
                        id: data.categories.length + 1,
                        name_ko: values[0],
                        ui_tab_name: values[1] || values[0], // toast에는 없으므로 name_ko 사용
                        sort_order: parseInt(values[2]) || parseInt(values[1]) || 0
                    });
                } else if (values.length === 2) {
                    data.categories.push({
                        id: data.categories.length + 1,
                        name_ko: values[0],
                        ui_tab_name: values[0], // toast는 name_ko를 ui_tab_name으로 사용
                        sort_order: parseInt(values[1]) || 0
                    });
                }
            }
        });
    }
    
    // 메뉴 파싱 (SELECT를 사용하는 INSERT)
    const menuMatches = sqlContent.match(/INSERT INTO menus[^;]+;/g);
    if (menuMatches) {
        menuMatches.forEach(match => {
            // SELECT id, '메뉴명', 가격, grid_row, grid_col FROM categories WHERE name_ko='카테고리명'
            const selectMatch = match.match(/SELECT\s+id,\s*'([^']+)',\s*(\d+),\s*(\d+),\s*(\d+)\s+FROM categories WHERE name_ko='([^']+)'/);
            if (selectMatch) {
                const categoryName = selectMatch[5];
                const category = data.categories.find(c => c.name_ko === categoryName);
                if (category) {
                    data.menus.push({
                        id: data.menus.length + 1,
                        category_id: category.id,
                        name_ko: selectMatch[1],
                        base_price_krw: parseInt(selectMatch[2]),
                        grid_row: parseInt(selectMatch[3]),
                        grid_col: parseInt(selectMatch[4]),
                        is_active: 1
                    });
                }
            }
            // toast 형식: SELECT id,'메뉴명',가격,grid_row,grid_col,is_featured FROM categories WHERE name_ko='카테고리명'
            const selectMatchToast = match.match(/SELECT\s+id,\s*'([^']+)',\s*(\d+),\s*(\d+),\s*(\d+),\s*(\d+)\s+FROM categories WHERE name_ko='([^']+)'/);
            if (selectMatchToast) {
                const categoryName = selectMatchToast[6];
                const category = data.categories.find(c => c.name_ko === categoryName);
                if (category) {
                    data.menus.push({
                        id: data.menus.length + 1,
                        category_id: category.id,
                        name_ko: selectMatchToast[1],
                        base_price_krw: parseInt(selectMatchToast[2]),
                        grid_row: parseInt(selectMatchToast[3]),
                        grid_col: parseInt(selectMatchToast[4]),
                        is_active: 1
                    });
                }
            }
            // grid_row/grid_col 없는 경우 (toast의 커피/음료)
            const selectMatchNoGrid = match.match(/SELECT\s+id,\s*'([^']+)',\s*(\d+)\s+FROM categories WHERE name_ko='([^']+)'/);
            if (selectMatchNoGrid && !selectMatch && !selectMatchToast) {
                const categoryName = selectMatchNoGrid[3];
                const category = data.categories.find(c => c.name_ko === categoryName);
                if (category) {
                    data.menus.push({
                        id: data.menus.length + 1,
                        category_id: category.id,
                        name_ko: selectMatchNoGrid[1],
                        base_price_krw: parseInt(selectMatchNoGrid[2]),
                        grid_row: null,
                        grid_col: null,
                        is_active: 1
                    });
                }
            }
        });
    }
    
    // 옵션 그룹 파싱
    const optionGroupMatches = sqlContent.match(/INSERT INTO option_groups[^;]+;/g);
    if (optionGroupMatches) {
        optionGroupMatches.forEach(match => {
            const valuesMatch = match.match(/VALUES\s*\(([^)]+)\)/);
            if (valuesMatch) {
                const values = valuesMatch[1].split(',').map(v => v.trim().replace(/^'|'$/g, ''));
                data.optionGroups.push({
                    id: data.optionGroups.length + 1,
                    name_ko: values[0],
                    select_min: parseInt(values[1]) || 0,
                    select_max: parseInt(values[2]) || 1,
                    sort_order: parseInt(values[3]) || 0
                });
            }
        });
    }
    
    // 옵션 파싱
    const optionMatches = sqlContent.match(/INSERT INTO options[^;]+;/g);
    if (optionMatches) {
        optionMatches.forEach(match => {
            // SELECT id, '옵션명', 가격, sort_order FROM option_groups WHERE name_ko='그룹명'
            const selectMatch = match.match(/SELECT\s+id,\s*'([^']+)',\s*(\d+),\s*(\d+)\s+FROM option_groups WHERE name_ko='([^']+)'/);
            if (selectMatch) {
                const groupName = selectMatch[4];
                const group = data.optionGroups.find(g => g.name_ko === groupName);
                if (group) {
                    data.options.push({
                        id: data.options.length + 1,
                        option_group_id: group.id,
                        name_ko: selectMatch[1],
                        add_price_krw: parseInt(selectMatch[2]),
                        sort_order: parseInt(selectMatch[3]),
                        is_active: 1
                    });
                }
            }
            // SELECT id, '옵션명', 가격, is_sold_out, sort_order FROM option_groups WHERE name_ko='그룹명' (toast)
            const selectMatchToast = match.match(/SELECT\s+id,\s*'([^']+)',\s*(\d+),\s*(\d+),\s*(\d+)\s+FROM option_groups WHERE name_ko='([^']+)'/);
            if (selectMatchToast) {
                const groupName = selectMatchToast[5];
                const group = data.optionGroups.find(g => g.name_ko === groupName);
                if (group) {
                    data.options.push({
                        id: data.options.length + 1,
                        option_group_id: group.id,
                        name_ko: selectMatchToast[1],
                        add_price_krw: parseInt(selectMatchToast[2]),
                        sort_order: parseInt(selectMatchToast[4]),
                        is_active: 1
                    });
                }
            }
        });
    }
    
    // 메뉴-옵션그룹 매핑 파싱
    const mappingMatches = sqlContent.match(/INSERT INTO menu_option_groups[^;]+;/g);
    if (mappingMatches) {
        mappingMatches.forEach(match => {
            // SELECT m.id, g.id, sort_order FROM menus m JOIN categories c ON m.category_id=c.id JOIN option_groups g ON g.name_ko='그룹명' WHERE c.name_ko='카테고리명'
            const selectMatch = match.match(/SELECT\s+m\.id,\s*g\.id,\s*(\d+)\s+FROM menus m[^W]+WHERE c\.name_ko='([^']+)'/);
            if (selectMatch) {
                const categoryName = selectMatch[2];
                const groupNameMatch = match.match(/g\.name_ko='([^']+)'/);
                if (groupNameMatch) {
                    const groupName = groupNameMatch[1];
                    const category = data.categories.find(c => c.name_ko === categoryName);
                    const group = data.optionGroups.find(g => g.name_ko === groupName);
                    if (category && group) {
                        const menusInCategory = data.menus.filter(m => m.category_id === category.id);
                        menusInCategory.forEach(menu => {
                            data.menuOptionGroups.push({
                                menu_id: menu.id,
                                option_group_id: group.id,
                                sort_order: parseInt(selectMatch[1]) || 0
                            });
                        });
                    }
                }
            }
        });
    }
    
    // 음성 별칭 파싱
    const aliasMatches = sqlContent.match(/INSERT INTO voice_aliases[^;]+;/g);
    if (aliasMatches) {
        aliasMatches.forEach(match => {
            // SELECT id, '별칭' FROM menus WHERE name_ko='메뉴명'
            const selectMatch = match.match(/SELECT\s+id,\s*'([^']+)'\s+FROM menus WHERE name_ko='([^']+)'/);
            if (selectMatch) {
                const menuName = selectMatch[2];
                const menu = data.menus.find(m => m.name_ko === menuName);
                if (menu) {
                    data.voiceAliases.push({
                        id: data.voiceAliases.length + 1,
                        menu_id: menu.id,
                        alias_ko: selectMatch[1]
                    });
                }
            }
        });
    }
    
    return data;
}

// 데이터를 menuData 구조로 변환
function convertToMenuData(data) {
    return data.categories.map(cat => {
        const categoryMenus = data.menus.filter(m => m.category_id === cat.id && m.is_active === 1);
        
        return {
            id: cat.id,
            name: cat.name_ko,
            ui_tab_name: cat.ui_tab_name,
            menus: categoryMenus.map(menu => {
                // 이 메뉴에 연결된 옵션 그룹들
                const relevantGroupIds = data.menuOptionGroups
                    .filter(mog => mog.menu_id === menu.id)
                    .map(mog => mog.option_group_id);
                
                // 이 메뉴의 별칭들
                const aliases = data.voiceAliases
                    .filter(va => va.menu_id === menu.id)
                    .map(va => va.alias_ko);
                
                return {
                    id: menu.id,
                    name: menu.name_ko,
                    price: menu.base_price_krw,
                    description: menu.description || '',
                    grid_row: menu.grid_row,
                    grid_col: menu.grid_col,
                    grid_location: menu.grid_row && menu.grid_col ? `(${menu.grid_row}행, ${menu.grid_col}열)` : null,
                    aliases: [menu.name_ko, ...aliases],
                    option_groups: data.optionGroups
                        .filter(og => relevantGroupIds.includes(og.id))
                        .map(og => ({
                            id: og.id,
                            name: og.name_ko,
                            select_min: og.select_min,
                            select_max: og.select_max,
                            options: data.options
                                .filter(opt => opt.option_group_id === og.id && opt.is_active === 1)
                                .map(opt => ({
                                    id: opt.id,
                                    name: opt.name_ko,
                                    add_price: opt.add_price_krw
                                }))
                        }))
                };
            })
        };
    });
}

// 메인 함수
function generateMenuData(sqlFilePath, outputFilePath) {
    console.log(`📖 SQL 파일 읽는 중: ${sqlFilePath}`);
    const data = parseSQLFile(sqlFilePath);
    
    console.log(`✅ 파싱 완료:`);
    console.log(`   - 카테고리: ${data.categories.length}개`);
    console.log(`   - 메뉴: ${data.menus.length}개`);
    console.log(`   - 옵션 그룹: ${data.optionGroups.length}개`);
    console.log(`   - 옵션: ${data.options.length}개`);
    console.log(`   - 매핑: ${data.menuOptionGroups.length}개`);
    console.log(`   - 별칭: ${data.voiceAliases.length}개`);
    
    const menuData = convertToMenuData(data);
    
    const fileContent = `export const menuData = ${JSON.stringify(menuData, null, 2)};`;
    fs.writeFileSync(outputFilePath, fileContent, 'utf-8');
    
    console.log(`✅ [${outputFilePath}] 파일 생성 완료!`);
}

// 실행
const banzihaSqlPath = path.join(__dirname, 'kiosk_voice_guide_menu_banziha.sql');
const toastSqlPath = path.join(__dirname, 'kiosk_voice_guide_menu_toast.sql');
const banzihaOutputPath = path.join(__dirname, 'public', 'menuData_banziha.js');
const toastOutputPath = path.join(__dirname, 'public', 'menuData_toast.js');

if (fs.existsSync(banzihaSqlPath)) {
    generateMenuData(banzihaSqlPath, banzihaOutputPath);
} else {
    console.error(`❌ 파일을 찾을 수 없습니다: ${banzihaSqlPath}`);
}

if (fs.existsSync(toastSqlPath)) {
    generateMenuData(toastSqlPath, toastOutputPath);
} else {
    console.error(`❌ 파일을 찾을 수 없습니다: ${toastSqlPath}`);
}

