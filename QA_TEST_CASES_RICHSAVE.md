# RichSave Mobile Application - Comprehensive QA Test Suite

**Project:** RichSave Mobile Application
**Version:** 1.0.0
**Document Version:** 1.0
**Last Updated:** 2026-04-04
**Prepared By:** QA Team
**Status:** Ready for Testing

---

## Table of Contents

1. [Authentication Test Cases](#1-authentication-test-cases)
   - 1.1 User Registration
   - 1.2 User Login
   - 1.3 Forgot Password / Password Reset
   - 1.4 User Logout
2. [Deal Search Test Cases](#2-deal-search-test-cases)
   - 2.1 Keyword Search
   - 2.2 Filter Functionality
   - 2.3 Autocomplete
3. [Location-Based Deals Test Cases](#3-location-based-deals-test-cases)
4. [Favorites System Test Cases](#4-favorites-system-test-cases)
5. [Savings Tracker Test Cases](#5-savings-tracker-test-cases)
6. [Security Test Cases](#6-security-test-cases)

---

## 1. AUTHENTICATION TEST CASES

### 1.1 USER REGISTRATION

| Test Case ID | Feature | Scenario | Preconditions | Test Steps | Expected Result | Actual Result | Severity |
|--------------|---------|----------|----------------|------------|-----------------|---------------|----------|
| **AUTH-REG-001** | Registration | Register with valid data | App is installed, user on registration screen | 1. Open app<br>2. Tap "Sign Up"<br>3. Enter valid name: "Test User"<br>4. Enter valid email: "test@example.com"<br>5. Enter password: "Test@123"<br>6. Confirm password: "Test@123"<br>7. Accept Terms & Conditions<br>8. Tap "Create Account" | User successfully registered, redirected to deals screen, success message displayed, confirmation email sent | | Low |
| **AUTH-REG-002** | Registration | Register with existing email | User with email "existing@test.com" already registered | 1. Navigate to Sign Up screen<br>2. Enter name: "New User"<br>3. Enter email: "existing@test.com"<br>4. Enter password: "Test@123"<br>5. Confirm password: "Test@123"<br>6. Tap "Create Account" | Error message "Email already registered" displayed, user remains on registration screen | | Medium |
| **AUTH-REG-003** | Registration | Register with mismatched passwords | User on registration screen | 1. Enter name: "Test User"<br>2. Enter email: "test@example.com"<br>3. Enter password: "Test@123"<br>4. Enter confirm password: "Test@456"<br>5. Tap "Create Account" | Error "Passwords do not match" displayed, registration blocked | | Medium |
| **AUTH-REG-004** | Registration | Register with short password (less than 6 chars) | User on registration screen | 1. Enter valid name and email<br>2. Enter password: "Test1"<br>3. Confirm password: "Test1"<br>4. Tap "Create Account" | Error "Password must be at least 6 characters" displayed | | Medium |
| **AUTH-REG-005** | Registration | Register with invalid email format | User on registration screen | 1. Enter valid name and password<br>2. Enter email: "invalidemail"<br>3. Tap "Create Account" | Error "Please enter a valid email address" displayed | | Medium |
| **AUTH-REG-006** | Registration | Register with empty mandatory fields | User on registration screen | 1. Leave name field empty<br>2. Enter valid email and password<br>3. Tap "Create Account" | Error "All fields are required" displayed, submit button disabled | | Medium |
| **AUTH-REG-007** | Registration | Register without accepting Terms & Conditions | User on registration screen | 1. Fill all fields with valid data<br>2. Do NOT check Terms & Conditions checkbox<br>3. Tap "Create Account" | Registration blocked, error "Please accept Terms & Conditions" displayed | | Low |
| **AUTH-REG-008** | Registration | Register with special characters in name | User on registration screen | 1. Enter name: "Test User!@#$%"<br>2. Enter valid email and password<br>3. Tap "Create Account" | Registration successful OR special characters stripped/validated appropriately | | Low |
| **AUTH-REG-009** | Registration | Register with very long email (>254 chars) | User on registration screen | 1. Enter name: "Test User"<br>2. Enter email with 255+ characters<br>3. Enter valid password<br>4. Tap "Create Account" | Error "Email is too long" displayed | | Low |
| **AUTH-REG-010** | Registration | Register with SQL injection in email field | User on registration screen | 1. Enter name: "Test User"<br>2. Enter email: "test'; DROP TABLE users;--@example.com"<br>3. Enter valid password<br>4. Tap "Create Account" | Input sanitized, registration prevented with error, database intact | | Critical |
| **AUTH-REG-011** | Registration | Register with leading/trailing spaces in email | User on registration screen | 1. Enter name: "Test User"<br>2. Enter email: "  test@example.com  "<br>3. Enter valid password<br>4. Tap "Create Account" | Email trimmed, registration successful with clean email | | Low |
| **AUTH-REG-012** | Registration | Register during network offline | Device in airplane mode | 1. Enable airplane mode<br>2. Fill all valid registration data<br>3. Tap "Create Account" | Error "No internet connection" displayed, graceful handling | | Medium |
| **AUTH-REG-013** | Registration | Register with password containing only numbers | User on registration screen | 1. Enter valid name and email<br>2. Enter password: "123456"<br>3. Confirm password: "123456"<br>4. Tap "Create Account" | Registration successful (if only length requirement) OR error "Password must contain letters" (if complexity required) | | Low |
| **AUTH-REG-014** | Registration | Tap register button multiple times rapidly | User on registration screen with valid data | 1. Fill all valid data<br>2. Tap "Create Account" button 5 times rapidly | Only one registration request processed, no duplicate accounts created | | Medium |
| **AUTH-REG-015** | Registration | Register then immediately try to register same email | Just completed registration with test@example.com | 1. Complete registration successfully<br>2. Logout<br>3. Attempt to register again with same email | Error "Email already registered" displayed | | Medium |

### 1.2 USER LOGIN

| Test Case ID | Feature | Scenario | Preconditions | Test Steps | Expected Result | Actual Result | Severity |
|--------------|---------|----------|----------------|------------|-----------------|---------------|----------|
| **AUTH-LOG-001** | Login | Login with valid credentials | User registered with email: test@example.com, password: Test@123 | 1. Open app<br>2. Tap "Login"<br>3. Enter email: "test@example.com"<br>4. Enter password: "Test@123"<br>5. Tap "Sign In" | Login successful, redirected to deals screen, user name displayed in navigation | | High |
| **AUTH-LOG-002** | Login | Login with invalid email | User on login screen | 1. Enter email: "nonexistent@example.com"<br>2. Enter valid password<br>3. Tap "Sign In" | Error "Invalid email or password" displayed (generic message) | | High |
| **AUTH-LOG-003** | Login | Login with invalid password | User registered with test@example.com | 1. Enter valid email: "test@example.com"<br>2. Enter wrong password: "Wrong@123"<br>3. Tap "Sign In" | Error "Invalid email or password" displayed, no indication which field is wrong | | High |
| **AUTH-LOG-004** | Login | Login with empty fields | User on login screen | 1. Leave email and password empty<br>2. Tap "Sign In" | Error "Email and password are required" displayed, button disabled | | Medium |
| **AUTH-LOG-005** | Login | Login with empty password only | User on login screen | 1. Enter valid email<br>2. Leave password empty<br>3. Tap "Sign In" | Error "Password is required" displayed | | Medium |
| **AUTH-LOG-006** | Login | Login with case-sensitive email | User registered with Test@Example.com | 1. Enter email: "test@example.com" (lowercase)<br>2. Enter valid password<br>3. Tap "Sign In" | Login successful (email case-insensitive) OR error if case-sensitive | | Low |
| **AUTH-LOG-007** | Login | Login with extra spaces in credentials | User registered with test@example.com | 1. Enter email: "  test@example.com  "<br>2. Enter password: "  Test@123  "<br>3. Tap "Sign In" | Credentials trimmed, login successful | | Low |
| **AUTH-LOG-008** | Login | Remember Me functionality | User on login screen | 1. Enter valid credentials<br>2. Check "Remember Me" checkbox<br>3. Tap "Sign In"<br>4. Close app<br>5. Reopen app | User remains logged in, no need to re-enter credentials | | Medium |
| **AUTH-LOG-009** | Login | Login without Remember Me | User on login screen | 1. Enter valid credentials<br>2. Don't check "Remember Me"<br>3. Tap "Sign In"<br>4. Close app completely<br>5. Reopen app | User logged out, must login again | | Low |
| **AUTH-LOG-010** | Login | Attempt login 5 times with wrong password | User registered | 1. Enter valid email<br>2. Enter wrong password<br>3. Tap "Sign In"<br>4. Repeat steps 2-3 five times | Account temporarily locked after 5th attempt OR error "Too many attempts, try again later" | | High |
| **AUTH-LOG-011** | Login | Show/Hide password toggle | User on login screen | 1. Enter password<br>2. Tap eye icon to show password<br>3. Tap eye icon again to hide | Password toggles between visible and masked (••••••) | | Low |
| **AUTH-LOG-012** | Login | Login during network offline | Device in airplane mode | 1. Enable airplane mode<br>2. Enter valid credentials<br>3. Tap "Sign In" | Error "No internet connection" displayed | | Medium |
| **AUTH-LOG-013** | Login | Login with unverified email (if verification required) | User registered but email not verified | 1. Enter credentials for unverified account<br>2. Tap "Sign In" | Error "Please verify your email first" OR login successful with warning | | Medium |
| **AUTH-LOG-014** | Login | Enter credentials, then rotate device | User on login screen | 1. Enter email and password<br>2. Rotate device from portrait to landscape | Credentials preserved, layout adjusts properly | | Low |
| **AUTH-LOG-015** | Login | Login with email autocomplete from keyboard | User previously logged in | 1. Tap email field<br>2. Select suggested email from keyboard<br>3. Enter password<br>4. Tap "Sign In" | Email populated correctly, login successful | | Low |
| **AUTH-LOG-016** | Login | SQL injection in password field | User on login screen | 1. Enter valid email<br>2. Enter password: "' OR '1'='1<br>3. Tap "Sign In" | Login failed, error displayed, no SQL injection | | Critical |
| **AUTH-LOG-017** | Login | Login with deactivated account | Account marked as deactivated in database | 1. Enter credentials for deactivated account<br>2. Tap "Sign In" | Error "Account has been deactivated" displayed | | Medium |
| **AUTH-LOG-018** | Login | Press back button on login screen | User on login screen | 1. Press device back button | App minimizes OR shows confirmation dialog "Exit app?" | | Low |
| **AUTH-LOG-019** | Login | Login timeout after long inactivity | User logged in, inactive for 30 days | 1. Open app after 30 days of inactivity<br>2. Try to access any feature | Session expired, redirected to login with message "Session expired" | | Medium |
| **AUTH-LOG-020** | Login | Concurrent login from two devices | User logged in on Device A | 1. Login with same credentials on Device B<br>2. Try to perform action on Device A | Either: both allowed OR Device A logged out with notification "New login detected" | | Medium |

### 1.3 FORGOT PASSWORD / PASSWORD RESET

| Test Case ID | Feature | Scenario | Preconditions | Test Steps | Expected Result | Actual Result | Severity |
|--------------|---------|----------|----------------|------------|-----------------|---------------|----------|
| **AUTH-RST-001** | Forgot Password | Request OTP with valid email | User registered with test@example.com | 1. Navigate to Login screen<br>2. Tap "Forgot Password"<br>3. Enter email: "test@example.com"<br>4. Tap "Send OTP" | Success message "OTP sent to your email", navigated to OTP verification screen | | High |
| **AUTH-RST-002** | Forgot Password | Request OTP with unregistered email | User on forgot password screen | 1. Enter email: "notregistered@example.com"<br>2. Tap "Send OTP" | Error "Email not found" displayed (security: don't reveal if email exists) OR success message (security: prevent enumeration) | | Medium |
| **AUTH-RST-003** | Forgot Password | Request OTP with empty email | User on forgot password screen | 1. Leave email field empty<br>2. Tap "Send OTP" | Error "Email is required" displayed, button disabled | | Medium |
| **AUTH-RST-004** | Forgot Password | Request OTP with invalid email format | User on forgot password screen | 1. Enter email: "invalidemail"<br>2. Tap "Send OTP" | Error "Invalid email format" displayed | | Medium |
| **AUTH-RST-005** | Forgot Password | Verify OTP with correct code | OTP sent to email | 1. Enter correct 6-digit OTP<br>2. Tap "Verify OTP" | OTP verified, navigated to reset password screen | | High |
| **AUTH-RST-006** | Forgot Password | Verify OTP with incorrect code | OTP sent to email | 1. Enter wrong 6-digit code<br>2. Tap "Verify OTP" | Error "Invalid OTP" displayed | | High |
| **AUTH-RST-007** | Forgot Password | Verify OTP with expired code | OTP sent and 15 minutes elapsed | 1. Wait 15+ minutes<br>2. Enter correct OTP<br>3. Tap "Verify OTP" | Error "OTP has expired" displayed, option to request new OTP | | High |
| **AUTH-RST-008** | Forgot Password | Verify OTP with incomplete code | User on OTP verification screen | 1. Enter only 4 digits<br>2. Tap "Verify OTP" | Verify button disabled OR error "Please enter complete 6-digit code" | | Medium |
| **AUTH-RST-009** | Forgot Password | Auto-focus next OTP field | User on OTP verification screen | 1. Enter digit in first field | Focus automatically moves to next field | | Low |
| **AUTH-RST-010** | Forgot Password | Backspace in OTP fields | User on OTP verification screen | 1. Fill first 3 fields<br>2. Press backspace in 3rd field | Cursor moves to previous field, digit deleted | | Low |
| **AUTH-RST-011** | Forgot Password | Request new OTP before current expires | Valid OTP already sent | 1. On OTP screen, tap "Resend OTP" within 15 minutes | New OTP sent, old OTP invalidated, timer resets | | Medium |
| **AUTH-RST-012** | Forgot Password | Reset password with valid new password | OTP verified | 1. Enter new password: "NewTest@123"<br>2. Confirm: "NewTest@123"<br>3. Tap "Reset Password" | Success message "Password reset successfully", redirected to login, can login with new password | | High |
| **AUTH-RST-013** | Forgot Password | Reset password with mismatched passwords | OTP verified | 1. Enter new password: "NewTest@123"<br>2. Confirm: "Different@123"<br>3. Tap "Reset Password" | Error "Passwords do not match" displayed | | Medium |
| **AUTH-RST-014** | Forgot Password | Reset password with weak password | OTP verified | 1. Enter new password: "123456"<br>2. Confirm: "123456"<br>3. Tap "Reset Password" | Error "Password must be at least 6 characters" OR success if only length required | | Medium |
| **AUTH-RST-015** | Forgot Password | Reset password then login with old password | Password reset successfully | 1. Navigate to login<br>2. Enter email<br>3. Enter OLD password | Login fails with error "Invalid credentials" | | High |
| **AUTH-RST-016** | Forgot Password | Reset password during offline mode | Device in airplane mode | 1. Complete OTP verification online<br>2. Enable airplane mode<br>3. Enter new password<br>4. Tap "Reset Password" | Error "No internet connection" displayed | | Medium |
| **AUTH-RST-017** | Forgot Password | Use same OTP twice | OTP verified once | 1. Verify OTP, don't reset password<br>2. Try to verify same OTP again | Error "OTP already used" displayed | | High |
| **AUTH-RST-018** | Forgot Password | Request OTP 5 times in 1 minute | User on forgot password screen | 1. Enter valid email<br>2. Tap "Send OTP" 5 times rapidly | Error "Too many requests, please wait" displayed, rate limiting enforced | | High |
| **AUTH-RST-019** | Forgot Password | Paste OTP from clipboard | User on OTP screen with OTP in clipboard | 1. Long press in first OTP field<br>2. Select Paste | All 6 digits populated if clipboard has 6 digits | | Low |
| **AUTH-RST-020** | Forgot Password | Cancel password reset flow | User on any password reset screen | 1. Tap "Back" or "Cancel" button | Returns to login screen, no changes made | | Low |

### 1.4 USER LOGOUT

| Test Case ID | Feature | Scenario | Preconditions | Test Steps | Expected Result | Actual Result | Severity |
|--------------|---------|----------|----------------|------------|-----------------|---------------|----------|
| **AUTH-LOGO-001** | Logout | Logout from navigation menu | User logged in | 1. Tap user avatar/menu<br>2. Tap "Logout" button<br>3. Confirm logout if prompted | User logged out, redirected to login screen, token cleared | | High |
| **AUTH-LOGO-002** | Logout | Logout from profile settings | User logged in, on profile screen | 1. Navigate to Profile<br>2. Scroll to bottom<br>3. Tap "Logout" button<br>4. Confirm | User logged out, returned to home/login screen | | High |
| **AUTH-LOGO-003** | Logout | Cancel logout confirmation | User logged in, logout confirmation shown | 1. Tap "Logout"<br>2. Tap "Cancel" on confirmation dialog | Dialog dismissed, user remains logged in | | Low |
| **AUTH-LOGO-004** | Logout | Try to access protected route after logout | User just logged out | 1. Complete logout<br>2. Press back button<br>3. Try to access profile/favorites | Redirected to login screen with message "Please login to continue" | | High |
| **AUTH-LOGO-005** | Logout | Logout during network offline | User logged in, device offline | 1. Enable airplane mode<br>2. Tap "Logout" | Local session cleared, user logged out (cached credentials removed) | | Medium |
| **AUTH-LOGO-006** | Logout | Logout then try to use features without login | User just logged out | 1. Complete logout<br>2. Try to add favorite deal<br>3. Try to view savings | All actions blocked, redirected to login with appropriate messages | | High |
| **AUTH-LOGO-007** | Logout | Session timeout logout | User logged in, token expires | 1. Wait for token to expire (7 days)<br>2. Try to perform any action | Automatically logged out, redirected to login with "Session expired" message | | Medium |
| **AUTH-LOGO-008** | Logout | Logout from one device, check another device | User logged in on two devices | 1. Logout from Device A<br>2. Try to use app on Device B | Either: Device B also logged out OR Device B remains active (depending on implementation) | | Medium |
| **AUTH-LOGO-009** | Logout | Tap logout multiple times rapidly | User logged in | 1. Tap "Logout" button 3 times rapidly | Only one logout processed, no errors displayed | | Low |
| **AUTH-LOGO-010** | Logout | Close app without logout, then reopen | User logged in | 1. Press home button (background app)<br>2. Reopen app | User still logged in (session persisted) | | Medium |

---

## 2. DEAL SEARCH TEST CASES

### 2.1 KEYWORD SEARCH

| Test Case ID | Feature | Scenario | Preconditions | Test Steps | Expected Result | Actual Result | Severity |
|--------------|---------|----------|----------------|------------|-----------------|---------------|----------|
| **SRCH-KEY-001** | Keyword Search | Search with valid keyword | User logged in, deals available | 1. Tap search bar<br>2. Enter keyword: "pizza"<br>3. Tap search or press enter | Results display all deals containing "pizza" in title, description, or store name | | High |
| **SRCH-KEY-002** | Keyword Search | Search with no results | User logged in | 1. Enter keyword: "xyznonexistentdeal123"<br>2. Tap search | Message "No deals found" displayed, option to browse categories | | Medium |
| **SRCH-KEY-003** | Keyword Search | Search with empty string | User logged in | 1. Leave search bar empty<br>2. Tap search | Either: all deals displayed OR error "Please enter a search term" | | Medium |
| **SRCH-KEY-004** | Keyword Search | Search with special characters | User logged in | 1. Enter keyword: "burger!@#$%"<br>2. Tap search | Special characters handled, results shown OR sanitized search | | Low |
| **SRCH-KEY-005** | Keyword Search | Case-insensitive search | Deals with "Pizza" exist | 1. Enter: "pizza"<br>2. Then enter: "PIZZA"<br>3. Then enter: "PiZzA" | Same results displayed for all variations | | Medium |
| **SRCH-KEY-006** | Keyword Search | Search with partial match | Deal titled "Domino's Pizza 50% Off" exists | 1. Enter: "Domino"<br>2. Tap search | Deal with "Domino's Pizza" appears in results | | Medium |
| **SRCH-KEY-007** | Keyword Search | Search with Thai characters | Thai user searching | 1. Enter: "อาหาร"<br>2. Tap search | Results with Thai text displayed correctly | | Medium |
| **SRCH-KEY-008** | Keyword Search | Search with numbers | Deals exist with "50" in title | 1. Enter: "50"<br>2. Tap search | Deals containing "50" displayed (e.g., "50% Off") | | Low |
| **SRCH-KEY-009** | Keyword Search | Search with very long query (>100 chars) | User logged in | 1. Enter 100+ character search term<br>2. Tap search | Either: truncates to max length OR error "Search too long" | | Low |
| **SRCH-KEY-010** | Keyword Search | SQL injection in search | User logged in | 1. Enter: "pizza'; DROP TABLE deals;--"<br>2. Tap search | Input sanitized, safe search performed, database intact | | Critical |
| **SRCH-KEY-011** | Keyword Search | XSS attempt in search | User logged in | 1. Enter: "<script>alert('XSS')</script>"<br>2. Tap search | Input sanitized, no script executed | | Critical |
| **SRCH-KEY-012** | Keyword Search | Search with leading/trailing spaces | User logged in | 1. Enter: "  pizza  "<br>2. Tap search | Spaces trimmed, search works correctly | | Low |
| **SRCH-KEY-013** | Keyword Search | Multiple word search | Deals available | 1. Enter: "chicken burger"<br>2. Tap search | Results with both "chicken" AND "burger" shown | | Medium |
| **SRCH-KEY-014** | Keyword Search | Clear search results | Search results displayed | 1. Perform search<br>2. Tap clear (X) button | Search cleared, all deals OR previous state restored | | Low |
| **SRCH-KEY-015** | Keyword Search | Search during offline mode | User logged in, device offline | 1. Enable airplane mode<br>2. Enter search term<br>3. Tap search | Error "No internet connection" OR cached results if available | | Medium |
| **SRCH-KEY-016** | Keyword Search | Search results pagination | Many deals match search | 1. Search for common term<br>2. Scroll to bottom | Load more triggers, additional results appear | | Medium |
| **SRCH-KEY-017** | Keyword Search | Tap search result | Search results displayed | 1. Tap on any deal in results | Deal detail page opens with full information | | High |
| **SRCH-KEY-018** | Keyword Search | Recent search history | User performed previous searches | 1. Tap search bar | Recent searches displayed as suggestions | | Low |
| **SRCH-KEY-019** | Keyword Search | Clear search history | Search history exists | 1. Tap search bar<br>2. Tap "Clear History" | All recent searches removed | | Low |
| **SRCH-KEY-020** | Keyword Search | Search results count | Search completed | 1. Perform search | Results count displayed (e.g., "15 deals found") | | Low |

### 2.2 FILTER FUNCTIONALITY

| Test Case ID | Feature | Scenario | Preconditions | Test Steps | Expected Result | Actual Result | Severity |
|--------------|---------|----------|----------------|------------|-----------------|---------------|----------|
| **SRCH-FIL-001** | Filter | Filter by category | User logged in, deals available | 1. Tap "Filter" icon<br>2. Select "Food & Dining"<br>3. Tap "Apply" | Only deals in "Food & Dining" category displayed | | High |
| **SRCH-FIL-002** | Filter | Filter by multiple categories | User logged in | 1. Open filters<br>2. Select "Food & Dining"<br>3. Select "Shopping"<br>4. Tap "Apply" | Deals from both categories displayed | | Medium |
| **SRCH-FIL-003** | Filter | Filter by price range | User logged in | 1. Open filters<br>2. Set price range: 100-500 THB<br>3. Tap "Apply" | Only deals within price range shown | | Medium |
| **SRCH-FIL-004** | Filter | Filter by discount percentage | User logged in | 1. Open filters<br>2. Select "50% or more"<br>3. Tap "Apply" | Only deals with 50%+ discount displayed | | Medium |
| **SRCH-FIL-005** | Filter | Filter by distance | User logged in, location enabled | 1. Open filters<br>2. Select "Within 5 km"<br>3. Tap "Apply" | Only deals within 5km displayed | | Medium |
| **SRCH-FIL-006** | Filter | Filter by expiration date | User logged in | 1. Open filters<br>2. Select "Expiring soon"<br>3. Tap "Apply" | Deals expiring soon shown first | | Medium |
| **SRCH-FIL-007** | Filter | Combine multiple filters | User logged in | 1. Set category: "Food"<br>2. Set discount: "30%+"<br>3. Set distance: "3km"<br>4. Tap "Apply" | Only deals matching ALL criteria displayed | | High |
| **SRCH-FIL-008** | Filter | Clear all filters | Filters active | 1. Multiple filters applied<br>2. Tap "Clear Filters" | All filters removed, all deals displayed | | Medium |
| **SRCH-FIL-009** | Filter | Cancel filter application | Filter options open | 1. Select filter options<br>2. Tap "Cancel" instead of "Apply" | Filters not applied, previous state maintained | | Low |
| **SRCH-FIL-010** | Filter | Filter with no matching results | User logged in | 1. Apply combination with no matches | Message "No deals match your filters" displayed, option to adjust filters | | Low |
| **SRCH-FIL-011** | Filter | Filter count indicator | User logged in | 1. Apply filters | Badge shows number of active filters (e.g., "3") | | Low |
| **SRCH-FIL-012** | Filter | Remove individual filter | Multiple filters active | 1. Tap "X" on one filter | That filter removed, others remain active, results update | | Medium |
| **SRCH-FIL-013** | Filter | Save filter combination | User logged in | 1. Apply filters<br>2. Tap "Save this filter"<br>3. Enter name: "My Favorites"<br>4. Tap "Save" | Filter saved, accessible from filter menu | | Low |
| **SRCH-FIL-014** | Filter | Apply saved filter | User has saved filters | 1. Open filters<br>2. Select saved filter "My Favorites" | Saved filter applied immediately | | Low |
| **SRCH-FIL-015** | Filter | Delete saved filter | User has saved filters | 1. Long press saved filter<br>2. Tap "Delete"<br>3. Confirm | Filter removed from saved list | | Low |
| **SRCH-FIL-016** | Filter | Filter with extreme values | User logged in | 1. Set price: 0.01 to 999999<br>2. Tap "Apply" | Appropriate error OR no results found message | | Low |
| **SRCH-FIL-017** | Filter | Filter state persists | Filters applied | 1. Apply filters<br>2. Navigate to deal detail<br>3. Press back | Filters still active, results still filtered | | Medium |
| **SRCH-FIL-018** | Filter | Reset filters to default | Filters active | 1. Tap "Reset" in filter menu | All filters reset to default values | | Low |
| **SRCH-FIL-019** | Filter | Sort results after filtering | Filtered results displayed | 1. Apply filter<br>2. Change sort to "Distance: Nearest" | Filtered results sorted by distance | | Medium |
| **SRCH-FIL-020** | Filter | Filter animation | User applying filters | 1. Tap filter icon | Filter menu slides in smoothly with animation | | Low |

### 2.3 AUTOCOMPLETE

| Test Case ID | Feature | Scenario | Preconditions | Test Steps | Expected Result | Actual Result | Severity |
|--------------|---------|----------|----------------|------------|-----------------|---------------|----------|
| **SRCH-AUT-001** | Autocomplete | Display suggestions after typing | User logged in | 1. Tap search bar<br>2. Type "piz" | Suggestions appear: "Pizza Hut", "Pizza Company", "Domino's Pizza" | | Medium |
| **SRCH-AUT-002** | Autocomplete | Select suggestion from dropdown | Autocomplete suggestions shown | 1. Type "burg"<br>2. Tap "Burger King" from suggestions | Search performed with selected term, results displayed | | Medium |
| **SRCH-AUT-003** | Autocomplete | No suggestions for rare term | User logged in | 1. Type "xyznonexistent"<br>2. Wait | No suggestions displayed OR message "No suggestions" | | Low |
| **SRCH-AUT-004** | Autocomplete | Debouncing (delay before suggestions) | User logged in | 1. Type single character quickly | Suggestions appear after short delay (300-500ms), not on every keystroke | | Low |
| **SRCH-AUT-005** | Autocomplete | Maximum suggestions displayed | User logged in | 1. Type common term with many matches | Maximum 5-10 suggestions shown, scrollable if more | | Low |
| **SRCH-AUT-006** | Autocomplete | Highlight matching text | Suggestions displayed | 1. Type "piz"<br>2. View suggestions | "Piz" portion highlighted in each suggestion | | Low |
| **SRCH-AUT-007** | Autocomplete | Category labels in suggestions | Suggestions shown | 1. Type "Central"<br>2. View suggestions | Each suggestion shows type (Store, Category, Mall) | | Low |
| **SRCH-AUT-008** | Autocomplete | Recent searches in suggestions | User has search history | 1. Tap search bar | Recent searches shown before typing | | Low |
| **SRCH-AUT-009** | Autocomplete | Trending searches | User logged in | 1. Tap search bar | Trending/trending searches displayed | | Low |
| **SRCH-AUT-010** | Autocomplete | Tap outside to dismiss | Autocomplete dropdown open | 1. Type to show suggestions<br>2. Tap outside dropdown | Suggestions dismissed, search text remains | | Low |
| **SRCH-AUT-011** | Autocomplete | Continue typing after suggestions | Suggestions shown | 1. Type "piz" (suggestions shown)<br>2. Continue typing "za" | Suggestions update dynamically for "pizza" | | Medium |
| **SRCH-AUT-012** | Autocomplete | Delete text and retype | User in search bar | 1. Type "pizza"<br>2. Delete all text<br>3. Type again | Suggestions appear appropriately | | Low |
| **SRCH-AUT-013** | Autocomplete | Thai language suggestions | Thai keyboard active | 1. Type Thai characters | Thai suggestions displayed correctly | | Medium |
| **SRCH-AUT-014** | Autocomplete | English keyboard, type Thai | User in search bar | 1. Type romanized Thai "pad thai"<br>2. View suggestions | Relevant Thai food suggestions appear | | Medium |
| **SRCH-AUT-015** | Autocomplete | Offline autocomplete behavior | Device offline | 1. Enable airplane mode<br>2. Type in search bar | Cached suggestions appear OR no suggestions with message | | Medium |

---

## 3. LOCATION-BASED DEALS TEST CASES

| Test Case ID | Feature | Scenario | Preconditions | Test Steps | Expected Result | Actual Result | Severity |
|--------------|---------|----------|----------------|------------|-----------------|---------------|----------|
| **LOC-001** | Location-Based | Enable location permissions | App first opened, location disabled | 1. Open app<br>2. Tap "Nearby" tab<br>3. Allow location permission when prompted | Location permission granted, nearby deals displayed based on GPS | | High |
| **LOC-002** | Location-Based | Deny location permissions | App first opened | 1. Open app<br>2. Tap "Nearby" tab<br>3. Deny location permission | Message "Location required for nearby deals" displayed, option to enable in settings OR all deals shown | | High |
| **LOC-003** | Location-Based | View deals within default radius (5km) | Location enabled | 1. Tap "Nearby" tab | Deals within 5km radius displayed, sorted by distance | | High |
| **LOC-004** | Location-Based | Change radius to 1km | Location enabled, on Nearby screen | 1. Tap radius filter<br>2. Select "1 km"<br>3. Tap "Apply" | Only deals within 1km displayed | | Medium |
| **LOC-005** | Location-Based | Change radius to 10km | Location enabled | 1. Tap radius filter<br>2. Select "10 km"<br>3. Tap "Apply" | Deals within 10km displayed | | Medium |
| **LOC-006** | Location-Based | View deals on map | Location enabled, deals nearby | 1. Tap "Map View" button | Deals shown as pins on map, tappable for details | | High |
| **LOC-007** | Location-Based | Tap deal pin on map | Map view active | 1. Tap on any deal pin | Deal preview card appears with basic info | | Medium |
| **LOC-008** | Location-Based | Tap deal preview to view details | Deal preview shown on map | 1. Tap deal preview card | Full deal detail page opens | | Medium |
| **LOC-009** | Location-Based | Current location indicator | Map view active | 1. View map | Blue dot shows current user location | | Low |
| **LOC-010** | Location-Based | Center map on user location | Map view active, panned away | 1. Tap "My Location" button | Map animates to center on current location | | Medium |
| **LOC-011** | Location-Based | No deals within radius | Location enabled, no nearby deals | 1. Tap "Nearby" tab | Message "No deals found nearby" displayed, option to increase radius | | Medium |
| **LOC-012** | Location-Based | GPS not available (underground) | Location enabled, user in basement | 1. Try to access nearby deals | Error "Unable to get your location" OR last known location used | | Medium |
| **LOC-003** | Location-Based | Deals too far to walk | Deal at 50km distance | 1. View nearby deals | Distance clearly displayed (e.g., "50 km away") | | Low |
| **LOC-014** | Location-Based | Walking time estimate | Deals within walking distance | 1. View deal within 2km | Estimated walking time displayed (e.g., "15 min walk") | | Low |
| **LOC-015** | Location-Based | Get directions to deal | Deal nearby | 1. Tap deal<br>2. Tap "Get Directions" | Opens in Google Maps / Apple Maps with route | | High |
| **LOC-016** | Location-Based | Location changes while viewing | User moving, viewing nearby | 1. View nearby deals<br>2. Walk/drive to new location | Deals update based on new location OR option to refresh | | Medium |
| **LOC-017** | Location-Based | Manual location entry | Location denied by user | 1. Tap "Enter location manually"<br>2. Enter: "Bangkok"<br>3. Tap "Search" | Deals in Bangkok area displayed | | Medium |
| **LOC-018** | Location-Based | Select area from map | Location denied or manual mode | 1. Tap on map to set location<br>2. Tap "Search here" | Deals around selected area displayed | | Medium |
| **LOC-019** | Location-Based | Location permission change | Previously granted, now denied | 1. Revoke location in system settings<br>2. Return to app | App detects change, prompts to re-enable OR falls back to manual location | | High |
| **LOC-020** | Location-Based | Background location updates | App in background | 1. Enable nearby notifications<br>2. Move to area with new deals | Notification "New deals nearby!" received (if feature enabled) | | Medium |
| **LOC-021** | Location-Based | Multiple deals at same location | Mall with multiple store deals | 1. View nearby or map | Deals grouped OR stacked pins shown | | Low |
| **LOC-022** | Location-Based | Battery saving mode | Device in battery saver | 1. Access nearby deals | Location accuracy may be reduced, appropriate message | | Low |
| **LOC-023** | Location-Based | Mock/spoofed location | Developer using mock location | 1. Set mock location<br>2. View nearby deals | Deals for mocked location shown (may be disabled in production) | | Low |
| **LOC-024** | Location-Based | Sort by distance | Nearby deals displayed | 1. Tap sort dropdown<br>2. Select "Distance: Nearest" | Deals sorted from nearest to furthest | | Medium |
| **LOC-025** | Location-Based | Distance format | Deals displayed | 1. View nearby deals | Distance shown in appropriate format (m for <1km, km for >1km) | | Low |

---

## 4. FAVORITES SYSTEM TEST CASES

| Test Case ID | Feature | Scenario | Preconditions | Test Steps | Expected Result | Actual Result | Severity |
|--------------|---------|----------|----------------|------------|-----------------|---------------|----------|
| **FAV-001** | Favorites | Add deal to favorites | User logged in, viewing deals | 1. Find deal of interest<br>2. Tap heart/favorite icon | Heart turns red/filled, deal added to favorites, success toast "Added to favorites" | | High |
| **FAV-002** | Favorites | Remove deal from favorites | Deal is favorited | 1. Tap filled heart icon on favorited deal | Heart outline/empty, deal removed from favorites, toast "Removed from favorites" | | High |
| **FAV-003** | Favorites | Add same deal twice | Deal already favorited | 1. Tap heart icon on already favorited deal | Either: nothing happens OR deal removed (toggle behavior) | | Low |
| **FAV-004** | Favorites | View all favorites | User has favorited deals | 1. Tap "Favorites" tab | All favorited deals displayed in list/grid | | High |
| **FAV-005** | Favorites | View favorites when empty | User has no favorites | 1. Tap "Favorites" tab | Message "No favorites yet" with prompt to browse deals | | Low |
| **FAV-006** | Favorites | Favorite count displayed | User has favorites | 1. View favorites tab or profile | Count shown (e.g., "12 Favorites") | | Low |
| **FAV-007** | Favorites | Add from search results | Viewing search results | 1. Search for deals<br>2. Tap heart on any result | Heart fills, deal added, search results unchanged | | Medium |
| **FAV-008** | Favorites | Add from deal detail page | Viewing deal details | 1. Open deal detail<br>2. Tap large favorite button | Favorited, can navigate back, state persists | | High |
| **FAV-009** | Favorites | Add from nearby deals | Viewing nearby deals | 1. On Nearby tab, tap heart | Deal added to favorites | | Medium |
| **FAV-010** | Favorites | Favorite persists across sessions | Deal favorited | 1. Favorite a deal<br>2. Close app<br>3. Reopen app | Deal still in favorites | | High |
| **FAV-011** | Favorites | Favorite sync across devices | User logged in on multiple devices | 1. Favorite on Device A<br>2. Check Device B | Favorite appears on Device B (may need refresh) | | Medium |
| **FAV-012** | Favorites | Sort favorites by date added | Viewing favorites | 1. Tap sort<br>2. Select "Recently Added" | Newest favorites shown first | | Low |
| **FAV-013** | Favorites | Sort favorites by expiration | Viewing favorites | 1. Tap sort<br>2. Select "Expiring Soon" | Deals soonest to expire shown first | | Medium |
| **FAV-014** | Favorites | Filter favorites by category | Favorites with multiple categories | 1. Tap filter in favorites<br>2. Select category | Only favorites in that category shown | | Low |
| **FAV-015** | Favorites | Expiring favorite indicator | Favorited deal expiring soon | 1. View favorites list | Expiring deals have badge "Expires in X days" or colored indicator | | Medium |
| **FAV-016** | Favorites | Expired deal in favorites | Deal has expired | 1. View favorites | Expired deal shown with "Expired" badge, possibly grayed out | | Medium |
| **FAV-017** | Favorites | Notification for expiring favorite | Favorited deal expiring in 1 day | 1. Wait for push notification | Receive notification "Your favorited deal expires tomorrow!" | | Medium |
| **FAV-018** | Favorites | Batch remove favorites | Multiple favorites | 1. Long press favorite<br>2. Select multiple<br>3. Tap "Remove Selected" | All selected favorites removed | | Low |
| **FAV-019** | Favorites | Share favorite deal | Favorited deal | 1. In favorites, tap share icon<br>2. Select sharing method | Deal shared via selected method (message, email, social) | | Low |
| **FAV-020** | Favorites | Add to favorites while offline | Device in airplane mode | 1. Enable airplane mode<br>2. Tap favorite icon | Optimistic UI update (heart fills), synced when online OR error "Cannot favorite offline" | | Medium |
| **FAV-021** | Favorites | Maximum favorites limit | User has many favorites | 1. Try to add favorite when at limit (e.g., 100) | Error "Favorite limit reached, remove some to add more" OR no limit | | Low |
| **FAV-022** | Favorites | Search within favorites | Viewing favorites | 1. Use search bar while in favorites tab | Only favorites matching search shown | | Low |
| **FAV-023** | Favorites | Quick actions on favorite | Viewing favorites list | 1. Swipe left on favorite item | Options: Remove, Share, View Details | | Low |
| **FAV-024** | Favorites | Favorite deal removed by merchant | Favorited deal no longer available | 1. View favorites | Deal shown as "No longer available" with option to remove | | Medium |
| **FAV-025** | Favorites | Favorite from map view | Viewing map with deals | 1. Tap on deal pin<br>2. Tap heart on preview | Deal added to favorites | | Medium |

---

## 5. SAVINGS TRACKER TEST CASES

| Test Case ID | Feature | Scenario | Preconditions | Test Steps | Expected Result | Actual Result | Severity |
|--------------|---------|----------|----------------|------------|-----------------|---------------|----------|
| **SAV-001** | Savings Tracker | Redeem deal | User logged in, has favorited/nearby deal | 1. Find deal to use<br>2. Tap "Redeem" button<br>3. Show code/QR to merchant | Deal marked as redeemed, savings calculated | | High |
| **SAV-003** | Savings Tracker | View total savings | User has redeemed deals | 1. Tap "Savings" tab | Total savings displayed prominently (e.g., "You saved ฿1,250!") | | High |
| **SAV-003** | Savings Tracker | View savings breakdown | Savings tab open | 1. Scroll down | Breakdown by category, store, month shown | | Medium |
| **SAV-004** | Savings Tracker | Monthly savings chart | Savings tab open | 1. View savings dashboard | Bar/line chart showing savings per month | | Medium |
| **SAV-005** | Savings Tracker | Savings by category | Savings tab open | 1. View breakdown | Pie chart showing categories (Food 40%, Shopping 30%, etc.) | | Medium |
| **SAV-006** | Savings Tracker | View redemption history | Savings tab open | 1. Tap "Redemption History" | List of all redeemed deals with dates and amounts | | High |
| **SAV-007** | Savings Tracker | Single redemption details | Redemption history displayed | 1. Tap on any redemption | Full deal details shown: original price, discount, savings, date, store | | Medium |
| **SAV-008** | Savings Tracker | Redeem same deal multiple times | Deal allows multiple redemptions | 1. Redeem deal<br>2. Redeem same deal again | Each redemption tracked separately, savings accumulated | | Medium |
| **SAV-009** | Savings Tracker | Edit redemption amount | Redemption recorded | 1. In history, tap redemption<br>2. Tap "Edit"<br>3. Modify amount | Savings total recalculated with new amount | | Low |
| **SAV-010** | Savings Tracker | Delete redemption | Redemption recorded | 1. In history, swipe redemption<br>2. Tap "Delete"<br>3. Confirm | Redemption removed, total savings decreased | | Medium |
| **SAV-011** | Savings Tracker | Manual redemption entry | Savings tab open | 1. Tap "Add Redemption"<br>2. Enter details manually<br>3. Tap "Save" | Manual entry added to history and total | | Low |
| **SAV-012** | Savings Tracker | Share savings achievement | Good savings accumulated | 1. Tap "Share" on savings total<br>2. Select sharing method | Savings achievement shared (e.g., "I saved ฿1000 with RichSave!") | | Low |
| **SAV-013** | Savings Tracker | Savings milestone reached | User reaches savings milestone | 1. Redeem deal that reaches ฿1000 total | Celebration animation, badge unlocked: "฿1000 Saver!" | | Medium |
| **SAV-014** | Savings Tracker | View badges | Savings tab open | 1. Tap "Badges" or "Achievements" | List of earned badges and locked badges shown | | Low |
| **SAV-015** | Savings Tracker | Badge progress | Badge not yet earned | 1. View locked badge | Progress bar shown (e.g., "700/1000 THB") | | Low |
| **SAV-016** | Savings Tracker | First redemption badge | First redemption | 1. Redeem first deal | Badge "First Savings!" unlocked with notification | | Low |
| **SAV-017** | Savings Tracker | Streak badge | Redeem deals 7 days in a row | 1. Redeem at least one deal daily for 7 days | "Week Warrior" badge unlocked | | Low |
| **SAV-018** | Savings Tracker | Category-specific badges | Multiple redemptions in same category | 1. Redeem 10 Food deals | "Foodie" badge unlocked | | Low |
| **SAV-019** | Savings Tracker | Savings leaderboard | Leaderboard feature exists | 1. Tap "Leaderboard" | Top savers shown, user's rank displayed | | Low |
| **SAV-020** | Savings Tracker | Savings goal setting | Settings available | 1. Enter monthly savings goal: ฿500<br>2. Save goal | Progress shown toward goal, celebration when reached | | Medium |
| **SAV-021** | Savings Tracker | Redeem without internet | Device offline | 1. Enable airplane mode<br>2. Tap "Redeem" | Redemption queued, processed when online OR error "Cannot redeem offline" | | Medium |
| **SAV-022** | Savings Tracker | Invalid redemption amount | Manual redemption entry | 1. Enter negative amount: -100<br>2. Tap "Save" | Error "Amount must be positive" | | Medium |
| **SAV-023** | Savings Tracker | Future redemption date | Manual redemption entry | 1. Select future date for redemption<br>2. Tap "Save" | Error "Date cannot be in future" OR saved with warning | | Low |
| **SAV-024** | Savings Tracker | Export savings data | Settings available | 1. Tap "Export Data"<br>2. Select format (CSV/PDF) | Savings data downloaded or shared | | Low |
| **SAV-025** | Savings Tracker | Savings tip/insight | Savings dashboard | 1. Scroll to bottom | Tip shown: "You saved most on Food! Try Shopping deals for more variety" | | Low |
| **SAV-026** | Savings Tracker | Comparison with last month | Savings dashboard | 1. View monthly comparison | Message: "You saved 20% more than last month!" or "Save more to beat last month" | | Low |
| **SAV-027** | Savings Tracker | Zero savings state | New user, no redemptions | 1. Tap "Savings" tab | Message "Start redeeming deals to track your savings!" with CTA | | Low |
| **SAV-028** | Savings Tracker | Large savings formatting | User has >10,000 THB savings | 1. View savings total | Display formatted: "฿10,500" (with commas) | | Low |
| **SAV-029** | Savings Tracker | Decimal savings | Deal with odd discount | 1. Redeem deal saving ฿37.50 | Decimal shown correctly: "฿37.50" | | Low |
| **SAV-030** | Savings Tracker | Delete all redemptions | User wants to reset | 1. In settings, tap "Reset Savings"<br>2. Confirm | All redemptions deleted, total reset to 0 (with warning) | | Medium |

---

## 6. SECURITY TEST CASES

| Test Case ID | Feature | Scenario | Preconditions | Test Steps | Expected Result | Actual Result | Severity |
|--------------|---------|----------|----------------|------------|-----------------|---------------|----------|
| **SEC-001** | Authentication | SQL Injection - Login | On login screen | 1. Enter email: "admin'--"<br>2. Enter any password<br>3. Tap "Sign In" | Login fails, error message, no SQL injection | | Critical |
| **SEC-002** | Authentication | SQL Injection - Search | On search bar | 1. Enter: "pizza'; DROP TABLE deals;--"<br>2. Tap search | Input sanitized, database intact | | Critical |
| **SEC-003** | Authentication | XSS in search field | On search bar | 1. Enter: "<script>alert('XSS')</script>"<br>2. Tap search | No alert, input sanitized | | Critical |
| **SEC-004** | Authentication | XSS in user profile | On profile edit | 1. Enter name: "<script>alert('XSS')</script>"<br>2. Save profile | Input escaped/sanitized, no script execution | | Critical |
| **SEC-005** | Session | Session hijacking - token in localStorage | Logged in user | 1. Check localStorage for token | Token should NOT be in localStorage (use HTTP-only cookies) | | Critical |
| **SEC-006** | Session | Token expiration after logout | User logged in | 1. Copy token before logout<br>2. Logout<br>3. Try to use old token in API call | Token invalid, returns 401 Unauthorized | | High |
| **SEC-007** | Session | Concurrent sessions | User logged in | 1. Login on Device A<br>2. Login on Device B with same credentials | Either: both allowed OR first session terminated | | High |
| **SEC-008** | Authentication | Brute force prevention | On login screen | 1. Enter wrong password 5 times | Account temporarily locked or rate limiting enforced | | High |
| **SEC-009** | Authentication | Password strength enforcement | On registration | 1. Enter weak password: "123456"<br>2. Complete registration | Error "Password too weak" OR rejected | | High |
| **SEC-010** | Data | Sensitive data in logs | Server side | 1. Perform registration<br>2. Check server logs | No passwords, OTPs, or tokens in logs | | Critical |
| **SEC-011** | Data | OTP exposure in console | Request password reset | 1. Request OTP<br>2. Check browser console/network tab | OTP NOT logged anywhere visible | | Critical |
| **SEC-012** | Session | CSRF token validation | Authenticated state | 1. Craft POST request without CSRF token<br>2. Send to API | Request rejected with 403 Forbidden | | High |
| **SEC-013** | Data | NoSQL injection | In search or filter | 1. Enter: {"$ne": null}<br>2. Perform search | Input sanitized, query rejected | | Critical |
| **SEC-014** | Authentication | Email enumeration | On forgot password | 1. Enter: nonexistent@email.com<br>2. Enter: existing@email.com | Same response for both (prevent email enumeration) | | High |
| **SEC-015** | Session | Remember Me security | Login with Remember Me checked | 1. Check cookie persistence | Cookie has appropriate expiration, not indefinite | | Medium |
| **SEC-016** | Authentication | Password reset without OTP | Try to reset password | 1. Skip to reset password endpoint<br>2. Submit new password without OTP | Request rejected, OTP required | | Critical |
| **SEC-017** | Data | HTTPS enforcement | Try HTTP connection | 1. Attempt HTTP request to API | Redirect to HTTPS or connection refused | | High |
| **SEC-018** | Session | Session fixation | Login flow | 1. Note session cookie before login<br>2. Complete login<br>3. Check if cookie changed | New session cookie issued after login | | High |
| **SEC-019** | Data | Rate limiting on API | Make rapid API calls | 1. Send 100 requests in 1 second | Rate limiting enforced, IP throttled or blocked | | High |
| **SEC-020** | Authentication | Cookie security flags | Inspect authentication cookie | 1. Check cookie attributes | Cookie has: HttpOnly, Secure, SameSite set | | Critical |
| **SEC-021** | Data | Input length limits | On various input fields | 1. Enter 10000 characters in name field | Input truncated or rejected with error | | Medium |
| **SEC-022** | Authentication | JWT secret hardcode | Check code/config | 1. Review authentication code | No hardcoded JWT secrets, uses environment variable | | Critical |
| **SEC-023** | Data | File upload validation | Upload avatar/image | 1. Upload malicious file (e.g., .exe renamed as .jpg) | File type validated, rejected if not image | | High |
| **SEC-024** | Session | Logout invalidates token | User logged in | 1. Logout<br>2. Try API call with old token | 401 Unauthorized response | | High |
| **SEC-025** | Data | API response doesn't leak info | Make invalid API call | 1. Call /api/user/profile without auth | Generic error, no stack traces or internal details | | Medium |
| **SEC-026** | Data | Password not logged | Perform various operations | 1. Register/login/reset password<br>2. Check all logs | Passwords never appear in any logs | | Critical |
| **SEC-027** | Authentication | Timing attack prevention | Check login response time | 1. Measure response for existing vs non-existing email | Similar response times (no measurable difference) | | Medium |
| **SEC-028** | Session | Token storage comparison | Check app behavior | 1. Login<br>2. Check if token in localStorage, sessionStorage, cookies | Token only in HTTP-only cookies | | Critical |
| **SEC-029** | Data | Query parameter injection | Add malicious params to URL | 1. Add ?id=<script> to URL | No XSS, params sanitized | | High |
| **SEC-030** | Authentication | Account enumeration on signup | Try existing email | 1. Attempt to register with existing email | Generic error, not "email already exists" | | Medium |

---

## TEST EXECUTION SUMMARY

### Test Statistics

| Module | Total Test Cases | Critical | High | Medium | Low |
|--------|------------------|----------|------|--------|-----|
| Authentication - Registration | 15 | 2 | 0 | 9 | 4 |
| Authentication - Login | 20 | 1 | 6 | 9 | 4 |
| Authentication - Password Reset | 20 | 0 | 5 | 10 | 5 |
| Authentication - Logout | 10 | 0 | 5 | 3 | 2 |
| Deal Search - Keyword | 20 | 2 | 3 | 10 | 5 |
| Deal Search - Filter | 20 | 0 | 4 | 11 | 5 |
| Deal Search - Autocomplete | 15 | 0 | 0 | 8 | 7 |
| Location-Based Deals | 25 | 0 | 5 | 14 | 6 |
| Favorites System | 25 | 0 | 6 | 12 | 7 |
| Savings Tracker | 30 | 0 | 4 | 16 | 10 |
| Security | 30 | 10 | 12 | 7 | 1 |
| **TOTAL** | **230** | **15** | **50** | **109** | **56** |

### Priority Matrix

**Priority 1 (Critical + High):** 65 test cases - Must pass before release
**Priority 2 (Medium):** 109 test cases - Should pass before release
**Priority 3 (Low):** 56 test cases - Nice to have

---

## TEST EXECUTION CHECKLIST

### Pre-Test Setup
- [ ] Test environment configured and stable
- [ ] Test data populated (users, deals, categories)
- [ ] Test devices prepared (iOS, Android, various screen sizes)
- [ ] Network testing tools ready (Charles Proxy, etc.)
- [ ] Test accounts created (admin, regular user, etc.)
- [ ] Location simulation tools ready

### During Testing
- [ ] Document actual results for each test case
- [ ] Capture screenshots for failures
- [ ] Log bugs with detailed reproduction steps
- [ ] Note any test cases that cannot be executed
- [ ] Track test execution progress daily
- [ ] Update test cases if scenarios change

### Post-Test
- [ ] Generate test execution report
- [ ] Calculate pass/fail percentages
- [ ] Identify areas needing improvement
- [ ] Provide recommendations to development team
- [ ] Archive test results and evidence

---

## NOTES

### Test Environment
- **Testing Period:** [To be filled]
- **Testers:** [To be filled]
- **Build Version:** [To be filled]
- **Devices Tested:** [To be filled]

### Known Limitations
- Some test cases may require specific location setup
- Security test cases may need development environment access
- Performance/stress test cases not included in this suite
- Accessibility test cases not covered

### Assumptions
- User has stable internet connection unless testing offline scenarios
- Location services available on test device
- App has necessary permissions granted
- Backend services are running and accessible

---

## APPENDIX

### Common Test Data

| Data Type | Value |
|-----------|-------|
| Valid User Email | test.richsave@example.com |
| Valid Password | Test@12345 |
| Weak Password | 123456 |
| Invalid Email | invalidemail |
| Test Search Terms | pizza, burger, sushi, central, bigc |
| Test Location | Bangkok, Thailand |

### Device Matrix

| Device | OS | Screen Size | Notes |
|--------|-----|-------------|-------|
| iPhone 14 Pro | iOS 17 | 6.1" | High-end iOS |
| Samsung Galaxy S23 | Android 14 | 6.1" | High-end Android |
| iPhone SE | iOS 17 | 4.7" | Small screen iOS |
| Redmi Note 12 | Android 13 | 6.79" | Mid-range Android |
| iPad Air | iOS 17 | 10.9" | Tablet |

---

**End of Document**

*This test suite should be reviewed and updated regularly as the application evolves. New features should have corresponding test cases added before release.*
