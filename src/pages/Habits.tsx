import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Target, TrendingUp, Plus, Trash2, Scissors } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type Habit = {
  name: string;
  subtasks: string[];
  streak?: number;
  status?: "active" | "building";
};

const defaultHabits: Habit[] = [
  { name: "Morning Meditation", subtasks: ["Find a quiet spot", "Set a 10-min timer", "Breathe and focus"], streak: 12, status: "active" },
  { name: "Exercise", subtasks: ["Choose a workout plan", "Schedule 30 minutes", "Prepare workout clothes"], streak: 7, status: "active" },
];

function adaptTasksForMoodAndTime(tasks: string[], mood?: string, time?: string) {
  let adapted = tasks.slice();

  if (mood) {
    const m = mood.toLowerCase();
    if (m === "tired") {
      adapted = adapted.map((t) => t.replace(/\d+\s?-?\s?(minutes|minute|mins|min)/i, () => "5 minutes"));
      adapted.unshift("2 minutes: Do a tiny starter to build momentum");
    }
    if (m === "energetic") {
      adapted = adapted.map((t) => t.replace(/(5 minutes|5-10 minutes)/i, "10 minutes"));
      adapted.unshift("Take advantage of energy: consider extending the main step today");
    }
  }

  if (time) {
    const label = `Schedule at ${time}`;
    adapted.splice(1, 0, label);
  }

  return adapted;
}

function generateSubtasks(habit: string, mood?: string, time?: string): string[] {
  const h = habit.toLowerCase();

  if (h.includes("clean") || h.includes("room") || h.includes("tidy") || h.includes("organize")) {
    const tasks = [
      "5 minutes: Pick up clothes and put them away",
      "10 minutes: Arrange desk and shelves",
      "5 minutes: Throw out trash and recyclables",
      "5 minutes: Quick sweep / wipe surfaces",
      "5 minutes: Final check and put things back in place",
    ];
    return adaptTasksForMoodAndTime(tasks, mood, time);
  }

  if (h.includes("eat") || h.includes("food") || h.includes("healthy")) {
    const tasks = [
      "10 minutes: Plan a weekly grocery list",
      "30 minutes: Buy groceries (or order ahead)",
      "30 minutes: Cook a simple meal",
      "15 minutes: Eat mindfully",
      "5 minutes: Log servings of fruits & veggies",
    ];
    return adaptTasksForMoodAndTime(tasks, mood, time);
  }

  if (h.includes("exercise") || h.includes("workout") || h.includes("run") || h.includes("gym")) {
    const tasks = [
      "5 minutes: Warm up (light movement)",
      "20-30 minutes: Main workout (strength/cardio)",
      "5-10 minutes: Cool down and stretch",
      "5 minutes: Log workout and hydrate",
    ];
    return adaptTasksForMoodAndTime(tasks, mood, time);
  }

  if (h.includes("meditat") || h.includes("mindful")) {
    const tasks = [
      "1 minute: Get comfortable and settle in",
      "5-10 minutes: Guided or silent meditation",
      "2 minutes: Gentle breathing to finish",
      "2 minutes: Note how you feel",
    ];
    return adaptTasksForMoodAndTime(tasks, mood, time);
  }

  if (h.includes("read") || h.includes("book") || h.includes("reading")) {
    const tasks = [
      "5 minutes: Pick reading material and goal (pages/minutes)",
      "25 minutes: Focused reading session",
      "5 minutes: Summarize or note key takeaways",
    ];
    return adaptTasksForMoodAndTime(tasks, mood, time);
  }

  if (h.includes("journal") || h.includes("write")) {
    const tasks = [
      "2 minutes: Choose a short prompt",
      "10 minutes: Write freely",
      "3 minutes: Read and reflect",
    ];
    return adaptTasksForMoodAndTime(tasks, mood, time);
  }

  const base = [
    "5 minutes: Define a specific, measurable goal",
    "5 minutes: Pick a daily time or trigger",
    "10 minutes: Prepare any needed resources",
    "5 minutes: Do the first small action",
    "5 minutes: Review and plan the next step",
  ];

  return adaptTasksForMoodAndTime(base, mood, time);
}

const Habits: React.FC = () => {
  const STORAGE_KEY = "ai-habit-builder:habits";

  const [habits, setHabits] = useState<Habit[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw) as Habit[];
    } catch (e) {
      // ignore
    }
    return defaultHabits;
  });

  const [newHabit, setNewHabit] = useState("");
  const [pendingHabit, setPendingHabit] = useState<string | null>(null);
  const [mood, setMood] = useState<string>("neutral");
  const [scheduledTime, setScheduledTime] = useState<string>("08:00");
  const [showAddForm, setShowAddForm] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const API_BASE = (import.meta.env.VITE_AI_PROXY_URL as string) || "http://localhost:3001";

  function startBuild(name: string) {
    if (!name.trim()) return;
    setPendingHabit(name.trim());
  }

  function cancelBuild() {
    setPendingHabit(null);
    setMood("neutral");
    setScheduledTime("08:00");
    setShowAddForm(false);
  }

  async function confirmBuild() {
    if (!pendingHabit) return;
    setLoadingAi(true);
    try {
      const resp = await fetch(`${API_BASE}/api/generate-breakdown`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ habit: pendingHabit, mood, time: scheduledTime }),
      });

      let subtasks: string[] | null = null;
      if (resp.ok) {
        const data = await resp.json();
        if (Array.isArray(data?.subtasks) && data.subtasks.length > 0) subtasks = data.subtasks;
      }

      if (!subtasks) subtasks = generateSubtasks(pendingHabit, mood, scheduledTime);

      const habit: Habit = { name: pendingHabit, subtasks, streak: 0, status: "building" };
      setHabits((s) => [habit, ...s]);
      setNewHabit("");
      cancelBuild();
    } catch (e) {
      const subtasks = generateSubtasks(pendingHabit, mood, scheduledTime);
      const habit: Habit = { name: pendingHabit, subtasks, streak: 0, status: "building" };
      setHabits((s) => [habit, ...s]);
      setNewHabit("");
      cancelBuild();
    } finally {
      setLoadingAi(false);
    }
  }

  async function breakSubtask(habitIndex: number, taskIndex: number) {
    const task = habits[habitIndex]?.subtasks[taskIndex];
    if (!task) return;
    if (!window.confirm(`Break down this task?\n\n${task}`)) return;
    setLoadingAi(true);
    try {
      const resp = await fetch(`${API_BASE}/api/generate-breakdown`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ habit: task, mood: "neutral", time: "" }),
      });

      let subtasks: string[] | null = null;
      if (resp.ok) {
        const data = await resp.json();
        if (Array.isArray(data?.subtasks) && data.subtasks.length > 0) subtasks = data.subtasks;
      }

      if (!subtasks) subtasks = generateSubtasks(task);

      setHabits((prev) => {
        const next = prev.map((h) => ({ ...h, subtasks: [...h.subtasks] }));
        const before = next[habitIndex].subtasks.slice(0, taskIndex);
        const after = next[habitIndex].subtasks.slice(taskIndex + 1);
        next[habitIndex].subtasks = [...before, ...subtasks, ...after];
        return next;
      });
    } catch (e) {
      const subtasks = generateSubtasks(task);
      setHabits((prev) => {
        const next = prev.map((h) => ({ ...h, subtasks: [...h.subtasks] }));
        const before = next[habitIndex].subtasks.slice(0, taskIndex);
        const after = next[habitIndex].subtasks.slice(taskIndex + 1);
        next[habitIndex].subtasks = [...before, ...subtasks, ...after];
        return next;
      });
    } finally {
      setLoadingAi(false);
    }
  }

  function deleteHabit(index: number) {
    if (!window.confirm(`Delete habit and all its tasks?`)) return;
    setHabits((s) => s.filter((_, i) => i !== index));
  }

  function deleteSubtask(habitIndex: number, taskIndex: number) {
    if (!window.confirm(`Delete this subtask?`)) return;
    setHabits((prev) => {
      const next = prev.map((h) => ({ ...h, subtasks: [...h.subtasks] }));
      next[habitIndex].subtasks.splice(taskIndex, 1);
      return next;
    });
  }

  useEffect(() => {
    if (showAddForm && inputRef.current) inputRef.current.focus();
  }, [showAddForm]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
    } catch (e) {
      // ignore
    }
  }, [habits]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Card className="shadow-[var(--shadow-elevated)] border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between w-full">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-6 w-6 text-secondary" />
                Build a Habit
              </CardTitle>
              <CardDescription>Enter a habit, choose your mood and preferred time — get step-by-step actions.</CardDescription>
            </div>

            <div>
              <Button variant={showAddForm ? "outline" : "default"} size="icon" onClick={() => setShowAddForm((s) => !s)} aria-label="Toggle add habit">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="mb-4">
            {(showAddForm || pendingHabit) ? (
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 items-start">
                <div className="flex flex-col sm:flex-row gap-3 w-full items-start">
                  <Input
                    ref={inputRef}
                    placeholder="e.g., Clean my room"
                    value={newHabit}
                    onChange={(e) => setNewHabit(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && startBuild(newHabit)}
                    className="w-full"
                  />
                  <Button variant="secondary" onClick={() => startBuild(newHabit)} disabled={!newHabit}>
                    <Plus className="h-4 w-4" /> Start
                  </Button>
                </div>

                {pendingHabit && (
                  <div className="col-span-1 sm:col-span-2 mt-3 p-4 rounded-md bg-muted/5 border border-border">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="flex-1">
                        <p className="font-medium">Building: {pendingHabit}</p>
                        <p className="text-sm text-muted-foreground">We'll tailor steps to your mood and schedule.</p>
                      </div>

                      <div className="w-40">
                        <label className="text-sm block mb-1">Mood</label>
                        <Select value={mood} onValueChange={(v) => setMood(v)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select mood" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="energetic">Energetic</SelectItem>
                            <SelectItem value="neutral">Neutral</SelectItem>
                            <SelectItem value="tired">Tired</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="w-40">
                        <label className="text-sm block mb-1">Preferred time</label>
                        <Input type="time" value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)} />
                      </div>

                      <div className="flex items-center gap-2">
                        <Button onClick={confirmBuild} disabled={loadingAi}>
                          {loadingAi ? "Generating..." : "Confirm"}
                        </Button>
                        <Button variant="outline" onClick={cancelBuild} disabled={loadingAi}>Cancel</Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Click the + button to add a new habit</p>
            )}
          </div>

          <div className="space-y-4">
            {habits.map((habit, index) => (
              <Card key={index} className="p-0">
                <CardContent>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{habit.name}</p>
                        <p className="text-sm text-muted-foreground">{habit.streak} day streak</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge variant={habit.status === "active" ? "default" : "secondary"}>
                        {habit.status === "active" ? "Active" : "Building"}
                      </Badge>
                      <Button variant="link" size="sm" onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}>
                        {expandedIndex === index ? "Hide details" : "View details"}
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteHabit(index)} aria-label={`Delete ${habit.name}`}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>

                  {expandedIndex === index && (
                    <div className="mt-3 pl-12">
                      <p className="mb-2 font-medium">Sub-tasks</p>
                      <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                        {habit.subtasks.map((t, i) => (
                          <li key={i}>
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 pr-4">{t}</div>
                              <div className="flex items-center gap-2">
                                <Button variant="link" size="sm" onClick={() => breakSubtask(index, i)}>
                                  <Scissors className="h-4 w-4" /> Break
                                </Button>
                                <Button variant="link" size="sm" onClick={() => deleteSubtask(index, i)}>
                                  <Trash2 className="h-4 w-4" /> Delete
                                </Button>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Habits;
