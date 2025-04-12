# Clone Coding Task
Hi!

Stack: \
**Frontend**: TypeScript, React, Vite, TailwindCSS \
**Backend**: Python, FastAPI, WebSocket

# Running

## Docker
Run `docker compose up`. \
App should be up on [http://127.0.0.1:5173/](http://127.0.0.1:5173/). \
To configure host/port/log level/refresh rate, we need to use ENV variables.

Available environment variables:
   - HOST (default: 0.0.0.0)
   - PORT (default: 5487)
   - RATE (default: 10)
   - LOG_LEVEL (default: info)

Example of running with setting different refresh rate:

- **Windows (PowerShell)**: \
    `$ENV:RATE=15; docker compose up`

- **Linux/macOS**: \
    `RATE=15 docker compose up`



**Warning**:
1. If you change environment variables, Docker will use them as default values in future runs.
2. Frontend is configured to connect with backend on port `5487`. Changing port requires a change in frontend URL.

## Starting manually

### Frontend
- `npm install`
- `npm run dev`

### Backend
Prerequisites: poetry

- `poetry install`
- `poetry run python app/main.py`

The HTTP server can be configured using command-line arguments:
```
> poetry run python app/main.py -h
usage: main.py [-h] [--host HOST] [--port PORT] [--log-level {critical,error,warning,info,debug,trace}] [--rate RATE]

optional arguments:
  -h, --help            show this help message and exit
  --host HOST           Sets server's host. Defaults to localhost.
  --port PORT           Sets server's port. Defaults to 5487.
  --log-level {critical,error,warning,info,debug,trace}
                        Sets the log level for the server.
  --rate RATE           Controls how often new state is available. Defaults to 10Hz.
```

# Changes from requirements
1. TypeScript instead of JavaScript - safer, more readable, pretty much self-documenting code. List of advantages can go on an on. Currently, a standard in web development. Transpiled to JavaScript when building, anyway. 
2. Uptime calculated by current time - start time, so we're saving the start timestamp rather than uptime. Since uptime is counted in every state except for `offline`, and robot starts with 0 uptime, all we need to know to calculate uptime is the start time. Simple and we don't need to "count" the uptime. I'm not sure if this was the intended approach, or if I was supposed to calculate uptime based on ticks and refresh rate, which doesn't seem ideal.
3. Added fan mode to robot state - it's necessary for the fan mode control to work.
4. Not really a change, more like addition for the mock state - there's a 1/1000 chance of an error occuring, which changes status to `error`.