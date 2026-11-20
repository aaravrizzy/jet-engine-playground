# Validation record

Completed 20 November 2026 on Windows, Node 26.13.1, npm 11.20.0, installed Microsoft Edge (headless Playwright).

## Completed checks

- `npm run build`: passed TypeScript checking and production bundling. Final output: approximately 251 kB JavaScript / 79 kB gzip, 17 kB CSS / 5 kB gzip. No production source maps.
- `npm test`: 10 tests passed. Covers scoped variants, aircraft labels, source references, unique component membership, turbine/shaft/compressor topology, off/starting/running/stopping, lag and nonlinear thrust, input bounds, pause, quarter-speed time, stopping during startup, restarting, deterministic reset, switching from three to two spools, and reduced-motion behaviour.
- `npm run test:e2e`: 3 tests passed. Desktop at 1440×1100, mobile at 390×844. Both engine selections, correct shaft counts, GEnx booster coupling and absence of IP turbine, start/stop, throttle, pause/resume, slow motion, reset, all layer toggles, stage click, complete five-step guided tour, comparison specifications, sources navigation, keyboard slider/button/SVG activation, and reduced-motion rendering were exercised.
- Browser console/page-error capture: no errors recorded in the final full operating/learning/comparison/source flow.
- Flow geometry test: sampled the rendered SVG paths for both engines; core flow intersects every component symbol and the combustor, while bypass flow remains outside combustion. The lower paths are mirrored versions of the same geometry.
- Desktop Trent, desktop GEnx, comparison and mobile screenshots were opened and visually inspected. Increased text sizes, restored mobile variant/application labels, added horizontal-scroll guidance, and removed the offscreen skip-link screenshot artefact. The mobile page has no whole-page horizontal overflow; only the deliberately enlarged schematic and comparison table scroll.
- Pointer interaction testing found decorative shaft lines intercepting the combustor hit target. Decorative SVG elements now ignore pointer events; component hits passed the final test.
- Added an original favicon to eliminate the browser's missing-resource console error.
- `npm audit --json`: zero known advisories across the locked dependency graph at the time checked. The first sandboxed audit was blocked by DNS; the successful query used approved network access. This is an advisory-database check, not an exhaustive code/security audit.
- `node scripts/notices.mjs`: recorded 148 lockfile entries (including platform-specific optional dependencies), zero unknown declared licences. Runtime licence texts are preserved in the source and production output.
- `npm run security:scan`: zero common credential-pattern matches in workspace text and production output. Secret values are never printed. This is a heuristic scan, not proof that no secret can exist.
- Git discovery: the workspace is not a Git repository. There are no available tracked-file records or Git commits to inspect; no history-security claim is made.
- Inspected `dist/`: only entry HTML, compiled CSS/JavaScript, original favicon, static-host header configuration and runtime licence text. No source maps, private files, source tree or development configuration are shipped.

## Boundaries

Tests used Edge, not an exhaustive cross-browser/device matrix. No screen-reader audit, manufacturer performance validation, thermodynamic validation, flight/maintenance suitability evaluation or legal review was performed. Network source references were researched but not copied into the bundle. CAA and NTSB sources supply architecture; differences in variant scope are documented in SOURCES.md.

The simulation indices, schematic geometry, flow proportions, relative animation speeds and startup/shutdown timings remain illustrative. Published fan dimensions and stage counts are separately sourced. No comparative efficiency or power conclusions can be drawn from this model.

The `_headers` file is supplied for compatible static hosts; headers have not been verified on a production host. No site or repository was published. There are no external media assets with unresolved permissions; a licence for the original project code has not been selected by the user.

## Reproduction

Run `npm ci`, `npm run build`, `npm test`, `npm run test:e2e`, `npm audit`, and `npm run security:scan`. Browser screenshots are saved in ignored `test-results/`. See README.md for platform/browser setup and how to add a researched engine.
