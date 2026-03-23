# Migration Guide: New Model-Based Structure

## Overview

The project has been reorganized from a flat structure to a hierarchical, model-based organization. This page explains the changes and how to work with the new structure.

## What Changed

### Old Structure
```
├── Processes/
│   ├── flux_transpiration.md
│   ├── flux_soil_evaporation.md
│   └── ...
├── ParameterorState/
│   ├── rooting_depth.md
│   ├── field_capacity.md
│   └── ...
├── ObsOutput/
│   ├── output_transpiration.md
│   ├── output_soil_moisture.md
│   └── ...
└── Overviews/
    └── Water.md
```

### New Structure
```
models/
├── water/
│   ├── index.md                 # Model overview
│   ├── fluxes/               # Water fluxes
│   │   ├── transpiration.md
│   │   └── soil_evaporation.md
│   ├── parameters/              # Water parameters
│   │   ├── rooting_depth.md
│   │   └── field_capacity.md
│   └── observations/            # Water observations
│       ├── transpiration.md
│       └── soil_moisture.md
├── carbon/
│   └── index.md
├── nitrogen/
│   └── index.md
└── energy/
    └── index.md
```
## Benefits of New Structure

1. **Logical Organization**: Content grouped by which model component it belongs to
2. **Better Navigation**: Clear hierarchy from model → type → content
3. **Scalability**: Easy to add new models or expand existing ones
4. **Context**: Users always know which model they're exploring
5. **Cleaner URLs**: `/models/water/fluxes/transpiration` vs `/wiki/flux_transpiration`

## URL Changes

| Old URL                       | New URL                                    |
| ----------------------------- | ------------------------------------------ |
| `/wiki/flux_transpiration` | `/models/water/fluxes/transpiration`    |
| `/wiki/rooting_depth`         | `/models/water/parameters/rooting_depth`   |
| `/wiki/output_transpiration`  | `/models/water/observations/transpiration` |
| `/` (basic list)              | `/` (model gallery)                        |

## How to Add Content

### Add Content to Existing Model

```
# Example: Add a new flux to the water model
cd models/water/fluxes
touch new_flux.md
```

Add frontmatter and content:
```
---
title: New Process Name
tags: [flux]
---

# Description
Your flux description here...

# References
Citations...
```

### Add a New Model

1. Create directory structure:
```
mkdir -p models/newmodel/{fluxes,parameters,observations}
```

2. Create overview file `models/newmodel/index.md`:
```
---
title: New Model
model: newmodel
description: Description of the new model
---

# New Model Overview
Content here...
```

3. Update icon/color mappings in `src/lib/models.ts`:
```typescript
const modelIcons: Record<string, string> = {
  water: '💧',
  carbon: '🌱',
  nitrogen: '🔬',
  energy: '☀️',
  newmodel: '🎯',  // Add your icon
};

const modelColors: Record<string, string> = {
  water: 'blue',
  carbon: 'green',
  nitrogen: 'purple',
  energy: 'orange',
  newmodel: 'red',  // Add your color
};
```

4. Add color classes to homepage if needed (`src/app/page.tsx`):
```typescript
const colorClasses: Record<string, string> = {
  blue: 'from-blue-500 to-blue-600...',
  green: 'from-green-500 to-green-600...',
  // ... existing colors
  red: 'from-red-500 to-red-600 hover:from-red-600 hover:to-red-700',
};
```

## Migrating Existing Content

The water model has been populated with examples. To migrate more content:

1. Identify which model the content belongs to (water, carbon, nitrogen, energy)
2. Determine the type (flux, parameter, or observation)
3. Copy the file to the appropriate location:
   ```
   cp ParameterorState/some_param.md models/[model]/parameters/some_param.md
   ```
4. Update any internal wiki links if needed