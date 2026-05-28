---
title: 'AI Valuations Are Pricing in Feedback Loops, Not Models'
description: 'Cognition raised $1B at a $26B valuation the same week five frontier LLMs disagreed on 67% of fact-check claims — the gap is grading loops.'
date: '2026-05-28'
keywords:
  - AI
  - Product
  - Engineering
author: 'Santiago Vázquez Villarreal'
draft: false
---

Cognition just raised $1B at a $26B valuation on $492M in ARR. The same week, a study showed five frontier LLMs disagree on 67% of 1,000 real-world fact-check claims. The numbers look unrelated. They name the same constraint: AI is worth decacorn multiples in domains that grade themselves, and very little in domains that don't.

I ship AI features into client systems across government, transportation, and industrial operators. The single question that decides whether a deployment is going to work is rarely "which model." It's "does this domain check its own work, and how fast?" That question is doing more work than people realize on which AI businesses are getting funded right now.

## Two numbers, one week

**Cognition raised $1B at a $26B valuation on $492M ARR.** That's a 2.5x valuation step in eight months, with enterprise usage up roughly 10x year-to-date ([Cognition raises $1B in $26B Series D — latent.space](https://www.latent.space/p/ainews-cognition-raises-1b-in-26b)). Coding agents are the loudest AI revenue story right now. The reason isn't that code is the most interesting problem — it's that code is the _most gradable_ one. A compiler decides yes or no. A test suite returns red or green. A reviewer or a static analyzer catches what slipped through. Every one of those gates is a feedback signal the model gets evaluated against — fast, automatic, often free. The product Cognition is selling sits on top of that grading stack. Remove the stack and the product collapses.

**Five frontier LLMs disagree on 67% of 1,000 real-world fact-check claims.** A Lenz study put GPT-5.4, Claude Opus 4.7, and Google's Gemini 3 Pro through 1,000 user-submitted claims, and on two-thirds of them at least one model dissented from the panel majority ([Five frontier LLMs disagree on 67% of fact-check claims — lenz.io](https://lenz.io/research/llm-disagreement)). On 34% of the claims, the models disagreed by two or more verdict buckets — that's a real spread, not calibration noise. Agreement is highest on clean True/False; disagreement clusters where the actual fact-checking work lives: _Mostly True_, _Misleading_, _Lacks Context_. There is no compiler for "is this claim true." There is no test suite for "is this misleading in context." Without a grader, the models drift in different directions and the user has no ground truth to anchor against.

> **Suggested image** — Prompt: A split diagram showing two AI deployment stacks — left side labeled "code" with a compiler / test-suite / review pipeline returning green checkmarks; right side labeled "truth" with three model outputs giving conflicting verdicts and no grader between them. Alt: Side-by-side diagram contrasting an AI coding pipeline with automated graders against an AI fact-checking pipeline with no grader. Caption: Two stacks, one constraint.

## If you don't live in this jargon, here's the translation

A "grading function" is anything outside the model that can tell you whether the output is right. Sometimes it's a piece of software: a compiler that refuses to build broken code, a test runner that fails on a wrong result, a static analyzer that flags an unsafe call. Sometimes it's a process: a code reviewer who pushes back, a checklist a nurse runs before discharging a patient, a quality engineer on an industrial line. The faster and more automatic the grader, the more upside an AI assistant has in that domain.

Domains where the grader is fast and free: code, chess, math proofs, anything with a deterministic answer. Domains where the grader is slow and human: medical diagnosis, legal interpretation, policy evaluation. Domains where there is no grader at all: most of what gets called "fact-checking" once you leave clean True/False claims. The Cognition valuation is the price of an excellent grading stack. The 67% disagreement rate is the price of not having one.

## What this means in practice

If you're scoping AI work right now — for a client, for your own team, for a fund underwriting a thesis — the question to ask before model selection is **what grades the output in this domain, and how fast?**

1. **If the domain already has a deterministic grader** (a compiler, a simulator, a structured ground-truth set), AI gets to iterate against it. That's where the obvious wins are, and where the current funding rounds are landing.
2. **If the domain has a slow human grader** (a regulator, a clinician, an auditor), the AI plays a different role — surfacing candidates, drafting, summarizing — and the workflow has to budget time for human review. The upside is real but smaller, and slower to compound.
3. **If the domain has no grader at all**, deploying AI is deploying a black box. That doesn't mean "don't do it." It means the deployment has to either build the grader (rubrics, gold sets, automated checks) or accept that mistakes will surface in the field instead of in development.

Most AI failures I see in client systems are step 3 dressed up as step 1.

## Closing

The decacorn AI businesses sit on top of grading loops. The undervalued AI problems are the ones where nobody yet knows how to build one. That second category is where a lot of the next round of work — and a lot of the next round of incidents — will land.
