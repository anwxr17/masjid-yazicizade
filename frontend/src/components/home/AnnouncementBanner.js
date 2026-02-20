import React, { useState } from 'react';
import { X, Bell } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '../ui/button';

const AnnouncementBanner = ({ announcements = [] }) => {
  const [dismissed, setDismissed] = useState(false);
  const { getText } = useLanguage();

  const bannerAnnouncements = announcements.filter(a => a.is_banner && a.is_active);
  
  if (dismissed || bannerAnnouncements.length === 0) return null;

  const announcement = bannerAnnouncements[0];

  return (
    <div 
      className="bg-accent text-accent-foreground relative overflow-hidden"
      data-testid="announcement-banner"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Bell className="h-5 w-5 flex-shrink-0" />
          <p className="font-medium text-sm md:text-base truncate">
            {getText(announcement.title)}
            {announcement.content && (
              <span className="hidden md:inline text-accent-foreground/80 ml-2">
                — {getText(announcement.content)}
              </span>
            )}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setDismissed(true)}
          className="h-8 w-8 text-accent-foreground/80 hover:text-accent-foreground hover:bg-accent-foreground/10 flex-shrink-0"
          aria-label="Dismiss announcement"
          data-testid="dismiss-banner-btn"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default AnnouncementBanner;
