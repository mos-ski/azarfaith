import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { useApp } from "@/lib/store";
import { categories, type Campaign } from "@/lib/mock";
import { toast } from "sonner";
import {
  Target,
  Repeat2,
  Banknote,
  Gift,
  Users,
  Briefcase,
  Siren,
  Check,
  ImagePlus,
  Flame,
} from "lucide-react";

export const Route = createFileRoute("/create")({
  component: AzarFaithCreate,
});

const campaignTypes = [
  { v: "money", icon: Banknote, label: "Raise funds", desc: "Money for a specific need or ongoing ministry" },
  { v: "item", icon: Gift, label: "Request items", desc: "Beds, bibles, equipment, school materials…" },
  { v: "volunteer", icon: Users, label: "Find volunteers", desc: "Hands to help, teachers, builders, drivers…" },
  { v: "professional", icon: Briefcase, label: "Professional help", desc: "Lawyers, accountants, engineers, doctors…" },
  { v: "emergency", icon: Siren, label: "Emergency", desc: "Urgent crisis needing immediate response" },
] as const;

const urgencyOptions = [
  { v: "low", label: "Low", desc: "No rush — we'll get there" },
  { v: "medium", label: "Medium", desc: "Active need, not critical" },
  { v: "high", label: "High", desc: "We need this soon" },
  { v: "critical", label: "Critical", desc: "Emergency — act now" },
] as const;

const frequencyOptions = [
  { v: "weekly", label: "Weekly" },
  { v: "monthly", label: "Monthly" },
  { v: "quarterly", label: "Quarterly" },
] as const;

function AzarFaithCreate() {
  const nav = useNavigate();
  const { draft, setDraft, resetDraft, addCampaign, orgs } = useApp();
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [publishing, setPublishing] = useState(false);

  const isOngoing = draft.mode === "ongoing";
  const stepLabels = isOngoing
    ? ["Mode", "Type", "Story", "Details", "Support", "Preview"]
    : ["Mode", "Type", "Story", "Details", "Preview"];

  const validate = () => {
    const e: Record<string, string> = {};
    if (step === 0 && !draft.mode) e.mode = "Choose a campaign mode";
    if (step === 1 && !draft.type) e.type = "Choose a type";
    if (step === 2) {
      if (!draft.title?.trim() || draft.title.length < 8) e.title = "Title must be at least 8 characters";
      if (!draft.story?.trim() || draft.story.length < 30) e.story = "Story must be at least 30 characters";
    }
    if (step === 3) {
      if (!draft.faithCategory) e.faithCategory = "Select a category";
      if (!draft.location?.trim()) e.location = "Location is required";
      if (!isOngoing && draft.type === "money" && (!draft.goal || draft.goal < 1000)) e.goal = "Goal must be at least ₦1,000";
    }
    if (step === 4 && isOngoing) {
      if (!draft.frequencies?.length) e.frequencies = "Select at least one giving frequency";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (!validate()) return;
    setStep((s) => s + 1);
  };

  const publish = () => {
    setPublishing(true);
    setTimeout(() => {
      const campaign: Campaign = {
        id: `gfc${Math.random().toString(36).slice(2)}`,
        mode: draft.mode!,
        type: draft.type!,
        title: draft.title!,
        story: draft.story!,
        faithCategory: draft.faithCategory!,
        orgId: draft.orgId,
        raiser: { name: "Tunde Adebayo", avatar: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=200&q=80", location: draft.location!, trustScore: 86 },
        cover: draft.cover ?? "https://images.unsplash.com/photo-1532635241-17e820acc59f?auto=format&fit=crop&w=1200&q=80",
        gallery: [],
        goal: isOngoing ? undefined : draft.goal,
        raised: 0,
        donors: 0,
        currency: "NGN",
        location: draft.location!,
        urgency: draft.urgency ?? "medium",
        createdAt: new Date().toISOString().split("T")[0],
        verificationStatus: "unverified",
        updates: [],
        comments: [],
        donations: [],
        needs: draft.needs,
        frequencies: isOngoing ? (draft.frequencies ?? ["monthly"]) : undefined,
      };
      addCampaign(campaign);
      resetDraft();
      toast("Campaign is live on AzarFaith");
      nav({ to: "/campaign/$id", params: { id: campaign.id } });
    }, 900);
  };

  const totalSteps = stepLabels.length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-xl px-5 py-10">
        {/* Steps */}
        <div className="flex items-center gap-2 mb-8">
          {stepLabels.map((label, i) => (
            <div key={label} className="flex items-center gap-2 flex-1 last:flex-none">
              <div className={`w-7 h-7 rounded-full text-xs font-semibold grid place-items-center shrink-0 ${i < step ? "bg-amber-500 text-white" : i === step ? "bg-amber-500 text-white" : "bg-muted text-muted-foreground"}`}>
                {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
              </div>
              <span className={`text-xs hidden sm:block ${i === step ? "text-foreground font-medium" : "text-muted-foreground"}`}>{label}</span>
              {i < totalSteps - 1 && <div className={`h-px flex-1 ${i < step ? "bg-amber-400" : "bg-border"}`} />}
            </div>
          ))}
        </div>

        {/* Step 0: Mode */}
        {step === 0 && (
          <div className="space-y-5">
            <div>
              <h1 className="font-display text-2xl">What kind of campaign?</h1>
              <p className="text-muted-foreground text-sm mt-1">Choose based on what your cause actually needs.</p>
            </div>
            <div className="grid gap-3">
              <button
                type="button"
                onClick={() => setDraft({ mode: "one-time" })}
                className={`flex items-start gap-4 p-5 rounded-2xl border text-left transition ${draft.mode === "one-time" ? "border-amber-400 bg-amber-50" : "border-border hover:border-amber-200"}`}
              >
                <div className={`w-10 h-10 rounded-xl grid place-items-center shrink-0 mt-0.5 ${draft.mode === "one-time" ? "bg-amber-200" : "bg-muted"}`}>
                  <Target className={`w-5 h-5 ${draft.mode === "one-time" ? "text-amber-700" : "text-muted-foreground"}`} />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-sm flex items-center justify-between">
                    One-time campaign
                    {draft.mode === "one-time" && <Check className="w-4 h-4 text-amber-600" />}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">You have a specific target and a need to close. Building a hall, buying equipment, emergency relief, items needed.</p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setDraft({ mode: "ongoing" })}
                className={`flex items-start gap-4 p-5 rounded-2xl border text-left transition ${draft.mode === "ongoing" ? "border-amber-400 bg-amber-50" : "border-border hover:border-amber-200"}`}
              >
                <div className={`w-10 h-10 rounded-xl grid place-items-center shrink-0 mt-0.5 ${draft.mode === "ongoing" ? "bg-amber-200" : "bg-muted"}`}>
                  <Repeat2 className={`w-5 h-5 ${draft.mode === "ongoing" ? "text-amber-700" : "text-muted-foreground"}`} />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-sm flex items-center justify-between">
                    Ongoing support
                    {draft.mode === "ongoing" && <Check className="w-4 h-4 text-amber-600" />}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">No specific target. Your ministry is continuous — you just need a faithful community giving weekly, monthly, or quarterly.</p>
                </div>
              </button>
            </div>
            {errors.mode && <p className="text-xs text-destructive">{errors.mode}</p>}
          </div>
        )}

        {/* Step 1: Type */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <h1 className="font-display text-2xl">What are you asking for?</h1>
              <p className="text-muted-foreground text-sm mt-1">Even ongoing ministries can request more than just money.</p>
            </div>
            <div className="space-y-2">
              {campaignTypes.map(({ v, icon: Icon, label, desc }) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setDraft({ type: v })}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-xl border text-left transition ${draft.type === v ? "border-amber-400 bg-amber-50" : "border-border hover:border-amber-200"}`}
                >
                  <div className={`w-9 h-9 rounded-lg grid place-items-center shrink-0 ${draft.type === v ? "bg-amber-100" : "bg-muted"}`}>
                    <Icon className={`w-4.5 h-4.5 ${draft.type === v ? "text-amber-600" : "text-muted-foreground"}`} />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{label}</div>
                    <div className="text-xs text-muted-foreground">{desc}</div>
                  </div>
                  {draft.type === v && <Check className="w-4 h-4 text-amber-600" />}
                </button>
              ))}
            </div>
            {errors.type && <p className="text-xs text-destructive">{errors.type}</p>}
          </div>
        )}

        {/* Step 2: Story */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h1 className="font-display text-2xl">Tell your story</h1>
              <p className="text-muted-foreground text-sm mt-1">Be specific. Real details build trust.</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Campaign title</label>
              <input
                className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-background"
                placeholder={isOngoing ? "e.g. Support ECWA Missionaries in Borno" : "e.g. Build a church hall for ECWA Kano"}
                value={draft.title ?? ""}
                onChange={(e) => setDraft({ title: e.target.value })}
              />
              {errors.title && <p className="text-xs text-destructive mt-1">{errors.title}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">
                {isOngoing ? "Describe your ministry" : "What's the need?"}
              </label>
              <textarea
                rows={6}
                className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-background resize-none"
                placeholder={
                  isOngoing
                    ? "Tell donors about your ministry — who you serve, what you do, why it matters. Share real stories and impact."
                    : "Explain the specific need. Include amounts, why they're needed, and how donations will be used."
                }
                value={draft.story ?? ""}
                onChange={(e) => setDraft({ story: e.target.value })}
              />
              <div className="flex items-center justify-between mt-1">
                {errors.story ? <p className="text-xs text-destructive">{errors.story}</p> : <span />}
                <span className="text-xs text-muted-foreground">{draft.story?.length ?? 0} chars</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Cover image <span className="text-muted-foreground font-normal">(optional)</span></label>
              <button
                type="button"
                onClick={() => toast("Image upload coming soon")}
                className="w-full border-2 border-dashed border-border rounded-2xl py-8 text-center hover:border-amber-300 transition"
              >
                <ImagePlus className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm font-medium">Add a cover photo</p>
                <p className="text-xs text-muted-foreground mt-0.5">A real photo of your work makes a huge difference</p>
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Details */}
        {step === 3 && (
          <div className="space-y-5">
            <div>
              <h1 className="font-display text-2xl">Campaign details</h1>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Faith category</label>
              <div className="grid grid-cols-2 gap-2">
                {categories.map(({ label, icon }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setDraft({ faithCategory: label })}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-left text-sm transition ${draft.faithCategory === label ? "border-amber-400 bg-amber-50 text-amber-800" : "border-border hover:border-amber-200"}`}
                  >
                    <span>{icon}</span> {label}
                  </button>
                ))}
              </div>
              {errors.faithCategory && <p className="text-xs text-destructive mt-1">{errors.faithCategory}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Location</label>
              <input
                className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-background"
                placeholder="e.g. Kano, Nigeria"
                value={draft.location ?? ""}
                onChange={(e) => setDraft({ location: e.target.value })}
              />
              {errors.location && <p className="text-xs text-destructive mt-1">{errors.location}</p>}
            </div>
            {!isOngoing && draft.type === "money" && (
              <div>
                <label className="block text-sm font-medium mb-1.5">Fundraising goal (₦)</label>
                <input
                  type="number"
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-background"
                  placeholder="e.g. 8500000"
                  value={draft.goal ?? ""}
                  onChange={(e) => setDraft({ goal: parseInt(e.target.value) || 0 })}
                />
                {errors.goal && <p className="text-xs text-destructive mt-1">{errors.goal}</p>}
              </div>
            )}
            {!isOngoing && (
              <div>
                <label className="block text-sm font-medium mb-2">Urgency</label>
                <div className="grid grid-cols-2 gap-2">
                  {urgencyOptions.map(({ v, label, desc }) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setDraft({ urgency: v })}
                      className={`flex flex-col p-3 rounded-xl border text-left transition ${draft.urgency === v ? "border-amber-400 bg-amber-50" : "border-border hover:border-amber-200"}`}
                    >
                      <span className="text-sm font-medium">{label}</span>
                      <span className="text-xs text-muted-foreground mt-0.5">{desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-1.5">Link to an org <span className="text-muted-foreground font-normal">(optional)</span></label>
              <select
                className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-background"
                value={draft.orgId ?? ""}
                onChange={(e) => setDraft({ orgId: e.target.value || undefined })}
              >
                <option value="">No org — individual campaign</option>
                {orgs.map((o) => (
                  <option key={o.id} value={o.id}>{o.name}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Step 4 (ongoing only): Support options */}
        {step === 4 && isOngoing && (
          <div className="space-y-5">
            <div>
              <h1 className="font-display text-2xl">Giving frequencies</h1>
              <p className="text-muted-foreground text-sm mt-1">Which frequencies do you want donors to be able to give at?</p>
            </div>
            <div className="space-y-3">
              {frequencyOptions.map(({ v, label }) => {
                const selected = draft.frequencies?.includes(v) ?? false;
                return (
                  <button
                    key={v}
                    type="button"
                    onClick={() => {
                      const current = draft.frequencies ?? [];
                      setDraft({
                        frequencies: selected
                          ? current.filter((f) => f !== v)
                          : [...current, v],
                      });
                    }}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border transition ${selected ? "border-amber-400 bg-amber-50" : "border-border hover:border-amber-200"}`}
                  >
                    <div className="flex items-center gap-3">
                      <Repeat2 className={`w-4 h-4 ${selected ? "text-amber-600" : "text-muted-foreground"}`} />
                      <span className="text-sm font-medium">{label}</span>
                    </div>
                    {selected && <Check className="w-4 h-4 text-amber-600" />}
                  </button>
                );
              })}
            </div>
            {errors.frequencies && <p className="text-xs text-destructive">{errors.frequencies}</p>}
            <p className="text-xs text-muted-foreground">Donors can choose their preferred frequency when they give. Selecting all three gives donors maximum flexibility.</p>
          </div>
        )}

        {/* Preview step */}
        {((isOngoing && step === 5) || (!isOngoing && step === 4)) && (
          <div className="space-y-5">
            <div>
              <h1 className="font-display text-2xl">Preview &amp; publish</h1>
              <p className="text-muted-foreground text-sm mt-1">Your campaign goes live immediately.</p>
            </div>
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="aspect-[16/9] bg-muted flex items-center justify-center">
                {draft.cover ? (
                  <img src={draft.cover} alt="" className="w-full h-full object-cover" />
                ) : (
                  <ImagePlus className="w-10 h-10 text-muted-foreground" />
                )}
              </div>
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${isOngoing ? "bg-amber-100 text-amber-700" : "bg-muted text-foreground"}`}>
                    {isOngoing ? "Ongoing" : "One-time"}
                  </span>
                  {draft.faithCategory && (
                    <span className="text-xs px-2.5 py-1 rounded-full bg-muted text-foreground">{draft.faithCategory}</span>
                  )}
                </div>
                <h2 className="font-display text-xl">{draft.title}</h2>
                <p className="text-sm text-muted-foreground line-clamp-3">{draft.story}</p>
                {!isOngoing && draft.goal && (
                  <div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full w-0" />
                    </div>
                    <div className="mt-1.5 text-sm">Goal: <span className="font-semibold">₦{draft.goal.toLocaleString()}</span></div>
                  </div>
                )}
                {isOngoing && draft.frequencies && (
                  <div className="text-xs text-muted-foreground">Give: {draft.frequencies.join(" · ")}</div>
                )}
              </div>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-800">
              Your campaign goes live with an <strong>unverified</strong> badge. You can request verification from the campaign page after publishing.
            </div>
            {draft.type === "emergency" && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-urgent/10 border border-urgent/20 text-sm">
                <Flame className="w-4 h-4 text-urgent shrink-0" />
                <span>This will be marked as an emergency campaign and shown with an urgent badge.</span>
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between">
          {step > 0 ? (
            <button onClick={() => setStep((s) => s - 1)} className="px-5 py-2.5 rounded-full border border-border text-sm font-medium hover:bg-muted transition">
              Back
            </button>
          ) : (
            <span />
          )}
          {((isOngoing && step < 5) || (!isOngoing && step < 4)) ? (
            <button onClick={next} className="px-7 py-3 rounded-full bg-amber-500 text-white font-semibold text-sm hover:bg-amber-600 transition">
              Continue
            </button>
          ) : (
            <button
              onClick={publish}
              disabled={publishing}
              className="px-7 py-3 rounded-full bg-amber-500 text-white font-semibold text-sm hover:bg-amber-600 transition disabled:opacity-60"
            >
              {publishing ? "Publishing…" : "Publish campaign"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
