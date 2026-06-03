import { Link } from "react-router-dom";
import Button from "../components/Button";
import Card from "../components/Card";
import Badge from "../components/Badge";
import Avatar from "../components/Avatar";
import {
  Coffee,
  Link2,
  Heart,
  Users,
  FileText,
  Zap,
  DollarSign,
  Crown,
  Check,
  ArrowRight,
} from "lucide-react";

/* ── Mock Data ── */
const creators = [
  {
    name: "Sarah Chen",
    category: "Digital Art",
    supporters: 1247,
    username: "sarahchen",
  },
  {
    name: "Alex Rivera",
    category: "Music",
    supporters: 892,
    username: "alexrivera",
  },
  {
    name: "Jordan Park",
    category: "Writing",
    supporters: 634,
    username: "jordanpark",
  },
  {
    name: "Maya Johnson",
    category: "Podcasting",
    supporters: 2103,
    username: "mayajohnson",
  },
  {
    name: "Leo Tanaka",
    category: "Open Source",
    supporters: 1568,
    username: "leotanaka",
  },
  {
    name: "Priya Sharma",
    category: "Education",
    supporters: 945,
    username: "priyasharma",
  },
  {
    name: "Chris Lee",
    category: "Gaming",
    supporters: 3201,
    username: "chrislee",
  },
  {
    name: "Nina Costa",
    category: "Photography",
    supporters: 712,
    username: "ninacosta",
  },
];

const features = [
  {
    icon: Coffee,
    title: "One-Time Donations",
    desc: "Let fans support you with a simple coffee-sized contribution.",
  },
  {
    icon: Crown,
    title: "Memberships",
    desc: "Offer monthly tiers with exclusive perks and content.",
  },
  {
    icon: FileText,
    title: "Exclusive Posts",
    desc: "Share members-only updates, tutorials, and behind-the-scenes.",
  },
  {
    icon: Zap,
    title: "Custom Goals",
    desc: "Set funding goals and let your community rally behind you.",
  },
  {
    icon: DollarSign,
    title: "Instant Payouts",
    desc: "Get your money fast with direct Stripe payouts.",
  },
  {
    icon: Heart,
    title: "No Platform Cut on Basics",
    desc: "Keep 100% of basic donations — we only charge on premium features.",
  },
];

const pricingPerks = [
  "Unlimited supporters",
  "Custom profile page",
  "One-time & recurring payments",
  "Supporter messages",
  "Direct Stripe payouts",
  "Embeddable support button",
  "Analytics dashboard",
  "Email notifications",
];

export default function HomePage() {
  return (
    <>
      {/* ════════ HERO ════════ */}
      <section className="relative overflow-hidden bg-[#fffdf0] border-b-2 border-brew-text">
        {/* Hard dot-grid background */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(#3E2723 2px, transparent 2px)`,
            backgroundSize: "32px 32px",
          }}
        />

        <div className="max-w-5xl mx-auto px-6 pt-20 pb-24 md:pt-28 md:pb-32 text-center relative z-10">
          <div className="animate-fade-up">
            <div className="inline-flex mb-8 px-4 py-1.5 border-2 border-brew-text bg-white text-brew-text font-inter font-bold text-xs rounded-full shadow-[2px_2px_0px_0px_currentColor] -rotate-1">
              Trusted by 50,000+ creators
            </div>
          </div>

          <h1 className="font-inter font-black text-[44px] sm:text-[56px] md:text-[72px] uppercase leading-[1.05] tracking-tighter text-brew-text mb-6 animate-fade-up delay-100">
            Fund your passion.
            <br />
            <span className="relative inline-block mt-2">
              One cup at a time.
              {/* Thicker, more stylized underline */}
              <svg
                className="absolute -bottom-3 left-0 w-full"
                height="12"
                viewBox="0 0 300 12"
                fill="none"
              >
                <path
                  d="M2 9.5C60 3 120 2 150 5.5C180 9 240 9 298 4"
                  stroke="#F5C518"
                  strokeWidth="6"
                  strokeLinecap="square"
                />
              </svg>
            </span>
          </h1>

          <p className="font-inter text-lg md:text-xl font-medium text-brew-text/80 max-w-2xl mx-auto mb-10 animate-fade-up delay-200">
            The easiest way for your audience to say thanks. Accept donations,
            sell memberships, and share exclusive content — all in one beautiful
            page.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 animate-fade-up delay-300">
            <Link to="/signup" className="w-full sm:w-auto">
              <Button
                variant="primary"
                className="flex w-full sm:w-auto min-h-[48px] items-center justify-center gap-2 rounded-full border-2 border-brew-text bg-brew-yellow px-8 py-3 font-inter text-base font-bold text-brew-text shadow-[4px_4px_0px_0px_currentColor] transition-all duration-150 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_currentColor] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
              >
                Start your BrewMe page <ArrowRight size={18} strokeWidth={3} />
              </Button>
            </Link>
            <a href="#how-it-works" className="w-full sm:w-auto">
              <Button
                variant="secondary"
                className="flex w-full sm:w-auto min-h-[48px] items-center justify-center rounded-full border-2 border-brew-text bg-white px-8 py-3 font-inter text-base font-bold text-brew-text shadow-[4px_4px_0px_0px_currentColor] transition-all duration-150 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_currentColor] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
              >
                See how it works
              </Button>
            </a>
          </div>

          {/* Floating Creator Card Mockup */}
          <div className="animate-fade-up delay-400 relative">
            <div className="animate-float inline-block">
              <Card className="w-72 sm:w-80 mx-auto text-center !p-8 border-2 border-brew-text bg-[#fffdf0] shadow-[8px_8px_0px_0px_currentColor] text-brew-text rounded-3xl transition-transform duration-200 hover:-translate-y-2 hover:rotate-1">
                <div className="w-16 h-16 rounded-full bg-brew-yellow border-2 border-brew-text mx-auto mb-4 flex items-center justify-center text-2xl shadow-[3px_3px_0px_0px_currentColor]">
                  <img src="../../public/image/woman.png" />
                </div>
                <h3 className="font-inter font-black text-brew-text text-lg mb-1">
                  @sarahchen
                </h3>
                <p className="font-inter text-brew-text/80 font-bold text-sm mb-3 uppercase tracking-wider">
                  Digital Artist
                </p>
                <div className="mb-6">
                  <Badge className="bg-white border-2 border-brew-text text-brew-text shadow-[2px_2px_0px_0px_currentColor] px-3 py-1 font-bold">
                    1,247 supporters
                  </Badge>
                </div>
                <Button
                  variant="primary"
                  className="flex w-full min-h-[44px] items-center justify-center rounded-full border-2 border-brew-text bg-brew-yellow px-6 py-2.5 font-inter text-sm font-bold text-brew-text shadow-[3px_3px_0px_0px_currentColor] transition-all duration-150 hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_currentColor] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
                >
                  Support — $5.00
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ HOW IT WORKS ════════ */}
      <section
        id="how-it-works"
        className="bg-brew-yellow-light py-20 md:py-24 border-y-2 border-brew-text"
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20 text-brew-text">
            {/* Brutalist Badge */}
            <div className="inline-block mb-6 px-5 py-2 border-2 border-brew-text bg-white font-inter font-bold text-sm rounded-full shadow-[3px_3px_0px_0px_currentColor] -rotate-1">
              How it works
            </div>
            <h2 className="font-inter font-black text-4xl md:text-5xl uppercase tracking-tight">
              Three simple steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 relative text-brew-text">
            {/* Heavy Dashed Connector line (desktop) */}
            <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] -translate-y-1/2 border-t-4 border-dashed border-brew-text/20 z-0" />

            {[
              {
                num: "1",
                title: "Set up your page",
                desc: "Create your BrewMe profile in under 2 minutes. Add your bio, photo, and links.",
              },
              {
                num: "2",
                title: "Share your link",
                desc: "Drop your unique BrewMe link on social media, your website, or email signature.",
              },
              {
                num: "3",
                title: "Get supported",
                desc: "Your fans buy you coffees, join memberships, and fuel your creative journey.",
              },
            ].map((step, i) => (
              <div
                key={i}
                className="relative z-10 flex flex-col h-full bg-white border-2 border-brew-text rounded-3xl p-8 shadow-[8px_8px_0px_0px_currentColor] transition-transform hover:-translate-y-1 animate-fade-up"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                {/* Overlapping Brutalist Number */}
                <div className="absolute -top-6 -left-4 w-14 h-14 rounded-full border-2 border-brew-text bg-brew-yellow font-inter font-black text-2xl flex items-center justify-center shadow-[4px_4px_0px_0px_currentColor] -rotate-6">
                  {step.num}
                </div>

                <div className="mt-4">
                  <h3 className="font-inter font-black text-xl mb-3">
                    {step.title}
                  </h3>
                  <p className="font-inter text-base font-medium opacity-80 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ FEATURES ════════ */}
      <section className="py-20 md:py-24 bg-[#fffdf0]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-block mb-6 px-5 py-2 border-2 border-brew-text bg-brew-yellow font-inter font-bold text-sm rounded-full shadow-[3px_3px_0px_0px_currentColor] rotate-2">
              Features
            </div>
            <h2 className="font-inter font-black text-4xl md:text-5xl text-brew-text mb-4 uppercase tracking-tight">
              Everything you need to get funded
            </h2>
            <p className="font-inter text-lg font-medium text-brew-text/80 max-w-2xl mx-auto">
              Powerful tools that help creators earn a living doing what they
              love.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className="group relative bg-white border-2 border-brew-text p-6 md:p-8 rounded-3xl shadow-[6px_6px_0px_0px_currentColor] transition-transform duration-200 hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_currentColor] animate-fade-up"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  {/* Brutalist Icon Container */}
                  <div className="w-14 h-14 rounded-xl border-2 border-brew-text bg-brew-yellow-light flex items-center justify-center mb-6 shadow-[3px_3px_0px_0px_currentColor] transition-transform group-hover:rotate-6">
                    <Icon
                      size={24}
                      strokeWidth={2.5}
                      className="text-brew-text"
                    />
                  </div>
                  <h3 className="font-inter font-black text-xl text-brew-text mb-3">
                    {feature.title}
                  </h3>
                  <p className="font-inter text-base font-medium text-brew-text/70 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      {/* ════════ SOCIAL PROOF ════════ */}
      <section className="bg-brew-yellow-light py-20 md:py-24 border-y-2 border-brew-text overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-block mb-6 px-5 py-2 border-2 border-brew-text bg-white font-inter font-bold text-sm rounded-full shadow-[3px_3px_0px_0px_currentColor] -rotate-2">
              Community
            </div>
            <h2 className="font-inter font-black text-4xl md:text-5xl text-brew-text uppercase tracking-tight">
              Join thousands of creators
            </h2>
          </div>

          {/* Scrolling Creator Cards */}
          <div className="relative mb-24">
            <div
              className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide px-4 md:px-0"
              style={{ scrollbarWidth: "none" }}
            >
              {creators.map((creator, i) => (
                <Link
                  to={`/${creator.username}`}
                  key={i}
                  className="snap-center shrink-0 no-underline group outline-none"
                >
                  <div className="w-64 bg-white border-2 border-brew-text p-6 rounded-3xl text-center shadow-[6px_6px_0px_0px_currentColor] transition-transform duration-200 group-hover:-translate-y-2 group-hover:shadow-[8px_8px_0px_0px_currentColor] group-focus-visible:-translate-y-2 group-focus-visible:ring-4 group-focus-visible:ring-brew-text">
                    {/* Avatar Wrapper for hard borders */}
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full border-2 border-brew-text bg-brew-yellow-light shadow-[4px_4px_0px_0px_currentColor] flex items-center justify-center overflow-hidden">
                      <Avatar
                        name={creator.name}
                        size="lg"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h4 className="font-inter font-black text-lg text-brew-text mb-2">
                      {creator.name}
                    </h4>
                    <div className="inline-block border-2 border-brew-text bg-[#fffdf0] px-3 py-1 text-xs font-bold rounded-full mb-3 shadow-[2px_2px_0px_0px_currentColor]">
                      {creator.category}
                    </div>
                    <p className="font-inter text-sm font-semibold text-brew-text/70 uppercase tracking-wide">
                      {creator.supporters.toLocaleString()} supporters
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Massive Brutalist Quote Card */}
          <div className="max-w-4xl mx-auto relative px-4 md:px-0">
            {/* Floating Quotation Mark */}
            <div className="absolute -top-8 -left-2 md:-left-8 w-16 h-16 rounded-full border-2 border-brew-text bg-brew-yellow text-brew-text font-black text-5xl flex items-center justify-center shadow-[4px_4px_0px_0px_currentColor] -rotate-12 z-10 pt-4">
              "
            </div>

            <div className="bg-white border-2 border-brew-text rounded-3xl p-8 md:p-12 shadow-[12px_12px_0px_0px_currentColor]">
              <blockquote className="font-inter font-black text-2xl md:text-3xl text-brew-text leading-tight mb-8">
                BrewMe changed my life. I went from struggling to fund my art to
                earning a full-time income from my community of supporters.
              </blockquote>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full border-2 border-brew-text bg-brew-yellow overflow-hidden shadow-[3px_3px_0px_0px_currentColor]">
                  <Avatar
                    name="Sarah Chen"
                    size="sm"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-left">
                  <p className="font-inter font-black text-lg text-brew-text leading-none mb-1">
                    Sarah Chen
                  </p>
                  <p className="font-inter text-sm font-semibold text-brew-text/70 uppercase tracking-wide">
                    Digital Artist · 1,247 supporters
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ PRICING ════════ */}
      <section className="py-20 md:py-24 bg-[#fffdf0] border-t-2 border-brew-text">
        <div className="max-w-lg mx-auto px-6 text-center">
          <div className="inline-block mb-6 px-5 py-2 border-2 border-brew-text bg-brew-yellow font-inter font-bold text-sm rounded-full shadow-[3px_3px_0px_0px_currentColor] rotate-2">
            Pricing
          </div>
          <h2 className="font-inter font-black text-4xl md:text-5xl text-brew-text mb-4 uppercase tracking-tight">
            Free to start
          </h2>
          <p className="font-inter font-medium text-lg text-brew-text/80 mb-12">
            No monthly fees. No hidden costs. Just a small cut when you earn.
          </p>

          <div className="bg-white border-2 border-brew-text rounded-3xl p-8 md:p-10 text-left shadow-[12px_12px_0px_0px_currentColor] relative overflow-hidden">
            {/* Decorative corner accent */}
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-brew-yellow rounded-full border-2 border-brew-text opacity-50" />

            <div className="text-center mb-10 relative z-10">
              <span className="font-inter font-black text-7xl md:text-8xl text-brew-text tracking-tighter drop-shadow-[4px_4px_0px_#F5C518]">
                5%
              </span>
              <div className="mt-4">
                <div className="inline-block px-4 py-1.5 border-2 border-brew-text bg-brew-yellow-light font-bold text-xs uppercase tracking-widest rounded-full shadow-[2px_2px_0px_0px_currentColor] mb-3">
                  Platform Fee
                </div>
                <p className="font-inter font-bold text-brew-text/70 text-sm">
                  + Stripe processing (2.9% + 30¢)
                </p>
              </div>
            </div>

            {/* Heavy Dashed Divider */}
            <div className="border-t-4 border-dashed border-brew-text/20 pt-8 mb-8">
              <ul className="space-y-4 list-none p-0 m-0">
                {pricingPerks.map((perk, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-4 font-inter font-bold text-base text-brew-text"
                  >
                    {/* Brutalist Checkmark Box */}
                    <div className="w-7 h-7 rounded-md border-2 border-brew-text bg-brew-yellow flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_currentColor]">
                      <Check
                        size={16}
                        strokeWidth={4}
                        className="text-brew-text"
                      />
                    </div>
                    {perk}
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center mt-2">
              <Link to="/signup" className="block">
                <Button
                  variant="primary"
                  className="flex w-full min-h-[56px] items-center justify-center gap-2 rounded-full border-2 border-brew-text bg-brew-yellow px-8 py-4 font-inter text-lg font-black text-brew-text shadow-[4px_4px_0px_0px_currentColor] transition-all duration-150 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_currentColor] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
                >
                  Get started for free <ArrowRight size={20} strokeWidth={3} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ FINAL CTA ════════ */}
      <section className="bg-brew-yellow py-20 md:py-32 border-t-4 border-brew-text relative overflow-hidden">
        {/* Abstract brutalist shapes in background */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-transparent border-4 border-brew-text rounded-full opacity-20 -translate-x-1/2" />
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-transparent border-4 border-brew-text rotate-45 opacity-20 translate-x-1/4" />

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <div className="inline-block mb-8 px-6 py-2 border-2 border-brew-text bg-white font-inter font-black text-sm uppercase tracking-widest rounded-full shadow-[4px_4px_0px_0px_currentColor] -rotate-2">
            It's time to build
          </div>

          <h2 className="font-inter font-black text-5xl md:text-7xl text-brew-text mb-6 uppercase tracking-tighter leading-none">
            Ready to get <br className="hidden md:block" /> funded?
          </h2>

          <p className="font-inter font-bold text-brew-text/80 mb-12 text-xl md:text-2xl max-w-2xl mx-auto">
            Join 50,000+ creators and start earning from your passion today.
          </p>

          <Link to="/signup" className="inline-block">
            <Button className="flex min-h-[64px] items-center justify-center gap-3 rounded-full border-4 border-brew-text bg-white px-12 py-4 font-inter text-xl font-black text-brew-text shadow-[8px_8px_0px_0px_currentColor] transition-all duration-150 hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[5px_5px_0px_0px_currentColor] active:translate-x-[8px] active:translate-y-[8px] active:shadow-none hover:bg-[#fffdf0]">
              Start your free page <ArrowRight size={24} strokeWidth={3} />
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
