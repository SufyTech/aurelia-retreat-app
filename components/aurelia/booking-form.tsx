"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";

type Status = "idle" | "submitting" | "success" | "error";

export default function BookingForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setStatus("submitting");
    setErrorMessage("");

    const form = new FormData(formElement);
    const checkIn = form.get("checkIn") as string;
    const checkOut = form.get("checkOut") as string;

    if (checkIn && checkOut && new Date(checkOut) <= new Date(checkIn)) {
      setStatus("error");
      setErrorMessage("Check-out must be after check-in.");
      return;
    }

    const payload = {
      name: form.get("name"),
      email: form.get("email"),
      checkIn: checkIn || null,
      checkOut: checkOut || null,
      guests: form.get("guests") ? Number(form.get("guests")) : null,
      roomInterest: form.get("roomInterest"),
      message: form.get("message"),
    };

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(
          data?.error ?? "Something went wrong. Please try again.",
        );
      }
      formElement.reset();
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    }
  }

  if (status === "success") {
    return (
      <div className="max-w-md text-primary-foreground">
        <p className="display text-3xl">Thank you.</p>
        <p className="mt-3 text-sm leading-6 text-primary-foreground/80">
          Your inquiry has reached us. Someone from the team will follow up
          within one business day to confirm availability.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid w-full max-w-xl gap-4 text-primary-foreground"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label
            htmlFor="name"
            className="text-xs uppercase tracking-[0.12em] text-primary-foreground/70"
          >
            Name
          </label>
          <input
            id="name"
            name="name"
            required
            className="border-b border-primary-foreground/40 bg-transparent py-2 text-sm outline-none placeholder:text-primary-foreground/40"
            placeholder="Your name"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label
            htmlFor="email"
            className="text-xs uppercase tracking-[0.12em] text-primary-foreground/70"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="border-b border-primary-foreground/40 bg-transparent py-2 text-sm outline-none placeholder:text-primary-foreground/40"
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1">
          <label
            htmlFor="checkIn"
            className="text-xs uppercase tracking-[0.12em] text-primary-foreground/70"
          >
            Check-in
          </label>
          <input
            id="checkIn"
            name="checkIn"
            type="date"
            className="border-b border-primary-foreground/40 bg-transparent py-2 text-sm outline-none [color-scheme:dark]"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label
            htmlFor="checkOut"
            className="text-xs uppercase tracking-[0.12em] text-primary-foreground/70"
          >
            Check-out
          </label>
          <input
            id="checkOut"
            name="checkOut"
            type="date"
            className="border-b border-primary-foreground/40 bg-transparent py-2 text-sm outline-none [color-scheme:dark]"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label
            htmlFor="guests"
            className="text-xs uppercase tracking-[0.12em] text-primary-foreground/70"
          >
            Guests
          </label>
          <input
            id="guests"
            name="guests"
            type="number"
            min={1}
            max={8}
            defaultValue={2}
            className="border-b border-primary-foreground/40 bg-transparent py-2 text-sm outline-none"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="roomInterest"
          className="text-xs uppercase tracking-[0.12em] text-primary-foreground/70"
        >
          Interested in
        </label>
        <select
          id="roomInterest"
          name="roomInterest"
          className="border-b border-primary-foreground/40 bg-transparent py-2 text-sm outline-none [color-scheme:dark]"
        >
          <option value="Cliffside Suite">Cliffside Suite</option>
          <option value="Garden Villa">Garden Villa</option>
          <option value="Not sure yet">Not sure yet</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="message"
          className="text-xs uppercase tracking-[0.12em] text-primary-foreground/70"
        >
          Anything we should know? (optional)
        </label>
        <textarea
          id="message"
          name="message"
          rows={2}
          className="border-b border-primary-foreground/40 bg-transparent py-2 text-sm outline-none placeholder:text-primary-foreground/40"
          placeholder="Special occasion, dietary needs, etc."
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-primary">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        data-cursor-hover
        data-cursor-text="SEND"
        className="group mt-2 flex w-fit items-center gap-3 border-b border-primary-foreground pb-2 text-sm uppercase tracking-[.16em] disabled:opacity-50"
      >
        {status === "submitting" ? "Sending…" : "Check availability"}
        <ArrowUpRight
          size={18}
          className="transition group-hover:translate-x-1 group-hover:-translate-y-1"
        />
      </button>
    </form>
  );
}
