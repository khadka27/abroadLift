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
        <Loader2 className="w-12 h-12 text-rose-500 animate-spin" />
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
    <div className="p-8 lg:p-12 max-w-[1200px] mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Platform Configuration
          </h1>
          <p className="text-slate-500 font-medium text-lg mt-2">
            Manage global settings and application behavior.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-8 py-4 bg-slate-900 hover:bg-rose-500 text-white rounded-2xl font-black uppercase tracking-widest text-sm transition-all shadow-xl shadow-slate-900/20 disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <Card className="w-full lg:w-80 shrink-0 p-4 rounded-[32px] border-none shadow-xl shadow-slate-200/50 bg-white h-fit">
          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${
                  activeTab === tab.id
                    ? "bg-rose-50 text-rose-600"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? "text-rose-500" : "text-slate-400"}`} />
                {tab.label}
              </button>
            ))}
          </nav>
        </Card>

        <Card className="flex-1 p-8 rounded-[32px] border-none shadow-xl shadow-slate-200/50 bg-white">
          {activeTab === "GENERAL" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600">
                  <Globe className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black text-slate-900">General Settings</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Platform Name</label>
                  <input
                    type="text"
                    value={settings.platformName}
                    onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                    className="w-full h-14 bg-slate-50 border border-slate-200 rounded-2xl px-6 font-bold text-slate-700 outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-100 transition-all"
                  />
                </div>
                
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Support Email</label>
                  <input
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                    className="w-full h-14 bg-slate-50 border border-slate-200 rounded-2xl px-6 font-bold text-slate-700 outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-100 transition-all"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Max Applications Per Student</label>
                  <input
                    type="number"
                    value={settings.maxApplicationsPerStudent}
                    onChange={(e) => setSettings({ ...settings, maxApplicationsPerStudent: parseInt(e.target.value) })}
                    className="w-full h-14 bg-slate-50 border border-slate-200 rounded-2xl px-6 font-bold text-slate-700 outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-100 transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "SECURITY" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-white">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black text-slate-900">Security & Access</h2>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <div>
                    <h4 className="font-bold text-slate-900">Maintenance Mode</h4>
                    <p className="text-sm font-medium text-slate-500 mt-1">Disables access for all non-admin users.</p>
                  </div>
                  <button 
                    onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
                    className={`w-14 h-8 rounded-full relative transition-colors ${settings.maintenanceMode ? 'bg-rose-500' : 'bg-slate-300'}`}
                  >
                    <div className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-transform ${settings.maintenanceMode ? 'translate-x-7' : 'translate-x-1'}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <div>
                    <h4 className="font-bold text-slate-900">Allow New Registrations</h4>
                    <p className="text-sm font-medium text-slate-500 mt-1">Enable or disable new user signups.</p>
                  </div>
                  <button 
                    onClick={() => setSettings({ ...settings, allowNewRegistrations: !settings.allowNewRegistrations })}
                    className={`w-14 h-8 rounded-full relative transition-colors ${settings.allowNewRegistrations ? 'bg-emerald-500' : 'bg-slate-300'}`}
                  >
                    <div className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-transform ${settings.allowNewRegistrations ? 'translate-x-7' : 'translate-x-1'}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <div>
                    <h4 className="font-bold text-slate-900">Require Phone Verification</h4>
                    <p className="text-sm font-medium text-slate-500 mt-1">Mandate OTP verification before profile access.</p>
                  </div>
                  <button 
                    onClick={() => setSettings({ ...settings, requireEmailVerification: !settings.requireEmailVerification })}
                    className={`w-14 h-8 rounded-full relative transition-colors ${settings.requireEmailVerification ? 'bg-emerald-500' : 'bg-slate-300'}`}
                  >
                    <div className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-transform ${settings.requireEmailVerification ? 'translate-x-7' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {(activeTab === "EMAILS" || activeTab === "NOTIFICATIONS") && (
            <div className="h-[400px] flex flex-col items-center justify-center text-center animate-in fade-in duration-300">
              <ToggleLeft className="w-16 h-16 text-slate-300 mb-6" />
              <h3 className="text-2xl font-black text-slate-900">Under Construction</h3>
              <p className="text-slate-500 font-medium max-w-md mt-2">
                This configuration module is currently being integrated with our third-party communication providers.
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
