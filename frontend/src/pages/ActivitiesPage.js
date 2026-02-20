import React from 'react';
import { BookOpen, Brain, Lightbulb, Users, Heart } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent } from '../components/ui/card';

const iconMap = {
  BookOpen,
  Brain,
  Lightbulb,
  Users,
  Heart
};

const ActivitiesPage = ({ content }) => {
  const { t, getText } = useLanguage();

  const defaultActivities = [
    {
      id: '1',
      title: { en: 'Tajweed Correction', ar: 'تصحيح التجويد', tr: 'Tecvid Düzeltme' },
      description: { 
        en: 'Learn proper Qur\'an recitation with expert guidance on pronunciation and rules.',
        ar: 'تعلم تلاوة القرآن الصحيحة مع إرشادات خبيرة حول النطق والقواعد.',
        tr: 'Telaffuz ve kurallar hakkında uzman rehberliğiyle doğru Kur\'an tilavetini öğrenin.'
      },
      icon: 'BookOpen'
    },
    {
      id: '2',
      title: { en: 'Memorization & Revision', ar: 'الحفظ والمراجعة', tr: 'Ezberleme ve Tekrar' },
      description: {
        en: 'Structured sessions for memorizing new verses and revising previously learned portions.',
        ar: 'جلسات منظمة لحفظ آيات جديدة ومراجعة الأجزاء المحفوظة سابقًا.',
        tr: 'Yeni ayetleri ezberleme ve daha önce öğrenilen bölümleri tekrarlama için yapılandırılmış oturumlar.'
      },
      icon: 'Brain'
    },
    {
      id: '3',
      title: { en: 'Tafsir Reminders', ar: 'تذكيرات التفسير', tr: 'Tefsir Hatırlatmaları' },
      description: {
        en: 'Brief explanations and reflections on the meanings of Qur\'anic verses.',
        ar: 'شروحات موجزة وتأملات في معاني آيات القرآن.',
        tr: 'Kur\'an ayetlerinin anlamları hakkında kısa açıklamalar ve düşünceler.'
      },
      icon: 'Lightbulb'
    },
    {
      id: '4',
      title: { en: 'Youth & Student Engagement', ar: 'مشاركة الشباب والطلاب', tr: 'Gençlik ve Öğrenci Katılımı' },
      description: {
        en: 'Special programs designed for young Muslims to strengthen their connection to Islam.',
        ar: 'برامج خاصة مصممة للمسلمين الشباب لتعزيز ارتباطهم بالإسلام.',
        tr: 'Genç Müslümanların İslam\'a bağlılıklarını güçlendirmek için tasarlanmış özel programlar.'
      },
      icon: 'Users'
    },
    {
      id: '5',
      title: { en: 'Community Activities', ar: 'الأنشطة المجتمعية', tr: 'Topluluk Faaliyetleri' },
      description: {
        en: 'Brotherhood gatherings, iftar programs, and community bonding events.',
        ar: 'تجمعات الإخوة وبرامج الإفطار وفعاليات الترابط المجتمعي.',
        tr: 'Kardeşlik toplantıları, iftar programları ve topluluk bağ kurma etkinlikleri.'
      },
      icon: 'Heart'
    }
  ];

  const activities = content?.activities && content.activities.length > 0 
    ? content.activities 
    : defaultActivities;

  return (
    <div className="min-h-screen" data-testid="activities-page">
      {/* Hero */}
      <section className="bg-primary py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 islamic-pattern opacity-20" />
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="text-center space-y-4">
            <BookOpen className="h-12 w-12 text-accent mx-auto" />
            <h1 className="font-heading text-4xl md:text-5xl text-primary-foreground font-bold">
              {t('activities.title')}
            </h1>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
              {t('activities.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Activities Grid */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((activity, index) => {
              const IconComponent = iconMap[activity.icon] || BookOpen;
              return (
                <Card 
                  key={activity.id || index} 
                  className="hover-lift"
                  data-testid={`activity-${index}`}
                >
                  <CardContent className="pt-8 pb-6 px-6">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                      <IconComponent className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="font-heading text-xl font-semibold text-foreground mb-3">
                      {getText(activity.title)}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {getText(activity.description)}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-3xl mx-auto px-4 md:px-8 text-center">
          <Card className="border-accent/30 bg-card">
            <CardContent className="py-12 px-8">
              <h2 className="font-heading text-2xl md:text-3xl font-semibold text-foreground mb-4">
                Join Our Learning Community
              </h2>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Whether you're a beginner or advanced learner, our programs cater to all levels. 
                Join us at Yazicizade Mosque and embark on your journey of Islamic knowledge.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href={content?.whatsapp_community_link || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                  data-testid="activities-whatsapp-btn"
                >
                  <Users className="h-5 w-5" />
                  Join WhatsApp Community
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default ActivitiesPage;
