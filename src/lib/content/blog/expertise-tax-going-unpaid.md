---
title: 'The Expertise Tax Is Going Unpaid'
description: "The senior engineer's AI edge was built through years of manual debugging — work AI now makes optional, which threatens to stop producing new seniors."
date: '2026-05-29'
keywords:
  - AI
  - Engineering
  - Product
author: 'Santiago Vázquez Villarreal'
cover: '/blog/expertise-tax.png'
coverAlt: 'A pair of hands typing on a mechanical keyboard in low light.'
draft: false
---

The senior engineer's AI advantage is not a quirk of personality, and it isn't entirely a matter of practice either. It's a historical artifact: the residue of years spent doing the work that AI now makes optional. That advantage is real, and it's about to stop replicating.

The conversation about AI and engineering has been stuck on the wrong question for two years. It isn't whether agents will replace senior engineers. It's whether the next decade will produce any.

## Who I'm talking to

I ship AI features into client systems across enterprise and industrial operators. The conversation I keep having with engineering leaders is the same one, and it's not about model selection or copilot configuration. It's about the slow erosion of the bench: who, three years from now, is going to have the judgment to debug, review, or replace what the agents are writing today.

If you don't write code for a living, here's the part to understand. The thing senior engineers do that's hard to replicate isn't typing fast. It's the _mental model_, the picture in their head of how a system fails, that lets them point at code and say "the bug is here." That model gets built by spending hours doing work that AI now makes optional. The optionality is the problem.

## What this week's evidence looks like

Three pieces hit in the same 72 hours, from three corners of the industry, describing the same erosion from different angles.

1. **The expertise tax has a name.** Modern Descartes' ["Expertise in the Age of AI"](https://www.moderndescartes.com/essays/ai_and_expertise/) argues that what senior engineers have, and what AI agents lean on, was built through years of manual debugging: sitting with a stack trace, watching a frozen process, getting the print statements wrong before getting them right. Roughly half of new CS graduates won't build that intuition because AI removes the requirement to. OpenAI and Anthropic still pay enormous premiums for the juniors who do.

2. **The practitioner antidote.** [Vicki Boykis](https://vickiboykis.com/2026/05/28/we-should-be-more-tired-than-the-model/) names the working-engineer prescription: write the first draft yourself, then bring the agent in. The order matters. Agent-writes-then-human-reviews looks efficient on a sprint board and quietly hollows out the human reviewing. Working memory doesn't engage when you're judging output instead of producing it. Human-writes-then-agent-extends keeps the skill loop intact.

3. **The institutional response.** [Flathub, the largest Linux app distribution platform, banned LLM-generated submissions](https://social.treehouse.systems/@barthalion/116657011366876079). The maintainers' framing isn't that the code is broken. It's that the submission process exists to capture judgment, and there's no judgment on the upstream side when the submission is generated.

![A pair of hands typing on a mechanical keyboard in low light.](/blog/expertise-tax.png)

_The hours that produced senior engineers are still available. They're just optional now._

## The thing the three findings share

Same tooling, same generation of model. What separates teams whose bench keeps growing from teams whose doesn't is whether anyone is still doing the slow, frustrating, working-memory-engaging work that builds the model in the engineer's head, not the model on the screen.

The framing matters. "Deskilling" implies a skill that already exists is wearing away. That's not quite right. The thing being lost is upstream of the skill: it's the _conditions_ that produce the skill in the first place. The painful hours debugging are themselves the apprenticeship. They aren't a cost paid in exchange for an unrelated reward. They are the reward.

## In practice

Two questions worth asking on Monday morning.

1. **Who on the team is still writing code by hand?** Not "in addition to using AI," but as the first draft, with the agent brought in afterward. If the answer is "nobody under five years of experience," the seniority pipeline is closed and nobody has noticed yet.
2. **Is that practice protected when the agent gets faster?** When the next model halves the time to ship a feature, where does the saved time go: more agent-assisted shipping, or toward preserving a slower track for engineers building their model?

The honest answer for most teams right now is door number one. That's fine for this year. It becomes a problem in 2029.

## Closing

I might be wrong about the timeline. Mental-model erosion could turn out slower than this read suggests, or the next generation of agents could become genuinely transparent in a way today's models aren't, which would make the loss less load-bearing than it looks here. But the signals all point the same direction: Flathub drawing the institutional line, the Modern Descartes argument, the Boykis prescription. The work that produced seniority is becoming optional, and optional work doesn't get done.
