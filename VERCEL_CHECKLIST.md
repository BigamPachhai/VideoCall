# Deploying to Vercel

Here is a checklist of steps to deploy your application to Vercel.

## 1. Project Configuration
I have already made the necessary code changes for Vercel compatibility:
- [x] Created `vercel.json` to handle routing (API requests to backend, others to frontend).
- [x] Updated `backend/src/server.js` to run as a serverless function (exporting `app`).
- [x] Optimized MongoDB connection for serverless environments (handling connection reuse).
- [x] Updated CORS to accept `CLIENT_URL` environment variable.

## 2. Environment Variables
You need to add the following Environment Variables in your Vercel Project Settings:

### Backend Variables
- `MONGO_URI`: Your MongoDB connection string.
- `JWT_SECRET_KEY`: A secret key for signing tokens.
- `CLOUDINARY_CLOUD_NAME`: Your Cloudinary Cloud Name.
- `CLOUDINARY_API_KEY`: Your Cloudinary API Key.
- `CLOUDINARY_API_SECRET`: Your Cloudinary API Secret.
- `STREAM_API_KEY`: GetStream API Key.
- `STREAM_API_SECRET`: GetStream API Secret.
- `CLIENT_URL`: The URL of your deployed frontend (e.g., `https://your-project-name.vercel.app`). **Important:** Add this *after* your first deployment generates a URL, or set a custom domain.
- `NODE_ENV`: Set to `production`.

### Frontend Variables
- `VITE_STREAM_API_KEY`: Same as `STREAM_API_KEY`.

## 3. Deployment Steps
1.  Install Vercel CLI (optional but recommended): `npm i -g vercel`
2.  Run `vercel` in the root directory.
3.  Follow the prompts:
    -   Set up and deploy? **Yes**
    -   Scope? **(Your account)**
    -   Link to existing project? **No**
    -   Project Name? **(Choose a name)**
    -   Directory? **./** (Root)
4.  **Important:** Vercel might try to auto-detect settings.
    -   **Framework Preset:** `Vite` (It should detect the frontend).
    -   **Root Directory:** `.` (It usually suggests `frontend` but we are deploying the whole repo). *Correction:* For a monorepo-like combined deploy with `vercel.json`, use the **Root** directory `.` as the root.
    -   **Build Command:** `npm run build` (This runs the root build script which installs dependencies and builds frontend).
    -   **Output Directory:** `frontend/dist` (This is where Vite puts the built assets).
    
    If Vercel asks for specific frontend framework settings, ensure the Output Directory is `frontend/dist`.

5.  After the first deployment (which might fail if Env Vars are missing), go to the Vercel Dashboard for your project.
6.  Go to **Settings > Environment Variables** and add all the variables listed above.
7.  Redeploy by pushing a new commit or running `vercel --prod` locally.

## 4. Troubleshooting
-   **CORS Errors:** Ensure `CLIENT_URL` matches your Vercel URL exactly (no trailing slash usually).
-   **Database Connections:** Using `mongoose` in serverless can be tricky. The code is optimized, but if you see timeouts, ensure your MongoDB Atlas IP Access List allows `0.0.0.0/0` (Access from Anywhere) or use Vercel Integrations.

## 5. How It Works (Architecture)
You might be wondering: *Where do I keep the frontend and backend? How do they talk to each other?*

**1. One Project, One Place:**
You keep both folders (`frontend` and `backend`) in this single project. You deploy the **entire project** together. You do **not** need to split them or host them on different websites.

**2. The Bridge (`vercel.json`):**
The `vercel.json` file works as a traffic controller:
-   **Frontend Traffic:** When a user visits `your-site.com/`, Vercel serves the React app from `frontend/dist`.
-   **Backend Traffic:** When the React app asks for data (e.g., `your-site.com/api/login`), Vercel automatically sends that request to the `backend/src/server.js` file.

**3. Automatic Connection:**
Because they live on the exact same domain (e.g., `https://my-app.vercel.app`), they connect automatically!
-   The Frontend sends requests to `/api`.
-   The Backend listens at `/api`.
-   No complex URL configuration is needed in the code (except correct Environment Variables).
