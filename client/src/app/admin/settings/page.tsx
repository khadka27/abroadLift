"use client";

import { useState, useEffect } from "react";
import {
  Save,
  Loader2,
  Settings as SettingsIcon,
  Globe,
  Bell,
  ShieldAlert,
  Mail,
  ToggleLeft
} from "lucide-react";
import { Card } from "@/components/ui/card";

export default function PlatformSettings() {
  const [settings, setSettings] = useState<any>({
    platformName: "AbroadLift",
    maintenanceMode: false,
    requireEmailVerification: true,
    allowNewRegistrations: true,
    contactEmail: "admin@abroadlift.com",
    maxApplicationsPerStudent: 5,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("GENERAL");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      if (res.ok) {
        const data = await res.json();
        if (Object.keys(data).length > 0) {
          setSettings({ ...settings, ...data });
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        // Show success toast here in real app
        alert("Settings saved successfully");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#3366FF] animate-spin" />
      </div>
    );
  }

  const tabs = [
    { id: "GENERAL", label: "General", icon: Globe },
    { id: "SECURITY", label: "Security & Access", icon: ShieldAlert },
    { id: "EMAILS", label: "Email Templates", icon: Mail },
    { id: "NOTIFICATIONS", label: "Notifications", icon: Bell },
  ];

  return (
    <div className="p-8 lg:p-12 max-w-[1200px] mx-auto space-y-8 selection:bg-[#3366FF]/10 font-sans">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 select-none">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-none">
            Platform Configuration
          </h1>
          <p className="text-slate-400 font-semibold text-sm mt-3.5 leading-relaxed">
            Manage global platform properties, security behavior, and student metrics limits.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-650 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-blue-500/15 disabled:opacity-50 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 shrink-0"
        >
          {saving ? <Loader2 className="w-4.5 h-4.5 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <Card className="w-full lg:w-80 shrink-0 p-4 rounded-[28px] border border-slate-100 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.02)] bg-white h-fit select-none">
          <nav className="space-y-1.5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-blue-50/70 text-blue-600 border border-blue-150/20"
                    : "text-slate-455 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                <tab.icon className={`w-4.5 h-4.5 ${activeTab === tab.id ? "text-blue-500" : "text-slate-400"}`} />
                {tab.label}
              </button>
            ))}
          </nav>
        </Card>

        <Card className="flex-1 p-8 rounded-[28px] border border-slate-100 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.02)] bg-white">
          {activeTab === "GENERAL" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="flex items-center gap-3.5 mb-8 select-none">
                <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                  <Globe className="w-5.5 h-5.5" />
                </div>
                <h2 className="text-xl font-extrabold text-slate-900">General Settings</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Platform Name</label>
                  <input
                    type="text"
                    value={settings.platformName}
                    onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                    className="w-full h-12 bg-slate-50/50 border border-slate-200/80 rounded-2xl px-5 font-bold text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all"
                  />
                </div>
                
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Support Email</label>
                  <input
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                    className="w-full h-12 bg-slate-50/50 border border-slate-200/80 rounded-2xl px-5 font-bold text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Max Applications Per Student</label>
                  <input
                    type="number"
                    value={settings.maxApplicationsPerStudent}
                    onChange={(e) => setSettings({ ...settings, maxApplicationsPerStudent: parseInt(e.target.value) })}
                    className="w-full h-12 bg-slate-50/50 border border-slate-200/80 rounded-2xl px-5 font-bold text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "SECURITY" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="flex items-center gap-3.5 mb-8 select-none">
                <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                  <ShieldAlert className="w-5.5 h-5.5" />
                </div>
                <h2 className="text-xl font-extrabold text-slate-900">Security & Access</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-6 bg-[#fafbfc]/50 rounded-2xl border border-slate-100">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Maintenance Mode</h4>
                    <p className="text-xs font-semibold text-slate-400 mt-1.5">Disables access for all non-admin users.</p>
                  </div>
                  <button 
                    onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
                    className={`w-14 h-8 rounded-full relative transition-colors cursor-pointer ${settings.maintenanceMode ? 'bg-[#3366FF]' : 'bg-slate-200'}`}
                  >
                    <div className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-transform ${settings.maintenanceMode ? 'translate-x-7' : 'translate-x-1'}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-6 bg-[#fafbfc]/50 rounded-2xl border border-slate-100">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Allow New Registrations</h4>
                    <p className="text-xs font-semibold text-slate-400 mt-1.5">Enable or disable new user signups.</p>
                  </div>
                  <button 
                    onClick={() => setSettings({ ...settings, allowNewRegistrations: !settings.allowNewRegistrations })}
                    className={`w-14 h-8 rounded-full relative transition-colors cursor-pointer ${settings.allowNewRegistrations ? 'bg-emerald-500' : 'bg-slate-200'}`}
                  >
                    <div className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-transform ${settings.allowNewRegistrations ? 'translate-x-7' : 'translate-x-1'}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-6 bg-[#fafbfc]/50 rounded-2xl border border-slate-100">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Require Phone Verification</h4>
                    <p className="text-xs font-semibold text-slate-400 mt-1.5">Mandate OTP verification before profile access.</p>
                  </div>
                  <button 
                    onClick={() => setSettings({ ...settings, requireEmailVerification: !settings.requireEmailVerification })}
                    className={`w-14 h-8 rounded-full relative transition-colors cursor-pointer ${settings.requireEmailVerification ? 'bg-emerald-500' : 'bg-slate-200'}`}
                  >
                    <div className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-transform ${settings.requireEmailVerification ? 'translate-x-7' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {(activeTab === "EMAILS" || activeTab === "NOTIFICATIONS") && (
            <div className="h-[400px] flex flex-col items-center justify-center text-center animate-in fade-in duration-300 select-none">
              <ToggleLeft className="w-16 h-16 text-slate-200 mb-6" />
              <h3 className="text-2xl font-black text-slate-900">Under Construction</h3>
              <p className="text-slate-400 font-semibold max-w-sm mt-2.5 text-xs leading-relaxed">
                This configuration module is currently being integrated with our third-party communication providers.
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
