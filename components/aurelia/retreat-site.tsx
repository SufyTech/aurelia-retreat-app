"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDown,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  CircleX,
  Menu,
  Send,
  Sparkles,
} from "lucide-react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BookingForm from "./booking-form";

gsap.registerPlugin(ScrollTrigger);

const images = {
  hero: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=2200&q=85",
  coast:
    "https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=1600&q=85",
  suite:
    "https://images.unsplash.com/photo-1524230572899-a752b3835840?auto=format&fit=crop&w=1200&q=85",
  villa:
    "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85",
  spa: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=1200&q=85",
  table:
    "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1400&q=85",
  terrace:
    "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1600&q=85",
};

function MotionShell({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.35, smoothWheel: true });
    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!reduce) {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((item) =>
        gsap.fromTo(
          item,
          { y: 38, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: item, start: "top 85%" },
          },
        ),
      );
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((item) =>
        gsap.to(item, {
          yPercent: -12,
          ease: "none",
          scrollTrigger: {
            trigger: item,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }),
      );
    }
    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);
  return <>{children}</>;
}

function Nav({ onConcierge }: { onConcierge: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);
  const closeMobile = () => setMobileOpen(false);
  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-500 ${scrolled || mobileOpen ? "bg-background/90 text-foreground backdrop-blur-md" : "text-primary-foreground"}`}
    >
      <div className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-5 md:px-10">
        <a href="#top" className="display text-2xl tracking-tight">
          Aurelia<span className="text-accent">.</span>
        </a>
        <nav className="hidden items-center gap-7 text-xs uppercase tracking-[0.14em] lg:flex">
          <a data-cursor-hover data-cursor-text="OPEN" href="#stay">
            Stay
          </a>
          <a data-cursor-hover data-cursor-text="OPEN" href="#experiences">
            Experiences
          </a>
          <a data-cursor-hover data-cursor-text="OPEN" href="#gallery">
            Gallery
          </a>
          <button
            data-cursor-hover
            data-cursor-text="ASK"
            onClick={onConcierge}
          >
            Concierge
          </button>
          <a data-cursor-hover data-cursor-text="BOOK" href="#book">
            Book
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <button
            data-cursor-hover
            data-cursor-text="BOOK"
            onClick={onConcierge}
            className="hidden border border-current px-4 py-2 text-xs uppercase tracking-[0.14em] transition hover:bg-accent hover:text-primary-foreground lg:block"
          >
            Book now
          </button>
          <button
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((current) => !current)}
            className="lg:hidden"
          >
            {mobileOpen ? <CircleX size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col gap-1 border-t border-current/15 bg-background px-5 py-6 text-foreground lg:hidden"
          >
            {[
              { label: "Stay", href: "#stay" },
              { label: "Experiences", href: "#experiences" },
              { label: "Gallery", href: "#gallery" },
              { label: "Book", href: "#book" },
            ].map(({ label, href }) => (
              <a
                key={href}
                href={href}
                onClick={(event) => {
                  event.preventDefault();
                  closeMobile();
                  setTimeout(() => {
                    document
                      .querySelector(href)
                      ?.scrollIntoView({ behavior: "smooth" });
                  }, 300);
                }}
                className="py-3 text-sm uppercase tracking-[0.14em]"
              >
                {label}
              </a>
            ))}
            <button
              onClick={() => {
                closeMobile();
                setTimeout(onConcierge, 300);
              }}
              className="py-3 text-left text-sm uppercase tracking-[0.14em]"
            >
              Concierge
            </button>
            <button
              onClick={() => {
                closeMobile();
                setTimeout(onConcierge, 300);
              }}
              className="mt-2 border border-current px-4 py-3 text-center text-sm uppercase tracking-[0.14em]"
            >
              Book now
            </button>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

function Concierge({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState([
    {
      from: "aurelia",
      text: "Good evening. How may I make your stay feel more like your own?",
    },
  ]);
  const [input, setInput] = useState(""),
    [loading, setLoading] = useState(false);
  async function send(message = input) {
    if (!message.trim() || loading) return;
    const history = messages;
    setMessages((current) => [...current, { from: "you", text: message }]);
    setInput("");
    setLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history }),
      });
      const data = await response.json();
      setMessages((current) => [
        ...current,
        { from: "aurelia", text: data.reply },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          from: "aurelia",
          text: "I am having a quiet moment. Please try again shortly.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }
  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 28 }}
          className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-primary px-6 py-7 text-primary-foreground shadow-2xl md:px-9"
        >
          <div className="flex items-center justify-between border-b border-primary-foreground/20 pb-5">
            <div>
              <p className="eyebrow text-accent">Aurelia / concierge</p>
              <h2 className="display mt-2 text-3xl">Ask Aurelia</h2>
            </div>
            <button onClick={onClose} aria-label="Close concierge">
              <CircleX size={25} />
            </button>
          </div>
          <div className="flex flex-1 flex-col gap-4 overflow-y-auto py-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`max-w-[88%] ${message.from === "you" ? "self-end bg-accent text-primary-foreground" : "bg-primary-foreground/10"} px-4 py-3 text-sm leading-6`}
              >
                {message.text}
              </div>
            ))}
            {loading && (
              <div className="text-sm text-primary-foreground/60">
                Aurelia is thinking…
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-2 pb-5">
            {[
              "What is included in wellness?",
              "Do you have October availability?",
              "Tell me about dinner",
            ].map((prompt) => (
              <button
                key={prompt}
                onClick={() => send(prompt)}
                className="border border-primary-foreground/25 px-3 py-2 text-left text-xs transition hover:border-accent hover:text-accent"
              >
                {prompt}
              </button>
            ))}
          </div>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              send();
            }}
            className="flex border-b border-primary-foreground/40 pb-2"
          >
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about your stay"
              aria-label="Ask about your stay"
              className="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-primary-foreground/45"
            />
            <button aria-label="Send message" className="text-accent">
              <Send size={18} />
            </button>
          </form>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

export default function RetreatSite() {
  const [conciergeOpen, setConciergeOpen] = useState(false);
  const [testimonial, setTestimonial] = useState(0);
  const quotes = [
    "A rare kind of quiet. The sea, the stone, the care in every detail — we left feeling newly arranged.",
    "It is not a place you visit. It is a rhythm you remember when you return home.",
    "The kind of hospitality that never announces itself, only appears exactly when needed.",
  ];
  return (
    <MotionShell>
      <Nav onConcierge={() => setConciergeOpen(true)} />
      <Concierge open={conciergeOpen} onClose={() => setConciergeOpen(false)} />
      <main id="top">
        <section className="relative flex min-h-screen items-end overflow-hidden bg-primary text-primary-foreground">
          <Image
            src={images.hero}
            alt="Aurelia Retreat above the Amalfi coast"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-primary/35" />
          <div className="relative z-10 mx-auto w-full max-w-[1500px] px-5 pb-12 md:px-10 md:pb-16">
            <p className="eyebrow mb-5 text-primary-foreground/75">
              Aurelia Retreat — Amalfi Coast
            </p>
            <h1 className="display max-w-5xl text-[clamp(4.3rem,11vw,11rem)] leading-[.8] tracking-[-.055em]">
              Where the cliff
              <br />
              <em>meets silence.</em>
            </h1>
            <div className="mt-12 flex items-end justify-between">
              <p className="max-w-xs text-sm leading-6 text-primary-foreground/75">
                A private house carved into the coast. Days paced by the sun,
                the tide, and nothing else.
              </p>
              <a
                href="#stay"
                className="group flex items-center gap-3 text-xs uppercase tracking-[.16em]"
              >
                Discover the house{" "}
                <ArrowDown
                  size={16}
                  className="transition group-hover:translate-y-1"
                />
              </a>
            </div>
          </div>
        </section>
        <section
          id="stay"
          className="mx-auto grid max-w-[1500px] gap-12 px-5 py-28 md:grid-cols-[.75fr_1.25fr] md:px-10 md:py-40"
        >
          <div data-reveal>
            <p className="eyebrow text-accent">A place apart</p>
            <h2 className="display mt-6 text-5xl leading-[.9] tracking-[-.04em] md:text-8xl">
              The luxury
              <br />
              <em>of less.</em>
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-[.8fr_1.2fr] md:items-end">
            <p
              data-reveal
              className="max-w-sm text-lg leading-8 text-muted-foreground"
            >
              Aurelia lives between the mountain and the Mediterranean — a
              handful of rooms, a garden that tumbles toward the sea, and time
              left deliberately unfilled.
            </p>
            <div
              data-reveal
              className="image-wrap relative aspect-[4/5] overflow-hidden md:aspect-[3/4]"
            >
              <Image
                src={images.coast}
                alt="Coastline seen from Aurelia"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </div>
          </div>
        </section>
        <section className="bg-card px-5 py-24 md:px-10 md:py-36">
          <div className="mx-auto grid max-w-[1500px] gap-10 md:grid-cols-3">
            <div>
              <p className="eyebrow text-accent">The Aurelia way</p>
              <p className="mt-5 max-w-xs text-sm leading-6 text-muted-foreground">
                A slower kind of hospitality, made tangible in stone, salt air,
                and small rituals.
              </p>
            </div>
            {[
              [
                "01",
                "Built into stone",
                "Rooms follow the natural contours of the cliff, each with a view that changes by the hour.",
              ],
              [
                "02",
                "Slow by design",
                "A breakfast that lasts. A swim without a schedule. The day, returned to you.",
              ],
            ].map(([number, title, text]) => (
              <div
                key={number}
                data-reveal
                className="border-t border-border pt-5"
              >
                <span className="eyebrow text-accent">{number}</span>
                <h3 className="display mt-12 text-4xl">{title}</h3>
                <p className="mt-4 max-w-xs text-sm leading-6 text-muted-foreground">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </section>
        <section
          id="experiences"
          className="mx-auto max-w-[1500px] px-5 py-28 md:px-10 md:py-40"
        >
          <div className="flex items-end justify-between">
            <div>
              <p className="eyebrow text-accent">Stay awhile</p>
              <h2 className="display mt-4 text-6xl leading-none md:text-8xl">
                Rooms & rituals
              </h2>
            </div>
            <p className="hidden max-w-xs text-right text-sm leading-6 text-muted-foreground md:block">
              Four ways to settle into the landscape. Each one private, each one
              a little different.
            </p>
          </div>
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            <Card
              image={images.suite}
              title="Cliffside Suite"
              detail="A private terrace, a deep soaking tub, and the sea at eye level."
            />
            <Card
              image={images.villa}
              title="Garden Villa"
              detail="Two rooms wrapped in citrus, jasmine, and the sound of water."
            />
            <Card
              image={images.spa}
              title="Wellness Pavilion"
              detail="A cedar sauna, open-air treatments, and nowhere else to be."
            />
          </div>
        </section>
        <section
          id="gallery"
          data-cursor-hover
          data-cursor-text="SCROLL"
          className="overflow-hidden bg-primary py-20 text-primary-foreground md:py-32"
        >
          <div className="mx-auto grid max-w-[1500px] items-center gap-8 px-5 md:grid-cols-[1.1fr_.9fr] md:px-10">
            <div className="image-wrap relative aspect-[4/3] overflow-hidden md:aspect-[1.15/1]">
              <Image
                data-parallax
                src={images.terrace}
                alt="Terrace overlooking the sea"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 55vw"
              />
            </div>
            <div className="md:pl-12">
              <p className="eyebrow text-accent">
                The light changes everything
              </p>
              <p className="display mt-6 text-5xl leading-[.95] md:text-7xl">
                Come for the view.
                <br />
                <em>Stay for the feeling.</em>
              </p>
              <button
                data-cursor-hover
                data-cursor-text="ASK"
                onClick={() => setConciergeOpen(true)}
                className="mt-10 inline-flex items-center gap-3 border border-primary-foreground/40 px-5 py-3 text-xs uppercase tracking-[.14em] transition hover:bg-accent hover:text-primary-foreground"
              >
                Plan your stay <ArrowUpRight size={16} />
              </button>
            </div>
          </div>
        </section>
        <section className="mx-auto max-w-[1500px] px-5 py-28 md:px-10 md:py-40">
          <div className="grid gap-12 md:grid-cols-[.65fr_1.35fr]">
            <div>
              <p className="eyebrow text-accent">A few words from guests</p>
              <div className="mt-10 flex gap-2">
                <button
                  onClick={() =>
                    setTestimonial(
                      (testimonial + quotes.length - 1) % quotes.length,
                    )
                  }
                  aria-label="Previous testimonial"
                  className="border border-border p-2"
                >
                  <ChevronLeft size={17} />
                </button>
                <button
                  onClick={() =>
                    setTestimonial((testimonial + 1) % quotes.length)
                  }
                  aria-label="Next testimonial"
                  className="border border-border p-2"
                >
                  <ChevronRight size={17} />
                </button>
              </div>
            </div>
            <div>
              <Sparkles size={22} className="text-accent" />
              <AnimatePresence mode="wait">
                <motion.blockquote
                  key={testimonial}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -18 }}
                  className="display mt-7 text-5xl leading-[.96] tracking-[-.03em] md:text-7xl"
                >
                  “{quotes[testimonial]}”
                </motion.blockquote>
              </AnimatePresence>
              <p className="eyebrow mt-8 text-muted-foreground">
                — Mara K., London
              </p>
            </div>
          </div>
        </section>
        <section
          id="book"
          className="bg-accent px-5 py-24 text-primary-foreground md:px-10 md:py-32"
        >
          <div className="mx-auto flex max-w-[1500px] flex-col gap-14 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="eyebrow">Your time, returned</p>
              <h2 className="display mt-5 max-w-3xl text-6xl leading-[.86] md:text-9xl">
                Begin
                <br />
                <em>here.</em>
              </h2>
            </div>
            <BookingForm />
          </div>
        </section>
        <footer className="bg-primary px-5 py-12 text-primary-foreground md:px-10">
          <div className="mx-auto grid max-w-[1500px] gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
            <div>
              <p className="display text-4xl">
                Aurelia<span className="text-accent">.</span>
              </p>
              <p className="mt-5 max-w-xs text-sm leading-6 text-primary-foreground/65">
                A private retreat on the Amalfi Coast, for days that ask very
                little of you.
              </p>
            </div>
            <div className="eyebrow flex flex-col gap-4 text-primary-foreground/70">
              <a href="#stay">Stay</a>
              <a href="#experiences">Experiences</a>
              <a href="#gallery">Gallery</a>
              <button
                className="text-left"
                onClick={() => setConciergeOpen(true)}
              >
                Concierge
              </button>
            </div>
            <div className="text-sm leading-7 text-primary-foreground/65">
              <p>
                Via del Silenzio 8<br />
                84017 Positano, Italy
              </p>
              <p className="mt-4">
                hello@aureliaretreat.com
                <br />
                +39 089 000 000
              </p>
            </div>
          </div>
          <div className="mx-auto mt-16 flex max-w-[1500px] justify-between border-t border-primary-foreground/15 pt-5 text-xs text-primary-foreground/45">
            <span>© 2026 Aurelia Retreat</span>
            <span>Instagram · Journal</span>
          </div>
        </footer>
      </main>
    </MotionShell>
  );
}

function Card({
  image,
  title,
  detail,
}: {
  image: string;
  title: string;
  detail: string;
}) {
  return (
    <article data-reveal data-cursor-hover data-cursor-text="VIEW">
      <div className="image-wrap relative aspect-[.82] overflow-hidden bg-card">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-primary/0 transition hover:bg-primary/20" />
      </div>
      <div className="flex items-start justify-between gap-4 border-b border-border py-5">
        <div>
          <h3 className="display text-3xl">{title}</h3>
          <p className="mt-2 max-w-xs text-sm leading-6 text-muted-foreground">
            {detail}
          </p>
        </div>
        <ArrowUpRight size={18} className="mt-1 text-accent" />
      </div>
    </article>
  );
}
