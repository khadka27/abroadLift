/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, LogOut, Pencil, Sparkles, Target } from "lucide-react";

type MatchRecord = {
  id: string;
};

type ProfileState = {
  name: string;
  username: string;
  email: string;
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
  backlogs: string;
  studyGap: string;
};

const DEFAULT_PROFILE: ProfileState = {
  name: "",
  username: "",
  email: "",
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
  backlogs: "0",
  studyGap: "0",
};

function formatBudget(value: string, currency: string) {
  const num = Number(value);
  if (!Number.isFinite(num) || num <= 0) return "Not specified";
  return `${currency || "USD"} ${num.toLocaleString()}`;
}

function formatEnglishSummary(profile: ProfileState) {
  if (profile.hasEnglishTest === false) return "Not taken";
  if (!profile.testType || !profile.englishScore) return "Not specified";
  return `${profile.testType}: ${profile.englishScore}`;
}

function formatAcademicSummary(profile: ProfileState) {
  const pieces = [
    profile.highestEducation,
    profile.gpa ? `${profile.gpa} GPA` : "",
    profile.passingYear,
  ].filter(Boolean);

  return pieces.length > 0 ? pieces.join(" • ") : "Not specified";
}

function InputField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </span>
      <input
        value={value}
        type={type}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ label: string; value: string }>;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function OverviewRow({
  label,
  value,
  onEdit,
}: {
  label: string;
  value: string;
  onEdit: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {label}
        </p>
        <p className="mt-1 text-base font-semibold text-slate-900">{value}</p>
      </div>
      <button
        type="button"
        onClick={onEdit}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-blue-200 text-blue-600 hover:bg-blue-50"
        aria-label={`Edit ${label}`}
      >
        <Pencil className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function ProfilePage() {
  const { status } = useSession();
  const router = useRouter();

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
    try {
      const res = await fetch("/api/profile");
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
        backlogs: p.backlogs?.toString() || "0",
        studyGap: p.studyGap?.toString() || "0",
      });
      setMatchingRecords(data.matchingRecords || []);
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
      };

      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to save profile overview.");
        return;
      }

      setProfile((prev) => ({ ...prev, name: payload.name }));
      setSaved(true);
      setIsEditing(false);
      setTimeout(() => setSaved(false), 2500);
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
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }, [firstName, lastName, profile.name]);

  const missingCriticalFields = useMemo(() => {
    const required = [
      profile.preferredCountry,
      profile.degreeLevel,
      profile.field,
      profile.nationality,
      profile.highestEducation,
    ];
    return required.filter((item) => !item).length;
  }, [
    profile.preferredCountry,
    profile.degreeLevel,
    profile.field,
    profile.nationality,
    profile.highestEducation,
  ]);

  let englishTestTakenValue = "unknown";
  if (profile.hasEnglishTest === true) {
    englishTestTakenValue = "yes";
  } else if (profile.hasEnglishTest === false) {
    englishTestTakenValue = "no";
  }

  const handleEnglishTestTakenChange = (value: string) => {
    let nextValue: boolean | null = null;
    if (value === "yes") nextValue = true;
    if (value === "no") nextValue = false;

    setProfile((prev) => ({
      ...prev,
      hasEnglishTest: nextValue,
    }));
  };

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
    <main className="min-h-screen bg-slate-50 pt-30 pb-12 px-4 md:px-8">
      <div className="mx-auto max-w-5xl space-y-5">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-xl font-black text-blue-700">
                {initials}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  {`${firstName} ${lastName}`.trim() ||
                    profile.name ||
                    "Student"}
                </h1>
                <p className="text-sm text-slate-500">
                  Unified profile overview
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsEditing((prev) => !prev)}
                className="inline-flex items-center rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <Pencil className="mr-2 h-4 w-4" />
                {isEditing ? "Close Edit" : "Edit Overview"}
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </button>
            </div>
          </div>
        </section>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Overview</h2>
              <p className="mt-1 text-sm text-slate-500">
                One section that combines preferences, English test, and
                academic profile.
              </p>
            </div>
            {saved && (
              <div className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                Saved successfully
              </div>
            )}
          </div>

          <div className="space-y-3">
            <OverviewRow
              label="Study Destinations"
              value={profile.preferredCountry || "Not specified"}
              onEdit={() => setIsEditing(true)}
            />
            <OverviewRow
              label="Study Level"
              value={profile.degreeLevel || "Not specified"}
              onEdit={() => setIsEditing(true)}
            />
            <OverviewRow
              label="Field of Study"
              value={
                [profile.field, profile.program].filter(Boolean).join(" • ") ||
                "Not specified"
              }
              onEdit={() => setIsEditing(true)}
            />
            <OverviewRow
              label="Nationality"
              value={profile.nationality || "Not specified"}
              onEdit={() => setIsEditing(true)}
            />
            <OverviewRow
              label="Budget Range"
              value={formatBudget(profile.yearlyBudget, profile.currency)}
              onEdit={() => setIsEditing(true)}
            />
            <OverviewRow
              label="English Assessment"
              value={formatEnglishSummary(profile)}
              onEdit={() => setIsEditing(true)}
            />
            <OverviewRow
              label="Academic Details"
              value={formatAcademicSummary(profile)}
              onEdit={() => setIsEditing(true)}
            />
          </div>

          {missingCriticalFields > 0 && (
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              <div className="flex items-center justify-between gap-3">
                <p>
                  Complete your assessment to unlock better recommendations and
                  admission insights.
                </p>
                <Link
                  href="/matches"
                  className="inline-flex items-center rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-600"
                >
                  Complete Assessment
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          )}

          {isEditing && (
            <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/40 p-4 md:p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-slate-900">
                  Edit Overview
                </h3>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save Overview"}
                </button>
              </div>

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
                <InputField
                  label="Username"
                  value={profile.username}
                  onChange={(value) =>
                    setProfile((prev) => ({ ...prev, username: value }))
                  }
                />
                <InputField
                  label="Email"
                  value={profile.email}
                  onChange={(value) =>
                    setProfile((prev) => ({ ...prev, email: value }))
                  }
                  type="email"
                />
                <InputField
                  label="Study Destination"
                  value={profile.preferredCountry}
                  onChange={(value) =>
                    setProfile((prev) => ({ ...prev, preferredCountry: value }))
                  }
                  placeholder="USA, UK, Canada..."
                />
                <InputField
                  label="Study Level"
                  value={profile.degreeLevel}
                  onChange={(value) =>
                    setProfile((prev) => ({ ...prev, degreeLevel: value }))
                  }
                  placeholder="bachelor-4, masters..."
                />
                <InputField
                  label="Field of Study"
                  value={profile.field}
                  onChange={(value) =>
                    setProfile((prev) => ({ ...prev, field: value }))
                  }
                />
                <InputField
                  label="Program"
                  value={profile.program}
                  onChange={(value) =>
                    setProfile((prev) => ({ ...prev, program: value }))
                  }
                />
                <InputField
                  label="Nationality"
                  value={profile.nationality}
                  onChange={(value) =>
                    setProfile((prev) => ({ ...prev, nationality: value }))
                  }
                />
                <InputField
                  label="Current Country"
                  value={profile.currentCountry}
                  onChange={(value) =>
                    setProfile((prev) => ({ ...prev, currentCountry: value }))
                  }
                />
                <InputField
                  label="Budget"
                  value={profile.yearlyBudget}
                  onChange={(value) =>
                    setProfile((prev) => ({ ...prev, yearlyBudget: value }))
                  }
                  type="number"
                />
                <SelectField
                  label="Currency"
                  value={profile.currency}
                  onChange={(value) =>
                    setProfile((prev) => ({ ...prev, currency: value }))
                  }
                  options={[
                    { label: "USD", value: "USD" },
                    { label: "NPR", value: "NPR" },
                    { label: "CAD", value: "CAD" },
                    { label: "AUD", value: "AUD" },
                    { label: "EUR", value: "EUR" },
                  ]}
                />
                <SelectField
                  label="English Test Taken"
                  value={englishTestTakenValue}
                  onChange={handleEnglishTestTakenChange}
                  options={[
                    { label: "Not specified", value: "unknown" },
                    { label: "Yes", value: "yes" },
                    { label: "No", value: "no" },
                  ]}
                />
                <InputField
                  label="Test Type"
                  value={profile.testType}
                  onChange={(value) =>
                    setProfile((prev) => ({ ...prev, testType: value }))
                  }
                  placeholder="IELTS, TOEFL..."
                />
                <InputField
                  label="Test Score"
                  value={profile.englishScore}
                  onChange={(value) =>
                    setProfile((prev) => ({ ...prev, englishScore: value }))
                  }
                />
                <InputField
                  label="Highest Education"
                  value={profile.highestEducation}
                  onChange={(value) =>
                    setProfile((prev) => ({ ...prev, highestEducation: value }))
                  }
                />
                <InputField
                  label="GPA"
                  value={profile.gpa}
                  onChange={(value) =>
                    setProfile((prev) => ({ ...prev, gpa: value }))
                  }
                />
                <InputField
                  label="Passing Year"
                  value={profile.passingYear}
                  onChange={(value) =>
                    setProfile((prev) => ({ ...prev, passingYear: value }))
                  }
                />
                <InputField
                  label="Backlogs"
                  value={profile.backlogs}
                  onChange={(value) =>
                    setProfile((prev) => ({ ...prev, backlogs: value }))
                  }
                  type="number"
                />
                <InputField
                  label="Study Gap (Years)"
                  value={profile.studyGap}
                  onChange={(value) =>
                    setProfile((prev) => ({ ...prev, studyGap: value }))
                  }
                  type="number"
                />
              </div>
            </div>
          )}
        </section>

        <section className="grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Saved Plans
            </p>
            <p className="mt-2 text-3xl font-bold text-blue-600">
              {matchingRecords.length}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Saved university and estimate snapshots
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Profile Completion
            </p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {Math.max(0, 100 - missingCriticalFields * 20)}%
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Based on key overview fields
            </p>
          </div>

          <Link
            href="/matches"
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-blue-200 hover:bg-blue-50/30"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Continue Journey
            </p>
            <p className="mt-2 flex items-center text-lg font-bold text-slate-900">
              Go to Matches
              <Target className="ml-2 h-4 w-4 text-blue-600" />
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Resume recommendations and admissions analysis
            </p>
          </Link>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Additional Information
            </h3>
            <Link
              href="/profile/additional-information"
              className="inline-flex items-center rounded-xl border border-blue-200 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50"
            >
              Open Detailed Form
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Account Name
              </p>
              <p className="mt-1 text-base font-semibold text-slate-900">
                {profile.name || "Not specified"}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Username
              </p>
              <p className="mt-1 text-base font-semibold text-slate-900">
                {profile.username || "Not specified"}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Email
              </p>
              <p className="mt-1 text-base font-semibold text-slate-900">
                {profile.email || "Not specified"}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Program Focus
              </p>
              <p className="mt-1 text-base font-semibold text-slate-900">
                {[profile.field, profile.program].filter(Boolean).join(" • ") ||
                  "Not specified"}
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
