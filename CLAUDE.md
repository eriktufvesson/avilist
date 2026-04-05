# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development (starts Tauri + Vite dev server)
pnpm tauri dev

# Build for production
pnpm tauri build

# Frontend only (Vite dev server, no Tauri shell)
pnpm dev

# Regenerate birds.json from data/NL20.xlsx
pnpm convert
```

## Architecture

Avilist is a desktop bird species search app built with **Tauri v2** (Rust backend) + **React 19** (TypeScript frontend).

### Data pipeline

`data/NL20.xlsx` → `scripts/convert-excel.mjs` → `src/birds.json`

The Excel file is the official Swedish bird name list (NL v2025). The conversion script parses its hierarchy (order → family → species) and produces a flat JSON array imported directly at build time. Run `pnpm convert` after updating the Excel source.

### Frontend

All application logic lives in `src/App.tsx`. The app imports `birds.json` as a static module and uses **Fuse.js** for weighted fuzzy search (Swedish 0.4, English 0.35, scientific 0.25, threshold 0.35). Results are capped at 50.

The Rust backend (`src-tauri/src/lib.rs`) is minimal boilerplate — no custom Tauri commands are used; the app is entirely frontend-driven.

### Window

Default size: 760×700, minimum: 480×500 (configured in `src-tauri/tauri.conf.json`).
