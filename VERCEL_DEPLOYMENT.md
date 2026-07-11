# Vercel Deployment & Inngest Integration Guide

This guide contains the solution to run the Express backend on Vercel as a Serverless Function to resolve the `404 (Not Found)` error for `/api/inngest`.

---

## 1. Files Already Created in Workspace

The following files have already been created at your project root:
* **`vercel.json`**: Sets up routing for `/api/*` to the serverless function.
* **`api/index.js`**: Serverless function entry point that loads the Express server.

---

## 2. Changes to Apply to `backend/src/server.js` Later

When you are ready to enable Vercel hosting, modify [backend/src/server.js](file:///d:/React-Native/MERN%20Interview%20Project/backend/src/server.js) with the following changes:

```javascript
// 1. Add 'export default app;' at the end of the file
export default app;

// 2. Wrap app.listen() with a check for process.env.VERCEL
const startServer = async () => {
  try {
    await connectDB();  
    
    // Check if running on Vercel before listening to port
    if (!process.env.VERCEL) {
      app.listen(ENV.PORT, () => {
        console.log("server is running on port ", ENV.PORT);
      });
    } else {
      console.log("Running in serverless/Vercel environment, skipping app.listen()");
    }
  } 
  catch (error) {
    console.error("❌Connection failed due to ", error);
    process.exit(1);
  }
};
```

---

## 3. Environment Variables (Vercel Dashboard)

Ensure all variables in `backend/.env` are added under **Settings > Environment Variables** in your Vercel Project Dashboard:
* `DB_URL`
* `CLIENT_URL`
* `INNGEST_EVENT_KEY`
* `INNGEST_SIGNING_KEY`
* Any other API/Stream keys

---

## 4. Crucial: Bypass Vercel Deployment Protection (Login Gate)

By default, Vercel protects preview deployments (URLs containing random hashes like `*-kjx9-4wcpdavgk.vercel.app`) with a **Vercel Login Page**. Because of this, Inngest will be redirected to the login page and fail to reach your endpoint.

### Option A: Disable Deployment Protection (Easiest)
1. Go to your **Vercel Dashboard** -> Select your Project.
2. Go to **Settings** -> **Deployment Protection**.
3. Under **Vercel Authentication**, set it to **Disabled**.
4. Click **Save**.

### Option B: Use Bypass Token (More Secure)
1. Go to **Settings** -> **Deployment Protection** in the Vercel Dashboard.
2. Locate **Protection Bypass for Automation** and enable it.
3. Vercel will generate a secret token (e.g. `your-bypass-secret`).
4. Append this token to your Inngest Sync / Webhook URL as a query parameter:
   `https://mern-interview-project-kjx9-4wcpdavgk.vercel.app/api/inngest?x-vercel-protection-bypass=YOUR_SECRET`
