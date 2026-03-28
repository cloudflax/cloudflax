# Flujo de Comunicación

## Al explicar cambios

- En español de forma concisa
- Resume:
  - **Qué** se cambió
  - **Por qué** (decisión técnica)
  - Pasos manuales si aplica (ej: `npm install`)

## Commits (Git)

Los mensajes de commit van **siempre en inglés**, en estilo [Conventional Commits](https://www.conventionalcommits.org/):

- Formato: `type(scope optional): short description` (descripción en imperativo, sin punto final).
- Tipos habituales: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`.
- El cuerpo del commit y footers (`Closes #n`, `BREAKING CHANGE:`) también en inglés.

Ejemplos:

- `docs(agents): add GitHub Project guide`
- `fix(auth): refresh session on token expiry`
- `feat(dashboard): add usage summary card`
