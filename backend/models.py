from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class CategoryResponse(BaseModel):
    id: int
    name: str
    display_name: str
    description: Optional[str] = None
    created_at: datetime

class MenuItemResponse(BaseModel):
    id: int
    category_id: int
    name: str
    price: int
    description: Optional[str] = None
    is_available: bool = True
    created_at: datetime

class OptionResponse(BaseModel):
    id: int
    name: str
    price: int
    option_type: str
    is_available: bool = True
    created_at: datetime

class MenuItemWithCategory(MenuItemResponse):
    category_name: str

class OrderItemOption(BaseModel):
    option_id: int
    quantity: int = 1

class OrderItem(BaseModel):
    menu_item_id: int
    quantity: int = 1
    options: List[OrderItemOption] = []

class CreateOrderRequest(BaseModel):
    items: List[OrderItem]

class OrderResponse(BaseModel):
    id: int
    order_number: str
    total_amount: int
    status: str
    created_at: datetime

class VoiceGuideResponse(BaseModel):
    categories: List[CategoryResponse]
    sample_menus: dict  # {category_name: [sample_menu_names]}

class MenuItemDetailResponse(MenuItemResponse):
    category_name: str
    available_options: List[OptionResponse]
