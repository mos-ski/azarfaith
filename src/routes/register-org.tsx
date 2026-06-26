import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { useApp } from "@/lib/store";
import { toast } from "sonner";
import { Check, Church, Globe, Baby, GraduationCap, Users, ImagePlus } from "lucide-react";
import type { Org } from "@/lib/mock";

export const Route = createFileRoute("/register-org")({
  component: RegisterOrg,
});

const orgCategories = [
  { v: "church", icon: Church, label: "Church", desc: "Local congregation or church plant" },
  { v: "mission", icon: Globe, label: "Mission / Outreach", desc: "Missionaries or evangelism ministry" },
  { v: "orphanage", icon: Baby, label: "Orphanage", desc: "Faith-based care for children" },
  { v: "school", icon: GraduationCap, label: "School", desc: "Faith-based educational institution" },
  { v: "other", icon: Users, label: "Other ministry", desc: "Any other Christian ministry" },
] as const;

function RegisterOrg() {
  const nav = useNavigate();
  const { orgDraft, setOrgDraft, resetOrgDraft, addOrg } = useApp();
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const steps = ["Details", "Mission", "Media", "Preview"];

  const validate = () => {
    const e: Record<string, string> = {};
    if (step === 0) {
      if (!orgDraft.name?.trim()) e.name = "Org name is required";
      if (!orgDraft.category) e.category = "Select a category";
      if (!orgDraft.denomination?.trim()) e.denomination = "Denomination or tradition is required";
      if (!orgDraft.location?.trim()) e.location = "Location is required";
    }
    if (step === 1) {
      if (!orgDraft.tagline?.trim() || orgDraft.tagline.length < 10) e.tagline = "Add a short tagline (at least 10 characters)";
      if (!orgDraft.bio?.trim() || orgDraft.bio.length < 60) e.bio = "Tell us more about your org (at least 60 characters)";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (!validate()) return;
    setStep((s) => s + 1);
  };

  const submit = () => {
    setSubmitting(true);
    setTimeout(() => {
      const org: Org = {
        id: `o${Math.random().toString(36).slice(2)}`,
        name: orgDraft.name!,
        tagline: orgDraft.tagline!,
        category: orgDraft.category!,
        denomination: orgDraft.denomination!,
        location: orgDraft.location!,
        founded: orgDraft.founded ?? "2020",
        bio: orgDraft.bio!,
        photos: orgDraft.photos ?? [],
        videos: orgDraft.videos ?? [],
        campaignIds: [],
        verificationStatus: "unverified",
        totalReceived: 0,
        supporters: 0,
      };
      addOrg(org);
      resetOrgDraft();
      toast("Your org is live on AzarFaith");
      nav({ to: "/org/$id", params: { id: org.id } });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-xl px-5 py-10">
        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8">
          {steps.map((label, i) => (
            <div key={label} className="flex items-center gap-2 flex-1 last:flex-none">
              <div className={`w-7 h-7 rounded-full text-xs font-semibold grid place-items-center shrink-0 ${i < step ? "bg-amber-500 text-white" : i === step ? "bg-amber-500 text-white" : "bg-muted text-muted-foreground"}`}>
                {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
              </div>
              <span className={`text-xs hidden sm:block ${i === step ? "text-foreground font-medium" : "text-muted-foreground"}`}>{label}</span>
              {i < steps.length - 1 && <div className={`h-px flex-1 ${i < step ? "bg-amber-400" : "bg-border"}`} />}
            </div>
          ))}
        </div>

        {/* Step 0: Basic details */}
        {step === 0 && (
          <div className="space-y-5">
            <div>
              <h1 className="font-display text-2xl">Tell us about your org</h1>
              <p className="text-muted-foreground text-sm mt-1">Basic information donors will see on your profile.</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Organisation name</label>
              <input
                className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-background"
                placeholder="e.g. ECWA Mission Board, Grace Harvest Orphanage"
                value={orgDraft.name ?? ""}
                onChange={(e) => setOrgDraft({ name: e.target.value })}
              />
              {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <div className="grid grid-cols-1 gap-2">
                {orgCategories.map(({ v, icon: Icon, label, desc }) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setOrgDraft({ category: v })}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition ${orgDraft.category === v ? "border-amber-400 bg-amber-50" : "border-border hover:border-amber-200"}`}
                  >
                    <div className={`w-9 h-9 rounded-lg grid place-items-center shrink-0 ${orgDraft.category === v ? "bg-amber-100" : "bg-muted"}`}>
                      <Icon className={`w-4.5 h-4.5 ${orgDraft.category === v ? "text-amber-600" : "text-muted-foreground"}`} />
                    </div>
                    <div>
                      <div className="text-sm font-medium">{label}</div>
                      <div className="text-xs text-muted-foreground">{desc}</div>
                    </div>
                    {orgDraft.category === v && <Check className="w-4 h-4 text-amber-600 ml-auto" />}
                  </button>
                ))}
              </div>
              {errors.category && <p className="text-xs text-destructive mt-1">{errors.category}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Denomination / tradition</label>
                <input
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-background"
                  placeholder="e.g. ECWA, Baptist, Pentecostal"
                  value={orgDraft.denomination ?? ""}
                  onChange={(e) => setOrgDraft({ denomination: e.target.value })}
                />
                {errors.denomination && <p className="text-xs text-destructive mt-1">{errors.denomination}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Year founded</label>
                <input
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-background"
                  placeholder="e.g. 2008"
                  value={orgDraft.founded ?? ""}
                  onChange={(e) => setOrgDraft({ founded: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Location</label>
              <input
                className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-background"
                placeholder="e.g. Lagos, Nigeria"
                value={orgDraft.location ?? ""}
                onChange={(e) => setOrgDraft({ location: e.target.value })}
              />
              {errors.location && <p className="text-xs text-destructive mt-1">{errors.location}</p>}
            </div>
          </div>
        )}

        {/* Step 1: Mission / bio */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <h1 className="font-display text-2xl">Your mission</h1>
              <p className="text-muted-foreground text-sm mt-1">Help donors understand who you are and what you do.</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Tagline <span className="text-muted-foreground font-normal">(one sentence)</span></label>
              <input
                className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-background"
                placeholder="e.g. Every Sunday, under the bridge, for the forgotten"
                value={orgDraft.tagline ?? ""}
                onChange={(e) => setOrgDraft({ tagline: e.target.value })}
              />
              {errors.tagline && <p className="text-xs text-destructive mt-1">{errors.tagline}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">About your org</label>
              <textarea
                rows={6}
                className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-background resize-none"
                placeholder="Tell donors who you are, what you do, who you serve, and why it matters. Be specific — share real stories, numbers, and impact."
                value={orgDraft.bio ?? ""}
                onChange={(e) => setOrgDraft({ bio: e.target.value })}
              />
              <div className="flex items-center justify-between mt-1">
                {errors.bio ? <p className="text-xs text-destructive">{errors.bio}</p> : <span />}
                <span className="text-xs text-muted-foreground">{orgDraft.bio?.length ?? 0} chars</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Media */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h1 className="font-display text-2xl">Add photos &amp; videos</h1>
              <p className="text-muted-foreground text-sm mt-1">Show donors the work. This is the most convincing thing you can do.</p>
            </div>
            <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center">
              <ImagePlus className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm font-medium">Upload photos of your work</p>
              <p className="text-xs text-muted-foreground mt-1">Buildings, team, community, events — real photos build trust</p>
              <button
                type="button"
                onClick={() => toast("Photo upload coming soon")}
                className="mt-4 px-5 py-2.5 rounded-full border border-border text-sm font-medium hover:bg-muted transition"
              >
                Choose photos
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">YouTube or Vimeo links <span className="text-muted-foreground font-normal">(optional)</span></label>
              <input
                className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-background"
                placeholder="https://youtube.com/watch?v=..."
                onBlur={(e) => {
                  if (e.target.value.trim()) {
                    setOrgDraft({ videos: [...(orgDraft.videos ?? []), e.target.value.trim()] });
                    e.target.value = "";
                  }
                }}
              />
              <p className="text-xs text-muted-foreground mt-1">Paste a link and press Tab or click away to add it</p>
              {(orgDraft.videos ?? []).length > 0 && (
                <div className="mt-2 space-y-1">
                  {(orgDraft.videos ?? []).map((v, i) => (
                    <div key={i} className="text-xs text-muted-foreground truncate bg-muted rounded-lg px-3 py-2">{v}</div>
                  ))}
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">You can always add more photos and videos after registration from your org profile.</p>
          </div>
        )}

        {/* Step 3: Preview */}
        {step === 3 && (
          <div className="space-y-5">
            <div>
              <h1 className="font-display text-2xl">Review before publishing</h1>
              <p className="text-muted-foreground text-sm mt-1">Your org goes live immediately. You can edit everything later.</p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-5 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="font-display text-xl">{orgDraft.name}</span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">{orgDraft.category}</span>
              </div>
              <p className="text-muted-foreground italic">{orgDraft.tagline}</p>
              <div className="text-xs text-muted-foreground flex items-center gap-3">
                <span>{orgDraft.denomination}</span>
                <span>·</span>
                <span>{orgDraft.location}</span>
                {orgDraft.founded && <><span>·</span><span>Est. {orgDraft.founded}</span></>}
              </div>
              <p className="text-sm leading-relaxed">{orgDraft.bio}</p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-800">
              Your profile will go live immediately with an <strong>unverified</strong> badge. To get verified, our team will reach out within 5 business days.
            </div>
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
          {step < steps.length - 1 ? (
            <button onClick={next} className="px-7 py-3 rounded-full bg-amber-500 text-white font-semibold text-sm hover:bg-amber-600 transition">
              Continue
            </button>
          ) : (
            <button
              onClick={submit}
              disabled={submitting}
              className="px-7 py-3 rounded-full bg-amber-500 text-white font-semibold text-sm hover:bg-amber-600 transition disabled:opacity-60"
            >
              {submitting ? "Publishing…" : "Publish org profile"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
