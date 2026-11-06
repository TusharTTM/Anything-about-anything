"use client";

import {
  ChevronRight,
  Compass,
  MessageSquare,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import type { Chat } from "@/lib/data";

type SidebarProps = {
  groups: { label: Chat["group"]; chats: Chat[] }[];
  open: boolean;
  collapsed: boolean;
  activeChatId: string | null;
  onClose: () => void;
  onToggleCollapse: () => void;
  onNewChat: () => void;
  onOpenSearch: () => void;
  onSelectChat: (chat: Chat) => void;
};

export default function Sidebar({
  groups,
  open,
  collapsed,
  activeChatId,
  onClose,
  onToggleCollapse,
  onNewChat,
  onOpenSearch,
  onSelectChat,
}: SidebarProps) {
  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden="true"
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[280px] shrink-0 flex-col border-r border-white/[0.06] bg-ink-900/95 backdrop-blur-xl transition-[transform,width] duration-300 ease-out lg:static lg:z-auto lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        } ${collapsed ? "lg:w-[76px]" : "lg:w-[280px]"}`}
        aria-label="Chat history"
      >
        {/* Brand */}
        <div className="flex h-16 shrink-0 items-center gap-2.5 px-4">
          <button
            onClick={onNewChat}
            className="ring-focus flex min-w-0 items-center gap-2.5 rounded-lg text-left"
            aria-label="Anything home"
          >
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-[10px] bg-gradient-to-br from-lime via-lime to-emerald-300 shadow-[0_0_24px_-6px_rgba(216,255,107,0.7)]">
              <Sparkles size={16} strokeWidth={2.4} className="text-ink-950" />
            </span>
            <span
              className={`flex min-w-0 items-baseline gap-1.5 ${collapsed ? "lg:hidden" : ""}`}
            >
              <span className="truncate text-[16.5px] font-semibold tracking-[-0.02em] text-white/95">
                anything
              </span>
              <span className="rounded border border-white/10 bg-white/[0.04] px-1 py-px text-[8.5px] font-medium uppercase tracking-wider text-white/35">
                beta
              </span>
            </span>
          </button>

          <div className={`ml-auto flex items-center gap-1 ${collapsed ? "lg:hidden" : ""}`}>
            <button
              onClick={onToggleCollapse}
              className="ring-focus hidden h-8 w-8 place-items-center rounded-lg text-white/35 transition hover:bg-white/[0.06] hover:text-white/80 lg:grid"
              aria-label="Collapse sidebar"
              title="Collapse sidebar"
            >
              <PanelLeftClose size={16} />
            </button>
            <button
              onClick={onClose}
              className="ring-focus grid h-8 w-8 place-items-center rounded-lg text-white/40 transition hover:bg-white/[0.06] hover:text-white/80 lg:hidden"
              aria-label="Close menu"
            >
              <X size={17} />
            </button>
          </div>

          {collapsed && (
            <button
              onClick={onToggleCollapse}
              className="ring-focus ml-auto hidden h-8 w-8 place-items-center rounded-lg text-white/35 transition hover:bg-white/[0.06] hover:text-white/80 lg:grid"
              aria-label="Expand sidebar"
              title="Expand sidebar"
            >
              <PanelLeftOpen size={16} />
            </button>
          )}
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-3 pb-3">
          {/* New chat */}
          <button
            onClick={onNewChat}
            className={`ring-focus group flex items-center gap-2.5 rounded-xl bg-lime px-3 text-[13px] font-semibold text-ink-950 shadow-[0_8px_30px_-12px_rgba(216,255,107,0.8)] transition hover:bg-lime-soft active:scale-[0.99] ${
              collapsed ? "h-10 justify-center lg:px-0" : "h-10"
            }`}
            title="New chat"
          >
            <Plus size={16} strokeWidth={2.6} className="shrink-0" />
            <span className={collapsed ? "lg:hidden" : ""}>New chat</span>
            {!collapsed && (
              <span className="ml-auto hidden items-center gap-1 rounded-md border border-black/10 bg-black/[0.06] px-1.5 py-0.5 text-[9.5px] font-medium text-ink-950/50 sm:flex">
                <Sparkles size={9} />
                start fresh
              </span>
            )}
          </button>

          {/* Search */}
          <button
            onClick={onOpenSearch}
            className={`ring-focus flex items-center gap-2.5 rounded-xl border border-white/[0.07] bg-white/[0.02] text-[12.5px] text-white/40 transition hover:border-white/15 hover:bg-white/[0.05] hover:text-white/70 ${
              collapsed ? "h-10 justify-center lg:px-0" : "h-9 px-3"
            }`}
            title="Search chats"
          >
            <Search size={15} className="shrink-0" />
            <span className={collapsed ? "lg:hidden" : ""}>Search chats</span>
            {!collapsed && (
              <kbd className="ml-auto rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 font-sans text-[9.5px] text-white/30">
                ⌘K
              </kbd>
            )}
          </button>

          {/* Primary nav */}
          <nav className={`flex flex-col gap-0.5 ${collapsed ? "lg:items-center" : ""}`}>
            <div
              className={`flex items-center gap-2.5 rounded-lg bg-white/[0.06] px-2.5 py-2 text-[12.5px] text-white/90 ${
                collapsed ? "lg:justify-center lg:px-0" : ""
              }`}
              aria-current="page"
              title="Chats"
            >
              <MessageSquare size={15} className="text-lime" />
              <span className={collapsed ? "lg:hidden" : ""}>Chats</span>
            </div>
            <button
              onClick={onOpenSearch}
              className={`ring-focus flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[12.5px] text-white/45 transition hover:bg-white/[0.04] hover:text-white/80 ${
                collapsed ? "lg:justify-center lg:px-0" : ""
              }`}
              title="Explore"
            >
              <Compass size={15} />
              <span className={collapsed ? "lg:hidden" : ""}>Explore</span>
            </button>
          </nav>

          {collapsed ? (
            <button
              onClick={onToggleCollapse}
              className="ring-focus mt-1 hidden h-9 items-center justify-center rounded-lg text-white/30 transition hover:bg-white/[0.05] hover:text-white/70 lg:flex"
              title="Show chat history"
              aria-label="Show chat history"
            >
              <PanelLeftOpen size={16} />
            </button>
          ) : (
            <div className="mt-1 flex min-h-0 flex-col">
              <div className="mb-1 flex items-center justify-between px-2">
                <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-white/25">
                  Recents
                </span>
                <button
                  onClick={onOpenSearch}
                  className="ring-focus rounded text-[10.5px] text-white/25 transition hover:text-lime"
                >
                  See all
                </button>
              </div>

              <div className="flex flex-col">
                {groups.map((group) => (
                  <div key={group.label} className="mb-1">
                    <div className="px-2 pb-1 pt-2.5 text-[10px] font-medium tracking-wide text-white/20">
                      {group.label}
                    </div>
                    {group.chats.map((chat) => {
                      const active = chat.id === activeChatId;
                      return (
                        <button
                          key={chat.id}
                          onClick={() => onSelectChat(chat)}
                          className={`ring-focus group flex w-full items-center gap-2.5 rounded-lg px-2 py-[7px] text-left text-[12.5px] transition ${
                            active
                              ? "bg-white/[0.07] text-white/95"
                              : "text-white/45 hover:bg-white/[0.04] hover:text-white/80"
                          }`}
                          title={chat.title}
                        >
                          <MessageSquare
                            size={13.5}
                            className={`shrink-0 ${active ? "text-lime" : "text-white/25"}`}
                          />
                          <span className="min-w-0 flex-1 truncate">{chat.title}</span>
                          <ChevronRight
                            size={13}
                            className="shrink-0 text-white/0 transition group-hover:text-white/35"
                          />
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-white/[0.06] p-3">
          {!collapsed && (
            <div className="mb-3 overflow-hidden rounded-xl border border-white/[0.08] bg-gradient-to-br from-lime/[0.10] via-white/[0.02] to-violet-400/[0.08] p-3">
              <div className="flex items-center gap-1.5">
                <Sparkles size={13} className="text-lime" />
                <span className="text-[12px] font-medium text-white/90">Anything Pro</span>
                <span className="ml-auto rounded border border-white/10 bg-white/[0.05] px-1.5 py-px text-[8.5px] uppercase tracking-wider text-white/35">
                  Soon
                </span>
              </div>
              <p className="mt-1.5 text-[11px] leading-relaxed text-white/35">
                Longer context, priority speed, and early access to new models.
              </p>
            </div>
          )}

          <div
            className={`flex items-center gap-2.5 rounded-lg px-1 py-1 ${
              collapsed ? "lg:justify-center" : ""
            }`}
          >
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gradient-to-br from-violet-400 via-fuchsia-400 to-sky-400 text-[11px] font-semibold text-ink-950 ring-2 ring-white/10">
              T
            </span>
            <div className={`min-w-0 flex-1 ${collapsed ? "lg:hidden" : ""}`}>
              <div className="truncate text-[12px] font-medium text-white/85">Tushar</div>
              <div className="truncate text-[10px] text-white/30">Free plan</div>
            </div>
            <button
              onClick={onOpenSearch}
              className={`ring-focus grid h-7 w-7 shrink-0 place-items-center rounded-md text-white/30 transition hover:bg-white/[0.06] hover:text-white/70 ${
                collapsed ? "lg:hidden" : ""
              }`}
              aria-label="Search and shortcuts"
              title="Search & shortcuts"
            >
              <Search size={14} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
