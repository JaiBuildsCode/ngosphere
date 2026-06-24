# NGOSphere Architectural Audit — Day 1

## Unhandled Exceptions & Missing Try/Catch Blocks
- [ ] `POST /api/register-ngo`: Uses `...req.body` blindly without schema extraction or input isolation.
- [ ] `PUT /api/ngos/:id/donate`: (Before fix) Had no input validation for negative numbers, causing silent database corruption.

## Incorrect HTTP Status Codes (500 vs 400)
- [ ] `PUT /api/ngos/:id/donate`: Passes invalid 21-character strings straight to Mongoose, triggering a database `CastError` and throwing an architectural 500 instead of a client-side 400.

## Exposed Internal Errors / Data Leaks
- [ ] Multiple Routes: Sending `err.message` directly back to the client via `res.send()` or `res.status(500)`, exposing backend directory paths and database architecture to the public network.

## Day 2: Request/Response Cycle Sabotage Log
**Objective:** Executed deliberate Chaos Engineering on the Express backend to identify and patch three critical points of failure in the request cycle.

### 1. The Double Header Crash (`ERR_HTTP_HEADERS_SENT`)
- **The Vulnerability:** Node.js enforces a strict 1-to-1 request/response cycle. If the server executes two `res.json()` or `res.send()` commands in a single route, the runtime panics and crashes the entire backend.
- **The Trigger:** Usually caused by an `if/else` block that sends an error response but fails to stop the execution thread, allowing a success response to fire immediately after.
- **The Patch (Production Standard):** Always use the `return` keyword for early exits. (e.g., `if (error) return res.status(400).json(...)`). 

### 2. The Black Hole (Middleware Limbo)
- **The Vulnerability:** If a middleware function executes but fails to explicitly resolve the request, the client connection hangs indefinitely until timeout. This causes silent failures, memory leaks, and server exhaustion.
- **The Trigger:** Forgetting to pass the execution baton in custom middleware or validation pipelines.
- **The Patch (Production Standard):** Every piece of middleware must end in exactly one of two ways: intercepting and closing the request (e.g., `res.status(401)`) OR explicitly calling `next()` to pass control down the chain.

### 3. The Silent Assassin (`TypeError: Cannot read properties of undefined`)
- **The Vulnerability:** The most common fatal crash in JavaScript. Occurs when the backend assumes external data (like a database query result) exists and attempts to read a property from it.
- **The Trigger:** Trusting database responses blindly. E.g., `const user = await DB.find(); console.log(user.name);` when the user does not exist.
- **The Patch (Production Standard):** Implement explicit Guard Clauses (`if (!user) return res.status(404)...`) to catch failures and send proper HTTP status codes. Do not rely on Optional Chaining (`user?.name`) to mask missing critical data, as it leads to sending false `200 OK` success states to the client.
# System Audit & Deployment Log
## Architecture & Security Integration Marathon

**Status:** Live on Render | Database: MongoDB Atlas | Frontend: Connected & Secured

### 1. Backend Hardening (The Warehouse)
* **Authentication Engineered:** Implemented `bcryptjs` for secure password hashing and `jsonwebtoken` (JWT) for stateless session verification. 
* **Database Secured:** Severed hardcoded credentials. Rotated MongoDB Atlas keys and injected them securely via Render environment variables (`MONGO_URI`, `JWT_SECRET`).
* **Route Protection:** Built and deployed `requireAuth` middleware. Locked down state-changing endpoints (POST/PATCH/DELETE) so only cryptographically verified admins can modify the `volunteers` and `ngos` collections.
* **CORS Configured:** Configured Cross-Origin Resource Sharing to strictly accept connections from the production React frontend, preventing unauthorized domains from querying the API.
* **Bug Fixes:** Hunted down and eliminated routing conflicts (e.g., the duplicate `/api/api/admin/ngos` 404 error).

### 2. Frontend Integration (The Storefront)
* **Live Server Wiring:** Rewrote API fetch logic to point away from `localhost` and lock onto the live Render backend URL (`https://ngo-guide-portal.onrender.com/api`).
* **State Management Corrections:** Resolved fatal React Strict Mode crashes by properly declaring state variables (`const [volunteers, setVolunteers] = useState([])`) and killing ghost variables (`dynamicData`).
* **Syntax Debugging:** Hunted down runtime killers (the `con` typo in checkout) that were successfully bypassing the local compiler but crashing the production build.
* **Data Flow Verified:** The Recharts dashboard is now actively pulling real array data from the cloud database and rendering it on the screen.

### 3. Operational Reality
The application is no longer a local sandbox. It is a distributed, two-server architecture communicating securely across the internet. 

**Pending Threat Surface (Day 3 Security Drills):**
- [ ] Test tampered JWT rejection handling.
- [ ] Test JWT secret rotation session invalidation.
- [ ] Audit IDOR (Insecure Direct Object Reference) vulnerabilities on record modification routes.