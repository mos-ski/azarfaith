import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Search,
  ShieldCheck,
  Repeat2,
  Target,
  MapPin,
  Flame,
  Globe,
  Church,
  Baby,
  GraduationCap,
  Users,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { useApp } from "@/lib/store";
import { formatMoney, categories } from "@/lib/mock";

export const Route = createFileRoute("/discover")({
  component: AzarFaithDiscover,
});

const orgCategoryIcon: Record<string, React.ReactNode> = {
  church: <Church className="w-4 h-4" />,
  mission: <Globe className="w-4 h-4" />,
  orphanage: <Baby className="w-4 h-4" />,
  school: <GraduationCap className="w-4 h-4" />,
  other: <Users className="w-4 h-4" />,
};

const orgCategoryLabel: Record<string, string> = {
  church: "Church",
  mission: "Mission",
  orphanage: "Orphanage",
  school: "School",
  other: "Ministry",
};

type Tab = "all" | "ongoing" | "one-time" | "orgs";

function AzarFaithDiscover() {
  const { campaigns, orgs } = useApp();
  const [tab, setTab] = useState<Tab>("all");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  const filteredCampaigns = campaigns.filter((c) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      c.title.toLowerCase().includes(q) ||
      c.story.toLowerCase().includes(q) ||
      c.location.toLowerCase().includes(q);
    const matchesTab = tab === "all" || tab === c.mode;
    const matchesCategory = !categoryFilter || c.faithCategory === categoryFilter;
    return matchesSearch && matchesTab && matchesCategory;
  });

  const filteredOrgs = orgs.filter((o) => {
    const q = search.toLowerCase();
    return (
      !q ||
      o.name.toLowerCase().includes(q) ||
      o.location.toLowerCase().includes(q) ||
      o.denomination.toLowerCase().includes(q)
    );
  });

  const tabs: { v: Tab; label: string; count: number }[] = [
    { v: "all", label: "All campaigns", count: campaigns.length },
    { v: "ongoing", label: "Ongoing", count: campaigns.filter((c) => c.mode === "ongoing").length },
    {
      v: "one-time",
      label: "One-time",
      count: campaigns.filter((c) => c.mode === "one-time").length,
    },
    { v: "orgs", label: "Organizations", count: orgs.length },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="mx-auto max-w-6xl px-5 md:px-8 py-10">
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl">Discover AzarFaith causes</h1>
          <p className="text-muted-foreground mt-2">
            Find missionaries, churches, orphanages, and schools to support.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            placeholder="Search campaigns, orgs, or locations…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-1">
          {tabs.map(({ v, label, count }) => (
            <button
              key={v}
              onClick={() => setTab(v)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${tab === v ? "bg-amber-500 text-white" : "bg-muted text-muted-foreground hover:text-foreground"}`}
            >
              {label}
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full ${tab === v ? "bg-amber-600 text-white" : "bg-background text-muted-foreground"}`}
              >
                {count}
              </span>
            </button>
          ))}
        </div>

        {/* Category filter (only for campaigns tabs) */}
        {tab !== "orgs" && (
          <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-1">
            <button
              onClick={() => setCategoryFilter(null)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${!categoryFilter ? "bg-amber-100 text-amber-700" : "bg-muted text-muted-foreground hover:text-foreground"}`}
            >
              All categories
            </button>
            {categories.map(({ label, icon }) => (
              <button
                key={label}
                onClick={() => setCategoryFilter(categoryFilter === label ? null : label)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${categoryFilter === label ? "bg-amber-100 text-amber-700" : "bg-muted text-muted-foreground hover:text-foreground"}`}
              >
                <span>{icon}</span> {label}
              </button>
            ))}
          </div>
        )}

        {/* Campaigns grid */}
        {tab !== "orgs" && (
          <>
            {filteredCampaigns.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <p className="font-medium">No campaigns found</p>
                <p className="text-sm mt-1">Try a different search or category</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredCampaigns.map((c) => {
                  const pct = c.goal ? Math.min(100, Math.round((c.raised / c.goal) * 100)) : null;
                  return (
                    <Link
                      key={c.id}
                      to="/campaign/$id"
                      params={{ id: c.id }}
                      className="group block"
                    >
                      <article className="bg-card border border-border rounded-3xl overflow-hidden hover:border-amber-200 hover:shadow-md transition-all h-full flex flex-col">
                        <div className="relative aspect-[16/10] overflow-hidden">
                          <img
                            src={c.cover}
                            alt=""
                            className="w-full h-full object-cover group-hover:scale-[1.02] transition duration-500"
                          />
                          <div className="absolute top-3 left-3 flex gap-1.5">
                            <span
                              className={`inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full ${c.mode === "ongoing" ? "bg-amber-100 text-amber-700" : "bg-card/90 text-foreground border border-border"}`}
                            >
                              {c.mode === "ongoing" ? (
                                <>
                                  <Repeat2 className="w-3 h-3" /> Ongoing
                                </>
                              ) : (
                                <>
                                  <Target className="w-3 h-3" /> One-time
                                </>
                              )}
                            </span>
                            {c.verificationStatus === "verified" && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full bg-trust text-trust-foreground">
                                <ShieldCheck className="w-3 h-3" /> Verified
                              </span>
                            )}
                            {c.urgency === "critical" && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full bg-urgent text-urgent-foreground">
                                <Flame className="w-3 h-3" /> Urgent
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="p-4 flex flex-col flex-1">
                          <p className="text-xs text-amber-600 font-medium mb-1">
                            {c.faithCategory}
                          </p>
                          <h3 className="font-display text-[16px] leading-snug line-clamp-2 flex-1">
                            {c.title}
                          </h3>
                          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                            <img
                              src={c.raiser.avatar}
                              alt=""
                              className="w-4 h-4 rounded-full object-cover"
                            />
                            <span className="truncate">{c.raiser.name}</span>
                            <span>·</span>
                            <MapPin className="w-3 h-3" />
                            <span className="truncate">{c.location}</span>
                          </div>
                          <div className="mt-3">
                            {pct !== null ? (
                              <>
                                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                                  <div
                                    className="h-full bg-amber-500 rounded-full"
                                    style={{ width: `${pct}%` }}
                                  />
                                </div>
                                <div className="mt-1.5 flex items-baseline justify-between text-xs">
                                  <span className="font-display text-sm">
                                    {formatMoney(c.raised)}
                                  </span>
                                  <span className="text-muted-foreground">
                                    {pct}% · {c.donors} donors
                                  </span>
                                </div>
                              </>
                            ) : (
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">
                                  {c.donors.toLocaleString()} supporters
                                </span>
                                {c.frequencies && (
                                  <span className="text-amber-600 font-medium">
                                    {c.frequencies.slice(0, 2).join(" · ")}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </article>
                    </Link>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Orgs grid */}
        {tab === "orgs" && (
          <>
            {filteredOrgs.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <p className="font-medium">No organizations found</p>
                <p className="text-sm mt-1">Try a different search</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredOrgs.map((org) => (
                  <Link key={org.id} to="/org/$id" params={{ id: org.id }} className="group block">
                    <article className="bg-card border border-border rounded-3xl overflow-hidden hover:border-amber-200 hover:shadow-md transition-all">
                      <div className="aspect-[16/9] overflow-hidden">
                        <img
                          src={
                            org.photos[0] ??
                            "https://images.unsplash.com/photo-1532635241-17e820acc59f?auto=format&fit=crop&w=1200&q=80"
                          }
                          alt=""
                          className="w-full h-full object-cover group-hover:scale-[1.02] transition duration-500"
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">
                            {orgCategoryIcon[org.category]} {orgCategoryLabel[org.category]}
                          </span>
                          {org.verificationStatus === "verified" && (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-trust">
                              <ShieldCheck className="w-3.5 h-3.5" /> Verified
                            </span>
                          )}
                        </div>
                        <h3 className="font-display text-lg leading-snug">{org.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {org.tagline}
                        </p>
                        <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                          <MapPin className="w-3 h-3" /> {org.location}
                        </div>
                        <div className="mt-3 flex items-center gap-4 text-xs">
                          <span>
                            <span className="font-semibold text-foreground">
                              {formatMoney(org.totalReceived)}
                            </span>{" "}
                            <span className="text-muted-foreground">received</span>
                          </span>
                          <span>
                            <span className="font-semibold text-foreground">
                              {org.supporters.toLocaleString()}
                            </span>{" "}
                            <span className="text-muted-foreground">supporters</span>
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
