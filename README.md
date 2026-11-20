# Jet Engine Playground

An original, local educational turbofan simulator built with React, TypeScript and Vite. No account, backend, API key, analytics, remote fonts or paid service is required. After installation, the app runs without an internet connection; external source links require internet access.

## Run locally

Install a supported Node.js version (Node 22.12+; tested here on Node 26.13.1) and npm. From this folder:

```powershell
npm ci
npm run dev
```

Open the localhost URL printed by Vite (normally http://127.0.0.1:5173). The server binds only to the local machine. Stop it with Ctrl+C. Dependencies require an internet connection for the first installation.

```powershell
npm run build       # type-check and build dist/
npm run preview     # locally serve the production build
npm test            # data and pure simulation tests
npm run test:e2e    # desktop/mobile browser interaction tests
npm run security:scan
```

Browser tests use installed Microsoft Edge. On another platform, remove `launchOptions.channel: 'msedge'` from playwright.config.ts and run `npx playwright install chromium` before testing. Browser tests run a local Vite server when one is not already available. Screenshots are written to test-results/ and ignored by Git.

## Explore

Choose Trent XWB (representative XWB-84 on the A350-900) or GEnx-1B (representative -1B70 on the 787-8). Engine changes reset operating state. Start at idle, then increase the throttle; stop to coast down. Pause freezes the model and decoration. Slow motion advances at one quarter speed. Reset clears the run, tour and layer choices. Starting again returns the throttle command to idle.

Click a component or a stage button for explanations. Follow the air starts a manual five-step guided tour; it does not start the engine. All sections work continuously together in operation. On small screens the enlarged cutaway scrolls horizontally; the surrounding page fits the screen. Focus the cutaway region and use arrow keys to scroll. Stage buttons provide a keyboard alternative to clicking the diagram. Native controls support Tab, Enter/Space and range-slider arrows. Reduced-motion preferences freeze rotor/flow animation while gauges remain responsive.

## Structure

- `src/data/engines.ts`: researched variants, sources, specifications, component/spool topology and learning copy.
- `src/types.ts`: typed engine schema and layer controls.
- `src/simulation/model.ts`: pure state transitions and shared illustrative response model.
- `src/simulation/useSimulation.ts`: animation frame clock and reduced-motion preference handling.
- `src/components/EngineCutaway.tsx`: original SVG cutaway driven by engine topology.
- `src/App.tsx`: simulator controls, learning panel, gauges, comparison and sources views.
- `src/styles.css`: responsive presentation and keyboard focus styles.
- `tests/`: data/model tests and browser interaction tests.
- `scripts/`: dependency-notice generation and credential-pattern scanning.
- `public/_headers`: suggested static-host security headers. These are only effective on hosts that support this file; Vite does not apply it. No deployment has been performed.

## Research and content origins

Read SOURCES.md for the engine-specific claim-to-source mapping, THIRD_PARTY_NOTICES.md for dependency licences, and CONTENT_ORIGINS.md for provenance. Runtime licence text is preserved in public/THIRD_PARTY_LICENSES.txt and included in the production build. Run `node scripts/notices.mjs` after dependency changes.

Only dimensions and stage counts that are supported by the sources are shown in the comparison. They do not determine the schematic scale. Third-party source illustrations are not reproduced.

## Simulation limitations

All gauges are dimensionless 0–100 teaching indices, not measured percent RPM, degrees, mass flow or force. The model uses exponential responses with different time constants; thrust uses a nonlinear command curve. It is not a thermodynamic solver and has no manufacturer calibration. The same response rules serve both engines, so they cannot rank real-world performance. A zero temperature index means the model's resting state, not zero degrees.

Startup and shutdown are deliberately simplified. Shaft positions, symbol dimensions, flow split and relative animation rates are illustrative. Two rotating marks are motion cues, not blade counts. Actual geometry, cooling flows, bearings, bleed air, accessories, control laws and operating limits are omitted. Bypass and core streams are shown separately. The tour is a teaching sequence, not a startup procedure.

## Add a third engine

1. Research a specific engine variant and its aircraft application using manufacturer or regulator sources. Verify every shaft connection. Add source records with URLs and scope; update SOURCES.md.
2. Add an `Engine` entry in `src/data/engines.ts`. Give components unique IDs, assign their stage (0–4) and spool, and define each spool's turbine and driven component IDs. Use common LP/IP/HP semantic IDs for the shared model. Gauge names belong to the engine data.
3. Position symbolic components within the 1100×440 drawing; shafts share y=230. Set shaft endpoints to the relevant component centres and nested radii. Validate both core paths pass through all required components. Do not treat these coordinates as real geometry.
4. Add only verified specifications with units and source IDs. Extend the comparison row schema if adding a new specification category; the current engines intentionally share the same three categories.
5. For a geared fan, extra spool type or materially different flow architecture, explicitly extend the schema, renderer and model instead of forcing it into a direct-drive LP/IP/HP arrangement.
6. Update learning copy and tests. The existing catalogue test intentionally locks the initial scope to two engines; revise it when a third is authorized. Test topology, switching, all controls, mobile layout and reduced motion. Inspect screenshots before delivery.

## Security and hosting

No secrets are needed. Do not place keys in VITE_* variables: they are public frontend content. A future keyed integration requires a restricted backend, ignored server-side environment configuration, placeholder-only .env.example, a production secret manager, appropriate authentication and rate/usage limits, least-privilege credentials and redacted logs. Never place credentials in source, browser storage, URLs or client logs.

Build output consists of compiled assets, the entry HTML, host-header configuration and runtime licences. Source maps are disabled. Only public/ is copied into the build. There is no unsafe HTML injection or untrusted external data ingestion. External links use noreferrer. Suggested CSP permits inline styles for SVG/gauge colours and prohibits external scripts. Configure HTTPS/HSTS at a future HTTPS host; do not enable HSTS blindly for localhost.

The scanner checks workspace and dist text for common credential patterns and checks tracked files and available Git history when present. It does not print matched secret values. It is a heuristic, not proof of absence. Confirmed exposure requires revocation and rotation, including when a secret has been removed from the current tree.

See VALIDATION.md for checks actually completed and remaining limitations. This project has not been published or deployed.

Independent educational project. Not affiliated with or endorsed by aircraft or engine manufacturers. Schematics and simulated readings are simplified and are not intended for flight operations, maintenance, engineering design, or certification.

Optional sound: click Enable sound to hear a quiet engine-specific synthesized soundscape with filtered airflow noise and tones following LP, HP and (for Trent) IP spool response. Pause and shutdown silence it. This is not a recording or an acoustically validated engine model.

Section temperatures: the new gas-path panel shows relative warmth for intake, bypass, compression, combustor exit, turbines and core exhaust. Hover or keyboard-focus a station for its explanation. These are illustrative 0–100 heat indices, not Celsius or metal temperatures. Intake airflow uses curved streamlines and original particle streaks, following the simulation clock and reduced-motion preference.


Temperature-unit update: the panel and diagram now share a °C/°F switch. Numerical values use an explicitly illustrative example scale: 20 °C ambient plus 12 °C per heat-index point. This supersedes the earlier relative-only display description; the scale is not manufacturer data or a validated thermal model. The separate exhaust gauge remains a labelled heat index.

Security hardening (21 November 2026): production builds embed a restrictive Content-Security-Policy meta tag. Vite preview also sends CSP, frame protection, MIME-sniffing prevention, referrer and browser-permission headers. The development server intentionally differs for hot reload. A future public host must apply public/_headers or equivalent, use HTTPS and verify response headers. Run npx playwright test --config playwright.production.config.ts after building to check the production policy.
