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
            // WHERE 절에서 카테고리명 추출
            const categoryMatch = match.match(/WHERE name_ko='([^']+)'/);
            if (!categoryMatch) return;
            const categoryName = categoryMatch[1];
            const category = data.categories.find(c => c.name_ko === categoryName);
            if (!category) return;
            
            // SELECT ... FROM 사이의 부분 추출
            const selectPartMatch = match.match(/SELECT\s+id,\s*([^F]+)\s+FROM/i);
            if (!selectPartMatch) return;
            
            // 쉼표로 분리 (단, 문자열 내부의 쉼표는 제외)
            const selectPart = selectPartMatch[1].trim();
            const values = [];
            let current = '';
            let inString = false;
            
            for (let i = 0; i < selectPart.length; i++) {
                const char = selectPart[i];
                if (char === "'") {
                    inString = !inString;
                    current += char;
                } else if (char === ',' && !inString) {
                    values.push(current.trim());
                    current = '';
                } else {
                    current += char;
                }
            }
            if (current.trim()) {
                values.push(current.trim());
            }
            
            if (values.length < 2) return;
            
            // 첫 번째 값은 메뉴명 (따옴표 제거)
            const menuName = values[0].replace(/^'|'$/g, '');
            // 두 번째 값은 가격
            const price = parseInt(values[1].trim()) || 0;
            
            // 나머지 값들을 파싱
            const parsedValues = values.slice(2).map(v => {
                const trimmed = v.trim();
                if (trimmed === 'NULL' || trimmed === '') return null;
                if (!isNaN(trimmed)) return parseInt(trimmed);
                return trimmed;
            });
            
            // 형식별로 파싱
            let page_no = null;
            let grid_row = null;
            let grid_col = null;
            let is_featured = 0;
            let is_sold_out = 0;
            
            // INSERT 문의 컬럼 목록 확인
            const insertColsMatch = match.match(/INSERT INTO menus\s*\(([^)]+)\)/);
            if (insertColsMatch) {
                const cols = insertColsMatch[1].split(',').map(c => c.trim().toLowerCase());
                
                // 형식 1: (category_id, name_ko, base_price_krw, page_no, grid_row, grid_col, is_sold_out, note)
                if (cols.includes('page_no') && cols.includes('grid_row') && cols.includes('grid_col')) {
                    if (parsedValues.length >= 5) {
                        page_no = parsedValues[0] || null;
                        grid_row = parsedValues[1] || null;
                        grid_col = parsedValues[2] || null;
                        is_sold_out = parsedValues[3] || 0;
                    }
                }
                // 형식 2: (category_id, name_ko, base_price_krw, is_featured, grid_row, grid_col)
                else if (cols.includes('is_featured') && cols.includes('grid_row') && cols.includes('grid_col') && !cols.includes('page_no')) {
                    if (parsedValues.length >= 3) {
                        is_featured = parsedValues[0] || 0;
                        grid_row = parsedValues[1] || null;
                        grid_col = parsedValues[2] || null;
                    }
                }
                // 형식 3: (category_id, name_ko, base_price_krw, grid_row, grid_col, is_featured)
                else if (cols.includes('grid_row') && cols.includes('grid_col') && cols.includes('is_featured') && !cols.includes('page_no')) {
                    if (parsedValues.length >= 3) {
                        grid_row = parsedValues[0] || null;
                        grid_col = parsedValues[1] || null;
                        is_featured = parsedValues[2] || 0;
                    }
                }
                // 형식 4: (category_id, name_ko, base_price_krw, is_sold_out)
                else if (cols.includes('is_sold_out') && !cols.includes('grid_row') && !cols.includes('grid_col')) {
                    if (parsedValues.length >= 1) {
                        is_sold_out = parsedValues[0] || 0;
                    }
                }
                // 형식 5: (category_id, name_ko, base_price_krw) - grid_row, grid_col은 null
            }
            
            data.menus.push({
                id: data.menus.length + 1,
                category_id: category.id,
                name_ko: menuName,
                base_price_krw: price,
                page_no: page_no,
                grid_row: grid_row,
                grid_col: grid_col,
                is_featured: is_featured,
                is_sold_out: is_sold_out,
                is_active: 1
            });
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
            // WHERE 절에서 그룹명 추출
            const groupMatch = match.match(/WHERE name_ko='([^']+)'/);
            if (!groupMatch) return;
            const groupName = groupMatch[1];
            const group = data.optionGroups.find(g => g.name_ko === groupName);
            if (!group) return;
            
            // SELECT 절에서 값들 추출
            const selectMatch = match.match(/SELECT\s+id,\s*'([^']+)',\s*([^,]+)(?:,\s*([^,]+))?(?:,\s*([^,]+))?\s+FROM/);
            if (!selectMatch) return;
            
            const optionName = selectMatch[1];
            const addPrice = parseInt(selectMatch[2].trim());
            
            // 나머지 값들 파싱
            let is_sold_out = 0;
            let sort_order = 0;
            
            // 형식 1: SELECT id, '옵션명', 가격, is_sold_out, sort_order FROM (toast)
            if (selectMatch[3] && selectMatch[4]) {
                is_sold_out = parseInt(selectMatch[3].trim()) || 0;
                sort_order = parseInt(selectMatch[4].trim()) || 0;
            }
            // 형식 2: SELECT id, '옵션명', 가격, sort_order FROM (일반)
            else if (selectMatch[3]) {
                sort_order = parseInt(selectMatch[3].trim()) || 0;
            }
            
            data.options.push({
                id: data.options.length + 1,
                option_group_id: group.id,
                name_ko: optionName,
                add_price_krw: addPrice,
                sort_order: sort_order,
                is_sold_out: is_sold_out,
                is_active: 1
            });
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
                    description: menu.description || null,
                    page_no: menu.page_no || null,
                    grid_row: menu.grid_row,
                    grid_col: menu.grid_col,
                    grid_location: menu.grid_row && menu.grid_col ? `(${menu.grid_row}행, ${menu.grid_col}열)` : null,
                    is_featured: menu.is_featured || 0,
                    is_sold_out: menu.is_sold_out || 0,
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
                                    add_price: opt.add_price_krw,
                                    is_sold_out: opt.is_sold_out || 0
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

