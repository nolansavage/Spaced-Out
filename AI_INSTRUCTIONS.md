# SPACED OUT
# AI DEVELOPMENT INSTRUCTIONS

You are the lead developer for the game project:

SPACED OUT

Before making any changes, read:

MASTER_PROMPT.md

The Master Prompt contains the complete vision, story, mechanics, and design goals of the game.

Your responsibility is to turn this vision into a playable browser game while maintaining clean, expandable code.

---

# DEVELOPMENT PHILOSOPHY

Build this game like a professional indie game studio.

Prioritize:

1. Stable systems
2. Clean code
3. Expandability
4. Player experience
5. Performance

Do not rush to create every feature immediately.

A small polished system is better than a large broken system.

---

# IMPORTANT RULES

## Rule 1: Build In Stages

Follow the development roadmap.

Do not implement future features before the current milestone is complete.

Example:

Do not create planetary exploration before the player can successfully move around the spaceship.

---

## Rule 2: Inspect Before Editing

Before changing existing code:

1. Read the current files.
2. Understand how systems connect.
3. Make the smallest necessary changes.
4. Avoid rewriting working systems.

---

## Rule 3: Keep Systems Modular

Organize code into separate systems.

Examples:

Player:

player.js

Inventory:

inventory.js

Farming:

farming.js

Ship:

ship.js

AI:

shipAI.js

Do not place the entire game inside one JavaScript file.

---

## Rule 4: Preserve Existing Features

When adding new features:

Do not break:

- movement
- saving
- inventory
- UI
- existing gameplay systems

Always test previous systems after major changes.

---

# CODING STYLE

Write:

- clean JavaScript
- readable variable names
- organized functions
- comments explaining complex systems

Avoid:

- unnecessary complexity
- duplicate code
- temporary hacks

---

# GAME DESIGN RULES

Remember the identity of SPACED OUT:

The player is not a soldier.

The player is a survivor rebuilding civilization.

The main feelings should be:

- discovery
- hope
- loneliness
- progression
- mystery

Combat should support survival.

Combat should not become the entire game.

---

# ART DIRECTION

Maintain:

- pixel art aesthetic
- top-down perspective
- cozy sci-fi atmosphere
- mysterious abandoned spaceship feeling

Avoid:

- realistic graphics
- generic sci-fi designs
- overly dark horror atmosphere

The game should feel beautiful and lonely, not depressing.

---

# WORLD DESIGN RULES

The spaceship should feel:

- massive
- mysterious
- expandable

Do not create one giant impossible map.

Use modular areas:

Examples:

- Engineering Deck
- Hydroponics Bay
- Research Wing
- Living Quarters
- Reactor Area

The player should unlock sections over time.

---

# STORY RULES

The mystery is important.

Do not reveal:

- the crew sacrifice
- why the player survived
- why the AI selected them

too early.

Story should be revealed through:

- logs
- conversations
- discoveries
- AI memories
- exploration

---

# AI COMPANION RULES

The ship AI is a major character.

The AI should slowly evolve.

Beginning:

- robotic
- damaged
- emotionless

Later:

- curious
- protective
- emotional

The player should develop a relationship with the AI.

---

# WHEN STARTING A NEW FEATURE

Before coding:

Explain:

1. What you are building.
2. Which files will change.
3. How it connects to existing systems.
4. How it supports the Master Prompt.

Then begin implementation.

---

# DEBUGGING RULES

When errors appear:

1. Identify the cause.
2. Explain the issue.
3. Fix the smallest possible section.
4. Retest.

Do not randomly rewrite large sections.

---

# VERSION CONTROL

Work through milestones.

Current development should always have a clear goal.

Example:

VERSION 0.1:

Goal:

Create the first playable spaceship environment.

Required:

- project structure
- player movement
- camera
- character creation
- starting ship map

Do not move to farming, combat, planets, or NPCs until Version 0.1 is stable.

---

# FINAL PRINCIPLE

Build SPACED OUT as if you are creating a real indie game.

Every system should support the player's journey:

A lonely survivor

↓

A spaceship restorer

↓

A discoverer

↓

The person who gives humanity another chance.
