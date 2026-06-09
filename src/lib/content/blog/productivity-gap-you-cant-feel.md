---
title: "The Productivity Gap You Can't Feel"
description: 'Developers using LLMs feel 24% faster but measure 19% slower — why the gap between perceived and real productivity should reshape AI tooling decisions.'
date: '2026-06-08'
keywords:
  - AI
  - Engineering
  - Product
author: 'Santiago Vázquez Villarreal'
draft: false
---

There's a number from today that's worth sitting with: developers using LLMs feel 24% faster. They're actually 19% slower. That's not a rounding error — it's a 43-point gap between subjective experience and measured reality.

A research synthesis published June 8 on Lobsters, drawing on multiple studies of LLM-assisted development, found that the productivity gains developers report are largely performative. The feeling of speed is real. The speed itself isn't. The explanation isn't complicated: cognitive offloading feels like fluency. When you're not doing the slow work of thinking, generating, and backtracking, the absence of friction registers as progress. You're moving faster through the interface while moving slower through the problem.

This matters because the entire enterprise case for AI coding tools rests on productivity metrics — and the most accessible metric is how engineers say they feel. That's a broken thermometer.

The second data point from the same day sharpens this. Anthropic's Jack Clark, writing in Import AI 460, reported that Anthropic has seen an 8x increase in code merged in 2026 compared to the 2021–2024 baseline, and framed that rate of increase as preliminary evidence of recursive self-improvement: AI-authored code enabling faster AI development, enabling faster code production. It's the strongest internal number the lab has published on this question.

These two data points sit in apparent contradiction — one showing a slowdown at the individual developer level, one showing a massive throughput increase at the organizational level. But they resolve cleanly if you accept that the unit of analysis has shifted. At Anthropic, humans are a verification layer above a largely synthetic workforce. For a single developer at a company that hasn't restructured around AI at that level, the experience is different: the tool generates, the developer reviews, and somewhere in that loop, the deep thinking that used to happen is being skipped.

The practical implication for teams: if you're tracking AI tool ROI by asking engineers whether they feel more productive, you're measuring the wrong thing. Earlier this month, Uber disclosed it had burned through its entire 2026 AI budget in four months before instituting a $1,500/month per-tool cap. Some portion of that spend was almost certainly justified by the subjective productivity signal. The new research suggests that signal is unreliable.

None of this means AI coding tools aren't useful — the productivity data is mixed and methodologically contested, and teams with strong engineering discipline do show real gains. But the gap between feeling and measurement is the thing most companies haven't accounted for in their AI tooling decisions.

The harder question worth asking: if AI was slowing your engineers down by 19% while making them feel faster, what in your current process would tell you?
