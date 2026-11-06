"use client";

import { useEffect, useRef, useState } from "react";
import {
  Check,
  Copy,
  RotateCcw,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import Composer from "./Composer";
import type { Message } from "@/lib/data";

function renderInline(text: string, keyPrefix: string) {
  const tokens = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return tokens.map((token, index) => {
    const key = `${keyPrefix}-${index}`;
    if (token.startsWith("**") && token.endsWith("**") && token.length > 4) {
      return (
        <strong key={key} className="font-semibold text-white/95">
          {token.slice(2, -2)}
        </strong>
      );
    }
    if (token.startsWith("`") && token.endsWith("`") && token.length > 2) {
      return (
        <code
          key={key}
          className="rounded border border-white/[0.06] bg-white/[0.06] px-1 py-0.5 font-mono text-[0.88em] text-lime/90"
        >
          {token.slice(1, -1)}
        </code>
      );
    }
    return <span key={key}>{token}</span>;
  });
}

function TextBlock({ text }: { text: string }) {
  const lines = text.split("\n");
  const blocks: React.ReactNode[] = [];
  let bullets: string[] = [];
  let numbers: string[] = [];

  const flush = () => {
    if (bullets.length) {
      blocks.push(
        <ul key={`ul-${blocks.length}`} className="my-2 space-y-1.5 pl-1">
          {bullets.map((item, index) => (
            <li key={index} className="flex gap-2.5">
              <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-lime/70" />
              <span>{renderInline(item, `b-${blocks.length}-${index}`)}</span>
            </li>
          ))}
        </ul>,
      );
      bullets = [];
    }
    if (numbers.length) {
      blocks.push(
        <ol key={`ol-${blocks.length}`} className="my-2 space-y-1.5 pl-1">
          {numbers.map((item, index) => (
            <li key={index} className="flex gap-2.5">
              <span className="mt-px grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-[9.5px] font-medium text-white/45">
                {index + 1}
              </span>
              <span>{renderInline(item, `n-${blocks.length}-${index}`)}</span>
            </li>
          ))}
        </ol>,
      );
      numbers = [];
    }
  };

  lines.forEach((rawLine) => {
    const line = rawLine.trim();
    if (!line) {
      flush();
      return;
    }
    const bullet = line.match(/^[-*]\s+(.*)$/);
    if (bullet) {
      bullets.push(bullet[1]);
      return;
    }
    const numbered = line.match(/^\d+\.\s+(.*)$/);
    if (numbered) {
      numbers.push(numbered[1]);
      return;
    }
    const heading = line.match(/^\*\*([^*]+)\*\*$/);
    if (heading) {
      flush();
      blocks.push(
        <h3
          key={`h-${blocks.length}`}
          className="mb-0.5 mt-3 text-[12.5px] font-semibold tracking-wide text-white/90 first:mt-0"
        >
          {heading[1]}
        </h3>,
      );
      return;
    }
    flush();
    blocks.push(
      <p key={`p-${blocks.length}`} className="leading-[1.75]">
        {renderInline(line, `p-${blocks.length}`)}
      </p>,
    );
  });
  flush();

  return <div className="space-y-2.5">{blocks}</div>;
}

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="my-3 overflow-hidden rounded-xl border border-white/[0.08] bg-black/40">
      <div className="flex items-center justify-between border-b border-white/[0.06] bg-white/[0.02] px-3 py-1.5">
        <span className="font-mono text-[10px] uppercase tracking-wider text-white/25">code</span>
        <button
          onClick={copy}
          className="ring-focus flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] text-white/35 transition hover:bg-white/[0.06] hover:text-white/80"
        >
          {copied ? <Check size={11} className="text-lime" /> : <Copy size={11} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-3.5 text-[12px] leading-[1.7] text-white/75">
        <code>{code.trim()}</code>
      </pre>
    </div>
  );
}

function MessageBody({ content }: { content: string }) {
  const parts = content.split("```");
  return (
    <div className="text-[13.5px] text-white/70 sm:text-[14px]">
      {parts.map((part, index) =>
        index % 2 === 1 ? (
          <CodeBlock key={index} code={part} />
        ) : (
          <TextBlock key={index} text={part} />
        ),
      )}
    </div>
  );
}

function AssistantAvatar() {
  return (
    <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-lime via-lime to-emerald-300 shadow-[0_0_20px_-8px_rgba(216,255,107,0.9)]">
      <Sparkles size={13} strokeWidth={2.4} className="text-ink-950" />
    </span>
  );
}

function MessageItem({
  message,
  isLast,
  modelName,
  onRegenerate,
}: {
  message: Message;
  isLast: boolean;
  modelName: string;
  onRegenerate: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [vote, setVote] = useState<"up" | "down" | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  if (message.role === "user") {
    return (
      <div className="flex animate-fadeUp justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-br-md border border-white/[0.08] bg-white/[0.06] px-4 py-2.5 text-[13.5px] leading-relaxed text-white/85 sm:text-[14px]">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="group flex animate-fadeUp gap-3">
      <AssistantAvatar />
      <div className="min-w-0 flex-1">
        <div className="mb-1.5 flex items-center gap-2">
          <span className="text-[12px] font-medium text-white/85">Anything</span>
          <span className="rounded border border-white/[0.08] bg-white/[0.03] px-1.5 py-px text-[9px] text-white/30">
            {message.model ?? modelName}
          </span>
        </div>
        <MessageBody content={message.content} />
        <div className="mt-2 flex items-center gap-0.5 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
          <button
            onClick={copy}
            className="ring-focus grid h-7 w-7 place-items-center rounded-md text-white/30 transition hover:bg-white/[0.06] hover:text-white/80"
            aria-label="Copy response"
            title="Copy"
          >
            {copied ? <Check size={13} className="text-lime" /> : <Copy size={13} />}
          </button>
          <button
            onClick={() => setVote(vote === "up" ? null : "up")}
            className={`ring-focus grid h-7 w-7 place-items-center rounded-md transition hover:bg-white/[0.06] ${
              vote === "up" ? "text-lime" : "text-white/30 hover:text-white/80"
            }`}
            aria-label="Good response"
            title="Good response"
          >
            <ThumbsUp size={13} />
          </button>
          <button
            onClick={() => setVote(vote === "down" ? null : "down")}
            className={`ring-focus grid h-7 w-7 place-items-center rounded-md transition hover:bg-white/[0.06] ${
              vote === "down" ? "text-rose-300" : "text-white/30 hover:text-white/80"
            }`}
            aria-label="Bad response"
            title="Bad response"
          >
            <ThumbsDown size={13} />
          </button>
          {isLast && (
            <button
              onClick={onRegenerate}
              className="ring-focus grid h-7 w-7 place-items-center rounded-md text-white/30 transition hover:bg-white/[0.06] hover:text-white/80"
              aria-label="Regenerate response"
              title="Regenerate"
            >
              <RotateCcw size={13} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Thinking() {
  return (
    <div className="flex animate-fadeIn gap-3">
      <AssistantAvatar />
      <div className="flex items-center gap-2 pt-1.5">
        <span className="flex items-center gap-1">
          {[0, 1, 2].map((index) => (
            <span
              key={index}
              className="h-1.5 w-1.5 animate-pulseDot rounded-full bg-lime/80"
              style={{ animationDelay: `${index * 140}ms` }}
            />
          ))}
        </span>
        <span className="bg-gradient-to-r from-white/30 via-white/70 to-white/30 bg-[length:200%_100%] bg-clip-text text-[11.5px] text-transparent animate-shimmer">
          Thinking it through…
        </span>
      </div>
    </div>
  );
}

type ChatViewProps = {
  messages: Message[];
  pending: boolean;
  draft: string;
  onDraftChange: (value: string) => void;
  onSend: (value: string) => void;
  onStop: () => void;
  focusToken: number;
  modelName: string;
  onRegenerate: () => void;
};

export default function ChatView({
  messages,
  pending,
  draft,
  onDraftChange,
  onSend,
  onStop,
  focusToken,
  modelName,
  onRegenerate,
}: ChatViewProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, pending]);

  const lastAssistantId = [...messages].reverse().find((m) => m.role === "assistant")?.id;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-3xl px-5 pb-6 pt-6 sm:px-8 sm:pt-8">
          <div className="mb-7 flex justify-center">
            <span className="rounded-full border border-white/[0.07] bg-white/[0.02] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-white/25">
              Today
            </span>
          </div>

          <div className="space-y-7" aria-live="polite" aria-relevant="additions">
            {messages.map((message) => (
              <MessageItem
                key={message.id}
                message={message}
                isLast={message.id === lastAssistantId}
                modelName={modelName}
                onRegenerate={onRegenerate}
              />
            ))}
            {pending && <Thinking />}
          </div>
          <div ref={endRef} className="h-2" />
        </div>
      </div>

      <div className="relative shrink-0 bg-gradient-to-t from-ink-950 via-ink-950/95 to-ink-950/0 px-5 pb-3 pt-2 sm:px-8">
        <div className="mx-auto w-full max-w-3xl">
          <Composer
            value={draft}
            onChange={onDraftChange}
            onSend={onSend}
            onStop={onStop}
            pending={pending}
            focusToken={focusToken}
            modelName={modelName}
            showDisclaimer={false}
          />
          <p className="mt-1.5 text-center text-[10px] text-white/20">
            Anything can make mistakes. Check important info.
          </p>
        </div>
      </div>
    </div>
  );
}
