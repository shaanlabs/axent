# AXENT Project - Final Structure Map

## ✅ Organized Modular Architecture

```
axent/
├── src/
│   ├── app/
│   │   ├── App.tsx                    ✅ Main router with modular routes
│   │   ├── auth/                      ✅ Supabase authentication
│   │   │   ├── auth-context.tsx       
│   │   │   ├── protected-route.tsx    
│   │   │   ├── sign-in-page.tsx       
│   │   │   ├── sign-up-page.tsx       
│   │   │   └── role-selection-page.tsx
│   │   ├── components/                📁 Old components (to review/delete)
│   │   │   ├── agriculture-page.tsx   → Move to customer module
│   │   │   ├── ai-estimator-page.tsx  → Move to customer module
│   │   │   ├── product-detail-page.tsx → Move to shared
│   │   │   ├── project-bidding-page.tsx → Move to provider module
│   │   │   └── ui/                    → Keep (shared UI components)
│   │   └── data/                      ✅ Static data (equipment categories)
│   │
│   ├── modules/                       ✅ NEW MODULAR STRUCTURE
│   │   ├── customer/
│   │   │   ├── pages/
│   │   │   │   └── CustomerDashboard.tsx  ✅
│   │   │   └── components/
│   │   ├── organization/
│   │   │   ├── pages/
│   │   │   │   └── OrganizationDashboard.tsx  ✅
│   │   │   └── components/
│   │   ├── provider/
│   │   │   ├── pages/
│   │   │   │   └── ProviderDashboard.tsx  ✅
│   │   │   └── components/
│   │   └── admin/
│   │       ├── pages/
│   │       │   └── AdminDashboard.tsx  ✅
│   │       └── components/
│   │
│   ├── shared/                        ✅ Shared resources
│   │   ├── components/                📁 (empty - to populate)
│   │   ├── hooks/                     📁 (empty - to populate)
│   │   ├── stores/                    ✅
│   │   │   └── project-store.ts       
│   │   └── utils/                     ✅
│   │       ├── geo-utils.ts           
│   │       └── format-utils.ts        
│   │
│   ├── guards/                        ✅ Route protection
│   │   ├── RoleGuard.tsx              
│   │   └── permissions.ts             
│   │
│   ├── lib/                           ✅ External services
│   │   └── supabase.ts                
│   │
│   ├── styles/                        ✅ Styling
│   │   ├── index.css                  
│   │   ├── macos-design.css           ✅ NEW macOS design system
│   │   ├── theme.css                  
│   │   ├── tailwind.css               
│   │   └── fonts.css                  
│   │
│   └── main.tsx                       ✅ Entry point with AuthProvider
│
├── .env.local                         ✅ Supabase config
├── package.json                       ✅ Dependencies
└── vite.config.ts                     ✅ Build config
```

## 🗑️ Files Deleted (Old Architecture)
- ❌ `src/app/components/navigation.tsx` (old monolithic nav)
- ❌ `src/app/components/dashboard-page.tsx` (old shared dashboard)
- ❌ `src/app/components/marketplace-page.tsx` (old shared marketplace)
- ❌ `src/app/components/home-page.tsx` (old landing page)
- ❌ `src/app/store/` (moved to shared/stores/)
- ❌ `src/app/utils/` (moved to shared/utils/)
- ❌ Clerk setup docs

## 📋 Files to Organize Next
1. **Move to customer module:**
   - `agriculture-page.tsx`
   - `ai-estimator-page.tsx`
   
2. **Move to provider module:**
   - `project-bidding-page.tsx`

3. **Move to shared:**
   - `product-detail-page.tsx`
   - All UI components from `app/components/ui/`

4. **Find/create missing:**
   - `equipment-store.ts` (needs to be in shared/stores/)

## ✅ What's Working
- Modular architecture (customer/org/provider/admin)
- Role-based route guards
- Supabase auth context
- macOS design system
- Clean separation of concerns

## ⚠️ Todo Before Build
1. Find or recreate equipment-store.ts
2. Move remaining old components to appropriate modules
3. Update imports in moved files  
4. Test build
5. Setup Supabase database

## 🎨 Design System
- ✅ macOS-inspired (unique, not generic AI)
- ✅ Native toolbars
- ✅ Clean lists
- ✅ Flat cards
- ✅ Smooth transitions
- ✅ Dark theme with gold accents

## 🔐 Authentication Flow
1. Sign up → Supabase creates auth.users
2. Profile created in profiles table
3. Role selection → Updates role in profiles
4. Redirect to role-specific dashboard
5. RoleGuard protects routes

---

**Status:** Structure 80% complete. Need to finish file migration and create/fix equipment-store.
