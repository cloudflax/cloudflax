# GitHub Project — @cloudflax

Guía para crear issues, enlazarlos al board y rellenar metadatos de forma consistente.

## Proyecto

| Dato | Valor |
| ---- | ----- |
| Nombre en GitHub | **@cloudflax** |
| URL | https://github.com/users/cloudflax/projects/11 |
| Número (`gh project …`) | `11` |
| Owner (`--owner`) | `cloudflax` |
| Repositorio frontend | `cloudflax/cloudflax` |

## Assignees

- **Siempre** asignar a **`cloudflax`** (usuario dueño del trabajo en este repo).

Al crear un issue:

```bash
gh issue create --repo cloudflax/cloudflax --assignee cloudflax ...
```

## Añadir el issue al board

Tras crear el issue, enlazarlo al proyecto:

```bash
gh project item-add 11 --owner cloudflax --url https://github.com/cloudflax/cloudflax/issues/<N>
```

## Labels del repositorio

Usar **uno o los que apliquen** según el tipo de trabajo (issues en `cloudflax/cloudflax`):

| Label | Cuándo usarlo |
| ----- | ------------- |
| `bug` | Comportamiento incorrecto o regresión |
| `enhancement` | Nueva funcionalidad o mejora de producto |
| `documentation` | Cambios en docs, README, guías de agentes, etc. |
| `question` | Falta información o hay que decidir algo |
| `good first issue` | Tarea acotada para quien empieza |
| `help wanted` | Convoca revisión o ayuda externa |
| `duplicate` / `invalid` / `wontfix` | Solo si corresponde al cierre o triage |

```bash
gh issue create --repo cloudflax/cloudflax --label enhancement --assignee cloudflax ...
```

## Campos del proyecto (obligatorios de rellenar en el board)

Rellenar **Priority**, **Size** y **Estimate** en cada ítem. **Start date** y **Target date** solo si hay planificación explícita; si no aplica, dejar **sin fecha** (vacío en la UI o `--clear` vía CLI).

### Priority (elegir una opción)

| Opción | Uso |
| ------ | --- |
| **P0** | Bloquea release, producción rota o seguridad; atención inmediata |
| **P1** | Importante en el sprint o milestone actual; debe entrar pronto |
| **P2** | Mejora o deuda; se puede posponer sin impacto crítico |

### Size (elegir una opción)

| Opción | Uso orientativo |
| ------ | --------------- |
| **XS** | Cambio trivial (minutos / pocas líneas) |
| **S** | Alcance pequeño, un archivo o flujo claro |
| **M** | Varios archivos o feature mediana |
| **L** | Feature grande o varias áreas del código |
| **XL** | Epica o refactor amplio; considerar partir en sub-issues |

### Estimate

- Valor **numérico** en el campo del proyecto (story points u horas; el equipo debe acordar la unidad; por defecto tratarlo como **story points** 1–13 alineados con **Size**: XS≈1, S≈2–3, M≈5, L≈8, XL≈13).

### Start date / Target date

- **Sin fecha** salvo que haya compromiso o ventana conocida.
- Con fechas: formato **YYYY-MM-DD** al editar por CLI.

## Columnas del board (Status)

| Columna | Significado |
| ------- | ----------- |
| **Backlog** | Tareas pendientes que aún no se han comenzado a trabajar. |
| **In progress** | Tareas con una rama de desarrollo activa donde se está escribiendo código actualmente. |
| **In review** | Tareas con un Pull Request abierto esperando revisión y aprobación para entrar a `develop`. |
| **Staging** | Código ya aprobado y fusionado en `develop`. Es la sala de espera para el próximo release a producción. |
| **Done** | Tareas finalizadas, fusionadas en `main` y con sus Issues cerradas oficialmente. |

## Referencia técnica (IDs para `gh project item-edit`)

Project id (`--project-id`):

`PVT_kwHOCok_aM4BTFgB`

Obtener el **id del ítem** en el board (cambia por issue):

```bash
gh project item-list 11 --owner cloudflax --format json --limit 100
```

Campos ( `--field-id` ) y opciones single-select ( `--single-select-option-id` ):

| Campo | `--field-id` | Opciones (nombre → option id) |
| ----- | ------------ | ------------------------------ |
| Status | `PVTSSF_lAHOCok_aM4BTFgBzhAbi2Y` | Backlog `f75ad846`, In progress `47fc9ee4`, In review `df73e18b`, Staging `637cb9c8`, Done `98236657` |
| Priority | `PVTSSF_lAHOCok_aM4BTFgBzhAbi4w` | P0 `79628723`, P1 `0a877460`, P2 `da944a9c` |
| Size | `PVTSSF_lAHOCok_aM4BTFgBzhAbi40` | XS `6c6483d2`, S `f784b110`, M `7515a9f1`, L `817d0097`, XL `db339eb2` |
| Estimate | `PVTF_lAHOCok_aM4BTFgBzhAbi44` | `--number` (float) |
| Start date | `PVTF_lAHOCok_aM4BTFgBzhAbi48` | `--date YYYY-MM-DD` o `--clear` |
| Target date | `PVTF_lAHOCok_aM4BTFgBzhAbi5A` | `--date YYYY-MM-DD` o `--clear` |

Ejemplo (sustituir `<ITEM_ID>` por el id del ítem en el proyecto):

```bash
gh project item-edit \
  --project-id PVT_kwHOCok_aM4BTFgB \
  --id <ITEM_ID> \
  --field-id PVTSSF_lAHOCok_aM4BTFgBzhAbi4w \
  --single-select-option-id 0a877460
```

Un campo por invocación de `gh project item-edit`.

## Comprobar definición de campos

```bash
gh project field-list 11 --owner cloudflax --format json
```

Si GitHub cambia IDs, volver a listar con el comando anterior y actualizar esta tabla.
