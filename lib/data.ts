import {
  Brain,
  Code2,
  Compass,
  Lightbulb,
  Map,
  PenLine,
  Sparkles,
  Zap,
  type LucideIcon,
} from "lucide-react";

export type Model = {
  id: string;
  name: string;
  tagline: string;
  icon: LucideIcon;
};

export const models: Model[] = [
  {
    id: "anything-1.5",
    name: "Anything 1.5",
    tagline: "Fast and balanced for everyday thinking",
    icon: Sparkles,
  },
  {
    id: "anything-1.5-pro",
    name: "Anything 1.5 Pro",
    tagline: "Deeper reasoning for harder problems",
    icon: Brain,
  },
  {
    id: "anything-mini",
    name: "Anything Mini",
    tagline: "Quick answers, very little waiting",
    icon: Zap,
  },
];

export type Suggestion = {
  id: string;
  label: string;
  title: string;
  description: string;
  prompt: string;
  icon: LucideIcon;
  accent: string;
};

export const suggestions: Suggestion[] = [
  {
    id: "explain",
    label: "Explain",
    title: "Make it click",
    description: "Break down a complex idea, simply.",
    prompt: "Explain how large language models work, like I'm curious but not a researcher.",
    icon: Lightbulb,
    accent: "from-amber-300/20 to-amber-500/5 text-amber-200",
  },
  {
    id: "write",
    label: "Write",
    title: "Find the words",
    description: "Draft, rewrite, or polish anything.",
    prompt: "Write a warm, short intro email to a new teammate joining our design team.",
    icon: PenLine,
    accent: "from-rose-300/20 to-rose-500/5 text-rose-200",
  },
  {
    id: "plan",
    label: "Plan",
    title: "Map it out",
    description: "Turn a fuzzy goal into a real plan.",
    prompt: "Plan a 5-day trip to Kyoto on a mid-range budget, with a calm daily rhythm.",
    icon: Map,
    accent: "from-sky-300/20 to-sky-500/5 text-sky-200",
  },
  {
    id: "build",
    label: "Build",
    title: "Make it work",
    description: "Code, debug, and ship with a partner.",
    prompt: "Build a small REST API with Node, Express, and Postgres. Start with the schema.",
    icon: Code2,
    accent: "from-violet-300/20 to-violet-500/5 text-violet-200",
  },
];

export const exploreChips = [
  { id: "names", label: "Brainstorm names", icon: Sparkles },
  { id: "summarize", label: "Summarize a long PDF", icon: Compass },
  { id: "language", label: "Practice a language", icon: Compass },
  { id: "data", label: "Make sense of data", icon: Brain },
];

export type Chat = {
  id: string;
  title: string;
  prompt: string;
  group: "Today" | "Yesterday" | "Previous 7 days";
  time: string;
};

export const historyGroups: { label: Chat["group"]; chats: Chat[] }[] = [
  {
    label: "Today",
    chats: [
      { id: "c1", title: "Kyoto in five quiet days", prompt: "Plan a 5-day trip to Kyoto on a mid-range budget, with a calm daily rhythm.", group: "Today", time: "2m" },
      { id: "c2", title: "Rewrite my portfolio bio", prompt: "Rewrite my portfolio bio so it sounds confident but not arrogant. I'm a product designer.", group: "Today", time: "1h" },
    ],
  },
  {
    label: "Yesterday",
    chats: [
      { id: "c3", title: "Explain transformers, simply", prompt: "Explain how transformers work, simply, with one useful analogy.", group: "Yesterday", time: "1d" },
      { id: "c4", title: "Sourdough keeps collapsing", prompt: "My sourdough keeps collapsing in the oven. Help me troubleshoot it.", group: "Yesterday", time: "1d" },
      { id: "c5", title: "Launch plan for a newsletter", prompt: "Launch plan for a small newsletter about design and technology.", group: "Yesterday", time: "1d" },
    ],
  },
  {
    label: "Previous 7 days",
    chats: [
      { id: "c6", title: "SQL window functions, please", prompt: "Explain SQL window functions with a practical example.", group: "Previous 7 days", time: "3d" },
      { id: "c7", title: "Name ideas for a coffee brand", prompt: "Name ideas for a coffee brand that feels warm and a little nostalgic.", group: "Previous 7 days", time: "4d" },
      { id: "c8", title: "A slower trip to Lisbon", prompt: "A slower trip to Lisbon: where should I stay and what should I not miss?", group: "Previous 7 days", time: "6d" },
    ],
  },
];

export const allChats: Chat[] = historyGroups.flatMap((group) => group.chats);

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  model?: string;
};

export function makeId() {
  return Math.random().toString(36).slice(2, 10);
}

function shorten(text: string, max = 64) {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length > max ? `${clean.slice(0, max - 1).trimEnd()}…` : clean;
}

export function titleFromPrompt(prompt: string) {
  return shorten(prompt, 46);
}

export function generateReply(prompt: string): string {
  const p = prompt.toLowerCase();
  const topic = shorten(prompt, 70);

  if (/(trip|travel|kyoto|lisbon|itinerary|vacation|holiday)/.test(p)) {
    return `Here's a calm, realistic way to shape **${topic}**.

**1. Decide the shape first**
- Pick one home base and at most two day trips. Fewer moves make better days.
- Book only the two things that sell out; leave the rest flexible.

**2. A simple five-day rhythm**
- Day 1 — Arrive, walk the neighborhood, eat somewhere close.
- Day 2 — The one big sight, then a deliberately slow afternoon.
- Day 3 — A day trip out of the city.
- Day 4 — Markets, food, and the neighborhood most people miss.
- Day 5 — A loose morning, last souvenirs, an easy exit.

**3. A budget sketch**
- Stay 45% · Food 25% · Transport 15% · Experiences 15%

Want me to turn this into a day-by-day itinerary with rough times and costs?`;
  }

  if (/(code|api|node|postgres|sql|bug|debug|function|typescript|react)/.test(p)) {
    return `Here's a clean starting point for **${topic}**.

\`\`\`ts
type Note = {
  id: string;
  body: string;
  createdAt: Date;
};

export async function createNote(body: string) {
  if (!body.trim()) {
    throw new Error("A note needs a body");
  }

  const note = {
    id: crypto.randomUUID(),
    body: body.trim(),
    createdAt: new Date(),
  };

  await db.notes.insert(note);
  return note;
}
\`\`\`

**Why this shape works**
- Validation lives at the boundary, so bad data never reaches the database.
- The function returns the created record, which keeps callers simple.
- Errors are explicit instead of silently swallowed.

**Next steps**
1. Add a unique constraint on \`id\`.
2. Write one test for the empty-body case.
3. Return a typed result instead of throwing, if this is a public API.

Tell me your schema and I'll adapt this to it.`;
  }

  if (/(email|write|bio|copy|rewrite|draft|letter|post|caption)/.test(p)) {
    return `Here's a draft you can send as-is — warm, brief, and easy to reply to.

**Subject:** A quick hello

Hi [Name],

I wanted to introduce myself properly — I'm [Your name], and I'll be working with you on [project/team]. I've been looking forward to this one.

A little context: I care about [one specific thing], and I'd love to hear what you're most excited about in the first few weeks. If it's useful, I'm happy to set up 20 minutes next week — no agenda needed beyond getting to know each other.

Either way, glad to be here.

Warmly,
[Your name]

**Why this works**
- It gives one clear next step instead of five vague ones.
- The short personal detail makes it feel human, not templated.
- It leaves the other person an easy way to say yes.

Want a more formal version, or a shorter one for a busy inbox?`;
  }

  if (/(plan|launch|newsletter|goal|habit|routine|strategy|roadmap)/.test(p)) {
    return `Here's a 30-day plan for **${topic}** that stays honest about time and energy.

**Week 1 — Foundation**
- Write down what "working" means in one sentence.
- Pick the single smallest action you can repeat.
- Set up a place to track it that you'll actually open.

**Week 2 — First reps**
- Do the small action daily, even on the bad days.
- Keep a two-line log: what happened, what you learned.
- Remove one source of friction you keep bumping into.

**Week 3 — Make it visible**
- Share a rough version with one person whose taste you trust.
- Ask one specific question, not "what do you think?"
- Improve the thing that got the most useful feedback.

**Week 4 — Decide what's next**
- Review the log. Keep what worked, cut what didn't.
- Choose one habit to protect and one to drop.
- Write the next 30-day version in five lines.

The goal isn't a perfect plan — it's a plan you'll still be following on day 30. Want me to turn this into a checklist with dates?`;
  }

  if (/(explain|what is|how does|why|transformer|quantum|model|llm)/.test(p)) {
    return `Think of **${topic}** in three layers.

**1. The simple version**
At its core, it's a way of taking something complicated and finding the pattern underneath it. Once you can see the pattern, the complicated thing stops feeling arbitrary.

**2. A useful analogy**
Imagine a huge library where every book is connected to the books that mention it. You don't need to read every book to find your way around — you just need to learn how the connections work. That's the real skill: navigating relationships, not memorizing shelves.

**3. Why it matters**
The practical payoff is that you can make better predictions with less information. That's true whether you're debugging a system, planning a week, or learning something new.

**A good next step**
Pick one small example and trace it end to end. Understanding arrives faster through one concrete case than through ten abstract definitions.

Want me to go deeper on any layer, or give you the version you'd explain to a 12-year-old?`;
  }

  return `Here's how I'd think about **${topic}**.

**Start with the outcome.** Write one sentence describing what "done" looks like. If you can't, that's the first thing to work on — not the tactics.

**Then make it small.** Find the smallest version you could finish today. Momentum is easier to steer than motivation.

**Then make it visible.** Put it somewhere you'll see it, and tell one person. A little social weight goes a long way.

**A useful question to sit with**
What would you do differently if you knew this had to work in two weeks, not two months?

If you share a bit more context — what you've tried, and what's getting in the way — I can turn this into something much more specific.`;
}
