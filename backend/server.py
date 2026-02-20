from fastapi import FastAPI, APIRouter, HTTPException, Depends, UploadFile, File, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta
import jwt
import bcrypt
import base64

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Configuration
JWT_SECRET = os.environ.get('JWT_SECRET', 'roadtojannah-secret-key-2024')
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24

# Create the main app
app = FastAPI(title="Road to Jannah API")
api_router = APIRouter(prefix="/api")
security = HTTPBearer()

# ==================== MODELS ====================

class AdminLogin(BaseModel):
    email: str
    password: str

class AdminCreate(BaseModel):
    email: str
    password: str
    name: str

class TokenResponse(BaseModel):
    token: str
    email: str
    name: str

class Translation(BaseModel):
    en: str = ""
    ar: str = ""
    tr: str = ""

class PrayerTime(BaseModel):
    name: Translation = Field(default_factory=lambda: Translation(en="", ar="", tr=""))
    time: str = ""
    notes: Translation = Field(default_factory=lambda: Translation(en="", ar="", tr=""))

class ScheduleDay(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    date: str = ""
    hijri_date: str = ""
    is_special: bool = False
    special_note: Translation = Field(default_factory=lambda: Translation(en="", ar="", tr=""))
    tahajjud_time: str = ""
    tahajjud_enabled: bool = False

class Last10Night(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    night_number: int
    date: str = ""
    program: Translation = Field(default_factory=lambda: Translation(en="", ar="", tr=""))
    special_activities: Translation = Field(default_factory=lambda: Translation(en="", ar="", tr=""))

class Announcement(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: Translation = Field(default_factory=lambda: Translation(en="", ar="", tr=""))
    content: Translation = Field(default_factory=lambda: Translation(en="", ar="", tr=""))
    image_url: str = ""
    is_active: bool = True
    is_banner: bool = False
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class VolunteerSubmission(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    phone: str
    skills: str
    availability: str
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class VolunteerCreate(BaseModel):
    name: str
    phone: str
    skills: str
    availability: str

class Activity(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: Translation = Field(default_factory=lambda: Translation(en="", ar="", tr=""))
    description: Translation = Field(default_factory=lambda: Translation(en="", ar="", tr=""))
    icon: str = "BookOpen"

class SiteContent(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    # Masjid Info
    masjid_name: Translation = Field(default_factory=lambda: Translation(en="Yazicizade Mosque", ar="مسجد يازيجي زاده", tr="Yazicizade Camii"))
    masjid_address: Translation = Field(default_factory=lambda: Translation(en="88PF+64G, Namık Kemal Cd, Girne 99300", ar="88PF+64G، شارع نامق كمال، كيرينيا 99300", tr="88PF+64G, Namık Kemal Cd, Girne 99300"))
    google_maps_link: str = "https://www.google.com/maps/place/Yazicizade+Mosque/@35.3394,33.3242,17z"
    google_maps_embed: str = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3258.8!2d33.3242!3d35.3394!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzXCsDIwJzIxLjgiTiAzM8KwMTknMjcuMSJF!5e0!3m2!1sen!2s!4v1"
    parking_notes: Translation = Field(default_factory=lambda: Translation(en="Free parking available on the street and nearby lots.", ar="مواقف مجانية متوفرة في الشارع والمواقف القريبة.", tr="Sokakta ve yakın alanlarda ücretsiz park yeri mevcuttur."))
    accessibility_notes: Translation = Field(default_factory=lambda: Translation(en="The mosque is accessible with ramps for wheelchair users.", ar="المسجد متاح مع منحدرات لمستخدمي الكراسي المتحركة.", tr="Cami tekerlekli sandalye kullanıcıları için rampalarla erişilebilir."))
    masjid_image: str = ""
    
    # Hero Section
    hero_title: Translation = Field(default_factory=lambda: Translation(
        en="Ramadan Taraweeh & Tahajjud at Yazicizade Mosque",
        ar="صلاة التراويح والتهجد في مسجد يازيجي زاده",
        tr="Yazicizade Camii'nde Ramazan Teravih ve Teheccüd"
    ))
    hero_subtitle: Translation = Field(default_factory=lambda: Translation(
        en="Join us on the road to Jannah through prayer, Qur'an, and community.",
        ar="انضم إلينا في الطريق إلى الجنة من خلال الصلاة والقرآن والمجتمع.",
        tr="Dua, Kur'an ve topluluk aracılığıyla Cennet'e giden yolda bize katılın."
    ))
    hero_image: str = "https://images.pexels.com/photos/1652303/pexels-photo-1652303.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
    
    # Prayer Times (Tonight's Widget)
    isha_time: str = "8:30 PM"
    taraweeh_note: Translation = Field(default_factory=lambda: Translation(en="After Isha", ar="بعد صلاة العشاء", tr="Yatsı'dan sonra"))
    tahajjud_time: str = "3:00 AM"
    tahajjud_enabled: bool = True
    prayer_times_updated: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    
    # WhatsApp Links
    whatsapp_community_link: str = "https://chat.whatsapp.com/placeholder-community"
    whatsapp_group_link: str = "https://chat.whatsapp.com/placeholder-group"
    
    # Donations
    bank_name: str = "Ziraat Bank"
    account_name: str = "SALIH SAMIER S OTMAN"
    iban: str = "TR51 0001 0021 0498 0591 7850 01"
    donation_explanation: Translation = Field(default_factory=lambda: Translation(
        en="Your contributions help support masjid activities, Qur'an programs, and Ramadan arrangements.",
        ar="تساهم تبرعاتك في دعم أنشطة المسجد وبرامج القرآن وترتيبات رمضان.",
        tr="Katkılarınız cami faaliyetlerini, Kur'an programlarını ve Ramazan düzenlemelerini desteklemeye yardımcı olur."
    ))
    donation_qr_image: str = ""
    
    # Founder
    founder_name: str = "Anwar Abdulkadir"
    founder_alias: str = "Abu Eisa (أبو عيسى)"
    founder_title: Translation = Field(default_factory=lambda: Translation(
        en="Founder of roadtojannah Initiative",
        ar="مؤسس مبادرة الطريق إلى الجنة",
        tr="roadtojannah Girişiminin Kurucusu"
    ))
    founder_bio: Translation = Field(default_factory=lambda: Translation(
        en="Anwar Abdulkadir, also known as Abu Eisa (أبو عيسى), founded the roadtojannah Initiative to create a structured space for prayer, Qur'an, and community engagement during Ramadan and beyond. The initiative focuses on strengthening faith, knowledge, and unity through organized Islamic programs at Yazicizade Mosque.",
        ar="أسس أنور عبد القادر، المعروف أيضًا بأبي عيسى، مبادرة الطريق إلى الجنة لإنشاء مساحة منظمة للصلاة والقرآن والمشاركة المجتمعية خلال شهر رمضان وما بعده. تركز المبادرة على تعزيز الإيمان والمعرفة والوحدة من خلال البرامج الإسلامية المنظمة في مسجد يازيجي زاده.",
        tr="Anwar Abdulkadir, Abu Eisa (أبو عيسى) olarak da bilinir, roadtojannah Girişimini Ramazan ve sonrasında namaz, Kur'an ve topluluk katılımı için yapılandırılmış bir alan oluşturmak amacıyla kurdu. Girişim, Yazicizade Camii'ndeki organize İslami programlar aracılığıyla imanı, bilgiyi ve birliği güçlendirmeye odaklanıyor."
    ))
    founder_image: str = "https://customer-assets.emergentagent.com/job_road-to-jannah/artifacts/2syzy3fc_image.png"
    founder_phone: str = "+966 53 253 7323"
    founder_email: str = "drzakirnaikismyrolemodel@gmail.com"
    founder_instagram: str = "@_anwarabdulkadir"
    
    # Activities
    activities: List[Activity] = Field(default_factory=lambda: [
        Activity(
            title=Translation(en="Tajweed Correction", ar="تصحيح التجويد", tr="Tecvid Düzeltme"),
            description=Translation(
                en="Learn proper Qur'an recitation with expert guidance on pronunciation and rules.",
                ar="تعلم تلاوة القرآن الصحيحة مع إرشادات خبيرة حول النطق والقواعد.",
                tr="Telaffuz ve kurallar hakkında uzman rehberliğiyle doğru Kur'an tilavetini öğrenin."
            ),
            icon="BookOpen"
        ),
        Activity(
            title=Translation(en="Memorization & Revision", ar="الحفظ والمراجعة", tr="Ezberleme ve Tekrar"),
            description=Translation(
                en="Structured sessions for memorizing new verses and revising previously learned portions.",
                ar="جلسات منظمة لحفظ آيات جديدة ومراجعة الأجزاء المحفوظة سابقًا.",
                tr="Yeni ayetleri ezberleme ve daha önce öğrenilen bölümleri tekrarlama için yapılandırılmış oturumlar."
            ),
            icon="Brain"
        ),
        Activity(
            title=Translation(en="Tafsir Reminders", ar="تذكيرات التفسير", tr="Tefsir Hatırlatmaları"),
            description=Translation(
                en="Brief explanations and reflections on the meanings of Qur'anic verses.",
                ar="شروحات موجزة وتأملات في معاني آيات القرآن.",
                tr="Kur'an ayetlerinin anlamları hakkında kısa açıklamalar ve düşünceler."
            ),
            icon="Lightbulb"
        ),
        Activity(
            title=Translation(en="Youth & Student Engagement", ar="مشاركة الشباب والطلاب", tr="Gençlik ve Öğrenci Katılımı"),
            description=Translation(
                en="Special programs designed for young Muslims to strengthen their connection to Islam.",
                ar="برامج خاصة مصممة للمسلمين الشباب لتعزيز ارتباطهم بالإسلام.",
                tr="Genç Müslümanların İslam'a bağlılıklarını güçlendirmek için tasarlanmış özel programlar."
            ),
            icon="Users"
        ),
        Activity(
            title=Translation(en="Community Activities", ar="الأنشطة المجتمعية", tr="Topluluk Faaliyetleri"),
            description=Translation(
                en="Brotherhood gatherings, iftar programs, and community bonding events.",
                ar="تجمعات الإخوة وبرامج الإفطار وفعاليات الترابط المجتمعي.",
                tr="Kardeşlik toplantıları, iftar programları ve topluluk bağ kurma etkinlikleri."
            ),
            icon="Heart"
        )
    ])
    
    # Schedule
    schedule_days: List[ScheduleDay] = Field(default_factory=list)
    last_10_nights: List[Last10Night] = Field(default_factory=list)
    
    # Meta
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class ContentUpdate(BaseModel):
    model_config = ConfigDict(extra="allow")

# ==================== AUTH HELPERS ====================

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_token(email: str, name: str) -> str:
    payload = {
        "email": email,
        "name": name,
        "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_admin(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        email = payload.get("email")
        if not email:
            raise HTTPException(status_code=401, detail="Invalid token")
        admin = await db.admins.find_one({"email": email}, {"_id": 0})
        if not admin:
            raise HTTPException(status_code=401, detail="Admin not found")
        return admin
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ==================== INITIALIZATION ====================

async def init_default_content():
    # Check if content exists
    content = await db.site_content.find_one({}, {"_id": 0})
    if not content:
        default_content = SiteContent()
        await db.site_content.insert_one(default_content.model_dump())
        logging.info("Initialized default site content")
    
    # Check if admin exists
    admin = await db.admins.find_one({})
    if not admin:
        default_admin = {
            "id": str(uuid.uuid4()),
            "email": "admin@roadtojannah.com",
            "password": hash_password("admin123"),
            "name": "Admin",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.admins.insert_one(default_admin)
        logging.info("Created default admin: admin@roadtojannah.com / admin123")

@app.on_event("startup")
async def startup_event():
    await init_default_content()

# ==================== AUTH ENDPOINTS ====================

@api_router.post("/auth/login", response_model=TokenResponse)
async def login(credentials: AdminLogin):
    admin = await db.admins.find_one({"email": credentials.email}, {"_id": 0})
    if not admin or not verify_password(credentials.password, admin["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_token(admin["email"], admin["name"])
    return TokenResponse(token=token, email=admin["email"], name=admin["name"])

@api_router.get("/auth/verify")
async def verify_token(admin: dict = Depends(get_current_admin)):
    return {"valid": True, "email": admin["email"], "name": admin["name"]}

@api_router.post("/auth/change-password")
async def change_password(data: dict, admin: dict = Depends(get_current_admin)):
    current_password = data.get("current_password")
    new_password = data.get("new_password")
    
    if not verify_password(current_password, admin["password"]):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    
    hashed = hash_password(new_password)
    await db.admins.update_one(
        {"email": admin["email"]},
        {"$set": {"password": hashed}}
    )
    return {"message": "Password changed successfully"}

# ==================== PUBLIC ENDPOINTS ====================

@api_router.get("/content")
async def get_content():
    content = await db.site_content.find_one({}, {"_id": 0})
    if not content:
        default_content = SiteContent()
        await db.site_content.insert_one(default_content.model_dump())
        return default_content.model_dump()
    return content

@api_router.get("/announcements")
async def get_announcements():
    announcements = await db.announcements.find({"is_active": True}, {"_id": 0}).to_list(100)
    return announcements

@api_router.post("/volunteer")
async def submit_volunteer(data: VolunteerCreate):
    submission = VolunteerSubmission(**data.model_dump())
    doc = submission.model_dump()
    volunteer_id = submission.id
    await db.volunteers.insert_one(doc)
    return {"message": "Thank you for volunteering!", "id": volunteer_id}

# ==================== ADMIN ENDPOINTS ====================

@api_router.put("/admin/content")
async def update_content(updates: dict, admin: dict = Depends(get_current_admin)):
    updates["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    # Handle nested updates for translations
    set_updates = {}
    for key, value in updates.items():
        if isinstance(value, dict) and any(k in value for k in ['en', 'ar', 'tr']):
            for lang, text in value.items():
                set_updates[f"{key}.{lang}"] = text
        else:
            set_updates[key] = value
    
    await db.site_content.update_one({}, {"$set": set_updates}, upsert=True)
    content = await db.site_content.find_one({}, {"_id": 0})
    return content

@api_router.get("/admin/announcements")
async def get_all_announcements(admin: dict = Depends(get_current_admin)):
    announcements = await db.announcements.find({}, {"_id": 0}).to_list(100)
    return announcements

@api_router.post("/admin/announcements")
async def create_announcement(data: dict, admin: dict = Depends(get_current_admin)):
    announcement = Announcement(
        title=Translation(**data.get("title", {})),
        content=Translation(**data.get("content", {})),
        image_url=data.get("image_url", ""),
        is_active=data.get("is_active", True),
        is_banner=data.get("is_banner", False)
    )
    doc = announcement.model_dump()
    await db.announcements.insert_one(doc)
    # Return fresh copy without _id
    created = await db.announcements.find_one({"id": announcement.id}, {"_id": 0})
    return created

@api_router.put("/admin/announcements/{announcement_id}")
async def update_announcement(announcement_id: str, data: dict, admin: dict = Depends(get_current_admin)):
    data["updated_at"] = datetime.now(timezone.utc).isoformat()
    await db.announcements.update_one({"id": announcement_id}, {"$set": data})
    announcement = await db.announcements.find_one({"id": announcement_id}, {"_id": 0})
    return announcement

@api_router.delete("/admin/announcements/{announcement_id}")
async def delete_announcement(announcement_id: str, admin: dict = Depends(get_current_admin)):
    await db.announcements.delete_one({"id": announcement_id})
    return {"message": "Announcement deleted"}

@api_router.get("/admin/volunteers")
async def get_volunteers(admin: dict = Depends(get_current_admin)):
    volunteers = await db.volunteers.find({}, {"_id": 0}).to_list(1000)
    return volunteers

@api_router.delete("/admin/volunteers/{volunteer_id}")
async def delete_volunteer(volunteer_id: str, admin: dict = Depends(get_current_admin)):
    await db.volunteers.delete_one({"id": volunteer_id})
    return {"message": "Volunteer deleted"}

@api_router.post("/admin/upload")
async def upload_image(file: UploadFile = File(...), admin: dict = Depends(get_current_admin)):
    # Read file content and convert to base64
    content = await file.read()
    base64_content = base64.b64encode(content).decode('utf-8')
    content_type = file.content_type or 'image/jpeg'
    
    # Create a data URL
    data_url = f"data:{content_type};base64,{base64_content}"
    
    # Store in database
    image_doc = {
        "id": str(uuid.uuid4()),
        "filename": file.filename,
        "content_type": content_type,
        "data_url": data_url,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.images.insert_one(image_doc)
    
    return {"url": data_url, "id": image_doc["id"]}

# Health check
@api_router.get("/")
async def root():
    return {"message": "Road to Jannah API", "status": "running"}

# Include router
app.include_router(api_router)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
