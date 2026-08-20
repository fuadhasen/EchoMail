import {
  ArrowRight,
  ChevronRight,
  Radio,
  ShieldCheck,
  Zap,
} from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router";

const Landing = () => {
  // states for capabilities
  const [activeCapability, setActiveCapability] = useState<number>(0);

  // state for FAQ
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "How does EchoMail know when someone has replied?",
      answer:
        "EchoMail connects securely to your Gmail inbox via the official Google OAuth API. Every 5 minutes, our background engine inspects active thread IDs and recipient headers. The moment an incoming message matches your tracked thread or recipient alias, EchoMail registers the reply and updates the status automatically.",
    },
    {
      question:
        "Will EchoMail ever send follow-ups to people who already responded?",
      answer:
        "Never. EchoMail tracks response statuses per individual recipient. When follow-ups are triggered, reminders are sent exclusively to non-responders in the thread. The instant someone replies, pending reminders for that person are immediately cancelled.",
    },
    {
      question: "Can I customize the follow-up message and schedule?",
      answer:
        "Yes! You have complete control over cadence (e.g. every 24h, 48h, or 72h), maximum number of reminders, and the custom follow-up message template. Reminders are sent directly within the original email thread so all conversation history remains intact.",
    },
    {
      question:
        "Does EchoMail store my private email contents or train AI on them?",
      answer:
        "No. EchoMail only reads message metadata (Subject, Thread ID, Sender, Timestamp, and Recipient addresses) necessary to evaluate thread completion. We never read, store, or sell your private email body text, and your data is never used for machine learning training.",
    },
    {
      question: "What happens when everyone responds to my tracked email?",
      answer:
        "Once all required stakeholders have replied, EchoMail marks the tracked email as Completed, disarms all pending cadences, and logs the final completion timestamp in your activity stream.",
    },
    {
      question: "Do I need to install a browser extension?",
      answer:
        "No extension required! EchoMail is a cloud-hosted web application that runs 24/7 in the background. Once you link your Google account, monitoring continues even when your computer is turned off.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#fafafb] text-slate-900 font-sans relative overflow-x-hidden  selection:bg-indigo-100 selection:text-indigo-900">
      {/* subtle micro-grid pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:28px_28px]" />

      {/* soft atmospheric ambient light */}
      <div className="absolute top-[3%] left-[18%] w-150 h-150 bg-indigo-500/2.5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-[42%] right-[12%] w-137.5  h-137.5 bg-violet-500/2.5 rounded-full blur-[160px] pointer-events-none" />

      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#fafafb]/85 border-b border-zinc-200/60">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 h-16 sm:h-17 flex items-center justify-between">
          {/* Brand Logo */}
          <Link
            to={"/landing"}
            className="flex items-center gap-2.5 group cursor-pointer focus:outline-none"
          >
            <div className="w-8.5 h-8.5 bg-zinc-950 text-zinc-100 rounded-xl  flex items-center justify-center font-sans font-black text-xs sm:text-sm tracking-tighter shadow-2xs group-hover:scale-105 transition-transform duration-150">
              E
            </div>

            <span className="font-sans text-sm sm:text-base font-bold text-zinc-900 tracking-tight">
              Echomail
            </span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-[13px] font-semibold text-zinc-600">
            <a
              href="#capabilities"
              className="hover:text-zinc-950 transition-colors"
            >
              Capabilities
            </a>
            <a
              href="#how-it-works"
              className="hover:text-zinc-950 transition-colors"
            >
              How It Works
            </a>
            <a
              href="#problem-solution"
              className="hover:text-zinc-950 transition-colors"
            >
              Why EchoMail
            </a>
            <a
              href="#security"
              className="hover:text-zinc-950 transition-colors"
            >
              Security
            </a>
            <a href="#faq" className="hover:text-zinc-950 transition-colors">
              FAQ
            </a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 ">
            <Link
              to="/login"
              className="text-xs sm:text-[13px] font-semibold text-zinc-700 hover:text-zinc-950 px-3.5 py-1.5 rounded-lg hover:bg-zinc-100/70 transition-all"
            >
              Login
            </Link>
            <Link
              to="/login"
              className="flex items-center gap-1.5 bg-zinc-950 hover:bg-zinc-900 active:scale-[0.98] text-white text-xs sm:text-[13px] font-bold px-4 py-2 rounded-xl shadow-2xs transition-all cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight size={14} className="text-zinc-300" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 pb-20 sm:pt-22 sm:pb-28 px-6 sm:px-8 max-w-5xl mx-auto relative z-10 text-center">
        {/* Sentinel pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-zinc-200/90 shadow-2xs mb-6 sm:mb-7 select-none">
          <span className="w-2 h-2 rounded-full bg-[#3525cd] animate-pulse" />
          <span className="text-xs font-semibold text-zinc-700 tracking-wide">
            Autonomous Email Follow-ups
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-[56px] font-bold text-[#0b1c30] tracking-tight leading-[1.10] max-w-3xl mx-auto">
          Stop Chasing email responses.
          <span className="block text-zinc-500 font-semibold mt-1.5 sm:mt-2.5">
            Echomail does the follow-up for you.
          </span>
        </h1>

        {/* value proposition subtitle */}
        <p className="text-sm sm:text-base md:text-[17px] text-zinc-600 leading-relaxed font-normal max-w-xl mx-auto pt-4 sm:pt-5">
          Echomail tracks important sent emails, detects replies automatically,
          and sends polite reminders to non-responders until the loop is closed.
        </p>

        {/* Hero Action */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-7 sm:pt-8 w-full sm:w-auto">
          <Link
            to="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6.5 py-3.5 bg-zinc-950 hover:bg-zinc-900 active:scale-[0.98] text-white rounded-xl font-bold text-xs sm:text-[13px] shadow-[0_4px_16px_rgba(0,0,0,0.1),inset_0_1px_1px_rgba(255,255,255,0.18)] transition-all cursor-pointer group"
          >
            <span>Start Tracking Free</span>
            <ArrowRight
              size={15}
              className="text-zinc-300 group-hover:translate-x-0.5 transition-transform"
            />
          </Link>

          <a
            href="#how-it-works"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5.5 py-3.5 bg-white hover:bg-zinc-50 border border-zinc-200/90 text-zinc-750 hover:text-zinc-950 rounded-xl font-semibold text-xs sm:text-[13px] shadow-2xs transition-all cursor-pointer"
          >
            <span>How it works</span>
            <ChevronRight size={15} className="text-zinc-400" />
          </a>
        </div>

        {/* Re-assurance Badges */}
        <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-7 text-xs text-zinc-500 font-medium pt-7">
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-zinc-400" />
            <span>Google OAuth 2.0 Verified</span>
          </div>
          <span className="text-zinc-300 hidden sm:inline">•</span>
          <div className="flex items-center gap-1.5">
            <Zap size={14} className="text-zinc-400" />
            <span>Instant 30s setup</span>
          </div>
          <span className="text-zinc-300 hidden sm:inline">•</span>
          <div className="flex items-center gap-1.5">
            <Radio size={14} className="text-[#3525cd]" />
            <span>Continuous background scans</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* HERO PRODUCT VISUALIZATION — THE AUTONOMOUS ECHO SYSTEM (PURE GRAPHIC)   */}
        {/* ========================================================================= */}
        <div className="mt-12 sm:mt-16 w-full max-w-4xl mx-auto text-left relative">
          {/* Subtle top Specular Ambient Line */}
          <div className="absolute -top-px left-16 right-16 h-px bg-linear-to-r from-transparent via-[#3525cd]/30 to-transparent z-20 pointer-events-none" />

          <div>
            {/* Ambient background glow */}
            <div className="absolute inset-0 bg-linear-to-b from-zinc-50/60 via-white to-zinc-50/40 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-130 h-80 bg-linear-to-tr from-[#3525cd]/6 via-[#6366f1]/4 to-transparent rounded-full blur-3xl pointer-events-none" />

            {/* Precision dot grid */}
            <div
              className="absolute inset-0 opacity-[0.25] pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(#71717a 1px, transparent 1px)`,
                backgroundSize: "28px 28px",
              }}
            />

            {/* Pure Graphic Canvas */}
            <div className="relative z-10 w-full px-2 sm:px-6 py-8 sm:py-14 select-none flex items-center justify-center">
              <svg
                viewBox="0 0 840 400"
                className="w-full h-auto max-w-200 overflow-visible"
                aria-label="EchoMail autonomous email monitoring and follow-up visual composition"
              ></svg>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
