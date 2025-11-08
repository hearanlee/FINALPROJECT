// menuData_banziha.js
// kiosk_voice_guide_menu_banziha.sql 파일의 데이터를 기반으로 생성된 메뉴 데이터

export const menuData = [
  {
    "id": 1,
    "name": "돈부리",
    "ui_tab_name": "돈부리",
    "menus": [
      {
        "id": 1,
        "name": "가쯔동",
        "price": 9000,
        "description": "",
        "grid_row": 1,
        "grid_col": 1,
        "grid_location": "(1행, 1열)",
        "aliases": ["가쯔동", "가츠동", "돈까스 덮밥"],
        "option_groups": [
          {
            "id": 2,
            "name": "돈부리 추가",
            "select_min": 0,
            "select_max": 9,
            "options": [
              {"id": 1, "name": "밥 추가", "add_price": 1000},
              {"id": 2, "name": "계란 추가", "add_price": 1000},
              {"id": 3, "name": "카레 추가", "add_price": 3000}
            ]
          },
          {
            "id": 3,
            "name": "음료 선택",
            "select_min": 0,
            "select_max": 1,
            "options": [
              {"id": 4, "name": "코카콜라", "add_price": 2000},
              {"id": 5, "name": "스프라이트", "add_price": 2000},
              {"id": 6, "name": "코카콜라 제로", "add_price": 2000}
            ]
          }
        ]
      },
      {
        "id": 2,
        "name": "규동",
        "price": 9500,
        "description": "",
        "grid_row": 1,
        "grid_col": 2,
        "grid_location": "(1행, 2열)",
        "aliases": ["규동", "소고기 규동"],
        "option_groups": [
          {
            "id": 2,
            "name": "돈부리 추가",
            "select_min": 0,
            "select_max": 9,
            "options": [
              {"id": 1, "name": "밥 추가", "add_price": 1000},
              {"id": 2, "name": "계란 추가", "add_price": 1000},
              {"id": 3, "name": "카레 추가", "add_price": 3000}
            ]
          },
          {
            "id": 3,
            "name": "음료 선택",
            "select_min": 0,
            "select_max": 1,
            "options": [
              {"id": 4, "name": "코카콜라", "add_price": 2000},
              {"id": 5, "name": "스프라이트", "add_price": 2000},
              {"id": 6, "name": "코카콜라 제로", "add_price": 2000}
            ]
          }
        ]
      },
      {
        "id": 3,
        "name": "오야꼬동",
        "price": 9000,
        "description": "",
        "grid_row": 1,
        "grid_col": 3,
        "grid_location": "(1행, 3열)",
        "aliases": ["오야꼬동", "오야코동", "닭계란 덮밥"],
        "option_groups": [
          {
            "id": 2,
            "name": "돈부리 추가",
            "select_min": 0,
            "select_max": 9,
            "options": [
              {"id": 1, "name": "밥 추가", "add_price": 1000},
              {"id": 2, "name": "계란 추가", "add_price": 1000},
              {"id": 3, "name": "카레 추가", "add_price": 3000}
            ]
          },
          {
            "id": 3,
            "name": "음료 선택",
            "select_min": 0,
            "select_max": 1,
            "options": [
              {"id": 4, "name": "코카콜라", "add_price": 2000},
              {"id": 5, "name": "스프라이트", "add_price": 2000},
              {"id": 6, "name": "코카콜라 제로", "add_price": 2000}
            ]
          }
        ]
      },
      {
        "id": 4,
        "name": "에비가쯔동",
        "price": 10000,
        "description": "",
        "grid_row": 1,
        "grid_col": 4,
        "grid_location": "(1행, 4열)",
        "aliases": ["에비가쯔동", "새우 가츠 동"],
        "option_groups": [
          {
            "id": 2,
            "name": "돈부리 추가",
            "select_min": 0,
            "select_max": 9,
            "options": [
              {"id": 1, "name": "밥 추가", "add_price": 1000},
              {"id": 2, "name": "계란 추가", "add_price": 1000},
              {"id": 3, "name": "카레 추가", "add_price": 3000}
            ]
          },
          {
            "id": 3,
            "name": "음료 선택",
            "select_min": 0,
            "select_max": 1,
            "options": [
              {"id": 4, "name": "코카콜라", "add_price": 2000},
              {"id": 5, "name": "스프라이트", "add_price": 2000},
              {"id": 6, "name": "코카콜라 제로", "add_price": 2000}
            ]
          }
        ]
      },
      {
        "id": 5,
        "name": "에비동",
        "price": 11000,
        "description": "",
        "grid_row": 2,
        "grid_col": 1,
        "grid_location": "(2행, 1열)",
        "aliases": [],
        "option_groups": [
          {
            "id": 2,
            "name": "돈부리 추가",
            "select_min": 0,
            "select_max": 9,
            "options": [
              {"id": 1, "name": "밥 추가", "add_price": 1000},
              {"id": 2, "name": "계란 추가", "add_price": 1000},
              {"id": 3, "name": "카레 추가", "add_price": 3000}
            ]
          },
          {
            "id": 3,
            "name": "음료 선택",
            "select_min": 0,
            "select_max": 1,
            "options": [
              {"id": 4, "name": "코카콜라", "add_price": 2000},
              {"id": 5, "name": "스프라이트", "add_price": 2000},
              {"id": 6, "name": "코카콜라 제로", "add_price": 2000}
            ]
          }
        ]
      },
      {
        "id": 6,
        "name": "사케동",
        "price": 12000,
        "description": "",
        "grid_row": 2,
        "grid_col": 2,
        "grid_location": "(2행, 2열)",
        "aliases": ["사케동", "사케 덮밥"],
        "option_groups": [
          {
            "id": 2,
            "name": "돈부리 추가",
            "select_min": 0,
            "select_max": 9,
            "options": [
              {"id": 1, "name": "밥 추가", "add_price": 1000},
              {"id": 2, "name": "계란 추가", "add_price": 1000},
              {"id": 3, "name": "카레 추가", "add_price": 3000}
            ]
          },
          {
            "id": 3,
            "name": "음료 선택",
            "select_min": 0,
            "select_max": 1,
            "options": [
              {"id": 4, "name": "코카콜라", "add_price": 2000},
              {"id": 5, "name": "스프라이트", "add_price": 2000},
              {"id": 6, "name": "코카콜라 제로", "add_price": 2000}
            ]
          }
        ]
      },
      {
        "id": 7,
        "name": "더블사케동",
        "price": 18000,
        "description": "",
        "grid_row": 2,
        "grid_col": 3,
        "grid_location": "(2행, 3열)",
        "aliases": [],
        "option_groups": [
          {
            "id": 2,
            "name": "돈부리 추가",
            "select_min": 0,
            "select_max": 9,
            "options": [
              {"id": 1, "name": "밥 추가", "add_price": 1000},
              {"id": 2, "name": "계란 추가", "add_price": 1000},
              {"id": 3, "name": "카레 추가", "add_price": 3000}
            ]
          },
          {
            "id": 3,
            "name": "음료 선택",
            "select_min": 0,
            "select_max": 1,
            "options": [
              {"id": 4, "name": "코카콜라", "add_price": 2000},
              {"id": 5, "name": "스프라이트", "add_price": 2000},
              {"id": 6, "name": "코카콜라 제로", "add_price": 2000}
            ]
          }
        ]
      },
      {
        "id": 8,
        "name": "유케동",
        "price": 11000,
        "description": "",
        "grid_row": 2,
        "grid_col": 4,
        "grid_location": "(2행, 4열)",
        "aliases": [],
        "option_groups": [
          {
            "id": 2,
            "name": "돈부리 추가",
            "select_min": 0,
            "select_max": 9,
            "options": [
              {"id": 1, "name": "밥 추가", "add_price": 1000},
              {"id": 2, "name": "계란 추가", "add_price": 1000},
              {"id": 3, "name": "카레 추가", "add_price": 3000}
            ]
          },
          {
            "id": 3,
            "name": "음료 선택",
            "select_min": 0,
            "select_max": 1,
            "options": [
              {"id": 4, "name": "코카콜라", "add_price": 2000},
              {"id": 5, "name": "스프라이트", "add_price": 2000},
              {"id": 6, "name": "코카콜라 제로", "add_price": 2000}
            ]
          }
        ]
      },
      {
        "id": 9,
        "name": "더블유케동",
        "price": 17000,
        "description": "",
        "grid_row": 3,
        "grid_col": 1,
        "grid_location": "(3행, 1열)",
        "aliases": [],
        "option_groups": [
          {
            "id": 2,
            "name": "돈부리 추가",
            "select_min": 0,
            "select_max": 9,
            "options": [
              {"id": 1, "name": "밥 추가", "add_price": 1000},
              {"id": 2, "name": "계란 추가", "add_price": 1000},
              {"id": 3, "name": "카레 추가", "add_price": 3000}
            ]
          },
          {
            "id": 3,
            "name": "음료 선택",
            "select_min": 0,
            "select_max": 1,
            "options": [
              {"id": 4, "name": "코카콜라", "add_price": 2000},
              {"id": 5, "name": "스프라이트", "add_price": 2000},
              {"id": 6, "name": "코카콜라 제로", "add_price": 2000}
            ]
          }
        ]
      },
      {
        "id": 10,
        "name": "유케사케동",
        "price": 14000,
        "description": "",
        "grid_row": 3,
        "grid_col": 2,
        "grid_location": "(3행, 2열)",
        "aliases": [],
        "option_groups": [
          {
            "id": 2,
            "name": "돈부리 추가",
            "select_min": 0,
            "select_max": 9,
            "options": [
              {"id": 1, "name": "밥 추가", "add_price": 1000},
              {"id": 2, "name": "계란 추가", "add_price": 1000},
              {"id": 3, "name": "카레 추가", "add_price": 3000}
            ]
          },
          {
            "id": 3,
            "name": "음료 선택",
            "select_min": 0,
            "select_max": 1,
            "options": [
              {"id": 4, "name": "코카콜라", "add_price": 2000},
              {"id": 5, "name": "스프라이트", "add_price": 2000},
              {"id": 6, "name": "코카콜라 제로", "add_price": 2000}
            ]
          }
        ]
      },
      {
        "id": 11,
        "name": "카라이가쯔동",
        "price": 10000,
        "description": "",
        "grid_row": 3,
        "grid_col": 3,
        "grid_location": "(3행, 3열)",
        "aliases": [],
        "option_groups": [
          {
            "id": 2,
            "name": "돈부리 추가",
            "select_min": 0,
            "select_max": 9,
            "options": [
              {"id": 1, "name": "밥 추가", "add_price": 1000},
              {"id": 2, "name": "계란 추가", "add_price": 1000},
              {"id": 3, "name": "카레 추가", "add_price": 3000}
            ]
          },
          {
            "id": 3,
            "name": "음료 선택",
            "select_min": 0,
            "select_max": 1,
            "options": [
              {"id": 4, "name": "코카콜라", "add_price": 2000},
              {"id": 5, "name": "스프라이트", "add_price": 2000},
              {"id": 6, "name": "코카콜라 제로", "add_price": 2000}
            ]
          }
        ]
      },
      {
        "id": 12,
        "name": "카라이에비가쯔동",
        "price": 11000,
        "description": "",
        "grid_row": 3,
        "grid_col": 4,
        "grid_location": "(3행, 4열)",
        "aliases": [],
        "option_groups": [
          {
            "id": 2,
            "name": "돈부리 추가",
            "select_min": 0,
            "select_max": 9,
            "options": [
              {"id": 1, "name": "밥 추가", "add_price": 1000},
              {"id": 2, "name": "계란 추가", "add_price": 1000},
              {"id": 3, "name": "카레 추가", "add_price": 3000}
            ]
          },
          {
            "id": 3,
            "name": "음료 선택",
            "select_min": 0,
            "select_max": 1,
            "options": [
              {"id": 4, "name": "코카콜라", "add_price": 2000},
              {"id": 5, "name": "스프라이트", "add_price": 2000},
              {"id": 6, "name": "코카콜라 제로", "add_price": 2000}
            ]
          }
        ]
      },
      {
        "id": 13,
        "name": "가라이규동",
        "price": 10500,
        "description": "",
        "grid_row": 4,
        "grid_col": 1,
        "grid_location": "(4행, 1열)",
        "aliases": [],
        "option_groups": [
          {
            "id": 2,
            "name": "돈부리 추가",
            "select_min": 0,
            "select_max": 9,
            "options": [
              {"id": 1, "name": "밥 추가", "add_price": 1000},
              {"id": 2, "name": "계란 추가", "add_price": 1000},
              {"id": 3, "name": "카레 추가", "add_price": 3000}
            ]
          },
          {
            "id": 3,
            "name": "음료 선택",
            "select_min": 0,
            "select_max": 1,
            "options": [
              {"id": 4, "name": "코카콜라", "add_price": 2000},
              {"id": 5, "name": "스프라이트", "add_price": 2000},
              {"id": 6, "name": "코카콜라 제로", "add_price": 2000}
            ]
          }
        ]
      },
      {
        "id": 14,
        "name": "더블가쯔동동",
        "price": 13000,
        "description": "",
        "grid_row": 4,
        "grid_col": 2,
        "grid_location": "(4행, 2열)",
        "aliases": [],
        "option_groups": [
          {
            "id": 2,
            "name": "돈부리 추가",
            "select_min": 0,
            "select_max": 9,
            "options": [
              {"id": 1, "name": "밥 추가", "add_price": 1000},
              {"id": 2, "name": "계란 추가", "add_price": 1000},
              {"id": 3, "name": "카레 추가", "add_price": 3000}
            ]
          },
          {
            "id": 3,
            "name": "음료 선택",
            "select_min": 0,
            "select_max": 1,
            "options": [
              {"id": 4, "name": "코카콜라", "add_price": 2000},
              {"id": 5, "name": "스프라이트", "add_price": 2000},
              {"id": 6, "name": "코카콜라 제로", "add_price": 2000}
            ]
          }
        ]
      },
      {
        "id": 15,
        "name": "카라이더블가쯔동",
        "price": 14000,
        "description": "",
        "grid_row": 4,
        "grid_col": 3,
        "grid_location": "(4행, 3열)",
        "aliases": [],
        "option_groups": [
          {
            "id": 2,
            "name": "돈부리 추가",
            "select_min": 0,
            "select_max": 9,
            "options": [
              {"id": 1, "name": "밥 추가", "add_price": 1000},
              {"id": 2, "name": "계란 추가", "add_price": 1000},
              {"id": 3, "name": "카레 추가", "add_price": 3000}
            ]
          },
          {
            "id": 3,
            "name": "음료 선택",
            "select_min": 0,
            "select_max": 1,
            "options": [
              {"id": 4, "name": "코카콜라", "add_price": 2000},
              {"id": 5, "name": "스프라이트", "add_price": 2000},
              {"id": 6, "name": "코카콜라 제로", "add_price": 2000}
            ]
          }
        ]
      }
    ]
  },
  {
    "id": 2,
    "name": "카레",
    "ui_tab_name": "카레",
    "menus": [
      {
        "id": 16,
        "name": "카쯔카레",
        "price": 10000,
        "description": "",
        "grid_row": 1,
        "grid_col": 1,
        "grid_location": "(1행, 1열)",
        "aliases": ["카쯔카레", "카츠카레", "가츠카레", "돈까스 카레"],
        "option_groups": [
          {
            "id": 1,
            "name": "카레 추가",
            "select_min": 0,
            "select_max": 7,
            "options": [
              {"id": 7, "name": "밥 추가", "add_price": 1000},
              {"id": 8, "name": "계란 추가", "add_price": 1000},
              {"id": 9, "name": "카레 추가", "add_price": 3000}
            ]
          },
          {
            "id": 3,
            "name": "음료 선택",
            "select_min": 0,
            "select_max": 1,
            "options": [
              {"id": 4, "name": "코카콜라", "add_price": 2000},
              {"id": 5, "name": "스프라이트", "add_price": 2000},
              {"id": 6, "name": "코카콜라 제로", "add_price": 2000}
            ]
          }
        ]
      },
      {
        "id": 17,
        "name": "규카레",
        "price": 10500,
        "description": "",
        "grid_row": 1,
        "grid_col": 2,
        "grid_location": "(1행, 2열)",
        "aliases": ["규카레", "규 카레"],
        "option_groups": [
          {
            "id": 1,
            "name": "카레 추가",
            "select_min": 0,
            "select_max": 7,
            "options": [
              {"id": 7, "name": "밥 추가", "add_price": 1000},
              {"id": 8, "name": "계란 추가", "add_price": 1000},
              {"id": 9, "name": "카레 추가", "add_price": 3000}
            ]
          },
          {
            "id": 3,
            "name": "음료 선택",
            "select_min": 0,
            "select_max": 1,
            "options": [
              {"id": 4, "name": "코카콜라", "add_price": 2000},
              {"id": 5, "name": "스프라이트", "add_price": 2000},
              {"id": 6, "name": "코카콜라 제로", "add_price": 2000}
            ]
          }
        ]
      },
      {
        "id": 18,
        "name": "에비가쯔카레",
        "price": 11000,
        "description": "",
        "grid_row": 1,
        "grid_col": 3,
        "grid_location": "(1행, 3열)",
        "aliases": ["에비가쯔카레", "에비 가츠 카레", "새우 돈까스 카레"],
        "option_groups": [
          {
            "id": 1,
            "name": "카레 추가",
            "select_min": 0,
            "select_max": 7,
            "options": [
              {"id": 7, "name": "밥 추가", "add_price": 1000},
              {"id": 8, "name": "계란 추가", "add_price": 1000},
              {"id": 9, "name": "카레 추가", "add_price": 3000}
            ]
          },
          {
            "id": 3,
            "name": "음료 선택",
            "select_min": 0,
            "select_max": 1,
            "options": [
              {"id": 4, "name": "코카콜라", "add_price": 2000},
              {"id": 5, "name": "스프라이트", "add_price": 2000},
              {"id": 6, "name": "코카콜라 제로", "add_price": 2000}
            ]
          }
        ]
      },
      {
        "id": 19,
        "name": "에비카레",
        "price": 12000,
        "description": "",
        "grid_row": 1,
        "grid_col": 4,
        "grid_location": "(1행, 4열)",
        "aliases": ["에비카레", "새우 카레"],
        "option_groups": [
          {
            "id": 1,
            "name": "카레 추가",
            "select_min": 0,
            "select_max": 7,
            "options": [
              {"id": 7, "name": "밥 추가", "add_price": 1000},
              {"id": 8, "name": "계란 추가", "add_price": 1000},
              {"id": 9, "name": "카레 추가", "add_price": 3000}
            ]
          },
          {
            "id": 3,
            "name": "음료 선택",
            "select_min": 0,
            "select_max": 1,
            "options": [
              {"id": 4, "name": "코카콜라", "add_price": 2000},
              {"id": 5, "name": "스프라이트", "add_price": 2000},
              {"id": 6, "name": "코카콜라 제로", "add_price": 2000}
            ]
          }
        ]
      },
      {
        "id": 20,
        "name": "더블가쯔카레",
        "price": 14000,
        "description": "",
        "grid_row": 2,
        "grid_col": 1,
        "grid_location": "(2행, 1열)",
        "aliases": ["더블가쯔카레", "더블 가츠 카레"],
        "option_groups": [
          {
            "id": 1,
            "name": "카레 추가",
            "select_min": 0,
            "select_max": 7,
            "options": [
              {"id": 7, "name": "밥 추가", "add_price": 1000},
              {"id": 8, "name": "계란 추가", "add_price": 1000},
              {"id": 9, "name": "카레 추가", "add_price": 3000}
            ]
          },
          {
            "id": 3,
            "name": "음료 선택",
            "select_min": 0,
            "select_max": 1,
            "options": [
              {"id": 4, "name": "코카콜라", "add_price": 2000},
              {"id": 5, "name": "스프라이트", "add_price": 2000},
              {"id": 6, "name": "코카콜라 제로", "add_price": 2000}
            ]
          }
        ]
      }
    ]
  }
];
