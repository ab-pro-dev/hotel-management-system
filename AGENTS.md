## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

When the user types `/graphify`, invoke the `skill` tool with `skill: "graphify"` before doing anything else.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- Dirty graphify-out/ files are expected after hooks or incremental updates; dirty graph files are not a reason to skip graphify. Only skip graphify if the task is about stale or incorrect graph output, or the user explicitly says not to use it.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).

## Design Context

**Register:** product (app UI, dashboards, management tools)
**Platform:** web (Next.js 16, React 19)
**Users:** Hotel staff (admin, reception, housekeeping) + guests (booking, check-in)
**Positioning:** Modern UX — better interface than legacy PMS systems
**Brand personality:** Minimal, professional confidence
**Anti-references:** Generic PMS (Cloudbeds, Hotelogix), luxury brand marketing sites, SaaS dashboard templates

**Design system:** Deep Navy (#1f3d2e) as sole accent, warm parchment backgrounds, Fraunces serif + DM Sans, zero shadows, invisible utility components. See PRODUCT.md and DESIGN.md for full details.
