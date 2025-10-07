from pydantic import BaseModel
from typing import List, Optional

# Pydantic 모델 정의
class StoreBase(BaseModel):
    name: str
    location: str

class StoreCreate(StoreBase):
    pass

class Store(StoreBase):
    id: int
    
    class Config:
        from_attributes = True

class OptionBase(BaseModel):
    option_name: str
    price: int

class Option(OptionBase):
    id: int
    menu_id: int
    
    class Config:
        from_attributes = True

class ProcedureBase(BaseModel):
    step_order: int
    instruction: str

class Procedure(ProcedureBase):
    id: int
    menu_id: int
    
    class Config:
        from_attributes = True

class MenuBase(BaseModel):
    name: str
    category: str
    price: int

class MenuCreate(MenuBase):
    store_id: int

class Menu(MenuBase):
    id: int
    store_id: int
    options: List[Option] = []
    procedures: List[Procedure] = []
    
    class Config:
        from_attributes = True

class MenuWithDetails(Menu):
    store: Store
    
    class Config:
        from_attributes = True

# 음성 대화용 응답 모델
class VoiceResponse(BaseModel):
    response: str
    menu_suggestions: Optional[List[Menu]] = None
    procedures: Optional[List[Procedure]] = None

# 메뉴 추천 요청 모델
class MenuRecommendationRequest(BaseModel):
    meal_type: str  # "식사" 또는 "간식"
    temperature: str  # "따뜻한" 또는 "시원한"
    spiciness: str  # "매운" 또는 "안매운"
    food_type: str  # "밥" 또는 "면"

# 메뉴 추천 응답 모델
class MenuRecommendationResponse(BaseModel):
    recommendations: List[Menu]
    total_count: int
    selection_summary: str