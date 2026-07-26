import { CircleCheck, CircleDashed, CheckCircle2, ChevronLeft, LogOut, Video } from 'lucide-react';
import ulawLogo from '../assest/ulaw.webp';

interface SidebarProps {
  isDone?: boolean;
}

export function Sidebar({ isDone = false }: SidebarProps) {
  return (
    <div className="w-[280px] h-full flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border shadow-lg z-10 shrink-0">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <img src={ulawLogo} alt="University of Law Logo" className="h-12 w-auto" />
        </div>
        
        <p className="text-sidebar-foreground/70 text-sm mb-6 uppercase tracking-wider font-semibold">
          Hello Student
        </p>

        <nav className="space-y-1 relative">
          {/* Vertical progress line */}
          <div className="absolute left-[15px] top-4 bottom-4 w-px bg-sidebar-foreground/10 -z-10" />
          
          <NavItem 
            icon={<CheckCircle2 className="w-5 h-5 text-emerald-400" />} 
            label="CAS Checklist" 
            badge="Done" 
            badgeColor="emerald" 
          />
          <NavItem 
            icon={<CheckCircle2 className="w-5 h-5 text-emerald-400" />} 
            label="General Documents" 
            badge="Done" 
            badgeColor="emerald" 
          />
          <NavItem 
            icon={isDone ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <CircleDashed className="w-5 h-5 text-primary" />} 
            label="Interviews" 
            badge={isDone ? "Done" : "New"} 
            badgeColor={isDone ? "emerald" : "blue"}
            active={!isDone}
          />
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-sidebar-foreground/10 text-sm flex flex-col gap-3">
        <div className="text-sidebar-foreground/60 uppercase tracking-widest text-xs font-semibold">
          STUDENT: 1776255421
        </div>
        <button className="flex items-center gap-2 text-sidebar-foreground hover:text-white transition-colors py-2">
          <LogOut className="w-4 h-4" />
          <span>Log out</span>
        </button>
      </div>
    </div>
  );
}

function NavItem({ icon, label, badge, badgeColor, active }: { icon: React.ReactNode, label: string, badge: string, badgeColor: 'emerald' | 'blue', active?: boolean }) {
  return (
    <button className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors relative ${active ? 'bg-sidebar-foreground/10 text-white' : 'hover:bg-sidebar-foreground/5 text-sidebar-foreground/80'}`}>
      <div className="shrink-0 bg-sidebar flex items-center justify-center relative z-10 w-8 h-8 -ml-1.5">
        {icon}
      </div>
          <span className="font-medium text-sm text-left flex-1">{label}</span>
      <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${badgeColor === 'emerald' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-primary/20 text-blue-400'}`}>
        {badge}
      </span>
    </button>
  );
}
