"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { AlertCircle, Eye, EyeOff } from "lucide-react";

type CountryCodeOption = {
  code: string;
  label: string;
  dialCode: string;
};

const FALLBACK_COUNTRY_CODES: CountryCodeOption[] = [
  { code: "US", label: "United States", dialCode: "+1" },
  { code: "GB", label: "United Kingdom", dialCode: "+44" },
  { code: "CA", label: "Canada", dialCode: "+1" },
  { code: "IN", label: "India", dialCode: "+91" },
  { code: "AU", label: "Australia", dialCode: "+61" },
  { code: "NP", label: "Nepal", dialCode: "+977" },
  { code: "BD", label: "Bangladesh", dialCode: "+880" },
  { code: "PK", label: "Pakistan", dialCode: "+92" },
  { code: "NG", label: "Nigeria", dialCode: "+234" },
  { code: "AE", label: "United Arab Emirates", dialCode: "+971" },
];

function buildCountryCodeOptions(data: unknown): CountryCodeOption[] {
  if (!Array.isArray(data)) {
    return [];
  }

  const options: CountryCodeOption[] = [];

  for (const item of data) {
    const country = item as {
      name?: { common?: string };
      idd?: { root?: string; suffixes?: string[] };
      cca2?: string;
    };

    const name = country.name?.common;
    const code = country.cca2;
    const root = country.idd?.root;
    const suffixes = country.idd?.suffixes;

    if (!name || !code || !root || !Array.isArray(suffixes)) {
      continue;
    }

    for (const suffix of suffixes) {
      const dialCode = `${root}${suffix}`;
      if (!/^\+\d+$/.test(dialCode)) {
        continue;
      }

      options.push({
        code,
        label: name,
        dialCode,
      });
    }
  }

  return options.sort((a, b) => a.label.localeCompare(b.label));
}

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [agreed, setAgreed] = useState(false);
  const [countryCodes, setCountryCodes] = useState<CountryCodeOption[]>(
    FALLBACK_COUNTRY_CODES,
  );

  const [form, setForm] = useState({
    username: "",
    email: "",
    countryDialCode: "+1",
    phone: "",
    prefersWhatsApp: true,
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const controller = new AbortController();

    const loadCountryCodes = async () => {
      try {
        const response = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,idd,cca2",
          { signal: controller.signal },
        );

        if (!response.ok) {
          return;
        }

        const data = await response.json();
        const options = buildCountryCodeOptions(data);

        if (options.length > 0) {
          setCountryCodes(options);
        }
      } catch {
        // Keep fallback list when the API is unavailable.
      }
    };

    loadCountryCodes();

    return () => controller.abort();
  }, []);

  const handleChange = (k: string, v: string) => {
    setForm((p) => ({ ...p, [k]: v }));
    setErrors((p) => ({ ...p, [k]: "" }));
    setServerError("");
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.username.trim()) e.username = "Username required.";
    if (!form.email.trim()) e.email = "Email required.";
    if (!form.countryDialCode.trim())
      e.countryDialCode = "Country code required.";
    if (!form.phone.trim()) e.phone = "Phone number required.";
    if (!/^\d{6,15}$/.test(form.phone.replaceAll(/\D/g, ""))) {
      e.phone = "Enter a valid phone number.";
    }
    if (!form.password) e.password = "Password required.";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Mismatch.";
    if (!agreed) e.agreed = "Required.";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setServerError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          phoneNumber: form.phone,
          name: form.username,
          username: form.username.toLowerCase(),
          email: form.email.toLowerCase(),
          nationality: "",
          currentCountry: "",
          gpa: "",
          preferredCountry: "",
          degreeLevel: "",
          fieldOfStudy: "",
          englishTestType: "None",
          englishScore: "0",
          yearlyBudget: "0",
          currency: "USD",
          scholarshipNeeded: false,
          intake: "",
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setServerError(data.error || "Registration failed.");
        return;
      }

      const data = await res.json();
      const otpChannel = data?.otp?.channel;
      const channelParam = otpChannel
        ? `&otpChannel=${otpChannel.toLowerCase()}`
        : "";
      
      const callbackParam = callbackUrl ? `&callbackUrl=${encodeURIComponent(callbackUrl)}` : "";
      
      router.push(`/login?registered=1&otp=1${channelParam}${callbackParam}`);
    } catch {
      setServerError("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-poppins">
      <div className="flex-1 flex flex-col lg:flex-row relative">
        {/* Left Side: Premium Image for Desktop */}
        <div className="hidden lg:block lg:w-[50%] xl:w-[55%] relative overflow-hidden">
          <Image
            src="/signup-bg.png"
            alt="University Campus"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-r from-black/10 to-transparent" />
          <div className="absolute bottom-12 left-12 right-12 z-10 text-white drop-shadow-lg">
            <h2 className="text-4xl font-bold mb-4">Dream Big. Go Global.</h2>
            <p className="text-lg opacity-90 max-w-md">
              Your future starts here. Join thousands of students who found
              their perfect university match with AbroadLift.
            </p>
          </div>
        </div>

        {/* Right Side: Form Container */}
        <div className="flex-1 relative flex items-center justify-center p-6 lg:bg-[#F9FAFB] overflow-hidden">
          {/* Decorative element for desktop transition */}
          <div
            className="absolute left-[-100px] top-0 bottom-0 w-[200px] bg-[#F9FAFB] hidden lg:block"
            style={{
              clipPath: "polygon(100% 0, 0 0, 100% 100%)",
            }}
          />

          <div className="w-full max-w-[400px] flex flex-col items-center py-4 fade-up lg:mt-0 relative z-10">
            {/* Title */}
            <h1 className="text-[34px] font-semibold text-[#0f172a] mb-12 leading-[1.1] tracking-tight text-center">
              Create New Account
            </h1>

            {/* Error Notification */}
            {serverError && (
              <div className="w-full mb-4 bg-red-50 text-red-600 px-4 py-3 rounded-2xl flex items-center gap-2 text-xs font-bold border border-red-100">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="w-full space-y-4">
              <InputField
                placeholder="Username"
                value={form.username}
                error={errors.username}
                onChange={(v) => handleChange("username", v)}
              />
              <InputField
                placeholder="example@gmail.com"
                type="email"
                value={form.email}
                error={errors.email}
                onChange={(v) => handleChange("email", v)}
              />
              <div className="w-full">
                <div className="grid grid-cols-[1fr_2fr] gap-2">
                  <div>
                    <select
                      value={form.countryDialCode}
                      onChange={(e) =>
                        handleChange("countryDialCode", e.target.value)
                      }
                      className="w-full h-[56px] bg-[#F4F4F4] border-none rounded-[20px] px-3 text-[14px] font-regular text-[#1e293b] outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
                    >
                      {countryCodes.map((country) => (
                        <option
                          key={`${country.code}-${country.dialCode}`}
                          value={country.dialCode}
                        >
                          {country.label} ({country.dialCode})
                        </option>
                      ))}
                    </select>
                  </div>
                  <InputField
                    placeholder="Phone number"
                    type="tel"
                    value={form.phone}
                    error={errors.phone}
                    onChange={(v) => handleChange("phone", v)}
                  />
                </div>
                {errors.countryDialCode && (
                  <p className="mt-1 text-[10px] text-red-500 font-bold px-2">
                    {errors.countryDialCode}
                  </p>
                )}
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={form.prefersWhatsApp}
                      onChange={() =>
                        setForm((p) => ({
                          ...p,
                          prefersWhatsApp: !p.prefersWhatsApp,
                        }))
                      }
                      className="peer appearance-none w-5 h-5 border-2 border-black rounded-md checked:bg-black checked:border-black cursor-pointer transition-all hover:border-gray-300"
                    />
                    <svg
                      className="absolute left-[2.5px] w-4 h-4 text-white scale-0 peer-checked:scale-100 transition-transform pointer-events-none"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-[13px] font-regular text-black select-none">
                    Send OTP on WhatsApp first (fallback to SMS automatically)
                  </span>
                </label>
              </div>
              <InputField
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                error={errors.password}
                onChange={(v) => handleChange("password", v)}
                suffix={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-300 hover:text-gray-500 pr-2 pt-1"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                }
              />
              <InputField
                placeholder="Confirm password"
                type={showPassword ? "text" : "password"}
                value={form.confirmPassword}
                error={errors.confirmPassword}
                onChange={(v) => handleChange("confirmPassword", v)}
              />

              {/* Terms & Conditions */}
              <div className="pt-2">
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={() => setAgreed(!agreed)}
                      className="peer appearance-none w-5 h-5 border-2 border-black rounded-md checked:bg-black checked:border-black cursor-pointer transition-all hover:border-gray-300"
                    />
                    <svg
                      className="absolute left-[2.5px] w-4 h-4 text-white scale-0 peer-checked:scale-100 transition-transform pointer-events-none"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-[14px] font-regular text-black select-none">
                    Agree with{" "}
                    <Link
                      href="/terms"
                      className="text-gray-700 underline decoration-gray-300 underline-offset-4"
                    >
                      Terms & Conditions
                    </Link>
                  </span>
                </label>
                {errors.agreed && (
                  <p className="text-[10px] text-red-500 font-bold mt-1.5 px-1">
                    {errors.agreed}
                  </p>
                )}
              </div>

              {/* Register Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full h-[60px] bg-[#3381FF] text-white font-bold rounded-[30px] text-[16px] shadow-sm hover:bg-[#2970E6] transition-all active:scale-[0.98] disabled:opacity-70 mt-2"
              >
                {submitting ? "Processing..." : "Register"}
              </button>
            </form>

            {/* Divider */}
            <div className="w-full mt-6 mb-5 flex items-center justify-center">
              <div className="h-px flex-1 bg-gray-100" />
              <span className="px-4 text-[16px] font-regular text-black tracking-widest uppercase">
                OR
              </span>
              <div className="h-px flex-1 bg-gray-100" />
            </div>

            {/* Social Options */}
            <div className="flex gap-4 mb-3">
              <SocialButton icon={<GoogleIcon />} />
              <SocialButton icon={<AppleIcon />} />
              <SocialButton icon={<FacebookLogo />} />
            </div>

            {/* Footer */}
            <p className="text-[14px] font-regular text-black">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-[#3381FF] font-bold hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#3381FF]/30 border-t-[#3381FF] rounded-full animate-spin" />
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}


function InputField({
  placeholder,
  value,
  onChange,
  type = "text",
  error,
  suffix,
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  error?: string;
  suffix?: React.ReactNode;
}) {
  return (
    <div className="w-full">
      <div className="relative">
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full h-[56px] bg-[#F4F4F4] border-none rounded-[20px] px-6 text-[16px] font-regular text-[#1e293b] placeholder:text-[#666666] outline-none focus:ring-2 focus:ring-blue-500/10 transition-all`}
        />
        {suffix && (
          <div className="absolute right-5 top-1/2 -translate-y-1/2">
            {suffix}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-[10px] text-red-500 font-bold px-2">{error}</p>
      )}
    </div>
  );
}

function SocialButton({ icon }: { icon: React.ReactNode }) {
  return (
    <button className="w-[56px] h-[56px] rounded-full border border-gray-100 flex items-center justify-center hover:bg-gray-100 transition-all active:scale-95">
      {icon}
    </button>
  );
}

function GoogleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.83z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83c.87-2.6 3.3-4.52 6.16-4.52z"
        fill="#EA4335"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z" />
    </svg>
  );
}

function FacebookLogo() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M14 8h2V5h-2c-2.21 0-4 1.79-4 4v2H8v3h2v5h3v-5h2.5l.5-3H13V9c0-.55.45-1 1-1z"
        fill="#1877F2"
      />
    </svg>
  );
}
