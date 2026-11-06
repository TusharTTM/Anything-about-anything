"use client";

import { useEffect, useRef, useState } from "react";
import {
  Check,
  ChevronDown,
  CircleHelp,
  Keyboard,
  LogOut,
  Menu,
  Search,
  Share2,
  Sparkles,
} from "lucide-react";
import { models, type Model } from "@/lib/data";

type TopBarProps = {
  model: Model;
  onModelChange: (model: Model) => void;
  onOpenSidebar: () => void;
  onOpenSearch: () => void;
  title?: string | null;
};

type Menu = "model" | "help" | "user" | null;

export default function TopBar({
  model,
  onModelChange,
  onOpenSidebar,
  onOpenSearch,
  title,
}: TopBarProps) {
  const [menu, setMenu] = useState<Menu>(null);
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimer.current) clearTimeout(copyTimer.current);
    };
  }, []);

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const close = () => setMenu(null);

  return (
    <header className="relative z-30 flex h-16 shrink-0 items-center gap-2 border-b border-white/[0.06] bg-ink-950/30 px-3 backdrop-blur-xl sm:gap-3 sm:px-5">
      <button
        onClick={onOpenSidebar}
        className="ring-focus grid h-9 w-9 place-items-center rounded-lg text-white/50 transition hover:bg-white/[0.06] hover:text-white lg:hidden"
        aria-label="Open menu"
      >
        <Menu size={18} />
      </button>

      {/* Model picker */}
      <div className="relative">
        <button
          onClick={() => setMenu(menu === "model" ? null : "model")}
          className="ring-focus flex h-9 items-center gap-2 rounded-lg border border-transparent px-2 text-[13px] font-medium text-white/85 transition hover:border-white/10 hover:bg-white/[0.04]"
          aria-haspopup="menu"
          aria-expanded={menu === "model"}
        >
          <span className="grid h-6 w-6 place-items-center rounded-md bg-white/[0.06]">
            <model.icon size={13} className="text-lime" />
          </span>
          <span className="max-w-[88px] truncate sm:max-w-[180px]">{model.name}</span>
          <ChevronDown
            size={14}
            className={`text-white/30 transition ${menu === "model" ? "rotate-180" : ""}`}
          />
        </button>

        {menu === "model" && (
          <>
            <div className="fixed inset-0 z-40" onClick={close} aria-hidden="true" />
            <div
              className="absolute left-0 top-full z-50 mt-2 w-[min(290px,calc(100vw-4.5rem))] animate-popIn rounded-xl border border-white/10 bg-ink-800/95 p-1.5 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] backdrop-blur-2xl"
              role="menu"
            >
              <div className="px-2.5 pb-1.5 pt-1 text-[10px] font-medium uppercase tracking-[0.16em] text-white/25">
                Choose a model
              </div>
              {models.map((m) => {
                const active = m.id === model.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => {
                      onModelChange(m);
                      close();
                    }}
                    className={`ring-focus flex w-full items-start gap-2.5 rounded-lg px-2.5 py-2 text-left transition ${
                      active ? "bg-white/[0.06]" : "hover:bg-white/[0.04]"
                    }`}
                    role="menuitem"
                  >
                    <span
                      className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-md ${
                        active ? "bg-lime/15 text-lime" : "bg-white/[0.05] text-white/40"
                      }`}
                    >
                      <m.icon size={14} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-1.5 text-[12.5px] font-medium text-white/90">
                        {m.name}
                        {m.id === "anything-1.5-pro" && (
                          <span className="rounded bg-violet-400/15 px-1 py-px text-[8.5px] font-semibold uppercase tracking-wide text-violet-200">
                            Pro
                          </span>
                        )}
                      </span>
                      <span className="mt-0.5 block text-[10.5px] leading-snug text-white/35">
                        {m.tagline}
                      </span>
                    </span>
                    {active && <Check size={14} className="mt-1 shrink-0 text-lime" />}
                  </button>
                );
              })}
              <div className="mt-1 border-t border-white/[0.07] px-2.5 py-2 text-[10px] leading-relaxed text-white/25">
                Models are shared across your chats. You can switch anytime.
              </div>
            </div>
          </>
        )}
      </div>

      {title && (
        <div className="hidden min-w-0 items-center gap-2 md:flex">
          <span className="h-1 w-1 shrink-0 rounded-full bg-white/20" />
          <span className="max-w-[300px] truncate text-[12px] text-white/35">{title}</span>
        </div>
      )}

      <div className="ml-auto flex items-center gap-1 sm:gap-1.5">
        <button
          onClick={share}
          className="ring-focus flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-[12px] font-medium text-white/50 transition hover:bg-white/[0.05] hover:text-white/85"
        >
          {copied ? <Check size={14} className="text-lime" /> : <Share2 size={14} />}
          <span className="hidden sm:inline">{copied ? "Link copied" : "Share"}</span>
        </button>

        <div className="relative hidden sm:block">
          <button
            onClick={() => setMenu(menu === "help" ? null : "help")}
            className="ring-focus grid h-9 w-9 place-items-center rounded-lg text-white/40 transition hover:bg-white/[0.05] hover:text-white/80"
            aria-label="Quick tips"
            aria-expanded={menu === "help"}
          >
            <CircleHelp size={16} />
          </button>
          {menu === "help" && (
            <>
              <div className="fixed inset-0 z-40" onClick={close} aria-hidden="true" />
              <div className="absolute right-0 top-full z-50 mt-2 w-[268px] animate-popIn rounded-xl border border-white/10 bg-ink-800/95 p-3 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] backdrop-blur-2xl">
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-white/80">
                  <Sparkles size={12} className="text-lime" /> Quick tips
                </div>
                <ul className="mt-2 space-y-2 text-[11px] leading-relaxed text-white/40">
                  <li className="flex gap-2">
                    <kbd className="mt-px h-fit rounded border border-white/10 bg-white/[0.04] px-1 py-px font-sans text-[9.5px] text-white/50">
                      ⌘K
                    </kbd>
                    Search chats and jump anywhere.
                  </li>
                  <li className="flex gap-2">
                    <kbd className="mt-px h-fit rounded border border-white/10 bg-white/[0.04] px-1 py-px font-sans text-[9.5px] text-white/50">
                      ↵
                    </kbd>
                    Send a message. Shift + Enter for a new line.
                  </li>
                  <li className="flex gap-2">
                    <kbd className="mt-px h-fit rounded border border-white/10 bg-white/[0.04] px-1 py-px font-sans text-[9.5px] text-white/50">
                      +
                    </kbd>
                    Attach a file or turn on a tool before you ask.
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>

        <div className="mx-1 hidden h-5 w-px bg-white/10 sm:block" />

        <div className="relative">
          <button
            onClick={() => setMenu(menu === "user" ? null : "user")}
            className="ring-focus grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-violet-400 via-fuchsia-400 to-sky-400 text-[11px] font-semibold text-ink-950 ring-2 ring-white/10 transition hover:ring-white/25"
            aria-label="Account menu"
            aria-expanded={menu === "user"}
          >
            T
          </button>
          {menu === "user" && (
            <>
              <div className="fixed inset-0 z-40" onClick={close} aria-hidden="true" />
              <div className="absolute right-0 top-full z-50 mt-2 w-[236px] animate-popIn rounded-xl border border-white/10 bg-ink-800/95 p-1.5 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] backdrop-blur-2xl">
                <div className="border-b border-white/[0.07] px-2.5 pb-2.5 pt-2">
                  <div className="text-[12.5px] font-medium text-white/90">Tushar</div>
                  <div className="mt-0.5 text-[10.5px] text-white/35">Free plan · 1 member</div>
                </div>
                <button
                  onClick={() => {
                    onOpenSearch();
                    close();
                  }}
                  className="ring-focus mt-1 flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[12px] text-white/60 transition hover:bg-white/[0.05] hover:text-white/90"
                >
                  <Search size={14} /> Search & shortcuts
                </button>
                <button
                  onClick={() => {
                    onOpenSearch();
                    close();
                  }}
                  className="ring-focus flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[12px] text-white/60 transition hover:bg-white/[0.05] hover:text-white/90"
                >
                  <Keyboard size={14} /> Keyboard shortcuts
                </button>
                <button
                  onClick={close}
                  className="ring-focus flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[12px] text-white/60 transition hover:bg-white/[0.05] hover:text-white/90"
                >
                  <LogOut size={14} /> Log out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
