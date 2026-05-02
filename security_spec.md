# Security Specification - Veltrix

## 1. Data Invariants
- **User Profile**: `uid` must match the document ID and the authenticated user's ID.
- **Expenses**: `userId` field must match the authenticated user's ID.
- **Insights**: `userId` field must match the authenticated user's ID.
- **Subscriptions**: `userId` field must match the authenticated user's ID.
- **Path Integrity**: Path variables `{userId}` must match `request.auth.uid` for all operations.

## 2. The "Dirty Dozen" Payloads (Deny Cases)

### Identity Spoofing
1. **User A creating a profile for User B**:
   - Path: `/users/USER_B`
   - Payload: `{ "uid": "USER_B", "email": "evil@attacker.com" }`
   - Actor: `USER_A`
2. **User A logging an expense for User B**:
   - Path: `/users/USER_B/expenses/EXP_1`
   - Payload: `{ "userId": "USER_B", "amount": 100 }`
   - Actor: `USER_A`
3. **User A reading User B's insights**:
   - Path: `/users/USER_B/insights/INS_1`
   - Actor: `USER_A`

### Integrity Violations
4. **Invalid Amount Type**:
   - Payload: `{ "userId": "USER_A", "amount": "one hundred" }`
5. **Missing Required Fields**:
   - Payload: `{ "userId": "USER_A", "category": "Food" }` (Missing amount)
6. **Negative Amount**:
   - Payload: `{ "userId": "USER_A", "amount": -50 }`

### State Shortcutting (Privilege Escalation)
7. **Modifying Immutable Fields**:
   - Update `userId` on an existing expense.
8. **Shadow Field Injection**:
   - Payload: `{ "userId": "USER_A", "amount": 100, "isAdmin": true }` on a user doc.

### Resource Exhaustion
9. **Extreme String Sizes**:
   - Description with 1MB of text.
10. **ID Poisoning**:
    - Querying with a custom, excessively long document ID.

### Relational Sync
11. **Orphaned Writes**:
    - Creating an expense with a non-matching `userId` in the document body vs the path.

### PII Leakage
12. **Blanket List Queries**:
    - Attempting to list all users' profiles.

## 3. Test Runner Recommendation
Use `@firebase/rules-unit-testing` to verify these.
