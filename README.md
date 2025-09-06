# Helpdesk Lite

## Technical Implementation Note

This demo uses JSONPlaceholder API which doesn't persist data or provide consistent backend behavior. Therefore, I implemented a focused client-side solution.

In a real production app with a proper backend, I would implement full CRUD persistence, real-time updates, proper error handling, and comprehensive state synchronization. This demo showcases core frontend patterns and user experience principles.

## Technology Choice Rationale

**Note**: I could have achieved faster TTL (currently ~2s) by avoiding libraries like Zod, React Query, or React Hook Form and using vanilla React state management. However, I chose to demonstrate knowledge of modern development tools and best practices:

- **Zod** - Type-safe schema validation
- **React Query** - Sophisticated caching and data synchronization
- **React Hook Form** - Performant form handling
- **Shadcn/ui** - Modern component library

This was a rapid implementation due to time constraints from my current job, but I'm happy to discuss how I would approach this differently in a real-world scenario with proper way,

## Quick Start

1. Install dependencies:

```bash
pnpm install
```

2. Run development server:

```bash
pnpm dev
```

3. Build for production:

```bash
pnpm build
```

4. Preview built version:

```bash
pnpm start

or

pnpm preview
```

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Preview built version (run after build)
- `pnpm preview` - Preview built version (same as start)
- `pnpm lint` - Run ESLint

## Environment

- `.env` file contains non-sensitive config (not ignored by git)
- Uses JSONPlaceholder API for demo data
