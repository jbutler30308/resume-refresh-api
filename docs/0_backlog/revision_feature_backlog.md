# Revision Feature - Backlog

This file contains features and enhancements for the itinerary revision process that are deferred from the initial MVP.

### 1. Display Conversation History on UI
- **Requirement:** Display the user's instruction history (e.g., "Add more time in Kyoto...") on the UI.
- **Benefit:** A visible log would help the user keep track of the changes they have requested during the revision session.
- **Status:** Deferred. Not required for MVP.

### 2. Advanced Token Limit Management & UX
- **Requirement:** Implement a graceful and user-friendly warning system for when the conversation history approaches the LLM's context window limit (e.g., 128k tokens for GPT-4o).
- **Details:**
    - Design a non-intrusive UI warning (e.g., a small message below the input field).
    - Define the user flow when the limit is reached (e.g., disable the "Update Itinerary" button, suggest starting a new session).
- **Status:** Deferred. Not required for MVP.

### 3. Visual Diff for Itinerary Changes
- **Requirement:** Instead of completely replacing the itinerary on each revision, show a "diff" or highlight what has changed from the previous version.
- **Benefit:** Helps the user quickly see and verify the specific changes they requested.
- **Status:** Deferred. This is a complex enhancement not required for MVP.
