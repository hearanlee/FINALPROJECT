# 메뉴 추천 API 명세서

## 개요
사용자의 선택에 따라 메뉴를 추천하는 API입니다. 4단계 선택 과정을 통해 맞춤형 메뉴를 제공합니다.

## 기본 정보
- **Base URL**: `http://localhost:8000`
- **Content-Type**: `application/json`
- **API 버전**: 1.0.0

## API 엔드포인트

### 1. 메뉴 추천 API

#### POST `/api/recommend-menu`

사용자의 4단계 선택에 따라 메뉴를 추천합니다.

**요청 본문 (Request Body)**
```json
{
  "meal_type": "식사",
  "temperature": "따뜻한",
  "spiciness": "안매운",
  "food_type": "면"
}
```

**요청 필드 설명**
| 필드명 | 타입 | 필수 | 가능한 값 | 설명 |
|--------|------|------|-----------|------|
| `meal_type` | string | ✅ | "식사", "간식" | 식사 유형 선택 |
| `temperature` | string | ✅ | "따뜻한", "시원한" | 음식 온도 선택 |
| `spiciness` | string | ✅ | "매운", "안매운" | 매운 정도 선택 |
| `food_type` | string | ✅ | "밥", "면" | 음식 종류 선택 |

**응답 예시**
```json
{
  "recommendations": [
    {
      "id": 1,
      "store_id": 1,
      "name": "차돌양지쌀국수",
      "category": "쌀국수",
      "price": 9900,
      "options": [],
      "procedures": []
    },
    {
      "id": 2,
      "store_id": 1,
      "name": "한우쌀국수",
      "category": "쌀국수",
      "price": 10900,
      "options": [],
      "procedures": []
    },
    {
      "id": 3,
      "store_id": 1,
      "name": "모듬 쌀국수",
      "category": "쌀국수",
      "price": 11900,
      "options": [],
      "procedures": []
    }
  ],
  "total_count": 3,
  "selection_summary": "식사 - 따뜻한 음식 - 안매운 음식 - 면"
}
```

**응답 필드 설명**
| 필드명 | 타입 | 설명 |
|--------|------|------|
| `recommendations` | array | 추천된 메뉴 목록 |
| `total_count` | integer | 추천된 메뉴 개수 |
| `selection_summary` | string | 사용자 선택 요약 |

**메뉴 객체 구조**
| 필드명 | 타입 | 설명 |
|--------|------|------|
| `id` | integer | 메뉴 고유 ID |
| `store_id` | integer | 매장 ID |
| `name` | string | 메뉴명 |
| `category` | string | 메뉴 카테고리 |
| `price` | integer | 가격 (원) |
| `options` | array | 메뉴 옵션 목록 |
| `procedures` | array | 주문 절차 목록 |

**HTTP 상태 코드**
- `200`: 성공
- `404`: 추천할 메뉴를 찾을 수 없음
- `500`: 서버 내부 오류

---

### 2. 추천 규칙 조회 API (관리자용)

#### GET `/api/recommendation-rules`

모든 메뉴 추천 규칙을 조회합니다.

**응답 예시**
```json
[
  {
    "id": 1,
    "meal_type": "식사",
    "temperature": "따뜻한",
    "spiciness": "안매운",
    "food_type": "면",
    "menu_ids": "1,2,3",
    "created_at": "2024-01-01 12:00:00"
  },
  {
    "id": 2,
    "meal_type": "식사",
    "temperature": "따뜻한",
    "spiciness": "안매운",
    "food_type": "밥",
    "menu_ids": "10,11,12,4,5,6,7,8,9",
    "created_at": "2024-01-01 12:00:00"
  }
]
```

---

## 사용 예시

### JavaScript (Fetch API)
```javascript
// 메뉴 추천 요청
async function getMenuRecommendation(selections) {
  try {
    const response = await fetch('http://localhost:8000/api/recommend-menu', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        meal_type: selections.mealType,
        temperature: selections.temperature,
        spiciness: selections.spiciness,
        food_type: selections.foodType
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('메뉴 추천 요청 실패:', error);
    throw error;
  }
}

// 사용 예시
const selections = {
  mealType: "식사",
  temperature: "따뜻한",
  spiciness: "안매운",
  foodType: "면"
};

getMenuRecommendation(selections)
  .then(data => {
    console.log('추천 메뉴:', data.recommendations);
    console.log('총 개수:', data.total_count);
    console.log('선택 요약:', data.selection_summary);
  })
  .catch(error => {
    console.error('오류 발생:', error);
  });
```

### React 컴포넌트 예시
```jsx
import React, { useState } from 'react';

const MenuRecommendation = () => {
  const [selections, setSelections] = useState({
    mealType: '',
    temperature: '',
    spiciness: '',
    foodType: ''
  });
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleRecommendation = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/recommend-menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selections)
      });
      
      const data = await response.json();
      setRecommendations(data.recommendations);
    } catch (error) {
      console.error('추천 요청 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* 선택 UI */}
      <div>
        <label>
          <input 
            type="radio" 
            value="식사" 
            checked={selections.mealType === '식사'}
            onChange={(e) => setSelections({...selections, mealType: e.target.value})}
          />
          식사
        </label>
        <label>
          <input 
            type="radio" 
            value="간식" 
            checked={selections.mealType === '간식'}
            onChange={(e) => setSelections({...selections, mealType: e.target.value})}
          />
          간식
        </label>
      </div>
      
      {/* 나머지 선택 UI들... */}
      
      <button onClick={handleRecommendation} disabled={loading}>
        {loading ? '추천 중...' : '메뉴 추천받기'}
      </button>
      
      {/* 추천 결과 표시 */}
      <div>
        {recommendations.map(menu => (
          <div key={menu.id}>
            <h3>{menu.name}</h3>
            <p>가격: {menu.price.toLocaleString()}원</p>
            <p>카테고리: {menu.category}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuRecommendation;
```

---

## 추천 규칙

현재 구현된 추천 규칙:

1. **식사 → 따뜻한 음식 → 안매운 음식 → 면** → 쌀국수 메뉴들 (차돌양지쌀국수, 한우쌀국수, 모듬 쌀국수)

2. **식사 → 따뜻한 음식 → 안매운 음식 → 밥** → 카레라이스, 돈까스 메뉴들 (등심카츠 카레라이스, 안심카츠 카레라이스, 통모짜치즈 카레라이스, 프리미엄 로스카츠, 프리미엄 히레츠, 통모짜치즈돈카츠, 시그니처 경양식돈카츠, 모듬카츠A, 모듬카츠B)

---

## 에러 처리

API는 다음과 같은 에러 상황을 처리합니다:

1. **404 Not Found**: 해당 선택에 맞는 추천 규칙이 없을 때
2. **500 Internal Server Error**: 서버 내부 오류 발생 시

에러 응답 예시:
```json
{
  "detail": "추천할 메뉴를 찾을 수 없습니다"
}
```

---

## 개발자 노트

- API는 FastAPI로 구현되어 있으며, 자동으로 OpenAPI 문서를 생성합니다
- Swagger UI는 `http://localhost:8000/docs`에서 확인할 수 있습니다
- 데이터베이스는 SQLite를 사용하며, 초기 데이터는 자동으로 생성됩니다
- CORS가 설정되어 있어 프론트엔드에서 직접 호출 가능합니다
