import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Check, CreditCard, Building2, Repeat2, ChevronLeft, Info } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { useApp } from "@/lib/store";
import { formatMoney } from "@/lib/mock";
import { toast } from "sonner";
import { notFound } from "@tanstack/react-router";

export const Route = createFileRoute("/donate/$id")({
  validateSearch: (s: Record<string, unknown>) => ({
    freq: (s.freq as string) ?? "",
  }),
  component: AzarFaithDonate,
});

const presets = [2000, 5000, 10000, 25000, 50000];

const frequencyLabel: Record<string, string> = {
  weekly: "Every week",
  monthly: "Every month",
  quarterly: "Every quarter",
  once: "One time",
};

function AzarFaithDonate() {
  const { id } = Route.useParams();
  const { freq } = Route.useSearch();
  const nav = useNavigate();
  const { campaigns, donate, addRecurringDonation } = useApp();

  const campaign = campaigns.find((c) => c.id === id);
  if (!campaign) throw notFound();

  const isRecurring = freq && freq !== "once";

  const [step, setStep] = useState(0);
  const [amount, setAmount] = useState(0);
  const [customAmount, setCustomAmount] = useState("");
  const [payMethod, setPayMethod] = useState<"card" | "bank" | "wallet">("card");
  const [recurringMode, setRecurringMode] = useState<"auto" | "pledge">("auto");
  const [name, setName] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [note, setNote] = useState("");
  const [tip, setTip] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);

  const finalAmount = customAmount ? parseInt(customAmount) || 0 : amount;
  const platformFee = Math.round(finalAmount * 0.025);
  const total = finalAmount + platformFee + tip;
  const steps = isRecurring
    ? ["Amount", "How to give", "Payment", "Review"]
    : ["Amount", "Payment", "Review"];

  const next = () => {
    if (step === 0 && finalAmount < 100) {
      toast.error("Minimum donation is ₦100");
      return;
    }
    setStep((s) => s + 1);
  };

  const submit = () => {
    setProcessing(true);
    setTimeout(() => {
      donate(campaign.id, finalAmount, anonymous ? "Anonymous" : name || "You", note || undefined);
      if (isRecurring) {
        addRecurringDonation({
          id: Math.random().toString(36).slice(2),
          donorId: "me",
          targetId: campaign.id,
          targetName: campaign.title,
          targetCover: campaign.cover,
          amount: finalAmount,
          frequency: freq as "weekly" | "monthly" | "quarterly",
          mode: recurringMode,
          nextDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          active: true,
        });
      }
      setProcessing(false);
      setDone(true);
    }, 1400);
  };

  if (done) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center">
          <div className="w-24 h-24 rounded-full bg-amber-100 grid place-items-center animate-pop mb-6">
            <Check className="w-14 h-14 text-amber-500" />
          </div>
          <h1 className="font-display text-3xl">Thank you</h1>
          <p className="text-muted-foreground mt-2 max-w-sm">
            {isRecurring
              ? `Your ${frequencyLabel[freq].toLowerCase()} gift of ${formatMoney(finalAmount)} is set up. You'll be reminded before each payment.`
              : `Your gift of ${formatMoney(finalAmount)} has been received.`}
          </p>
          {isRecurring && (
            <div className="mt-4 px-4 py-3 rounded-2xl bg-amber-50 border border-amber-200 text-sm text-amber-800 max-w-sm">
              <Repeat2 className="w-4 h-4 inline mr-1.5" />
              {recurringMode === "auto"
                ? "Paystack will charge you automatically."
                : "You'll get a reminder each time your gift is due."}
            </div>
          )}
          <div className="mt-8 w-full max-w-xs space-y-3">
            <Link
              to="/campaign/$id"
              params={{ id: campaign.id }}
              className="block w-full py-3.5 rounded-2xl bg-amber-500 text-white font-semibold text-center hover:bg-amber-600 transition"
            >
              Back to campaign
            </Link>
            <Link
              to="/discover"
              className="block w-full py-3.5 rounded-2xl border border-border text-sm font-medium text-center hover:bg-muted transition"
            >
              Discover more causes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-md px-5 py-8">
        {/* Back */}
        <button
          onClick={() =>
            step > 0 ? setStep((s) => s - 1) : nav({ to: "/campaign/$id", params: { id } })
          }
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition mb-6"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>

        {/* Campaign summary */}
        <div className="flex items-center gap-3 mb-6 p-3 rounded-2xl bg-card border border-border">
          <img src={campaign.cover} alt="" className="w-14 h-14 rounded-xl object-cover shrink-0" />
          <div className="min-w-0">
            <p className="text-xs text-amber-600 font-medium">{campaign.faithCategory}</p>
            <p className="text-sm font-medium line-clamp-1">{campaign.title}</p>
            {freq && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {frequencyLabel[freq] ?? "One time"}
              </p>
            )}
          </div>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8">
          {steps.map((label, i) => (
            <div key={label} className="flex items-center gap-2 flex-1 last:flex-none">
              <div
                className={`w-6 h-6 rounded-full text-xs font-semibold grid place-items-center shrink-0 ${i <= step ? "bg-amber-500 text-white" : "bg-muted text-muted-foreground"}`}
              >
                {i < step ? <Check className="w-3 h-3" /> : i + 1}
              </div>
              <span
                className={`text-xs hidden sm:block ${i === step ? "text-foreground font-medium" : "text-muted-foreground"}`}
              >
                {label}
              </span>
              {i < steps.length - 1 && (
                <div className={`h-px flex-1 ${i < step ? "bg-amber-400" : "bg-border"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 0: Amount */}
        {step === 0 && (
          <div className="space-y-5">
            <h2 className="font-display text-xl">How much?</h2>
            <div className="grid grid-cols-3 gap-2">
              {presets.map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    setAmount(p);
                    setCustomAmount("");
                  }}
                  className={`py-3 rounded-xl border text-sm font-medium transition ${amount === p && !customAmount ? "border-amber-400 bg-amber-50 text-amber-800" : "border-border hover:border-amber-200"}`}
                >
                  {formatMoney(p)}
                </button>
              ))}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Or enter amount (₦)</label>
              <input
                type="number"
                className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-background"
                placeholder="Enter custom amount"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setAmount(0);
                }}
              />
            </div>
            {finalAmount > 0 && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-muted/50 text-xs text-muted-foreground">
                <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                2.5% platform fee (₦{platformFee.toLocaleString()}) helps keep AzarFaith running.
              </div>
            )}
          </div>
        )}

        {/* Step 1 (recurring only): How to give */}
        {isRecurring && step === 1 && (
          <div className="space-y-4">
            <h2 className="font-display text-xl">How would you like to give?</h2>
            <p className="text-sm text-muted-foreground">
              Choose between automatic charging or manual reminders.
            </p>
            {[
              {
                v: "auto",
                label: "Automatic (recommended)",
                desc: "Paystack charges your card automatically on schedule. Set it and forget it.",
              },
              {
                v: "pledge",
                label: "Reminder / pledge",
                desc: "You'll get a reminder when each payment is due. You confirm and pay manually.",
              },
            ].map(({ v, label, desc }) => (
              <button
                key={v}
                onClick={() => setRecurringMode(v as "auto" | "pledge")}
                className={`w-full flex items-start gap-3 p-4 rounded-2xl border text-left transition ${recurringMode === v ? "border-amber-400 bg-amber-50" : "border-border hover:border-amber-200"}`}
              >
                <div
                  className={`w-4 h-4 rounded-full border-2 mt-0.5 shrink-0 ${recurringMode === v ? "border-amber-500 bg-amber-500" : "border-muted-foreground"}`}
                />
                <div>
                  <div className="text-sm font-semibold">{label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Payment method step */}
        {step === (isRecurring ? 2 : 1) && (
          <div className="space-y-4">
            <h2 className="font-display text-xl">Payment method</h2>
            {[
              {
                v: "card",
                icon: CreditCard,
                label: "Debit / Credit card",
                desc: "Visa, Mastercard, Verve",
              },
              {
                v: "bank",
                icon: Building2,
                label: "Bank transfer",
                desc: "Instant bank transfer via Paystack",
              },
            ].map(({ v, icon: Icon, label, desc }) => (
              <button
                key={v}
                onClick={() => setPayMethod(v as "card" | "bank")}
                className={`w-full flex items-center gap-3 p-4 rounded-2xl border transition ${payMethod === v ? "border-amber-400 bg-amber-50" : "border-border hover:border-amber-200"}`}
              >
                <Icon
                  className={`w-5 h-5 ${payMethod === v ? "text-amber-600" : "text-muted-foreground"}`}
                />
                <div className="text-left flex-1">
                  <div className="text-sm font-medium">{label}</div>
                  <div className="text-xs text-muted-foreground">{desc}</div>
                </div>
                {payMethod === v && <Check className="w-4 h-4 text-amber-500" />}
              </button>
            ))}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="anon"
                  checked={anonymous}
                  onChange={(e) => setAnonymous(e.target.checked)}
                  className="w-4 h-4 rounded accent-amber-500"
                />
                <label htmlFor="anon" className="text-sm">
                  Give anonymously
                </label>
              </div>
              {!anonymous && (
                <input
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-background"
                  placeholder="Your name (optional)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              )}
              <input
                className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-background"
                placeholder="Leave a message (optional)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            {/* Tip */}
            <div>
              <p className="text-sm font-medium mb-2">Add a tip to AzarFaith?</p>
              <div className="flex items-center gap-2">
                {[0, 500, 1000, 2500].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTip(t)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${tip === t ? "bg-amber-500 text-white" : "border border-border hover:border-amber-300"}`}
                  >
                    {t === 0 ? "None" : formatMoney(t)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Review step */}
        {step === (isRecurring ? 3 : 2) && (
          <div className="space-y-4">
            <h2 className="font-display text-xl">Review</h2>
            <div className="bg-card border border-border rounded-2xl divide-y divide-border text-sm">
              {[
                { label: "Donation", value: formatMoney(finalAmount) },
                { label: "Platform fee (2.5%)", value: formatMoney(platformFee) },
                ...(tip > 0 ? [{ label: "Tip to AzarFaith", value: formatMoney(tip) }] : []),
                { label: "Total", value: formatMoney(total) },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className={`flex items-center justify-between px-4 py-3 ${label === "Total" ? "font-semibold" : ""}`}
                >
                  <span>{label}</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
            <div className="bg-card border border-border rounded-2xl divide-y divide-border text-sm">
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-muted-foreground">To</span>
                <span className="font-medium">{campaign.title}</span>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-muted-foreground">From</span>
                <span>{anonymous ? "Anonymous" : name || "You"}</span>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-muted-foreground">Payment</span>
                <span>{payMethod === "card" ? "Card" : "Bank transfer"}</span>
              </div>
              {isRecurring && (
                <>
                  <div className="flex items-center justify-between px-4 py-3">
                    <span className="text-muted-foreground">Frequency</span>
                    <span>{frequencyLabel[freq]}</span>
                  </div>
                  <div className="flex items-center justify-between px-4 py-3">
                    <span className="text-muted-foreground">Mode</span>
                    <span>{recurringMode === "auto" ? "Automatic" : "Reminder"}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-8">
          {step < steps.length - 1 ? (
            <button
              onClick={next}
              className="w-full py-4 rounded-2xl bg-amber-500 text-white font-semibold hover:bg-amber-600 transition"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={submit}
              disabled={processing}
              className="w-full py-4 rounded-2xl bg-amber-500 text-white font-semibold hover:bg-amber-600 transition disabled:opacity-60"
            >
              {processing ? "Processing…" : `Confirm — ${formatMoney(total)}`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
