import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import {
  ShieldCheck,
  MapPin,
  Repeat2,
  Target,
  ArrowRight,
  Flame,
  MessageSquare,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { useApp } from "@/lib/store";
import { formatMoney } from "@/lib/mock";

export const Route = createFileRoute("/campaign/$id")({
  component: Campaign,
});

function Campaign() {
  const { id } = Route.useParams();
  const { campaigns, orgs } = useApp();
  const [showAllUpdates, setShowAllUpdates] = useState(false);
  const [selectedFreq, setSelectedFreq] = useState<string | null>(null);

  const campaign = campaigns.find((c) => c.id === id);
  if (!campaign) throw notFound();

  const org = campaign.orgId ? orgs.find((o) => o.id === campaign.orgId) : null;
  const pct = campaign.goal
    ? Math.min(100, Math.round((campaign.raised / campaign.goal) * 100))
    : null;
  const isOngoing = campaign.mode === "ongoing";
  const visibleUpdates = showAllUpdates ? campaign.updates : campaign.updates.slice(0, 1);

  const frequencyLabel: Record<string, string> = {
    weekly: "Give weekly",
    monthly: "Give monthly",
    quarterly: "Give quarterly",
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="mx-auto max-w-3xl px-5 md:px-8 py-8 space-y-8">
        {/* Cover */}
        <div className="relative rounded-3xl overflow-hidden aspect-[16/9]">
          <img src={campaign.cover} alt="" className="w-full h-full object-cover" />
          <div className="absolute top-4 left-4 flex gap-2">
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full ${isOngoing ? "bg-amber-100 text-amber-800" : "bg-card/90 text-foreground border border-border/60"}`}
            >
              {isOngoing ? (
                <>
                  <Repeat2 className="w-3.5 h-3.5" /> Ongoing
                </>
              ) : (
                <>
                  <Target className="w-3.5 h-3.5" /> One-time
                </>
              )}
            </span>
            {campaign.verificationStatus === "verified" && (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-trust text-trust-foreground">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified
              </span>
            )}
            {campaign.urgency === "critical" && (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-urgent text-urgent-foreground">
                <Flame className="w-3.5 h-3.5" /> Urgent
              </span>
            )}
          </div>
        </div>

        {/* Title + meta */}
        <div>
          <p className="text-xs font-medium text-amber-600 mb-1">{campaign.faithCategory}</p>
          <h1 className="font-display text-2xl md:text-3xl leading-tight">{campaign.title}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <img
                src={campaign.raiser.avatar}
                alt=""
                className="w-5 h-5 rounded-full object-cover"
              />
              <span>{campaign.raiser.name}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> {campaign.location}
            </div>
          </div>
          {org && (
            <Link
              to="/org/$id"
              params={{ id: org.id }}
              className="mt-3 inline-flex items-center gap-2 text-sm text-amber-600 hover:text-amber-700 transition"
            >
              Part of {org.name} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {/* Give widget */}
        <div className="bg-card border border-border rounded-3xl p-6">
          {isOngoing ? (
            <div>
              <h2 className="font-display text-lg mb-1">Support this ministry</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Choose how you'd like to give. You can change or cancel anytime.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {(campaign.frequencies ?? ["monthly"]).map((freq) => (
                  <button
                    key={freq}
                    onClick={() => setSelectedFreq(freq)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition ${selectedFreq === freq ? "bg-amber-500 text-white" : "border border-border hover:border-amber-300"}`}
                  >
                    {frequencyLabel[freq]}
                  </button>
                ))}
                <button
                  onClick={() => setSelectedFreq("once")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${selectedFreq === "once" ? "bg-amber-500 text-white" : "border border-border hover:border-amber-300"}`}
                >
                  Give once
                </button>
              </div>
              <Link
                to="/donate/$id"
                params={{ id: campaign.id }}
                search={{ freq: selectedFreq ?? "" }}
                className="block w-full py-3.5 rounded-2xl bg-amber-500 text-white font-semibold text-center hover:bg-amber-600 transition"
              >
                {selectedFreq
                  ? `${frequencyLabel[selectedFreq] ?? "Give once"} →`
                  : "Choose a frequency above"}
              </Link>
              <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                <span>{campaign.donors.toLocaleString()} supporters</span>
                <span>·</span>
                <span>{formatMoney(campaign.raised)} raised total</span>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-baseline justify-between mb-2">
                <span className="font-display text-2xl">{formatMoney(campaign.raised)}</span>
                <span className="text-sm text-muted-foreground">
                  of {formatMoney(campaign.goal ?? 0)}
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden mb-2">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all"
                  style={{ width: `${pct ?? 0}%` }}
                />
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-5">
                <span>{pct}% funded</span>
                <span>·</span>
                <span>{campaign.donors.toLocaleString()} donors</span>
              </div>
              <Link
                to="/donate/$id"
                params={{ id: campaign.id }}
                search={{ freq: "once" }}
                className="block w-full py-3.5 rounded-2xl bg-amber-500 text-white font-semibold text-center hover:bg-amber-600 transition"
              >
                Donate now
              </Link>
            </div>
          )}
        </div>

        {/* Story */}
        <section>
          <h2 className="font-display text-xl mb-3">The story</h2>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
            {campaign.story}
          </p>
        </section>

        {/* Gallery */}
        {campaign.gallery.length > 1 && (
          <section>
            <h2 className="font-display text-xl mb-4">Photos</h2>
            <div className="grid grid-cols-3 gap-3">
              {campaign.gallery.map((img, i) => (
                <div key={i} className="aspect-square rounded-2xl overflow-hidden">
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover hover:scale-105 transition duration-300"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Updates */}
        {campaign.updates.length > 0 && (
          <section>
            <h2 className="font-display text-xl mb-4">
              Updates{" "}
              <span className="text-muted-foreground text-base font-normal">
                ({campaign.updates.length})
              </span>
            </h2>
            <div className="space-y-4">
              {visibleUpdates.map((u) => (
                <div key={u.id} className="bg-card border border-border rounded-2xl p-5">
                  <div className="text-xs text-muted-foreground mb-1">{u.date}</div>
                  <h3 className="font-semibold text-sm">{u.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{u.body}</p>
                </div>
              ))}
            </div>
            {campaign.updates.length > 1 && (
              <button
                onClick={() => setShowAllUpdates(!showAllUpdates)}
                className="mt-3 flex items-center gap-1.5 text-sm text-amber-600 hover:text-amber-700 transition"
              >
                {showAllUpdates ? (
                  <>
                    <ChevronUp className="w-4 h-4" /> Show less
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" /> Show all {campaign.updates.length} updates
                  </>
                )}
              </button>
            )}
          </section>
        )}

        {/* Comments */}
        {campaign.comments.length > 0 && (
          <section>
            <h2 className="font-display text-xl mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-amber-500" />
              Comments{" "}
              <span className="text-muted-foreground text-base font-normal">
                ({campaign.comments.length})
              </span>
            </h2>
            <div className="space-y-4">
              {campaign.comments.map((c) => (
                <div key={c.id} className="flex gap-3">
                  <img
                    src={c.avatar}
                    alt=""
                    className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5"
                  />
                  <div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-medium">{c.author}</span>
                      <span className="text-muted-foreground">{c.date}</span>
                    </div>
                    <p className="text-sm mt-1 text-muted-foreground">{c.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Recent donors */}
        {campaign.donations.length > 0 && (
          <section>
            <h2 className="font-display text-xl mb-4">Recent giving</h2>
            <div className="space-y-3">
              {campaign.donations.slice(0, 5).map((d) => (
                <div key={d.id} className="flex items-center justify-between text-sm">
                  <div>
                    <span className="font-medium">{d.donor}</span>
                    {d.note && <span className="text-muted-foreground"> · "{d.note}"</span>}
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <span>{formatMoney(d.amount)}</span>
                    <span className="text-xs">{d.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
