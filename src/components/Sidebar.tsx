import { Home, Target, Settings, BarChart3 } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { cn } from "@/lib/utils";

const navigationItems = [
  { name: "Dashboard", icon: Home, path: "/" },
  { name: "Coach Settings", icon: Settings, path: "/settings" },
  { name: "Analytics", icon: BarChart3, path: "/analytics" },
];

export const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-border bg-card transition-transform duration-300">
      <div className="flex h-16 items-center border-b border-border px-6">
        <h1 className="text-xl font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          AI Habit Builder
        </h1>
      </div>
      
      <nav className="space-y-1 p-4">
        {navigationItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === "/"}
            className={cn(
              "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200",
              "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
            activeClassName="bg-primary/10 text-primary hover:bg-primary/15"
          >
            <item.icon className="h-5 w-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>
      
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
        <div className="rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 p-4">
          <p className="text-xs text-muted-foreground mb-1">Daily Streak</p>
          <p className="text-2xl font-bold text-foreground">7 Days 🔥</p>
        </div>
      </div>
    </aside>
  );
};
