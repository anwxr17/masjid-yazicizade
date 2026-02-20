import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    nav: {
      home: 'Home',
      schedule: 'Schedule',
      location: 'Location',
      activities: 'Activities',
      join: 'Join Us',
      donate: 'Donate',
      admin: 'Admin'
    },
    home: {
      viewSchedule: 'View Schedule',
      getDirections: 'Get Directions',
      joinWhatsApp: 'Join WhatsApp Community',
      tonight: "Tonight's Prayer",
      isha: 'Isha Prayer',
      taraweeh: 'Taraweeh',
      tahajjud: 'Tahajjud/Qiyam',
      lastUpdated: 'Last Updated'
    },
    schedule: {
      title: 'Ramadan Schedule',
      subtitle: 'Prayer times and special programs',
      daily: 'Daily Prayers',
      special: 'Special Nights',
      last10: 'Last 10 Nights'
    },
    location: {
      title: 'Find Us',
      subtitle: 'Visit Yazicizade Mosque',
      openMaps: 'Open in Google Maps',
      parking: 'Parking Information',
      accessibility: 'Accessibility'
    },
    activities: {
      title: "Qur'an Circle & Activities",
      subtitle: 'Grow in faith and knowledge together'
    },
    join: {
      title: 'Join Our Community',
      subtitle: 'Be part of the roadtojannah family',
      community: 'WhatsApp Community',
      group: 'WhatsApp Group',
      volunteer: 'Volunteer With Us',
      name: 'Your Name',
      phone: 'Phone Number',
      skills: 'Skills & Interests',
      availability: 'Availability',
      submit: 'Submit',
      thankYou: 'Thank you for volunteering!'
    },
    donate: {
      title: 'Support roadtojannah',
      subtitle: 'Your contributions make a difference',
      copyIBAN: 'Copy IBAN',
      copied: 'Copied!',
      transparency: 'All donations are used for masjid activities and programs.'
    },
    founder: {
      title: 'About the Founder',
      contact: 'Contact'
    },
    footer: {
      quickLinks: 'Quick Links',
      connect: 'Connect',
      rights: 'All rights reserved'
    },
    admin: {
      login: 'Admin Login',
      email: 'Email',
      password: 'Password',
      signIn: 'Sign In',
      dashboard: 'Dashboard',
      content: 'Site Content',
      announcements: 'Announcements',
      volunteers: 'Volunteers',
      logout: 'Logout',
      save: 'Save Changes',
      saving: 'Saving...',
      saved: 'Changes saved!'
    }
  },
  ar: {
    nav: {
      home: 'الرئيسية',
      schedule: 'الجدول',
      location: 'الموقع',
      activities: 'الأنشطة',
      join: 'انضم إلينا',
      donate: 'تبرع',
      admin: 'المشرف'
    },
    home: {
      viewSchedule: 'عرض الجدول',
      getDirections: 'احصل على الاتجاهات',
      joinWhatsApp: 'انضم لمجتمع الواتساب',
      tonight: 'صلاة الليلة',
      isha: 'صلاة العشاء',
      taraweeh: 'التراويح',
      tahajjud: 'التهجد/القيام',
      lastUpdated: 'آخر تحديث'
    },
    schedule: {
      title: 'جدول رمضان',
      subtitle: 'أوقات الصلاة والبرامج الخاصة',
      daily: 'الصلوات اليومية',
      special: 'الليالي الخاصة',
      last10: 'العشر الأواخر'
    },
    location: {
      title: 'موقعنا',
      subtitle: 'زر مسجد يازيجي زاده',
      openMaps: 'افتح في خرائط جوجل',
      parking: 'معلومات موقف السيارات',
      accessibility: 'إمكانية الوصول'
    },
    activities: {
      title: 'حلقة القرآن والأنشطة',
      subtitle: 'ننمو معًا في الإيمان والمعرفة'
    },
    join: {
      title: 'انضم إلى مجتمعنا',
      subtitle: 'كن جزءًا من عائلة الطريق إلى الجنة',
      community: 'مجتمع الواتساب',
      group: 'مجموعة الواتساب',
      volunteer: 'تطوع معنا',
      name: 'اسمك',
      phone: 'رقم الهاتف',
      skills: 'المهارات والاهتمامات',
      availability: 'التوفر',
      submit: 'إرسال',
      thankYou: 'شكرًا لتطوعك!'
    },
    donate: {
      title: 'ادعم الطريق إلى الجنة',
      subtitle: 'مساهماتك تحدث فرقًا',
      copyIBAN: 'نسخ IBAN',
      copied: 'تم النسخ!',
      transparency: 'جميع التبرعات تُستخدم لأنشطة وبرامج المسجد.'
    },
    founder: {
      title: 'عن المؤسس',
      contact: 'تواصل'
    },
    footer: {
      quickLinks: 'روابط سريعة',
      connect: 'تواصل',
      rights: 'جميع الحقوق محفوظة'
    },
    admin: {
      login: 'تسجيل دخول المشرف',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      signIn: 'تسجيل الدخول',
      dashboard: 'لوحة التحكم',
      content: 'محتوى الموقع',
      announcements: 'الإعلانات',
      volunteers: 'المتطوعون',
      logout: 'تسجيل الخروج',
      save: 'حفظ التغييرات',
      saving: 'جارٍ الحفظ...',
      saved: 'تم حفظ التغييرات!'
    }
  },
  tr: {
    nav: {
      home: 'Ana Sayfa',
      schedule: 'Program',
      location: 'Konum',
      activities: 'Faaliyetler',
      join: 'Katıl',
      donate: 'Bağış',
      admin: 'Yönetici'
    },
    home: {
      viewSchedule: 'Programı Gör',
      getDirections: 'Yol Tarifi Al',
      joinWhatsApp: 'WhatsApp Topluluğuna Katıl',
      tonight: 'Bu Geceki Namaz',
      isha: 'Yatsı Namazı',
      taraweeh: 'Teravih',
      tahajjud: 'Teheccüd/Kıyam',
      lastUpdated: 'Son Güncelleme'
    },
    schedule: {
      title: 'Ramazan Programı',
      subtitle: 'Namaz vakitleri ve özel programlar',
      daily: 'Günlük Namazlar',
      special: 'Özel Geceler',
      last10: 'Son 10 Gece'
    },
    location: {
      title: 'Bizi Bulun',
      subtitle: 'Yazicizade Camii\'ni Ziyaret Edin',
      openMaps: 'Google Haritalar\'da Aç',
      parking: 'Park Bilgisi',
      accessibility: 'Erişilebilirlik'
    },
    activities: {
      title: "Kur'an Halkası ve Faaliyetler",
      subtitle: 'İman ve bilgide birlikte büyüyelim'
    },
    join: {
      title: 'Topluluğumuza Katılın',
      subtitle: 'roadtojannah ailesinin bir parçası olun',
      community: 'WhatsApp Topluluğu',
      group: 'WhatsApp Grubu',
      volunteer: 'Bizimle Gönüllü Olun',
      name: 'Adınız',
      phone: 'Telefon Numarası',
      skills: 'Beceriler ve İlgi Alanları',
      availability: 'Uygunluk',
      submit: 'Gönder',
      thankYou: 'Gönüllü olduğunuz için teşekkürler!'
    },
    donate: {
      title: "roadtojannah'ı Destekleyin",
      subtitle: 'Katkılarınız fark yaratıyor',
      copyIBAN: 'IBAN Kopyala',
      copied: 'Kopyalandı!',
      transparency: 'Tüm bağışlar cami faaliyetleri ve programları için kullanılır.'
    },
    founder: {
      title: 'Kurucu Hakkında',
      contact: 'İletişim'
    },
    footer: {
      quickLinks: 'Hızlı Bağlantılar',
      connect: 'Bağlan',
      rights: 'Tüm hakları saklıdır'
    },
    admin: {
      login: 'Yönetici Girişi',
      email: 'E-posta',
      password: 'Şifre',
      signIn: 'Giriş Yap',
      dashboard: 'Kontrol Paneli',
      content: 'Site İçeriği',
      announcements: 'Duyurular',
      volunteers: 'Gönüllüler',
      logout: 'Çıkış',
      save: 'Değişiklikleri Kaydet',
      saving: 'Kaydediliyor...',
      saved: 'Değişiklikler kaydedildi!'
    }
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('rtj-language');
    return saved || 'en';
  });

  useEffect(() => {
    localStorage.setItem('rtj-language', language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  const getText = (translationObj) => {
    if (!translationObj) return '';
    if (typeof translationObj === 'string') return translationObj;
    return translationObj[language] || translationObj.en || '';
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, getText }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
