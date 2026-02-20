# Road to Jannah - Product Requirements Document

## Original Problem Statement
Build a modern, secure, mobile-first website for an Islamic Ramadan initiative called "roadtojannah". This is a community-based initiative organizing Taraweeh, Tahajjud, and Qur'an circle programs at Yazicizade Mosque in Girne, Northern Cyprus.

## Architecture
- **Frontend**: React 19 with Tailwind CSS, Shadcn UI components
- **Backend**: FastAPI (Python)
- **Database**: MongoDB
- **Authentication**: JWT-based admin auth

## User Personas
1. **Community Members**: Muslims in Girne/Northern Cyprus seeking Ramadan prayer programs
2. **Visitors**: People looking for Taraweeh/Tahajjud prayer locations
3. **Potential Volunteers**: People wanting to help with the initiative
4. **Donors**: Those wanting to support the mosque activities
5. **Admin**: Initiative organizers managing content

## Core Requirements
- Share Ramadan prayer schedule (Isha, Taraweeh, Tahajjud)
- Provide masjid location with Google Maps integration
- Allow people to join WhatsApp community & group
- Display donation (IBAN) details with copy functionality
- Post announcements and updates
- Admin panel for editing all content without coding
- Multi-language support (English, Arabic, Turkish)
- Dark mode toggle
- Mobile-first responsive design

## What's Been Implemented (Feb 20, 2026)

### Pages
- ✅ Homepage with hero section, prayer widget, founder section
- ✅ Schedule page with prayer times
- ✅ Location page with embedded Google Maps
- ✅ Activities page with Qur'an circle programs
- ✅ Join page with WhatsApp links and volunteer form
- ✅ Donations page with IBAN and copy button
- ✅ Admin login page
- ✅ Admin dashboard with full CMS

### Features
- ✅ Multi-language support (EN/AR/TR) with switcher
- ✅ RTL layout for Arabic
- ✅ Dark mode toggle
- ✅ JWT-based admin authentication
- ✅ Editable content via admin panel:
  - Hero section (title, subtitle, image)
  - Prayer times (Isha, Taraweeh, Tahajjud)
  - Masjid info (name, address, maps link)
  - WhatsApp links
  - Donation details (bank, account, IBAN)
  - Founder info (name, bio, contact, image)
- ✅ Announcements system with banner support
- ✅ Volunteer form submission
- ✅ Image upload for admin
- ✅ SEO-friendly pages

### Default Admin Credentials
- Email: admin@roadtojannah.com
- Password: admin123

## Prioritized Backlog

### P0 (Critical)
- All core features implemented ✅

### P1 (High Priority)
- [ ] Better Google Maps embed URL for Yazicizade Mosque
- [ ] Last 10 Nights schedule management
- [ ] Email notifications for new volunteers

### P2 (Nice to Have)
- [ ] Push notifications
- [ ] Prayer time countdown
- [ ] Social media sharing
- [ ] Analytics integration

## Next Tasks
1. Update Google Maps embed with exact Yazicizade Mosque coordinates
2. Add Last 10 Nights schedule editor in admin
3. Add volunteer export functionality
4. Consider adding email notifications
