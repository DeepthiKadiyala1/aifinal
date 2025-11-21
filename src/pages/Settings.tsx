import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Settings as SettingsIcon } from "lucide-react";

interface SettingsProps {
  coachPersona: string;
  onPersonaChange: (persona: string) => void;
}

const personas = [
  { value: "supportive", label: "Supportive", description: "Encouraging and gentle guidance" },
  { value: "strict", label: "Strict", description: "No-nonsense, disciplined approach" },
  { value: "cheerful", label: "Cheerful", description: "Energetic and upbeat motivation" },
  { value: "calm", label: "Calm", description: "Peaceful and mindful coaching" },
  { value: "sarcastic", label: "Lightly Sarcastic", description: "Witty with a touch of humor" },
];

const Settings = ({ coachPersona, onPersonaChange }: SettingsProps) => {
  return (
    <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Card className="shadow-[var(--shadow-elevated)] border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <SettingsIcon className="h-6 w-6 text-primary" />
            Coach Settings
          </CardTitle>
          <CardDescription>
            Customize your AI coach's personality to match your preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-base font-medium mb-4 block">Choose Your Coach Persona</Label>
            <RadioGroup value={coachPersona} onValueChange={onPersonaChange} className="space-y-3">
              {personas.map((persona) => (
                <div
                  key={persona.value}
                  className="flex items-start space-x-3 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-all cursor-pointer"
                >
                  <RadioGroupItem value={persona.value} id={persona.value} className="mt-1" />
                  <div className="flex-1">
                    <Label
                      htmlFor={persona.value}
                      className="font-medium cursor-pointer text-foreground"
                    >
                      {persona.label}
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {persona.description}
                    </p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>
          
          <div className="pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Your coach's personality will adapt throughout the app to match your selected style.
              You can change this anytime!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
