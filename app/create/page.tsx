"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const EVENT_TYPES = [
  { label: "💍 Khatba", value: "khatba" },
  { label: "📜 Katb Ktab", value: "katbktab" },
  { label: "👰 Wedding", value: "wedding" },
  { label: "🏖️ Beach Party", value: "beach" },
  { label: "🏠 House Party", value: "house" },
  { label: "🎂 Birthday", value: "birthday" },
  { label: "🎊 Graduation", value: "graduation" },
  { label: "🌙 Ramadan Gathering", value: "ramadan" },
  { label: "✨ Other", value: "other" },
];

export default function CreatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    type: "",
    date: "",
    time: "",
    location: "",
    description: "",
    host_name: "",
  });

  const update = (field: string, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.id) {
        router.push(`/event/${data.id}?host=true`);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-300 transition text-base";

  return (
    <main className="min-h-screen bg-[#FFF8F0]">
      {/* Header */}
      <div
        className="px-6 pt-6 pb-10"
        style={{
          background: "linear-gradient(135deg, #FF4D8D 0%, #FF6B35 100%)",
        }}
      >
        <Link href="/" className="text-white/80 text-sm mb-4 inline-block">
          ← Back
        </Link>
        <h1 className="text-3xl font-black text-white">Create your event 🎉</h1>
        <p className="text-white/70 mt-1">Fill in the details, get a link.</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto px-6 py-8 flex flex-col gap-5"
      >
        {/* Host name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Your name *
          </label>
          <input
            className={inputClass}
            placeholder="e.g. Omar"
            value={form.host_name}
            onChange={(e) => update("host_name", e.target.value)}
            required
          />
        </div>

        {/* Event title */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Event name *
          </label>
          <input
            className={inputClass}
            placeholder="e.g. Layla & Ahmed's Wedding 💍"
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            required
          />
        </div>

        {/* Event type */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Type of event *
          </label>
          <div className="flex flex-wrap gap-2">
            {EVENT_TYPES.map((t) => (
              <button
                type="button"
                key={t.value}
                onClick={() => update("type", t.value)}
                className={`px-3 py-2 rounded-full text-sm font-medium border transition ${
                  form.type === t.value
                    ? "border-transparent text-white shadow-md"
                    : "border-gray-200 bg-white text-gray-700 hover:border-pink-300"
                }`}
                style={
                  form.type === t.value
                    ? { background: "linear-gradient(135deg, #FF4D8D, #FF6B35)" }
                    : {}
                }
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Date *
            </label>
            <input
              type="date"
              className={inputClass}
              value={form.date}
              onChange={(e) => update("date", e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Time *
            </label>
            <input
              type="time"
              className={inputClass}
              value={form.time}
              onChange={(e) => update("time", e.target.value)}
              required
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Location *
          </label>
          <input
            className={inputClass}
            placeholder="e.g. Four Seasons Cairo, Sahel Km 140..."
            value={form.location}
            onChange={(e) => update("location", e.target.value)}
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Message to guests (optional)
          </label>
          <textarea
            className={inputClass + " resize-none"}
            rows={3}
            placeholder="Dress code, directions, what to bring..."
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !form.title || !form.type || !form.date || !form.time || !form.location || !form.host_name}
          className="w-full py-4 rounded-2xl text-white font-bold text-lg shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          style={{
            background: "linear-gradient(135deg, #FF4D8D, #FF6B35)",
            boxShadow: "0 8px 30px rgba(255, 77, 141, 0.3)",
          }}
        >
          {loading ? "Creating..." : "Create event ✨"}
        </button>
      </form>
    </main>
  );
}
