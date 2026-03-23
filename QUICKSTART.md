# Quick Start Guide

## Installation & Setup

### 1. Install Dependencies
```bash
pnpm install
# or
npm install
```

### 2. Run Development Server
Navigate to the folder in terminal then run:
```
pnpm dev
# or
npm run dev
```

### 3. Open Browser
Navigate to [http://localhost:3000](http://localhost:3000)
## Project Structure at a Glance

```
models/
├── water/         → Water model (💧 blue)
├── carbon/        → Carbon model (🌱 green)
├── nitrogen/      → Nitrogen model (🔬 purple)
└── energy/        → Energy model (☀️ orange)

src/
├── app/           → Pages and routes
├── components/    → Reusable UI components
├── lib/           → Utility functions
└── types/         → TypeScript definitions
```

## Common Tasks

### Add a New Process
1. Navigate to `models/[model]/fluxes/`
2. Create new markdown document in format of template

### Add a New Parameter
1. Navigate to `models/[model]/parameters/`
2. Create `new_parameter.md`
3. Add content
4. Done!

### Edit Model Overview
1. Edit `models/[model]/index.md`
2. Changes appear on the model page

## Building for Production

```bash
pnpm build
pnpm start
```
## Next Steps

1. Explore the existing water model content
2. Fix formatting in link names and equations
3. Add connection graph showing links between parameters
4. Add images to each model
5. Add more fluxes, parameters, and observations
6. Customize colors and icons in `src/lib/models.ts`
7. Add features to settings and profile (not currently working)
8. Deploy to Vercel, Netlify, or your preferred host