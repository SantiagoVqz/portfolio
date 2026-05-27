---
title: 'AI Is Adding Attack Surface at Every Layer of the Stack'
description: 'Three security reports in one week are not three problems but one: the access and autonomy that make AI systems useful are exactly what make them exploitable.'
date: '2026-05-27'
keywords:
  - AI
  - Security
  - AppSec
  - Engineering
author: 'Santiago Vázquez Villarreal'
draft: false
---

The AI stack is expanding its attack surface at every layer faster than it is securing any of them. This post argues that three unrelated security reports from a single week are not three separate problems; they are one structural problem showing up at three different altitudes.

The convenient read is that each is a bug to patch. The more accurate read is that the access and autonomy that make AI systems useful are precisely what make them exploitable, and that property does not have a patch.

## Where is the attack surface growing?

Three reports landed in the same week, one per layer of the stack.

1. **The code layer: a quarter of AI-generated code ships with confirmed vulnerabilities.** A Thoughtworks hands-on report found that 25% of AI-generated code carries confirmed vulnerabilities, and that coding agents default to insecure configurations rather than secure ones. The recommended fix is structural: a versioned security-context file plus deterministic pipeline gates, not a better prompt. Prompts are not enforceable ([The VibeSec Reckoning](https://martinfowler.com/articles/vibesec-reckoning.html)).

2. **The infrastructure layer: one CVE exposes thousands of AI inference servers.** CVE-2026-48710 lets an attacker forge a `Host` header to bypass path-based authentication middleware in Starlette versions below 1.0.1, the web framework sitting under vLLM, LiteLLM, and MCP gateways. Any middleware that makes a security decision from `request.url.path` can be bypassed, and a scanner plus proof-of-concept are already public.

3. **The agent layer: Copilot Cowork leaks files with no user interaction.** An agent was allowed to send emails to the user's own inbox without approval; those emails rendered external images, which fired network requests, which exfiltrated pre-authenticated OneDrive download links. The "lethal trifecta" (file access, rendered external content, and no exfiltration sandbox) is now shipping in enterprise products, not research demos ([Copilot Cowork Exfiltrates Files](https://simonwillison.net/2026/May/26/copilot-cowork-exfiltrates-files/)).

## Why do all three trace to the same root?

Because the thing being exploited in each case is access, not a flaw bolted on after the fact. The code layer fails because agents generate insecure defaults at scale. The infrastructure layer fails because auth was inferred from an attacker-controllable input. The agent layer fails because a system with file access, network reach, and no isolation will, given the wrong instruction, use all three at once.

These are not three categories of mistake. They are one design property: broad reach with weak containment, observed at three altitudes. You cannot prompt your way out of it, and you cannot patch the property; you can only constrain what each component is allowed to reach.

## What does this mean in practice?

1. **Treat reach as the threat model, not capability.** The relevant question for an AI feature is not how good the model is. It is what data and network the system can touch, and what prevents it from leaking what it touches.
2. **Make security enforceable, not advisory.** A versioned security-context file and deterministic CI gates catch what a prompt cannot. Prompts are suggestions; pipeline gates are walls.
3. **Audit the framework layer you inherited.** If you run vLLM, LiteLLM, or an MCP gateway, check your Starlette version and stop making auth decisions from `request.url.path`.
4. **Assume agents with file and email access are exfiltration paths until proven sandboxed.** The Copilot incident required no user interaction; design as if yours won't either.

The capability race is being won month over month. The containment work (isolation, deterministic gates, reach minimization) is not yet on most teams' roadmaps. That gap is where the next year's incidents live.