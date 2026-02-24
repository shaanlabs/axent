# Files to Delete - Cleanup Plan

## Clerk-Related Files (Delete)
- ❌ `clerk_setup_guide.md` (artifact)
- ❌ `clerk_troubleshooting.md` (artifact)
- ✅ Already removed: `@clerk/clerk-react` package

## Old Component Structure (Will Move/Refactor)
These will be moved to module-specific folders:

### Move to Customer Module
- `src/app/components/agriculture-page.tsx` → `src/modules/customer/pages/AgriculturePage.tsx`

### Move to Organization Module
- (Will create new pages for organization)

### Move to Provider Module
- (Will create new pages for provider)

### Move to Shared
- `src/app/components/ui/button.tsx` → `src/shared/components/Button.tsx`
- `src/app/components/ui/input.tsx` → `src/shared/components/Input.tsx`
- `src/app/store/equipment-store.ts` → `src/shared/stores/equipment-store.ts`
- `src/app/utils/geo-utils.ts` → `src/shared/utils/geo-utils.ts`

### Delete (Old/Unused)
- ❌ `src/app/components/navigation.tsx` (will create module-specific navs)
- ❌ `src/app/components/dashboard-page.tsx` (will create role-specific dashboards)
- ❌ `src/app/components/marketplace-page.tsx` (will create module-specific)
- ❌ `src/app/components/home-page.tsx` (will recreate as public landing)
- ❌ `src/app/components/.fix-status.ts` (temp file)

## Keep & Update
- ✅ `src/app/auth/*` (authentication - already updated for Supabase)
- ✅ `src/app/App.tsx` (will update with new routing)
- ✅ `src/main.tsx` (already updated)
- ✅ `src/styles/*` (keep all styles)

## Next: Execution Order
1. Create module placeholder pages
2. Move shared components
3. Delete old files
4. Update App.tsx routing
5. Test build
