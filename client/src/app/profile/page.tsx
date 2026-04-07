/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  Bookmark,
  Calculator,
  Settings,
  LogOut,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  BookOpen,
  Eye,
  Download,
  Trash2,
  Shield,
  Bell,
  CreditCard,
  Pencil,
} from "lucide-react";

type MatchRecord = {
  id: string;
  createdAt: string;
  matchData?: Record<string, any>;
  formData?: Record<string, any>;
};

type SidebarTab = "overview" | "universities" | "estimates" | "settings";
type SettingsTab = "general" | "security" | "notifications" | "billing";

const SIDEBAR_ITEMS: Array<{ id: SidebarTab; label: string; icon: any }> = [
  { id: "overview", label: "Profile Overview", icon: User },
  { id: "universities", label: "Saved Universities", icon: Bookmark },
  { id: "estimates", label: "Saved Estimates", icon: Calculator },
  { id: "settings", label: "Account settings", icon: Settings },
];

const SETTINGS_ITEMS: Array<{ id: SettingsTab; label: string; icon: any }> = [
  { id: "general", label: "General Info", icon: Shield },
  { id: "security", label: "Password & Security", icon: Shield },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "billing", label: "Billing & Plan", icon: CreditCard },
];

function toNumber(value: unknown) {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
}

function formatMoney(value: unknown) {
  const amount = toNumber(value);
  if (!amount) return "NPR 0";
  return `NPR ${amount.toLocaleString()}`;
}

function estimateVisaReadiness(record: MatchRecord) {
  const profileScore = toNumber(record.formData?.gpa) >= 3 ? 60 : 35;
  const testReady = toNumber(record.formData?.englishScore) > 0 ? 25 : 10;
  const docReady = record.formData?.docsReady ? 15 : 5;
  return Math.min(100, profileScore + testReady + docReady);
}

function getChanceLabel(rate: number) {
  if (rate >= 75) return "High";
  if (rate >= 55) return "Medium";
  return "Low";
}

export default function ProfilePage() {
  const { status } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.replace("/");
    router.refresh();
  };

  const [activeTab, setActiveTab] = useState<SidebarTab>("overview");
  const [settingsTab, setSettingsTab] = useState<SettingsTab>("general");

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState<any>({
    name: "",
    username: "",
    email: "",
    phone: "",
    dob: "",
    nationality: "",
    currentCountry: "",
    highestEducation: "",
    passingYear: "",
    gpa: "",
    testType: "",
    englishScore: "",
    field: "",
    program: "",
    role: "Student",
  });
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [matchingRecords, setMatchingRecords] = useState<MatchRecord[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated") {
      void fetchProfile();
    }
  }, [status, router]);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      if (!res.ok) return;

      const data = await res.json();
      const fullName = data.name || "";
      const [first = "", ...rest] = fullName.split(" ");

      setFirstName(first);
      setLastName(rest.join(" "));

      setProfile((prev: any) => ({
        ...prev,
        name: fullName,
        username: data.username || "",
        email: data.email || "",
        phone: data.phoneE164 || data.phoneNumber || data.profile?.phone || "",
        dob: data.profile?.dob || "",
        nationality: data.profile?.nationality || "",
        currentCountry: data.profile?.currentCountry || "",
        highestEducation: data.profile?.highestEducation || "",
        passingYear: data.profile?.passingYear?.toString() || "",
        gpa: data.profile?.gpa?.toString() || "",
        testType: data.profile?.testType || "",
        englishScore: data.profile?.englishScore?.toString() || "",
        field: data.profile?.field || "",
        program: data.profile?.program || "",
        role: data.role || "Student",
      }));
      setMatchingRecords(data.matchingRecords || []);
    } catch (fetchError) {
      console.error(fetchError);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");

    try {
      const combinedName = `${firstName} ${lastName}`.trim();
      const payload = {
        ...profile,
        name: combinedName || profile.name,
      };

      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to save profile.");
        return;
      }

      setProfile((prev: any) => ({ ...prev, name: payload.name }));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Something went wrong while saving.");
    } finally {
      setSaving(false);
    }
  };

  const setProfileValue = (key: string, value: string) => {
    setProfile((prev: any) => ({ ...prev, [key]: value }));
  };

  const initials = useMemo(() => {
    const source = `${firstName} ${lastName}`.trim() || profile.name || "User";
    return source
      .split(" ")
      .map((part: string) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }, [firstName, lastName, profile.name]);

  const savedUniversityCards = useMemo(() => {
    const byName = new Map<string, MatchRecord>();
    matchingRecords.forEach((record) => {
      const match = record.matchData || {};
      const key = `${match.name || "Unknown"}-${match.location || "Global"}`;
      if (!byName.has(key)) {
        byName.set(key, record);
      }
    });
    return Array.from(byName.values());
  }, [matchingRecords]);

  const estimateRows = useMemo(() => {
    return matchingRecords.map((record) => {
      const match = record.matchData || {};
      const acceptance = toNumber(match.admissionRate || 0);
      const visaReadiness = estimateVisaReadiness(record);

      return {
        id: record.id,
        university: match.name || "Unknown University",
        program:
          record.formData?.program ||
          match.popularPrograms?.[0] ||
          "General Program",
        tuitionFee: toNumber(match.tuitionFee),
        acceptance,
        acceptanceLabel: getChanceLabel(acceptance),
        visaReadiness,
      };
    });
  }, [matchingRecords]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 rounded-full border-2 border-blue-200 border-t-blue-600 animate-spin" />
          <p className="text-sm font-semibold text-slate-500">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 pt-[120px] pb-12 px-4 md:px-8">
      <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[260px_1fr]">
        <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 pb-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-200 text-lg font-bold text-slate-700">
              {initials}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {`${firstName} ${lastName}`.trim() || profile.name || "Student"}
              </h2>
              <p className="text-sm text-slate-500">Student Account</p>
            </div>
          </div>

          <nav className="space-y-2 border-t border-slate-100 pt-4">
            {SIDEBAR_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-600 hover:bg-slate-50"
                    }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="mt-8 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm font-semibold text-red-500 hover:text-red-600"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </aside>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 md:p-8 shadow-sm">
          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h1 className="text-4xl font-bold text-slate-900">
                    Profile Overview
                  </h1>
                  <p className="mt-1 text-base text-slate-500">
                    Manage your personal information and academic preferences.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab("settings")}
                  className="inline-flex items-center rounded-xl bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600"
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit Profile
                </button>
              </div>

              <div className="grid gap-5 lg:grid-cols-2">
                <div>
                  <h2 className="mb-3 text-2xl font-semibold text-slate-900">
                    Personal Details
                  </h2>
                  <div className="space-y-3">
                    <InfoCard
                      label="Full Name"
                      value={
                        `${firstName} ${lastName}`.trim() ||
                        profile.name ||
                        "Not set"
                      }
                      icon={User}
                    />
                    <InfoCard
                      label="Email Address"
                      value={profile.email || "Not set"}
                      icon={Mail}
                    />
                    <InfoCard
                      label="Phone Number"
                      value={profile.phone || "Not set"}
                      icon={Phone}
                    />
                    <InfoCard
                      label="Location"
                      value={
                        profile.currentCountry ||
                        profile.nationality ||
                        "Not set"
                      }
                      icon={MapPin}
                    />
                    <InfoCard
                      label="Date of Birth"
                      value={profile.dob || "Not set"}
                      icon={Calendar}
                    />
                  </div>
                </div>

                <div>
                  <h2 className="mb-3 text-2xl font-semibold text-slate-900">
                    Academic Profile
                  </h2>
                  <div className="space-y-3">
                    <div className="rounded-2xl border border-slate-200 bg-linear-to-br from-blue-50 to-indigo-50 p-5">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Current Status
                      </p>
                      <p className="mt-2 text-4xl font-bold text-blue-600">
                        {profile.gpa || "0.0"}
                        <span className="ml-2 text-xl font-semibold text-blue-500">
                          / 4.0 GPA
                        </span>
                      </p>
                      <p className="mt-2 text-sm text-slate-600">
                        {profile.highestEducation || "Not set"}
                        {profile.passingYear
                          ? ` • Class of ${profile.passingYear}`
                          : ""}
                      </p>
                    </div>

                    <InfoCard
                      label="Standardized Tests"
                      value={
                        profile.testType && profile.testType !== "NONE"
                          ? `${profile.testType}: ${profile.englishScore || "N/A"}`
                          : "No test score added"
                      }
                      icon={GraduationCap}
                    />

                    <InfoCard
                      label="Intended Majors"
                      value={
                        [profile.field, profile.program]
                          .filter(Boolean)
                          .join(", ") || "Not set"
                      }
                      icon={BookOpen}
                    />

                    <div className="grid grid-cols-2 gap-3">
                      <StatCard
                        label="Saved Universities"
                        value={savedUniversityCards.length.toString()}
                      />
                      <StatCard
                        label="Saved Estimates"
                        value={estimateRows.length.toString()}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "universities" && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h1 className="text-4xl font-bold text-slate-900">
                    Saved Universities
                  </h1>
                  <p className="mt-1 text-base text-slate-500">
                    Track and compare the universities you are interested in
                    applying to.
                  </p>
                </div>
                <Link
                  href="/matches"
                  className="inline-flex items-center rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Add New University
                </Link>
              </div>

              {savedUniversityCards.length === 0 ? (
                <EmptyState
                  title="No saved universities yet"
                  actionText="Explore Universities"
                  href="/matches"
                />
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {savedUniversityCards.map((record) => {
                    const match = record.matchData || {};
                    const acceptance = toNumber(match.admissionRate);
                    return (
                      <article
                        key={record.id}
                        className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                      >
                        <div
                          className="h-32 w-full bg-cover bg-center"
                          style={{
                            backgroundImage: `url(${match.banner || "/hero-image.jpg"})`,
                          }}
                        />
                        <div className="space-y-4 p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h3 className="text-2xl font-semibold text-slate-900">
                                {match.name || "University"}
                              </h3>
                              <p className="mt-1 text-sm text-slate-500">
                                {match.location || "Global"}
                              </p>
                            </div>
                            <button
                              type="button"
                              className="rounded-lg bg-slate-100 p-2 text-slate-500"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-xs uppercase tracking-wide text-slate-500">
                                Acceptance
                              </p>
                              <p className="mt-1 text-xl font-semibold text-emerald-600">
                                {acceptance || 0}%
                              </p>
                            </div>
                            <div>
                              <p className="text-xs uppercase tracking-wide text-slate-500">
                                Tuition
                              </p>
                              <p className="mt-1 text-xl font-semibold text-slate-900">
                                {formatMoney(match.tuitionFee)} / Year
                              </p>
                            </div>
                          </div>

                          <Link
                            href="/matches"
                            className="inline-flex w-full justify-center rounded-xl bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600"
                          >
                            View
                          </Link>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === "estimates" && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h1 className="text-4xl font-bold text-slate-900">
                    Saved Estimates
                  </h1>
                  <p className="mt-1 text-base text-slate-500">
                    Review your personal net price estimates and financial aid
                    calculations.
                  </p>
                </div>
                <Link
                  href="/costing"
                  className="inline-flex items-center rounded-xl bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600"
                >
                  New Calculator
                </Link>
              </div>

              {estimateRows.length === 0 ? (
                <EmptyState
                  title="No saved estimates yet"
                  actionText="Run Cost Calculator"
                  href="/costing"
                />
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-slate-200">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <TableHead>University / Program</TableHead>
                        <TableHead>Estimated Cost</TableHead>
                        <TableHead>Admission Chances</TableHead>
                        <TableHead>Visa Readiness</TableHead>
                        <TableHead>Actions</TableHead>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {estimateRows.map((row) => {
                        let chanceClass = "bg-rose-50 text-rose-600";
                        if (row.acceptanceLabel === "High") {
                          chanceClass = "bg-emerald-50 text-emerald-600";
                        } else if (row.acceptanceLabel === "Medium") {
                          chanceClass = "bg-amber-50 text-amber-600";
                        }

                        return (
                          <tr key={row.id}>
                            <TableCell>
                              <p className="font-semibold text-slate-900">
                                {row.university}
                              </p>
                              <p className="text-xs text-slate-500">
                                {row.program}
                              </p>
                            </TableCell>
                            <TableCell>{formatMoney(row.tuitionFee)}</TableCell>
                            <TableCell>
                              <span
                                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${chanceClass}`}
                              >
                                {row.acceptanceLabel}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-24 rounded-full bg-slate-200">
                                  <div
                                    className="h-2 rounded-full bg-emerald-500"
                                    style={{ width: `${row.visaReadiness}%` }}
                                  />
                                </div>
                                <span className="text-xs font-semibold text-slate-600">
                                  {row.visaReadiness}%
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2 text-slate-500">
                                <button
                                  type="button"
                                  className="rounded p-1 hover:bg-slate-100"
                                  aria-label="View estimate details"
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                                <button
                                  type="button"
                                  className="rounded p-1 hover:bg-slate-100"
                                  aria-label="Download estimate"
                                >
                                  <Download className="h-4 w-4" />
                                </button>
                              </div>
                            </TableCell>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h1 className="text-4xl font-bold text-slate-900">
                  Account Settings
                </h1>
                <p className="mt-1 text-base text-slate-500">
                  Update your account preferences, security, and notification
                  settings.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-[220px_1fr]">
                <div className="space-y-2">
                  {SETTINGS_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = settingsTab === item.id;
                    return (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => setSettingsTab(item.id)}
                        className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium ${isActive
                            ? "bg-blue-50 text-blue-600"
                            : "text-slate-600 hover:bg-slate-50"
                          }`}
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </button>
                    );
                  })}
                </div>

                {settingsTab === "general" ? (
                  <div className="space-y-4">
                    <h2 className="text-2xl font-semibold text-slate-900">
                      General Information
                    </h2>

                    <div className="grid gap-4 md:grid-cols-2">
                      <InputField
                        label="First Name"
                        value={firstName}
                        onChange={setFirstName}
                      />
                      <InputField
                        label="Last Name"
                        value={lastName}
                        onChange={setLastName}
                      />
                    </div>

                    <InputField
                      label="Email Address"
                      value={profile.email || ""}
                      onChange={(value) => setProfileValue("email", value)}
                    />
                    <InputField
                      label="Role / Account Type"
                      value={profile.role || "Student"}
                      onChange={(value) => setProfileValue("role", value)}
                    />

                    <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                      {saved && (
                        <p className="text-sm font-semibold text-emerald-600">
                          Changes saved
                        </p>
                      )}
                      <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving}
                        className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                      >
                        {saving ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
                    {settingsTab === "security" &&
                      "Password and security controls will be available here."}
                    {settingsTab === "notifications" &&
                      "Notification preferences will be available here."}
                    {settingsTab === "billing" &&
                      "Billing and plan details will be available here."}
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function InfoCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: any;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 rounded-xl bg-blue-100 p-2 text-blue-600">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {label}
          </p>
          <p className="mt-1 text-base font-medium text-slate-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center">
      <p className="text-4xl font-bold text-blue-600">{value}</p>
      <p className="mt-1 text-sm text-slate-500">{label}</p>
    </div>
  );
}

function EmptyState({
  title,
  actionText,
  href,
}: {
  title: string;
  actionText: string;
  href: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
      <p className="text-sm text-slate-600">{title}</p>
      <Link
        href={href}
        className="mt-3 inline-block rounded-xl bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600"
      >
        {actionText}
      </Link>
    </div>
  );
}

function TableHead({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
      {children}
    </th>
  );
}

function TableCell({ children }: { children: React.ReactNode }) {
  return <td className="px-4 py-3 text-sm text-slate-700">{children}</td>;
}

function InputField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
      />
    </label>
  );
}
