import { create } from "zustand";
import {
  campaigns as campaignSeed,
  orgs as orgSeed,
  myRecurringDonations as recurringDonationsSeed,
  type Campaign,
  type Org,
  type RecurringDonation,
} from "./mock";

type Draft = {
  mode?: Campaign["mode"];
  type?: Campaign["type"];
  title?: string;
  story?: string;
  faithCategory?: Campaign["faithCategory"];
  orgId?: string;
  location?: string;
  goal?: number;
  urgency?: Campaign["urgency"];
  cover?: string;
  frequencies?: Campaign["frequencies"];
  needs?: string[];
};

type OrgDraft = {
  name?: string;
  tagline?: string;
  category?: Org["category"];
  denomination?: string;
  location?: string;
  founded?: string;
  bio?: string;
  photos?: string[];
  videos?: string[];
};

type State = {
  authed: boolean;
  setAuthed: (v: boolean) => void;

  campaigns: Campaign[];
  addCampaign: (c: Campaign) => void;
  donate: (id: string, amount: number, donor: string, note?: string) => void;
  draft: Draft;
  setDraft: (d: Partial<Draft>) => void;
  resetDraft: () => void;

  orgs: Org[];
  addOrg: (o: Org) => void;
  orgDraft: OrgDraft;
  setOrgDraft: (d: Partial<OrgDraft>) => void;
  resetOrgDraft: () => void;

  recurringDonations: RecurringDonation[];
  addRecurringDonation: (r: RecurringDonation) => void;
  cancelRecurringDonation: (id: string) => void;
};

export const useApp = create<State>((set) => ({
  authed: false,
  setAuthed: (v) => set({ authed: v }),

  campaigns: campaignSeed,
  addCampaign: (c) => set((s) => ({ campaigns: [c, ...s.campaigns] })),
  donate: (id, amount, donor, note) =>
    set((s) => ({
      campaigns: s.campaigns.map((c) =>
        c.id === id
          ? {
              ...c,
              raised: c.raised + amount,
              donors: c.donors + 1,
              donations: [
                { id: Math.random().toString(36).slice(2), donor, amount, date: "just now", note },
                ...c.donations,
              ],
            }
          : c,
      ),
    })),
  draft: {},
  setDraft: (d) => set((s) => ({ draft: { ...s.draft, ...d } })),
  resetDraft: () => set({ draft: {} }),

  orgs: orgSeed,
  addOrg: (o) => set((s) => ({ orgs: [o, ...s.orgs] })),
  orgDraft: {},
  setOrgDraft: (d) => set((s) => ({ orgDraft: { ...s.orgDraft, ...d } })),
  resetOrgDraft: () => set({ orgDraft: {} }),

  recurringDonations: recurringDonationsSeed,
  addRecurringDonation: (r) => set((s) => ({ recurringDonations: [r, ...s.recurringDonations] })),
  cancelRecurringDonation: (id) =>
    set((s) => ({
      recurringDonations: s.recurringDonations.map((r) =>
        r.id === id ? { ...r, active: false } : r,
      ),
    })),
}));
