# JobHuntX: Strategic Pivot to Decision Support

## Project Vision (`pivot/decision-support`)

JobHuntX is evolving from a mere job aggregator into a **job application decision support system**.

**Core Value:** Helping users decide where to spend their limited time and energy for job applications.

### Core Product Hypothesis
Instead of optimizing for quantity or speed, we optimize for **application decision quality**.
- **Central Question:** "Is this opportunity worth applying to right now?"

### Decision Lens
Everything must be evaluated through this lens:
- If a feature does not improve the quality of an application decision, it should not be prioritized.

---

## Current Focus: `pivot/fit-score-engine`

This branch marks the first step in our pivot strategy.

### Goal
Implement the **Application Fit Score** to help rank jobs by estimated application viability.

### Expected Outcome
- Backend: Logic to calculate and expose an `ApplicationFitScore` in the job response.
- Frontend: UI components or indicators displaying this score to support application decision-making.

### Success Criteria
- Jobs are ranked based on data-driven signals (Tech stack, experience, domain, etc.).
- The score provides an "informed estimate" rather than a hard prediction.
- Developers can quickly identify high-potential vs. low-potential opportunities.

---

## Strategic Principles

### AI Resource Constraints
AI must be used deliberately and only when it demonstrably improves application decisions.
- **Focus:** Job fit reasoning, opportunity classification, AI-resilience analysis.
- **Avoid:** Generic summaries, decorative explanations, non-actionable insights.

### Prioritized Roadmap
1. **[High] Application Fit Score** (Current Focus)
2. **[Medium] AI-Resilience Score**
3. **[Low/Future] AI-Assisted Auto Apply**
4. **[Low] Job Market Trend Visualization**
