"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  CornerDownLeft,
  Lightbulb,
  Map,
  MessageSquare,
  PenLine,
  Search,
  Sparkles,
  SquarePen,
  type LucideIcon,
} from "lucide-react";
import { allChats, type Chat } from "@/lib/data";

type PaletteAction = {
  id: string;
  label: string;
  hint: string;
  icon: LucideIcon;
  run: () => void;
};

type CommandPaletteProps = {
  open: boolean;
  onClose: () => void;
  onNewChat: () => void;
  onSelectChat: (chat: Chat) => void;
  onPrompt: (prompt: string) => void;
};

export default function CommandPalette({
  open,
  onClose,
  onNewChat,
  onSelectChat,
  onPrompt,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
    }
  }, [open]);

  const actions: PaletteAction[] = useMemo(
    () => [
      {
        id: "new",
        label: "New chat",
        hint: "Start with a clean slate",
        icon: SquarePen,
        run: onNewChat,
      },
      {
        id: "write",
        label: "Write something",
        hint: "Draft, rewrite, or polish",
        icon: PenLine,
        run: () => onPrompt("Help me write something. Ask me a few quick questions first."),
      },
      {
        id: "plan",
        label: "Plan something",
        hint: "Turn a goal into steps",
        icon: Map,
        run: () => onPrompt("Help me plan a project from start to finish. Ask me what matters most."),
      },
      {
        id: "explain",
        label: "Explain a concept",
        hint: "Make a hard idea click",
        icon: Lightbulb,
        run: () => onPrompt("Explain a concept to me in a simple, clear way. Pick something interesting."),
      },
    ],
    [onNewChat, onPrompt],
  );

  const q = query.trim().toLowerCase();
  const filteredActions = actions.filter(
    (action) =>
      !q || action.label.toLowerCase().includes(q) || action.hint.toLowerCase().includes(q),
  );
  const filteredChats = allChats.filter((chat) => !q || chat.title.toLowerCase().includes(q));

  const askItem: PaletteAction | null = q
    ? {
        id: "ask",
        label: query.trim(),
        hint: "Send this to Anything",
        icon: Sparkles,
        run: () => onPrompt(query.trim()),
      }
    : null;

  const items: PaletteAction[] = [
    ...(askItem ? [askItem] : []),
    ...filteredActions,
    ...filteredChats.map((chat) => ({
      id: `chat-${chat.id}`,
      label: chat.title,
      hint: chat.group,
      icon: MessageSquare,
      run: () => onSelectChat(chat),
    })),
  ];

  const runItem = (item: PaletteAction | undefined) => {
    if (!item) return;
    item.run();
    onClose();
  };

  if (!open) return null;

  const actionCount = (askItem ? 1 : 0) + filteredActions.length;

  return (
    <div
      className="fixed inset-0 z-[70] flex animate-fadeIn items-start justify-center bg-black/65 px-4 pt-[10vh] backdrop-blur-sm sm:pt-[14vh]"
      onMouseDown={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Search and commands"
    >
      <div
        className="w-full max-w-xl animate-popIn overflow-hidden rounded-2xl border border-white/[0.1] bg-ink-850/95 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.95)] backdrop-blur-2xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-white/[0.07] px-4">
          <Search size={16} className="shrink-0 text-white/30" />
          <input
            ref={inputRef}
            autoFocus
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActive(0);
            }}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown") {
                event.preventDefault();
                setActive((prev) => (items.length ? (prev + 1) % items.length : 0));
              } else if (event.key === "ArrowUp") {
                event.preventDefault();
                setActive((prev) => (items.length ? (prev - 1 + items.length) % items.length : 0));
              } else if (event.key === "Enter") {
                event.preventDefault();
                runItem(items[active]);
              } else if (event.key === "Escape") {
                onClose();
              }
            }}
            placeholder="Search chats, or ask anything…"
            className="h-14 min-w-0 flex-1 bg-transparent text-[14px] text-white/90 placeholder:text-white/25 focus:outline-none"
            aria-label="Search chats and commands"
          />
          <kbd className="hidden shrink-0 rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 font-sans text-[9.5px] text-white/30 sm:block">
            esc
          </kbd>
        </div>

        <div className="max-h-[min(52vh,380px)] overflow-y-auto p-2">
          {items.length === 0 && (
            <div className="px-3 py-10 text-center">
              <p className="text-[12.5px] text-white/40">No chats match “{query}”.</p>
              <p className="mt-1 text-[11px] text-white/25">
                Try a different phrase, or start a new chat.
              </p>
            </div>
          )}

          {askItem && (
            <div className="mb-1">
              <div className="px-2.5 pb-1 pt-1.5 text-[9.5px] font-medium uppercase tracking-[0.16em] text-white/25">
                Ask Anything
              </div>
              <button
                onMouseEnter={() => setActive(0)}
                onClick={() => runItem(askItem)}
                className={`ring-focus flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition ${
                  active === 0 ? "bg-white/[0.07]" : "hover:bg-white/[0.04]"
                }`}
              >
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-lime/15 text-lime">
                  <Sparkles size={14} />
                </span>
                <span className="min-w-0 flex-1 truncate text-[12.5px] text-white/85">
                  {askItem.label}
                </span>
                <span className="flex shrink-0 items-center gap-1 text-[10px] text-white/25">
                  <CornerDownLeft size={11} /> send
                </span>
              </button>
            </div>
          )}

          {filteredActions.length > 0 && (
            <div className="mb-1">
              <div className="px-2.5 pb-1 pt-1.5 text-[9.5px] font-medium uppercase tracking-[0.16em] text-white/25">
                Actions
              </div>
              {filteredActions.map((action, index) => {
                const itemIndex = (askItem ? 1 : 0) + index;
                return (
                  <button
                    key={action.id}
                    onMouseEnter={() => setActive(itemIndex)}
                    onClick={() => runItem(action)}
                    className={`ring-focus flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition ${
                      active === itemIndex ? "bg-white/[0.07]" : "hover:bg-white/[0.04]"
                    }`}
                  >
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-white/[0.05] text-white/45">
                      <action.icon size={14} />
                    </span>
                    <span className="min-w-0 flex-1 truncate text-[12.5px] text-white/80">
                      {action.label}
                    </span>
                    <span className="shrink-0 text-[10px] text-white/25">{action.hint}</span>
                  </button>
                );
              })}
            </div>
          )}

          {filteredChats.length > 0 && (
            <div>
              <div className="px-2.5 pb-1 pt-1.5 text-[9.5px] font-medium uppercase tracking-[0.16em] text-white/25">
                Recent chats
              </div>
              {filteredChats.map((chat, index) => {
                const itemIndex = actionCount + index;
                return (
                  <button
                    key={chat.id}
                    onMouseEnter={() => setActive(itemIndex)}
                    onClick={() => runItem(items[itemIndex])}
                    className={`ring-focus flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition ${
                      active === itemIndex ? "bg-white/[0.07]" : "hover:bg-white/[0.04]"
                    }`}
                  >
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-white/[0.05] text-white/40">
                      <MessageSquare size={13} />
                    </span>
                    <span className="min-w-0 flex-1 truncate text-[12.5px] text-white/75">
                      {chat.title}
                    </span>
                    <span className="shrink-0 text-[10px] text-white/25">{chat.group}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-white/[0.07] px-4 py-2.5 text-[10px] text-white/25">
          <span className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-white/10 bg-white/[0.04] px-1 font-sans text-[9px]">
                ↑↓
              </kbd>
              navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-white/10 bg-white/[0.04] px-1 font-sans text-[9px]">
                ↵
              </kbd>
              select
            </span>
          </span>
          <span className="flex items-center gap-1.5">
            <Sparkles size={10} className="text-lime" />
            Anything
          </span>
        </div>
      </div>
    </div>
  );
}
