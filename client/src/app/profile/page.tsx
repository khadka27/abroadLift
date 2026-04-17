/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Bookmark,
  Calculator,
  GraduationCap,
  LogOut,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Settings,
  User,
} from "lucide-react";

type TabKey =
  | "overview"
  | "saved-universities"
  | "saved-estimates"
  | "account-settings";

type MatchRecord = {
  id: string;
  createdAt?: string;
  costEstimate?: number;
  admissionChance?: number;
  visaSuccess?: number;
  matchData?: {
    id?: string;
    name?: string;
    country?: string;
    tuitionFee?: number;
  };
};

type ProfileState = {
  name: string;
  username: string;
  email: string;
  phoneNumber: string;
  nationality: string;
  currentCountry: string;
  preferredCountry: string;
  degreeLevel: string;
  field: string;
  program: string;
  yearlyBudget: string;
  currency: string;
  hasEnglishTest: boolean | null;
  testType: string;
  englishScore: string;
  highestEducation: string;
  passingYear: string;
  gpa: string;
  dateOfBirth: string;
};

const DEFAULT_PROFILE: ProfileState = {
  name: "",
  username: "",
  email: "",
  phoneNumber: "",
  nationality: "",
  currentCountry: "",
  preferredCountry: "",
  degreeLevel: "",
  field: "",
  program: "",
  yearlyBudget: "",
  currency: "USD",
  hasEnglishTest: null,
  testType: "",
  englishScore: "",
  highestEducation: "",
  passingYear: "",
  gpa: "",
  dateOfBirth: "",
};

function sanitizeDate(dateString: string): string {
  if (!dateString) return "";
  const dt = new Date(dateString);
  if (Number.isNaN(dt.getTime())) return "";
  return dt.toISOString().slice(0, 10);
}

function formatDateDisplay(dateString: string): string {
  if (!dateString) return "Not set";
  const dt = new Date(dateString);
  if (Number.isNaN(dt.getTime())) return "Not set";
  return dt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatCurrency(amount?: number, currency = "USD") {
  if (!Number.isFinite(amount || Number.NaN) || (amount || 0) <= 0)
    return "N/A";
  return `${currency} ${(amount || 0).toLocaleString()}`;
}

function getEnglishAssessment(profile: ProfileState): string {
  if (profile.hasEnglishTest === false) return "Not taken";
  if (profile.testType && profile.englishScore) {
    return `${profile.testType}: ${profile.englishScore}`;
  }
  return "N/A";
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-100 px-5 py-4">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
          {icon}
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
            {label}
          </p>
          <p className="mt-1 text-base font-semibold text-slate-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { status } = useSession();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState<ProfileState>(DEFAULT_PROFILE);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [matchingRecords, setMatchingRecords] = useState<MatchRecord[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
      return;
    }

    if (status === "authenticated") {
      void fetchProfile();
    }
  }, [status, router]);

  const fetchProfile = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/profile", { cache: "no-store" });
      if (!res.ok) {
        setError("Unable to load profile details.");
        return;
      }

      const data = await res.json();
      const fullName = data.name || "";
      const [first = "", ...rest] = fullName.split(" ");
      const p = data.profile || {};

      setFirstName(first);
      setLastName(rest.join(" "));
      setProfile({
        name: fullName,
        username: data.username || "",
        email: data.email || "",
        phoneNumber: data.phoneE164 || data.phoneNumber || "",
        nationality: p.nationality || "",
        currentCountry: p.currentCountry || "",
        preferredCountry: p.preferredCountry || "",
        degreeLevel: p.degreeLevel || "",
        field: p.field || "",
        program: p.program || "",
        yearlyBudget: p.yearlyBudget?.toString() || "",
        currency: p.currency || "USD",
        hasEnglishTest:
          typeof p.hasEnglishTest === "boolean" ? p.hasEnglishTest : null,
        testType: p.testType || "",
        englishScore: p.englishScore?.toString() || "",
        highestEducation: p.highestEducation || "",
        passingYear: p.passingYear?.toString() || "",
        gpa: p.gpa?.toString() || "",
        dateOfBirth: sanitizeDate(p.dob || ""),
      });
      setMatchingRecords(
        Array.isArray(data.matchingRecords) ? data.matchingRecords : [],
      );
    } catch (fetchError) {
      console.error(fetchError);
      setError("Unable to load profile details.");
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
        countries: profile.preferredCountry ? [profile.preferredCountry] : [],
        degree: profile.degreeLevel,
        budget: profile.yearlyBudget,
        dob: profile.dateOfBirth || null,
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

      setProfile((prev) => ({ ...prev, name: payload.name }));
      setSaved(true);
      setIsEditing(false);
      setTimeout(() => setSaved(false), 2500);
      await fetchProfile();
    } catch {
      setError("Something went wrong while saving.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.replace("/");
    router.refresh();
  };

  const initials = useMemo(() => {
    const source = `${firstName} ${lastName}`.trim() || profile.name || "User";
    return source
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }, [firstName, lastName, profile.name]);

  const fullName = useMemo(() => {
    return `${firstName} ${lastName}`.trim() || profile.name || "Student";
  }, [firstName, lastName, profile.name]);

  const savedUniversities = useMemo(() => {
    const byId = new Map<string, MatchRecord>();
    for (const record of matchingRecords) {
      const key = record.matchData?.id || record.matchData?.name || record.id;
      if (!byId.has(key)) byId.set(key, record);
    }
    return Array.from(byId.values());
  }, [matchingRecords]);

  const savedEstimates = useMemo(() => {
    return matchingRecords.filter((item) => Number.isFinite(item.costEstimate));
  }, [matchingRecords]);

  const academicSummary = useMemo(() => {
    const pieces = [
      profile.highestEducation,
      profile.passingYear ? `Class of ${profile.passingYear}` : "",
    ].filter(Boolean);
    return pieces.length ? pieces.join(" • ") : "Not specified";
  }, [profile.highestEducation, profile.passingYear]);

  if (status === "loading" || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 pb-10 pt-28 md:px-6">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-5 lg:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-200 text-2xl font-bold text-slate-700">
              {initials || "S"}
            </div>
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900">
                {fullName}
              </h2>
              <p className="text-sm text-slate-500">Student Account</p>
            </div>
          </div>

          <nav className="space-y-1.5 border-b border-slate-100 pb-5">
            <button
              type="button"
              onClick={() => setActiveTab("overview")}
              className={`flex w-full items-center gap-2 rounded-2xl px-4 py-3 text-left text-base font-semibold transition ${
                activeTab === "overview"
                  ? "bg-blue-100 text-blue-700"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <User className="h-5 w-5" />
              Profile Overview
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("saved-universities")}
              className={`flex w-full items-center gap-2 rounded-2xl px-4 py-3 text-left text-base font-semibold transition ${
                activeTab === "saved-universities"
                  ? "bg-blue-100 text-blue-700"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Bookmark className="h-5 w-5" />
              Saved Universities
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("saved-estimates")}
              className={`flex w-full items-center gap-2 rounded-2xl px-4 py-3 text-left text-base font-semibold transition ${
                activeTab === "saved-estimates"
                  ? "bg-blue-100 text-blue-700"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Calculator className="h-5 w-5" />
              Saved Estimates
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("account-settings")}
              className={`flex w-full items-center gap-2 rounded-2xl px-4 py-3 text-left text-base font-semibold transition ${
                activeTab === "account-settings"
                  ? "bg-blue-100 text-blue-700"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Settings className="h-5 w-5" />
              Account settings
            </button>
          </nav>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-5 inline-flex items-center gap-2 text-xl font-semibold text-red-500 hover:text-red-600"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </aside>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-5">
            <div>
              <h1 className="text-4xl font-black tracking-tight text-slate-900">
                Profile Overview
              </h1>
              <p className="mt-1 text-lg text-slate-500">
                Manage your personal information and academic preferences.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsEditing((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-base font-bold text-white hover:bg-blue-700"
            >
              <Pencil className="h-4 w-4" />
              {isEditing ? "Close Edit" : "Edit Profile"}
            </button>
          </div>

          {error && (
            <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          {saved && (
            <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
              Profile saved successfully.
            </div>
          )}

          {activeTab === "overview" && (
            <>
              <div className="grid gap-5 xl:grid-cols-2">
                <div>
                  <h2 className="mb-4 text-4xl font-black text-slate-900">
                    Personal Details
                  </h2>
                  <div className="space-y-3">
                    <InfoCard
                      icon={<User className="h-5 w-5" />}
                      label="Full Name"
                      value={fullName}
                    />
                    <InfoCard
                      icon={<Mail className="h-5 w-5" />}
                      label="Email Address"
                      value={profile.email || "Not set"}
                    />
                    <InfoCard
                      icon={<Phone className="h-5 w-5" />}
                      label="Phone Number"
                      value={profile.phoneNumber || "Not set"}
                    />
                    <InfoCard
                      icon={<MapPin className="h-5 w-5" />}
                      label="Location"
                      value={
                        profile.currentCountry ||
                        profile.nationality ||
                        "Not set"
                      }
                    />
                    <InfoCard
                      icon={<BookOpen className="h-5 w-5" />}
                      label="Date of Birth"
                      value={formatDateDisplay(profile.dateOfBirth)}
                    />
                  </div>
                </div>

                <div>
                  <h2 className="mb-4 text-4xl font-black text-slate-900">
                    Academic Profile
                  </h2>
                  <div className="space-y-3">
                    <div className="rounded-3xl border border-blue-100 bg-blue-50 px-5 py-5">
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                        Current Status
                      </p>
                      <p className="mt-1 text-5xl font-black text-blue-700">
                        {profile.gpa || "N/A"}
                        <span className="ml-1 text-3xl font-bold">
                          / 4.0 GPA
                        </span>
                      </p>
                      <p className="mt-1 text-xl font-medium text-slate-600">
                        {academicSummary}
                      </p>
                    </div>

                    <InfoCard
                      icon={<GraduationCap className="h-5 w-5" />}
                      label="Standardized Tests"
                      value={getEnglishAssessment(profile)}
                    />

                    <InfoCard
                      icon={<BookOpen className="h-5 w-5" />}
                      label="Intended Majors"
                      value={
                        [profile.field, profile.program]
                          .filter(Boolean)
                          .join(", ") || "Not specified"
                      }
                    />

                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-3xl border border-slate-200 bg-slate-100 px-4 py-4 text-center">
                        <p className="text-5xl font-black text-blue-700">
                          {savedUniversities.length}
                        </p>
                        <p className="mt-1 text-lg font-medium text-slate-500">
                          Saved Universities
                        </p>
                      </div>
                      <div className="rounded-3xl border border-slate-200 bg-slate-100 px-4 py-4 text-center">
                        <p className="text-5xl font-black text-blue-700">
                          {savedEstimates.length}
                        </p>
                        <p className="mt-1 text-lg font-medium text-slate-500">
                          Saved Estimates
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="mt-6 rounded-3xl border border-blue-200 bg-blue-50/50 p-5">
                  <h3 className="mb-4 text-xl font-bold text-slate-900">
                    Edit Profile
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="block">
                      <span className="mb-1 block text-xs font-semibold uppercase text-slate-500">
                        First Name
                      </span>
                      <input
                        value={firstName}
                        onChange={(event) => setFirstName(event.target.value)}
                        className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-xs font-semibold uppercase text-slate-500">
                        Last Name
                      </span>
                      <input
                        value={lastName}
                        onChange={(event) => setLastName(event.target.value)}
                        className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-xs font-semibold uppercase text-slate-500">
                        Email
                      </span>
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(event) =>
                          setProfile((prev) => ({
                            ...prev,
                            email: event.target.value,
                          }))
                        }
                        className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-xs font-semibold uppercase text-slate-500">
                        Nationality
                      </span>
                      <input
                        value={profile.nationality}
                        onChange={(event) =>
                          setProfile((prev) => ({
                            ...prev,
                            nationality: event.target.value,
                          }))
                        }
                        className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-xs font-semibold uppercase text-slate-500">
                        Current Country
                      </span>
                      <input
                        value={profile.currentCountry}
                        onChange={(event) =>
                          setProfile((prev) => ({
                            ...prev,
                            currentCountry: event.target.value,
                          }))
                        }
                        className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-xs font-semibold uppercase text-slate-500">
                        Preferred Country
                      </span>
                      <input
                        value={profile.preferredCountry}
                        onChange={(event) =>
                          setProfile((prev) => ({
                            ...prev,
                            preferredCountry: event.target.value,
                          }))
                        }
                        className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-xs font-semibold uppercase text-slate-500">
                        Degree Level
                      </span>
                      <input
                        value={profile.degreeLevel}
                        onChange={(event) =>
                          setProfile((prev) => ({
                            ...prev,
                            degreeLevel: event.target.value,
                          }))
                        }
                        className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-xs font-semibold uppercase text-slate-500">
                        Field
                      </span>
                      <input
                        value={profile.field}
                        onChange={(event) =>
                          setProfile((prev) => ({
                            ...prev,
                            field: event.target.value,
                          }))
                        }
                        className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-xs font-semibold uppercase text-slate-500">
                        Program
                      </span>
                      <input
                        value={profile.program}
                        onChange={(event) =>
                          setProfile((prev) => ({
                            ...prev,
                            program: event.target.value,
                          }))
                        }
                        className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-xs font-semibold uppercase text-slate-500">
                        Highest Education
                      </span>
                      <input
                        value={profile.highestEducation}
                        onChange={(event) =>
                          setProfile((prev) => ({
                            ...prev,
                            highestEducation: event.target.value,
                          }))
                        }
                        className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-xs font-semibold uppercase text-slate-500">
                        GPA
                      </span>
                      <input
                        value={profile.gpa}
                        onChange={(event) =>
                          setProfile((prev) => ({
                            ...prev,
                            gpa: event.target.value,
                          }))
                        }
                        className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-xs font-semibold uppercase text-slate-500">
                        Date of Birth
                      </span>
                      <input
                        type="date"
                        value={profile.dateOfBirth}
                        onChange={(event) =>
                          setProfile((prev) => ({
                            ...prev,
                            dateOfBirth: event.target.value,
                          }))
                        }
                        className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm"
                      />
                    </label>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={saving}
                      className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                    >
                      {saving ? "Saving..." : "Save Profile"}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === "saved-universities" && (
            <div>
              <h2 className="mb-3 text-3xl font-black text-slate-900">
                Saved Universities
              </h2>
              {savedUniversities.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-500">
                  No saved universities yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {savedUniversities.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <p className="text-lg font-bold text-slate-900">
                        {item.matchData?.name || "University"}
                      </p>
                      <p className="text-sm text-slate-600">
                        {item.matchData?.country || "Country not available"}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Admission chance: {item.admissionChance ?? "N/A"}%
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "saved-estimates" && (
            <div>
              <h2 className="mb-3 text-3xl font-black text-slate-900">
                Saved Estimates
              </h2>
              {savedEstimates.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-500">
                  No saved estimates yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {savedEstimates.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <p className="text-lg font-bold text-slate-900">
                        {item.matchData?.name || "Estimated Plan"}
                      </p>
                      <p className="text-sm text-slate-600">
                        Estimated annual cost:{" "}
                        {formatCurrency(item.costEstimate, profile.currency)}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Visa success: {item.visaSuccess ?? "N/A"}%
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "account-settings" && (
            <div>
              <h2 className="mb-3 text-3xl font-black text-slate-900">
                Account settings
              </h2>
              <div className="space-y-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    Username
                  </p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">
                    {profile.username || "Not set"}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    Email
                  </p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">
                    {profile.email || "Not set"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="rounded-xl border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"
                >
                  Edit Profile Details
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="ml-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
