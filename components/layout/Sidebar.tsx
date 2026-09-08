'use client';

import React from 'react';
import Image from 'next/image';
import {
  LayoutDashboard,
  FileSpreadsheet,
  BrainCircuit,
  TrendingUp,
  Award,
  Gift,
  ShieldCheck,
  Building2,
  ChevronRight,
} from 'lucide-react';

export type NavTab = 
  | 'dashboard'
  | 'hazard-report'
  | 'ai-assessment'
  | 'quality-analysis'
  | 'top-reporter'
  | 'monthly-reward';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  totalReports: number;
  aiAssessedCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  totalReports,
  aiAssessedCount,
}) => {
  const navItems = [
    {
      id: 'dashboard' as NavTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: 'Utama',
    },
    {
      id: 'hazard-report' as NavTab,
      label: 'Hazard Report',
      icon: FileSpreadsheet,
      badge: totalReports.toString(),
    },
    {
      id: 'ai-assessment' as NavTab,
      label: 'AI Assessment',
      icon: BrainCircuit,
      badge: `${aiAssessedCount}`,
    },
    {
      id: 'quality-analysis' as NavTab,
      label: 'Quality Analysis',
      icon: TrendingUp,
      badge: undefined,
    },
    {
      id: 'top-reporter' as NavTab,
      label: 'Top Reporter',
      icon: Award,
      badge: 'Top 5',
    },
    {
      id: 'monthly-reward' as NavTab,
      label: 'Monthly Reward',
      icon: Gift,
      badge: '🏆 HSE',
    },
  ];

  return (
    <aside
      id="app-sidebar"
      className="w-64 bg-slate-900 text-slate-200 flex flex-col border-r border-slate-800 shrink-0 select-none"
    >
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800 flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-white p-1 flex items-center justify-center shrink-0 shadow-sm border border-slate-700/60 overflow-hidden">
          <Image
            src="/logo.png"
            alt="Logo PT Indotruck Utama"
            width={44}
            height={44}
            className="w-full h-full object-contain"
            referrerPolicy="no-referrer"
            priority
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h1 className="text-sm font-bold text-white tracking-tight truncate">
              ITU - SISADMO
            </h1>
            <span className="text-[10px] font-semibold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/30">
              HSE AI
            </span>
          </div>
          <p className="text-[11px] text-slate-400 truncate">
            PT Indotruck Utama
          </p>
        </div>
      </div>

      {/* Corporate Meta Pill */}
      <div className="mx-3 mt-3 p-2.5 rounded-lg bg-slate-800/70 border border-slate-700/60 text-xs">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-5 h-5 rounded bg-white p-0.5 shrink-0 flex items-center justify-center overflow-hidden">
            <Image
              src="/logo.png"
              alt="Logo ITU"
              width={20}
              height={20}
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="text-white font-bold text-xs truncate">
            PT Indotruck Utama
          </div>
        </div>
        <div className="flex items-center justify-between text-slate-400 text-[11px]">
          <span className="flex items-center gap-1">
            <Building2 className="w-3 h-3 text-slate-400" /> Site MIA 4
          </span>
          <span className="text-emerald-400 font-medium font-mono text-[10px]">v2.6 Enterprise</span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="px-3 py-4 flex-1 overflow-y-auto space-y-1">
        <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Navigasi Modul
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-btn-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-emerald-600 text-white font-semibold shadow-sm shadow-emerald-900/30'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium shrink-0 ml-1.5 ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="p-3.5 border-t border-slate-800/80 bg-slate-950/40 text-[11px] text-slate-400 flex items-center justify-between">
        <div>
          <div className="font-semibold text-slate-300">Target Standard K3</div>
          <div className="text-[10px] text-slate-400">Score &ge; 70.0 (Good)</div>
        </div>
        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
      </div>
    </aside>
  );
};
