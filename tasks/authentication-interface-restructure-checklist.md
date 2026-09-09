# Authentication Interface Restructure Checklist

## Experience and layout

- [x] Replace the single-card login layout with a responsive two-column authentication experience.
- [x] Give student and staff sign-in a distinct but consistent contextual introduction.
- [x] Establish a clear reading order: product context, purpose, sign-in form, then support guidance.
- [x] Keep the form panel at a focused, readable width and preserve the existing application theme.
- [x] Collapse the layout gracefully to a compact single column on phones.

## Forms and accessibility

- [x] Retain existing sign-in, account-setup, validation, and routing behaviour.
- [x] Improve field labels, autocomplete hints, helper text, and PIN descriptions.
- [x] Use semantic headings and `aria-describedby` for PIN guidance.
- [x] Make the primary action more specific to the user journey.
- [x] Keep touch targets at least 48px high for form controls and the main action.

## Quality checks

- [x] Isolate the authentication presentation in a dedicated stylesheet.
- [x] Verify both sign-in routes against the served application shell and responsive desktop, tablet, and phone layout rules.
- [x] Validate student login, staff login, and first-administrator setup paths against their preserved form handlers and validation branches.
- [x] Confirm keyboard focus support, labelled controls, autocomplete metadata, touch-target sizing, and theme-token contrast through implementation audit.
