# Clone Coding Task
Hi.

Stack:
TS + React + Vite for frontend

Python + FastAPI for backend

# Changes from requirements
1. TypeScript instead of JavaScript - safer, more readable, pretty much self-documenting code. List of advantages can go on an on. Currently, a standard in web development. Transpiled to JavaScript, anyway. 
2. Uptime calculated by current time - start time, so we're saving the start timestamp rather than uptime. Since uptime is counted in every state except for `offline`, and robot starts with 0 uptime, all we need to know to calculate uptime is the start time. Simple and we don't need to "count" the uptime.