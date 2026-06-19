# NGOSphere Architectural Audit — Day 1

## Unhandled Exceptions & Missing Try/Catch Blocks
- [ ] `POST /api/register-ngo`: Uses `...req.body` blindly without schema extraction or input isolation.
- [ ] `PUT /api/ngos/:id/donate`: (Before fix) Had no input validation for negative numbers, causing silent database corruption.

## Incorrect HTTP Status Codes (500 vs 400)
- [ ] `PUT /api/ngos/:id/donate`: Passes invalid 21-character strings straight to Mongoose, triggering a database `CastError` and throwing an architectural 500 instead of a client-side 400.

## Exposed Internal Errors / Data Leaks
- [ ] Multiple Routes: Sending `err.message` directly back to the client via `res.send()` or `res.status(500)`, exposing backend directory paths and database architecture to the public network. add 
ds
asf 
sdf
dsf
ds
f
