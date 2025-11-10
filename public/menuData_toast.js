// menuData_toast.js
// kiosk_voice_guide_menu_toast.sql 파일의 데이터를 기반으로 생성된 메뉴 데이터

export const menuData = [
  {
    "id": 1,
    "name": "추천",
    "ui_tab_name": "추천",
    "menus": []
  },
  {
    "id": 2,
    "name": "토스트 세트",
    "ui_tab_name": "토스트 세트",
    "menus": [
      {
        "id": 1,
        "name": "프렌치 크림 브리오슈 세트",
        "price": 7000,
        "description": null,
        "page_no": 1,
        "grid_row": 1,
        "grid_col": 1,
        "grid_location": "(1행, 1열)",
        "is_featured": true,
        "is_sold_out": false,
        "aliases": ["프렌치 크림 브리오슈 세트", "프렌치 크림 세트"],
        "option_groups": [
          {
            "id": 1,
            "name": "사이드(필수)",
            "select_min": 1,
            "select_max": 1,
            "options": [
              {"id": 1, "name": "포테이토 팝", "add_price": 0, "is_sold_out": false},
              {"id": 2, "name": "치즈 팝", "add_price": 700, "is_sold_out": true},
              {"id": 3, "name": "어니언 포테이토 팝", "add_price": 700, "is_sold_out": true},
              {"id": 4, "name": "포테이토 팝(버터갈릭)", "add_price": 300, "is_sold_out": false},
              {"id": 5, "name": "포테이토 팝(칠리)", "add_price": 300, "is_sold_out": false},
              {"id": 6, "name": "포테이토 팝(치즈즈)", "add_price": 300, "is_sold_out": false},
              {"id": 7, "name": "코울슬로", "add_price": 800, "is_sold_out": false}
            ]
          },
          {
            "id": 2,
            "name": "음료(필수)",
            "select_min": 1,
            "select_max": 1,
            "options": [
              {"id": 8, "name": "콜라", "add_price": 0, "is_sold_out": false},
              {"id": 9, "name": "제로 콜라", "add_price": 0, "is_sold_out": false},
              {"id": 10, "name": "사이다", "add_price": 0, "is_sold_out": false},
              {"id": 11, "name": "제로 사이다", "add_price": 0, "is_sold_out": false},
              {"id": 12, "name": "핫 아메리카노", "add_price": 800, "is_sold_out": false},
              {"id": 13, "name": "아이스 아메리카노", "add_price": 800, "is_sold_out": false},
              {"id": 14, "name": "핫 디카페인 아메리카노", "add_price": 1300, "is_sold_out": false},
              {"id": 15, "name": "아이스 디카페인 아메리카노", "add_price": 1300, "is_sold_out": false},
              {"id": 16, "name": "오렌지주스", "add_price": 400, "is_sold_out": false}
            ]
          }
        ]
      },
      {
        "id": 2,
        "name": "애플 크림 브리오슈 세트",
        "price": 6600,
        "description": null,
        "page_no": 1,
        "grid_row": 1,
        "grid_col": 2,
        "grid_location": "(1행, 2열)",
        "is_featured": true,
        "is_sold_out": false,
        "aliases": ["애플 크림 브리오슈 세트", "애플 브리오슈 세트"],
        "option_groups": [
          {
            "id": 1,
            "name": "사이드(필수)",
            "select_min": 1,
            "select_max": 1,
            "options": [
              {"id": 1, "name": "포테이토 팝", "add_price": 0, "is_sold_out": false},
              {"id": 2, "name": "치즈 팝", "add_price": 700, "is_sold_out": true},
              {"id": 3, "name": "어니언 포테이토 팝", "add_price": 700, "is_sold_out": true},
              {"id": 4, "name": "포테이토 팝(버터갈릭)", "add_price": 300, "is_sold_out": false},
              {"id": 5, "name": "포테이토 팝(칠리)", "add_price": 300, "is_sold_out": false},
              {"id": 6, "name": "포테이토 팝(치즈즈)", "add_price": 300, "is_sold_out": false},
              {"id": 7, "name": "코울슬로", "add_price": 800, "is_sold_out": false}
            ]
          },
          {
            "id": 2,
            "name": "음료(필수)",
            "select_min": 1,
            "select_max": 1,
            "options": [
              {"id": 8, "name": "콜라", "add_price": 0, "is_sold_out": false},
              {"id": 9, "name": "제로 콜라", "add_price": 0, "is_sold_out": false},
              {"id": 10, "name": "사이다", "add_price": 0, "is_sold_out": false},
              {"id": 11, "name": "제로 사이다", "add_price": 0, "is_sold_out": false},
              {"id": 12, "name": "핫 아메리카노", "add_price": 800, "is_sold_out": false},
              {"id": 13, "name": "아이스 아메리카노", "add_price": 800, "is_sold_out": false},
              {"id": 14, "name": "핫 디카페인 아메리카노", "add_price": 1300, "is_sold_out": false},
              {"id": 15, "name": "아이스 디카페인 아메리카노", "add_price": 1300, "is_sold_out": false},
              {"id": 16, "name": "오렌지주스", "add_price": 400, "is_sold_out": false}
            ]
          }
        ]
      },
      {
        "id": 3,
        "name": "소이 크런치 치킨 세트",
        "price": 8000,
        "description": null,
        "page_no": 1,
        "grid_row": 1,
        "grid_col": 3,
        "grid_location": "(1행, 3열)",
        "is_featured": false,
        "is_sold_out": false,
        "aliases": [],
        "option_groups": [
          {
            "id": 1,
            "name": "사이드(필수)",
            "select_min": 1,
            "select_max": 1,
            "options": [
              {"id": 1, "name": "포테이토 팝", "add_price": 0, "is_sold_out": false},
              {"id": 2, "name": "치즈 팝", "add_price": 700, "is_sold_out": true},
              {"id": 3, "name": "어니언 포테이토 팝", "add_price": 700, "is_sold_out": true},
              {"id": 4, "name": "포테이토 팝(버터갈릭)", "add_price": 300, "is_sold_out": false},
              {"id": 5, "name": "포테이토 팝(칠리)", "add_price": 300, "is_sold_out": false},
              {"id": 6, "name": "포테이토 팝(치즈즈)", "add_price": 300, "is_sold_out": false},
              {"id": 7, "name": "코울슬로", "add_price": 800, "is_sold_out": false}
            ]
          },
          {
            "id": 2,
            "name": "음료(필수)",
            "select_min": 1,
            "select_max": 1,
            "options": [
              {"id": 8, "name": "콜라", "add_price": 0, "is_sold_out": false},
              {"id": 9, "name": "제로 콜라", "add_price": 0, "is_sold_out": false},
              {"id": 10, "name": "사이다", "add_price": 0, "is_sold_out": false},
              {"id": 11, "name": "제로 사이다", "add_price": 0, "is_sold_out": false},
              {"id": 12, "name": "핫 아메리카노", "add_price": 800, "is_sold_out": false},
              {"id": 13, "name": "아이스 아메리카노", "add_price": 800, "is_sold_out": false},
              {"id": 14, "name": "핫 디카페인 아메리카노", "add_price": 1300, "is_sold_out": false},
              {"id": 15, "name": "아이스 디카페인 아메리카노", "add_price": 1300, "is_sold_out": false},
              {"id": 16, "name": "오렌지주스", "add_price": 400, "is_sold_out": false}
            ]
          }
        ]
      },
      {
        "id": 4,
        "name": "리얼 양념치킨 세트",
        "price": 7900,
        "description": null,
        "page_no": 1,
        "grid_row": 1,
        "grid_col": 4,
        "grid_location": "(1행, 4열)",
        "is_featured": false,
        "is_sold_out": false,
        "aliases": [],
        "option_groups": [
          {
            "id": 1,
            "name": "사이드(필수)",
            "select_min": 1,
            "select_max": 1,
            "options": [
              {"id": 1, "name": "포테이토 팝", "add_price": 0, "is_sold_out": false},
              {"id": 2, "name": "치즈 팝", "add_price": 700, "is_sold_out": true},
              {"id": 3, "name": "어니언 포테이토 팝", "add_price": 700, "is_sold_out": true},
              {"id": 4, "name": "포테이토 팝(버터갈릭)", "add_price": 300, "is_sold_out": false},
              {"id": 5, "name": "포테이토 팝(칠리)", "add_price": 300, "is_sold_out": false},
              {"id": 6, "name": "포테이토 팝(치즈즈)", "add_price": 300, "is_sold_out": false},
              {"id": 7, "name": "코울슬로", "add_price": 800, "is_sold_out": false}
            ]
          },
          {
            "id": 2,
            "name": "음료(필수)",
            "select_min": 1,
            "select_max": 1,
            "options": [
              {"id": 8, "name": "콜라", "add_price": 0, "is_sold_out": false},
              {"id": 9, "name": "제로 콜라", "add_price": 0, "is_sold_out": false},
              {"id": 10, "name": "사이다", "add_price": 0, "is_sold_out": false},
              {"id": 11, "name": "제로 사이다", "add_price": 0, "is_sold_out": false},
              {"id": 12, "name": "핫 아메리카노", "add_price": 800, "is_sold_out": false},
              {"id": 13, "name": "아이스 아메리카노", "add_price": 800, "is_sold_out": false},
              {"id": 14, "name": "핫 디카페인 아메리카노", "add_price": 1300, "is_sold_out": false},
              {"id": 15, "name": "아이스 디카페인 아메리카노", "add_price": 1300, "is_sold_out": false},
              {"id": 16, "name": "오렌지주스", "add_price": 400, "is_sold_out": false}
            ]
          }
        ]
      },
      {
        "id": 5,
        "name": "프렌치 에그마요 세트",
        "price": 6800,
        "description": null,
        "page_no": 1,
        "grid_row": 2,
        "grid_col": 1,
        "grid_location": "(2행, 1열)",
        "is_featured": false,
        "is_sold_out": false,
        "aliases": [],
        "option_groups": [
          {
            "id": 1,
            "name": "사이드(필수)",
            "select_min": 1,
            "select_max": 1,
            "options": [
              {"id": 1, "name": "포테이토 팝", "add_price": 0, "is_sold_out": false},
              {"id": 2, "name": "치즈 팝", "add_price": 700, "is_sold_out": true},
              {"id": 3, "name": "어니언 포테이토 팝", "add_price": 700, "is_sold_out": true},
              {"id": 4, "name": "포테이토 팝(버터갈릭)", "add_price": 300, "is_sold_out": false},
              {"id": 5, "name": "포테이토 팝(칠리)", "add_price": 300, "is_sold_out": false},
              {"id": 6, "name": "포테이토 팝(치즈즈)", "add_price": 300, "is_sold_out": false},
              {"id": 7, "name": "코울슬로", "add_price": 800, "is_sold_out": false}
            ]
          },
          {
            "id": 2,
            "name": "음료(필수)",
            "select_min": 1,
            "select_max": 1,
            "options": [
              {"id": 8, "name": "콜라", "add_price": 0, "is_sold_out": false},
              {"id": 9, "name": "제로 콜라", "add_price": 0, "is_sold_out": false},
              {"id": 10, "name": "사이다", "add_price": 0, "is_sold_out": false},
              {"id": 11, "name": "제로 사이다", "add_price": 0, "is_sold_out": false},
              {"id": 12, "name": "핫 아메리카노", "add_price": 800, "is_sold_out": false},
              {"id": 13, "name": "아이스 아메리카노", "add_price": 800, "is_sold_out": false},
              {"id": 14, "name": "핫 디카페인 아메리카노", "add_price": 1300, "is_sold_out": false},
              {"id": 15, "name": "아이스 디카페인 아메리카노", "add_price": 1300, "is_sold_out": false},
              {"id": 16, "name": "오렌지주스", "add_price": 400, "is_sold_out": false}
            ]
          }
        ]
      },
      {
        "id": 4,
        "name": "콘베이컨 에그마요 세트",
        "price": 7200,
        "description": null,
        "page_no": 1,
        "grid_row": 2,
        "grid_col": 2,
        "grid_location": "(2행, 2열)",
        "is_featured": false,
        "is_sold_out": false,
        "aliases": [],
        "option_groups": [
          {
            "id": 1,
            "name": "사이드(필수)",
            "select_min": 1,
            "select_max": 1,
            "options": [
              {"id": 1, "name": "포테이토 팝", "add_price": 0, "is_sold_out": false},
              {"id": 2, "name": "치즈 팝", "add_price": 700, "is_sold_out": true},
              {"id": 3, "name": "어니언 포테이토 팝", "add_price": 700, "is_sold_out": true},
              {"id": 4, "name": "포테이토 팝(버터갈릭)", "add_price": 300, "is_sold_out": false},
              {"id": 5, "name": "포테이토 팝(칠리)", "add_price": 300, "is_sold_out": false},
              {"id": 6, "name": "포테이토 팝(치즈즈)", "add_price": 300, "is_sold_out": false},
              {"id": 7, "name": "코울슬로", "add_price": 800, "is_sold_out": false}
            ]
          },
          {
            "id": 2,
            "name": "음료(필수)",
            "select_min": 1,
            "select_max": 1,
            "options": [
              {"id": 8, "name": "콜라", "add_price": 0, "is_sold_out": false},
              {"id": 9, "name": "제로 콜라", "add_price": 0, "is_sold_out": false},
              {"id": 10, "name": "사이다", "add_price": 0, "is_sold_out": false},
              {"id": 11, "name": "제로 사이다", "add_price": 0, "is_sold_out": false},
              {"id": 12, "name": "핫 아메리카노", "add_price": 800, "is_sold_out": false},
              {"id": 13, "name": "아이스 아메리카노", "add_price": 800, "is_sold_out": false},
              {"id": 14, "name": "핫 디카페인 아메리카노", "add_price": 1300, "is_sold_out": false},
              {"id": 15, "name": "아이스 디카페인 아메리카노", "add_price": 1300, "is_sold_out": false},
              {"id": 16, "name": "오렌지주스", "add_price": 400, "is_sold_out": false}
            ]
          }
        ]
      },
      {
        "id": 5,
        "name": "포테이토 에그마요 세트",
        "price": 7000,
        "description": null,
        "page_no": 1,
        "grid_row": 2,
        "grid_col": 3,
        "grid_location": "(2행, 3열)",
        "is_featured": false,
        "is_sold_out": false,
        "aliases": [],
        "option_groups": [
          {
            "id": 1,
            "name": "사이드(필수)",
            "select_min": 1,
            "select_max": 1,
            "options": [
              {"id": 1, "name": "포테이토 팝", "add_price": 0, "is_sold_out": false},
              {"id": 2, "name": "치즈 팝", "add_price": 700, "is_sold_out": true},
              {"id": 3, "name": "어니언 포테이토 팝", "add_price": 700, "is_sold_out": true},
              {"id": 4, "name": "포테이토 팝(버터갈릭)", "add_price": 300, "is_sold_out": false},
              {"id": 5, "name": "포테이토 팝(칠리)", "add_price": 300, "is_sold_out": false},
              {"id": 6, "name": "포테이토 팝(치즈즈)", "add_price": 300, "is_sold_out": false},
              {"id": 7, "name": "코울슬로", "add_price": 800, "is_sold_out": false}
            ]
          },
          {
            "id": 2,
            "name": "음료(필수)",
            "select_min": 1,
            "select_max": 1,
            "options": [
              {"id": 8, "name": "콜라", "add_price": 0, "is_sold_out": false},
              {"id": 9, "name": "제로 콜라", "add_price": 0, "is_sold_out": false},
              {"id": 10, "name": "사이다", "add_price": 0, "is_sold_out": false},
              {"id": 11, "name": "제로 사이다", "add_price": 0, "is_sold_out": false},
              {"id": 12, "name": "핫 아메리카노", "add_price": 800, "is_sold_out": false},
              {"id": 13, "name": "아이스 아메리카노", "add_price": 800, "is_sold_out": false},
              {"id": 14, "name": "핫 디카페인 아메리카노", "add_price": 1300, "is_sold_out": false},
              {"id": 15, "name": "아이스 디카페인 아메리카노", "add_price": 1300, "is_sold_out": false},
              {"id": 16, "name": "오렌지주스", "add_price": 400, "is_sold_out": false}
            ]
          }
        ]
      },
      {
        "id": 6,
        "name": "스크램블 햄치즈 세트",
        "price": 6800,
        "description": null,
        "page_no": 1,
        "grid_row": 3,
        "grid_col": 1,
        "grid_location": "(3행, 1열)",
        "is_featured": false,
        "is_sold_out": false,
        "aliases": ["스크램블 햄치즈 세트"],
        "option_groups": [
          {
            "id": 1,
            "name": "사이드(필수)",
            "select_min": 1,
            "select_max": 1,
            "options": [
              {"id": 1, "name": "포테이토 팝", "add_price": 0, "is_sold_out": false},
              {"id": 2, "name": "치즈 팝", "add_price": 700, "is_sold_out": true},
              {"id": 3, "name": "어니언 포테이토 팝", "add_price": 700, "is_sold_out": true},
              {"id": 4, "name": "포테이토 팝(버터갈릭)", "add_price": 300, "is_sold_out": false},
              {"id": 5, "name": "포테이토 팝(칠리)", "add_price": 300, "is_sold_out": false},
              {"id": 6, "name": "포테이토 팝(치즈즈)", "add_price": 300, "is_sold_out": false},
              {"id": 7, "name": "코울슬로", "add_price": 800, "is_sold_out": false}
            ]
          },
          {
            "id": 2,
            "name": "음료(필수)",
            "select_min": 1,
            "select_max": 1,
            "options": [
              {"id": 8, "name": "콜라", "add_price": 0, "is_sold_out": false},
              {"id": 9, "name": "제로 콜라", "add_price": 0, "is_sold_out": false},
              {"id": 10, "name": "사이다", "add_price": 0, "is_sold_out": false},
              {"id": 11, "name": "제로 사이다", "add_price": 0, "is_sold_out": false},
              {"id": 12, "name": "핫 아메리카노", "add_price": 800, "is_sold_out": false},
              {"id": 13, "name": "아이스 아메리카노", "add_price": 800, "is_sold_out": false},
              {"id": 14, "name": "핫 디카페인 아메리카노", "add_price": 1300, "is_sold_out": false},
              {"id": 15, "name": "아이스 디카페인 아메리카노", "add_price": 1300, "is_sold_out": false},
              {"id": 16, "name": "오렌지주스", "add_price": 400, "is_sold_out": false}
            ]
          }
        ]
      },
      {
        "id": 7,
        "name": "스크램블 베이컨 세트",
        "price": 7700,
        "description": null,
        "page_no": 1,
        "grid_row": 3,
        "grid_col": 2,
        "grid_location": "(3행, 2열)",
        "is_featured": false,
        "is_sold_out": false,
        "aliases": [],
        "option_groups": [
          {
            "id": 1,
            "name": "사이드(필수)",
            "select_min": 1,
            "select_max": 1,
            "options": [
              {"id": 1, "name": "포테이토 팝", "add_price": 0, "is_sold_out": false},
              {"id": 2, "name": "치즈 팝", "add_price": 700, "is_sold_out": true},
              {"id": 3, "name": "어니언 포테이토 팝", "add_price": 700, "is_sold_out": true},
              {"id": 4, "name": "포테이토 팝(버터갈릭)", "add_price": 300, "is_sold_out": false},
              {"id": 5, "name": "포테이토 팝(칠리)", "add_price": 300, "is_sold_out": false},
              {"id": 6, "name": "포테이토 팝(치즈즈)", "add_price": 300, "is_sold_out": false},
              {"id": 7, "name": "코울슬로", "add_price": 800, "is_sold_out": false}
            ]
          },
          {
            "id": 2,
            "name": "음료(필수)",
            "select_min": 1,
            "select_max": 1,
            "options": [
              {"id": 8, "name": "콜라", "add_price": 0, "is_sold_out": false},
              {"id": 9, "name": "제로 콜라", "add_price": 0, "is_sold_out": false},
              {"id": 10, "name": "사이다", "add_price": 0, "is_sold_out": false},
              {"id": 11, "name": "제로 사이다", "add_price": 0, "is_sold_out": false},
              {"id": 12, "name": "핫 아메리카노", "add_price": 800, "is_sold_out": false},
              {"id": 13, "name": "아이스 아메리카노", "add_price": 800, "is_sold_out": false},
              {"id": 14, "name": "핫 디카페인 아메리카노", "add_price": 1300, "is_sold_out": false},
              {"id": 15, "name": "아이스 디카페인 아메리카노", "add_price": 1300, "is_sold_out": false},
              {"id": 16, "name": "오렌지주스", "add_price": 400, "is_sold_out": false}
            ]
          }
        ]
      },
      {
        "id": 8,
        "name": "감자 스페셜 세트",
        "price": 7700,
        "description": null,
        "page_no": 1,
        "grid_row": 3,
        "grid_col": 3,
        "grid_location": "(3행, 3열)",
        "is_featured": false,
        "is_sold_out": false,
        "aliases": ["감자 스페셜 세트"],
        "option_groups": [
          {
            "id": 1,
            "name": "사이드(필수)",
            "select_min": 1,
            "select_max": 1,
            "options": [
              {"id": 1, "name": "포테이토 팝", "add_price": 0, "is_sold_out": false},
              {"id": 2, "name": "치즈 팝", "add_price": 700, "is_sold_out": true},
              {"id": 3, "name": "어니언 포테이토 팝", "add_price": 700, "is_sold_out": true},
              {"id": 4, "name": "포테이토 팝(버터갈릭)", "add_price": 300, "is_sold_out": false},
              {"id": 5, "name": "포테이토 팝(칠리)", "add_price": 300, "is_sold_out": false},
              {"id": 6, "name": "포테이토 팝(치즈즈)", "add_price": 300, "is_sold_out": false},
              {"id": 7, "name": "코울슬로", "add_price": 800, "is_sold_out": false}
            ]
          },
          {
            "id": 2,
            "name": "음료(필수)",
            "select_min": 1,
            "select_max": 1,
            "options": [
              {"id": 8, "name": "콜라", "add_price": 0, "is_sold_out": false},
              {"id": 9, "name": "제로 콜라", "add_price": 0, "is_sold_out": false},
              {"id": 10, "name": "사이다", "add_price": 0, "is_sold_out": false},
              {"id": 11, "name": "제로 사이다", "add_price": 0, "is_sold_out": false},
              {"id": 12, "name": "핫 아메리카노", "add_price": 800, "is_sold_out": false},
              {"id": 13, "name": "아이스 아메리카노", "add_price": 800, "is_sold_out": false},
              {"id": 14, "name": "핫 디카페인 아메리카노", "add_price": 1300, "is_sold_out": false},
              {"id": 15, "name": "아이스 디카페인 아메리카노", "add_price": 1300, "is_sold_out": false},
              {"id": 16, "name": "오렌지주스", "add_price": 400, "is_sold_out": false}
            ]
          }
        ]
      },
      {
        "id": 9,
        "name": "계란라이스 햄치즈 세트",
        "price": 7100,
        "description": null,
        "page_no": 1,
        "grid_row": 4,
        "grid_col": 1,
        "grid_location": "(4행, 1열)",
        "is_featured": false,
        "is_sold_out": false,
        "aliases": [],
        "option_groups": [
          {
            "id": 1,
            "name": "사이드(필수)",
            "select_min": 1,
            "select_max": 1,
            "options": [
              {"id": 1, "name": "포테이토 팝", "add_price": 0, "is_sold_out": false},
              {"id": 2, "name": "치즈 팝", "add_price": 700, "is_sold_out": true},
              {"id": 3, "name": "어니언 포테이토 팝", "add_price": 700, "is_sold_out": true},
              {"id": 4, "name": "포테이토 팝(버터갈릭)", "add_price": 300, "is_sold_out": false},
              {"id": 5, "name": "포테이토 팝(칠리)", "add_price": 300, "is_sold_out": false},
              {"id": 6, "name": "포테이토 팝(치즈즈)", "add_price": 300, "is_sold_out": false},
              {"id": 7, "name": "코울슬로", "add_price": 800, "is_sold_out": false}
            ]
          },
          {
            "id": 2,
            "name": "음료(필수)",
            "select_min": 1,
            "select_max": 1,
            "options": [
              {"id": 8, "name": "콜라", "add_price": 0, "is_sold_out": false},
              {"id": 9, "name": "제로 콜라", "add_price": 0, "is_sold_out": false},
              {"id": 10, "name": "사이다", "add_price": 0, "is_sold_out": false},
              {"id": 11, "name": "제로 사이다", "add_price": 0, "is_sold_out": false},
              {"id": 12, "name": "핫 아메리카노", "add_price": 800, "is_sold_out": false},
              {"id": 13, "name": "아이스 아메리카노", "add_price": 800, "is_sold_out": false},
              {"id": 14, "name": "핫 디카페인 아메리카노", "add_price": 1300, "is_sold_out": false},
              {"id": 15, "name": "아이스 디카페인 아메리카노", "add_price": 1300, "is_sold_out": false},
              {"id": 16, "name": "오렌지주스", "add_price": 400, "is_sold_out": false}
            ]
          }
        ]
      },
      {
        "id": 10,
        "name": "계란라이스 스페셜 세트",
        "price": 7100,
        "description": null,
        "page_no": 1,
        "grid_row": 4,
        "grid_col": 2,
        "grid_location": "(4행, 2열)",
        "is_featured": false,
        "is_sold_out": false,
        "aliases": [],
        "option_groups": [
          {
            "id": 1,
            "name": "사이드(필수)",
            "select_min": 1,
            "select_max": 1,
            "options": [
              {"id": 1, "name": "포테이토 팝", "add_price": 0, "is_sold_out": false},
              {"id": 2, "name": "치즈 팝", "add_price": 700, "is_sold_out": true},
              {"id": 3, "name": "어니언 포테이토 팝", "add_price": 700, "is_sold_out": true},
              {"id": 4, "name": "포테이토 팝(버터갈릭)", "add_price": 300, "is_sold_out": false},
              {"id": 5, "name": "포테이토 팝(칠리)", "add_price": 300, "is_sold_out": false},
              {"id": 6, "name": "포테이토 팝(치즈즈)", "add_price": 300, "is_sold_out": false},
              {"id": 7, "name": "코울슬로", "add_price": 800, "is_sold_out": false}
            ]
          },
          {
            "id": 2,
            "name": "음료(필수)",
            "select_min": 1,
            "select_max": 1,
            "options": [
              {"id": 8, "name": "콜라", "add_price": 0, "is_sold_out": false},
              {"id": 9, "name": "제로 콜라", "add_price": 0, "is_sold_out": false},
              {"id": 10, "name": "사이다", "add_price": 0, "is_sold_out": false},
              {"id": 11, "name": "제로 사이다", "add_price": 0, "is_sold_out": false},
              {"id": 12, "name": "핫 아메리카노", "add_price": 800, "is_sold_out": false},
              {"id": 13, "name": "아이스 아메리카노", "add_price": 800, "is_sold_out": false},
              {"id": 14, "name": "핫 디카페인 아메리카노", "add_price": 1300, "is_sold_out": false},
              {"id": 15, "name": "아이스 디카페인 아메리카노", "add_price": 1300, "is_sold_out": false},
              {"id": 16, "name": "오렌지주스", "add_price": 400, "is_sold_out": false}
            ]
          }
        ]
      }
    ]
  },
  {
    "id": 3,
    "name": "토스트",
    "ui_tab_name": "토스트",
    "menus": [
      {
        "id": 11,
        "name": "프렌치 크림 브리오슈",
        "price": 4100,
        "description": null,
        "page_no": 1,
        "grid_row": 1,
        "grid_col": 1,
        "grid_location": "(1행, 1열)",
        "is_sold_out": false,
        "aliases": ["프렌치 크림 브리오슈", "브리오슈"],
        "option_groups": [
          {
            "id": 3,
            "name": "토핑 추가(토스트)",
            "select_min": 0,
            "select_max": 10,
            "options": [
              {"id": 17, "name": "햄", "add_price": 600, "is_sold_out": false},
              {"id": 18, "name": "치즈", "add_price": 600, "is_sold_out": false},
              {"id": 19, "name": "기본 계란", "add_price": 600, "is_sold_out": false},
              {"id": 20, "name": "야채", "add_price": 600, "is_sold_out": false},
              {"id": 21, "name": "감자", "add_price": 1200, "is_sold_out": false}
            ]
          }
        ]
      },
      {
        "id": 12,
        "name": "애플 크림 브리오슈",
        "price": 3700,
        "description": null,
        "page_no": 1,
        "grid_row": 1,
        "grid_col": 2,
        "grid_location": "(1행, 2열)",
        "is_sold_out": false,
        "aliases": ["애플 크림 브리오슈", "애플 브리오슈"],
        "option_groups": [
          {
            "id": 3,
            "name": "토핑 추가(토스트)",
            "select_min": 0,
            "select_max": 10,
            "options": [
              {"id": 17, "name": "햄", "add_price": 600, "is_sold_out": false},
              {"id": 18, "name": "치즈", "add_price": 600, "is_sold_out": false},
              {"id": 19, "name": "기본 계란", "add_price": 600, "is_sold_out": false},
              {"id": 20, "name": "야채", "add_price": 600, "is_sold_out": false},
              {"id": 21, "name": "감자", "add_price": 1200, "is_sold_out": false}
            ]
          }
        ]
      },
      {
        "id": 13,
        "name": "소이 크런치 치킨",
        "price": 5100,
        "description": null,
        "page_no": 1,
        "grid_row": 1,
        "grid_col": 3,
        "grid_location": "(1행, 3열)",
        "is_sold_out": false,
        "aliases": [],
        "option_groups": [
          {
            "id": 3,
            "name": "토핑 추가(토스트)",
            "select_min": 0,
            "select_max": 10,
            "options": [
              {"id": 17, "name": "햄", "add_price": 600, "is_sold_out": false},
              {"id": 18, "name": "치즈", "add_price": 600, "is_sold_out": false},
              {"id": 19, "name": "기본 계란", "add_price": 600, "is_sold_out": false},
              {"id": 20, "name": "야채", "add_price": 600, "is_sold_out": false},
              {"id": 21, "name": "감자", "add_price": 1200, "is_sold_out": false}
            ]
          }
        ]
      },
      {
        "id": 14,
        "name": "리얼 양념치킨",
        "price": 5000,
        "description": null,
        "page_no": 1,
        "grid_row": 1,
        "grid_col": 4,
        "grid_location": "(1행, 4열)",
        "is_sold_out": false,
        "aliases": [],
        "option_groups": [
          {
            "id": 3,
            "name": "토핑 추가(토스트)",
            "select_min": 0,
            "select_max": 10,
            "options": [
              {"id": 17, "name": "햄", "add_price": 600, "is_sold_out": false},
              {"id": 18, "name": "치즈", "add_price": 600, "is_sold_out": false},
              {"id": 19, "name": "기본 계란", "add_price": 600, "is_sold_out": false},
              {"id": 20, "name": "야채", "add_price": 600, "is_sold_out": false},
              {"id": 21, "name": "감자", "add_price": 1200, "is_sold_out": false}
            ]
          }
        ]
      },
      {
        "id": 15,
        "name": "복숭아잼 에그마요",
        "price": 4400,
        "description": null,
        "page_no": 1,
        "grid_row": 2,
        "grid_col": 1,
        "grid_location": "(2행, 1열)",
        "is_sold_out": false,
        "aliases": [],
        "option_groups": [
          {
            "id": 3,
            "name": "토핑 추가(토스트)",
            "select_min": 0,
            "select_max": 10,
            "options": [
              {"id": 17, "name": "햄", "add_price": 600, "is_sold_out": false},
              {"id": 18, "name": "치즈", "add_price": 600, "is_sold_out": false},
              {"id": 19, "name": "기본 계란", "add_price": 600, "is_sold_out": false},
              {"id": 20, "name": "야채", "add_price": 600, "is_sold_out": false},
              {"id": 21, "name": "감자", "add_price": 1200, "is_sold_out": false}
            ]
          }
        ]
      },
      {
        "id": 14,
        "name": "복숭아잼 베이컨 베스트",
        "price": 4400,
        "description": null,
        "page_no": 1,
        "grid_row": 2,
        "grid_col": 2,
        "grid_location": "(2행, 2열)",
        "is_sold_out": false,
        "aliases": [],
        "option_groups": [
          {
            "id": 3,
            "name": "토핑 추가(토스트)",
            "select_min": 0,
            "select_max": 10,
            "options": [
              {"id": 17, "name": "햄", "add_price": 600, "is_sold_out": false},
              {"id": 18, "name": "치즈", "add_price": 600, "is_sold_out": false},
              {"id": 19, "name": "기본 계란", "add_price": 600, "is_sold_out": false},
              {"id": 20, "name": "야채", "add_price": 600, "is_sold_out": false},
              {"id": 21, "name": "감자", "add_price": 1200, "is_sold_out": false}
            ]
          }
        ]
      },
      {
        "id": 15,
        "name": "게란후라이 햄치즈",
        "price": 4000,
        "description": null,
        "page_no": 1,
        "grid_row": 2,
        "grid_col": 3,
        "grid_location": "(2행, 3열)",
        "is_sold_out": false,
        "aliases": [],
        "option_groups": [
          {
            "id": 3,
            "name": "토핑 추가(토스트)",
            "select_min": 0,
            "select_max": 10,
            "options": [
              {"id": 17, "name": "햄", "add_price": 600, "is_sold_out": false},
              {"id": 18, "name": "치즈", "add_price": 600, "is_sold_out": false},
              {"id": 19, "name": "기본 계란", "add_price": 600, "is_sold_out": false},
              {"id": 20, "name": "야채", "add_price": 600, "is_sold_out": false},
              {"id": 21, "name": "감자", "add_price": 1200, "is_sold_out": false}
            ]
          }
        ]
      },
      {
        "id": 16,
        "name": "계란후라이 스페셜",
        "price": 4200,
        "description": null,
        "page_no": 1,
        "grid_row": 2,
        "grid_col": 4,
        "grid_location": "(2행, 4열)",
        "is_sold_out": false,
        "aliases": [],
        "option_groups": [
          {
            "id": 3,
            "name": "토핑 추가(토스트)",
            "select_min": 0,
            "select_max": 10,
            "options": [
              {"id": 17, "name": "햄", "add_price": 600, "is_sold_out": false},
              {"id": 18, "name": "치즈", "add_price": 600, "is_sold_out": false},
              {"id": 19, "name": "기본 계란", "add_price": 600, "is_sold_out": false},
              {"id": 20, "name": "야채", "add_price": 600, "is_sold_out": false},
              {"id": 21, "name": "감자", "add_price": 1200, "is_sold_out": false}
            ]
          }
        ]
      },
      {
        "id": 17,
        "name": "프렌치 에그마요",
        "price": 3900,
        "description": null,
        "page_no": 1,
        "grid_row": 3,
        "grid_col": 1,
        "grid_location": "(3행, 1열)",
        "is_sold_out": false,
        "aliases": [],
        "option_groups": [
          {
            "id": 3,
            "name": "토핑 추가(토스트)",
            "select_min": 0,
            "select_max": 10,
            "options": [
              {"id": 17, "name": "햄", "add_price": 600, "is_sold_out": false},
              {"id": 18, "name": "치즈", "add_price": 600, "is_sold_out": false},
              {"id": 19, "name": "기본 계란", "add_price": 600, "is_sold_out": false},
              {"id": 20, "name": "야채", "add_price": 600, "is_sold_out": false},
              {"id": 21, "name": "감자", "add_price": 1200, "is_sold_out": false}
            ]
          }
        ]
      },
      {
        "id": 18,
        "name": "콘베이컨 에그마요",
        "price": 4300,
        "description": null,
        "page_no": 1,
        "grid_row": 3,
        "grid_col": 2,
        "grid_location": "(3행, 2열)",
        "is_sold_out": false,
        "aliases": [],
        "option_groups": [
          {
            "id": 3,
            "name": "토핑 추가(토스트)",
            "select_min": 0,
            "select_max": 10,
            "options": [
              {"id": 17, "name": "햄", "add_price": 600, "is_sold_out": false},
              {"id": 18, "name": "치즈", "add_price": 600, "is_sold_out": false},
              {"id": 19, "name": "기본 계란", "add_price": 600, "is_sold_out": false},
              {"id": 20, "name": "야채", "add_price": 600, "is_sold_out": false},
              {"id": 21, "name": "감자", "add_price": 1200, "is_sold_out": false}
            ]
          }
        ]
      },
      {
        "id": 19,
        "name": "포테이토 에그마요",
        "price": 4700,
        "description": null,
        "page_no": 1,
        "grid_row": 3,
        "grid_col": 3,
        "grid_location": "(3행, 3열)",
        "is_sold_out": false,
        "aliases": [],
        "option_groups": [
          {
            "id": 3,
            "name": "토핑 추가(토스트)",
            "select_min": 0,
            "select_max": 10,
            "options": [
              {"id": 17, "name": "햄", "add_price": 600, "is_sold_out": false},
              {"id": 18, "name": "치즈", "add_price": 600, "is_sold_out": false},
              {"id": 19, "name": "기본 계란", "add_price": 600, "is_sold_out": false},
              {"id": 20, "name": "야채", "add_price": 600, "is_sold_out": false},
              {"id": 21, "name": "감자", "add_price": 1200, "is_sold_out": false}
            ]
          }
        ]
      },
      {
        "id": 20,
        "name": "프렌치 햄치즈",
        "price": 3800,
        "description": null,
        "page_no": 1,
        "grid_row": 3,
        "grid_col": 4,
        "grid_location": "(3행, 4열)",
        "is_sold_out": false,
        "aliases": [],
        "option_groups": [
          {
            "id": 3,
            "name": "토핑 추가(토스트)",
            "select_min": 0,
            "select_max": 10,
            "options": [
              {"id": 17, "name": "햄", "add_price": 600, "is_sold_out": false},
              {"id": 18, "name": "치즈", "add_price": 600, "is_sold_out": false},
              {"id": 19, "name": "기본 계란", "add_price": 600, "is_sold_out": false},
              {"id": 20, "name": "야채", "add_price": 600, "is_sold_out": false},
              {"id": 21, "name": "감자", "add_price": 1200, "is_sold_out": false}
            ]
          }
        ]
      },
      {
        "id": 21,
        "name": "스크램블 햄치즈",
        "price": 3900,
        "description": null,
        "page_no": 1,
        "grid_row": 4,
        "grid_col": 1,
        "grid_location": "(4행, 1열)",
        "is_sold_out": false,
        "aliases": [],
        "option_groups": [
          {
            "id": 3,
            "name": "토핑 추가(토스트)",
            "select_min": 0,
            "select_max": 10,
            "options": [
              {"id": 17, "name": "햄", "add_price": 600, "is_sold_out": false},
              {"id": 18, "name": "치즈", "add_price": 600, "is_sold_out": false},
              {"id": 19, "name": "기본 계란", "add_price": 600, "is_sold_out": false},
              {"id": 20, "name": "야채", "add_price": 600, "is_sold_out": false},
              {"id": 21, "name": "감자", "add_price": 1200, "is_sold_out": false}
            ]
          }
        ]
      },
      {
        "id": 22,
        "name": "스크램블 베이컨",
        "price": 4800,
        "description": null,
        "page_no": 1,
        "grid_row": 4,
        "grid_col": 2,
        "grid_location": "(4행, 2열)",
        "is_sold_out": false,
        "aliases": [],
        "option_groups": [
          {
            "id": 3,
            "name": "토핑 추가(토스트)",
            "select_min": 0,
            "select_max": 10,
            "options": [
              {"id": 17, "name": "햄", "add_price": 600, "is_sold_out": false},
              {"id": 18, "name": "치즈", "add_price": 600, "is_sold_out": false},
              {"id": 19, "name": "기본 계란", "add_price": 600, "is_sold_out": false},
              {"id": 20, "name": "야채", "add_price": 600, "is_sold_out": false},
              {"id": 21, "name": "감자", "add_price": 1200, "is_sold_out": false}
            ]
          }
        ]
      },
      {
        "id": 23,
        "name": "감자 스페셜",
        "price": 4800,
        "description": null,
        "page_no": 1,
        "grid_row": 4,
        "grid_col": 3,
        "grid_location": "(4행, 3열)",
        "is_sold_out": false,
        "aliases": [],
        "option_groups": [
          {
            "id": 3,
            "name": "토핑 추가(토스트)",
            "select_min": 0,
            "select_max": 10,
            "options": [
              {"id": 17, "name": "햄", "add_price": 600, "is_sold_out": false},
              {"id": 18, "name": "치즈", "add_price": 600, "is_sold_out": false},
              {"id": 19, "name": "기본 계란", "add_price": 600, "is_sold_out": false},
              {"id": 20, "name": "야채", "add_price": 600, "is_sold_out": false},
              {"id": 21, "name": "감자", "add_price": 1200, "is_sold_out": false}
            ]
          }
        ]
      },
      {
        "id": 24,
        "name": "햄치즈 포테이토",
        "price": 4400,
        "description": null,
        "page_no": 1,
        "grid_row": 4,
        "grid_col": 4,
        "grid_location": "(4행, 4열)",
        "is_sold_out": false,
        "aliases": [],
        "option_groups": [
          {
            "id": 3,
            "name": "토핑 추가(토스트)",
            "select_min": 0,
            "select_max": 10,
            "options": [
              {"id": 17, "name": "햄", "add_price": 600, "is_sold_out": false},
              {"id": 18, "name": "치즈", "add_price": 600, "is_sold_out": false},
              {"id": 19, "name": "기본 계란", "add_price": 600, "is_sold_out": false},
              {"id": 20, "name": "야채", "add_price": 600, "is_sold_out": false},
              {"id": 21, "name": "감자", "add_price": 1200, "is_sold_out": false}
            ]
          }
        ]
      },
      {
        "id": 25,
        "name": "딥치즈 베이컨 포테이토",
        "price": 5300,
        "description": null,
        "page_no": 2,
        "grid_row": 1,
        "grid_col": 1,
        "grid_location": "(1행, 1열)",
        "is_sold_out": false,
        "aliases": [],
        "option_groups": [
          {
            "id": 3,
            "name": "토핑 추가(토스트)",
            "select_min": 0,
            "select_max": 10,
            "options": [
              {"id": 17, "name": "햄", "add_price": 600, "is_sold_out": false},
              {"id": 18, "name": "치즈", "add_price": 600, "is_sold_out": false},
              {"id": 19, "name": "기본 계란", "add_price": 600, "is_sold_out": false},
              {"id": 20, "name": "야채", "add_price": 600, "is_sold_out": false},
              {"id": 21, "name": "감자", "add_price": 1200, "is_sold_out": false}
            ]
          }
        ]
      },
      {
        "id": 26,
        "name": "햄스페셜 토스트",
        "price": 3800,
        "description": null,
        "page_no": 2,
        "grid_row": 1,
        "grid_col": 2,
        "grid_location": "(1행, 2열)",
        "is_sold_out": false,
        "aliases": ["햄스페셜 토스트", "햄 스페셜"],
        "option_groups": [
          {
            "id": 3,
            "name": "토핑 추가(토스트)",
            "select_min": 0,
            "select_max": 10,
            "options": [
              {"id": 17, "name": "햄", "add_price": 600, "is_sold_out": false},
              {"id": 18, "name": "치즈", "add_price": 600, "is_sold_out": false},
              {"id": 19, "name": "기본 계란", "add_price": 600, "is_sold_out": false},
              {"id": 20, "name": "야채", "add_price": 600, "is_sold_out": false},
              {"id": 21, "name": "감자", "add_price": 1200, "is_sold_out": false}
            ]
          }
        ]
      },
      {
        "id": 27,
        "name": "베이컨 베스트",
        "price": 4300,
        "description": null,
        "page_no": 2,
        "grid_row": 1,
        "grid_col": 3,
        "grid_location": "(1행, 3열)",
        "is_sold_out": false,
        "aliases": ["베이컨 베스트"],
        "option_groups": [
          {
            "id": 3,
            "name": "토핑 추가(토스트)",
            "select_min": 0,
            "select_max": 10,
            "options": [
              {"id": 17, "name": "햄", "add_price": 600, "is_sold_out": false},
              {"id": 18, "name": "치즈", "add_price": 600, "is_sold_out": false},
              {"id": 19, "name": "기본 계란", "add_price": 600, "is_sold_out": false},
              {"id": 20, "name": "야채", "add_price": 600, "is_sold_out": false},
              {"id": 21, "name": "감자", "add_price": 1200, "is_sold_out": false}
            ]
          }
        ]
      },
      {
        "id": 28,
        "name": "그릴드 불갈비",
        "price": 5000,
        "description": null,
        "page_no": 2,
        "grid_row": 1,
        "grid_col": 4,
        "grid_location": "(1행, 4열)",
        "is_sold_out": false,
        "aliases": ["그릴드 불갈비", "불고기 토스트"],
        "option_groups": [
          {
            "id": 3,
            "name": "토핑 추가(토스트)",
            "select_min": 0,
            "select_max": 10,
            "options": [
              {"id": 17, "name": "햄", "add_price": 600, "is_sold_out": false},
              {"id": 18, "name": "치즈", "add_price": 600, "is_sold_out": false},
              {"id": 19, "name": "기본 계란", "add_price": 600, "is_sold_out": false},
              {"id": 20, "name": "야채", "add_price": 600, "is_sold_out": false},
              {"id": 21, "name": "감자", "add_price": 1200, "is_sold_out": false}
            ]
          }
        ]
      },
      {
        "id": 29,
        "name": "딥치즈 베이컨",
        "price": 4600,
        "description": null,
        "page_no": 2,
        "grid_row": 2,
        "grid_col": 1,
        "grid_location": "(2행, 1열)",
        "is_sold_out": false,
        "aliases": [],
        "option_groups": [
          {
            "id": 3,
            "name": "토핑 추가(토스트)",
            "select_min": 0,
            "select_max": 10,
            "options": [
              {"id": 17, "name": "햄", "add_price": 600, "is_sold_out": false},
              {"id": 18, "name": "치즈", "add_price": 600, "is_sold_out": false},
              {"id": 19, "name": "기본 계란", "add_price": 600, "is_sold_out": false},
              {"id": 20, "name": "야채", "add_price": 600, "is_sold_out": false},
              {"id": 21, "name": "감자", "add_price": 1200, "is_sold_out": false}
            ]
          }
        ]
      },
      {
        "id": 30,
        "name": "햄치즈 토스트",
        "price": 3300,
        "description": null,
        "page_no": 2,
        "grid_row": 2,
        "grid_col": 2,
        "grid_location": "(2행, 2열)",
        "is_sold_out": false,
        "aliases": [],
        "option_groups": [
          {
            "id": 3,
            "name": "토핑 추가(토스트)",
            "select_min": 0,
            "select_max": 10,
            "options": [
              {"id": 17, "name": "햄", "add_price": 600, "is_sold_out": false},
              {"id": 18, "name": "치즈", "add_price": 600, "is_sold_out": false},
              {"id": 19, "name": "기본 계란", "add_price": 600, "is_sold_out": false},
              {"id": 20, "name": "야채", "add_price": 600, "is_sold_out": false},
              {"id": 21, "name": "감자", "add_price": 1200, "is_sold_out": false}
            ]
          }
        ]
      },
      {
        "id": 31,
        "name": "베이컨 포테이토 피자",
        "price": 5400,
        "description": null,
        "page_no": 2,
        "grid_row": 2,
        "grid_col": 3,
        "grid_location": "(2행, 3열)",
        "is_sold_out": false,
        "aliases": [],
        "option_groups": [
          {
            "id": 3,
            "name": "토핑 추가(토스트)",
            "select_min": 0,
            "select_max": 10,
            "options": [
              {"id": 17, "name": "햄", "add_price": 600, "is_sold_out": false},
              {"id": 18, "name": "치즈", "add_price": 600, "is_sold_out": false},
              {"id": 19, "name": "기본 계란", "add_price": 600, "is_sold_out": false},
              {"id": 20, "name": "야채", "add_price": 600, "is_sold_out": false},
              {"id": 21, "name": "감자", "add_price": 1200, "is_sold_out": false}
            ]
          }
        ]
      }
    ]
  },
  {
    "id": 4,
    "name": "사이드",
    "ui_tab_name": "사이드",
    "menus": [
      {
        "id": 32,
        "name": "포테이토 팝",
        "price": 2100,
        "description": null,
        "page_no": 1,
        "grid_row": 1,
        "grid_col": 1,
        "grid_location": "(1행, 1열)",
        "is_sold_out": false,
        "aliases": [],
        "option_groups": []
      },
      {
        "id": 33,
        "name": "치즈 팝",
        "price": 2800,
        "description": null,
        "page_no": null,
        "grid_row": null,
        "grid_col": null,
        "grid_location": null,
        "is_sold_out": true,
        "aliases": [],
        "option_groups": []
      },
      {
        "id": 34,
        "name": "어니언 포테이토 팝",
        "price": 2800,
        "description": null,
        "page_no": null,
        "grid_row": null,
        "grid_col": null,
        "grid_location": null,
        "is_sold_out": true,
        "aliases": [],
        "option_groups": []
      },
      {
        "id": 35,
        "name": "포테이토 팝(시즈닝)",
        "price": 2400,
        "description": null,
        "page_no": 1,
        "grid_row": 1,
        "grid_col": 4,
        "grid_location": "(1행, 4열)",
        "is_sold_out": false,
        "aliases": [],
        "option_groups": []
      },
      {
        "id": 36,
        "name": "시즈닝",
        "price": 300,
        "description": null,
        "page_no": 1,
        "grid_row": 2,
        "grid_col": 1,
        "grid_location": "(2행, 1열)",
        "is_sold_out": false,
        "aliases": [],
        "option_groups": []
      },
      {
        "id": 37,
        "name": "코울슬로",
        "price": 2900,
        "description": null,
        "page_no": 1,
        "grid_row": 2,
        "grid_col": 2,
        "grid_location": "(2행, 2열)",
        "is_sold_out": false,
        "aliases": [],
        "option_groups": []
      }
    ]
  },
  {
    "id": 5,
    "name": "커피",
    "ui_tab_name": "커피",
    "menus": [
      {
        "id": 38,
        "name": "핫 아메리카노",
        "price": 2900,
        "description": null,
        "page_no": null,
        "grid_row": null,
        "grid_col": null,
        "grid_location": null,
        "is_sold_out": false,
        "aliases": [],
        "option_groups": []
      },
      {
        "id": 39,
        "name": "아이스 아메리카노",
        "price": 2900,
        "description": null,
        "page_no": null,
        "grid_row": null,
        "grid_col": null,
        "grid_location": null,
        "is_sold_out": false,
        "aliases": [],
        "option_groups": []
      },
      {
        "id": 40,
        "name": "핫 디카페인 아메리카노",
        "price": 3400,
        "description": null,
        "page_no": null,
        "grid_row": null,
        "grid_col": null,
        "grid_location": null,
        "is_sold_out": false,
        "aliases": [],
        "option_groups": []
      },
      {
        "id": 41,
        "name": "아이스 디카페인 아메리카노",
        "price": 3400,
        "description": null,
        "page_no": null,
        "grid_row": null,
        "grid_col": null,
        "grid_location": null,
        "is_sold_out": false,
        "aliases": [],
        "option_groups": []
      }
    ]
  },
  {
    "id": 6,
    "name": "음료",
    "ui_tab_name": "음료",
    "menus": [
      {
        "id": 42,
        "name": "아이스티",
        "price": 0,
        "description": null,
        "page_no": null,
        "grid_row": null,
        "grid_col": null,
        "grid_location": null,
        "is_sold_out": false,
        "aliases": [],
        "option_groups": []
      },
      {
        "id": 43,
        "name": "오렌지주스",
        "price": 0,
        "description": null,
        "page_no": null,
        "grid_row": null,
        "grid_col": null,
        "grid_location": null,
        "is_sold_out": false,
        "aliases": [],
        "option_groups": []
      },
      {
        "id": 44,
        "name": "콜라",
        "price": 0,
        "description": null,
        "page_no": null,
        "grid_row": null,
        "grid_col": null,
        "grid_location": null,
        "is_sold_out": false,
        "aliases": [],
        "option_groups": []
      },
      {
        "id": 45,
        "name": "제로 콜라",
        "price": 0,
        "description": null,
        "page_no": null,
        "grid_row": null,
        "grid_col": null,
        "grid_location": null,
        "is_sold_out": false,
        "aliases": [],
        "option_groups": []
      },
      {
        "id": 46,
        "name": "사이다",
        "price": 0,
        "description": null,
        "page_no": null,
        "grid_row": null,
        "grid_col": null,
        "grid_location": null,
        "is_sold_out": false,
        "aliases": [],
        "option_groups": []
      },
      {
        "id": 47,
        "name": "제로 사이다",
        "price": 0,
        "description": null,
        "page_no": null,
        "grid_row": null,
        "grid_col": null,
        "grid_location": null,
        "is_sold_out": false,
        "aliases": [],
        "option_groups": []
      }
    ]
  }
];
