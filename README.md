# Environmental Model Wiki

A modern, Wikipedia-style documentation site for environmental models, built with Next.js. This project provides an interactive, model-based organization for RHESSys (Regional Hydro-Ecologic Simulation System) documentation.

## Features

- **Model-Based Organization**: Content organized by major model components (Water, Carbon, Nitrogen, Energy)
- **Interactive Gallery Homepage**: Beautiful card-based interface with model statistics
- **Dynamic Page Generation**: Automatically creates pages for models, processes, parameters, and observations
- **Top Navigation Bar**: Easy access to Models, About, Profile, and Settings
- **Sidebar Navigation**: Context-aware navigation within each model
- **Connection Visualization**: See relationships between model components
- **Link Parsing**: Converts wiki-style `[[links]]` to Next.js routes
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Type-Safe**: Built with TypeScript for reliability

## Project Structure

```
tbm-RHESSys-Obs-main/
├── models/                   # Model-based content organization
│   ├── water/               # Water model
│   │   ├── index.md        # Water model overview
│   │   ├── processes/      # Water-related processes
│   │   ├── parameters/     # Water-related parameters
│   │   └── observations/   # Water-related observations
│   ├── carbon/             # Carbon model
│   ├── nitrogen/           # Nitrogen model
│   └── energy/             # Energy model
├── src/
│   ├── app/                # Next.js app directory
│   │   ├── models/         # Dynamic model routes
│   │   │   └── [model]/    # Model pages
│   │   │       └── [type]/[slug]/  # Content pages
│   │   ├── about/          # About page
│   │   ├── profile/        # User profile
│   │   ├── settings/       # Settings page
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx        # Homepage with gallery
│   │   └── globals.css     # Global styles
│   ├── components/         # React components
│   │   ├── Navbar.tsx      # Top navigation bar
│   │   ├── Sidebar.tsx     # Model navigation sidebar
│   │   ├── ConnectionGraph.tsx  # Connection visualization
│   │   ├── InfoBox.tsx     # Metadata infoboxes
│   │   └── MarkdownContent.tsx  # Markdown renderer
│   ├── lib/                # Utility functions
│   │   ├── models.ts       # Model content parsing
│   │   └── markdown.ts     # Markdown utilities (legacy)
│   └── types/              # TypeScript type definitions
│       └── index.ts
└── package.json
```

## Content Structure

Content is now organized by model components in the `models/` directory:

### Model Organization

```
models/
├── water/                   # Water Model
│   ├── index.md            # Water model overview
│   ├── processes/          # Transpiration, evaporation, etc.
│   ├── parameters/         # Rooting depth, field capacity, etc.
│   └── observations/       # Soil moisture, ET, etc.
├── carbon/                 # Carbon Model
│   ├── index.md            # Carbon model overview
│   ├── processes/          # Photosynthesis, respiration, etc.
│   ├── parameters/         # Growth rates, allocation, etc.
│   └── observations/       # GPP, NPP, LAI, etc.
├── nitrogen/               # Nitrogen Model
│   └── index.md            # Nitrogen cycling overview
└── energy/                 # Energy Model
    └── index.md            # Energy balance overview
```

### Markdown Features

The system automatically:
- Extracts metadata from markdown frontmatter and content
- Parses wiki-style links `[[variable_name]]`
- Converts links to working Next.js routes
- Builds connection graphs between related components
- Extracts variables, equations, and references
## Getting Started

### Prerequisites

- Node.js 18+ or 20+
- pnpm (recommended) or npm

### Installation

1. Install dependencies:

```bash
pnpm install
# or
npm install
```

2. Run the development server:

```bash
pnpm dev
# or
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
pnpm build
pnpm start
```

### URL Structure

```
/                                    # Homepage (model gallery)
/models/water                        # Water model overview
/models/water/processes/transpiration    # Transpiration process
/models/water/parameters/rooting_depth   # Rooting depth parameter
/models/water/observations/soil_moisture # Soil moisture observation
/about                               # About page
/profile                             # User profile
/settings                            # Settings page
```

## Customization

### Styling

Edit `src/app/globals.css`
- Color scheme (CSS variables)
- Typography
- Component styles

### Content Types

Add new content types in `src/types/index.ts` and update parsing logic in `src/lib/markdown.ts`.

### Components

Customize the UI by editing components in `src/components/`:
- `Sidebar.tsx` - Navigation structure
- `InfoBox.tsx` - Metadata display
- `MarkdownContent.tsx` - Content rendering

## Technical Details

### Markdown Processing

The system uses:
- `gray-matter` - Parses frontmatter metadata
- `remark` - Markdown processing
- `remark-html` - HTML conversion
- `remark-gfm` - GitHub Flavored Markdown support

### Link Conversion

Wiki-style links `[[target]]` are automatically converted to Next.js routes:
- `[[process_transpiration]]` → `/wiki/process_transpiration`
- Preserves the original text as link label
- Handles spaces and special characters

### Static Generation

Pages are statically generated at build time using:
- `generateStaticParams()` - Pre-generates all wiki page routes
- File system scanning - Discovers all markdown files
- Metadata extraction - Builds the navigation structure

## Adding New Content

To add content to an existing model:

1. Navigate to the appropriate model directory: `models/[model]/`
2. Choose the content type folder: `processes/`, `parameters/`, or `observations/`
3. Create a new markdown file
4. Add frontmatter and content following the examples
5. Use wiki-style `[[links]]` to reference other content
6. The page will automatically appear in the navigation
### Adding a New Model

To add an entirely new model (e.g., "soil"):

1. Create a new directory: `models/soil/`
2. Create subdirectories: `processes/`, `parameters/`, `observations/`
3. Create an overview file: `models/soil/index.md` with:
   ```markdown
   ---
   title: Soil Model
   model: soil
   description: Soil physical and chemical processes
   ---
   ```
4. Add icon and color mapping in `src/lib/models.ts`
5. Add content files to the subdirectories
6. The model will automatically appear on the homepage
