You are designing a "revision" feature for the travel itinerary application, that will allow the travel coordinator to iteratively refine a generated travel itinerary using GPT-4o. The key requirement is to **preserve the full context of all user instructions and LLM responses across multiple revisions**, so that the LLM does not re-introduce items that the user previously asked to remove or change.

**Constraints:**
- There is **no persistent storage**; all state must be maintained within the current conversation/session.
- The revision process is iterative: the user provides instructions, GPT-4o generates a new version, and this cycle repeats.
- GPT-4o should always have access to the entire history of instructions and responses for each revision.

**Design Requirements:**
1. **Conversation History:**  
   - Maintain an in-memory array of messages on the client-side, each with a `role` (`system`, `user`, `assistant`), and `content`.
   - On each revision, append the new user instruction and the LLM's response to this array.
   - For every new revision, send the **entire conversation history** (all messages) to the backend.

2. **System Prompt:**  
   - The initial `user` message in the conversation array will be constructed from the data in the main input form (destination, dates, traveler details, etc.).
   - The `system` message that defines the itinerary generation guidelines and constraints will be the first message in the array.

3. **Revision Flow & UI:**
   - **Initial Generation:** The user fills out the main form (Destination, Dates, Group Size, Details) and clicks the initial submit button.
   - **Entering Revision Mode:** After the first itinerary is generated:
     - A multi-line text input field with the label "Refine Itinerary" appears on the UI.
     - The main submit button's text changes to "Update Itinerary".
     - The "Destination" and "Dates" input fields become disabled.
     - The "Group Size" and "Details" fields remain enabled for changes.
   - **Subsequent Revisions:**
     - The user types new instructions into the "Refine Itinerary" field and clicks "Update Itinerary".
     - The backend receives the full conversation history to generate a new itinerary.
     - The newly generated itinerary completely replaces the old one on the screen.
     - The "Refine Itinerary" input field is cleared after submission.

4. **No Persistence:**  
   - All state (conversation history) must be kept in memory on the client and passed with each API call.
   - When the session ends, the conversation history is lost.

**Deliverables:**
- Describe the data structures and flow for managing conversation history in-memory.
- Outline how to format and send the conversation history to GPT-4o for each revision.
- (Optional) Provide pseudocode or a minimal implementation sketch.

---

### Out of Scope for MVP

The following features were considered but have been moved to the backlog and are not required for the initial implementation:

- **UI Display of Conversation History:** The UI will not display a log of the user's past revision instructions.
- **Token Limit Warnings:** The UI will not include warnings or logic to handle approaching the LLM's context window limit.
- **Visual Diff of Changes:** The new itinerary will replace the old one entirely, without showing a "diff" of the changes.

---

### Example Data Structures (TypeScript)

```typescript
type Role = 'system' | 'user' | 'assistant';

interface Message {
  role: Role;
  content: string;
}

type ConversationHistory = Message[];
```

---

### Example Conversation Flow

1. **Start Session:**  
   - The conversation is initialized with a `system` message (defining GPT-4o’s role) and a `user` message constructed from the initial form submission.

2. **Initial Generation:**  
   - Send the full conversation history (system + user messages) to the backend API.
   - Store the assistant’s response (the generated itinerary) as an `assistant` message in the client-side history.

3. **Revision:**  
   - User provides feedback in the "Refine Itinerary" input (e.g., "Add more time in Kyoto and remove Osaka.").
   - Append this as a new `user` message to the history.
   - Send the entire conversation history to the backend API.
   - Store the new assistant response, replacing the previous one.

---

### Formatting for GPT-4o

The backend will receive and pass the conversation as an array of messages in OpenAI’s chat format:

```json
[
  { "role": "system", "content": "You are a travel planner..." },
  { "role": "user", "content": "I want a 5-day trip to Japan..." },
  { "role": "assistant", "content": "[itinerary]" },
  { "role": "user", "content": "Add more time in Kyoto..." }
]
```

---

### Minimal Implementation Sketch (Client-Side)

```typescript
type Role = 'system' | 'user' | 'assistant';

interface Message {
  role: Role;
  content: string;
}

// This array is managed in the client-side JavaScript
let conversation: Message[] = []; 

// 1. On initial form submission
function startConversation(form_data) {
    conversation = [
        {
            role: 'system',
            content: 'You are a travel planner. Generate detailed, feasible itineraries.'
        },
        {
            role: 'user',
            content: `Generate a travel plan based on these details: ${JSON.stringify(form_data)}`
        }
    ];
    // ... send `conversation` to the backend
}

// 2. After receiving a response from the backend
function addAssistantResponse(response: string) {
  conversation.push({
    role: 'assistant',
    content: response,
  });
}

// 3. On submitting a revision
function addUserInstruction(instruction: string) {
  conversation.push({
    role: 'user',
    content: instruction,
  });
  // ... send `conversation` to the backend
}

// The backend API receives the `conversation` array and passes it to OpenAI.
```

---

If any requirements are unclear (e.g., expected API integration details), please ask for clarification before proceeding.
