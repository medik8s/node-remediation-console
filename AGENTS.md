<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

# Coding guidelines

## I. Accessible Typography and Layout Units
Font sizes and layout dimensions (heights, widths, padding, margins) that affect text readability MUST use `rem` units instead of `px` units. This ensures the UI scales properly when users adjust their browser's font size settings, which is critical for accessibility. Use `rem` for font sizes, line heights, and any layout dimensions (div heights, padding, margins) that should scale with user font preferences. Pixel units (`px`) may only be used for non-text elements like borders, shadows, or fixed-size icons that should not scale with font size changes.

## II. Modern UI Framework Standards
All UI components MUST be responsive and accessible. Native HTML tags like `div`, `p`, and `span` should be avoided when possible in favor of patternfly components. Usually text can be directly embedded in the components instead of wrapped in html tags.

## III. useMemo Usage Guidelines
Do NOT use `useMemo` for functions or operations with O(1) complexity. `useMemo` adds overhead for memoization checks that can outweigh the benefits for simple, fast-executing operations. Only use `useMemo` when:
- The computation is expensive (e.g., complex calculations, large array transformations)
- The operation has O(n) or higher complexity
- Profiling shows that memoization actually improves performance
For O(1) operations and simple functions, the default behavior without memoization is sufficient and more efficient.