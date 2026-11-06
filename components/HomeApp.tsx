"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ChatView from "./ChatView";
import CommandPalette from "./CommandPalette";
import HomeView from "./HomeView";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import {
  generateReply,
  makeId,
  models,
  titleFromPrompt,
  type Chat,
  type Message,
  type Model,
} from "@/lib/data";

export default function HomeApp() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [model, setModel] = useState<Model>(models[0]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [chatTitle, setChatTitle] = useState<string | null>(null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [focusToken, setFocusToken] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const meta = event.metaKey || event.ctrlKey;
      if (meta && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen((open) => !open);
        return;
      }
      if (event.key === "Escape") {
        setPaletteOpen(false);
        setSidebarOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const newChat = useCallback(() => {
    clearTimer();
    setMessages([]);
    setPending(false);
    setActiveChatId(null);
    setChatTitle(null);
    setDraft("");
    setSidebarOpen(false);
    setPaletteOpen(false);
    setFocusToken((token) => token + 1);
  }, [clearTimer]);

  const send = useCallback(
    (text: string) => {
      const content = text.trim();
      if (!content || pending) return;
      clearTimer();
      setMessages((prev) => [...prev, { id: makeId(), role: "user", content }]);
      setDraft("");
      setChatTitle((prev) => prev ?? titleFromPrompt(content));
      setPending(true);
      setFocusToken((token) => token + 1);
      timerRef.current = setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: makeId(),
            role: "assistant",
            content: generateReply(content),
            model: model.name,
          },
        ]);
        setPending(false);
        timerRef.current = null;
      }, 1400);
    },
    [clearTimer, model.name, pending],
  );

  const stop = useCallback(() => {
    clearTimer();
    setPending(false);
  }, [clearTimer]);

  const openChat = useCallback(
    (chat: Chat) => {
      clearTimer();
      setPending(false);
      setActiveChatId(chat.id);
      setChatTitle(chat.title);
      setDraft("");
      setSidebarOpen(false);
      setPaletteOpen(false);
      setMessages([
        { id: makeId(), role: "user", content: chat.prompt },
        {
          id: makeId(),
          role: "assistant",
          content: generateReply(chat.prompt),
          model: model.name,
        },
      ]);
    },
    [clearTimer, model.name],
  );

  const regenerate = useCallback(() => {
    if (pending) return;
    const lastUser = [...messages].reverse().find((message) => message.role === "user");
    if (!lastUser) return;
    clearTimer();
    const index = messages.findIndex((message) => message.id === lastUser.id);
    setMessages((prev) => prev.slice(0, index + 1));
    setPending(true);
    timerRef.current = setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: makeId(),
          role: "assistant",
          content: generateReply(lastUser.content),
          model: model.name,
        },
      ]);
      setPending(false);
      timerRef.current = null;
    }, 1200);
  }, [clearTimer, messages, model.name, pending]);

  const pickPrompt = useCallback((prompt: string) => {
    setDraft(prompt);
    setPaletteOpen(false);
    setFocusToken((token) => token + 1);
  }, []);

  return (
    <div className="app-bg flex h-dvh w-full overflow-hidden text-white">
      <Sidebar
        open={sidebarOpen}
        collapsed={collapsed}
        activeChatId={activeChatId}
        onClose={() => setSidebarOpen(false)}
        onToggleCollapse={() => setCollapsed((value) => !value)}
        onNewChat={newChat}
        onOpenSearch={() => setPaletteOpen(true)}
        onSelectChat={openChat}
      />

      <div className="relative flex min-w-0 flex-1 flex-col">
        <div className="grid-overlay pointer-events-none absolute inset-0" aria-hidden="true" />
        <TopBar
          model={model}
          onModelChange={setModel}
          onOpenSidebar={() => setSidebarOpen(true)}
          onOpenSearch={() => setPaletteOpen(true)}
          title={chatTitle}
        />

        <main className="relative flex min-h-0 flex-1 flex-col">
          {messages.length === 0 ? (
            <HomeView
              draft={draft}
              onDraftChange={setDraft}
              onSend={send}
              onStop={stop}
              onPickPrompt={pickPrompt}
              onOpenSearch={() => setPaletteOpen(true)}
              pending={pending}
              focusToken={focusToken}
              modelName={model.name}
            />
          ) : (
            <ChatView
              messages={messages}
              pending={pending}
              draft={draft}
              onDraftChange={setDraft}
              onSend={send}
              onStop={stop}
              focusToken={focusToken}
              modelName={model.name}
              onRegenerate={regenerate}
            />
          )}
        </main>
      </div>

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onNewChat={newChat}
        onSelectChat={openChat}
        onPrompt={pickPrompt}
      />
    </div>
  );
}
