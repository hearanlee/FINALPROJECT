# 현재 위치 정확도 향상 방법

## 1. Geolocation API 옵션 최적화

### 현재 설정
```javascript
{
    enableHighAccuracy: true,  // GPS 사용
    timeout: 30000,            // 30초 타임아웃
    maximumAge: 0             // 캐시 사용 안함
}
```

### 개선 방법
- **timeout 증가**: 30초 → 60초 (더 정확한 GPS 신호 대기)
- **enableHighAccuracy**: 이미 최적 설정
- **maximumAge**: 이미 최적 설정

## 2. 다중 측정 및 최적 위치 선택

### 방법
여러 번 위치를 측정하고 가장 정확한 값을 선택:

```javascript
// 여러 시도 중 가장 정확한 위치 선택
let bestPosition = null;
let attempts = 0;
const maxAttempts = 3;
const minAccuracy = 20; // 목표 정확도 (미터)

function tryGetPosition() {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const accuracy = position.coords.accuracy;
            
            // 더 정확한 위치이면 업데이트
            if (!bestPosition || accuracy < bestPosition.coords.accuracy) {
                bestPosition = position;
            }
            
            // 충분히 정확하거나 최대 시도에 도달하면 완료
            if (accuracy <= minAccuracy || attempts >= maxAttempts) {
                usePosition(bestPosition);
            } else {
                // 더 정확한 위치를 위해 재시도
                setTimeout(tryGetPosition, 2000);
            }
        },
        handleError,
        {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 0
        }
    );
}
```

## 3. 위치 추적 시 정확도 필터링

### 방법
정확도가 낮은 위치 업데이트는 무시:

```javascript
watchPosition((position) => {
    const accuracy = position.coords.accuracy;
    
    // 정확도가 너무 나쁘면 무시 (예: 100m 이상)
    if (accuracy > 100) {
        console.log('정확도가 너무 낮아 무시:', accuracy);
        return;
    }
    
    // 정확도가 개선되었을 때만 업데이트
    if (accuracy < currentAccuracy * 0.8) {
        updateLocation(position);
    }
});
```

## 4. 하이브리드 위치 서비스 사용

### 방법
WiFi, 셀룰러, GPS를 모두 활용 (브라우저가 자동 처리):
- 실내에서는 WiFi/셀룰러 활용
- 실외에서는 GPS 활용
- `enableHighAccuracy: true`가 자동으로 최적 선택

## 5. Tmap API를 활용한 위치 보정

### 방법
주변 POI 검색을 통해 정확한 위치 확보:

```javascript
// Tmap 주변 검색으로 정확한 위치 찾기
function refineLocationWithPOI(lat, lon) {
    // 주변 POI 검색
    // 가장 가까운 POI의 좌표를 사용하여 위치 보정
}
```

## 6. 환경 요인 개선

### 사용자 환경
- **실외에서 사용**: GPS 신호 강도 증가
- **건물 밖에서 측정**: 실내 GPS 신호 약함
- **스마트폰 사용**: 태블릿보다 정확도 높음
- **GPS 안테나 노출**: 가방/주머니에서 꺼내기

### 브라우저 설정
- **HTTPS 환경**: Geolocation API가 더 정확하게 동작
- **위치 권한 허용**: 항상 허용 권장

## 7. 위치 데이터 평활화 (Smoothing)

### 방법
여러 위치 데이터의 평균을 계산:

```javascript
const positionHistory = [];
const maxHistorySize = 5;

function smoothPosition(newPosition) {
    positionHistory.push(newPosition);
    if (positionHistory.length > maxHistorySize) {
        positionHistory.shift();
    }
    
    // 평균 위치 계산
    const avgLat = positionHistory.reduce((sum, p) => sum + p.lat, 0) / positionHistory.length;
    const avgLon = positionHistory.reduce((sum, p) => sum + p.lon, 0) / positionHistory.length;
    
    return { lat: avgLat, lon: avgLon };
}
```

## 8. 시간 기반 필터링

### 방법
너무 자주 업데이트하지 않도록 제한:

```javascript
let lastUpdateTime = 0;
const minUpdateInterval = 5000; // 5초

watchPosition((position) => {
    const now = Date.now();
    
    // 최소 업데이트 간격 확인
    if (now - lastUpdateTime < minUpdateInterval) {
        return;
    }
    
    lastUpdateTime = now;
    updateLocation(position);
});
```

## 추천 적용 방법

현재 코드에 바로 적용 가능한 순서:

1. ✅ **Geolocation 옵션 최적화** (이미 적용됨)
2. ⭐ **다중 측정 및 최적 위치 선택** (높은 효과)
3. ⭐ **정확도 필터링** (중간 효과)
4. ⭐ **위치 평활화** (움직임 안정화)

## 참고사항

- **정확도 범위**:
  - GPS 실외: 5-10m
  - WiFi/셀룰러: 10-50m
  - 실내 GPS: 50-200m
  
- **최적 설정**:
  - 실외: `enableHighAccuracy: true`, `timeout: 30초`
  - 실내: WiFi 기반 위치 사용 권장

