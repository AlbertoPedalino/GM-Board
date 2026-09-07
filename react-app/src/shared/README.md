# Shared modules

Code used by multiple pages belongs here, grouped by responsibility. Keep
page-specific code in `src/pages/` and app navigation in `src/app/navigation/`.
See the [source map](../README.md) for the page feature folders.

| Folder | Responsibility |
| --- | --- |
| `campaign/` | Campaign roster, shared character vitals, campaign selection |
| `character/` | Character rules and the UI tied to those rules; see below |
| `cloud/` | Supabase access, authentication, and synchronization; see below |
| `content/` | D&D entry rendering, 5etools links, source filtering, text search |
| `dungeon/` | Dungeon generation helpers, room markers, linked encounters |
| `hexcrawl/` | Hex data and campaign clock |
| `instances/` | Tool instance identity, linked groups, registry definitions, initial creation |
| `storage/` | Generic localStorage access, registry persistence, scoped payloads |
| `ui/` | Reusable presentation components/hooks, toasts, colors, route titles |
| `vtt/` | Battle-map geometry, fog, scenes, dice physics, sheets, and realtime state |

## Character

| Folder | Responsibility |
| --- | --- |
| `combat/` | AC, HP, conditions, combat effects, initiative, weapon mastery |
| `dice/` | Roll calculations, dice rendering, roll logs and toasts |
| `forms/` | Wild Shape, companions, summons, and cannon forms |
| `inventory/` | Items, crafting, currency, attunement, charges, inventory filtering |
| `profile/` | Character persistence, portraits, class icons |
| `progression/` | Levels, ability bonuses, choices, feats, proficiencies, languages, XP |
| `resources/` | Shared rest and recharge rules |
| `spells/` | Spell grants, metadata, slots, Pact Magic, free casts, spell references |

Keep domain UI alongside its rules (for example, `combat/ConditionChips.jsx`).
General-purpose presentation belongs in `ui/`; shared entry/source handling
belongs in `content/`.

## Cloud

| Folder/file | Responsibility |
| --- | --- |
| `api/` | Resource operations for campaigns, characters, art, fights, dungeons, hexcrawls, VTT |
| `auth/` | Auth provider, sign-in dialog, account/cloud menu |
| `sections/` | Generic tool-section adapters and operations |
| `sync/` | Autosync engine, sync exclusions/ownership, realtime character and roll hooks |
| `supabaseClient.js` | Shared Supabase client configuration |

## VTT

| Folder/file | Responsibility |
| --- | --- |
| `map/` | Geometry, hexes, measurement, fog, drawing, and map objects |
| `scene/` | Scene data and atmosphere definitions |
| `session/` | Live sessions/scenes, roles, spectator links, and camera synchronization |
| `tokens/` | Token bridge and encounter import/synchronization |
| `sheets/` | Sheet frame, layout, and view state |
| `rolls/` | Roll feed, thrown rolls, and dice physics |
| `colors.js` | Palette shared across VTT features |

## Imports and tests

Import the defining module directly; avoid compatibility re-exports at retired
paths and broad barrel files that pull unrelated features into the entry bundle.

The test trees mirror the production paths:

- `src/shared/character/combat/conditions.js` → `tests/logic/shared/character/combat/conditions.test.js`
- `src/shared/character/dice/DiceRow.jsx` → `tests/ui/shared/character/dice/DiceRow.test.jsx`

Use `npm test` for hygiene, logic and UI checks, and `npm run build` to verify
production imports. See `tests/README.md` for runner commands.
