# CF Worker - Internal 500 Repro

## Build locally
```
pnpm install
pnpm run dev
```

## Deploy Repo With CF Worker

Make a new worker and connect repo to the worker.

Set Worker build config as:

Build command:  
`pnpm run build`

Deploy command:  
`pnpm run deploy`

Set ENV vars:  
BETTER_AUTH_SECRET=randomString

Run deployment
