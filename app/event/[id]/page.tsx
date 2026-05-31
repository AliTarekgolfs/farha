"use client";

import { useEffect, useState } from "react";
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

function formatDate(dateStr: string, timeStr: string) {
  try {
    const date = new Date(`${dateStr}T${timeStr}`);
    return date.toLocaleDateString("en-EG", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }) + " at " + date.toLocaleTimeString("en-EG", { hour: "2-digit", minute: "2-digit" });
  } catch {
    return `${dateStr} at ${timeStr}`;
  }
}

export default function EventPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const isHost = searchParams.get("host") === "true";
  const id = params.id as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<"going" | "maybe" | "cant" | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchEvent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchEvent = async () => {
    try {
      const [evRes, rsvpRes] = await Promise.all([
        fetch(`/api/events/${id}`),
        fetch(`/api/events/${id}/rsvps`),
      ]);
      const evData = await evRes.json();
      const rsvpData = await rsvpRes.json();
      setEvent(evData);
      setRsvps(rsvpData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href.replace("?host=true", ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const goingCount = rsvps.filter((r) => r.status === "going").length;
  const maybeCount = rsvps.filter((r) => r.status === "maybe").length;

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
        className="px-6 pt-8 pb-12 text-center text-white relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #FF4D8D 0%, #FF6B35 50%, #FFD93D 100%)",
        }}
      >
        <div className="text-6xl mb-4">{emoji}</div>
        <h1 className="text-3xl font-black leading-tight">{event.title}</h1>
        <p className="text-white/80 mt-1">by {event.host_name}</p>

        {/* Stats */}
        <div className="flex justify-center gap-6 mt-6">
          <div className="bg-white/20 rounded-2xl px-5 py-3 backdrop-blur-sm">
            <div className="text-2xl font-black">{goingCount}</div>
            <div className="text-white/80 text-xs">Going</div>
          </div>
          <div className="bg-white/20 rounded-2xl px-5 py-3 backdrop-blur-sm">
            <div className="text-2xl font-black">{maybeCount}</div>
            <div className="text-white/80 text-xs">Maybe</div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-6 py-8 flex flex-col gap-6">
        {/* Event details */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <span className="text-xl">📅</span>
            <div>
              <div className="font-semibold text-gray-900">{formatDate(event.date, event.time)}</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-xl">📍</span>
            <div className="font-semibold text-gray-900">{event.location}</div>
          </div>
          {event.description && (
            <div className="flex items-start gap-3">
              <span className="text-xl">💬</span>
              <div className="text-gray-600 text-sm leading-relaxed">{event.description}</div>
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

            {/* Name input */}
            <input
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-[#FFF8F0] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-300 transition mb-4"
              placeholder="Your name *"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            {/* Status buttons */}
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
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center">
            <div className="text-5xl mb-3">
              {selectedStatus === "going" ? "🎉" : selectedStatus === "maybe" ? "🤔" : "😢"}
            </div>
            <h3 className="font-black text-gray-900 text-xl">
              {selectedStatus === "going"
                ? "You're in! See you there 🙌"
                : selectedStatus === "maybe"
                ? "Noted! Hope to see you 🤞"
                : "Sorry you can't make it 💙"}
            </h3>
            <p className="text-gray-500 text-sm mt-2">Your RSVP has been sent.</p>
          </div>
        )}

        {/* Guest list */}
        {rsvps.filter((r) => r.status === "going" || r.status === "maybe").length > 0 && (
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-black text-gray-900 text-lg mb-4">
              Who&apos;s coming 🎊
            </h3>
            <div className="flex flex-col gap-2">
              {rsvps
                .filter((r) => r.status === "going" || r.status === "maybe")
                .map((r) => (
                  <div key={r.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm"
                        style={{ background: "linear-gradient(135deg, #FF4D8D, #FF6B35)" }}
                      >
                        {r.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-900">{r.name}</span>
                    </div>
                    <span className="text-sm">
                      {r.status === "going" ? "🎉 Going" : "🤔 Maybe"}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
