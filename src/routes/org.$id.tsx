import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ShieldCheck,
  MapPin,
  Calendar,
  Repeat2,
  Target,
  ArrowRight,
  Users,
  Heart,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { useApp } from "@/lib/store";
import { formatMoney } from "@/lib/mock";

export const Route = createFileRoute("/org/$id")({
  component: OrgProfile,
});

const orgCategoryLabel: Record<string, string> = {
  church: "Church",
  mission: "Mission / Outreach",
  orphanage: "Orphanage",
  school: "Faith School",
  other: "Ministry",
};

function OrgProfile() {
  const { id } = Route.useParams();
  const { orgs, campaigns: allCampaigns } = useApp();

  const org = orgs.find((o) => o.id === id);
  if (!org) throw notFound();

  const campaigns = allCampaigns.filter((c) => org.campaignIds.includes(c.id));
  const ongoing = campaigns.filter((c) => c.mode === "ongoing");
  const oneTime = campaigns.filter((c) => c.mode === "one-time");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ─── ORG HEADER ─── */}
      <div className="relative">
        {org.photos[0] && (
          <div className="h-56 md:h-72 overflow-hidden">
            <img src={org.photos[0]} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          </div>
        )}
        <div className="mx-auto max-w-3xl px-5 md:px-8 pb-8 relative">
          <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-2 md:mt-0">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">
                  {orgCategoryLabel[org.category]}
                </span>
                {org.verificationStatus === "verified" && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-trust">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified
                  </span>
                )}
                {org.verificationStatus === "unverified" && (
                  <span className="text-xs text-muted-foreground">Unverified</span>
                )}
              </div>
              <h1 className="font-display text-3xl md:text-4xl">{org.name}</h1>
              <p className="text-muted-foreground mt-1">{org.tagline}</p>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> {org.location}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Est. {org.founded}
                </span>
                <span>{org.denomination}</span>
              </div>
            </div>
            <div className="flex gap-3">
              {ongoing.length > 0 && (
                <Link
                  to="/campaign/$id"
                  params={{ id: ongoing[0].id }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-500 text-white font-semibold text-sm hover:bg-amber-600 transition"
                >
                  <Repeat2 className="w-4 h-4" /> Give monthly
                </Link>
              )}
              {oneTime.length > 0 && (
                <Link
                  to="/campaign/$id"
                  params={{ id: oneTime[0].id }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border text-sm font-medium hover:bg-muted transition"
                >
                  Give once
                </Link>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Total received", value: formatMoney(org.totalReceived) },
              { label: "Supporters", value: org.supporters.toLocaleString() },
              { label: "Active campaigns", value: campaigns.length.toString() },
              { label: "Founded", value: org.founded },
            ].map(({ label, value }) => (
              <div key={label} className="bg-card border border-border rounded-2xl p-4 text-center">
                <div className="font-display text-xl">{value}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-5 md:px-8 pb-16 space-y-12">
        {/* About */}
        <section>
          <h2 className="font-display text-xl mb-3">About</h2>
          <p className="text-muted-foreground leading-relaxed">{org.bio}</p>
        </section>

        {/* Photo gallery */}
        {org.photos.length > 1 && (
          <section>
            <h2 className="font-display text-xl mb-4">Gallery</h2>
            <div className="grid grid-cols-3 gap-3">
              {org.photos.map((photo, i) => (
                <div key={i} className="aspect-square rounded-2xl overflow-hidden">
                  <img
                    src={photo}
                    alt=""
                    className="w-full h-full object-cover hover:scale-105 transition duration-300"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Ongoing campaigns */}
        {ongoing.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Repeat2 className="w-5 h-5 text-amber-500" />
              <h2 className="font-display text-xl">Ongoing support</h2>
            </div>
            <div className="space-y-4">
              {ongoing.map((c) => (
                <Link key={c.id} to="/campaign/$id" params={{ id: c.id }} className="group block">
                  <article className="bg-card border border-border rounded-2xl overflow-hidden hover:border-amber-300 transition flex gap-4">
                    <div className="w-28 shrink-0 overflow-hidden">
                      <img
                        src={c.cover}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    </div>
                    <div className="py-4 pr-4 flex flex-col justify-between min-h-[100px]">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">
                            Ongoing
                          </span>
                          {c.frequencies && (
                            <span className="text-xs text-muted-foreground">
                              {c.frequencies.join(" · ")}
                            </span>
                          )}
                        </div>
                        <h3 className="font-display text-base leading-snug line-clamp-2">
                          {c.title}
                        </h3>
                      </div>
                      <div className="flex items-center justify-between text-xs mt-2">
                        <span className="text-muted-foreground">{c.donors} supporters</span>
                        <span className="text-amber-600 font-medium flex items-center gap-1">
                          Give monthly <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* One-time campaigns */}
        {oneTime.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-amber-500" />
              <h2 className="font-display text-xl">Specific campaigns</h2>
            </div>
            <div className="space-y-4">
              {oneTime.map((c) => {
                const pct = c.goal ? Math.min(100, Math.round((c.raised / c.goal) * 100)) : 0;
                return (
                  <Link key={c.id} to="/campaign/$id" params={{ id: c.id }} className="group block">
                    <article className="bg-card border border-border rounded-2xl overflow-hidden hover:border-amber-300 transition flex gap-4">
                      <div className="w-28 shrink-0 overflow-hidden">
                        <img
                          src={c.cover}
                          alt=""
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                      </div>
                      <div className="py-4 pr-4 flex flex-col justify-between min-h-[100px]">
                        <h3 className="font-display text-base leading-snug line-clamp-2">
                          {c.title}
                        </h3>
                        <div>
                          <div className="h-1 rounded-full bg-muted overflow-hidden mb-1.5">
                            <div
                              className="h-full bg-amber-500 rounded-full"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-medium">{formatMoney(c.raised)}</span>
                            <span className="text-muted-foreground">
                              of {formatMoney(c.goal ?? 0)} · {pct}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* No campaigns yet */}
        {campaigns.length === 0 && (
          <div className="text-center py-12 bg-muted/30 rounded-2xl">
            <Heart className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="font-medium">No campaigns yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              This org hasn't created any campaigns yet.
            </p>
            <Link
              to="/create"
              className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 transition"
            >
              Start a campaign
            </Link>
          </div>
        )}

        {/* Share / support CTA */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
          <h3 className="font-display text-lg">Help them reach more people</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            Share this org profile with your network. Every share matters.
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
              }}
              className="px-5 py-2.5 rounded-full border border-amber-300 text-amber-700 text-sm font-medium hover:bg-amber-100 transition"
            >
              Copy link
            </button>
            {ongoing.length > 0 && (
              <Link
                to="/campaign/$id"
                params={{ id: ongoing[0].id }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 transition"
              >
                <Users className="w-4 h-4" /> Become a supporter
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
