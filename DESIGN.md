# OrbitCare design contract

Approved by the participant on 15 November 2026: mission clinical hybrid, rich interaction with progressive disclosure.

- Navy navigation #122235; pale working surface #F5F7F6; ink #182B3A; teal interaction #007F78; amber review #9A5B00. White is the plot/evidence surface. Verify contrast in the rendered UI.
- IBM Plex Sans is the interface family. IBM Plex Mono appears only in mission clocks. Body text uses proportional figures except tabular numerical values.
- The memorable element is one aligned mission-health record: three plots share a timeline and reference period. Select a day, inspect its explanation, then record a review. Exercise appears as context.
- Left-aligned operational composition: narrow navy navigation, spacious working record, a right-hand explanation rail. At narrow widths the rail joins document order. No decorative scenes, clinical health scores, repeated statistic cards, or invented telemetry.

```text
navigation | mission title / local status / check-in
           | prominent change brief and original-unit differences
           | four descriptive scenario choices and real fixture previews
           | aligned indicator plots | explanation / rule / evidence
           | mission day selection   | review action
           | exercise context        | history
```

This is a tool for operating and reading. Boldness belongs in the coherent mission record, not ornament. Typography, chart alignment, scientific labels, and state feedback give it identity. A generic card grid was rejected in favor of a continuous, selectable record.

The visual upgrade makes the change brief the opening focal point. Reference and selected reading sit together in the explanation, followed by the observed difference, three-day persistence, and progressively disclosed evidence. Larger day controls distinguish reference, change, missingness and recorded review events using text and symbols as well as color. Future timeline states remain hidden during replay. Scenario previews use existing fixture values, without new metrics or predictions.

On mobile, the change brief precedes scenario controls; metric headers sit above full-width plots. The check-in action stays within the page header rather than covering content. Original-unit plots retain gaps and an accessible table. NASA participant shapes and keyboard-selectable observations add a non-color way to inspect the unchanged source measurements.

Use the project-local Frontend Design, Vercel Web Design Guidelines, React Best Practices and UI UX Pro Max guidance. Impeccable critique/polish references inform review only; no engine or hooks are installed. Baseline/final screenshot evidence and implementation decisions are recorded in VISUAL_UPGRADE.md.

Use visible keyboard focus, original chart units, redundant text status, touch-sized controls, native dialog semantics, reduced motion, and table alternatives. Every loading, empty, error, incomplete, and offline state must provide useful direction.
