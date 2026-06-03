---
title: 'AI Engineering Just Entered the Cleanup Phase'
description: 'Cost ceilings, security gates, and ROI scrutiny arrived in the same two weeks — the AI-coding conversation has shifted from adoption to governance.'
date: '2026-06-03'
keywords:
  - AI
  - Engineering
  - Security
  - AppSec
  - Product
author: 'Santiago Vázquez Villarreal'
cover: '/blog/costxproductivity.png'
coverAlt: 'Line chart comparing rising AI agent cost per engineer against a flatter productivity gain curve, with a horizontal budget cap line.'
draft: false
---

The AI-in-engineering conversation has shifted register. Until recently, the talk was acceleration — which model, which agent, which feature ships faster. This month it's cost ceilings, security gates, and ROI numbers nobody had to defend yet. The cleanup phase has started, and the infrastructure around the agent is the work now.

If you don't live in this jargon every day, here's the one term doing the most heavy lifting: **agentic coding** — AI tools that don't just autocomplete a line but plan, write, and modify whole chunks of code on their own, often across multiple files in a single session. Cursor and Claude Code are the two most-named ones. They bill by tokens consumed, which means the cost line scales with how much the model thinks before answering. That's the cost side. The quality side is harder — what the agent ships is plausibly good code, until someone reads it the way an attacker or a senior reviewer would.

## What the data says

Three data points from the last two weeks describe the same shift from different angles.

1. **Uber capped Claude Code and Cursor at $1,500/month per engineer** after burning its entire 2026 AI budget in four months. At two tools per engineer that's roughly $36,000/year per developer — about 11% of Uber's median engineering compensation, per [Simon Willison's writeup](https://simonwillison.net/2026/Jun/3/uber-caps-usage/#atom-everything). It is the first published enterprise number on governing agentic coding spend, which means it will be the reference point every other company quotes for the next year.

2. **Thoughtworks measured the security side: 25% of AI-generated code ships with confirmed vulnerabilities**, in their [VibeSec Reckoning report](https://martinfowler.com/articles/vibesec-reckoning.html). Agents default to insecure configurations on open-ended prompts. Their recommended fix isn't a better prompt — it's a versioned security context file the agent reads on every task, plus deterministic automated checks at merge that refuse insecure code with no exceptions.

3. **Engineering leaders at mid-to-large companies are imposing per-engineer AI token budgets** because agent costs are growing faster than demonstrated productivity gains, per [The Pragmatic Engineer](https://newsletter.pragmaticengineer.com/p/the-pulse-a-trend-of-trying-to-cut) a week before Uber published a number for it. Bottom-up budgets, top-down ROI scrutiny — the same pressure from both sides.

![Line chart comparing rising AI agent cost per engineer against a flatter productivity gain curve, with a horizontal budget cap line.](/blog/costxproductivity.png)

_The shape of the cleanup phase: cost outpacing measurable gain until something forces a ceiling._

## Why infrastructure is now the work

These aren't three independent stories. They're the same diagnosis from three angles.

For most of 2024 and 2025, the AI-coding pitch was "this obviously pays for itself — just look at the time saved." That argument worked when the cost line was small and the productivity claims were anecdotal. It stops working the moment a company the size of Uber blows its annual budget in a third of a year and someone publishes a number for it. It stops working when a hands-on study from Thoughtworks puts a measured vulnerability rate on what the agents ship.

The shift this implies is from adoption to governance. Adoption was: "roll it out, the productivity will speak for itself." Governance is: "design the ceiling, the safety net, and the measurement layer so the productivity is actually visible and the failure mode is actually bounded." The infrastructure isn't a side project. It's the thing that decides whether AI engineering keeps its budget next quarter.

## In practice

If you're scoping AI work in the next ninety days, four moves earn their keep:

1. **Pick a per-engineer cost ceiling before procurement, not after.** Uber's $1,500/month is a reference point; your number is yours. The point is having a number at all, ideally one the CFO would sign before the first invoice surprises anyone.
2. **Put a deterministic check between the agent and main.** Not a model-based reviewer — an automated, rules-based gate at merge that refuses insecure or non-conforming code with no exceptions. The Thoughtworks data says prompts won't get you there.
3. **Measure productivity with something a CFO can audit.** Tokens consumed is an input metric, not an outcome. Tie the cost line to a delivered-feature line or a defect-rate line, not to commits or lines of code.
4. **Treat security context as a first-class file in the repo.** A versioned `SECURITY.md` (or equivalent) the agent reads on every task. Same status as `README.md`. If you can't point at a file that tells the agent your security defaults, you don't have security defaults.

The teams that build this layer between now and end of year will have a different conversation with their CFO in 2027 than the ones that don't. That's the cleanup phase: the boring infrastructure that turns a hyped tool into a budgeted one.
