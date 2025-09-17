# data flow diagrams

## Travel Itinerary

flowchart TD
    User["User (Web Form)"]
    Frontend["Frontend JS (travel.html)"]
    API["API Route (/api/travel.js)"]
    OpenAI["OpenAI API"]
    Validator["Itinerary Validator"]
    User -- "Enter travel details" --> Frontend
    Frontend -- "POST /api/travel\n(conversation object)" --> API
    API -- "Builds prompt,\nCalls OpenAI" --> OpenAI
    OpenAI -- "Generated itinerary" --> API
    API -- "Validate & structure plan" --> Validator
    Validator -- "Verification result" --> API
    API -- "Travel plan & verification" --> Frontend
    Frontend -- "Display plan,\nAllow revision" --> User

## Resume Refresh

flowchart TD
    User["User (Web Form/Client)"]
    Frontend["Frontend JS"]
    API["API Route (/api/refresh-resume.js)"]
    OpenAI["OpenAI API"]
    User -- "Submit resume & options" --> Frontend
    Frontend -- "POST /api/refresh-resume" --> API
    API -- "Builds prompt,\nCalls OpenAI" --> OpenAI
    OpenAI -- "Rewritten resume" --> API
    API -- "Return updated resume" --> Frontend
    Frontend -- "Display updated resume" --> User    