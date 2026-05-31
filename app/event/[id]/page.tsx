"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useSearchParams } from "next/navigation";

interface Event {
  id: string;
  title: string;
  type: string;
  date: string;
  time: string;
  location: string;
  description: string;
  host_name: string;
}

interface RSVP {
  id: string;
  name: string;
  status: "going" | "maybe" | "cant";
}

interface Comment {
  id: string;
  name: string;
  message: string;
  created_at: string;
}

const STATUS_LABELS = {
  going: { label: "I'm going! 🎉", color: "#FF4D8D", bg: "#FFF0F5" },
  maybe: { label: "Maybe 🤔", color: "#FF6B35", bg: "#FFF5F0" },
  cant: { label: "Can't make it 😢", color: "#999", bg: "#F5F5F5" },
};

const TYPE_EMOJIS: Record<string, string> = {
  khatba: "💍",
  katbktab: "📜",
  wedding: "👰",
  beach: "🏖️",
  house: "🏠",
  birthday: "🎂",
  graduation: "🎊",
  ramadan: "🌙",
  other: "✨",
};

const AVATAR_COLORS = [
  "linear-gradient(135deg, #FF4D8D, #FF6B35)",
  "linear-gradient(135deg, #7B2FBE, #FF4D8D)",
  "linear-gradient(135deg, #FF6B35, #FFD93D)",
  "linear-gradient(135deg, #FF4D8D, #7B2FBE)",
  "linear-gradient(135deg, #00B4D8, #FF4D8D)",
];

function formatDate(dateStr: string, timeStr: string) {
  try {
    const date = new Date(`${dateStr}T${timeStr}`);
    return (
      date.toLocaleDateString("en-EG", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }) +
      " at " +
      date.toLocaleTimeString("en-EG", { hour: "2-digit", minute: "2-digit" })
    );
  } catch {
    return `${dateStr} at ${timeStr}`;
  }
}

function Countdown({ date, time }: { date: string; time: string }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, past: false });

  useEffect(() => {
    const target = new Date(`${date}T${time}`).getTime();
    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, past: true });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
        past: false,
      });
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [date, time]);

  if (timeLeft.past) return null;

  return (
    <div className="flex justify-center gap-3 mt-5">
      {[
        { val: timeLeft.days, label: "days" },
        { val: timeLeft.hours, label: "hrs" },
        { val: timeLeft.minutes, label: "min" },
        { val: timeLeft.seconds, label: "sec" },
      ].map((item) => (
        <div key={item.label} className="bg-white/20 backdrop-blur-sm rounded-2xl px-3 py-2 text-center min-w-[56px]">
          <div className="text-2xl font-black tabular-nums">{String(item.val).padStart(2, "0")}</div>
          <div className="text-white/70 text-xs">{item.label}</div>
        </div>
      ))}
    </div>
  );
}

export default function EventPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const isHost = searchParams.get("host") === "true";
  const id = params.id as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<"going" | "maybe" | "cant" | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedName, setSubmittedName] = useState("");
  const [copied, setCopied] = useState(false);
  const [hypeMsg, setHypeMsg] = useState("");
  const [sendingHype, setSendingHype] = useState(false);

  const fetchEvent = useCallback(async () => {
    try {
      const [evRes, rsvpRes, commentRes] = await Promise.all([
        fetch(`/api/events/${id}`),
        fetch(`/api/events/${id}/rsvps`),
        fetch(`/api/events/${id}/comments`),
      ]);
      setEvent(await evRes.json());
      setRsvps(await rsvpRes.json());
      setComments(await commentRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchEvent(); }, [fetchEvent]);

  const handleRSVP = async () => {
    if (!name.trim() || !selectedStatus) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/events/${id}/rsvps`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), status: selectedStatus }),
      });
      const newRsvp = await res.json();
      setRsvps((prev) => [...prev, newRsvp]);
      setSubmittedName(name.trim());
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const sendHype = async () => {
    if (!hypeMsg.trim() || !submittedName) return;
    setSendingHype(true);
    try {
      const res = await fetch(`/api/events/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: submittedName, message: hypeMsg.trim() }),
      });
      const newComment = await res.json();
      setComments((prev) => [...prev, newComment]);
      setHypeMsg("");
    } catch (err) {
      console.error(err);
    } finally {
      setSendingHype(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href.replace("?host=true", ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const goingRsvps = rsvps.filter((r) => r.status === "going");
  const maybeRsvps = rsvps.filter((r) => r.status === "maybe");

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center">
        <div className="text-4xl animate-bounce">🎉</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center text-center px-6">
        <div>
          <div className="text-5xl mb-4">😢</div>
          <h1 className="text-2xl font-bold text-gray-900">Event not found</h1>
          <p className="text-gray-500 mt-2">This link may have expired or been removed.</p>
        </div>
      </div>
    );
  }

  const emoji = TYPE_EMOJIS[event.type] || "✨";

  return (
    <main className="min-h-screen bg-[#FFF8F0]">
      {/* Hero banner */}
      <div
        className="px-6 pt-10 pb-14 text-center text-white relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #FF4D8D 0%, #FF6B35 50%, #FFD93D 100%)",
        }}
      >
        {/* Decorative blobs */}
        <div className="absolute top-0 left-0 w-40 h-40 rounded-full bg-white/10 -translate-x-16 -translate-y-16" />
        <div className="absolute bottom-0 right-0 w-56 h-56 rounded-full bg-white/10 translate-x-20 translate-y-20" />

        <div className="relative">
          <div className="text-7xl mb-3">{emoji}</div>
          <h1 className="text-4xl font-black leading-tight">{event.title}</h1>
          <p className="text-white/80 mt-2 text-lg">hosted by {event.host_name}</p>

          {/* Countdown */}
          <Countdown date={event.date} time={event.time} />

          {/* Stats */}
          <div className="flex justify-center gap-4 mt-6">
            <div className="bg-white/20 rounded-2xl px-5 py-3 backdrop-blur-sm">
              <div className="text-2xl font-black">{goingRsvps.length}</div>
              <div className="text-white/80 text-xs">Going</div>
            </div>
            <div className="bg-white/20 rounded-2xl px-5 py-3 backdrop-blur-sm">
              <div className="text-2xl font-black">{maybeRsvps.length}</div>
              <div className="text-white/80 text-xs">Maybe</div>
            </div>
          </div>

          {/* Avatar bubbles */}
          {goingRsvps.length > 0 && (
            <div className="flex justify-center mt-4">
              <div className="flex -space-x-2">
                {goingRsvps.slice(0, 6).map((r, i) => (
                  <div
                    key={r.id}
                    className="w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-white font-bold text-sm"
                    style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
                    title={r.name}
                  >
                    {r.name.charAt(0).toUpperCase()}
                  </div>
                ))}
                {goingRsvps.length > 6 && (
                  <div className="w-9 h-9 rounded-full border-2 border-white bg-white/30 flex items-center justify-center text-white font-bold text-xs">
                    +{goingRsvps.length - 6}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-lg mx-auto px-6 py-8 flex flex-col gap-6">
        {/* Event details */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">📅</span>
            <div className="font-semibold text-gray-900 pt-0.5">{formatDate(event.date, event.time)}</div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">📍</span>
            <div className="font-semibold text-gray-900 pt-0.5">{event.location}</div>
          </div>
          {event.description && (
            <div className="flex items-start gap-3">
              <span className="text-2xl">💬</span>
              <div className="text-gray-600 text-sm leading-relaxed pt-0.5">{event.description}</div>
            </div>
          )}
        </div>

        {/* Share section (host only) */}
        {isHost && (
          <div
            className="rounded-3xl p-5 text-white"
            style={{ background: "linear-gradient(135deg, #7B2FBE, #FF4D8D)" }}
          >
            <h3 className="font-bold text-lg mb-1">Share with your guests 📲</h3>
            <p className="text-white/70 text-sm mb-4">
              Copy the link and send it on WhatsApp, Snap, or Instagram.
            </p>
            <button
              onClick={copyLink}
              className="w-full bg-white text-gray-900 font-bold py-3 rounded-2xl transition hover:scale-[1.02] active:scale-[0.98]"
            >
              {copied ? "✅ Copied!" : "📋 Copy invite link"}
            </button>
          </div>
        )}

        {/* RSVP section */}
        {!submitted ? (
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-black text-gray-900 text-xl mb-4">Are you coming? 👀</h3>
            <input
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-[#FFF8F0] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-300 transition mb-4"
              placeholder="Your name *"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <div className="flex flex-col gap-2 mb-5">
              {(Object.entries(STATUS_LABELS) as [keyof typeof STATUS_LABELS, typeof STATUS_LABELS[keyof typeof STATUS_LABELS]][]).map(([key, val]) => (
                <button
                  key={key}
                  onClick={() => setSelectedStatus(key)}
                  className="w-full py-3 rounded-2xl font-semibold border-2 transition text-left px-4"
                  style={{
                    borderColor: selectedStatus === key ? val.color : "#E5E7EB",
                    backgroundColor: selectedStatus === key ? val.bg : "white",
                    color: selectedStatus === key ? val.color : "#6B7280",
                  }}
                >
                  {val.label}
                </button>
              ))}
            </div>
            <button
              onClick={handleRSVP}
              disabled={!name.trim() || !selectedStatus || submitting}
              className="w-full py-4 rounded-2xl text-white font-bold text-base shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(135deg, #FF4D8D, #FF6B35)" }}
            >
              {submitting ? "Sending..." : "Send RSVP 🎉"}
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 text-center">
            <div className="text-5xl mb-3">
              {selectedStatus === "going" ? "🎉" : selectedStatus === "maybe" ? "🤔" : "😢"}
            </div>
            <h3 className="font-black text-gray-900 text-xl">
              {selectedStatus === "going" ? "You're in! See you there 🙌" : selectedStatus === "maybe" ? "Noted! Hope to see you 🤞" : "Sorry you can't make it 💙"}
            </h3>
            <p className="text-gray-500 text-sm mt-2 mb-5">Your RSVP has been sent.</p>

            {/* Hype message box — only for going/maybe */}
            {selectedStatus !== "cant" && (
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-700 mb-2">Leave a hype message 🔥</p>
                <div className="flex gap-2">
                  <input
                    className="flex-1 px-3 py-2 rounded-xl border border-gray-200 bg-[#FFF8F0] text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                    placeholder="Can't wait yalla! 🔥"
                    value={hypeMsg}
                    onChange={(e) => setHypeMsg(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendHype()}
                  />
                  <button
                    onClick={sendHype}
                    disabled={!hypeMsg.trim() || sendingHype}
                    className="px-4 py-2 rounded-xl text-white font-bold text-sm disabled:opacity-40"
                    style={{ background: "linear-gradient(135deg, #FF4D8D, #FF6B35)" }}
                  >
                    Send
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Guest list */}
        {(goingRsvps.length > 0 || maybeRsvps.length > 0) && (
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-black text-gray-900 text-lg mb-4">Who&apos;s coming 🎊</h3>

            {/* Avatar grid */}
            <div className="flex flex-wrap gap-3 mb-2">
              {[...goingRsvps, ...maybeRsvps].map((r, i) => (
                <div key={r.id} className="flex flex-col items-center gap-1">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-base"
                    style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
                  >
                    {r.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs text-gray-600 max-w-[48px] truncate text-center">{r.name.split(" ")[0]}</span>
                  <span className="text-xs">{r.status === "going" ? "🎉" : "🤔"}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hype comments */}
        {comments.length > 0 && (
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-black text-gray-900 text-lg mb-4">The hype 🔥</h3>
            <div className="flex flex-col gap-3">
              {comments.map((c, i) => (
                <div key={c.id} className="flex items-start gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                    style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
                  >
                    {c.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="bg-[#FFF8F0] rounded-2xl rounded-tl-sm px-4 py-2 flex-1">
                    <span className="font-semibold text-gray-900 text-sm">{c.name} </span>
                    <span className="text-gray-700 text-sm">{c.message}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
