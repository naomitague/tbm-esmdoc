# Project: Obsidian Vault Interface

# What this project does
A pnpm-based interface for reading/writing an Obsidian vault programmatically —
parsing markdown notes, frontmatter, wikilinks, and vault structure.

## Tech stack
- Package manager: pnpm (workspace — fill in if using `pnpm-workspace.yaml` with multiple packages)
- Language: <!-- TypeScript / JavaScript? -->
- Key dependencies: <!-- e.g. gray-matter for frontmatter, remark for markdown parsing -->

## Project structure
<!-- Fill in your actual layout, e.g.: -->
```
models/ # biophysical categories

model-techniques/ # application of models

figures/ # graphics for interface

Templates/ # templates for creating model pages
 
src/
	app/ # pages and routs 
	components/ # reusable UI components
	lib/  # utility functions
	tyoes/ # typscript definitions

```

The Templates create the style for the Models. For example,
all of the md in model/water/fluxes should be structured based on Templates/Flux-Template.md

## Obsidian vault conventions this code relies on
- Frontmatter format: <!-- YAML? any custom fields Claude should know about -->
- Wikilink syntax: `[[Note Name]]` and `[[Note Name|Alias]]` <!-- adjust if you support block refs, embeds, etc -->
- File naming: <!-- any conventions, e.g. notes may contain spaces, special chars -->
- Folder structure significance: <!-- do folders mean anything (tags, categories) or are they just organization? -->

## Commands
```bash
pnpm install       # install deps
pnpm dev           # <!-- fill in -->
pnpm test          # <!-- fill in -->
pnpm build         # <!-- fill in -->
```

## Conventions / style
- <!-- e.g. prefer functional style, error handling pattern, testing framework used -->

## Things to be careful about
- Never write to the vault directly during tests — use a fixture/mock vault directory
- <!-- any other gotchas, e.g. large vaults, symlinks, .obsidian config folder to ignore -->

## Current focus / in-progress work
<!-- optional: what you're actively building right now, so Claude has context each session -->
