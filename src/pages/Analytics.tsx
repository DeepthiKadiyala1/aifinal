import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Calendar, Award } from "lucide-react";

const STORAGE_KEY = "ai-habit-builder:habits";

const Analytics = () => {
  const [habits, setHabits] = useState<any[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setHabits(JSON.parse(raw));
    } catch (e) {
      setHabits([]);
    }
  }, []);

  const totalHabits = habits.length;
  const totalSubtasks = habits.reduce((acc, h) => acc + (Array.isArray(h.subtasks) ? h.subtasks.length : 0), 0);
  const avgSubtasks = totalHabits ? Math.round((totalSubtasks / totalHabits) * 10) / 10 : 0;

  const stats = [
    { label: "Total Habits", value: String(totalHabits || 0), icon: BarChart3, color: "text-primary" },
    { label: "Total Sub-tasks", value: String(totalSubtasks || 0), icon: TrendingUp, color: "text-secondary" },
    { label: "Average Sub-tasks", value: String(avgSubtasks), icon: Calendar, color: "text-accent" },
    { label: "Tracked Days", value: "—", icon: Award, color: "text-warning" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="shadow-[var(--shadow-medium)] border-border/50 hover:shadow-[var(--shadow-elevated)] transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-[var(--shadow-elevated)] border-border/50">
        <CardHeader>
          <CardTitle>Recent Habits</CardTitle>
          <CardDescription>Latest habits you added</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {habits.slice(0, 6).map((h: any, i: number) => (
              <div key={i} className="p-3 rounded-md bg-muted/20">
                <p className="font-medium">{h.name}</p>
                <p className="text-sm text-muted-foreground">{Array.isArray(h.subtasks) ? `${h.subtasks.length} steps` : "—"}</p>
              </div>
            ))}
            {habits.length === 0 && <p className="text-sm text-muted-foreground">No habits tracked yet.</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
