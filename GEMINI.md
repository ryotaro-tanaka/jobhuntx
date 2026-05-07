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
After implementation (Autonomous Steps):
1. **Format**: Always run `npm run format` to ensure style consistency.
2. **Sync**: If API models changed, run `npm run sync` to update the client.
3. **Verify**: Run `npm run check` (Lint/Typecheck) or `npm run validate` (Full) to confirm correctness.
4. **Safety Check**: Check `git status` to ensure no sensitive files are staged.

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
### AI-Autonomous Responsibilities
As an AI agent, you are responsible for maintaining the project's technical integrity without bothering the human designer for routine tasks:
- **Style**: Never leave a task without running `npm run format`.
- **Contract**: If you touch C# DTOs or Controllers, you MUST run `npm run sync` and fix any resulting TypeScript errors.
- **Quality**: Use `npm run check` frequently during development to catch type errors early. Use `npm run validate` as your final definition of "Done".

### Testing Requirement
- **Must**: Add or update xUnit tests for backend handler logic (`npm run test:backend`).
- **Must**: Add or update Vitest tests for frontend hooks or components (`npm run test:frontend`).
- **Must**: Ensure all tests and type checks pass via `npm run validate`.
