#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""SQL 파일을 파싱하여 menuData_toast.js 파일을 생성하는 스크립트"""

import re
import json
import os

def parse_sql_file(sql_file_path):
    """SQL 파일을 파싱하여 데이터 추출"""
    with open(sql_file_path, 'r', encoding='utf-8') as f:
        sql_content = f.read()
    
    data = {
        'categories': [],
        'menus': [],
        'option_groups': [],
        'options': [],
        'menu_option_groups': [],
        'voice_aliases': []
    }
    
    # 카테고리 파싱
    category_pattern = r"INSERT INTO categories\s+\([^)]+\)\s+VALUES\s+\(([^)]+)\)"
    for match in re.finditer(category_pattern, sql_content, re.IGNORECASE):
        values = [v.strip().strip("'") for v in match.group(1).split(',')]
        if len(values) >= 2:
            data['categories'].append({
                'id': len(data['categories']) + 1,
                'name_ko': values[0],
                'sort_order': int(values[1]) if values[1].isdigit() else 0
            })
    
    # 메뉴 파싱
    menu_pattern = r"INSERT INTO menus\s+\(([^)]+)\)\s+SELECT\s+id,\s*'([^']+)',\s*(\d+)(?:,\s*([^,]+))?(?:,\s*([^,]+))?(?:,\s*([^,]+))?(?:,\s*([^,]+))?(?:,\s*([^,]+))?\s+FROM categories WHERE name_ko='([^']+)'"
    for match in re.finditer(menu_pattern, sql_content, re.IGNORECASE):
        cols = [c.strip().lower() for c in match.group(1).split(',')]
        menu_name = match.group(2)
        price = int(match.group(3))
        category_name = match.group(9) if len(match.groups()) >= 9 else None
        
        category = next((c for c in data['categories'] if c['name_ko'] == category_name), None)
        if not category:
            continue
        
        # 나머지 값들 파싱
        values = []
        for i in range(4, min(9, len(match.groups()) + 1)):
            if match.group(i):
                val = match.group(i).strip()
                if val.upper() == 'NULL' or val == '':
                    values.append(None)
                elif val.isdigit():
                    values.append(int(val))
                else:
                    values.append(val)
        
        page_no = None
        grid_row = None
        grid_col = None
        is_featured = 0
        is_sold_out = 0
        
        # 컬럼에 따라 값 매핑
        if 'page_no' in cols and 'grid_row' in cols and 'grid_col' in cols:
            if len(values) >= 5:
                page_no = values[0]
                grid_row = values[1]
                grid_col = values[2]
                is_sold_out = values[3] if values[3] is not None else 0
        elif 'is_featured' in cols and 'grid_row' in cols and 'grid_col' in cols:
            if len(values) >= 3:
                is_featured = values[0] if values[0] is not None else 0
                grid_row = values[1]
                grid_col = values[2]
        elif 'grid_row' in cols and 'grid_col' in cols and 'is_featured' in cols:
            if len(values) >= 3:
                grid_row = values[0]
                grid_col = values[1]
                is_featured = values[2] if values[2] is not None else 0
        elif 'is_sold_out' in cols and 'grid_row' not in cols:
            if len(values) >= 1:
                is_sold_out = values[0] if values[0] is not None else 0
        
        data['menus'].append({
            'id': len(data['menus']) + 1,
            'category_id': category['id'],
            'name_ko': menu_name,
            'base_price_krw': price,
            'page_no': page_no,
            'grid_row': grid_row,
            'grid_col': grid_col,
            'is_featured': is_featured,
            'is_sold_out': is_sold_out,
            'is_active': 1
        })
    
    # 옵션 그룹 파싱
    og_pattern = r"INSERT INTO option_groups\s+\([^)]+\)\s+VALUES\s+\(([^)]+)\)"
    for match in re.finditer(og_pattern, sql_content, re.IGNORECASE):
        values = [v.strip().strip("'") for v in match.group(1).split(',')]
        if len(values) >= 4:
            data['option_groups'].append({
                'id': len(data['option_groups']) + 1,
                'name_ko': values[0],
                'select_min': int(values[1]) if values[1].isdigit() else 0,
                'select_max': int(values[2]) if values[2].isdigit() else 1,
                'sort_order': int(values[3]) if values[3].isdigit() else 0
            })
    
    # 옵션 파싱
    opt_pattern = r"SELECT\s+id,\s*'([^']+)',\s*(\d+)(?:,\s*(\d+))?(?:,\s*(\d+))?\s+FROM option_groups WHERE name_ko='([^']+)'"
    for match in re.finditer(opt_pattern, sql_content, re.IGNORECASE):
        option_name = match.group(1)
        add_price = int(match.group(2))
        group_name = match.group(5) if len(match.groups()) >= 5 else None
        
        group = next((g for g in data['option_groups'] if g['name_ko'] == group_name), None)
        if not group:
            continue
        
        is_sold_out = 0
        sort_order = 0
        
        if len(match.groups()) >= 4 and match.group(3) and match.group(4):
            is_sold_out = int(match.group(3))
            sort_order = int(match.group(4))
        elif len(match.groups()) >= 3 and match.group(3):
            sort_order = int(match.group(3))
        
        data['options'].append({
            'id': len(data['options']) + 1,
            'option_group_id': group['id'],
            'name_ko': option_name,
            'add_price_krw': add_price,
            'sort_order': sort_order,
            'is_sold_out': is_sold_out,
            'is_active': 1
        })
    
    # 메뉴-옵션그룹 매핑 파싱
    mog_pattern = r"SELECT\s+m\.id,\s*og\.id,\s*(\d+)\s+FROM menus m[^W]+WHERE c\.name_ko='([^']+)'[^']+g\.name_ko='([^']+)'"
    for match in re.finditer(mog_pattern, sql_content, re.IGNORECASE):
        sort_order = int(match.group(1))
        category_name = match.group(2)
        group_name = match.group(3)
        
        category = next((c for c in data['categories'] if c['name_ko'] == category_name), None)
        group = next((g for g in data['option_groups'] if g['name_ko'] == group_name), None)
        
        if category and group:
            menus_in_category = [m for m in data['menus'] if m['category_id'] == category['id']]
            for menu in menus_in_category:
                data['menu_option_groups'].append({
                    'menu_id': menu['id'],
                    'option_group_id': group['id'],
                    'sort_order': sort_order
                })
    
    # 음성 별칭 파싱
    alias_pattern = r"SELECT\s+id,\s*'([^']+)'\s+FROM menus WHERE name_ko='([^']+)'"
    for match in re.finditer(alias_pattern, sql_content, re.IGNORECASE):
        alias = match.group(1)
        menu_name = match.group(2)
        
        menu = next((m for m in data['menus'] if m['name_ko'] == menu_name), None)
        if menu:
            data['voice_aliases'].append({
                'id': len(data['voice_aliases']) + 1,
                'menu_id': menu['id'],
                'alias_ko': alias
            })
    
    return data

def convert_to_menu_data(data):
    """데이터를 menuData 구조로 변환"""
    result = []
    
    for cat in sorted(data['categories'], key=lambda x: x['sort_order']):
        category_menus = [m for m in data['menus'] if m['category_id'] == cat['id'] and m['is_active'] == 1]
        
        menu_list = []
        for menu in category_menus:
            # 연결된 옵션 그룹들
            relevant_group_ids = [
                mog['option_group_id'] 
                for mog in data['menu_option_groups'] 
                if mog['menu_id'] == menu['id']
            ]
            
            # 별칭들
            aliases = [
                va['alias_ko'] 
                for va in data['voice_aliases'] 
                if va['menu_id'] == menu['id']
            ]
            
            # 옵션 그룹들 구성
            option_groups = []
            for og in data['option_groups']:
                if og['id'] in relevant_group_ids:
                    options = [
                        {
                            'id': opt['id'],
                            'name': opt['name_ko'],
                            'add_price': opt['add_price_krw'],
                            'is_sold_out': opt['is_sold_out']
                        }
                        for opt in data['options']
                        if opt['option_group_id'] == og['id'] and opt['is_active'] == 1
                    ]
                    option_groups.append({
                        'id': og['id'],
                        'name': og['name_ko'],
                        'select_min': og['select_min'],
                        'select_max': og['select_max'],
                        'options': options
                    })
            
            menu_list.append({
                'id': menu['id'],
                'name': menu['name_ko'],
                'price': menu['base_price_krw'],
                'description': None,
                'page_no': menu['page_no'],
                'grid_row': menu['grid_row'],
                'grid_col': menu['grid_col'],
                'grid_location': f"({menu['grid_row']}행, {menu['grid_col']}열)" if menu['grid_row'] and menu['grid_col'] else None,
                'is_featured': bool(menu['is_featured']),
                'is_sold_out': bool(menu['is_sold_out']),
                'aliases': [menu['name_ko']] + aliases,
                'option_groups': option_groups
            })
        
        result.append({
            'id': cat['id'],
            'name': cat['name_ko'],
            'ui_tab_name': cat['name_ko'],
            'menus': menu_list
        })
    
    return result

def main():
    sql_file = 'kiosk_voice_guide_menu_toast.sql'
    output_file = 'public/menuData_toast.js'
    
    print(f'📖 SQL 파일 읽는 중: {sql_file}')
    data = parse_sql_file(sql_file)
    
    print(f'✅ 파싱 완료:')
    print(f'   - 카테고리: {len(data["categories"])}개')
    print(f'   - 메뉴: {len(data["menus"])}개')
    print(f'   - 옵션 그룹: {len(data["option_groups"])}개')
    print(f'   - 옵션: {len(data["options"])}개')
    print(f'   - 매핑: {len(data["menu_option_groups"])}개')
    print(f'   - 별칭: {len(data["voice_aliases"])}개')
    
    menu_data = convert_to_menu_data(data)
    
    # JavaScript 파일로 출력
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write('// menuData_toast.js\n')
        f.write('// kiosk_voice_guide_menu_toast.sql 파일의 데이터를 기반으로 생성된 메뉴 데이터\n\n')
        f.write('export const menuData = ')
        f.write(json.dumps(menu_data, ensure_ascii=False, indent=2))
        f.write(';\n')
    
    print(f'✅ [{output_file}] 파일 생성 완료!')

if __name__ == '__main__':
    main()

