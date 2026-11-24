---
title: "Back-of-the-Envelope Capacity Estimation Calculator"
description: "Interactive system design capacity estimation tool for Traffic (QPS), Storage, Bandwidth, and Cache requirements."
pubDatetime: 2026-11-24
pubDate: 2026-11-24
author: "Amol Dighe"
tags: ["system-design", "architecture", "distributed-systems", "tools", "capacity-planning"]
---

Estimate QPS, disk accumulation, egress bandwidth, and hot-set RAM in seconds for system design interviews and distributed architecture. 

Below is an interactive calculator configured for real-time capacity estimation. Change the inputs to observe how QPS, disk accumulation, egress bandwidth, and hot-set memory scale.

<div class="boe-calculator-widget" data-initial-dau="10" data-initial-actions="5" data-initial-kb="2" data-initial-ratio="100" data-initial-repl="3">
  <!-- Presets -->
  <div class="boe-presets-bar">
    <span class="boe-presets-label">Presets:</span>
    <div class="boe-presets-buttons">
      <button type="button" class="boe-preset-btn" data-preset="twitter">Twitter / X</button>
      <button type="button" class="boe-preset-btn" data-preset="urlshortener">URL Shortener</button>
      <button type="button" class="boe-preset-btn" data-preset="chatapp">Chat App</button>
      <button type="button" class="boe-preset-btn" data-preset="videometa">Video Platform</button>
      <button type="button" class="boe-preset-btn" data-preset="iotlog">IoT / Logging</button>
    </div>
  </div>

  <div class="boe-grid" role="region" aria-label="Estimation calculator">
    <!-- Left Column: Inputs -->
    <div class="boe-inputs-card">
      <div class="boe-card-header">
        <h3 class="boe-card-title">Your system's inputs</h3>
        <span class="boe-badge">Interactive</span>
      </div>

      <form id="md-boe-form" class="boe-form" onsubmit="return false;">
        <div class="boe-field">
          <div class="boe-label-row">
            <label for="md-boe-dau" class="boe-label">Daily active users (millions)</label>
            <span class="boe-unit-pill">M users</span>
          </div>
          <div class="boe-input-wrap">
            <input id="md-boe-dau" type="number" min="0.001" step="any" value="10" class="boe-input" required />
          </div>
          <span class="boe-hint">10 = 10,000,000 users active in a 24h window</span>
        </div>

        <div class="boe-field">
          <div class="boe-label-row">
            <label for="md-boe-actions" class="boe-label">Write actions per user per day</label>
            <span class="boe-unit-pill">writes/day</span>
          </div>
          <div class="boe-input-wrap">
            <input id="md-boe-actions" type="number" min="0.001" step="any" value="5" class="boe-input" required />
          </div>
          <span class="boe-hint">Posts, uploads, messages — anything that creates data.</span>
        </div>

        <div class="boe-field">
          <div class="boe-label-row">
            <label for="md-boe-payload" class="boe-label">Average payload size (KB)</label>
            <span class="boe-unit-pill">KB / record</span>
          </div>
          <div class="boe-input-wrap">
            <input id="md-boe-payload" type="number" min="0.001" step="any" value="2" class="boe-input" required />
          </div>
          <span class="boe-hint">Average record size (1 KB = 1,024 bytes)</span>
        </div>

        <div class="boe-field">
          <div class="boe-label-row">
            <label for="md-boe-ratio" class="boe-label">Read : write ratio</label>
          </div>
          <div class="boe-select-wrap">
            <select id="md-boe-ratio" class="boe-select">
              <option value="1">1:1 (write-heavy, e.g. logging)</option>
              <option value="10">10:1 (balanced, e.g. social feed)</option>
              <option value="100" selected>100:1 (read-heavy, e.g. URL shortener)</option>
              <option value="1000">1000:1 (extreme reads, e.g. CDN content)</option>
            </select>
            <div class="boe-select-arrow" aria-hidden="true">▾</div>
          </div>
        </div>

        <div class="boe-field">
          <div class="boe-label-row">
            <label for="md-boe-replication" class="boe-label">Replication factor</label>
          </div>
          <div class="boe-select-wrap">
            <select id="md-boe-replication" class="boe-select">
              <option value="1">1x (no replication)</option>
              <option value="2">2x</option>
              <option value="3" selected>3x (typical default)</option>
            </select>
            <div class="boe-select-arrow" aria-hidden="true">▾</div>
          </div>
        </div>

        <div class="boe-actions-group">
          <button type="button" id="md-boe-copy-link" class="boe-btn boe-btn-primary">
            <span id="md-boe-copy-text">Copy link to inputs</span>
          </button>
          <button type="button" id="md-boe-copy-markdown" class="boe-btn boe-btn-secondary">
            <span id="md-boe-md-text">Copy as Markdown</span>
          </button>
          <button type="button" id="md-boe-reset" class="boe-btn boe-btn-ghost">
            <span>Reset to defaults</span>
          </button>
        </div>
      </form>
    </div>

    <!-- Right Column: Derivation Pipeline & Outputs -->
    <div class="boe-outputs-column">
      <!-- Derivation Flow Pipeline -->
      <div class="boe-pipeline-card">
        <div class="boe-pipeline-title">Traffic Derivation Pipeline</div>
        <ol class="boe-pipeline-steps">
          <li class="boe-step-node">
            <span class="boe-step-tag">DAU</span>
            <span class="boe-step-val" id="md-boe-pipe-dau">10.0M</span>
          </li>
          <li class="boe-step-arrow">→</li>
          <li class="boe-step-node">
            <span class="boe-step-tag" id="md-boe-pipe-writes-label">× 5 writes/day</span>
            <span class="boe-step-val" id="md-boe-pipe-writes">50.0M</span>
          </li>
          <li class="boe-step-arrow">→</li>
          <li class="boe-step-node">
            <span class="boe-step-tag">÷ 86,400 QPS</span>
            <span class="boe-step-val" id="md-boe-pipe-write-qps">579</span>
          </li>
          <li class="boe-step-arrow">→</li>
          <li class="boe-step-node">
            <span class="boe-step-tag" id="md-boe-pipe-read-label">× 100 read QPS</span>
            <span class="boe-step-val" id="md-boe-pipe-read-qps">57.9K</span>
          </li>
          <li class="boe-step-arrow">→</li>
          <li class="boe-step-node boe-step-node-peak">
            <span class="boe-step-tag">× 3 peak</span>
            <span class="boe-step-val" id="md-boe-pipe-peak-qps">174K</span>
          </li>
        </ol>
      </div>

      <!-- Traffic Card -->
      <div class="boe-output-card">
        <div class="boe-card-header">
          <div class="boe-heading-with-icon">
            <span class="boe-icon-badge">⚡</span>
            <h4 class="boe-card-title">Traffic</h4>
          </div>
          <span class="boe-card-tag">Queries per second</span>
        </div>
        <div class="boe-metrics-grid">
          <div class="boe-metric-item">
            <div class="boe-metric-label">Average write QPS</div>
            <div class="boe-metric-val" id="md-boe-val-avg-write-qps">579</div>
            <div class="boe-metric-formula" id="md-boe-form-avg-write-qps">= 10.0M DAU × 5 writes / 86,400s</div>
          </div>
          <div class="boe-metric-item">
            <div class="boe-metric-label">Peak write QPS</div>
            <div class="boe-metric-val" id="md-boe-val-peak-write-qps">1.74K</div>
            <div class="boe-metric-formula" id="md-boe-form-peak-write-qps">= avg × 3 (peak factor)</div>
          </div>
          <div class="boe-metric-item">
            <div class="boe-metric-label">Average read QPS</div>
            <div class="boe-metric-val" id="md-boe-val-avg-read-qps">57.9K</div>
            <div class="boe-metric-formula" id="md-boe-form-avg-read-qps">= write QPS × 100 (read:write ratio)</div>
          </div>
          <div class="boe-metric-item boe-metric-highlight">
            <div class="boe-metric-label">Peak read QPS</div>
            <div class="boe-metric-val" id="md-boe-val-peak-read-qps">174K</div>
            <div class="boe-metric-formula" id="md-boe-form-peak-read-qps">= read QPS × 3 (peak factor)</div>
          </div>
        </div>
      </div>

      <!-- Storage Card -->
      <div class="boe-output-card">
        <div class="boe-card-header">
          <div class="boe-heading-with-icon">
            <span class="boe-icon-badge">💾</span>
            <h4 class="boe-card-title">Storage</h4>
          </div>
          <span class="boe-card-tag">Disk capacity</span>
        </div>
        <div class="boe-metrics-grid">
          <div class="boe-metric-item">
            <div class="boe-metric-label">New data per day</div>
            <div class="boe-metric-val" id="md-boe-val-data-day">95.4 GB</div>
            <div class="boe-metric-formula" id="md-boe-form-data-day">= 50.0M writes × 2 KB</div>
          </div>
          <div class="boe-metric-item">
            <div class="boe-metric-label">New data per year</div>
            <div class="boe-metric-val" id="md-boe-val-data-year">34.0 TB</div>
            <div class="boe-metric-formula" id="md-boe-form-data-year">= daily volume × 365</div>
          </div>
          <div class="boe-metric-item boe-metric-highlight">
            <div class="boe-metric-label" id="md-boe-label-replication">Stored with 3x replication</div>
            <div class="boe-metric-val" id="md-boe-val-data-replicated">102 TB</div>
            <div class="boe-metric-formula" id="md-boe-form-data-replicated">= yearly volume × 3 replicas</div>
          </div>
        </div>
      </div>

      <!-- Bandwidth & Cache Card -->
      <div class="boe-output-card">
        <div class="boe-card-header">
          <div class="boe-heading-with-icon">
            <span class="boe-icon-badge">🌐</span>
            <h4 class="boe-card-title">Bandwidth &amp; cache</h4>
          </div>
          <span class="boe-card-tag">Network &amp; RAM</span>
        </div>
        <div class="boe-metrics-grid">
          <div class="boe-metric-item">
            <div class="boe-metric-label">Ingress (writes)</div>
            <div class="boe-metric-val" id="md-boe-val-ingress">1.13 MB/s</div>
            <div class="boe-metric-formula" id="md-boe-form-ingress">= write QPS × 2 KB</div>
          </div>
          <div class="boe-metric-item">
            <div class="boe-metric-label">Egress (reads)</div>
            <div class="boe-metric-val" id="md-boe-val-egress">113 MB/s</div>
            <div class="boe-metric-formula" id="md-boe-form-egress">= read QPS × 2 KB</div>
          </div>
          <div class="boe-metric-item boe-metric-highlight">
            <div class="boe-metric-label">Cache for the hot set</div>
            <div class="boe-metric-val" id="md-boe-val-cache">1.86 TB</div>
            <div class="boe-metric-formula" id="md-boe-form-cache">= 20% of daily read volume (80/20 rule)</div>
          </div>
        </div>
      </div>

      <!-- Caveat note -->
      <div class="boe-caveat-box">
        <span class="boe-caveat-icon">ℹ️</span>
        <p class="boe-caveat-text">
          <strong>Interview rule of thumb:</strong> Storage uses binary powers of two (1 KB = 1,024 B, 1 MB = 1,024 KB), while QPS uses powers of ten (1M = 1,000,000). In a live round, round aggressively: 86,400s ≈ 100,000s ($10^5$) for quick mental math.
        </p>
      </div>
    </div>
  </div>
</div>

<style>
  /* Adaptive Light & Dark Theme matching amoldighe.com */
  .boe-calculator-widget {
    --boe-bg-canvas: var(--background, #fdfdfd);
    --boe-bg-surface: #ffffff;
    --boe-bg-surface-elevated: #f8fafc;
    --boe-bg-input: #ffffff;
    --boe-border: var(--border, #e2e8f0);
    --boe-border-strong: #cbd5e1;
    --boe-border-focus: var(--accent, #006cac);
    --boe-text-primary: var(--foreground, #282728);
    --boe-text-muted: var(--muted-foreground, #64748b);
    --boe-text-faint: #94a3b8;
    --boe-accent: var(--accent, #006cac);
    --boe-accent-hover: #005a90;
    --boe-accent-soft: rgba(0, 108, 172, 0.08);
    --boe-accent-border: rgba(0, 108, 172, 0.28);
    --boe-highlight: #0284c7;
    --boe-highlight-soft: rgba(2, 132, 199, 0.08);
    --boe-highlight-border: rgba(2, 132, 199, 0.28);
    --boe-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
    --boe-font-mono: var(--font-google-sans-code, var(--font-app, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace));
    --boe-radius-lg: 0.75rem;
    --boe-radius-md: 0.5rem;
    --boe-radius-sm: 0.375rem;

    font-family: inherit;
    color: var(--boe-text-primary);
    width: 100%;
    margin: 1.5rem 0;
    box-sizing: border-box;
  }

  /* When blog's dark theme is toggled on html[data-theme="dark"] or html.dark */
  html[data-theme="dark"] .boe-calculator-widget,
  html.dark .boe-calculator-widget,
  .dark .boe-calculator-widget {
    --boe-bg-canvas: var(--background, #212737);
    --boe-bg-surface: #283046;
    --boe-bg-surface-elevated: #313b56;
    --boe-bg-input: #1e2433;
    --boe-border: #3b4668;
    --boe-border-strong: #505d85;
    --boe-border-focus: var(--accent, #ff6b01);
    --boe-text-primary: var(--foreground, #eaedf3);
    --boe-text-muted: var(--muted-foreground, #afb9ca);
    --boe-text-faint: #7e8b9e;
    --boe-accent: var(--accent, #ff6b01);
    --boe-accent-hover: #e56000;
    --boe-accent-soft: rgba(255, 107, 1, 0.12);
    --boe-accent-border: rgba(255, 107, 1, 0.35);
    --boe-highlight: #38bdf8;
    --boe-highlight-soft: rgba(56, 189, 248, 0.12);
    --boe-highlight-border: rgba(56, 189, 248, 0.35);
    --boe-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.35);
  }

  .boe-presets-bar {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.5rem;
    background: var(--boe-bg-surface);
    border: 1px solid var(--boe-border);
    padding: 0.625rem 0.875rem;
    border-radius: var(--boe-radius-md);
    margin-bottom: 1.25rem;
  }
  .boe-presets-label {
    font-size: 0.775rem;
    font-weight: 700;
    color: var(--boe-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .boe-presets-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 0.375rem;
  }
  .boe-preset-btn {
    background: var(--boe-bg-surface-elevated);
    color: var(--boe-text-primary);
    border: 1px solid var(--boe-border);
    border-radius: var(--boe-radius-sm);
    padding: 0.3rem 0.65rem;
    font-size: 0.775rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s ease-in-out;
  }
  .boe-preset-btn:hover {
    background: var(--boe-accent-soft);
    border-color: var(--boe-accent-border);
    color: var(--boe-accent);
  }

  .boe-grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr);
    gap: 1.25rem;
    align-items: start;
  }
  @media (max-width: 768px) {
    .boe-grid {
      grid-template-columns: 1fr;
    }
  }

  .boe-inputs-card,
  .boe-output-card,
  .boe-pipeline-card {
    background: var(--boe-bg-surface);
    border: 1px solid var(--boe-border);
    border-radius: var(--boe-radius-lg);
    padding: 1.15rem;
    box-sizing: border-box;
    box-shadow: var(--boe-shadow);
  }

  .boe-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.875rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--boe-border);
  }
  .boe-card-title {
    font-size: 1.05rem;
    font-weight: 700;
    margin: 0 !important;
    color: var(--boe-text-primary);
  }
  .boe-heading-with-icon {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .boe-icon-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.65rem;
    height: 1.65rem;
    border-radius: var(--boe-radius-sm);
    font-size: 0.9rem;
    background: var(--boe-bg-surface-elevated);
  }
  .boe-badge {
    background: var(--boe-accent-soft);
    color: var(--boe-accent);
    border: 1px solid var(--boe-accent-border);
    font-size: 0.7rem;
    font-weight: 600;
    padding: 0.15rem 0.45rem;
    border-radius: 9999px;
  }
  .boe-card-tag {
    font-size: 0.725rem;
    color: var(--boe-text-muted);
    font-family: var(--boe-font-mono);
  }

  .boe-form {
    display: flex;
    flex-direction: column;
    gap: 0.875rem;
  }
  .boe-field {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  .boe-label-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  }
  .boe-label {
    font-size: 0.825rem;
    font-weight: 600;
    color: var(--boe-text-primary);
  }
  .boe-unit-pill {
    font-size: 0.7rem;
    color: var(--boe-text-muted);
    font-family: var(--boe-font-mono);
  }
  .boe-hint {
    font-size: 0.725rem;
    color: var(--boe-text-faint);
    line-height: 1.35;
  }
  .boe-input-wrap,
  .boe-select-wrap {
    position: relative;
    width: 100%;
  }
  .boe-input,
  .boe-select {
    width: 100%;
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
    color: var(--boe-text-primary);
    background-color: var(--boe-bg-input);
    border: 1px solid var(--boe-border-strong);
    border-radius: var(--boe-radius-md);
    box-sizing: border-box;
    transition: all 0.15s ease-in-out;
  }
  .boe-input:focus,
  .boe-select:focus {
    outline: none;
    border-color: var(--boe-border-focus);
    box-shadow: 0 0 0 3px var(--boe-accent-soft);
  }
  .boe-select {
    appearance: none;
    padding-right: 2rem;
    cursor: pointer;
  }
  .boe-select-arrow {
    position: absolute;
    right: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    color: var(--boe-text-muted);
    font-size: 0.8rem;
  }

  .boe-actions-group {
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
    margin-top: 0.35rem;
  }
  .boe-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    padding: 0.55rem 0.85rem;
    font-size: 0.825rem;
    font-weight: 600;
    border-radius: var(--boe-radius-md);
    cursor: pointer;
    transition: all 0.15s ease-in-out;
    border: 1px solid transparent;
  }
  .boe-btn-primary {
    background: var(--boe-accent);
    color: #ffffff;
  }
  .boe-btn-primary:hover {
    background: var(--boe-accent-hover);
  }
  .boe-btn-secondary {
    background: var(--boe-bg-surface-elevated);
    color: var(--boe-text-primary);
    border-color: var(--boe-border);
  }
  .boe-btn-secondary:hover {
    background: var(--boe-accent-soft);
    border-color: var(--boe-accent-border);
    color: var(--boe-accent);
  }
  .boe-btn-ghost {
    background: transparent;
    color: var(--boe-text-muted);
    border-color: transparent;
  }
  .boe-btn-ghost:hover {
    background: var(--boe-bg-surface-elevated);
    color: var(--boe-text-primary);
  }

  .boe-outputs-column {
    display: flex;
    flex-direction: column;
    gap: 1.15rem;
  }
  .boe-pipeline-title {
    font-size: 0.725rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--boe-text-muted);
    margin-bottom: 0.625rem;
  }
  .boe-pipeline-steps {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.35rem;
  }
  .boe-step-node {
    display: inline-flex;
    flex-direction: column;
    background: var(--boe-bg-surface-elevated);
    border: 1px solid var(--boe-border);
    border-radius: var(--boe-radius-sm);
    padding: 0.3rem 0.5rem;
    min-width: 65px;
  }
  .boe-step-node-peak {
    border-color: var(--boe-highlight-border);
    background: var(--boe-highlight-soft);
  }
  .boe-step-tag {
    font-size: 0.625rem;
    color: var(--boe-text-faint);
    text-transform: uppercase;
  }
  .boe-step-val {
    font-size: 0.875rem;
    font-weight: 700;
    color: var(--boe-text-primary);
    font-family: var(--boe-font-mono);
  }
  .boe-step-arrow {
    color: var(--boe-text-faint);
    font-size: 0.8rem;
  }

  .boe-metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 0.65rem;
  }
  .boe-metric-item {
    background: var(--boe-bg-surface-elevated);
    border: 1px solid var(--boe-border);
    border-radius: var(--boe-radius-md);
    padding: 0.75rem 0.85rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transition: border-color 0.15s ease;
  }
  .boe-metric-item:hover {
    border-color: var(--boe-border-strong);
  }
  .boe-metric-highlight {
    border-color: var(--boe-accent-border);
    background: var(--boe-accent-soft);
  }
  .boe-metric-label {
    font-size: 0.75rem;
    color: var(--boe-text-muted);
    font-weight: 500;
    margin-bottom: 0.25rem;
  }
  .boe-metric-val {
    font-size: 1.45rem;
    font-weight: 800;
    color: var(--boe-text-primary);
    font-family: var(--boe-font-mono);
    line-height: 1.2;
    margin-bottom: 0.3rem;
    font-variant-numeric: tabular-nums;
  }
  .boe-metric-formula {
    font-size: 0.675rem;
    color: var(--boe-text-faint);
    font-family: var(--boe-font-mono);
    line-height: 1.35;
    word-break: break-all;
  }

  .boe-caveat-box {
    display: flex;
    gap: 0.65rem;
    align-items: flex-start;
    padding: 0.75rem 0.875rem;
    background: var(--boe-bg-surface);
    border: 1px dashed var(--boe-border-strong);
    border-radius: var(--boe-radius-md);
  }
  .boe-caveat-icon {
    font-size: 1.05rem;
  }
  .boe-caveat-text {
    margin: 0 !important;
    font-size: 0.775rem;
    color: var(--boe-text-muted);
    line-height: 1.45;
  }
</style>

<script>
  (() => {
    function initPostBoe() {
      const widget = document.querySelector('.boe-calculator-widget');
      if (!widget) return;

      const dauInput = document.getElementById('md-boe-dau');
      const actionsInput = document.getElementById('md-boe-actions');
      const payloadInput = document.getElementById('md-boe-payload');
      const ratioSelect = document.getElementById('md-boe-ratio');
      const replSelect = document.getElementById('md-boe-replication');

      const copyLinkBtn = document.getElementById('md-boe-copy-link');
      const copyMdBtn = document.getElementById('md-boe-copy-markdown');
      const resetBtn = document.getElementById('md-boe-reset');

      if (!dauInput || !actionsInput || !payloadInput || !ratioSelect || !replSelect) return;

      const presets = {
        twitter: { dau: 250, actions: 2, kb: 1, ratio: 100, repl: 3 },
        urlshortener: { dau: 100, actions: 1, kb: 0.5, ratio: 100, repl: 3 },
        chatapp: { dau: 50, actions: 40, kb: 2, ratio: 10, repl: 3 },
        videometa: { dau: 100, actions: 0.2, kb: 5, ratio: 1000, repl: 3 },
        iotlog: { dau: 10, actions: 100, kb: 1, ratio: 1, repl: 2 }
      };

      function roundNum(e) {
        if (e >= 100) return Math.round(e).toLocaleString("en-US");
        if (e >= 10) return e.toFixed(1);
        return e.toFixed(2).replace(/\.?0+$/, "") || "0";
      }

      function formatRate(e) {
        if (e >= 1e9) return `${roundNum(e / 1e9)}B`;
        if (e >= 1e6) return `${roundNum(e / 1e6)}M`;
        if (e >= 1e3) return `${roundNum(e / 1e3)}K`;
        return roundNum(e);
      }

      function formatBytes(bytes) {
        const units = ["KB", "MB", "GB", "TB", "PB"];
        let val = bytes / 1024;
        let unitIdx = 0;
        while (val >= 1024 && unitIdx < units.length - 1) {
          val /= 1024;
          unitIdx++;
        }
        return `${roundNum(val)} ${units[unitIdx]}`;
      }

      function calculate() {
        const dauMillions = Math.max(parseFloat(dauInput.value) || 0, 0);
        const actionsPerDay = Math.max(parseFloat(actionsInput.value) || 0, 0);
        const payloadKb = Math.max(parseFloat(payloadInput.value) || 0, 0);
        const readWriteRatio = Math.max(parseFloat(ratioSelect.value) || 1, 1);
        const replication = Math.max(parseInt(replSelect.value, 10) || 1, 1);

        const totalUsers = dauMillions * 1e6;
        const totalWritesDay = totalUsers * actionsPerDay;
        const writeQps = totalWritesDay / 86400;
        const peakWriteQps = 3 * writeQps;
        const readQps = writeQps * readWriteRatio;
        const peakReadQps = 3 * readQps;

        const payloadBytes = payloadKb * 1024;
        const dailyStorageBytes = totalWritesDay * payloadBytes;
        const yearlyStorageBytes = 365 * dailyStorageBytes;
        const replicatedStorageBytes = yearlyStorageBytes * replication;

        const ingressBytesSec = writeQps * payloadBytes;
        const egressBytesSec = readQps * payloadBytes;
        const dailyReadVolumeBytes = 86400 * readQps * payloadBytes;
        const cacheBytes = 0.20 * dailyReadVolumeBytes;

        setText('md-boe-pipe-dau', `${roundNum(dauMillions)}M`);
        setText('md-boe-pipe-writes-label', `× ${roundNum(actionsPerDay)} writes/day`);
        setText('md-boe-pipe-writes', formatRate(totalWritesDay));
        setText('md-boe-pipe-write-qps', formatRate(writeQps));
        setText('md-boe-pipe-read-label', `× ${readWriteRatio} read QPS`);
        setText('md-boe-pipe-read-qps', formatRate(readQps));
        setText('md-boe-pipe-peak-qps', formatRate(peakReadQps));

        setText('md-boe-val-avg-write-qps', formatRate(writeQps));
        setText('md-boe-form-avg-write-qps', `= ${roundNum(dauMillions)}M DAU × ${roundNum(actionsPerDay)} writes / 86,400s`);
        setText('md-boe-val-peak-write-qps', formatRate(peakWriteQps));
        setText('md-boe-form-peak-write-qps', `= avg × 3 (peak factor)`);
        setText('md-boe-val-avg-read-qps', formatRate(readQps));
        setText('md-boe-form-avg-read-qps', `= write QPS × ${readWriteRatio} (read:write ratio)`);
        setText('md-boe-val-peak-read-qps', formatRate(peakReadQps));
        setText('md-boe-form-peak-read-qps', `= read QPS × 3 (peak factor)`);

        setText('md-boe-val-data-day', formatBytes(dailyStorageBytes));
        setText('md-boe-form-data-day', `= ${formatRate(totalWritesDay)} writes × ${roundNum(payloadKb)} KB`);
        setText('md-boe-val-data-year', formatBytes(yearlyStorageBytes));
        setText('md-boe-form-data-year', `= daily volume × 365`);
        setText('md-boe-label-replication', `Stored with ${replication}x replication`);
        setText('md-boe-val-data-replicated', formatBytes(replicatedStorageBytes));
        setText('md-boe-form-data-replicated', `= yearly volume × ${replication} replicas`);

        setText('md-boe-val-ingress', `${formatBytes(ingressBytesSec)}/s`);
        setText('md-boe-form-ingress', `= write QPS × ${roundNum(payloadKb)} KB`);
        setText('md-boe-val-egress', `${formatBytes(egressBytesSec)}/s`);
        setText('md-boe-form-egress', `= read QPS × ${roundNum(payloadKb)} KB`);
        setText('md-boe-val-cache', formatBytes(cacheBytes));
        setText('md-boe-form-cache', `= 20% of daily read volume (80/20 rule)`);
      }

      function setText(id, text) {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
      }

      [dauInput, actionsInput, payloadInput].forEach(inp => inp?.addEventListener('input', calculate));
      [ratioSelect, replSelect].forEach(sel => sel?.addEventListener('change', calculate));

      document.querySelectorAll('.boe-calculator-widget .boe-preset-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const key = e.currentTarget.dataset.preset;
          if (key && presets[key]) {
            const p = presets[key];
            dauInput.value = p.dau;
            actionsInput.value = p.actions;
            payloadInput.value = p.kb;
            ratioSelect.value = p.ratio;
            replSelect.value = p.repl;
            calculate();
          }
        });
      });

      const params = new URLSearchParams(window.location.search);
      if (params.has('dau')) dauInput.value = params.get('dau');
      if (params.has('actions')) actionsInput.value = params.get('actions');
      if (params.has('kb')) payloadInput.value = params.get('kb');
      if (params.has('ratio')) ratioSelect.value = params.get('ratio');
      if (params.has('repl')) replSelect.value = params.get('repl');

      copyLinkBtn?.addEventListener('click', async () => {
        const url = new URL(window.location.href);
        url.searchParams.set('dau', dauInput.value);
        url.searchParams.set('actions', actionsInput.value);
        url.searchParams.set('kb', payloadInput.value);
        url.searchParams.set('ratio', ratioSelect.value);
        url.searchParams.set('repl', replSelect.value);
        const fullUrl = url.toString();
        const copyTextEl = document.getElementById('md-boe-copy-text');
        try {
          if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(fullUrl);
          } else {
            window.prompt('Copy link:', fullUrl);
          }
          if (copyTextEl) {
            const prev = copyTextEl.textContent;
            copyTextEl.textContent = 'Link copied!';
            setTimeout(() => { copyTextEl.textContent = prev; }, 2000);
          }
        } catch {
          window.prompt('Copy link:', fullUrl);
        }
      });

      copyMdBtn?.addEventListener('click', async () => {
        const dau = dauInput.value;
        const actions = actionsInput.value;
        const kb = payloadInput.value;
        const ratio = ratioSelect.value;
        const repl = replSelect.value;
        const writeQps = document.getElementById('md-boe-val-avg-write-qps')?.textContent || '';
        const peakWrite = document.getElementById('md-boe-val-peak-write-qps')?.textContent || '';
        const readQps = document.getElementById('md-boe-val-avg-read-qps')?.textContent || '';
        const peakRead = document.getElementById('md-boe-val-peak-read-qps')?.textContent || '';
        const dataDay = document.getElementById('md-boe-val-data-day')?.textContent || '';
        const dataYear = document.getElementById('md-boe-val-data-year')?.textContent || '';
        const dataRepl = document.getElementById('md-boe-val-data-replicated')?.textContent || '';
        const ingress = document.getElementById('md-boe-val-ingress')?.textContent || '';
        const egress = document.getElementById('md-boe-val-egress')?.textContent || '';
        const cache = document.getElementById('md-boe-val-cache')?.textContent || '';

        const md = [
          `### Back-of-the-Envelope Capacity Estimate`,
          `**Inputs:** ${dau}M DAU | ${actions} writes/user/day | ${kb} KB payload | ${ratio}:1 Read/Write | ${repl}x Replication\n`,
          `| Category | Metric | Estimated Value |`,
          `| :--- | :--- | :--- |`,
          `| **Traffic** | Average Write QPS | \`${writeQps}\` |`,
          `| | Peak Write QPS (3x) | \`${peakWrite}\` |`,
          `| | Average Read QPS | \`${readQps}\` |`,
          `| | Peak Read QPS (3x) | \`${peakRead}\` |`,
          `| **Storage** | Daily New Data | \`${dataDay}\` |`,
          `| | Annual New Data | \`${dataYear}\` |`,
          `| | Stored with ${repl}x Replication | \`${dataRepl}\` |`,
          `| **Bandwidth & Cache** | Ingress (Writes) | \`${ingress}\` |`,
          `| | Egress (Reads) | \`${egress}\` |`,
          `| | 80/20 Hot Set Cache | \`${cache}\` |`
        ].join('\n');

        const mdTextEl = document.getElementById('md-boe-md-text');
        try {
          if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(md);
          } else {
            window.prompt('Copy markdown summary:', md);
          }
          if (mdTextEl) {
            const prev = mdTextEl.textContent;
            mdTextEl.textContent = 'Copied to clipboard!';
            setTimeout(() => { mdTextEl.textContent = prev; }, 2000);
          }
        } catch {
          window.prompt('Copy markdown summary:', md);
        }
      });

      resetBtn?.addEventListener('click', () => {
        dauInput.value = '10';
        actionsInput.value = '5';
        payloadInput.value = '2';
        ratioSelect.value = '100';
        replSelect.value = '3';
        calculate();
        const url = new URL(window.location.href);
        url.search = '';
        window.history.replaceState({}, '', url.toString());
      });

      calculate();
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initPostBoe);
    } else {
      initPostBoe();
    }
    document.addEventListener('astro:page-load', initPostBoe);
  })();
</script>

---

## The Core Formulas, Explained

### 1. Traffic: From Users to QPS

To translate active users into server load:
$$\text{Average Write QPS} = \frac{\text{DAU} \times \text{Writes per User}}{86,400\text{ seconds}}$$

**The Interview Shortcut:** 
86,400 seconds in a day is close to $100,000$ ($10^5$). If you have 50 million writes per day:
$$\frac{50,000,000}{100,000} = 500\text{ QPS}$$
The exact math yields $579\text{ QPS}$. Approximating by $10^5$ introduces less than a 15% error, which is completely acceptable in architecture discussions.

### 2. Reads: The Ratio Shortcut

Consumer applications exhibit asymmetrical traffic:
$$\text{Read QPS} = \text{Write QPS} \times (\text{Read : Write Ratio})$$

- **1:1** for write-heavy services (metrics ingestion, telemetry, logging).
- **10:1** for interactive platforms (chat, social timelines).
- **100:1** for read-heavy distribution (URL shorteners, search indices).
- **1,000:1** for media and CDN distributions.

### 3. Storage Accumulation

Storage accumulates with each write:
$$\text{Daily Storage} = \text{Writes/Day} \times \text{Payload Size (Bytes)}$$
$$\text{Total 1-Year Storage} = \text{Daily Storage} \times 365 \times \text{Replication Factor}$$

In distributed infrastructure, persistent datastores (ScyllaDB, Ceph, Spanner, HDFS) enforce a **3x replication factor** across distinct failure domains or availability zones to prevent data loss.

### 4. Cache Sizing & The 80/20 Rule

According to the Pareto Principle, roughly 20% of the daily active content accounts for 80% of read traffic. Sizing your in-memory cache (Redis, Memcached) to retain this 20% hot set yields high hit rates while bounding memory costs:
$$\text{Daily Read Volume} = \text{Read QPS} \times 86,400 \times \text{Payload Size}$$
$$\text{Hot Set Cache} = 0.20 \times \text{Daily Read Volume}$$

---

## System Design Mental Math Cheat Sheet

| Metric / Unit        | Exact Value                   | Mental Math Approx  | System Interpretation                   |
| :------------------- | :---------------------------- | :------------------ | :-------------------------------------- |
| **Seconds in a Day** | 86,400 s                      | $\approx 10^5$ s    | Divide daily events by $10^5$ for QPS   |
| **1 Million (1M)**   | $10^6$                        | $10^6$              | Daily Active Users baseline             |
| **1 Billion (1B)**   | $1,000,000,000$               | $10^9$              | Web-scale platforms (Search, Social)    |
| **1 Kilobyte (KB)**  | $1,024$ Bytes                 | $\approx 10^3$ B    | Typical JSON payloads, metadata records |
| **1 Megabyte (MB)**  | $1,048,576$ Bytes             | $\approx 10^6$ B    | High-res images, small audio clips      |
| **1 Gigabyte (GB)**  | $1,073,741,824$ Bytes         | $\approx 10^9$ B    | Memory capacity, DB shards, video files |
| **1 Terabyte (TB)**  | $1,099,511,627,776$ Bytes     | $\approx 10^{12}$ B | Annual database growth, SSD drives      |
| **1 Petabyte (PB)**  | $1,125,899,906,842,624$ Bytes | $\approx 10^{15}$ B | Data warehouses, analytics logs         |
