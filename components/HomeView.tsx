"use client";

import { ArrowUpRight, Sparkles } from "lucide-react";
import Composer from "./Composer";
import { exploreChips, suggestions } from "@/lib/data";

const chipPrompts: Record<string, string> = {
  names: "Help me brainstorm 20 memorable name ideas for a small coffee brand. Keep them short and easy to say.",
  summarize: "Summarize a long PDF into five key points, one quote, and one action item.",
  language: "Help me practice conversational Spanish for ten minutes. Start with a simple everyday scene.",
  data: "Help me make sense of a messy sales dataset and find the most interesting story in it.",
};

type HomeViewProps = {
  draft: string;
  onDraftChange: (value: string) => void;
  onSend: (value: string) => void;
  onStop: () => void;
  onPickPrompt: (prompt: string) => void;
  onOpenSearch: () => void;
  pending: boolean;
  focusToken: number;
  modelName: string;
};

export default function HomeView({
  draft,
  onDraftChange,
  onSend,
  onStop,
  onPickPrompt,
  onOpenSearch,
  pending,
  focusToken,
  modelName,
}: HomeViewProps) {
  return (
    <div className="relative min-h-0 flex-1 overflow-y-auto">
      <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col justify-center px-5 py-10 sm:px-8 sm:py-14">
        <div className="animate-fadeUp">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] py-1.5 pl-2.5 pr-3 text-[11px] text-white/45">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-50" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-lime" />
            </span>
            <span className="font-medium text-white/70">{modelName}</span>
            <span className="text-white/15">·</span>
            <span>ready when you are</span>
          </div>

          <h1 className="mt-6 text-balance text-[38px] font-medium leading-[1.04] tracking-[-0.035em] text-white sm:text-[54px]">
            Ask me{" "}
            <span className="bg-gradient-to-r from-lime-soft via-lime to-emerald-200 bg-clip-text font-serif italic text-transparent">
              anything
            </span>
            .
          </h1>

          <p className="mt-4 max-w-lg text-[13.5px] leading-relaxed text-white/35 sm:text-[14.5px]">
            Questions, half-formed ideas, a stubborn bug, a trip you keep postponing — bring it
            here. We&apos;ll figure it out together.
          </p>
        </div>

        <div className="mt-8 animate-fadeUp" style={{ animationDelay: "80ms" }}>
          <Composer
            value={draft}
            onChange={onDraftChange}
            onSend={onSend}
            onStop={onStop}
            pending={pending}
            focusToken={focusToken}
            modelName={modelName}
          />
        </div>

        <div className="mt-9 animate-fadeUp" style={{ animationDelay: "160ms" }}>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/25">
              Start with a spark
            </h2>
            <button
              onClick={onOpenSearch}
              className="ring-focus rounded text-[11px] text-white/25 transition hover:text-lime"
            >
              Browse all
            </button>
          </div>

          <div className="grid gap-2.5 sm:grid-cols-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                onClick={() => onPickPrompt(suggestion.prompt)}
                className="ring-focus group relative overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.02] p-3.5 text-left transition duration-200 hover:-translate-y-0.5 hover:border-white/[0.14] hover:bg-white/[0.04]"
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-white/10 bg-gradient-to-br ${suggestion.accent}`}
                  >
                    <suggestion.icon size={15} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="text-[12.5px] font-medium text-white/85">
                        {suggestion.title}
                      </span>
                      <span className="text-[9px] uppercase tracking-[0.12em] text-white/20">
                        {suggestion.label}
                      </span>
                    </span>
                    <span className="mt-0.5 block text-[11px] leading-snug text-white/30">
                      {suggestion.description}
                    </span>
                  </span>
                  <ArrowUpRight
                    size={14}
                    className="mt-0.5 shrink-0 text-white/15 transition group-hover:text-lime"
                  />
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-7 animate-fadeUp" style={{ animationDelay: "240ms" }}>
          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
            {exploreChips.map((chip) => (
              <button
                key={chip.id}
                onClick={() => onPickPrompt(chipPrompts[chip.id] ?? chip.label)}
                className="ring-focus inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/[0.07] bg-white/[0.02] px-3 py-1.5 text-[11px] text-white/40 transition hover:border-lime/25 hover:bg-lime/[0.04] hover:text-white/80"
              >
                <chip.icon size={11} className="text-white/30" />
                {chip.label}
              </button>
            ))}
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-dashed border-white/[0.07] px-3 py-1.5 text-[11px] text-white/20">
              <Sparkles size={11} />
              more every week
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
