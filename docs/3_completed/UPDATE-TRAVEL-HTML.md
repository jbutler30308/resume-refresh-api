# Plan: Update travel.html to Match travel.js Input Fields

**All steps completed. travel.html now matches travel.js, with correct input fields, output area, validation, and UI/UX improvements.**

## 1. Remove Resume-Specific Fields
- Remove all fields related to resume optimization (job title, industry, job description, resume text, etc.).

## 2. Add Travel-Specific Input Fields
- destination (string, required, non-empty)
- start date (string, required, non-empty)
- end date (string, required, non-empty)
- group size (number, required)

## 3. Update API Endpoint
- Change fetch endpoint to `/api/travel`.

## 4. Update Validation
- Ensure all string fields are non-empty.
- Ensure group size is a number and required.

## 5. Update Output Area
- Display only the `travelPlan` property from the API response.
- Ignore the `verification` property.

## 6. Update UI/UX
- Update labels, placeholders, and help text to reflect travel planning.
- Update loading and error messages to reference travel planning.

## 7. Test
- Ensure form submits correct data and displays the travel plan as expected.

---

No ambiguities remain. Ready to proceed with implementation.