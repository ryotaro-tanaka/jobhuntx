# JobHuntX - AI Instruction Rules

## Security & Safety (STRICT)
- **Must Not**: Commit or stage `.env` files. Ensure they remain ignored by git.
- **Must Not**: Execute `git push`. Remote synchronization must be handled by the user.
- **Must Not**: Log, print, or expose secrets, API keys, or credentials.

## Project Context
JobHuntX is a job aggregator. 
- **Backend**: ASP.NET Core 8.0, Handler Pattern.
- **Frontend**: React 18 (Vite), TypeScript, Tailwind CSS.
- **Contract**: NSwag generated client connects Frontend and Backend.

## Execution Discipline (Must Follow)
Before any implementation:
1. **Inspect**: Read related files and current implementation.
2. **Plan**: Explain the planned change and impact.
3. **Act**: Implement surgical changes.
After implementation:
1. **Verify**: Run `dotnet test` or `pnpm test`.
2. **Sync**: Update `swagger.json` and regenerate NSwag client if API models changed.
3. **Safety Check**: Check `git status` to ensure no sensitive files are staged.

## Backend Rules
### Architecture: Handler Pattern
- **Must**: Implement all job fetching via `IJobHandler`.
- **Must**: Register handlers through DI container.
- **Must Not**: Use `new` to instantiate handlers (except for tests).
- **Must Not**: Add source-specific parsing logic outside of its dedicated handler.
- **Must Not**: Modify `HandlerBase` or `AggregateJobHandler` without explicit instruction.

## Frontend Rules
### Architecture: Logic Separation
- **Must**: Extract all data fetching and complex state management into custom hooks.
- **Must**: Keep UI components focused on rendering (receiving data via props).
- **Must Not**: Fetch data directly inside UI components (e.g., `useEffect` with fetch).
- **Must Not**: Use `any`. Use strict TypeScript types.
- **Must Not**: Introduce new global state or context without justification.

## Development Workflow
### API Contract Synchronization
If C# DTOs or Controller endpoints are modified:
1. Run the backend and export `swagger.json`.
2. Run NSwag regeneration: `cd JobHuntX.API && dotnet nswag run nswag.local.json`.
3. Fix any resulting type errors in the Frontend immediately.

### Testing Requirement
- **Must**: Add or update xUnit tests for backend handler logic.
- **Must**: Add or update Vitest tests for frontend hooks or components.
