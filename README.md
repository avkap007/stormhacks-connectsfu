# ConnectSFU 🎉

A cute portal for SFU students to discover events, RSVP, and find buddies!

## 🎨 Design Reference
**[Figma Design System](https://www.figma.com/board/hfFDwt7qYfifoUAj9weiaC/components---layout?node-id=7-92&t=tvEXBj1mIJOZmXXs-0)**

## 🚀 Quick Setup

```bash
# 1. Clone and install
git clone <repository-url>
cd stormhacks-connectsfu
npm install

# 2. Start development
npm run dev
# Open http://localhost:3000
```

## 👥 Team Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Work and test
npm run dev

# Commit and push
git add .
git commit -m "Add: your feature description"
git push origin feature/your-feature-name
```

## 📋 Commit Messages
- `Add:` new features
- `Fix:` bug fixes  
- `Update:` improvements
- `Style:` UI changes

## 🛠 Tech Stack
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS + DaisyUI
- **Animations**: Framer Motion
- **Database**: Supabase (PostgreSQL + real-time)
- **Auth**: Supabase Auth (SFU email restriction)
- **Deployment**: Vercel

## ✅ Current Status
- ✅ Glass navbar with ConnectSFU branding
- ✅ Beautiful event card with hover effects
- ✅ Custom color palette (Chinese Blue, Ceil, Pearly Purple, etc.)
- ✅ Responsive design

## 🎯 Next Steps
1. **Event Discovery Page** - Multiple events with filters
2. **Supabase Setup** - Database and auth
3. **RSVP System** - Real functionality
4. **Buddy Matching** - Find event buddies
5. **Admin Dashboard** - Club event management
