# 🇦🇪 UAE Social Sector AI Intelligence Agent

A live web app that runs daily, searches the internet for social sector news,
classifies and synthesises it, and generates UAE-specific AI implementation ideas.

**Stack:** Node.js · Express · Claude API (web search) · GitHub · Render

---

## Deploy in 4 steps — no terminal needed

### Step 1 — Put the code on GitHub

1. Go to **github.com** and sign in (or create a free account)
2. Click the **+** icon (top right) → **New repository**
3. Name it `uae-social-sector-agent`, set it to **Public**, click **Create repository**
4. Click **uploading an existing file**
5. Drag ALL the files from this folder into the upload area
   - `server.js`, `package.json`, `render.yaml`, `.gitignore`
   - The whole `agent/` folder and `public/` folder
6. Click **Commit changes**

---

### Step 2 — Deploy to Render

1. Go to **render.com** and sign in with your GitHub account
2. Click **New +** → **Web Service**
3. Click **Connect** next to your `uae-social-sector-agent` repo
4. Render will auto-detect the settings from `render.yaml`. Confirm:
   - **Build command:** `npm install`
   - **Start command:** `npm start`
5. Click **Create Web Service**

---

### Step 3 — Add your API key

Still on the Render dashboard for your service:

1. Click **Environment** in the left menu
2. Click **Add Environment Variable**
3. Set:
   - **Key:** `ANTHROPIC_API_KEY`
   - **Value:** your key from console.anthropic.com
4. Click **Save Changes** — Render will redeploy automatically

---

### Step 4 — Open your live site

Render gives you a URL like `https://uae-social-sector-agent.onrender.com`

Click it. You'll see the dashboard. Click **Run Now** to generate your first briefing.

**After that, it runs automatically every day at 07:00 UAE time.**

---

## How it works

```
Every day at 07:00 UAE (03:00 UTC):

  Claude + web_search
    ↓ searches 24 queries across 3 clusters
  Classifier
    ↓ scores UAE relevance, removes duplicates
  Synthesiser
    ↓ extracts trends, actions, urgent signals
  Idea Generator
    ↓ generates 5 UAE AI implementation ideas
  Dashboard
    ← live web UI updates automatically
```

---

## Cost

- **Render free tier:** Free (spins down after 15 min inactivity — first load takes ~30s)
- **Claude API:** ~$0.50–$2.00 per daily run (billed to your Anthropic account)

---

## Files

```
├── server.js           Express web server + scheduler
├── package.json        Node.js dependencies (express, node-cron)
├── render.yaml         Render deployment config
├── .gitignore
├── agent/
│   ├── orchestrator.js Pipeline coordinator
│   ├── claude.js       Anthropic API client
│   ├── keywords.js     Search keyword clusters
│   ├── collector.js    Step 1: web search & article retrieval
│   ├── classifier.js   Step 2: scoring & stream classification
│   ├── synthesiser.js  Step 3: trend synthesis
│   └── ideagenerator.js Step 4: UAE implementation ideas
└── public/
    └── index.html      Live dashboard UI
```
