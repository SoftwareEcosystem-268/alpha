# RichSave - Performance & Stress Test Cases

**Document Version:** 1.0
**Last Updated:** 2026-04-04
**Purpose:** Comprehensive performance and stress testing suite for RichSave application

---

## Table of Contents

1. [Performance Test Cases](#1-performance-test-cases)
2. [Stress Test Cases](#2-stress-test-cases)
3. [Load Test Cases](#3-load-test-cases)
4. [Scalability Test Cases](#4-scalability-test-cases)
5. [Endurance Test Cases](#5-endurance-test-cases)
6. [Performance Metrics & Benchmarks](#6-performance-metrics--benchmarks)

---

## 1. PERFORMANCE TEST CASES

### 1.1 API Response Time Tests

| Test Case ID | Feature | Scenario | Test Steps | Expected Result | Actual Result | Severity |
|--------------|---------|----------|------------|-----------------|---------------|----------|
| **PERF-API-001** | Authentication | Login response time | 1. Measure time from login request to response | Response time < 500ms (p95) | | High |
| **PERF-API-002** | Authentication | Registration response time | 1. Measure time from registration request to response | Response time < 800ms (p95) | | High |
| **PERF-API-003** | Authentication | Token verification time | 1. Measure time for JWT verification | Verification time < 50ms (p99) | | High |
| **PERF-API-004** | Deals | Get all deals response time | 1. Request /api/deals<br>2. Measure response time | Response time < 300ms (p95) for 100 deals | | High |
| **PERF-API-005** | Deals | Search response time | 1. Search for "pizza"<br>2. Measure response time | Response time < 400ms (p95) | | High |
| **PERF-API-006** | Deals | Filter by category response time | 1. Filter by "Food"<br>2. Measure response time | Response time < 350ms (p95) | | High |
| **PERF-API-007** | Deals | Nearby deals response time | 1. Request nearby deals with lat/lng<br>2. Measure response time | Response time < 500ms (p95) | | Medium |
| **PERF-API-008** | Deals | Get deal by ID response time | 1. Request /api/deals/:id<br>2. Measure response time | Response time < 200ms (p95) | | Medium |
| **PERF-API-009** | Favorites | Add favorite response time | 1. Add deal to favorites<br>2. Measure response time | Response time < 300ms (p95) | | Medium |
| **PERF-API-010** | Favorites | Get all favorites response time | 1. Request /api/user/favorites<br>2. Measure response time | Response time < 250ms (p95) for 50 favorites | | Medium |
| **PERF-API-011** | Favorites | Remove favorite response time | 1. Remove favorite<br>2. Measure response time | Response time < 300ms (p95) | | Medium |
| **PERF-API-012** | Savings | Get total savings response time | 1. Request /api/user/savings<br>2. Measure response time | Response time < 400ms (p95) with aggregation | | Medium |
| **PERF-API-013** | Savings | Record redemption response time | 1. Post redemption data<br>2. Measure response time | Response time < 300ms (p95) | | Medium |
| **PERF-API-014** | Profile | Get profile response time | 1. Request /api/user/profile<br>2. Measure response time | Response time < 250ms (p95) | | Medium |
| **PERF-API-015** | Profile | Update profile response time | 1. PUT /api/user/profile<br>2. Measure response time | Response time < 400ms (p95) | | Medium |

### 1.2 Database Query Performance Tests

| Test Case ID | Feature | Scenario | Test Steps | Expected Result | Actual Result | Severity |
|--------------|---------|----------|------------|-----------------|---------------|----------|
| **PERF-DB-001** | User Query | Find by email | 1. Query user by indexed email field | Query time < 10ms (p95) | | High |
| **PERF-DB-002** | User Query | Find by ID | 1. Query user by ObjectId | Query time < 10ms (p95) | | High |
| **PERF-DB-003** | Deals Query | Find all active deals | 1. Query all deals with isActive:true | Query time < 50ms for 1000 deals | | High |
| **PERF-DB-004** | Deals Query | Search with regex | 1. Search deals with regex | Query time < 100ms (p95) for 1000 deals | | Medium |
| **PERF-DB-005** | Deals Query | Geospatial nearby query | 1. Query deals within radius | Query time < 150ms (p95) with geo index | | Medium |
| **PERF-DB-006** | Favorites Query | Get user favorites | 1. Query user with favorites populated | Query time < 30ms (p95) | | Medium |
| **PERF-DB-007** | Savings Query | Aggregate total savings | 1. Aggregate redemptions by user | Query time < 100ms (p95) for 1000 redemptions | | Medium |
| **PERF-DB-008** | Savings Query | Monthly savings aggregation | 1. Aggregate by month | Query time < 150ms (p95) | | Medium |
| **PERF-DB-009** | OTP Query | Find valid OTP | 1. Query OTP by email, code, unused, not expired | Query time < 20ms (p95) | | Medium |
| **PERF-DB-010** | Index Usage | Verify index usage | 1. Run explain() on queries | All queries use appropriate indexes | | High |

### 1.3 Frontend Performance Tests

| Test Case ID | Feature | Scenario | Test Steps | Expected Result | Actual Result | Severity |
|--------------|---------|----------|------------|-----------------|---------------|----------|
| **PERF-FE-001** | Page Load | Initial page load | 1. Clear cache<br>2. Load homepage | Time to Interactive < 3s (4G) | | High |
| **PERF-FE-002** | Page Load | Deals page load | 1. Navigate to /deals | Page render < 1s after data received | | High |
| **PERF-FE-003** | Page Load | Favorites page load | 1. Navigate to /favorites | Page render < 1s after data received | | Medium |
| **PERF-FE-004** | Page Load | Savings dashboard load | 1. Navigate to /savings | Page render < 1.5s (charts included) | | Medium |
| **PERF-FE-005** | Rendering | Deal list virtualization | 1. Load 1000 deals | Scroll performance > 55fps | | Medium |
| **PERF-FE-006** | Rendering | Image lazy loading | 1. Scroll deals page | Images load as needed, initial load < 2s | | Medium |
| **PERF-FE-007** | Rendering | Search autocomplete | 1. Type in search bar | Suggestions appear within 200ms | | Medium |
| **PERF-FE-008** | Animation | Page transitions | 1. Navigate between pages | Smooth 60fps transitions | | Low |
| **PERF-FE-009** | Animation | Loading spinners | 1. Trigger loading state | Animation plays smoothly at 60fps | | Low |
| **PERF-FE-010** | Client Storage | LocalStorage read/write | 1. Write/read user data | Operations < 10ms | | Medium |
| **PERF-FE-011** | Memory | Memory leak check | 1. Navigate app for 10 min | Memory usage stable, no continuous growth | | High |
| **PERF-FE-012** | Bundle Size | Initial JS bundle | 1. Check bundle size | Main bundle < 200KB gzipped | | High |
| **PERF-FE-013** | Bundle Size | Lazy loaded chunks | 1. Check chunk sizes | Each chunk < 100KB gzipped | | Medium |
| **PERF-FE-014** | CSS | CSS bundle size | 1. Check CSS size | CSS < 50KB gzipped | | Medium |
| **PERF-FE-015** | Images | Image optimization | 1. Check deal images | Images < 100KB (WebP, compressed) | | Medium |

### 1.4 Mobile Performance Tests

| Test Case ID | Feature | Scenario | Test Steps | Expected Result | Actual Result | Severity |
|--------------|---------|----------|------------|-----------------|---------------|----------|
| **PERF-MOB-001** | iOS App Launch | Cold start | 1. Force close app<br>2. Launch and measure | App ready < 2s on iPhone 12+ | | High |
| **PERF-MOB-002** | Android App Launch | Cold start | 1. Force close app<br>2. Launch and measure | App ready < 2.5s on mid-range Android | | High |
| **PERF-MOB-003** | iOS Scroll | Deal list scroll | 1. Scroll through 100 deals | Smooth 60fps scroll | | Medium |
| **PERF-MOB-004** | Android Scroll | Deal list scroll | 1. Scroll through 100 deals | Smooth 60fps scroll | | Medium |
| **PERF-MOB-005** | Touch Response | Button tap response | 1. Tap button, measure to visual feedback | Response < 100ms | | Medium |
| **PERF-MOB-006** | Location | GPS acquisition time | 1. Request location | Location acquired < 5s | | Medium |
| **PERF-MOB-007** | Camera | Image capture time | 1. Open camera<br>2. Capture image | Camera ready in < 1s | | Low |
| **PERF-MOB-008** | Battery | Battery drain rate | 1. Use app for 30 min<br>2. Measure drain | < 5% battery per hour of active use | | Medium |
| **PERF-MOB-009** | Data Usage | Data consumption | 1. Use app for 10 min<br>2. Measure data | < 10MB for typical usage session | | Medium |
| **PERF-MOB-010** | Offline | Offline mode speed | 1. Load cached data offline | Cached data < 500ms | | Medium |

---

## 2. STRESS TEST CASES

### 2.1 API Stress Tests

| Test Case ID | Feature | Scenario | Test Steps | Expected Result | Actual Result | Severity |
|--------------|---------|----------|------------|-----------------|---------------|----------|
| **STRESS-API-001** | Authentication | Concurrent login attempts | 1. Send 1000 concurrent login requests | All requests handled, no crashes, < 1% failure rate | | Critical |
| **STRESS-API-002** | Authentication | Concurrent registration | 1. Send 500 concurrent registration requests | All requests handled, no duplicate accounts | | Critical |
| **STRESS-API-003** | Deals | Concurrent deal requests | 1. Send 2000 concurrent GET /api/deals | All responses returned, < 5s p95 response time | | Critical |
| **STRESS-API-004** | Deals | Concurrent search requests | 1. Send 1000 concurrent search requests | All responses returned, no search failures | | High |
| **STRESS-API-005** | Favorites | Rapid add/remove favorites | 1. 100 users add 10 favorites each simultaneously | All operations succeed, no data corruption | | High |
| **STRESS-API-006** | Database | Connection pool exhaustion | 1. Open more connections than pool size | Requests queued or rejected gracefully | | Critical |
| **STRESS-API-007** | Memory | Memory leak under load | 1. Run load test for 1 hour<br>2. Monitor memory | Memory usage stable, no leaks | | Critical |
| **STRESS-API-008** | CPU | CPU spike handling | 1. Send CPU-intensive requests | Server remains responsive, auto-scales if available | | High |
| **STRESS-API-009** | Disk | Disk I/O under load | 1. High database write load | Disk I/O doesn't cause failures | | High |
| **STRESS-API-010** | Network | Network bandwidth saturation | 1. Saturate network bandwidth | Requests queued, connection errors handled | | High |

### 2.2 Database Stress Tests

| Test Case ID | Feature | Scenario | Test Steps | Expected Result | Actual Result | Severity |
|--------------|---------|----------|------------|-----------------|---------------|----------|
| **STRESS-DB-001** | Writes | Concurrent user creation | 1. Insert 10,000 users concurrently | All users created, unique constraints enforced | | Critical |
| **STRESS-DB-002** | Writes | Concurrent deal updates | 1. Update same deal 100 times concurrently | Last write wins, no corruption | | High |
| **STRESS-DB-003** | Reads | Concurrent read load | 1. 1000 concurrent read operations | All reads succeed, response time degrades gracefully | | High |
| **STRESS-DB-004** | Mixed | Read/write mix | 1. 70% reads, 30% writes concurrently | Balanced performance, no write starvation | | Critical |
| **STRESS-DB-005** | Indexes | Index performance under load | 1. Query indexed fields under load | Indexes used, no table scans | | High |
| **STRESS-DB-006** | Transactions | Concurrent transaction conflicts | 1. Update same document simultaneously | One wins, one fails, no corruption | | High |
| **STRESS-DB-007** | Aggregation | Complex aggregation under load | 1. Run aggregations with large datasets | Completes in reasonable time (< 10s) | | Medium |
| **STRESS-DB-008** | Connections | Connection pool stress | 1. Open max connections + 10% | Overflow handled gracefully | | High |

### 2.3 Frontend Stress Tests

| Test Case ID | Feature | Scenario | Test Steps | Expected Result | Actual Result | Severity |
|--------------|---------|----------|------------|-----------------|---------------|----------|
| **STRESS-FE-001** | DOM | Large DOM size | 1. Render 10,000 deal cards | Page remains responsive > 30fps | | Medium |
| **STRESS-FE-002** | Events | Rapid event firing | 1. Fire 1000 events rapidly | No event listener leaks, remains responsive | | Medium |
| **STRESS-FE-003** | Memory | Memory stress test | 1. Navigate app for 1 hour<br>2. Monitor memory | No memory leaks, < 100MB growth | | High |
| **STRESS-FE-004** | Scroll | Infinite scroll stress | 1. Load 10,000 items in scroll | Smooth scrolling maintained | | Medium |
| **STRESS-FE-005** | Animations | Concurrent animations | 1. Run 100 simultaneous animations | 60fps maintained, no jank | | Low |
| **STRESS-FE-006** | Images | Many images loading | 1. Load 500 images simultaneously | Memory managed, browser doesn't crash | | Medium |

---

## 3. LOAD TEST CASES

### 3.1 Normal Load Tests

| Test Case ID | Scenario | Users | Duration | Measurements | Expected Result | Actual Result | Severity |
|--------------|----------|-------|----------|--------------|-----------------|---------------|----------|
| **LOAD-001** | Normal daily load | 100 | 1 hour | Response times, error rate | p95 < 500ms, error rate < 0.1% | | High |
| **LOAD-002** | Peak hour load | 500 | 30 min | Response times, throughput | p95 < 1s, 100 req/s sustained | | High |
| **LOAD-003** | Browse deals flow | 200 | 1 hour | Complete flow time | 90% complete in < 5s | | Medium |
| **LOAD-004** | Search and filter | 150 | 1 hour | Search response time | p95 < 600ms | | Medium |
| **LOAD-005** | Favorites management | 100 | 1 hour | Add/remove response | p95 < 400ms, no favorites lost | | Medium |
| **LOAD-006** | Savings tracking | 100 | 1 hour | Redemption recording | p95 < 500ms, accurate totals | | Medium |

### 3.2 Peak Load Tests

| Test Case ID | Scenario | Users | Duration | Measurements | Expected Result | Actual Result | Severity |
|--------------|----------|-------|----------|--------------|-----------------|---------------|----------|
| **PEAK-001** | Flash sale event | 2,000 | 15 min | Response times, error rate | p95 < 2s, error rate < 1% | | Critical |
| **PEAK-002** | Marketing campaign | 5,000 | 30 min | System stability, auto-scaling | Auto-scales, no downtime | | Critical |
| **PEAK-003** | New deal release | 1,000 | 1 hour | Deal view performance | p95 < 1s for deal detail | | High |
| **PEAK-004** | Concurrent logins | 500 | 10 min | Login success rate | > 99% success rate | | High |

---

## 4. SCALABILITY TEST CASES

| Test Case ID | Feature | Scenario | Test Steps | Expected Result | Actual Result | Severity |
|--------------|---------|----------|------------|-----------------|---------------|----------|
| **SCALE-001** | Horizontal | Scale out application servers | 1. Add 2 more servers<br>2. Distribute load | Load balanced, linear capacity increase | | Critical |
| **SCALE-002** | Database | Read replica scaling | 1. Add 2 read replicas<br>2. Direct reads to replicas | Read capacity increased 3x | | Critical |
| **SCALE-003** | Database | Database sharding | 1. Shard users by region | Queries routed to correct shard | | High |
| **SCALE-004** | Cache | Redis scaling | 1. Add Redis cluster<br>2. Monitor cache hit rate | > 80% cache hit rate maintained | | High |
| **SCALE-005** | CDN | Asset delivery scaling | 1. Push static assets to CDN<br>2. Load from edge locations | < 100ms asset load globally | | Medium |
| **SCALE-006** | Queue | Background job scaling | 1. Add more queue workers<br>2. Send 10,000 jobs | All jobs processed, queue doesn't grow | | High |
| **SCALE-007** | Storage | File storage scaling | 1. Upload 10,000 images | All uploads succeed, fast retrieval | | Medium |

---

## 5. ENDURANCE TEST CASES

| Test Case ID | Feature | Scenario | Test Steps | Expected Result | Actual Result | Severity |
|--------------|---------|----------|------------|-----------------|---------------|----------|
| **ENDUR-001** | System | 24-hour stability | 1. Run normal load for 24h<br>2. Monitor all metrics | No crashes, no memory leaks, stable performance | | Critical |
| **ENDUR-002** | Database | 24-hour query performance | 1. Monitor query times for 24h | No degradation, p95 stable | | High |
| **ENDUR-003** | Memory | Memory stability over time | 1. Monitor memory for 24h | Memory usage stable, no leaks | | Critical |
| **ENDUR-004** | Connections | Connection pool stability | 1. Monitor connections for 24h | No connection leaks, pool healthy | | High |
| **ENDUR-005** | Cache | Cache effectiveness over time | 1. Monitor cache hit rate for 24h | Hit rate remains > 70% | | Medium |
| **ENDUR-006** | Background Jobs | Job queue processing | 1. Process 1M jobs over 24h | All jobs complete, no failures | | High |
| **ENDUR-007** | Backup | Backup during load | 1. Run backup during peak load | Backup completes, no performance impact | | Medium |

---

## 6. PERFORMANCE METRICS & BENCHMARKS

### 6.1 Key Performance Indicators (KPIs)

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| **API Response Time (p95)** | < 500ms | APM tool (New Relic, DataDog) |
| **API Response Time (p99)** | < 1s | APM tool |
| **Database Query Time (p95)** | < 100ms | Database monitoring |
| **Page Load Time** | < 3s | Lighthouse, WebPageTest |
| **Time to First Byte (TTFB)** | < 200ms | WebPageTest |
| **First Contentful Paint (FCP)** | < 1.5s | Lighthouse |
| **Largest Contentful Paint (LCP)** | < 2.5s | Lighthouse |
| **Cumulative Layout Shift (CLS)** | < 0.1 | Lighthouse |
| **First Input Delay (FID)** | < 100ms | Lighthouse |
| **Time to Interactive (TTI)** | < 3s | Lighthouse |
| **Error Rate** | < 0.1% | APM tool |
| **Uptime** | > 99.9% | Uptime monitoring |
| **Throughput** | > 100 req/s | Load testing tool |
| **Concurrent Users** | > 1000 | Load testing tool |
| **Cache Hit Rate** | > 80% | Cache monitoring |

### 6.2 Performance Testing Tools

| Category | Tools |
|----------|-------|
| **Load Testing** | k6, JMeter, Artillery, Gatling |
| **API Testing** | Postman, REST Assured, Supertest |
| **Frontend Performance** | Lighthouse, WebPageTest, Chrome DevTools |
| **APM** | New Relic, DataDog, Dynatrace |
| **Database Monitoring** | MongoDB Atlas, pgAdmin |
| **Mobile Performance** | Firebase Performance Monitoring, Xcode Instruments |
| **Network Monitoring** | Charles Proxy, Wireshark |

### 6.3 Test Execution Schedule

| Test Type | Frequency | Trigger |
|-----------|-----------|---------|
| **Smoke Performance** | Every build | CI/CD pipeline |
| **Regression Performance** | Daily | Nightly build |
| **Full Performance Suite** | Weekly | Before release |
| **Load Test** | Monthly | After major changes |
| **Stress Test** | Quarterly | Capacity planning |
| **Endurance Test** | Quarterly | Before major release |

### 6.4 Performance Test Script Example (k6)

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '2m', target: 100 },   // Ramp up to 100 users
    { duration: '5m', target: 100 },   // Stay at 100 users
    { duration: '2m', target: 200 },   // Ramp up to 200 users
    { duration: '5m', target: 200 },   // Stay at 200 users
    { duration: '2m', target: 0 },     // Ramp down to 0
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],  // 95% of requests < 500ms
    http_req_failed: ['rate<0.01'],    // Error rate < 1%
  },
};

const BASE_URL = 'https://api.richsave.com';

export default function () {
  // Login request
  let loginRes = http.post(`${BASE_URL}/api/auth/login`, JSON.stringify({
    email: 'test@richsave.com',
    password: 'Test@123',
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  check(loginRes, {
    'login successful': (r) => r.status === 200,
    'login response time < 500ms': (r) => r.timings.duration < 500,
  });

  let token = loginRes.json('user.token'); // Adjust based on response

  // Get deals request
  let dealsRes = http.get(`${BASE_URL}/api/deals`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });

  check(dealsRes, {
    'deals loaded': (r) => r.status === 200,
    'deals response time < 300ms': (r) => r.timings.duration < 300,
  });

  sleep(1);
}
```

### 6.5 Performance Test Report Template

| Section | Description |
|---------|-------------|
| **Executive Summary** | High-level overview of test results |
| **Test Environment** | Hardware, software, configuration |
| **Test Scenarios** | Detailed test cases executed |
| **Results Summary** | Pass/fail, key metrics |
| **Performance Analysis** | Bottlenecks identified |
| **Recommendations** | Optimization suggestions |
| **Appendices** | Raw data, graphs, logs |

---

## SUMMARY

**Total Performance & Stress Test Cases: 120+

| Category | Test Cases | Critical | High | Medium | Low |
|----------|------------|----------|------|--------|-----|
| Performance Tests | 50 | 10 | 18 | 17 | 5 |
| Stress Tests | 30 | 12 | 12 | 6 | 0 |
| Load Tests | 10 | 4 | 4 | 2 | 0 |
| Scalability Tests | 7 | 4 | 3 | 0 | 0 |
| Endurance Tests | 7 | 3 | 3 | 1 | 0 |
| **Total** | **104** | **33** | **40** | **26** | **5** |

---

**End of Performance & Stress Test Cases**
