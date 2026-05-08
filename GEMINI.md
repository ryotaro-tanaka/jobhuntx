# JobHuntX - AI Instruction Rules

## Security & Safety (STRICT)
- **Must Not**: Commit or stage `.env` files.
- **Must Not**: Execute `git push`.
- **Must Not**: Log, print, or expose secrets, API keys, or credentials.

## Execution Discipline
### Scope & Consistency (CRITICAL)
- **Strict Scope**: If specific files are targeted for modification, do not edit outside that range.
- **Reporting**: Report any concerns regarding system-wide consistency or side effects before execution and wait for user instructions.

### Language Policy
- **Code & Config**: Use **English** for source code, comments, commit messages, and configuration files (including `.env`).
- **Documentation**: Use **Japanese** for personal development notes, implementation plans, and strategy documents.
- **Localization**: Maintain `README.ja.md` in Japanese.

### Post-Implementation (Project Specific)
Run the following autonomously as needed (Refer to categories in `package.json`):
1. **Format**: `npm run format` (Maintains style)
2. **Sync**: Ensure backend is running, then run `npm run sync` after C# DTO changes to update TypeScript models.
3. **Verify**: Use `npm run check` for quick checks, or `npm run validate` for full verification (including tests).

## Architecture Rules
### Backend (Handler Pattern)
- **Fetching**: Implement all job fetching logic via `IJobHandler`.
- **Encapsulation**: Do not include source-specific parsing logic outside of its dedicated handler.
- **Protected**: Do not modify `HandlerBase` or `AggregateJobHandler` without explicit instructions.

### Frontend (Logic Separation)
- **Hooks**: Extract data fetching and complex state management into custom hooks.
- **Components**: Focus on rendering (receiving data via props).
- **No Direct Fetch**: Do not call `fetch` or API clients directly inside UI components (e.g., in `useEffect`).

### Testing
- **Requirement**: Update or add xUnit (Backend) or Vitest (Frontend) tests when modifying handlers, hooks, or components.
