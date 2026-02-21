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
      joinWhatsApp: 'Join WhatsApp Group',
      tonight: "Tonight's Prayer",
      isha: 'Isha Prayer',
      taraweeh: 'Taraweeh',
      tahajjud: 'Tahajjud/Qiyam',
      lastUpdated: 'Last Updated',
      explore: 'Explore',
      stayConnected: 'Stay connected with the community',
      join: 'Join',
      latestUpdates: 'Latest Updates'
    },
    schedule: {
      title: 'Ramadan Schedule',
      subtitle: 'Prayer times and special programs',
      daily: 'Daily Prayers',
      special: 'Special Nights',
      last10: 'Last 10 Nights',
      dailyLabel: 'Daily',
      throughoutRamadan: 'Throughout Ramadan',
      lastTenDays: "In The Last 10 Days insha'Allah",
      specialPrograms: 'Special Programs Coming Soon',
      specialProgramsDesc: 'The Last 10 Nights schedule will be announced as Ramadan progresses. Join our WhatsApp group for updates.',
      importantInfo: 'Important Information',
      info1: 'Taraweeh is performed in congregation immediately after Isha prayer',
      info2: 'Tahajjud/Qiyam programs are held on selected nights',
      info3: 'Please arrive 10-15 minutes early for prayer',
      info4: 'Bring your own prayer mat if possible'
    },
    location: {
      title: 'Find Us',
      subtitle: 'Visit Yazicizade Mosque',
      openMaps: 'Open in Google Maps',
      parking: 'Parking Information',
      accessibility: 'Accessibility',
      city: 'Girne, Northern Cyprus'
    },
    activities: {
      title: "Qur'an Circle & Activities",
      subtitle: 'Grow in faith and knowledge together',
      joinLearning: 'Join Our Learning Community',
      joinLearningDesc: "Whether you're a beginner or advanced learner, our programs cater to all levels. Join us at Yazicizade Mosque and embark on your journey of Islamic knowledge.",
      joinWhatsApp: 'Join WhatsApp Group'
    },
    join: {
      title: 'Join Our Community',
      subtitle: 'Be part of the roadtojannah family',
      group: 'WhatsApp Group',
      groupDesc: 'Join our WhatsApp group for updates, discussions, and coordination',
      joinGroup: 'Join WhatsApp Group',
      volunteer: 'Volunteer With Us',
      name: 'Your Name',
      namePlaceholder: 'Enter your full name',
      phone: 'Phone Number',
      phonePlaceholder: '+90 XXX XXX XXXX',
      skills: 'Skills & Interests',
      skillsPlaceholder: 'e.g., Teaching Quran, Event organizing, Social media...',
      availability: 'Availability',
      availabilityPlaceholder: 'e.g., Weekends, After Maghrib...',
      submit: 'Submit',
      submitting: 'Submitting...',
      thankYou: 'Thank you for volunteering!',
      weWillContact: "We'll be in touch with you soon.",
      submitAnother: 'Submit Another',
      submitError: 'Failed to submit. Please try again.'
    },
    donate: {
      title: 'Support roadtojannah',
      subtitle: 'Your contributions make a difference',
      bankDetails: 'Bank Transfer Details',
      bankName: 'Bank Name',
      accountName: 'Account Name',
      iban: 'IBAN',
      copyIBAN: 'Copy IBAN',
      copied: 'Copied!',
      scanQR: 'Scan to copy IBAN',
      transparency: 'All donations are used for masjid activities and programs.'
    },
    founder: {
      title: 'About the Founder',
      contact: 'Contact'
    },
    gallery: {
      title: 'Our Masjid'
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
      saved: 'Changes saved!',
      defaultCredentials: 'Default: admin@roadtojannah.com / admin123'
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
      joinWhatsApp: 'انضم لمجموعة الواتساب',
      tonight: 'صلاة الليلة',
      isha: 'صلاة العشاء',
      taraweeh: 'التراويح',
      tahajjud: 'التهجد/القيام',
      lastUpdated: 'آخر تحديث',
      explore: 'استكشف',
      stayConnected: 'ابق على تواصل مع المجتمع',
      join: 'انضم',
      latestUpdates: 'آخر التحديثات'
    },
    schedule: {
      title: 'جدول رمضان',
      subtitle: 'أوقات الصلاة والبرامج الخاصة',
      daily: 'الصلوات اليومية',
      special: 'الليالي الخاصة',
      last10: 'العشر الأواخر',
      dailyLabel: 'يوميًا',
      throughoutRamadan: 'طوال شهر رمضان',
      lastTenDays: 'في العشر الأواخر إن شاء الله',
      specialPrograms: 'البرامج الخاصة قريبًا',
      specialProgramsDesc: 'سيتم الإعلان عن جدول العشر الأواخر مع تقدم شهر رمضان. انضم لمجموعة الواتساب للتحديثات.',
      importantInfo: 'معلومات مهمة',
      info1: 'تُصلى التراويح جماعة مباشرة بعد صلاة العشاء',
      info2: 'تُعقد برامج التهجد/القيام في ليالٍ مختارة',
      info3: 'يرجى الحضور قبل 10-15 دقيقة من الصلاة',
      info4: 'أحضر سجادة الصلاة الخاصة بك إن أمكن'
    },
    location: {
      title: 'موقعنا',
      subtitle: 'زر مسجد يازيجي زاده',
      openMaps: 'افتح في خرائط جوجل',
      parking: 'معلومات موقف السيارات',
      accessibility: 'إمكانية الوصول',
      city: 'كيرينيا، شمال قبرص'
    },
    activities: {
      title: 'حلقة القرآن والأنشطة',
      subtitle: 'ننمو معًا في الإيمان والمعرفة',
      joinLearning: 'انضم لمجتمع التعلم',
      joinLearningDesc: 'سواء كنت مبتدئًا أو متقدمًا، برامجنا تناسب جميع المستويات. انضم إلينا في مسجد يازيجي زاده وابدأ رحلتك في المعرفة الإسلامية.',
      joinWhatsApp: 'انضم لمجموعة الواتساب'
    },
    join: {
      title: 'انضم إلى مجموعتنا',
      subtitle: 'كن جزءًا من عائلة الطريق إلى الجنة',
      group: 'مجموعة الواتساب',
      groupDesc: 'انضم لمجموعة الواتساب للتحديثات والنقاشات والتنسيق',
      joinGroup: 'انضم لمجموعة الواتساب',
      volunteer: 'تطوع معنا',
      name: 'اسمك',
      namePlaceholder: 'أدخل اسمك الكامل',
      phone: 'رقم الهاتف',
      phonePlaceholder: '+90 XXX XXX XXXX',
      skills: 'المهارات والاهتمامات',
      skillsPlaceholder: 'مثال: تعليم القرآن، تنظيم الفعاليات، وسائل التواصل...',
      availability: 'التوفر',
      availabilityPlaceholder: 'مثال: عطلة نهاية الأسبوع، بعد المغرب...',
      submit: 'إرسال',
      thankYou: 'شكرًا لتطوعك!',
      weWillContact: 'سنتواصل معك قريبًا.',
      submitAnother: 'إرسال آخر'
    },
    donate: {
      title: 'ادعم الطريق إلى الجنة',
      subtitle: 'مساهماتك تحدث فرقًا',
      bankDetails: 'تفاصيل التحويل البنكي',
      bankName: 'اسم البنك',
      accountName: 'اسم الحساب',
      copyIBAN: 'نسخ IBAN',
      copied: 'تم النسخ!',
      scanQR: 'امسح لنسخ IBAN',
      transparency: 'جميع التبرعات تُستخدم لأنشطة وبرامج المسجد.'
    },
    founder: {
      title: 'عن المؤسس',
      contact: 'تواصل'
    },
    gallery: {
      title: 'مسجدنا'
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
      saved: 'تم حفظ التغييرات!',
      defaultCredentials: 'افتراضي: admin@roadtojannah.com / admin123'
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
      joinWhatsApp: 'WhatsApp Grubuna Katıl',
      tonight: 'Bu Geceki Namaz',
      isha: 'Yatsı Namazı',
      taraweeh: 'Teravih',
      tahajjud: 'Teheccüd/Kıyam',
      lastUpdated: 'Son Güncelleme',
      explore: 'Keşfet',
      stayConnected: 'Toplulukla bağlantıda kalın',
      join: 'Katıl',
      latestUpdates: 'Son Güncellemeler'
    },
    schedule: {
      title: 'Ramazan Programı',
      subtitle: 'Namaz vakitleri ve özel programlar',
      daily: 'Günlük Namazlar',
      special: 'Özel Geceler',
      last10: 'Son 10 Gece',
      dailyLabel: 'Günlük',
      throughoutRamadan: 'Ramazan boyunca',
      lastTenDays: "Son 10 Gün'de inşallah",
      specialPrograms: 'Özel Programlar Yakında',
      specialProgramsDesc: 'Son 10 Gece programı Ramazan ilerledikçe duyurulacaktır. Güncellemeler için WhatsApp grubumuza katılın.',
      importantInfo: 'Önemli Bilgiler',
      info1: 'Teravih namazı Yatsı namazından hemen sonra cemaatle kılınır',
      info2: 'Teheccüd/Kıyam programları seçili gecelerde yapılır',
      info3: 'Lütfen namaza 10-15 dakika erken gelin',
      info4: 'Mümkünse kendi seccadenizi getirin'
    },
    location: {
      title: 'Bizi Bulun',
      subtitle: "Yazicizade Camii'ni Ziyaret Edin",
      openMaps: "Google Haritalar'da Aç",
      parking: 'Park Bilgisi',
      accessibility: 'Erişilebilirlik',
      city: 'Girne, Kuzey Kıbrıs'
    },
    activities: {
      title: "Kur'an Halkası ve Faaliyetler",
      subtitle: 'İman ve bilgide birlikte büyüyelim',
      joinLearning: 'Öğrenme Topluluğumuza Katılın',
      joinLearningDesc: "İster yeni başlayan ister ileri düzey olun, programlarımız tüm seviyelere uygundur. Yazicizade Camii'nde bize katılın ve İslami bilgi yolculuğunuza başlayın.",
      joinWhatsApp: 'WhatsApp Grubuna Katıl'
    },
    join: {
      title: 'Grubumuza Katılın',
      subtitle: 'roadtojannah ailesinin bir parçası olun',
      group: 'WhatsApp Grubu',
      groupDesc: 'Güncellemeler, tartışmalar ve koordinasyon için WhatsApp grubumuza katılın',
      joinGroup: 'WhatsApp Grubuna Katıl',
      volunteer: 'Bizimle Gönüllü Olun',
      name: 'Adınız',
      namePlaceholder: 'Tam adınızı girin',
      phone: 'Telefon Numarası',
      phonePlaceholder: '+90 XXX XXX XXXX',
      skills: 'Beceriler ve İlgi Alanları',
      skillsPlaceholder: "Örn: Kur'an öğretimi, Etkinlik organizasyonu, Sosyal medya...",
      availability: 'Uygunluk',
      availabilityPlaceholder: 'Örn: Hafta sonları, Akşam namazından sonra...',
      submit: 'Gönder',
      thankYou: 'Gönüllü olduğunuz için teşekkürler!',
      weWillContact: 'Sizinle yakında iletişime geçeceğiz.',
      submitAnother: 'Başka Gönder'
    },
    donate: {
      title: "roadtojannah'ı Destekleyin",
      subtitle: 'Katkılarınız fark yaratıyor',
      bankDetails: 'Banka Transfer Bilgileri',
      bankName: 'Banka Adı',
      accountName: 'Hesap Adı',
      copyIBAN: 'IBAN Kopyala',
      copied: 'Kopyalandı!',
      scanQR: "IBAN'ı kopyalamak için tarayın",
      transparency: 'Tüm bağışlar cami faaliyetleri ve programları için kullanılır.'
    },
    founder: {
      title: 'Kurucu Hakkında',
      contact: 'İletişim'
    },
    gallery: {
      title: 'Camimiz'
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
      saved: 'Değişiklikler kaydedildi!',
      defaultCredentials: 'Varsayılan: admin@roadtojannah.com / admin123'
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
