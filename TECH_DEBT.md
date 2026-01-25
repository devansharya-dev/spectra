# Technical Debt

## Frontend

### DemoSession Component (`frontend/src/components/DemoSession.jsx`)
- **Proactive Mode Initialization**: The logic to automatically start "AI Insights" or "Live Demo" based on the selected mode needs to be re-implemented or verified.
- **Layout Unification**: Ensure the "Command Center" panel has a unified layout without nested scrollbars, matching the responsive design requirements.
- **State Consistency**: Verify that the `mode` prop is correctly passed and utilized for UI state updates (e.g., "AUTO" badge).
