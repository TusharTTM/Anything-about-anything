"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowUp,
  Brain,
  FileText,
  Globe,
  Image as ImageIcon,
  Paperclip,
  Plus,
  SlidersHorizontal,
  Sparkles,
  Square,
  X,
} from "lucide-react";

type ToolKey = "web" | "think" | "image";

const toolDefs: {
  key: ToolKey;
  label: string;
  description: string;
  icon: typeof Globe;
}[] = [
  { key: "web", label: "Web search", description: "Look things up on the live web", icon: Globe },
  { key: "think", label: "Deep think", description: "Take longer on harder problems", icon: Brain },
  { key: "image", label: "Create image", description: "Turn a description into a picture", icon: ImageIcon },
];

type Attachment = { id: string; name: string; size: number };

type ComposerProps = {
  value: string;
  onChange: (value: string) => void;
  onSend: (value: string) => void;
  onStop?: () => void;
  pending?: boolean;
  focusToken?: number;
  modelName?: string;
  showDisclaimer?: boolean;
};

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function Composer({
  value,
  onChange,
  onSend,
  onStop,
  pending = false,
  focusToken = 0,
  modelName,
  showDisclaimer = true,
}: ComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [tools, setTools] = useState<Record<ToolKey, boolean>>({
    web: false,
    think: false,
    image: false,
  });
  const [popover, setPopover] = useState<"attach" | "tools" | null>(null);

  const activeTools = toolDefs.filter((tool) => tools[tool.key]);
  const canSend = value.trim().length > 0 && !pending;

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [value]);

  useEffect(() => {
    if (focusToken > 0) {
      const el = textareaRef.current;
      if (el) {
        el.focus();
        el.setSelectionRange(el.value.length, el.value.length);
      }
    }
  }, [focusToken]);

  const submit = () => {
    if (!canSend) return;
    onSend(value);
    setAttachments([]);
    setPopover(null);
  };

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const next = Array.from(files)
      .slice(0, 3)
      .map((file) => ({
        id: `${file.name}-${file.size}-${Math.random().toString(36).slice(2, 6)}`,
        name: file.name,
        size: file.size,
      }));
    setAttachments((prev) => [...prev, ...next].slice(0, 3));
    setPopover(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="relative">
      {attachments.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {attachments.map((file) => (
            <div
              key={file.id}
              className="flex max-w-[220px] items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] py-1.5 pl-2 pr-1.5 text-[11px] text-white/60"
            >
              <FileText size={13} className="shrink-0 text-lime" />
              <span className="min-w-0 flex-1 truncate">{file.name}</span>
              <span className="shrink-0 text-[9.5px] text-white/25">{formatSize(file.size)}</span>
              <button
                onClick={() => setAttachments((prev) => prev.filter((a) => a.id !== file.id))}
                className="grid h-4 w-4 shrink-0 place-items-center rounded text-white/30 hover:bg-white/10 hover:text-white/80"
                aria-label={`Remove ${file.name}`}
              >
                <X size={11} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="relative rounded-[22px] border border-white/[0.09] bg-ink-800/80 p-2 shadow-[0_24px_70px_-30px_rgba(0,0,0,0.95)] backdrop-blur-xl transition duration-200 focus-within:border-lime/25 focus-within:bg-ink-800/95 focus-within:shadow-[0_0_0_4px_rgba(216,255,107,0.05),0_24px_70px_-30px_rgba(0,0,0,0.95)]">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
              event.preventDefault();
              submit();
            }
          }}
          rows={1}
          placeholder="Ask anything, create anything…"
          aria-label="Message Anything"
          className="block max-h-[200px] min-h-[50px] w-full resize-none bg-transparent px-3 pb-1 pt-2.5 text-[14.5px] leading-6 text-white/90 placeholder:text-white/25 focus:outline-none"
        />

        <div className="flex items-center justify-between gap-2 px-0.5 pb-0.5">
          <div className="flex items-center gap-0.5">
            {/* Attach */}
            <div className="relative">
              <button
                onClick={() => setPopover(popover === "attach" ? null : "attach")}
                className={`ring-focus grid h-8 w-8 place-items-center rounded-lg transition hover:bg-white/[0.07] hover:text-white ${
                  popover === "attach" ? "bg-white/[0.07] text-white" : "text-white/40"
                }`}
                aria-label="Attach a file"
                title="Attach a file"
              >
                <Plus size={17} />
              </button>
              {popover === "attach" && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setPopover(null)} aria-hidden="true" />
                  <div className="absolute bottom-full left-0 z-50 mb-2 w-[248px] animate-popIn rounded-xl border border-white/10 bg-ink-800/95 p-1.5 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] backdrop-blur-2xl">
                    <button
                      onClick={() => fileRef.current?.click()}
                      className="ring-focus flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[12px] text-white/70 transition hover:bg-white/[0.05] hover:text-white"
                    >
                      <Paperclip size={14} className="text-white/40" />
                      Upload from device
                    </button>
                    <div className="px-2.5 pb-1.5 pt-1 text-[10px] leading-relaxed text-white/25">
                      Images, PDFs, and text files up to 10 MB. You can attach up to 3 files.
                    </div>
                  </div>
                </>
              )}
              <input
                ref={fileRef}
                type="file"
                multiple
                accept="image/*,.pdf,.txt,.md,.csv"
                className="hidden"
                onChange={(event) => addFiles(event.target.files)}
              />
            </div>

            {/* Tools */}
            <div className="relative">
              <button
                onClick={() => setPopover(popover === "tools" ? null : "tools")}
                className={`ring-focus flex h-8 items-center gap-1.5 rounded-lg px-2 text-[11.5px] transition hover:bg-white/[0.07] hover:text-white ${
                  popover === "tools" || activeTools.length > 0
                    ? "bg-white/[0.06] text-white/85"
                    : "text-white/40"
                }`}
                aria-label="Tools"
                title="Tools"
              >
                <SlidersHorizontal size={14} />
                <span className="hidden sm:inline">Tools</span>
                {activeTools.length > 0 && (
                  <span className="grid h-4 min-w-4 place-items-center rounded-full bg-lime px-1 text-[9px] font-bold text-ink-950">
                    {activeTools.length}
                  </span>
                )}
              </button>
              {popover === "tools" && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setPopover(null)} aria-hidden="true" />
                  <div className="absolute bottom-full left-0 z-50 mb-2 w-[min(276px,calc(100vw-3rem))] animate-popIn rounded-xl border border-white/10 bg-ink-800/95 p-1.5 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] backdrop-blur-2xl">
                    <div className="px-2.5 pb-1.5 pt-1 text-[10px] font-medium uppercase tracking-[0.16em] text-white/25">
                      Tools
                    </div>
                    {toolDefs.map((tool) => {
                      const on = tools[tool.key];
                      return (
                        <button
                          key={tool.key}
                          onClick={() => setTools((prev) => ({ ...prev, [tool.key]: !prev[tool.key] }))}
                          className="ring-focus flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition hover:bg-white/[0.04]"
                          aria-pressed={on}
                        >
                          <span
                            className={`grid h-7 w-7 shrink-0 place-items-center rounded-md ${
                              on ? "bg-lime/15 text-lime" : "bg-white/[0.05] text-white/40"
                            }`}
                          >
                            <tool.icon size={14} />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-[12px] font-medium text-white/85">{tool.label}</span>
                            <span className="block text-[10px] leading-snug text-white/30">
                              {tool.description}
                            </span>
                          </span>
                          <span
                            className={`relative h-[18px] w-[30px] shrink-0 rounded-full transition ${
                              on ? "bg-lime" : "bg-white/15"
                            }`}
                          >
                            <span
                              className={`absolute top-[2px] h-[14px] w-[14px] rounded-full bg-ink-950 transition-all ${
                                on ? "left-[14px]" : "left-[2px] bg-white/60"
                              }`}
                            />
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {activeTools.length > 0 && (
              <div className="ml-1 hidden items-center gap-1 md:flex">
                {activeTools.map((tool) => (
                  <span
                    key={tool.key}
                    className="inline-flex items-center gap-1 rounded-md border border-lime/20 bg-lime/[0.07] px-1.5 py-1 text-[10px] font-medium text-lime/90"
                  >
                    <tool.icon size={10} />
                    {tool.label}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {modelName && (
              <span className="hidden items-center gap-1 text-[10.5px] text-white/25 lg:flex">
                <Sparkles size={10} className="text-white/20" />
                {modelName}
              </span>
            )}
            <span className="hidden items-center gap-1 text-[10px] text-white/20 sm:flex">
              <kbd className="rounded border border-white/10 bg-white/[0.03] px-1 py-px font-sans text-[9px]">
                ↵
              </kbd>
              to send
            </span>
            <button
              onClick={pending ? onStop : submit}
              disabled={pending ? !onStop : !canSend}
              className={`ring-focus grid h-9 w-9 place-items-center rounded-full transition active:scale-95 disabled:cursor-not-allowed disabled:bg-white/[0.08] disabled:text-white/25 disabled:shadow-none ${
                pending
                  ? "bg-white/[0.1] text-white/80 hover:bg-white/[0.16]"
                  : "bg-lime text-ink-950 shadow-[0_6px_20px_-8px_rgba(216,255,107,0.9)] hover:bg-lime-soft"
              }`}
              aria-label={pending ? "Stop generating" : "Send message"}
              title={pending ? "Stop generating" : "Send message"}
            >
              {pending ? (
                <Square size={12} strokeWidth={2.5} className="fill-current" />
              ) : (
                <ArrowUp size={17} strokeWidth={2.6} />
              )}
            </button>
          </div>
        </div>
      </div>

      {showDisclaimer && (
        <div className="mt-2 flex items-center justify-between px-1 text-[10px] text-white/20">
          <span>Anything can make mistakes. Check important info.</span>
          <span className="hidden sm:inline">Private by default</span>
        </div>
      )}
    </div>
  );
}
