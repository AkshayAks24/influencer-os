---
trigger: always_on
---

Stack: React + TypeScript, Tailwind CSS, shadcn/ui, React Router v6+, 
Framer Motion, react-icons, Recharts. Mock data only, no backend/API calls.

Always:
- Build reusable components in src/components/, never duplicate UI across pages
- Fully responsive (mobile/tablet/desktop) using Tailwind breakpoints
- Add loading states and empty states for any data-driven component
- Never remove existing functionality unless explicitly asked.
- Explain your implementation plan before editing multiple files.
- Use TypeScript interfaces in src/types/ for all data shapes
- Pull content from src/data/*.json, never hardcode inside components
- Follow the existing folder structure — don't restructure without asking
- Only build what's explicitly requested in the current prompt — don't 
  scope-creep into other pages/features