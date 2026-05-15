const express  = require("express");
const cron     = require("node-cron");
const path     = require("path");
const { runAgent } = require("./agent/orchestrator");

const app  = express();
const PORT = process.env.PORT || 3000;

let latestBriefing = null;
let isRunning      = false;
let lastRunAt      = null;
let lastError      = null;
let runLog         = [];

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.get("/api/status", (req, res) => {
  res.json({
    ok:           true,
    isRunning,
    lastRunAt,
    lastError,
    hasBriefing:  !!latestBriefing,
    briefingDate: latestBriefing?.date || null,
    apiKeySet:    !!process.env.ANTHROPIC_API_KEY,
    model:        process.env.AGENT_MODEL || "claude-sonnet-4-20250514",
  });
});

app.get("/api/briefing", (req, res) => {
  if (!latestBriefing) {
    return res.status(404).json({ error: "No briefing yet. Click Run Now." });
  }
  res.json(latestBriefing);
});

app.get("/api/log", (req, res) => {
  res.json({ log: runLog.slice(-50) });
});

app.post("/api/run", async (req, res) => {
  if (isRunning) {
    return res.status(409).json({ error: "Agent is already running. Please wait." });
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(400).json({ error: "ANTHROPIC_API_KEY is not set in environment variables." });
  }
  res.json({ ok: true, message: "Agent started. Refresh in 2-4 minutes." });
  _runAgent();
});

cron.schedule("0 3 * * *", () => {
  if (!isRunning && process.env.ANTHROPIC_API_KEY) {
    _log("Scheduled daily run triggered");
    _runAgent();
  }
});

async function _runAgent() {
  isRunning = true;
  lastError = null;
  runLog    = [];
  _log("Agent pipeline started");
  try {
    const briefing = await runAgent({
      apiKey:    process.env.ANTHROPIC_API_KEY,
      model:     process.env.AGENT_MODEL || "claude-sonnet-4-20250514",
      maxTokens: parseInt(process.env.AGENT_MAX_TOKENS || "4096"),
      nIdeas:    parseInt(process.env.N_IDEAS || "5"),
      threshold: parseInt(process.env.RELEVANCE_THRESHOLD || "5"),
      log:       _log,
    });
    latestBriefing = briefing;
    lastRunAt      = new Date().toISOString();
    _log("Done - " + briefing.stats.scored_articles + " articles, " + briefing.stats.ideas_generated + " ideas");
  } catch (err) {
    lastError = err.message;
    _log("Error: " + err.message);
    console.error(err);
  } finally {
    isRunning = false;
  }
}

function _log(msg) {
  const entry = "[" + new Date().toISOString().slice(11,19) + "] " + msg;
  runLog.push(entry);
  console.log(entry);
}

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
  console.log("API key set: " + !!process.env.ANTHROPIC_API_KEY);
});
