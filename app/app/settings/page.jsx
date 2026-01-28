"use client";

import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import {
  Store,
  CreditCard,
  Users,
  Smartphone,
  Mail,
  Shield,
  Database, // New icon
  FileSpreadsheet, // New icon
  Download, // New icon
  Upload, // New icon
  File, // New icon
  Check,
  AlertCircle,
  Coins, // New icon
} from "lucide-react";
import { useCurrency } from "../context/CurrencyContext";

export default function SriLankaSettingsPage() {
  const containerRef = useRef(null);
  const { currency, updateCurrency } = useCurrency();

  // --- STATE ---
  const [activeTab, setActiveTab] = useState("store");
  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading] = useState(false);

  // --- MOCK DATA ---
  const [store, setStore] = useState({
    name: "Colombo Trends",
    email: "admin@colombotrends.lk",
    phone: "+94 77 123 4567",
    orderIdFormat: "#ORD-{number}",
  });

  const [payments, setPayments] = useState({
    cod: true,
    googlePay: false,
    koko: false,
  });

  const [integrations, setIntegrations] = useState({
    whatsappNumber: "+94771234567",
    whatsappEnabled: true,
    apiKey: "sk_live_xxxxxxxxxxxxxxxx",
    webhookUrl: "https://n8n.your-domain.com/webhook/orders",
  });

  const [smtp, setSmtp] = useState({
    host: "smtp.gmail.com",
    port: "587",
    user: "notifications@store.lk",
  });

  const [team, setTeam] = useState([
    {
      id: 1,
      name: "Rusiru Perera",
      role: "Owner",
      email: "rusiru@store.lk",
      avatar: "https://i.pravatar.cc/150?u=1",
    },
    {
      id: 2,
      name: "Fatima R.",
      role: "Manager",
      email: "fatima@store.lk",
      avatar: "https://i.pravatar.cc/150?u=2",
    },
  ]);

  // --- ANIMATIONS ---
  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.fromTo(
        ".animate-header",
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1 },
      );
      tl.fromTo(
        ".animate-section",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.05 },
        "-=0.5",
      );
    },
    { scope: containerRef },
  );

  const saveBarRef = useRef(null);
  useGSAP(() => {
    if (hasChanges) {
      gsap.to(saveBarRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.4,
        ease: "back.out(1.2)",
      });
    } else {
      gsap.to(saveBarRef.current, { y: 100, opacity: 0, duration: 0.3 });
    }
  }, [hasChanges]);

  // --- SCROLL SPY LOGIC ---
  useEffect(() => {
    const handleScroll = () => {
      // Added "data" to the sections list
      const sections = [
        "store",
        "payments",
        "integrations",
        "data",
        "smtp",
      ];

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top >= 0 && rect.top <= 300) {
            setActiveTab(section);
            break;
          } else if (rect.top < 0 && rect.bottom > 100) {
            setActiveTab(section);
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- HANDLERS ---
  const scrollToSection = (id) => {
    setActiveTab(id);
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setHasChanges(false);
    }, 1500);
  };

  const SectionHeader = ({ icon: Icon, title, description, colorClass }) => (
    <div className="flex items-start gap-4 mb-6">
      <div className={`p-3 rounded-xl ${colorClass}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{description}</p>
      </div>
    </div>
  );

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-slate-50/50 dark:bg-slate-900 font-sans text-slate-900 dark:text-white px-8 py-6 pb-32"
    >
      {/* 1. PAGE HEADER */}
      <div className="max-w-6xl mx-auto mb-10">
        <div className="animate-header">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Settings
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
            Manage store details, payments, bulk data, and team access.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
        {/* 2. SIDEBAR NAVIGATION */}
        <div className="hidden lg:block lg:col-span-3">
          <nav className="sticky top-24 self-start space-y-1 animate-section">
            {[
              { id: "store", label: "General Store", icon: Store },
              { id: "payments", label: "Payment Methods", icon: CreditCard },
              { id: "integrations", label: "WhatsApp & API", icon: Smartphone },
              { id: "data", label: "Import / Export", icon: Database }, // New Item
              { id: "smtp", label: "SMTP Email", icon: Mail },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${activeTab === item.id ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-lg shadow-indigo-100 dark:shadow-indigo-900/20 ring-1 ring-indigo-50 dark:ring-indigo-900/50 translate-x-2" : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"}`}
              >
                <item.icon
                  className={`w-4 h-4 ${activeTab === item.id ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-slate-500"}`}
                />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* 3. SETTINGS CONTENT */}
        <div className="lg:col-span-9 space-y-10">
          {/* A. GENERAL STORE */}
          <section id="store" className="animate-section scroll-mt-32">
            {/* ... (Existing Store Code) ... */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-8">
              <SectionHeader
                icon={Store}
                title="General Store"
                description="Basic information about your business."
                colorClass="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                    Store Name
                  </label>
                  <input
                    type="text"
                    defaultValue={store.name}
                    onChange={() => setHasChanges(true)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 outline-none transition-all font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    defaultValue={store.phone}
                    onChange={() => setHasChanges(true)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 outline-none transition-all font-medium"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* A2. CURRENCY SETTINGS */}
          <section className="animate-section">
             <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-8">
              <SectionHeader
                icon={Coins}
                title="Currency Settings"
                description="Set the default currency for your store."
                colorClass="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400"
              />
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                  Store Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => {
                    const selected = e.target.value;
                    let sym = "Rs.";
                    if (selected === "USD") sym = "$";
                    if (selected === "EUR") sym = "€";
                    if (selected === "GBP") sym = "£";
                    updateCurrency(selected, sym);
                    setHasChanges(true);
                  }}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 outline-none transition-all font-medium"
                >
                  <option value="LKR">Sri Lankan Rupee (LKR)</option>
                  <option value="USD">US Dollar (USD)</option>
                  <option value="EUR">Euro (EUR)</option>
                  <option value="GBP">British Pound (GBP)</option>
                </select>
              </div>
            </div>
          </section>

          {/* B. PAYMENT METHODS */}
          <section id="payments" className="animate-section scroll-mt-32">
            {/* ... (Existing Payments Code) ... */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-8">
              <SectionHeader
                icon={CreditCard}
                title="Payment Methods"
                description="Manage COD, Koko, and Card payments."
                colorClass="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
              />
              <div className="space-y-4">
                <div className="flex items-center justify-between p-5 rounded-xl border border-indigo-200 dark:border-indigo-900/50 bg-indigo-50/20 dark:bg-indigo-900/10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-700 flex items-center justify-center shadow-sm text-green-600 dark:text-green-400 font-bold">
                      COD
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white">
                        Cash on Delivery
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Collect payment upon product delivery.
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={payments.cod}
                      onChange={() => {
                        setPayments({ ...payments, cod: !payments.cod });
                        setHasChanges(true);
                      }}
                    />
                    <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:bg-emerald-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </label>
                </div>
              </div>
            </div>
          </section>

          {/* C. INTEGRATIONS */}
          <section id="integrations" className="animate-section scroll-mt-32">
            {/* ... (Existing Integrations Code) ... */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-8">
              <SectionHeader
                icon={Smartphone}
                title="Integrations & Automation"
                description="Connect WhatsApp and n8n for automation."
                colorClass="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
              />
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                  Admin Mobile Number
                </label>
                <input
                  type="text"
                  defaultValue={integrations.whatsappNumber}
                  onChange={() => setHasChanges(true)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:border-green-500 outline-none transition-all font-medium font-mono"
                />
              </div>
            </div>
          </section>

          {/* D. BULK DATA MANAGEMENT (NEW SECTION) */}
          <section id="data" className="animate-section scroll-mt-32">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-8">
              <SectionHeader
                icon={Database}
                title="Bulk Data Management"
                description="Import products or export order history."
                colorClass="bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400"
              />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 1. EXPORT DATA */}
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Download className="w-4 h-4 text-slate-500 dark:text-slate-400" /> Export Data
                  </h3>
                  <div className="p-5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1.5 block">
                          Select Data Type
                        </label>
                        <select className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-amber-500/20">
                          <option className="dark:bg-slate-800">Products Inventory</option>
                          <option className="dark:bg-slate-800">Orders (Last 30 Days)</option>
                          <option className="dark:bg-slate-800">All Orders (History)</option>
                          <option className="dark:bg-slate-800">Customer List</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1.5 block">
                          Format
                        </label>
                        <div className="flex gap-2">
                          <label className="flex items-center gap-2 px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg cursor-pointer hover:border-amber-500 transition-colors">
                            <input
                              type="radio"
                              name="format"
                              className="accent-amber-600"
                              defaultChecked
                            />
                            <span className="text-sm font-medium dark:text-slate-300">CSV</span>
                          </label>
                          <label className="flex items-center gap-2 px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg cursor-pointer hover:border-amber-500 transition-colors">
                            <input
                              type="radio"
                              name="format"
                              className="accent-amber-600"
                            />
                            <span className="text-sm font-medium dark:text-slate-300">
                              Excel (.xlsx)
                            </span>
                          </label>
                        </div>
                      </div>
                      <button className="w-full py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm rounded-lg flex items-center justify-center gap-2 transition-all">
                        <Download className="w-4 h-4" /> Download File
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2. IMPORT DATA */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Upload className="w-4 h-4 text-slate-500 dark:text-slate-400" /> Import Data
                    </h3>
                    <button className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
                      <FileSpreadsheet className="w-3 h-3" /> Download Template
                    </button>
                  </div>

                  <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 p-6 flex flex-col items-center justify-center text-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer group">
                    <input
                      type="file"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                      <FileSpreadsheet className="w-6 h-6 text-amber-500 dark:text-amber-400" />
                    </div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      Click or drag file to upload
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Supports CSV or Excel (Max 5MB)
                    </p>
                  </div>

                  {/* Recent Activity Mini-Log */}
                  <div className="pt-2">
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                      Recent Activity
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 text-xs">
                        <Check className="w-3 h-3 text-green-500" />
                        <span className="text-slate-600 dark:text-slate-400">
                          Imported{" "}
                          <span className="font-bold text-slate-900 dark:text-white">
                            products_v2.csv
                          </span>
                        </span>
                        <span className="text-slate-400 ml-auto">2h ago</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        <Download className="w-3 h-3 text-blue-500" />
                        <span className="text-slate-600 dark:text-slate-400">
                          Exported{" "}
                          <span className="font-bold text-slate-900 dark:text-white">
                            orders_jan.xlsx
                          </span>
                        </span>
                        <span className="text-slate-400 ml-auto">1d ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* E. SMTP EMAIL */}
          <section id="smtp" className="animate-section scroll-mt-32">
            {/* ... (Existing SMTP Code) ... */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-8">
              <SectionHeader
                icon={Mail}
                title="SMTP Configuration"
                description="Connect your email server for order notifications."
                colorClass="bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                    SMTP Host
                  </label>
                  <input
                    type="text"
                    defaultValue={smtp.host}
                    onChange={() => setHasChanges(true)}
                    placeholder="smtp.gmail.com"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm dark:text-white font-mono"
                  />
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>

      {/* 4. FLOATING SAVE BAR */}
      <div
        ref={saveBarRef}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 opacity-0 pointer-events-none z-50"
        style={{ pointerEvents: hasChanges ? "auto" : "none" }}
      >
        <div className="bg-slate-900 dark:bg-slate-950 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between border border-slate-700/50 dark:border-slate-800 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div>
            <span className="font-bold text-sm">Unsaved changes</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setHasChanges(false)}
              className="px-4 py-2 text-xs font-bold text-slate-300 hover:text-white transition-colors"
            >
              Discard
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-900/50 flex items-center gap-2"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
