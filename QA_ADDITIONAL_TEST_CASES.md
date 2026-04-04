# RichSave - Additional Test Cases
## API Integration, Edge Cases & Advanced Scenarios

**Document Version:** 1.0
**Last Updated:** 2026-04-04
**Supplement to:** QA_TEST_CASES_RICHSAVE.md

---

## Table of Contents

1. [API Integration Test Cases](#1-api-integration-test-cases)
2. [Database & Data Integrity Test Cases](#2-database--data-integrity-test-cases)
3. [Network & Connectivity Test Cases](#3-network--connectivity-test-cases)
4. [Notifications Test Cases](#4-notifications-test-cases)
5. [Cross-Platform Test Cases](#5-cross-platform-test-cases)
6. [Accessibility Test Cases](#6-accessibility-test-cases)
7. [Localization & Internationalization Test Cases](#7-localization--internationalization-test-cases)
8. [Third-Party Integration Test Cases](#8-third-party-integration-test-cases)

---

## 1. API INTEGRATION TEST CASES

### 1.1 AUTHENTICATION API ENDPOINTS

| Test Case ID | Feature | Scenario | Request | Expected Response | Actual Result | Severity |
|--------------|---------|----------|---------|-------------------|---------------|----------|
| **API-AUTH-001** | POST /api/auth/signup | Valid registration | `{"name":"Test User","email":"test@example.com","password":"Test@123"}` | Status: 201<br>Body: `{success:true, user:{id,name,email,favorites,preferences}}`<br>Set-Cookie: token (httpOnly) | | Critical |
| **API-AUTH-002** | POST /api/auth/signup | Duplicate email | `{"name":"New User","email":"existing@example.com","password":"Test@123"}` | Status: 409<br>Body: `{error:"User already exists with this email"}` | | High |
| **API-AUTH-003** | POST /api/auth/signup | Missing required field | `{"name":"Test User","email":"test@example.com"}` | Status: 400<br>Body: `{error:"Missing required fields"}` | | High |
| **API-AUTH-004** | POST /api/auth/signup | SQL injection in email | `{"name":"Test","email":"'; DROP TABLE users;--@test.com","password":"Test@123"}` | Status: 400<br>Input sanitized, no SQL execution | | Critical |
| **API-AUTH-005** | POST /api/auth/signup | Weak password | `{"name":"Test","email":"test@example.com","password":"123"}` | Status: 400<br>Body: `{error:"Password must be at least 6 characters"}` | | Medium |
| **API-AUTH-006** | POST /api/auth/login | Valid credentials | `{"email":"test@example.com","password":"Test@123"}` | Status: 200<br>Body: `{success:true, user:{id,name,email,favorites,preferences}}`<br>Set-Cookie: token | | Critical |
| **API-AUTH-007** | POST /api/auth/login | Invalid credentials | `{"email":"test@example.com","password":"Wrong@123"}` | Status: 401<br>Body: `{error:"Invalid email or password"}` | | High |
| **API-AUTH-008** | POST /api/auth/login | Non-existent email | `{"email":"nonexistent@example.com","password":"Test@123"}` | Status: 401<br>Body: `{error:"Invalid email or password"}` (generic) | | High |
| **API-AUTH-009** | POST /api/auth/login | Empty request body | `{}` | Status: 400<br>Body: `{error:"Email and password are required"}` | | High |
| **API-AUTH-010** | POST /api/auth/login | Missing password | `{"email":"test@example.com"}` | Status: 400<br>Body: `{error:"Email and password are required"}` | | High |
| **API-AUTH-011** | POST /api/auth/logout | Valid logout | Cookie: token=valid_token | Status: 200<br>Body: `{success:true}`<br>Set-Cookie: token=deleted | | High |
| **API-AUTH-012** | POST /api/auth/logout | No token provided | No cookie | Status: 200 (idempotent - always succeeds) | | Low |
| **API-AUTH-013** | POST /api/auth/forgot-password | Valid email | `{"email":"test@example.com"}` | Status: 200<br>Body: `{success:true, message:"OTP sent to your email"}` | | High |
| **API-AUTH-014** | POST /api/auth/forgot-password | Non-existent email | `{"email":"nonexistent@example.com"}` | Status: 200 (security - don't reveal email existence) OR 404 | | High |
| **API-AUTH-015** | POST /api/auth/forgot-password | Empty email | `{}` | Status: 400<br>Body: `{error:"Email is required"}` | | High |
| **API-AUTH-016** | POST /api/auth/verify-otp | Valid OTP | `{"email":"test@example.com","code":"123456"}` | Status: 200<br>Body: `{success:true, message:"OTP verified successfully"}` | | Critical |
| **API-AUTH-017** | POST /api/auth/verify-otp | Invalid OTP | `{"email":"test@example.com","code":"000000"}` | Status: 400<br>Body: `{error:"Invalid or expired code"}` | | High |
| **API-AUTH-018** | POST /api/auth/verify-otp | Expired OTP | `{"email":"test@example.com","code":"old_code"}` | Status: 400<br>Body: `{error:"Invalid or expired code"}` | | High |
| **API-AUTH-019** | POST /api/auth/verify-otp | Already used OTP | `{"email":"test@example.com","code":"used_code"}` | Status: 400<br>Body: `{error:"Invalid or expired code"}` | | High |
| **API-AUTH-020** | POST /api/auth/reset-password | Valid reset with verified OTP | `{"email":"test@example.com","newPassword":"NewTest@123"}` | Status: 200<br>Body: `{success:true, message:"Password reset successfully"}` | | Critical |
| **API-AUTH-021** | POST /api/auth/reset-password | Reset without OTP verification | `{"email":"test@example.com","newPassword":"NewTest@123"}` | Status: 400<br>Body: `{error:"OTP verification required"}` | | Critical |
| **API-AUTH-022** | POST /api/auth/reset-password | Weak new password | `{"email":"test@example.com","newPassword":"123"}` | Status: 400<br>Body: `{error:"Password must be at least 6 characters"}` | | High |
| **API-AUTH-023** | POST /api/auth/reset-password | Passwords don't match (if confirm field) | `{"email":"test@example.com","newPassword":"Test@123","confirmPassword":"Different"}` | Status: 400<br>Body: `{error:"Passwords do not match"}` | | High |

### 1.2 USER PROFILE API ENDPOINTS

| Test Case ID | Feature | Scenario | Request | Expected Response | Actual Result | Severity |
|--------------|---------|----------|---------|-------------------|---------------|----------|
| **API-USER-001** | GET /api/user/profile | Get profile with valid token | Cookie: token=valid_token | Status: 200<br>Body: `{success:true, user:{id,name,email,phone,location,favorites,preferences,createdAt}}` | | High |
| **API-USER-002** | GET /api/user/profile | No token provided | No cookie | Status: 401<br>Body: `{error:"Unauthorized"}` | | High |
| **API-USER-003** | GET /api/user/profile | Invalid/expired token | Cookie: token=invalid_token | Status: 401<br>Body: `{error:"Invalid token"}` | | High |
| **API-USER-004** | GET /api/user/profile | Password not in response | Cookie: token=valid_token | Status: 200<br>Body must NOT contain password field | | Critical |
| **API-USER-005** | PUT /api/user/profile | Update valid fields | Cookie: token=valid_token<br>`{"name":"Updated Name","phone":"1234567890"}` | Status: 200<br>Body: `{success:true, user:{updated_fields}}` | | High |
| **API-USER-006** | PUT /api/user/profile | Update email to existing email | Cookie: token=valid_token<br>`{"email":"another@example.com"}` (already taken) | Status: 409<br>Body: `{error:"Email already in use"}` | | High |
| **API-USER-007** | PUT /api/user/profile | Update without token | No cookie<br>`{"name":"Updated"}` | Status: 401<br>Body: `{error:"Unauthorized"}` | | High |
| **API-USER-008** | PUT /api/user/profile | Update with invalid email format | Cookie: token=valid_token<br>`{"email":"invalidemail"}` | Status: 400<br>Body: `{error:"Invalid email format"}` | | Medium |
| **API-USER-009** | POST /api/user/change-password | Valid password change | Cookie: token=valid_token<br>`{"currentPassword":"Old@123","newPassword":"New@123"}` | Status: 200<br>Body: `{success:true, message:"Password changed successfully"}` | | Critical |
| **API-USER-010** | POST /api/user/change-password | Wrong current password | Cookie: token=valid_token<br>`{"currentPassword":"Wrong@123","newPassword":"New@123"}` | Status: 401<br>Body: `{error:"Current password is incorrect"}` | | High |
| **API-USER-011** | POST /api/user/change-password | Weak new password | Cookie: token=valid_token<br>`{"currentPassword":"Old@123","newPassword":"123"}` | Status: 400<br>Body: `{error:"New password must be at least 6 characters"}` | | High |
| **API-USER-012** | POST /api/user/change-password | No token | No cookie | Status: 401<br>Body: `{error:"Unauthorized"}` | | High |

### 1.3 DEALS API ENDPOINTS

| Test Case ID | Feature | Scenario | Request | Expected Response | Actual Result | Severity |
|--------------|---------|----------|---------|-------------------|---------------|----------|
| **API-DEAL-001** | GET /api/deals | Get all deals | No auth required | Status: 200<br>Body: `{success:true, deals:[{id,title,description,discount,originalPrice,discountedPrice,storeName,category,expiresAt,isActive}]}` | | High |
| **API-DEAL-002** | GET /api/deals?q=pizza | Search by keyword | Query: ?q=pizza | Status: 200<br>Body: `{success:true, deals:[matching_deals]}` | | High |
| **API-DEAL-003** | GET /api/deals?category=Food | Filter by category | Query: ?category=Food | Status: 200<br>Body: `{success:true, deals:[food_deals]}` | | High |
| **API-DEAL-004** | GET /api/deals?nearby=true&lat=13.75&lng=100.5 | Nearby deals | Query: ?nearby=true&lat=13.75&lng=100.5 | Status: 200<br>Body: `{success:true, deals:[nearby_deals]}` | | High |
| **API-DEAL-005** | GET /api/deals?nearby=true | Nearby without coordinates | Query: ?nearby=true | Status: 400<br>Body: `{error:"Latitude and longitude required for nearby search"}` | | Medium |
| **API-DEAL-006** | GET /api/deals?q=<script> | XSS in search query | Query: ?q=<script>alert(1)</script> | Status: 200<br>Input sanitized, no script execution in response | | Critical |
| **API-DEAL-007** | GET /api/deals?q={$ne:null} | NoSQL injection attempt | Query: ?q={$ne:null} | Status: 400 OR sanitized query | | Critical |
| **API-DEAL-008** | POST /api/deals | Create deal (authenticated) | Cookie: token=valid_token<br>`{title,description,discount,originalPrice,discountedPrice,storeName,category,expiresAt}` | Status: 201<br>Body: `{success:true, message:"Deal created successfully"}` | | High |
| **API-DEAL-009** | POST /api/deals | Create deal without auth | No cookie | Status: 401<br>Body: `{error:"Unauthorized"}` | | High |
| **API-DEAL-010** | POST /api/deals | Create deal as non-admin | Cookie: token=user_token | Status: 403<br>Body: `{error:"Forbidden - Admin access required"}` | | High |
| **API-DEAL-011** | POST /api/deals | Missing required fields | Cookie: token=admin_token<br>`{title:"Test"}` (incomplete) | Status: 400<br>Body: `{error:"Missing required fields"}` | | High |
| **API-DEAL-012** | GET /api/deals/:id | Get deal by ID | Valid deal ID | Status: 200<br>Body: `{success:true, deal:{deal_details}}` | | Medium |
| **API-DEAL-013** | GET /api/deals/:id | Get non-existent deal | Invalid deal ID | Status: 404<br>Body: `{error:"Deal not found"}` | | Medium |
| **API-DEAL-014** | GET /api/deals/:id | Invalid MongoDB ObjectId | Query: /api/deals/invalid_id | Status: 400<br>Body: `{error:"Invalid deal ID"}` | | Medium |
| **API-DEAL-015** | PUT /api/deals/:id | Update deal (admin) | Cookie: token=admin_token | Status: 200<br>Body: `{success:true, deal:{updated_deal}}` | | Medium |
| **API-DEAL-016** | PUT /api/deals/:id | Update deal without auth | No cookie | Status: 401<br>Body: `{error:"Unauthorized"}` | | Medium |
| **API-DEAL-017** | DELETE /api/deals/:id | Soft delete deal | Cookie: token=admin_token | Status: 200<br>Deal isActive set to false, not deleted from DB | | Medium |

### 1.4 FAVORITES API ENDPOINTS

| Test Case ID | Feature | Scenario | Request | Expected Response | Actual Result | Severity |
|--------------|---------|----------|---------|-------------------|---------------|----------|
| **API-FAV-001** | POST /api/user/favorites | Add favorite (authenticated) | Cookie: token=valid_token<br>`{"dealId":"507f1f77bcf86cd799439011"}` | Status: 200<br>Body: `{success:true, message:"Added to favorites"}` | | High |
| **API-FAV-002** | POST /api/user/favorites | Add favorite without auth | No cookie | Status: 401<br>Body: `{error:"Unauthorized"}` | | High |
| **API-FAV-003** | POST /api/user/favorites | Add duplicate favorite | Cookie: token=valid_token<br>Same dealId already favorited | Status: 200 OR 409<br>Either: success (idempotent) OR conflict | | Medium |
| **API-FAV-004** | POST /api/user/favorites | Invalid deal ID | Cookie: token=valid_token<br>`{"dealId":"invalid_id"}` | Status: 400 OR 404<br>Body: `{error:"Invalid deal ID"}` | | Medium |
| **API-FAV-005** | DELETE /api/user/favorites/:dealId | Remove favorite | Cookie: token=valid_token | Status: 200<br>Body: `{success:true, message:"Removed from favorites"}` | | High |
| **API-FAV-006** | DELETE /api/user/favorites/:dealId | Remove without auth | No cookie | Status: 401<br>Body: `{error:"Unauthorized"}` | | High |
| **API-FAV-007** | DELETE /api/user/favorites/:dealId | Remove non-existent favorite | Cookie: token=valid_token<br>Deal not in favorites | Status: 200 (idempotent) OR 404 | | Low |
| **API-FAV-008** | GET /api/user/favorites | Get all favorites | Cookie: token=valid_token | Status: 200<br>Body: `{success:true, favorites:[{deal_details}]}` | | High |
| **API-FAV-009** | GET /api/user/favorites | Get without auth | No cookie | Status: 401<br>Body: `{error:"Unauthorized"}` | | High |
| **API-FAV-010** | GET /api/user/favorites | Empty favorites list | Cookie: token=valid_token<br>User has no favorites | Status: 200<br>Body: `{success:true, favorites:[]}` | | Low |

### 1.5 SAVINGS API ENDPOINTS

| Test Case ID | Feature | Scenario | Request | Expected Response | Actual Result | Severity |
|--------------|---------|----------|---------|-------------------|---------------|----------|
| **API-SAV-001** | POST /api/user/savings | Record redemption | Cookie: token=valid_token<br>`{dealId,dealTitle,storeName,savings,redeemedAt}` | Status: 201<br>Body: `{success:true, message:"Savings recorded"}` | | High |
| **API-SAV-002** | POST /api/user/savings | Record without auth | No cookie | Status: 401<br>Body: `{error:"Unauthorized"}` | | High |
| **API-SAV-003** | POST /api/user/savings | Negative savings amount | Cookie: token=valid_token<br>`{savings:-100}` | Status: 400<br>Body: `{error:"Savings must be positive"}` | | Medium |
| **API-SAV-004** | POST /api/user/savings | Future redemption date | Cookie: token=valid_token<br>`{redeemedAt:"2027-01-01"}` | Status: 400<br>Body: `{error:"Date cannot be in future"}` | | Medium |
| **API-SAV-005** | GET /api/user/savings | Get total savings | Cookie: token=valid_token | Status: 200<br>Body: `{success:true, totalSavings:1250.50, currency:"THB"}` | | High |
| **API-SAV-006** | GET /api/user/savings | Get without auth | No cookie | Status: 401<br>Body: `{error:"Unauthorized"}` | | High |
| **API-SAV-007** | GET /api/user/savings?period=month | Get monthly savings | Cookie: token=valid_token<br>Query: ?period=month | Status: 200<br>Body: `{success:true, savings:[{month,year,amount,count}]}` | | Medium |
| **API-SAV-008** | GET /api/user/savings/history | Get redemption history | Cookie: token=valid_token | Status: 200<br>Body: `{success:true, history:[redemptions_sorted_by_date]}` | | High |
| **API-SAV-009** | DELETE /api/user/savings/:id | Delete redemption | Cookie: token=valid_token | Status: 200<br>Body: `{success:true, message:"Redemption deleted"}` | | Medium |
| **API-SAV-010** | DELETE /api/user/savings/:id | Delete another user's redemption | Cookie: token=user_a_token<br>Deleting user_b's redemption | Status: 403<br>Body: `{error:"Forbidden"}` | | Critical |

---

## 2. DATABASE & DATA INTEGRITY TEST CASES

| Test Case ID | Feature | Scenario | Test Steps | Expected Result | Actual Result | Severity |
|--------------|---------|----------|------------|-----------------|---------------|----------|
| **DB-001** | User Schema | Password hashing | 1. Register user with password "Test@123"<br>2. Query database for user | Password field contains bcrypt hash, NOT plain text | | Critical |
| **DB-002** | User Schema | Email uniqueness | 1. Register user with email@test.com<br>2. Try to register another with same email | Second registration fails, unique constraint enforced | | Critical |
| **DB-003** | User Schema | Default preferences | 1. Register new user<br>2. Check user preferences field | Preferences set to: `{pushNotifications:true, locationServices:true, darkMode:false}` | | Medium |
| **DB-004** | Deal Schema | Expires at validation | 1. Create deal with past expiration date | Either: rejected OR isActive automatically set to false | | High |
| **DB-005** | Deal Schema | Price validation | 1. Create deal with originalPrice < discountedPrice | Creation rejected OR validation error | | Medium |
| **DB-006** | Deal Schema | Active deals query | 1. Query deals collection with `{isActive:true}` | Only non-deleted, non-expired deals returned | | High |
| **DB-007** | OTP Schema | OTP expiration | 1. Create OTP<br>2. Wait 16 minutes<br>3. Try to verify | OTP expired, verification fails | | High |
| **DB-008** | OTP Schema | OTP single use | 1. Verify OTP successfully<br>2. Try to verify same OTP again | Second verification fails (used flag checked) | | Critical |
| **DB-009** | Redemption Schema | UserId foreign key | 1. Delete user<br>2. Check their redemptions | Either: cascade delete OR redemptions orphaned (design choice) | | Medium |
| **DB-010** | Favorites Schema | Array operations | 1. Add same favorite twice | Favorite appears only once ($addToSet prevents duplicates) | | Medium |
| **DB-011** | Indexes | Email index performance | 1. Explain query on findByEmail | Index used, query fast (<10ms for 1M users) | | High |
| **DB-012** | Indexes | Location index | 1. Explain nearby deals query | Geospatial index used if available | | Medium |
| **DB-013** | Transactions | OTP verification atomicity | 1. Two concurrent requests verify same OTP | Only one succeeds, race condition handled | | High |
| **DB-014** | Transactions | Favorite add/remove race | 1. Concurrent add and remove same favorite | One operation wins, consistent final state | | Medium |
| **DB-015** | Data Consistency | Profile update sync | 1. Update user name in profile<br>2. Check associated redemptions | User name in redemptions reflects change OR denormalized | | Low |
| **DB-016** | Data Consistency | Deal soft delete | 1. Soft delete deal (isActive=false)<br>2. Check favorites containing deal | Deal still in favorites but marked inactive | | Medium |
| **DB-017** | Data Consistency | Cascade preferences | 1. Update push notification preference<br>2. Check notification queue | Preference immediately respected | | Medium |
| **DB-018** | Backup & Restore | Database backup | 1. Create backup<br>2. Modify data<br>3. Restore from backup | Data restored to backup state exactly | | Critical |
| **DB-019** | Migration | Schema migration | 1. Add new field to schema<br>2. Run migration | Existing records get default value, no data loss | | High |
| **DB-020** | Data Retention | Old OTP cleanup | 1. Check OTP collection for old records | OTPs older than 24 hours cleaned up by job | | Low |

---

## 3. NETWORK & CONNECTIVITY TEST CASES

| Test Case ID | Feature | Scenario | Test Steps | Expected Result | Actual Result | Severity |
|--------------|---------|----------|------------|-----------------|---------------|----------|
| **NET-001** | Offline Mode | Login offline | 1. Enable airplane mode<br>2. Try to login | Error "No internet connection" displayed gracefully | | High |
| **NET-002** | Offline Mode | View cached deals offline | 1. View deals online<br>2. Enable airplane mode<br>3. Navigate back | Cached deals displayed OR "Offline" message | | Medium |
| **NET-003** | Offline Mode | Add favorite offline | 1. Enable airplane mode<br>2. Tap favorite icon | Either: queued for later sync OR error "Cannot favorite offline" | | Medium |
| **NET-004** | Network Latency | Slow network (3G) | 1. Throttle to 3G speeds<br>2. Search for deals | Loading indicator shown, results eventually load | | Medium |
| **NET-005** | Network Latency | Very slow network (2G) | 1. Throttle to 2G speeds<br>2. Try to login | Timeout after 30s with "Request timeout" message | | Medium |
| **NET-006** | Network Switch | WiFi to Cellular | 1. Start on WiFi<br>2. Load deals page<br>3. Switch to cellular<br>4. Refresh | App detects network change, continues working | | High |
| **NET-007** | Network Switch | Cellular to WiFi | 1. Start on cellular<br>2. Switch to WiFi | App seamlessly switches, no interruption | | Medium |
| **NET-008** | Request Retry | Failed request retry | 1. Network fails during request<br>2. Network returns | Request automatically retried up to 3 times | | High |
| **NET-009** | Timeout Handling | API timeout | 1. Mock API timeout (>30s) | App shows timeout error, doesn't hang | | High |
| **NET-010** | Connection Pool | Multiple concurrent requests | 1. Load deals, favorites, savings simultaneously | All requests complete without connection pool exhaustion | | Medium |
| **NET-011** | DNS Resolution | Invalid DNS | 1. Use invalid DNS server | App handles DNS failure gracefully | | Low |
| **NET-012** | SSL Certificates | Self-signed cert | 1. API uses self-signed cert | Either: rejected (security) OR accepted with warning | | Medium |
| **NET-013** | Bandwidth | Low bandwidth mode | 1. Enable data saver mode<br>2. Load deals | Images compressed or not loaded, data usage reduced | | Low |
| **NET-014** | Roaming | Data roaming | 1. Use app while roaming | App respects roaming settings, may warn about data | | Low |
| **NET-015** | Network Drop | Network drops during upload | 1. Start profile picture upload<br>2. Lose connection | Upload paused, resumes when connection returns | | Medium |

---

## 4. NOTIFICATIONS TEST CASES

| Test Case ID | Feature | Scenario | Test Steps | Expected Result | Actual Result | Severity |
|--------------|---------|----------|------------|-----------------|---------------|----------|
| **NOT-001** | Push Notifications | Deal near me notification | 1. Enable location and notifications<br>2. Move near new deal | Receive: "New deal near you: [Store] - [Discount]!" | | Medium |
| **NOT-002** | Push Notifications | Expiring favorite notification | 1. Favorite a deal expiring tomorrow<br>2. Wait for scheduled check | Receive: "Your favorited deal expires tomorrow!" | | Medium |
| **NOT-003** | Push Notifications | Savings milestone notification | 1. Reach ฿1000 total savings | Receive: "🎉 You've saved ฿1000! Keep it up!" | | Low |
| **NOT-004** | Push Notifications | New category deals notification | 1. Opt into "Shopping" category alerts<br>2. New shopping deal added | Receive: "New Shopping deals available!" | | Low |
| **NOT-005** | Push Notifications | Permission denied | 1. Deny notification permission on app open | App functions without push notifications | | Medium |
| **NOT-006** | Push Notifications | Permission granted later | 1. Deny permission initially<br>2. Enable in settings later | App detects permission change, enables notifications | | Medium |
| **NOT-007** | Push Notifications | Tap notification opens deal | 1. Receive deal notification<br>2. Tap notification | App opens to deal detail page | | High |
| **NOT-008** | Push Notifications | Notification stack | 1. Receive multiple notifications | Notifications grouped or stacked appropriately | | Low |
| **NOT-009** | Push Notifications | Clear notifications | 1. Receive notifications<br>2. Clear all | All notifications dismissed, app state unaffected | | Low |
| **NOT-010** | Push Notifications | Do Not Disturb respect | 1. Enable DND mode<br>2. Trigger notification | Notification silenced OR shown silently | | Low |
| **NOT-011** | In-App Notifications | New feature announcement | 1. App updates with new feature | In-app banner or modal shown on next open | | Low |
| **NOT-012** | In-App Notifications | Deal about to expire | 1. View favorited deal expiring in 2 hours | In-app banner: "This deal expires soon!" | | Medium |
| **NOT-013** | Notification Preferences | Toggle notifications | 1. Go to settings<br>2. Disable "Deal alerts" | No more deal notifications sent | | Medium |
| **NOT-014** | Notification Preferences | Category-specific toggles | 1. Disable "Food" notifications<br>2. New food deal added | No food notification, other categories still notify | | Medium |
| **NOT-015** | Notification Delivery | Silent notification | 1. Receive background sync notification | App updates data without showing visible notification | | Low |

---

## 5. CROSS-PLATFORM TEST CASES

| Test Case ID | Feature | Scenario | Test Steps | Expected Result | Actual Result | Severity |
|--------------|---------|----------|------------|-----------------|---------------|----------|
| **XPLAT-001** | iOS vs Android | Auth token storage | 1. Login on iOS<br>2. Login on Android<br>3. Check token storage | Both use HTTP-only cookies, no localStorage | | Critical |
| **XPLAT-002** | iOS vs Android | Location permission flow | 1. First open on iOS<br>2. First open on Android | Platform-appropriate permission dialogs | | High |
| **XPLAT-003** | iOS vs Android | Back navigation | 1. Navigate 3 levels deep<br>2. Press back | iOS: swipe or button, Android: back button - both work | | Medium |
| **XPLAT-004** | iOS vs Android | Image picker | 1. Upload avatar image | Platform-native image picker opened | | Medium |
| **XPLAT-005** | iOS vs Android | Share sheet | 1. Share deal | Platform-native share sheet with appropriate options | | Medium |
| **XPLAT-006** | iOS vs Android | Map integration | 1. Tap "Get Directions" | Opens Apple Maps (iOS) or Google Maps (Android) | | High |
| **XPLAT-007** | iOS vs Android | Push notification handling | 1. Receive notification on lock screen | Platform-appropriate lock screen UI | | Medium |
| **XPLAT-008** | iOS vs Android | Text input | 1. Type in search bar | Platform-appropriate keyboard (autocorrect behavior) | | Low |
| **XPLAT-009** | iOS vs Android | Safe area handling | 1. View app on device with notch | UI properly respects safe areas | | Medium |
| **XPLAT-010** | Cross-Platform | Data sync | 1. Favorite on iOS<br>2. Login on Android | Favorite appears on Android (synced via server) | | High |

---

## 6. ACCESSIBILITY TEST CASES

| Test Case ID | Feature | Scenario | Test Steps | Expected Result | Actual Result | Severity |
|--------------|---------|----------|------------|-----------------|---------------|----------|
| **A11Y-001** | Screen Reader | Navigate app | 1. Enable VoiceOver/TalkBack<br>2. Navigate app | All elements announced correctly, logical order | | High |
| **A11Y-002** | Screen Reader | Form labels | 1. Navigate to login form | Labels announced before inputs (e.g., "Email, text field") | | High |
| **A11Y-003** | Screen Reader | Button actions | 1. Focus on favorite button | "Add to favorites, button" or "Remove from favorites, button" | | Medium |
| **A11Y-004** | Dynamic Text | Increase font size | 1. Increase system font size to max | Text scales appropriately, layout doesn't break | | Medium |
| **A11Y-005** | Color Contrast | All text | 1. Check all text against WCAG AA | Contrast ratio ≥4.5:1 for normal text | | Medium |
| **A11Y-006** | Color Blindness | Status indicators | 1. View deal status indicators | Not color-only (icons/text also indicate status) | | Medium |
| **A11Y-007** | Touch Targets | All interactive elements | 1. Measure button sizes | Minimum 44x44 points (iOS) or 48x48dp (Android) | | Medium |
| **A11Y-008** | Keyboard Navigation | External keyboard | 1. Connect keyboard<br>2. Tab through interface | Logical tab order, visible focus indicators | | Medium |
| **A11Y-009** | Motor Accessibility | Reduce motion | 1. Enable reduce motion setting | Animations reduced/disabled | | Low |
| **A11Y-010** | Visual Accessibility | Zoom | 1. Pinch to zoom | Content remains readable, layout doesn't break | | Medium |
| **A11Y-011** | Visual Accessibility | Dark mode | 1. Enable dark mode | App supports dark mode or respects system setting | | Low |
| **A11Y-012** | Cognitive | Error messages | 1. Trigger error | Clear, specific error messages with actionable next steps | | Medium |

---

## 7. LOCALIZATION & INTERNATIONALIZATION TEST CASES

| Test Case ID | Feature | Scenario | Test Steps | Expected Result | Actual Result | Severity |
|--------------|---------|----------|------------|-----------------|---------------|----------|
| **L10N-001** | Thai Language | UI in Thai | 1. Set language to Thai<br>2. Navigate app | All UI text in Thai, no English fallback | | High |
| **L10N-002** | Thai Language | Input in Thai | 1. Search with Thai text | Search works correctly with Thai characters | | High |
| **L10N-003** | Thai Language | Number formatting | 1. View savings | Numbers formatted: ฿1,234.56 (Thai locale) | | Medium |
| **L10N-004** | Thai Language | Date formatting | 1. View deal expiration | Date in Thai format (e.g., 15 ม.ค. 2026) | | Medium |
| **L10N-005** | English Language | UI in English | 1. Set language to English | All UI text in English | | High |
| **L10N-006** | Language Switch | Change language in app | 1. Switch from Thai to English | UI updates immediately, no restart needed | | Medium |
| **L10N-007** | Text Direction | LTR languages | 1. Test with English | Left-to-right layout | | Low |
| **L10N-008** | Character Encoding | Special characters | 1. Enter name with diacritics | Characters saved and displayed correctly | | Medium |
| **L10N-009** | String Length | Translated text fit | 1. Check all UI with long German words | Text doesn't overflow or get truncated | | Medium |
| **L10N-010** | Currency | Thai Baht symbol | 1. View prices | ฿ symbol used consistently | | Medium |
| **L10N-011** | Calendar | Buddhist calendar | 1. View dates in Thai mode | Buddhist year (2567) or Gregorian (2024) based on setting | | Low |
| **L10N-012** | Address Formatting | Thai addresses | 1. Enter Thai address format | Address fields accommodate Thai format | | Low |

---

## 8. THIRD-PARTY INTEGRATION TEST CASES

| Test Case ID | Feature | Scenario | Test Steps | Expected Result | Actual Result | Severity |
|--------------|---------|----------|------------|-----------------|---------------|----------|
| **3RD-001** | Google Maps | Get directions | 1. Tap "Get Directions" on deal | Opens in appropriate map app with coordinates | | High |
| **3RD-002** | Google Maps | Map view load | 1. Open map view | Map tiles load correctly with deal pins | | High |
| **3RD-003** | Google Maps | Map pinch/zoom | 1. Pinch to zoom on map | Map zooms smoothly, pins remain accurate | | Medium |
| **3RD-004** | Share | Native share sheet | 1. Tap share on deal | Native share sheet opens with deal details | | Medium |
| **3RD-005** | Share | Share to LINE | 1. Select LINE from share sheet | Deal formatted correctly for LINE | | Medium |
| **3RD-006** | Share | Share to Facebook | 1. Select Facebook from share sheet | Open graph tags used, preview shown | | Medium |
| **3RD-007** | Analytics | Event tracking | 1. Perform various actions | Events logged to analytics (GA/Firebase) | | Low |
| **3RD-008** | Crash Reporting | Crash handling | 1. Force crash (test mode) | Crash reported to crash service | | High |
| **3RD-009** | Push Service | Token registration | 1. Grant notification permission | Push token registered with backend | | High |
| **3RD-010** | Push Service | Token refresh | 1. Push token changes | New token sent to backend | | High |
| **3RD-011** | Image Storage | Upload image | 1. Upload avatar | Image uploaded to cloud storage, URL returned | | Medium |
| **3RD-012** | Image Storage | Image optimization | 1. Upload large image | Image automatically compressed/optimized | | Low |
| **3RD-013** | Email Service | Password reset email | 1. Request password reset | Email sent via email service | | Critical |
| **3RD-014** | Email Service | Email template | 1. Receive password reset email | Email properly formatted with brand styling | | Medium |
| **3RD-015** | SMS Service | OTP via SMS (if applicable) | 1. Request OTP via SMS | SMS sent with OTP code | | Medium |

---

## SUMMARY

**Total Additional Test Cases:** 195

| Category | Test Cases | Critical | High | Medium | Low |
|----------|------------|----------|------|--------|-----|
| API Integration | 65 | 12 | 28 | 20 | 5 |
| Database & Data Integrity | 20 | 3 | 7 | 8 | 2 |
| Network & Connectivity | 15 | 0 | 7 | 7 | 1 |
| Notifications | 15 | 0 | 5 | 7 | 3 |
| Cross-Platform | 10 | 1 | 3 | 4 | 2 |
| Accessibility | 12 | 0 | 5 | 6 | 1 |
| Localization | 12 | 0 | 6 | 5 | 1 |
| Third-Party Integration | 15 | 1 | 6 | 5 | 3 |
| **Total** | **164** | **17** | **62** | **62** | **18** |

---

**End of Additional Test Cases Document**
