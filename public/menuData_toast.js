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
        "description": "",
        "grid_row": 1,
        "grid_col": 1,
        "grid_location": "(1행, 1열)",
        "aliases": ["프렌치 크림 브리오슈 세트", "프렌치 크림 세트"],
        "option_groups": [
          {
            "id": 1,
            "name": "사이드(필수)",
            "select_min": 1,
            "select_max": 1,
            "options": [
              {"id": 1, "name": "포테이토 팝", "add_price": 0},
              {"id": 2, "name": "포테이토 팝(버터갈릭)", "add_price": 300},
              {"id": 3, "name": "포테이토 팝(칠리)", "add_price": 300},
              {"id": 4, "name": "코울슬로", "add_price": 800}
            ]
          },
          {
            "id": 2,
            "name": "음료(필수)",
            "select_min": 1,
            "select_max": 1,
            "options": [
              {"id": 5, "name": "콜라(캔)", "add_price": 0},
              {"id": 6, "name": "제로 콜라(캔)", "add_price": 0},
              {"id": 7, "name": "사이다(캔)", "add_price": 0},
              {"id": 8, "name": "제로 사이다(캔)", "add_price": 0},
              {"id": 9, "name": "H.아메리카노(Hot)", "add_price": 800},
              {"id": 10, "name": "I.아메리카노(Ice)", "add_price": 800}
            ]
          }
        ]
      },
      {
        "id": 2,
        "name": "애플 크림 브리오슈 세트",
        "price": 6600,
        "description": "",
        "grid_row": 1,
        "grid_col": 2,
        "grid_location": "(1행, 2열)",
        "aliases": ["애플 크림 브리오슈 세트", "애플 브리오슈 세트"],
        "option_groups": [
          {
            "id": 1,
            "name": "사이드(필수)",
            "select_min": 1,
            "select_max": 1,
            "options": [
              {"id": 1, "name": "포테이토 팝", "add_price": 0},
              {"id": 2, "name": "포테이토 팝(버터갈릭)", "add_price": 300},
              {"id": 3, "name": "포테이토 팝(칠리)", "add_price": 300},
              {"id": 4, "name": "코울슬로", "add_price": 800}
            ]
          },
          {
            "id": 2,
            "name": "음료(필수)",
            "select_min": 1,
            "select_max": 1,
            "options": [
              {"id": 5, "name": "콜라(캔)", "add_price": 0},
              {"id": 6, "name": "제로 콜라(캔)", "add_price": 0},
              {"id": 7, "name": "사이다(캔)", "add_price": 0},
              {"id": 8, "name": "제로 사이다(캔)", "add_price": 0},
              {"id": 9, "name": "H.아메리카노(Hot)", "add_price": 800},
              {"id": 10, "name": "I.아메리카노(Ice)", "add_price": 800}
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
        "id": 3,
        "name": "프렌치 크림 브리오슈",
        "price": 4100,
        "description": "",
        "grid_row": 1,
        "grid_col": 1,
        "grid_location": "(1행, 1열)",
        "aliases": ["프렌치 크림 브리오슈", "브리오슈"],
        "option_groups": []
      },
      {
        "id": 4,
        "name": "애플 크림 브리오슈",
        "price": 3700,
        "description": "",
        "grid_row": 1,
        "grid_col": 2,
        "grid_location": "(1행, 2열)",
        "aliases": ["애플 크림 브리오슈", "애플 브리오슈"],
        "option_groups": []
      },
      {
        "id": 5,
        "name": "햄스페셜 토스트",
        "price": 3800,
        "description": "",
        "grid_row": 2,
        "grid_col": 1,
        "grid_location": "(2행, 1열)",
        "aliases": ["햄스페셜 토스트", "햄 스페셜"],
        "option_groups": []
      },
      {
        "id": 6,
        "name": "베이컨 베스트",
        "price": 4300,
        "description": "",
        "grid_row": 2,
        "grid_col": 2,
        "grid_location": "(2행, 2열)",
        "aliases": ["베이컨 베스트"],
        "option_groups": []
      },
      {
        "id": 7,
        "name": "그릴드 불고기",
        "price": 5000,
        "description": "",
        "grid_row": 2,
        "grid_col": 3,
        "grid_location": "(2행, 3열)",
        "aliases": ["그릴드 불고기", "불고기 토스트"],
        "option_groups": []
      }
    ]
  },
  {
    "id": 4,
    "name": "사이드",
    "ui_tab_name": "사이드",
    "menus": [
      {
        "id": 8,
        "name": "포테이토 팝",
        "price": 2100,
        "description": "",
        "grid_row": 1,
        "grid_col": 1,
        "grid_location": "(1행, 1열)",
        "aliases": ["포테이토 팝"],
        "option_groups": []
      },
      {
        "id": 9,
        "name": "포테이토 팝(버터갈릭)",
        "price": 2400,
        "description": "",
        "grid_row": 1,
        "grid_col": 4,
        "grid_location": "(1행, 4열)",
        "aliases": ["포테이토 팝(버터갈릭)"],
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
        "id": 10,
        "name": "H.아메리카노(Hot)",
        "price": 2900,
        "description": "",
        "grid_row": null,
        "grid_col": null,
        "grid_location": null,
        "aliases": ["H.아메리카노(Hot)"],
        "option_groups": []
      },
      {
        "id": 11,
        "name": "I.아메리카노(Ice)",
        "price": 2900,
        "description": "",
        "grid_row": null,
        "grid_col": null,
        "grid_location": null,
        "aliases": ["I.아메리카노(Ice)"],
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
        "id": 12,
        "name": "콜라(캔)",
        "price": 0,
        "description": "",
        "grid_row": null,
        "grid_col": null,
        "grid_location": null,
        "aliases": ["콜라(캔)"],
        "option_groups": []
      },
      {
        "id": 13,
        "name": "제로 콜라(캔)",
        "price": 0,
        "description": "",
        "grid_row": null,
        "grid_col": null,
        "grid_location": null,
        "aliases": ["제로 콜라(캔)"],
        "option_groups": []
      }
    ]
  }
];

