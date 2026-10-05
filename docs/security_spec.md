# Security Specification for Firestore Rules

## Data Invariants
1. A user can only read, write, or list documents within their own subcollections (`/users/{userId}/...`).
2. Documents under `/users/{userId}` must strictly belong to `request.auth.uid`.
3. Document fields must obey size constraints and type validation to prevent resource exhaustion attacks.

## The "Dirty Dozen" Payloads (Threat Scenarios)
1. Impersonation attack: User A trying to write to `/users/userB/hats_rituals/123`.
2. Unauthenticated read: Anonymous user trying to list `/users/userA/hats_rituals`.
3. Shadow field injection: Adding unexpected high-privilege keys during document creation.
4. Oversized payload attack: Sending a 2MB string in the `azotea` field to cause storage exhaustion.
5. Invalid path variable attack: Using `../../../` or special characters in document IDs.
6. Spoofed owner ID: Setting `userId` in document body to another user's UID while logged in.
7. Mutation of immutable fields: Overwriting `createdAt` during an update.
8. PII leak: Public list query across all `/users` collections.
9. Malformed date type injection: Sending boolean instead of timestamp or string for `createdAt`.
10. Unverified write attack: Trying to perform a write with an unverified email token when verification is required.
11. Orphaned document injection: Creating a ritual under a non-existent parent path or invalid user.
12. Terminal state override: Mutating locked or completed ritual records without ownership.

## Verification
All rules are tested and guarded using strict path variable checks `isValidId(userId)`, owner checking `request.auth.uid == userId`, and explicit field type & length validations.
