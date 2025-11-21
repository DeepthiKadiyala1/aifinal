import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock, Sunrise, Moon } from "lucide-react";

interface TimeBlock {
  id: string;
  title: string;
  time: string;
  color: string;
}

export const SmartSchedule = () => {
  const [wakeTime, setWakeTime] = useState("07:00");
  const [bedTime, setBedTime] = useState("23:00");

  const getTimeBlocks = (): TimeBlock[] => {
    const wake = parseInt(wakeTime.split(":")[0]);
    
    return [
      { id: "1", title: "Morning Routine", time: `${wakeTime}`, color: "bg-info/20 border-info/40" },
      { id: "2", title: "Deep Work Session", time: `${wake + 1}:00`, color: "bg-primary/20 border-primary/40" },
      { id: "3", title: "Quick Break", time: `${wake + 3}:00`, color: "bg-accent/20 border-accent/40" },
      { id: "4", title: "Afternoon Tasks", time: `${wake + 4}:00`, color: "bg-secondary/20 border-secondary/40" },
      { id: "5", title: "Exercise Time", time: `${wake + 7}:00`, color: "bg-warning/20 border-warning/40" },
      { id: "6", title: "Evening Wind Down", time: bedTime, color: "bg-muted border-border" },
    ];
  };

  return (
    <Card className="shadow-[var(--shadow-medium)] border-border/50 hover:shadow-[var(--shadow-elevated)] transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-info" />
          Smart Schedule
        </CardTitle>
        <CardDescription>
          Personalized timeline based on your circadian rhythm
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="wake-time" className="flex items-center gap-2 text-sm">
              <Sunrise className="h-4 w-4 text-warning" />
              Wake Up Time
            </Label>
            <Input
              id="wake-time"
              type="time"
              value={wakeTime}
              onChange={(e) => setWakeTime(e.target.value)}
              className="bg-muted/50 border-border"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bed-time" className="flex items-center gap-2 text-sm">
              <Moon className="h-4 w-4 text-primary" />
              Bedtime
            </Label>
            <Input
              id="bed-time"
              type="time"
              value={bedTime}
              onChange={(e) => setBedTime(e.target.value)}
              className="bg-muted/50 border-border"
            />
          </div>
        </div>

        <div className="space-y-2">
          {getTimeBlocks().map((block, index) => (
            <div
              key={block.id}
              className={`p-4 rounded-lg border-l-4 transition-all duration-300 ${block.color} animate-in slide-in-from-left duration-500`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">{block.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">Starts at {block.time}</p>
                </div>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
