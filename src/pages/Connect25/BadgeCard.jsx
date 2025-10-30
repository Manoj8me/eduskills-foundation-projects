"use client";

import React from "react";

function DateChip({ children, color = "orange" }) {
  const palette =
    color === "orange" ? "bg-orange-500 text-white" : "bg-blue-700 text-white";
  return (
    <span
      className={`inline-flex items-center justify-center rounded-sm px-1.5 py-0.5 text-xs font-semibold ${palette}`}
    >
      {children}
    </span>
  );
}

function SectionLabel({ children }) {
  return (
    <p className="text-xs font-medium tracking-wide text-neutral-500">
      {children}
    </p>
  );
}

function LogoPlaceholder({ label }) {
  return (
    <div className="flex h-8 w-28 items-center justify-center rounded border border-neutral-200 bg-white/60 text-[10px] text-neutral-500">
      {label}
    </div>
  );
}

export function BadgeCard() {
  return (
    <main className="min-h-screen bg-neutral-100 flex items-center justify-center p-6">
      <div className="w-full max-w-xl">
        <article
          role="region"
          aria-label="Event Badge"
          className="overflow-hidden rounded-md border border-neutral-200 bg-white shadow-md"
        >
          {/* Perforated top edge */}
          <div
            className="w-full border-t-2 border-dashed border-neutral-300"
            aria-hidden="true"
          />

          <div className="p-6">
            {/* Top right code */}
            <div className="flex justify-end">
              <span className="text-xs text-neutral-500">ESC20246002</span>
            </div>

            {/* Brand / Title */}
            <header className="mt-1">
              <div className="flex items-end gap-2">
                <h1 className="text-2xl font-bold leading-none text-blue-800">
                  EduSkills
                </h1>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-extrabold leading-none text-blue-800">
                    Connect
                  </span>
                  <span className="ml-1 -mb-1 rounded-sm bg-orange-500 px-1.5 py-0.5 text-xs font-bold text-white">
                    2024
                  </span>
                </div>
              </div>
              <p className="mt-1 text-sm text-neutral-500">
                Transform. Together
              </p>
            </header>

            {/* Event line */}
            <section className="mt-4">
              <h2 className="text-pretty text-xl font-extrabold tracking-tight">
                <span className="text-blue-800">Next</span>{" "}
                <span className="text-orange-500">GEN</span>{" "}
                <span className="font-semibold text-blue-800">
                  Skill Conclave
                </span>
              </h2>

              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-neutral-700">
                <DateChip color="orange">27</DateChip>
                <DateChip color="blue">28</DateChip>
                <DateChip color="orange">29</DateChip>
                <span className="text-neutral-500">
                  SEP, 2024 | Dr. Ambedkar International Centre | New Delhi
                </span>
              </div>
            </section>

            {/* Partners */}
            <section className="mt-6 space-y-5">
              <div>
                <SectionLabel>Title Partner</SectionLabel>
                <div className="mt-2 flex items-center gap-3">
                  <LogoPlaceholder label="Microchip" />
                </div>
              </div>

              <div>
                <SectionLabel>Gold Partners</SectionLabel>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <LogoPlaceholder label="zscaler" />
                  <LogoPlaceholder label="Juniper" />
                </div>
              </div>

              <div>
                <SectionLabel>Associate Partners</SectionLabel>
                <div className="mt-2 grid grid-cols-3 gap-3">
                  <LogoPlaceholder label="MIDAS" />
                  <LogoPlaceholder label="Bentley" />
                  <LogoPlaceholder label="celonis" />
                </div>
              </div>

              <div>
                <SectionLabel>Institute Partners</SectionLabel>
                <div className="mt-2 grid grid-cols-4 gap-3">
                  <LogoPlaceholder label="Galgotias" />
                  <LogoPlaceholder label="Public Univ." />
                  <LogoPlaceholder label="SRU" />
                  <LogoPlaceholder label="LNCT" />
                </div>
              </div>
            </section>

            {/* Name block */}
            <section className="mt-6 rounded-lg border border-neutral-300 p-5">
              <p className="text-center text-xl font-extrabold text-neutral-900">
                Mohit Mittal
              </p>
              <p className="mt-1 text-center text-sm leading-6 text-neutral-800">
                Galgotias College of Engineering
                <br />
                and Technology
              </p>
            </section>
          </div>

          {/* Orange footer */}
          <footer className="flex items-center justify-center bg-orange-500 py-5">
            <span className="text-2xl font-extrabold tracking-[0.2em] text-white">
              VISITOR
            </span>
          </footer>
        </article>
      </div>
    </main>
  );
}
