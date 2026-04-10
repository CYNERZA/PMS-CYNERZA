# Schemas module initialization

from app.schemas.user import (
    UserBase, UserCreate, UserRead, 
    Token, TokenData, LoginRequest, SetupStatus
)
from app.schemas.room_type import (
    RoomTypeBase, RoomTypeCreate, RoomTypeUpdate, RoomTypeRead
)
from app.schemas.inventory import (
    InventoryBase, InventoryRead, InventoryQuery, 
    InventoryUpdate, InventoryAvailability, DateRangeAvailability
)
from app.schemas.customer import (
    CustomerBase, CustomerCreate, CustomerUpdate, 
    CustomerRead, CustomerListRead, CustomerBookingSummary
)
from app.schemas.booking import (
    BookingCreate, BookingRead, BookingUpdate, 
    BookingCancellation, CustomerInfo
)

__all__ = [
    # User
    "UserBase", "UserCreate", "UserRead", "Token", "TokenData", "LoginRequest", "SetupStatus",
    # Room Type
    "RoomTypeBase", "RoomTypeCreate", "RoomTypeUpdate", "RoomTypeRead",
    # Inventory
    "InventoryBase", "InventoryRead", "InventoryQuery", 
    "InventoryUpdate", "InventoryAvailability", "DateRangeAvailability",
    # Customer
    "CustomerBase", "CustomerCreate", "CustomerUpdate", 
    "CustomerRead", "CustomerListRead", "CustomerBookingSummary",
    # Booking
    "BookingCreate", "BookingRead", "BookingUpdate", 
    "BookingCancellation", "CustomerInfo"
]
