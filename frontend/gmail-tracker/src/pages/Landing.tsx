import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CornerDownRight,
  HelpCircle,
  Lock,
  Mail,
  Radio,
  Search,
  ShieldCheck,
  XCircle,
  Zap,
} from "lucide-react";
import { useState } from "react";
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
        <h1 className="text-2xl sm:text-5xl lg:text-[56px] font-bold text-[#0b1c30] tracking-tight leading-[1.10] max-w-3xl mx-auto">
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

          <div className="relative rounded-2xl sm:rounded-3xl bg-white border border-zinc-200/90 shadow-[0_24px_60px_-16px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.02)] overflow-hidden transition-all">
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
              >
                <defs>
                  <filter
                    id="heroCoreShadow"
                    x="-20%"
                    y="-20%"
                    width="140%"
                    height="150%"
                  >
                    <feDropShadow
                      dx="0"
                      dy="16"
                      stdDeviation="20"
                      floodColor="#3525cd"
                      floodOpacity="0.16"
                    />
                    <feDropShadow
                      dx="0"
                      dy="4"
                      stdDeviation="8"
                      floodColor="#000000"
                      floodOpacity="0.04"
                    />
                  </filter>

                  <filter
                    id="subtleElementShadow"
                    x="-20%"
                    y="-20%"
                    width="140%"
                    height="140%"
                  >
                    <feDropShadow
                      dx="0"
                      dy="6"
                      stdDeviation="10"
                      floodColor="#000000"
                      floodOpacity="0.05"
                    />
                  </filter>

                  {/* Gradient Definitions */}
                  <linearGradient
                    id="orbitalPathGrad"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#3525cd" stopOpacity="0.85" />
                    <stop offset="50%" stopColor="#818cf8" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#3525cd" stopOpacity="0.1" />
                  </linearGradient>

                  <linearGradient
                    id="returnLoopGrad"
                    x1="100%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#3525cd" stopOpacity="0.7" />
                    <stop offset="60%" stopColor="#6366f1" stopOpacity="0.3" />
                    <stop
                      offset="100%"
                      stopColor="#3525cd"
                      stopOpacity="0.05"
                    />
                  </linearGradient>

                  <linearGradient
                    id="envelopeBaseGrad"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="100%" stopColor="#f8fafc" />
                  </linearGradient>

                  <linearGradient
                    id="envelopeFlapGrad"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#f8fafc" />
                    <stop offset="100%" stopColor="#edf2f7" />
                  </linearGradient>

                  <radialGradient id="centralAura" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#3525cd" stopOpacity="0.14" />
                    <stop offset="60%" stopColor="#3525cd" stopOpacity="0.03" />
                    <stop offset="100%" stopColor="#3525cd" stopOpacity="0" />
                  </radialGradient>

                  <radialGradient
                    id="pulseGlowEffect"
                    cx="50%"
                    cy="50%"
                    r="50%"
                  >
                    <stop offset="0%" stopColor="#3525cd" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#3525cd" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* --- 1. SPATIAL GEOMETRIC BACKGROUND GUIDES --- */}
                <g opacity="0.4" stroke="#e4e4e7" strokeWidth="1">
                  {/* Subtle Horizon Axis */}
                  <line
                    x1="80"
                    y1="200"
                    x2="760"
                    y2="200"
                    strokeDasharray="3 6"
                  />
                  <line
                    x1="420"
                    y1="50"
                    x2="420"
                    y2="350"
                    strokeDasharray="3 6"
                  />

                  {/* Precision Corner Crosshairs */}
                  <path
                    d="M 120 90 L 130 90 M 125 85 L 125 95"
                    stroke="#a1a1aa"
                    strokeWidth="1"
                  />
                  <path
                    d="M 710 90 L 720 90 M 715 85 L 715 95"
                    stroke="#a1a1aa"
                    strokeWidth="1"
                  />
                  <path
                    d="M 120 310 L 130 310 M 125 305 L 125 315"
                    stroke="#a1a1aa"
                    strokeWidth="1"
                  />
                  <path
                    d="M 710 310 L 720 310 M 715 305 L 715 315"
                    stroke="#a1a1aa"
                    strokeWidth="1"
                  />
                </g>

                {/* --- 2. CONCENTRIC INTELLIGENT MONITORING FIELDS (ECHO RINGS) --- */}
                <g transform="translate(420, 200)">
                  {/* Ambient Core Halo */}
                  <circle r="190" fill="url(#centralAura)" />

                  {/* Outermost Harmonic Wave (Ticking Radar) */}
                  <circle
                    r="165"
                    fill="none"
                    stroke="#e4e4e7"
                    strokeWidth="1"
                    strokeDasharray="4 8"
                  />
                  <circle
                    r="165"
                    fill="none"
                    stroke="#3525cd"
                    strokeWidth="1.5"
                    strokeOpacity="0.25"
                    strokeDasharray="30 180"
                  >
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      from="0"
                      to="360"
                      dur="28s"
                      repeatCount="indefinite"
                    />
                  </circle>

                  {/* Middle Surveillance Ring */}
                  <circle
                    r="120"
                    fill="none"
                    stroke="#e4e4e7"
                    strokeWidth="1.2"
                    strokeDasharray="2 6"
                  />
                  <circle
                    r="120"
                    fill="none"
                    stroke="#3525cd"
                    strokeWidth="1.5"
                    strokeOpacity="0.4"
                    strokeDasharray="40 120"
                  >
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      from="360"
                      to="0"
                      dur="20s"
                      repeatCount="indefinite"
                    />
                  </circle>

                  {/* Inner Active Ring with Subtle Expansion Breathing */}
                  <circle
                    r="75"
                    fill="none"
                    stroke="#3525cd"
                    strokeWidth="1.5"
                    strokeOpacity="0.3"
                    strokeDasharray="4 6"
                  >
                    <animate
                      attributeName="r"
                      values="72;78;72"
                      dur="4s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="stroke-opacity"
                      values="0.2;0.45;0.2"
                      dur="4s"
                      repeatCount="indefinite"
                    />
                  </circle>
                </g>

                {/* --- 3. HARMONIC FLOW ORBITS (In-Thread Autonomous Surveillance & Follow-Up Waves) --- */}

                {/* Primary Horizontal Harmonic Orbit (Thread Surveillance Ribbon) */}
                <path
                  id="primaryOrbit"
                  d="M 120 200 C 120 100, 720 100, 720 200 C 720 300, 120 300, 120 200 Z"
                  fill="none"
                  stroke="#e4e4e7"
                  strokeWidth="1.5"
                />
                <path
                  d="M 120 200 C 120 100, 720 100, 720 200 C 720 300, 120 300, 120 200 Z"
                  fill="none"
                  stroke="url(#orbitalPathGrad)"
                  strokeWidth="2"
                  strokeDasharray="12 18"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    from="300"
                    to="0"
                    dur="12s"
                    repeatCount="indefinite"
                  />
                </path>

                {/* Secondary Tilted Loop: The Autonomous Follow-Up Arc (Sweeping out to recipient & returning) */}
                <path
                  id="followUpArc"
                  d="M 420 200 C 580 80, 750 140, 720 230 C 690 310, 480 340, 420 200 Z"
                  fill="none"
                  stroke="url(#returnLoopGrad)"
                  strokeWidth="1.75"
                  strokeDasharray="6 8"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    from="240"
                    to="0"
                    dur="8s"
                    repeatCount="indefinite"
                  />
                </path>

                {/* Dynamic Travelling Photons (Signals moving through the loop) */}
                <g>
                  {/* Photon 1 on Primary Orbit */}
                  <circle r="4" fill="#3525cd">
                    <animateMotion
                      dur="12s"
                      repeatCount="indefinite"
                      path="M 120 200 C 120 100, 720 100, 720 200 C 720 300, 120 300, 120 200 Z"
                    />
                  </circle>
                  <circle r="8" fill="url(#pulseGlowEffect)">
                    <animateMotion
                      dur="12s"
                      repeatCount="indefinite"
                      path="M 120 200 C 120 100, 720 100, 720 200 C 720 300, 120 300, 120 200 Z"
                    />
                  </circle>

                  {/* Photon 2 on Follow-Up Return Arc */}
                  <circle r="3.5" fill="#6366f1">
                    <animateMotion
                      dur="8s"
                      repeatCount="indefinite"
                      path="M 420 200 C 580 80, 750 140, 720 230 C 690 310, 480 340, 420 200 Z"
                    />
                  </circle>
                </g>

                {/* --- 4. SATELLITE RECEPTOR NODES (Abstract Thread Stakeholders) --- */}

                {/* Satellite Node 1 (Top Right - Active Thread Connection) */}
                <g
                  transform="translate(640, 130)"
                  filter="url(#subtleElementShadow)"
                >
                  <circle
                    r="14"
                    fill="#ffffff"
                    stroke="#e4e4e7"
                    strokeWidth="1.5"
                  />
                  <circle r="6" fill="#18181b" />
                  {/* Subtle Orbit Ring */}
                  <circle
                    r="22"
                    fill="none"
                    stroke="#3525cd"
                    strokeWidth="1"
                    strokeOpacity="0.2"
                    strokeDasharray="3 4"
                  >
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      from="0"
                      to="360"
                      dur="8s"
                      repeatCount="indefinite"
                    />
                  </circle>
                </g>

                {/* Satellite Node 2 (Bottom Right - In-Thread Follow-up & Resolution Node) */}
                <g
                  transform="translate(680, 240)"
                  filter="url(#subtleElementShadow)"
                >
                  <circle
                    r="16"
                    fill="#ffffff"
                    stroke="#3525cd"
                    strokeWidth="1.75"
                  />
                  {/* Internal Pulse Dot */}
                  <circle r="5" fill="#3525cd">
                    <animate
                      attributeName="r"
                      values="4;6;4"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  {/* Outer Ripple */}
                  <circle
                    r="26"
                    fill="none"
                    stroke="#3525cd"
                    strokeWidth="1"
                    strokeOpacity="0.3"
                  >
                    <animate
                      attributeName="r"
                      values="18;32;18"
                      dur="3s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="stroke-opacity"
                      values="0.4;0;0.4"
                      dur="3s"
                      repeatCount="indefinite"
                    />
                  </circle>
                </g>

                {/* Satellite Node 3 (Left - Outgoing Origin Beacon) */}
                <g
                  transform="translate(190, 200)"
                  filter="url(#subtleElementShadow)"
                >
                  <circle
                    r="12"
                    fill="#ffffff"
                    stroke="#e4e4e7"
                    strokeWidth="1.5"
                  />
                  <circle r="4" fill="#71717a" />
                </g>

                {/* --- 5. THE CENTRAL MONITORED MESSAGE OBJECT (ELEGANT ICONIC ENVELOPE) --- */}
                <g transform="translate(420, 200)">
                  {/* Ambient Center Glow */}
                  <circle
                    r="48"
                    fill="#3525cd"
                    fillOpacity="0.08"
                    filter="blur(10px)"
                  />

                  {/* Main Floating Envelope Structure */}
                  <g filter="url(#heroCoreShadow)">
                    {/* Envelope Body Base */}
                    <rect
                      x="-54"
                      y="-36"
                      width="108"
                      height="72"
                      rx="16"
                      fill="url(#envelopeBaseGrad)"
                      stroke="#18181b"
                      strokeWidth="1.75"
                    />

                    {/* Lower Inner Fold Geometry */}
                    <path
                      d="M -54 36 L -10 0 C -3 -5, 3 -5, 10 0 L 54 36"
                      fill="none"
                      stroke="#e4e4e7"
                      strokeWidth="1.5"
                    />

                    {/* Top Flap Geometry (Sculpted) */}
                    <path
                      d="M -54 -36 L -8 4 C -3 8, 3 8, 8 4 L 54 -36"
                      fill="url(#envelopeFlapGrad)"
                      stroke="#18181b"
                      strokeWidth="1.75"
                      strokeLinejoin="round"
                    />

                    {/* Intelligent Echo Center Lens / Sentinel Beacon */}
                    <circle
                      cx="0"
                      cy="0"
                      r="12"
                      fill="#ffffff"
                      stroke="#3525cd"
                      strokeWidth="2"
                      filter="url(#subtleElementShadow)"
                    />

                    {/* Glowing Core Dot */}
                    <circle cx="0" cy="0" r="4.5" fill="#3525cd" />

                    {/* Continuous Micro Pulse Wave */}
                    <circle
                      cx="0"
                      cy="0"
                      r="9"
                      fill="none"
                      stroke="#3525cd"
                      strokeWidth="1.2"
                    >
                      <animate
                        attributeName="r"
                        values="7;18;7"
                        dur="2.4s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="stroke-opacity"
                        values="0.8;0;0.8"
                        dur="2.4s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  </g>
                </g>

                {/* --- 6. MINIMALIST TYPOGRAPHIC & SYSTEM ACCENTS --- */}
                <g opacity="0.6">
                  {/* Left Micro Accent */}
                  <text
                    x="130"
                    y="76"
                    fontFamily="ui-monospace, monospace"
                    fontSize="9"
                    fontWeight="600"
                    letterSpacing="0.08em"
                    fill="#71717a"
                  >
                    CONTINUOUS THREAD SENSING
                  </text>

                  {/* Right Micro Accent */}
                  <text
                    x="710"
                    y="76"
                    textAnchor="end"
                    fontFamily="ui-monospace, monospace"
                    fontSize="9"
                    fontWeight="600"
                    letterSpacing="0.08em"
                    fill="#3525cd"
                  >
                    AUTONOMOUS RESOLUTION LOOP
                  </text>

                  {/* Bottom Center Subtle Caption */}
                  <text
                    x="420"
                    y="360"
                    textAnchor="middle"
                    fontFamily="ui-monospace, monospace"
                    fontSize="9"
                    fontWeight="500"
                    letterSpacing="0.06em"
                    fill="#a1a1aa"
                  >
                    1 SEND · INTELLIGENT MONITORING · BACKGROUND FOLLOW-UP
                  </text>
                </g>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. CAPABILITIES — UNIFIED PRODUCT SHOWCASE */}
      {/* ========================================================================= */}
      <section className="py-20 sm:py-28 px-6 sm:px-8 max-w-5xl mx-auto border-t border-zinc-200/70">
        {/* Header */}
        <div className="space-y-4 text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-zinc-200/90 shadow-2xs select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3525cd]" />
            <span className="text-xs font-mono font-bold text-zinc-700 uppercase tracking-wider">
              Core Capabilities
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0b1c30] tracking-tight">
            One System for Complete Follow-up Autonomy
          </h2>

          <p className="text-sm sm:text-base text-zinc-500 font-normal leading-relaxed">
            Find the email, isolate the right people, detect responses in the
            background, and follow up automatically.
          </p>
        </div>

        {/* Single Cohesive Showcase Enclosure */}
        <div className="rounded-3xl bg-white border border-zinc-200/90 shadow-[0_20px_50px_-16px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.02)] overflow-hidden">
          {/* Progressive Step Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 border-b border-zinc-200/80 bg-zinc-50/60 divide-x divide-zinc-200/80">
            {[
              { id: 0, num: "01", label: "Search Sent Emails" },
              { id: 1, num: "02", label: "Response Tracking" },
              { id: 2, num: "03", label: "Response Detection" },
              { id: 3, num: "04", label: "Automatic Reminders" },
            ].map((tab) => {
              const isActive = activeCapability === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveCapability(tab.id)}
                  className={`px-4 py-4 sm:py-5 text-left transition-all relative flex flex-col justify-between gap-1.5 cursor-pointer ${
                    isActive
                      ? "bg-white text-zinc-900 shadow-2xs"
                      : "hover:bg-zinc-100/70 text-zinc-500 hover:text-zinc-800"
                  }`}
                >
                  {/* Top Active Accent Line */}
                  {isActive && (
                    <span className="absolute top-0 left-0 right-0 h-0.5 bg-[#3525cd]" />
                  )}
                  <span
                    className={`text-[10px] font-mono font-bold tracking-wider ${isActive ? "text-[#3525cd]" : "text-zinc-400"}`}
                  >
                    {tab.num}
                  </span>
                  <span className="text-xs sm:text-sm font-bold tracking-tight line-clamp-1">
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Unified Dynamic Stage Body */}
          <div className="p-6 sm:p-10 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Column */}
              <div className="lg:col-span-5 space-y-4 text-left">
                {activeCapability === 0 && (
                  <div className="space-y-3 animate-in fade-in duration-200">
                    <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
                      Search Sent Emails
                    </h3>
                    <p className="text-sm sm:text-base text-zinc-500 leading-relaxed font-normal">
                      Find and select any sent email directly inside EchoMail to
                      start tracking.
                    </p>
                  </div>
                )}

                {activeCapability === 1 && (
                  <div className="space-y-3 animate-in fade-in duration-200">
                    <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
                      Response Tracking
                    </h3>
                    <p className="text-sm sm:text-base text-zinc-500 leading-relaxed font-normal">
                      Track who has responded and who hasn't on every important
                      email.
                    </p>
                  </div>
                )}

                {activeCapability === 2 && (
                  <div className="space-y-3 animate-in fade-in duration-200">
                    <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
                      Response Detection
                    </h3>
                    <p className="text-sm sm:text-base text-zinc-500 leading-relaxed font-normal">
                      Automatically detects recipient replies in the background
                      with zero manual checking.
                    </p>
                  </div>
                )}

                {activeCapability === 3 && (
                  <div className="space-y-3 animate-in fade-in duration-200">
                    <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
                      Automatic Reminders
                    </h3>
                    <p className="text-sm sm:text-base text-zinc-500 leading-relaxed font-normal">
                      Sends polite follow-ups to non-responders until the
                      conversation is complete.
                    </p>
                  </div>
                )}

                {/* Micro Step Jumpers */}
                <div className="flex items-center gap-2 pt-2">
                  {[0, 1, 2, 3].map((step) => (
                    <button
                      key={step}
                      onClick={() => setActiveCapability(step)}
                      aria-label={`Go to capability step ${step + 1}`}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        activeCapability === step
                          ? "w-8 bg-[#3525cd]"
                          : "w-2 bg-zinc-200 hover:bg-zinc-300"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Right Column */}
              <div className="lg:col-span-7">
                <div className="rounded-2xl bg-zinc-50/80 border border-zinc-200/90 p-5 sm:p-7 relative overflow-hidden shadow-2xs select-none">
                  {/* Subtle Background Glow */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#3525cd]/4  rounded-full blur-3xl pointer-events-none" />

                  {/* Visual 1: Search Sent Emails */}
                  {activeCapability === 0 && (
                    <div className="space-y-3 animate-in fade-in duration-300">
                      {/* Search Bar */}
                      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-zinc-200 shadow-2xs">
                        <Search size={16} className="text-[#3525cd]" />
                        <span className="text-sm font-medium text-zinc-900">
                          Q4 Partnership Agreement
                        </span>
                      </div>

                      {/* Selected Email Result */}
                      <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-[#3525cd]/30 shadow-2xs flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white flex items-center justify-center shrink-0">
                            <Mail size={14} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs sm:text-sm font-bold text-zinc-900 truncate">
                              Q4 Partnership Agreement & Scope of Work
                            </p>
                            <p className="text-[11px] text-zinc-400 font-mono">
                              3 recipients · Sent today
                            </p>
                          </div>
                        </div>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#3525cd] text-white text-xs font-semibold shrink-0">
                          <Check size={12} className="stroke-3" />
                          <span>Track</span>
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Visual 2: Response Tracking */}
                  {activeCapability === 1 && (
                    <div className="space-y-2.5 animate-in fade-in duration-300">
                      {/* Recipient 1: Replied */}
                      <div className="p-3.5 rounded-xl bg-white border border-zinc-200/80 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-full bg-zinc-100 text-zinc-800 text-xs font-bold flex items-center justify-center">
                            SM
                          </div>
                          <p className="text-xs sm:text-sm font-bold text-zinc-900">
                            Sarah Miller
                          </p>
                        </div>
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-700 bg-zinc-100 px-2.5 py-1 rounded-md">
                          <Check size={12} className="stroke-[2.5]" />
                          <span>Replied</span>
                        </span>
                      </div>

                      {/* Recipient 2: Awaiting Response */}
                      <div className="p-3.5 rounded-xl bg-white border border-[#3525cd]/40 shadow-2xs flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-full bg-[#3525cd]/10 text-[#3525cd] text-xs font-bold flex items-center justify-center">
                            EV
                          </div>
                          <p className="text-xs sm:text-sm font-bold text-zinc-900">
                            Elena Vance
                          </p>
                        </div>
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#3525cd] bg-[#3525cd]/8 px-2.5 py-1 rounded-md">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#3525cd] animate-pulse" />
                          <span>Awaiting response</span>
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Visual 3: Response Detection */}
                  {activeCapability === 2 && (
                    <div className="animate-in fade-in duration-300">
                      <div className="p-4 sm:p-5 rounded-xl bg-white border border-zinc-200 shadow-2xs space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-zinc-900 text-xs sm:text-sm font-bold">
                            <CheckCircle2
                              size={16}
                              className="text-[#3525cd]"
                            />
                            <span>Reply Detected</span>
                          </div>
                          <span className="text-[11px] font-mono text-zinc-400">
                            Just now
                          </span>
                        </div>
                        <p className="text-xs text-zinc-600 font-mono">
                          Elena Vance replied to thread
                        </p>
                        <div className="pt-1 text-[11px] font-mono text-[#3525cd] font-semibold">
                          ✓ Tracking resolved automatically
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Visual 4: Automatic Reminders */}
                  {activeCapability === 3 && (
                    <div className="animate-in fade-in duration-300">
                      <div className="p-4 sm:p-5 rounded-xl bg-zinc-950 text-white space-y-3 shadow-2xs">
                        <div className="flex items-center justify-between text-[11px] font-mono">
                          <div className="flex items-center gap-1.5 text-[#a594fd] font-semibold">
                            <CornerDownRight size={13} />
                            <span>In-Thread Follow-up</span>
                          </div>
                          <span className="text-zinc-400">Scheduled</span>
                        </div>

                        <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed italic">
                          "Hi Elena, following up on the agreement below. Let us
                          know when you have a moment!"
                        </p>

                        <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-[10px] font-mono text-zinc-400">
                          <span>Sent only to non-responders</span>
                          <span className="text-[#a594fd]">
                            Disarms on reply
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. WHY ECHOMAIL — PROBLEM VS SOLUTION */}
      {/* ========================================================================= */}
      <section className="py-20 sm:py-24 px-6 sm:px-8 max-w-5xl mx-auto border-t border-zinc-200/70">
        <div className="space-y-3.5 text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0b1c30] tracking-tight">
            The Lost Thread Dilema
          </h2>
          <p className="text-sm sm:text-base text-zinc-500 font-normal leading-relaxed">
            Important sent emails quickly get buried in recipient inboxes.
            Manually checking back drains hours every single week.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-stretch">
          {/* old way */}
          <div className="p-7 rounded-2xl bg-white border border-rose-200/80 shadow-2xs space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-rose-100">
                <span className="text-xs font-mono font-bold text-rose-600 uppercase tracking-wider">
                  Without EchoMail
                </span>
                <XCircle size={16} className="text-rose-500" />
              </div>

              <h3 className="text-lg font-bold text-zinc-900">
                Manual Searching & Inbox Anxiety
              </h3>
              <ul className="space-y-3 text-xs sm:text-sm text-zinc-600">
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-500 font-bold shrink-0">✕</span>
                  <span>
                    Writing manual calendar reminders like "Check if Dave
                    replied"
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-500 font-bold shrink-0">✕</span>
                  <span>
                    Scouring sent folders to reconstruct who responded on
                    multi-person threads
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-500 font-bold shrink-0">✕</span>
                  <span>
                    Awkwardly re-emailing people who already responded via
                    separate channel
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-500 font-bold shrink-0">✕</span>
                  <span>
                    Critical project deadlines slipping unnoticed due to silence
                  </span>
                </li>
              </ul>
            </div>

            <div className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-100 text-xs text-rose-800 font-medium">
              Result: 3.5+ hours wasted weekly on manual follow-up
              administrative work.
            </div>
          </div>

          {/* what echomail brings to the table */}
          <div className="p-7 rounded-2xl bg-white border border-emerald-200/90 shadow-2xs space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
                <span className="text-xs font-mono font-bold text-emerald-700 uppercase tracking-wider">
                  With EchoMail
                </span>
                <CheckCircle2 size={16} className="text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900">
                Autonomous Tracking & Guaranteed Closure
              </h3>
              <ul className="space-y-3 text-xs sm:text-sm text-zinc-600">
                <li className="flex items-start gap-2.5">
                  <Check
                    size={16}
                    className="text-emerald-600 font-bold shrink-0"
                  />
                  <span>1-click tracking right after sending any email</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check
                    size={16}
                    className="text-emerald-600 font-bold shrink-0"
                  />
                  <span>
                    Background sentinel checks responses every 5 minutes
                    automatically
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check
                    size={16}
                    className="text-emerald-600 font-bold shrink-0"
                  />
                  <span>
                    Polite threaded follow-ups dispatch only to non-responders
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check
                    size={16}
                    className="text-emerald-600 font-bold shrink-0"
                  />
                  <span>
                    Instant auto-resolve stops reminders the second a response
                    arrives
                  </span>
                </li>
              </ul>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100 text-xs text-emerald-800 font-medium">
              Result: 100% loop closure rate with zero mental overhead.
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. HOW IT WORKS — STEP BY STEP */}
      {/* ========================================================================= */}
      <section className="py-20 sm:py-24 px-6 sm:px-8 max-w-5xl mx-auto border-t border-zinc-200/70">
        <div className="space-y-3.5 text-center max-w-xl mx-auto mb-14">
          <span className="text-xs font-mono font-bold text-[#3525cd] uppercase tracking-wider">
            Workflow
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0b1c30] tracking-tight">
            How EchoMail Works in 3 Steps
          </h2>
          <p className="text-sm sm:text-base text-zinc-500 font-normal leading-relaxed">
            From initial email dispatch to final confirmed resolution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Step 1 */}
          <div className="p-7 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs space-y-4">
            <div className="w-9 h-9 rounded-xl bg-zinc-950 text-white flex items-center justify-center font-bold text-xs sm:text-sm shadow-2xs">
              01
            </div>
            <h3 className="text-lg font-bold text-zinc-900">
              Select Sent Thread
            </h3>
            <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed font-normal">
              Pick any sent conversation and choose which specific recipients
              must respond. Set an optional deadline.
            </p>
            <div className="pt-2">
              <span className="text-[11px] font-mono text-zinc-500 bg-zinc-50 px-2.5 py-1 rounded border border-zinc-200">
                Setup time: &lt; 20 seconds
              </span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-7 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs space-y-4">
            <div className="w-9 h-9 rounded-xl bg-[#3525cd] text-white flex items-center justify-center font-bold text-xs sm:text-sm shadow-2xs">
              02
            </div>
            <h3 className="text-lg font-bold text-zinc-900">
              Autonomous Scanning
            </h3>
            <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed font-normal">
              EchoMail audits your inbox every 5 minutes in the background,
              matching incoming replies to your tracked threads automatically.
            </p>
            <div className="pt-2">
              <span className="text-[11px] font-mono text-[#3525cd] bg-indigo-50 px-2.5 py-1 rounded border border-indigo-100">
                24/7 background sentinel
              </span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-7 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs space-y-4">
            <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-xs sm:text-sm shadow-2xs">
              03
            </div>
            <h3 className="text-lg font-bold text-zinc-900">
              Targeted Follow-up & Resolution
            </h3>
            <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed font-normal">
              Gentle reminders reach only the non-responders. The moment the
              last person replies, the thread auto-resolves.
            </p>
            <div className="pt-2">
              <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                Auto-disarms instantly
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. SECURITY & PRIVACY FIRST */}
      {/* ========================================================================= */}
      <section className="py-20 sm:py-24 px-6 sm:px-8 max-w-5xl mx-auto border-t border-zinc-200/70">
        <div className="bg-white border border-zinc-200/80 rounded-2xl sm:rounded-3xl p-8 sm:p-12 shadow-2xs space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-100">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#3525cd]">
                <ShieldCheck size={15} />
                <span>Enterprise Grade Security</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
                Your Privacy is Non-Negotiable
              </h2>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-mono text-zinc-700 font-semibold">
              <Lock size={12} className="text-zinc-500" />
              <span>Google OAuth 2.0 Restricted Scopes</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="space-y-2">
              <h3 className="text-sm sm:text-base font-bold text-zinc-900">
                Zero AI Training
              </h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Your email content is never used to train machine learning
                models. EchoMail only inspects thread metadata to detect
                responses.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm sm:text-base font-bold text-zinc-900">
                Minimal Permission Scopes
              </h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                We only request the granular Gmail permissions required to
                inspect message headers and dispatch scheduled reminders.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm sm:text-base font-bold text-zinc-900">
                Instant Revocation
              </h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                You can disconnect your Google account and revoke all
                authentication tokens with a single click at any time from
                Settings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. FREQUENTLY ASKED QUESTIONS (FAQ) */}
      {/* ========================================================================= */}
      <section className="py-20 sm:py-24 px-6 sm:px-8 max-w-4xl mx-auto border-t border-zinc-200/70">
        <div className="space-y-3.5 text-center max-w-xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#3525cd]">
            <HelpCircle size={14} />
            <span>Answers</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0b1c30] tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-zinc-500 font-normal leading-relaxed">
            Everything you need to know about how EchoMail protects your
            workflow.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white border border-zinc-200/80 rounded-xl overflow-hidden transition-all duration-200 shadow-2xs"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-zinc-900 text-sm sm:text-base hover:bg-zinc-50/70 transition-colors cursor-pointer"
                  id={`faq-btn-${idx}`}
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    size={17}
                    className={`text-zinc-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-zinc-800" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-zinc-600 leading-relaxed border-t border-zinc-100 animate-in fade-in duration-150">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. MINIMAL FOOTER */}
      {/* ========================================================================= */}

      <footer
        className="border-t border-zinc-200/70 py-8 px-6 sm:px-8 bg-white"
        id="landing-footer"
      >
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <span>© 2026 ECHOMAIL CORP. ALL RIGHTS RESERVED.</span>
          <div className="flex items-center gap-1.5">
            <Lock size={11} />
            <span>Protected by Google OAuth 2.0 security standards</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
