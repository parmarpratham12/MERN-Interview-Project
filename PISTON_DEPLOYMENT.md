# Piston Code Execution API Solutions

This document outlines the solutions for resolving the `401 Unauthorized` error on the Piston API (`emkc.org/api/v2/piston/execute`) both during **Local Development** and for **Production Deployment**.

---

## 🔍 The Problem
As of February 15, 2026, the public Piston execution server provided by EMKC requires authorization. Public, unauthenticated requests to `https://emkc.org/api/v2/piston/execute` will result in:
`Failed to load resource: the server responded with a status of 401 (Unauthorized)`

---

## 🛠️ Solution 1: Local Development (Docker)
Since Piston is fully open-source, you can run a local instance of the execution engine. This is completely free, has no rate limits, and requires no API keys.

### Steps:
1. **Start Docker** on your machine.
2. Run the following command in your terminal to download and run the Piston API server:
   ```bash
   docker run -d -p 2000:2000 engineer-man/piston
   ```
3. Update `PISTON_API` in `frontend/src/lib/piston.js`:
   ```javascript
   const PISTON_API = "http://localhost:2000/api/v2/piston";
   ```

---

## 🚀 Solution 2: Production Deployment (Self-Hosted Cloud)
To make code execution work on your live deployed website, you can host the Piston Docker image on a free or low-cost cloud container provider.

### Recommended Free/Cheap Hosting Services:
1. **Koyeb** (Easiest / Free tier):
   * Select **Deploy App**.
   * Choose **Docker Hub** as the source.
   * Enter `engineer-man/piston` as the image name.
   * Set the port to `2000`.
   * Koyeb will deploy the container and give you a public URL (e.g., `https://my-piston-app.koyeb.app`).
2. **Render** / **Railway**:
   * Create a new web service/service using the `engineer-man/piston` Docker image.

### Frontend Configuration:
Update `frontend/src/lib/piston.js` to dynamically use the cloud Piston URL or fallback to local Docker:
```javascript
const PISTON_API = import.meta.env.VITE_PISTON_API || "https://your-deployed-piston-url.com/api/v2/piston";
```

---

## 🔑 Solution 3: Requesting an EMKC API Key
If you prefer not to host a server, you can apply for a key to continue using the official hosted EMKC endpoint.

### Steps:
1. Join the **EngineerMan Discord Server**.
2. Request a developer/educational API key.
3. Add the key to your environment variables in Vercel/Render.
4. Pass the key in your request headers inside `frontend/src/lib/piston.js`:
   ```javascript
   const response = await fetch(`${PISTON_API}/execute`, {
       method: "POST",
       headers: {
           "Content-Type": "application/json",
           "Authorization": import.meta.env.VITE_PISTON_KEY // Set this in Vercel/Render envs
       },
       body: JSON.stringify({ ... })
   });
   ```

---

## ⚡ Solution 4: Switch to Judge0 (RapidAPI Free Tier)
If you want an instantly available managed API without self-hosting, switch to **Judge0**:
* Sign up for a free account on **RapidAPI**.
* Subscribe to the free tier of the **Judge0** API (includes 50 free executions/day).
* Modify the request format in `piston.js` to target the Judge0 endpoints using your RapidAPI Key.
