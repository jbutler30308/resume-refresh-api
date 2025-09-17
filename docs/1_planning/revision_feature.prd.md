# Product Requirements Document (PRD): Itinerary Revision Feature

## 1. Overview

This document outlines the requirements for the **Itinerary Revision Feature**, an enhancement to the existing Travel Itinerary Web Component. This feature will allow a travel coordinator to iteratively refine an AI-generated travel itinerary by providing feedback in a conversational manner within a single session. The core principle is to maintain the full context of the conversation, ensuring the AI does not lose track of previous user instructions.

## 2. Problem Statement

The initial AI-generated itinerary is a powerful starting point, but it may not be perfect. The user (a travel coordinator) often needs to make small adjustments, such as removing a specific activity, adding a new one, or changing the focus of a day. The current system requires starting the entire generation process over, which is inefficient and risks having the AI re-introduce elements the user wanted to remove. This feature solves that problem by creating a short-term memory for the AI within a single user session.

## 3. Goals & Objectives

- **Primary Goal:** To improve the efficiency and user satisfaction of the itinerary generation process by allowing for rapid, in-session refinement.
- **Objective 1:** Enable users to make corrections and additions to a generated itinerary without starting from scratch.
- **Objective 2:** Ensure the AI honors all previous instructions within a revision session by maintaining full conversational context.
- **Objective 3:** Implement this feature without requiring any persistent storage or database, adhering to the project's stateless backend architecture.

## 4. User Story

- **As a** Travel Coordinator,
- **I want to** provide simple, text-based feedback on a generated itinerary and receive an updated version that incorporates my changes,
- **so that** I can quickly refine the travel plan to perfection without losing my previous edits or starting over.

## 5. Functional & UI Requirements

### 5.1. Conversation History (Client-Side)
- An in-memory array of messages (`ConversationHistory`) shall be maintained in the client-side JavaScript.
- Each message object will contain a `role` (`system`, `user`, `assistant`) and `content`.
- The entire `ConversationHistory` array must be sent to the backend with every revision request.

### 5.2. Revision Workflow
1.  **Initial Generation:** The user fills out the standard itinerary form (Destination, Dates, etc.) and submits it. The backend generates the first itinerary.
2.  **Entering Revision Mode:** Immediately after the first itinerary is displayed, the UI shall change:
    - A new multi-line text input field, labeled **"Refine Itinerary"**, will appear.
    - The primary submit button will be relabeled to **"Update Itinerary"**.
    - The "Destination" and "Dates" form fields will be **disabled**.
    - The "Group Size" and "Details" fields will remain **enabled** for modification.
3.  **Submitting a Revision:**
    - The user types instructions into the "Refine Itinerary" field (e.g., "Remove the museum visit on Tuesday and add a walking tour instead").
    - Upon clicking "Update Itinerary", the client adds the instruction as a new `user` message to the `ConversationHistory` and sends the entire array to the backend.
4.  **Displaying the Result:**
    - The backend processes the full history and returns a new, revised itinerary.
    - The new itinerary **completely replaces** the previous version on the screen.
    - The "Refine Itinerary" input field is **cleared**, ready for the next instruction.

## 6. Technical Requirements

- **Backend (`/api/travel.js`):**
    - The endpoint must be updated to handle two request types: an initial generation request (from form data) and a revision request (containing a `ConversationHistory` array).
    - For revisions, the endpoint will act as a proxy, passing the received conversation history directly to the OpenAI API.
- **Frontend (`travel.html`):**
    - The client-side JavaScript is responsible for all session state management, including creating, holding, and updating the `ConversationHistory` array.
- **Statelessness:** The feature must be implemented without any server-side persistence, in alignment with the project's core architecture.

## 7. Out of Scope for MVP

The following related features are explicitly deferred and will be captured in the project backlog:

- **UI Display of Conversation History:** The UI will not show a visible log of past revision instructions.
- **Token Limit Warnings:** No client-side warnings will be implemented to handle approaching the LLM context window limit.
- **Visual Diff of Changes:** The itinerary will be fully replaced on each revision; a "diff" view highlighting changes will not be implemented.
