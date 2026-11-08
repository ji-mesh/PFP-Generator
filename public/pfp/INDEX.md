# Brand PFP Pack — `public/brand/pfp/`

Profile-picture assets for JiMesh demos. All "real people" pfps are
hand-drawn comic-bust SVGs in the JiMesh token style: cyan/violet/dim
palette (`#22d3ee`/`#00d2ff`, `#c084fc`/`#e879f9`, `#131722`/`#1a2030`)
on the dim brand background `#0a0d17`, circular crop (400x400), halftone
dots + comic sparkles. Each file has unique gradient/pattern IDs so it
can be inlined alongside the others without collisions.

## Real-people pack (DEV-162 — CRM demo users, helpdesk agents, demo people)

New in DEV-162; wired into the CRM demo seeds (see "CRM wiring" below).

| File | Person | Intended use |
| --- | --- | --- |
| `woman5.svg` | waving, high ponytail, hoodie (cyan) | Generic demo user, account admin (atomic-crm "Jane Doe") |
| `woman6.svg` | blazer, braid, flower pin (violet) | CRM company contact, demo people |
| `man6.svg` | man-bun, beard, plaid shirt (cyan/violet) | CRM contact, demo people (twenty "Phil Schiler") |
| `man7.svg` | buzz cut, turtleneck, headphones (violet) | Demo people (twenty "Jony Ive"), designer personas |
| `analyst.svg` | square glasses, tablet with chart (cyan) | Data/BI personas, demo people |
| `support_female.svg` | headset, chat-bubble badge (cyan) | Helpdesk/support agents |
| `support_male.svg` | headset, fast-response badge (violet) | Helpdesk/support agents |
| `ops.svg` | round glasses, curls, gear badge (mixed) | Ops/devops personas in demos |
| `product.svg` | blazer, rocket badge (violet) | Product-manager personas (twenty "Jane Austen", atomic-crm "Ana Solberg") |
| `founder.svg` | blazer + tie, JiMesh cube badge (dim) | Founder/CEO personas (twenty "Tim Apple", atomic-crm "Daniel Reyes") |
| `sales1.svg` | side ponytail, chart badge (cyan) | Sales/account executives (CRM owners) |
| `sales2.svg` | afro, target badge (violet) | Sales/account executives (twenty "Scott Forstall", atomic-crm "Marcus Okafor") |
| `customer_success.svg` | long hair, heart badge (mixed) | Customer-success managers |
| `qa.svg` | hoodie, shield-check badge (cyan/violet) | QA personas, demo people |

## Legacy / site assets (pre-existing, not used in CRM seeds)

- **Generic people:** `woman1.svg`–`woman4.svg`, `man1.svg`–`man5.svg`
  — original pfp set for website demos and team sections.
- **Agent personas:** `agent_cards1.svg`, `agent_cards2.svg`,
  `blue_agent.svg`, `browser_agent.svg`, `coding_agent.svg`,
  `figma_agent.svg`, `fin_agent.svg`, `green_agent.svg`,
  `happy_agent.svg`, `lila_agent.svg`, `lila_agent2.svg`,
  `ninja_agent.svg`, `orange_agent.svg`, `orchestrator_agent.svg`,
  `red_team_agent.svg`, `voice_agent.svg`, `bad_agent.svg`
  — agent-gallery and marketing-site demos.
- **Team lanes:** `team_backend.svg`, `team_jimesh-core.svg`,
  `team_marketing.svg`, `team_secops.svg`, `team_social-media.svg`,
  `team_website.svg`, `your_team_cards.svg` — team-structure demos.
- **Channels:** `channel_agent-ops.svg`, `channel_alerts.svg`,
  `channel_api.svg`, `channel_brand.svg`, `channel_campaigns.svg`,
  `channel_conference-room.svg`, `channel_content-queue.svg`,
  `channel_deploy-log.svg`, `channel_main.svg`,
  `channel_migrations.svg`, `channel_red-team.svg`,
  `channel_releases.svg` — channel/inbox demos.

## CRM wiring (DEV-162)

| CRM | Seed location | Pfps used |
| --- | --- | --- |
| atomic-crm (fakerest) | `src/components/atomic-crm/providers/fakerest/dataGenerator/demoUsers.ts` (+ copies in `public/brand/pfp/`) | woman5, sales1, founder, sales2, customer_success, support_male, support_female, ops, product |
| Twenty (dev-seeder) | `packages/twenty-server/.../dev-seeder/data/constants/workspace-member-data-seeds.constant.ts` (+ `twenty-front/public/images/pfp/`) | founder, man6, man7, product, sales2 |
| NextCRM (prisma seed) | ji-mesh/nextcrm-app fork currently not accessible from this workspace; ready-to-apply seed patch: `docs/setup/DEV-162-nextcrm-pfp-seed.md` | sales1, customer_success, support_female, ops (prepared) |
