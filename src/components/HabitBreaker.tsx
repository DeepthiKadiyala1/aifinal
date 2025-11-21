import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Wand2, Clock } from "lucide-react";

interface MicroStep {
  id: string;
  text: string;
  duration: string;
  completed: boolean;
}

export const HabitBreaker = () => {
  const [task, setTask] = useState("");
  const [microSteps, setMicroSteps] = useState<MicroStep[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const breakDownTask = () => {
    setIsLoading(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const steps: MicroStep[] = [
        { id: "1", text: `Set up workspace for: ${task}`, duration: "2 mins", completed: false },
        { id: "2", text: "Identify the most important element", duration: "3 mins", completed: false },
        { id: "3", text: "Start with the easiest part first", duration: "5 mins", completed: false },
        { id: "4", text: "Take a quick break and assess progress", duration: "2 mins", completed: false },
        { id: "5", text: "Complete the remaining tasks one by one", duration: "10 mins", completed: false },
        { id: "6", text: "Final review and cleanup", duration: "3 mins", completed: false },
      ];
      
      setMicroSteps(steps);
      setIsLoading(false);
    }, 1500);
  };

  const toggleStep = (id: string) => {
    setMicroSteps(steps =>
      steps.map(step =>
        step.id === id ? { ...step, completed: !step.completed } : step
      )
    );
  };

  const completedCount = microSteps.filter(s => s.completed).length;
  const progress = microSteps.length > 0 ? (completedCount / microSteps.length) * 100 : 0;

  return (
    <Card className="shadow-[var(--shadow-medium)] border-border/50 hover:shadow-[var(--shadow-elevated)] transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-accent" />
          Automatic Habit Breaker
        </CardTitle>
        <CardDescription>
          Turn any big goal into bite-sized, actionable micro-steps
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Enter a big goal (e.g., Clean my room)"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && task && breakDownTask()}
            className="flex-1 bg-muted/50 border-border focus:border-accent transition-colors"
          />
          <Button
            onClick={breakDownTask}
            disabled={!task || isLoading}
            className="bg-accent hover:bg-accent/90"
          >
            {isLoading ? "Breaking down..." : "Break Down"}
          </Button>
        </div>

        {microSteps.length > 0 && (
          <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Progress: {completedCount}/{microSteps.length} steps
              </span>
              <span className="font-medium text-foreground">{Math.round(progress)}%</span>
            </div>
            
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-accent to-secondary transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="space-y-2 mt-4">
              {microSteps.map((step) => (
                <div
                  key={step.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <Checkbox
                    checked={step.completed}
                    onCheckedChange={() => toggleStep(step.id)}
                    className="mt-0.5"
                  />
                  <div className="flex-1">
                    <p className={`text-sm ${step.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                      {step.text}
                    </p>
                    <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {step.duration}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
