import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Zap, Coffee } from "lucide-react";

type MoodMode = "neutral" | "high" | "low";

export const MoodCheckIn = () => {
  const [mood, setMood] = useState("");
  const [moodMode, setMoodMode] = useState<MoodMode>("neutral");

  const analyzeMood = () => {
    const lowEnergyWords = ["stressed", "tired", "exhausted", "overwhelmed", "anxious", "sad"];
    const highEnergyWords = ["great", "awesome", "energized", "motivated", "excited", "happy"];
    
    const moodLower = mood.toLowerCase();
    
    if (lowEnergyWords.some(word => moodLower.includes(word))) {
      setMoodMode("low");
    } else if (highEnergyWords.some(word => moodLower.includes(word))) {
      setMoodMode("high");
    } else {
      setMoodMode("neutral");
    }
  };

  const getMoodBadge = () => {
    switch (moodMode) {
      case "high":
        return (
          <Badge className="bg-gradient-to-r from-secondary to-accent text-white border-0">
            <Zap className="h-3 w-3 mr-1" />
            High Performance Mode
          </Badge>
        );
      case "low":
        return (
          <Badge className="bg-gradient-to-r from-info to-primary text-white border-0">
            <Coffee className="h-3 w-3 mr-1" />
            Low Energy Mode
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="shadow-[var(--shadow-medium)] border-border/50 hover:shadow-[var(--shadow-elevated)] transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Daily Mood Check-in
            </CardTitle>
            <CardDescription className="mt-1">
              Tell me how you're feeling today
            </CardDescription>
          </div>
          {getMoodBadge()}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Input
            placeholder="How do you feel right now?"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && analyzeMood()}
            className="flex-1 bg-muted/50 border-border focus:border-primary transition-colors"
          />
          <Button onClick={analyzeMood} className="bg-primary hover:bg-primary/90">
            Analyze
          </Button>
        </div>
        
        {moodMode !== "neutral" && (
          <div className="mt-4 p-4 rounded-lg bg-muted/50 animate-in fade-in slide-in-from-top-2 duration-500">
            <p className="text-sm text-muted-foreground">
              {moodMode === "low" 
                ? "I've adjusted your tasks to be lighter and more manageable. Focus on small wins today! 💙"
                : "You're on fire today! I've prepared some challenging goals to match your energy! 🚀"
              }
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
