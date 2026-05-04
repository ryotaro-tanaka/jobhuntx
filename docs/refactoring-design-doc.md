# Refactoring Design Document: To-be Architecture Transition

This document tracks the progress of the refactoring effort to align the JobHuntX codebase with the target architecture defined in `README.md` and `docs/architecture.md`.

## Status Overview
- [ ] Phase 1: Backend - Dependency Injection (DI)
- [ ] Phase 2: Frontend - Context API
- [ ] Phase 3: Frontend - Container/Presentational Pattern
- [ ] Phase 4: Cleanup & Validation

---

## Phase 1: Backend - Dependency Injection (DI)
**Goal**: Eliminate the use of `new` for handler instantiation and leverage ASP.NET Core DI.

### Steps
- [ ] **1.1: Handler Registration**: Register all `IJobHandler` implementations and `AggregateJobHandler` in `ServiceExtensions.cs`.
- [ ] **1.2: Constructor Injection**: Update `AggregateJobHandler` to receive `IEnumerable<IJobHandler>` via constructor.
- [ ] **1.3: Endpoint DI**: Refactor `ApplicationExtensions.MapEndpoints` to use DI for handler retrieval.

---

## Phase 2: Frontend - Context API
**Goal**: Centralize state management and eliminate Prop Drilling.

### Steps
- [ ] **2.1: JobSearchContext**: Create `client-app/src/contexts/JobSearchContext.tsx`.
- [ ] **2.2: Provider Integration**: Wrap the application with `JobSearchProvider`.

---

## Phase 3: Frontend - Container/Presentational Pattern
**Goal**: Separate logic (data fetching/state) from UI components.

### Steps
- [ ] **3.1: JobList Refactoring**:
    - Create `JobListContainer.tsx`.
    - Move fetch logic from `JobList.tsx`.
    - Make `JobList.tsx` a presentational component.
- [ ] **3.2: FixedHeader Refactoring**:
    - Create `FixedHeaderContainer.tsx`.
    - Move search/toggle logic from `FixedHeader.tsx`.
- [ ] **3.3: JobDetailModal Refactoring**:
    - Create `JobDetailModalContainer.tsx`.
    - Manage state via Context.

---

## Phase 4: Cleanup & Validation
- [ ] **4.1: App.tsx Cleanup**: Simplify the main entry point.
- [ ] **4.2: Verification**: Run all tests and verify API/Frontend synchronization.
