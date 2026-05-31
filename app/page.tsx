"use client";

import Link from "next/link";

const emojis = ["🎉", "🎊", "💃", "🥳", "✨", "🎶", "💍", "🌟"];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#FFF8F0] flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎉</span>
          <span className="text-xl font-bold text-gray-900">Farha</span>
          <span className="text-sm text-gray-400 font-medium">فرحة</span>
        </div>
        <Link
          href="/create"
          className="text-sm font-semibold text-white px-4 py-2 rounded-full"
          style={{ background: "linear-gradient(135deg, #FF4D8D, #FF6B35)" }}
        >
          Create Event
        </Link>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16">
        {/* Floating emoji row */}
        <div className="flex gap-3 text-3xl mb-8 animate-bounce-slow">
          {emojis.slice(0, 4).map((e, i) => (
            <span
              key={i}
              style={{ animationDelay: `${i * 0.2}s` }}
              className="animate-bounce"
            >
              {e}
            </span>
          ))}
        </div>

        <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-tight mb-4">
          Your event,{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #FF4D8D 0%, #FF6B35 50%, #FFD93D 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            your farha.
          </span>
        </h1>

        <p className="text-xl text-gray-500 max-w-md mb-10 leading-relaxed">
          Create a beautiful invitation in 2 minutes. Share on WhatsApp, Snap,
          or Insta. Know who&apos;s coming — instantly.
        </p>

        <Link
          href="/create"
          className="text-lg font-bold text-white px-10 py-4 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95"
          style={{
            background: "linear-gradient(135deg, #FF4D8D, #FF6B35)",
            boxShadow: "0 8px 30px rgba(255, 77, 141, 0.4)",
          }}
        >
          Create your event ✨
        </Link>

        <p className="text-sm text-gray-400 mt-4">Free. No account needed.</p>

        {/* Social proof emojis */}
        <div className="flex gap-2 mt-10 text-2xl">
          {emojis.slice(4).map((e, i) => (
            <span key={i} className="opacity-60">
              {e}
            </span>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-16 max-w-3xl mx-auto w-full">
        <h2 className="text-3xl font-black text-center text-gray-900 mb-12">
          How it works
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: "1",
              emoji: "✍️",
              title: "Create your event",
              desc: "Fill in the details — name, date, vibe. Takes 2 minutes.",
            },
            {
              step: "2",
              emoji: "📲",
              title: "Share the link",
              desc: "Copy the link and send it on WhatsApp, Snap, or Instagram.",
            },
            {
              step: "3",
              emoji: "👀",
              title: "Watch the RSVPs roll in",
              desc: "See exactly who's coming in real time. No more 'yalla ya gama3a rodo'.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 text-center"
            >
              <div className="text-4xl mb-3">{item.emoji}</div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">
                {item.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Event types */}
      <section className="px-6 py-8 pb-16 max-w-3xl mx-auto w-full">
        <h2 className="text-2xl font-black text-center text-gray-900 mb-6">
          For every occasion 🇪🇬
        </h2>
        <div className="flex flex-wrap gap-3 justify-center">
          {[
            "💍 Khatba",
            "📜 Katb Ktab",
            "👰 Wedding",
            "🏖️ Sahel Party",
            "🏠 House Party",
            "🎂 Birthday",
            "🌙 Ramadan Gathering",
            "🎊 Graduation",
          ].map((tag) => (
            <span
              key={tag}
              className="px-4 py-2 rounded-full bg-white border border-gray-200 text-sm font-medium text-gray-700 shadow-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section
        className="mx-4 mb-6 rounded-3xl p-10 text-center text-white"
        style={{
          background: "linear-gradient(135deg, #FF4D8D 0%, #FF6B35 50%, #FFD93D 100%)",
        }}
      >
        <h2 className="text-3xl font-black mb-3">Ready to start?</h2>
        <p className="text-white/80 mb-6">Your guests are waiting 👀</p>
        <Link
          href="/create"
          className="inline-block bg-white text-gray-900 font-bold px-8 py-3 rounded-full hover:scale-105 transition-transform"
        >
          Create your event →
        </Link>
      </section>

      <footer className="text-center text-sm text-gray-400 py-6">
        Made with ❤️ for Egypt's parties, weddings & everything in between.
      </footer>
    </main>
  );
}
