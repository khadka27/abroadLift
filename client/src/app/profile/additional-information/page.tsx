"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Circle,
  Plus,
} from "lucide-react";

type AdditionalInfoForm = {
  email: string;
  phoneNumber: string;
  countryDialCode: string;
  phoneVerified: boolean;
  firstName: string;
  middleName: string;
  lastName: string;
  dob: string;
  firstLanguage: string;
  citizenshipCountry: string;
  passportNumber: string;
  passportExpiryDate: string;
  maritalStatus: "Single" | "Married" | "";
  gender: "Male" | "Female" | "";
  addressLine: string;
  cityTown: string;
  country: string;
  provinceState: string;
  postalZipCode: string;
  countryOfEducation: string;
  highestEducation: string;
  gradeAverage: string;
  graduatedInstitution: boolean;
};

const COUNTRY_OPTIONS = [
  "Nepal",
  "India",
  "Canada",
  "United States",
  "United Kingdom",
  "Australia",
  "Germany",
  "Ireland",
  "New Zealand",
];

const EDUCATION_LEVEL_OPTIONS = [
  "High School",
  "Diploma",
  "Bachelor's Degree",
  "Master's Degree",
  "Doctoral Degree",
];

const PROVINCE_OPTIONS = [
  "Province 1",
  "Madhesh",
  "Bagmati",
  "Gandaki",
  "Lumbini",
  "Karnali",
  "Sudurpashchim",
];

const REQUIRED_FIELDS: Array<keyof AdditionalInfoForm> = [
  "firstName",
  "lastName",
  "dob",
  "firstLanguage",
  "citizenshipCountry",
  "passportNumber",
  "passportExpiryDate",
  "maritalStatus",
  "gender",
  "addressLine",
  "cityTown",
  "country",
  "provinceState",
  "countryOfEducation",
  "highestEducation",
  "gradeAverage",
];

function defaultForm(): AdditionalInfoForm {
  return {
    email: "",
    phoneNumber: "",
    countryDialCode: "+1",
    phoneVerified: false,
    firstName: "",
    middleName: "",
    lastName: "",
    dob: "",
    firstLanguage: "",
    citizenshipCountry: "Nepal",
    passportNumber: "",
    passportExpiryDate: "",
    maritalStatus: "",
    gender: "",
    addressLine: "",
    cityTown: "",
    country: "Nepal",
    provinceState: "",
    postalZipCode: "",
    countryOfEducation: "",
    highestEducation: "",
    gradeAverage: "",
    graduatedInstitution: true,
  };
}

function splitName(fullName: string) {
  const [first = "", ...rest] = (fullName || "").trim().split(" ");
  if (!first) return { firstName: "", lastName: "" };
  return {
    firstName: first,
    lastName: rest.join(" "),
  };
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function FieldLabel({
  label,
  required = false,
}: {
  label: string;
  required?: boolean;
}) {
  return (
    <label className="mb-2 block text-[18px] font-semibold text-[#1E3356]">
      {label}
      {required && <span className="ml-1 text-[#E65A6E]">*</span>}
    </label>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  hasError,
  type = "text",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hasError?: boolean;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className={cx(
        "h-[58px] w-full rounded-3xl border bg-white px-5 text-[32px] font-medium text-[#2A3F63] outline-none transition",
        hasError
          ? "border-[#F199A6] focus:border-[#E65A6E]"
          : "border-[#C8D4E8] focus:border-[#6C83B5]",
      )}
    />
  );
}

function SelectInput({
  value,
  onChange,
  options,
  placeholder,
  hasError,
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  hasError?: boolean;
}) {
  return (
    <div className={cx("relative", hasError && "rounded-3xl")}>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cx(
          "h-[58px] w-full appearance-none rounded-3xl border bg-white px-5 pr-14 text-[32px] font-medium text-[#2A3F63] outline-none transition",
          hasError
            ? "border-[#F199A6] focus:border-[#E65A6E]"
            : "border-[#C8D4E8] focus:border-[#6C83B5]",
        )}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#4C5D7B]" />
    </div>
  );
}

function ValidationMessage({ show, text }: { show: boolean; text: string }) {
  if (!show) return null;
  return (
    <p className="mt-2 flex items-center gap-2 text-[20px] font-medium text-[#E86A79]">
      <AlertCircle className="h-5 w-5" />
      {text}
    </p>
  );
}

export default function AdditionalInformationPage() {
  const router = useRouter();
  const { status } = useSession();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<AdditionalInfoForm>(defaultForm());
  const [showErrors, setShowErrors] = useState(false);
  const [openSection, setOpenSection] = useState({
    personal: true,
    address: true,
    education: true,
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
      return;
    }

    if (status === "authenticated") {
      void loadProfile();
    }
  }, [status, router]);

  const loadProfile = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/profile");
      if (!res.ok) {
        setError("Unable to load additional information.");
        return;
      }

      const data = await res.json();
      const p = data.profile || {};
      const names = splitName(data.name || "");

      setForm({
        email: data.email || "",
        phoneNumber: data.phoneNumber || "",
        countryDialCode: data.countryDialCode || "+1",
        phoneVerified: !!data.phoneVerified,
        firstName: names.firstName,
        middleName: p.middleName || "",
        lastName: names.lastName,
        dob: p.dob || "",
        firstLanguage: p.firstLanguage || "",
        citizenshipCountry: p.citizenshipCountry || p.nationality || "Nepal",
        passportNumber: p.passportNumber || "",
        passportExpiryDate: p.passportExpiryDate || "",
        maritalStatus: p.maritalStatus || "",
        gender: p.gender || "",
        addressLine: p.addressLine || "",
        cityTown: p.cityTown || "",
        country: p.currentCountry || "Nepal",
        provinceState: p.provinceState || "",
        postalZipCode: p.postalZipCode || "",
        countryOfEducation: p.countryOfEducation || "",
        highestEducation: p.highestEducation || "",
        gradeAverage: p.gpa?.toString() || "",
        graduatedInstitution: p.graduatedInstitution ?? true,
      });
    } catch {
      setError("Unable to load additional information.");
    } finally {
      setLoading(false);
    }
  };

  const updateField = <K extends keyof AdditionalInfoForm>(
    key: K,
    value: AdditionalInfoForm[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const fieldError = (key: keyof AdditionalInfoForm) => {
    if (!showErrors || !REQUIRED_FIELDS.includes(key)) return false;
    const value = form[key];
    if (typeof value === "string") return !value.trim();
    return !value;
  };

  const missingRequiredCount = useMemo(() => {
    return REQUIRED_FIELDS.filter((key) => {
      const value = form[key];
      if (typeof value === "string") return !value.trim();
      return !value;
    }).length;
  }, [form]);

  const handleVerifyPhone = async () => {
    setError(
      "Phone verification flow is not enabled yet. Please continue with save for now.",
    );
  };

  const handleSave = async () => {
    setShowErrors(true);
    if (missingRequiredCount > 0) return;

    setSaving(true);
    setError("");

    try {
      const fullName = [form.firstName, form.middleName, form.lastName]
        .filter(Boolean)
        .join(" ")
        .trim();

      const payload = {
        name: fullName,
        email: form.email,
        nationality: form.citizenshipCountry,
        currentCountry: form.country,
        highestEducation: form.highestEducation,
        passingYear: "",
        gpa: form.gradeAverage,
        middleName: form.middleName,
        dob: form.dob,
        firstLanguage: form.firstLanguage,
        citizenshipCountry: form.citizenshipCountry,
        passportNumber: form.passportNumber,
        passportExpiryDate: form.passportExpiryDate,
        maritalStatus: form.maritalStatus,
        gender: form.gender,
        addressLine: form.addressLine,
        cityTown: form.cityTown,
        provinceState: form.provinceState,
        postalZipCode: form.postalZipCode,
        countryOfEducation: form.countryOfEducation,
        graduatedInstitution: form.graduatedInstitution,
      };

      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to save additional information.");
        return;
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setError("Something went wrong while saving.");
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-[#E7ECF3] flex items-center justify-center">
        <div className="h-10 w-10 rounded-full border-2 border-[#C6D3E8] border-t-[#5069AA] animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#DDE4EE] pt-28 pb-10 px-4 md:px-8">
      <div className="mx-auto max-w-[1240px] space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[30px] font-semibold text-[#23395D]">
              Additional Information
            </h1>
            <p className="mt-1 text-[20px] text-[#4C5D7B]">
              Complete your profile details to continue your study abroad
              journey.
            </p>
          </div>
          <Link
            href="/profile"
            className="rounded-2xl border border-[#B9C8DF] bg-white px-5 py-3 text-[20px] font-semibold text-[#2A3F63] hover:bg-[#F5F8FC]"
          >
            Back to Profile
          </Link>
        </div>

        {error && (
          <div className="rounded-2xl border border-[#F3B7C0] bg-[#FFF4F6] px-5 py-4 text-[18px] text-[#C14E61]">
            {error}
          </div>
        )}

        {saved && (
          <div className="rounded-2xl border border-[#C4E8D0] bg-[#ECFDF3] px-5 py-4 text-[18px] text-[#2A7A4E] flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            Additional information saved successfully.
          </div>
        )}

        <section className="rounded-[34px] border border-[#D1DCEB] bg-[#F2F5FA] px-8 py-7 shadow-[0_12px_35px_rgba(18,33,61,0.08)]">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-[40px] font-semibold text-[#23395D]">
              Personal Information
            </h2>
            <button
              type="button"
              onClick={() =>
                setOpenSection((prev) => ({
                  ...prev,
                  personal: !prev.personal,
                }))
              }
              className="text-[#1B2E4D]"
            >
              {openSection.personal ? (
                <ChevronUp className="h-6 w-6" />
              ) : (
                <ChevronDown className="h-6 w-6" />
              )}
            </button>
          </div>

          {openSection.personal && (
            <div className="space-y-6">
              <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
                <div>
                  <FieldLabel label="Email" required />
                  <TextInput
                    value={form.email}
                    onChange={(v) => updateField("email", v)}
                  />
                </div>
                <div className="self-end rounded-3xl bg-[#8EA1BF] px-7 py-3.5 text-[32px] font-semibold text-white">
                  Verified
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
                <div>
                  <FieldLabel label="Phone number" required />
                  <div className="grid grid-cols-[150px_1fr] gap-0">
                    <div className="h-[58px] rounded-l-3xl border border-r-0 border-[#C8D4E8] bg-white px-4 text-[28px] font-medium text-[#2A3F63] flex items-center gap-2">
                      +1
                      <ChevronDown className="h-4 w-4" />
                    </div>
                    <input
                      value={form.phoneNumber}
                      onChange={(event) =>
                        updateField("phoneNumber", event.target.value)
                      }
                      className="h-[58px] rounded-r-3xl border border-[#C8D4E8] bg-white px-5 text-[32px] font-medium text-[#2A3F63] outline-none"
                    />
                  </div>
                  {!form.phoneVerified && (
                    <p className="mt-2 text-[18px] text-[#916B2B]">
                      Please verify your phone number before saving changes
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleVerifyPhone}
                  className="self-end rounded-3xl bg-[#5F73CA] px-7 py-3.5 text-[32px] font-semibold text-white"
                >
                  Verify
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <FieldLabel label="First name" required />
                  <TextInput
                    value={form.firstName}
                    onChange={(v) => updateField("firstName", v)}
                    hasError={fieldError("firstName")}
                    placeholder="Name"
                  />
                  <ValidationMessage
                    show={fieldError("firstName")}
                    text="First name is required"
                  />
                </div>
                <div>
                  <FieldLabel label="Middle name" />
                  <TextInput
                    value={form.middleName}
                    onChange={(v) => updateField("middleName", v)}
                  />
                </div>
                <div>
                  <FieldLabel label="Last name" required />
                  <TextInput
                    value={form.lastName}
                    onChange={(v) => updateField("lastName", v)}
                    hasError={fieldError("lastName")}
                  />
                  <ValidationMessage
                    show={fieldError("lastName")}
                    text="Last name is required"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <FieldLabel label="Date of birth" required />
                  <TextInput
                    value={form.dob}
                    onChange={(v) => updateField("dob", v)}
                    hasError={fieldError("dob")}
                    placeholder="YYYY-MM-DD"
                  />
                  <ValidationMessage
                    show={fieldError("dob")}
                    text="Date of birth is required"
                  />
                </div>
                <div>
                  <FieldLabel label="First language" required />
                  <TextInput
                    value={form.firstLanguage}
                    onChange={(v) => updateField("firstLanguage", v)}
                    hasError={fieldError("firstLanguage")}
                  />
                  <ValidationMessage
                    show={fieldError("firstLanguage")}
                    text="First language is required"
                  />
                </div>
                <div>
                  <FieldLabel label="Country of citizenship" required />
                  <SelectInput
                    value={form.citizenshipCountry}
                    onChange={(v) => updateField("citizenshipCountry", v)}
                    options={COUNTRY_OPTIONS}
                    hasError={fieldError("citizenshipCountry")}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <FieldLabel label="Passport number" required />
                  <TextInput
                    value={form.passportNumber}
                    onChange={(v) => updateField("passportNumber", v)}
                    hasError={fieldError("passportNumber")}
                  />
                  <ValidationMessage
                    show={fieldError("passportNumber")}
                    text="Passport number is required"
                  />
                </div>
                <div>
                  <FieldLabel label="Passport expiry date" required />
                  <TextInput
                    value={form.passportExpiryDate}
                    onChange={(v) => updateField("passportExpiryDate", v)}
                    hasError={fieldError("passportExpiryDate")}
                    placeholder="YYYY-MM-DD"
                  />
                  <ValidationMessage
                    show={fieldError("passportExpiryDate")}
                    text="Passport expiry date is required"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <FieldLabel label="Marital Status" required />
                  <div className="grid grid-cols-2 gap-3">
                    {(["Single", "Married"] as const).map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => updateField("maritalStatus", value)}
                        className="flex h-[58px] items-center gap-3 rounded-3xl border border-[#C8D4E8] bg-white px-4 text-[32px] text-[#2A3F63]"
                      >
                        {form.maritalStatus === value ? (
                          <CheckCircle2 className="h-6 w-6 text-[#5C73C9]" />
                        ) : (
                          <Circle className="h-6 w-6 text-[#5C73C9]" />
                        )}
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <FieldLabel label="Gender" required />
                  <div className="grid grid-cols-2 gap-3">
                    {(["Male", "Female"] as const).map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => updateField("gender", value)}
                        className="flex h-[58px] items-center gap-3 rounded-3xl border border-[#C8D4E8] bg-white px-4 text-[32px] text-[#2A3F63]"
                      >
                        {form.gender === value ? (
                          <CheckCircle2 className="h-6 w-6 text-[#5C73C9]" />
                        ) : (
                          <Circle className="h-6 w-6 text-[#5C73C9]" />
                        )}
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        <section className="rounded-[34px] border border-[#D1DCEB] bg-[#F2F5FA] px-8 py-7 shadow-[0_12px_35px_rgba(18,33,61,0.08)]">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-[40px] font-semibold text-[#23395D]">
              Address Detail
            </h2>
            <button
              type="button"
              onClick={() =>
                setOpenSection((prev) => ({ ...prev, address: !prev.address }))
              }
              className="text-[#1B2E4D]"
            >
              {openSection.address ? (
                <ChevronUp className="h-6 w-6" />
              ) : (
                <ChevronDown className="h-6 w-6" />
              )}
            </button>
          </div>

          {openSection.address && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
              <div className="lg:col-span-3">
                <FieldLabel label="Address" required />
                <TextInput
                  value={form.addressLine}
                  onChange={(v) => updateField("addressLine", v)}
                  hasError={fieldError("addressLine")}
                />
              </div>
              <div className="lg:col-span-3">
                <FieldLabel label="City/ Town" required />
                <TextInput
                  value={form.cityTown}
                  onChange={(v) => updateField("cityTown", v)}
                  hasError={fieldError("cityTown")}
                />
              </div>
              <div className="lg:col-span-2">
                <FieldLabel label="Country" required />
                <SelectInput
                  value={form.country}
                  onChange={(v) => updateField("country", v)}
                  options={COUNTRY_OPTIONS}
                  hasError={fieldError("country")}
                />
              </div>
              <div className="lg:col-span-2">
                <FieldLabel label="Province/ State" required />
                <SelectInput
                  value={form.provinceState}
                  onChange={(v) => updateField("provinceState", v)}
                  options={PROVINCE_OPTIONS}
                  placeholder="Select province/state"
                  hasError={fieldError("provinceState")}
                />
              </div>
              <div className="lg:col-span-2">
                <FieldLabel label="Postal/ Zip Code" />
                <TextInput
                  value={form.postalZipCode}
                  onChange={(v) => updateField("postalZipCode", v)}
                  placeholder="Enter postal code..."
                />
              </div>
            </div>
          )}
        </section>

        <section className="rounded-[34px] border border-[#D1DCEB] bg-[#F2F5FA] px-8 py-7 shadow-[0_12px_35px_rgba(18,33,61,0.08)]">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-[40px] font-semibold text-[#23395D]">
              Education Summary
            </h2>
            <button
              type="button"
              onClick={() =>
                setOpenSection((prev) => ({
                  ...prev,
                  education: !prev.education,
                }))
              }
              className="text-[#1B2E4D]"
            >
              {openSection.education ? (
                <ChevronUp className="h-6 w-6" />
              ) : (
                <ChevronDown className="h-6 w-6" />
              )}
            </button>
          </div>

          {openSection.education && (
            <div className="space-y-5">
              <p className="text-[22px] text-[#2F476F]">
                Please enter the information for the highest academic level that
                you have completed.
              </p>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <FieldLabel label="Country of education" required />
                  <SelectInput
                    value={form.countryOfEducation}
                    onChange={(v) => updateField("countryOfEducation", v)}
                    options={COUNTRY_OPTIONS}
                    placeholder="Select country"
                    hasError={fieldError("countryOfEducation")}
                  />
                </div>
                <div>
                  <FieldLabel label="Highest Level of Education" required />
                  <SelectInput
                    value={form.highestEducation}
                    onChange={(v) => updateField("highestEducation", v)}
                    options={EDUCATION_LEVEL_OPTIONS}
                    placeholder="Select highest level of education..."
                    hasError={fieldError("highestEducation")}
                  />
                </div>
                <div>
                  <FieldLabel label="Grade average (Scale: 1-100)" required />
                  <TextInput
                    value={form.gradeAverage}
                    onChange={(v) => updateField("gradeAverage", v)}
                    hasError={fieldError("gradeAverage")}
                  />
                </div>
              </div>

              <div>
                <FieldLabel
                  label="I have graduated from this institution"
                  required
                />
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => updateField("graduatedInstitution", true)}
                    className="flex h-[58px] items-center gap-3 rounded-3xl border border-[#C8D4E8] bg-white px-4 text-[32px] text-[#2A3F63]"
                  >
                    {form.graduatedInstitution ? (
                      <CheckCircle2 className="h-6 w-6 text-[#5C73C9]" />
                    ) : (
                      <Circle className="h-6 w-6 text-[#5C73C9]" />
                    )}
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => updateField("graduatedInstitution", false)}
                    className="flex h-[58px] items-center gap-3 rounded-3xl border border-[#C8D4E8] bg-white px-4 text-[32px] text-[#2A3F63]"
                  >
                    {!form.graduatedInstitution ? (
                      <CheckCircle2 className="h-6 w-6 text-[#5C73C9]" />
                    ) : (
                      <Circle className="h-6 w-6 text-[#5C73C9]" />
                    )}
                    No
                  </button>
                </div>
              </div>

              <button
                type="button"
                className="flex h-[58px] w-full items-center justify-center gap-3 rounded-3xl border border-[#B9C8DF] bg-[#E3E9F6] text-[34px] font-semibold text-[#5C73C9]"
              >
                <Plus className="h-6 w-6" />
                Add Attended School
              </button>
            </div>
          )}
        </section>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="h-[60px] min-w-[420px] rounded-3xl bg-[#8EA1BF] px-7 text-[34px] font-semibold text-white disabled:opacity-70"
          >
            {saving ? "Saving..." : "Save & Continue"}
          </button>
        </div>
      </div>
    </main>
  );
}
