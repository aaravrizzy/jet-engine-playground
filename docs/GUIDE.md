# Jet Engine Playground

Explore the inside of a turbofan engine: follow the airflow, trace the shafts, and see how its sections work together.

**[Open the live simulator](https://jet-engine-playground.vercel.app/)** · [GitHub repository](https://github.com/aaravrizzy/jet-engine-playground)

Built with **React, TypeScript, Vite and original SVG animations**. Hosted on Vercel. The simulator runs in your browser with no account, backend or API keys.

## Engines you can explore

| Engine | Representative variant | Aircraft application | Architecture |
| --- | --- | --- | --- |
| Rolls-Royce Trent XWB | Trent XWB-84 | Airbus A350-900 | Three spools: LP, IP and HP |
| GE Aerospace GEnx-1B | GEnx-1B70 | Boeing 787-8 | Two spools: LP and HP |

On the Trent, each turbine drives its corresponding fan or compressor assembly. On the GEnx, the LP turbine drives both the fan and booster; the HP turbine drives the HP compressor. Matching colours identify connected components. See [SOURCES.md](../SOURCES.md) for the supporting references.

## What you can do

- **Explore an animated cutaway:** intake, fan, bypass passage, compressors, combustor, turbines, concentric shafts and exhaust paths.
- **Operate the teaching model:** start, stop, change throttle, pause, slow to quarter speed and reset. Engine changes reset operating state.
- **Follow the air:** click components or use the five-step guided tour. Toggle airflow, shafts, labels and casing.
- **Read the instruments:** normalized spool speeds, exhaust heat, fuel flow and thrust respond smoothly to the controls.
- **Switch temperatures between °C and °F:** the section panel and diagram labels update together. These are explicitly illustrative examples, not measured engine temperatures.
- **Enable engine-specific sound:** the Trent has a deeper synthesized rumble and an IP-spool tone; the GEnx has a brighter fan tone and airflow hiss. Audio follows spool response and fades during pause or shutdown. No recordings are used.
- **Compare architectures:** view aircraft applications, mechanical connections, published fan diameters and stage counts with source links.

All engine sections operate continuously together while running. The guided tour is a teaching sequence, not an engine startup sequence.

## Run locally

Use Node.js 22.12+ and npm. This project was developed with Node.js 26.13.1.

```sh
git clone https://github.com/aaravrizzy/jet-engine-playground.git
cd jet-engine-playground
npm ci
npm run dev
```

Open the localhost URL printed by Vite, normally `http://127.0.0.1:5173`. Stop the server with `Ctrl+C`. Dependency installation requires internet access; the locally served simulator does not require external services. Source links require internet access.

## Controls and accessibility

Use **Start engine**, then adjust the throttle. Stop lets the spools coast down; restarting returns the command to idle. Reset clears the run, tour and diagram layer choices. Throttle command is not equal to thrust percentage.

Controls support keyboard navigation with Tab, Enter/Space and slider arrow keys. Stage buttons offer an alternative to selecting the SVG. On smaller screens, scroll the enlarged diagram sideways; its scroll region can also receive keyboard focus. Reduced-motion preferences freeze decorative airflow and rotor motion while the readings remain responsive. Sound is off until you enable it.

## Project structure

```text
src/
  data/engines.ts                 Engine definitions, verified facts and sources
  types.ts                       Engine and diagram types
  simulation/
    model.ts                     Pure simulation state transitions
    useSimulation.ts             Frame clock and reduced-motion support
    thermal.ts                   Illustrative heat profile and unit conversion
    sound.ts                     Engine-specific synthesized audio profiles
    useEngineSound.ts            Web Audio lifecycle and smooth sound changes
  components/
    EngineCutaway.tsx            Original interactive SVG rendering
    ThermalProfile.tsx           Section temperatures and unit switch
  App.tsx                        Controls, learning, gauges and comparison
  styles.css                     Responsive layout and visual styling
tests/                           Model, browser and production-policy tests
scripts/                         Credential-pattern scan and licence notices
public/                          Original favicon, notices and host header template
```

Engine data, simulation logic and rendering are kept separate so another researched engine can be added without rebuilding the whole interface.

## Build and checks

```sh
npm run build
npm run preview
npm test
npm run test:e2e
npm run security:scan
npm audit
```

`npm run build` type-checks the app and generates `dist/`. `npm run preview` serves that production build locally. After building, check its security policy with:

```sh
npx playwright test --config playwright.production.config.ts
```

Browser tests use Microsoft Edge. To use Playwright Chromium instead, remove `launchOptions.channel: 'msedge'` from both Playwright configuration files, then run `npx playwright install chromium`. Test screenshots and reports are ignored by Git.

See [VALIDATION.md](../VALIDATION.md) for the recorded checks and their limits. Historical local results do not independently verify the current live deployment.

## Vercel deployment

The live application is hosted at **https://jet-engine-playground.vercel.app/**.

| Build setting | Value |
| --- | --- |
| Framework | Vite |
| Root directory | Repository root |
| Install command | `npm ci` |
| Build command | `npm run build` |
| Output directory | `dist` |
| Environment variables | None required |

To update the repository after making changes:

```sh
git add .
git diff --cached
git commit -m "Describe your changes"
git push
```

Review the staged changes before committing. With Vercel's Git integration configured, pushes to the configured production branch trigger deployment. Check the Vercel dashboard for the build result.

The `public/_headers` file is a template for compatible static hosts; do not assume Vercel applies it. Configure equivalent response headers through Vercel's project configuration and verify them on the live URL. This checkout currently has no `vercel.json`; the live header configuration has not been independently checked here.

## Accuracy and simulation limits

**Simplified educational schematic — not to scale.**

The architecture and separately listed specifications come from public sources. Blade silhouettes, spacing, passage shapes, flow proportions and animation speeds are original approximations. Drawn blades do not represent verified blade counts or exact internal geometry. Cooling circuits, bearings, bleed air, accessories, variable stators and control laws are omitted.

The main instruments use dimensionless 0–100 teaching indices, not actual percent RPM, fuel rates or thrust. The shared response model uses smooth lag and a nonlinear throttle-to-thrust curve; it is not a thermodynamic solver and cannot rank the engines' real performance.

The temperature display uses a deliberately chosen example scale: **20 °C ambient plus 12 °C per heat-index point**. Fahrenheit is converted using `°F = °C × 9/5 + 32` before rounding. These numbers are not manufacturer measurements, operating limits or blade/casing temperatures. The separate exhaust gauge remains a normalized heat index. Startup, shutdown and acoustic profiles are also illustrative.

## Sources, licences and security

- [SOURCES.md](../SOURCES.md): engine facts, references and scope limitations.
- [THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md): dependency versions and licence notices.
- [CONTENT_ORIGINS.md](../CONTENT_ORIGINS.md): original code, artwork and audio provenance.

No manufacturer logos, photographs, recordings, CAD or third-party engine models are included. Names are factual identifiers; trademarks remain with their respective owners. A public licence for the original project code has not yet been selected. Regenerate dependency notices after dependency changes with `node scripts/notices.mjs`.

No API keys are required. Never put secrets in frontend code, browser storage or `VITE_*` variables. A future keyed service needs a restricted backend, appropriate access and usage controls, and server-side secret storage.

Production builds disable source maps and embed a Content-Security-Policy. Local production preview also sends protective response headers. Only intended public assets are copied into the build. The development server is configured for localhost and is not a production server.

The credential scanner checks workspace/build text and available Git history for common secret patterns without printing secret values. It is a heuristic, not a guarantee. If a credential is exposed, revoke and rotate it; deleting the file alone is insufficient. Dependency audits and local tests do not guarantee that a website is unhackable.

## Add another engine

1. Research a specific variant, aircraft application and shaft connections using manufacturer or regulator sources. Add references to the data catalogue and SOURCES.md.
2. Add an `Engine` definition in `src/data/engines.ts`, with unique component IDs, stage assignments (0–4), spool membership and turbine-to-driven-component connections.
3. Position the schematic components in the 1100×440 view. Shafts share the centreline at y=230. Check that core airflow intersects each required assembly and bypass airflow avoids combustion.
4. Add verified specifications with units and references. The comparison currently uses three matching specification categories; extend its schema if needed.
5. Add an explicit audio profile if desired. For geared fans, additional spool types or different flow architectures, extend the schema and renderer instead of forcing a direct-drive LP/IP/HP arrangement.
6. Update the initial two-engine scope test, learning copy and relevant tests. Verify switching, controls, airflow, mobile layout and reduced motion, and inspect the rendered result.

---

Independent educational project. Not affiliated with or endorsed by aircraft or engine manufacturers. Schematics and simulated readings are simplified and are not intended for flight operations, maintenance, engineering design, or certification.

