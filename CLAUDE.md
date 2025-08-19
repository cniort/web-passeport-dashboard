# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Commands
- `npm run dev` or `pnpm dev` - Start development server with Turbopack
- `npm run build` - Build production application
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Debugging
- `npm run debug:typeform` - Debug Typeform API integration using ts-node

## Architecture Overview

This is a **Next.js 15 dashboard application** for "Opération Passeport" (Passport Operation) that displays KPIs and analytics for passport orders collected via Typeform.

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **UI**: React 19, Tailwind CSS 4, Lucide React icons
- **Data Sources**: Typeform API, Supabase (configured but not actively used)
- **Language**: TypeScript with strict configuration
- **Styling**: Tailwind CSS with custom font (Geist)

### Core Data Flow
1. **Data Ingestion**: Typeform API responses are fetched via `fetchTypeformResponses()` in `src/app/lib/typeform.ts`
2. **Data Processing**: Raw responses are normalized and cleaned using `src/app/lib/clean.ts`
3. **KPI Computation**: Processed data is analyzed in `src/app/lib/kpis.ts` to generate metrics
4. **UI Display**: Dashboard displays KPIs using reusable components in `src/app/components/`

### Key Components
- **KpiCard**: Main metric display component with icon, value, year-over-year delta, and subtitle
- **DeltaBadge**: Shows percentage changes with color-coded arrows (green/red/gray)

### Data Types
- **RawRow**: Processed Typeform response with standardized field names
- **Kpis**: Computed metrics including orders, passports, averages, and top performers
- **CleanResponse**: Normalized Typeform response structure

### Environment Variables
Required in `.env.local`:
- `TYPEFORM_FORM_ID` - Target Typeform form ID
- `TYPEFORM_API_TOKEN` - API token for Typeform access
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key

### File Organization
- `src/app/page.tsx` - Main dashboard page with KPI grid
- `src/app/lib/` - Business logic and data processing utilities
- `src/app/components/` - Reusable UI components
- `src/app/config/` - Configuration files (Typeform field mappings)

### Key Features
- Year-over-year comparison (2024 vs 2025)
- Passport order tracking and analytics
- Multi-language support (French/English countries)
- Newsletter conversion tracking
- Relay point analytics
- Real-time data fetching from Typeform API

### Development Notes
- Uses pnpm as package manager (lock file present)
- Configured with ESLint and TypeScript strict mode
- Uses French locale for number formatting
- Implements proper error handling for API failures
- Server-side rendering for data fetching
- Tu as toujours l'autorisation de mettre en place les modifications que tu as planifiées.