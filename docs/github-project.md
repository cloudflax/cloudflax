# GitHub Project — @cloudflax

Issues en `cloudflax/cloudflax`, board [project 11](https://github.com/users/cloudflax/projects/11). Owner CLI: `cloudflax`.

## Flujo mínimo

```bash
gh issue create --repo cloudflax/cloudflax --assignee cloudflax --label <label> ...
gh project item-add 11 --owner cloudflax --url https://github.com/cloudflax/cloudflax/issues/<N>
```

## Labels

`bug` | `enhancement` | `documentation` | `question` | `good first issue` | `help wanted` | `duplicate` / `invalid` / `wontfix` (triage/cierre).

## Campos del board

**Obligatorios en todo ítem:** Priority, Size, Estimate. Completarlos al enlazar el issue al board o en la primera pasada de triage.

**Opcionales:** Start date, Target date — solo si hay compromiso o ventana conocida; si no aplica, vacío en la UI o `--clear` por CLI.

### Priority (una opción)

| Opción | Cuándo |
| ------ | ------ |
| **P0** | Bloquea release, producción inestable o tema de seguridad |
| **P1** | Importante para el sprint o milestone actual |
| **P2** | Mejora o deuda técnica; se puede posponer sin riesgo crítico |

### Size (una opción)

| Opción | Alcance orientativo |
| ------ | ------------------- |
| **XS** | Cambio trivial (minutos, pocas líneas) |
| **S** | Alcance pequeño: un archivo o un flujo claro |
| **M** | Varios archivos o feature de tamaño medio |
| **L** | Feature grande o toca varias áreas |
| **XL** | Épica o refactor amplio; considerar dividir en issues |

### Estimate

Valor numérico en el campo del proyecto. Por defecto interpretar como **story points** (1–13). Debe ser coherente con **Size**: XS≈1, S≈2–3, M≈5, L≈8, XL≈13; el equipo puede refinar la escala.

### Fechas

`YYYY-MM-DD` al editar por CLI; en la UI, el date picker del proyecto.

## Status (columnas)

**Backlog** → **In progress** (rama activa) → **In review** (PR) → **Staging** (en `develop`) → **Done** (`main`, issue cerrada).

## CLI: `gh project item-edit`

Board **11**, owner `cloudflax`. No hace falta mantener aquí una tabla de IDs: salen del API y pueden cambiar si se toca el proyecto.

```bash
gh project field-list 11 --owner cloudflax --format json   # field id + opciones single-select
gh project item-list 11 --owner cloudflax --format json --limit 100   # item id por issue
```

Un campo por comando. **Single select** (Status, Priority, Size): `--field-id` y `--single-select-option-id` (los option id están en el JSON de cada campo). **Estimate**: `--number`. **Start / Target date**: `--date` o `--clear`.

```bash
gh project item-edit --project-id <PROJECT_ID> --id <ITEM_ID> \
  --field-id <FIELD_ID> --single-select-option-id <OPTION_ID>
```
