import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";

interface CoachMessageProps {
  persona: string;
}

const messages: Record<string, string> = {
  supportive: "You're doing amazing! Remember, every small step counts. I believe in you! 💪",
  strict: "No excuses. Get it done. Your future self will thank you for the discipline you show today.",
  cheerful: "Hey superstar! 🌟 Let's make today absolutely wonderful! You've got this!",
  calm: "Take a deep breath. Focus on one thing at a time. You're exactly where you need to be.",
  sarcastic: "Oh look, another day to be productive. How thrilling. (But seriously, you got this! 😉)",
};

export const CoachMessage = ({ persona }: CoachMessageProps) => {
  return (
    <Card className="shadow-[var(--shadow-medium)] border-border/50 bg-gradient-to-br from-card to-muted/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <MessageCircle className="h-5 w-5 text-primary" />
          Daily Coach Message
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed text-foreground/90">
          {messages[persona] || messages.supportive}
        </p>
        <div className="mt-3 pt-3 border-t border-border/50">
          <span className="text-xs text-muted-foreground">
            Coach Persona: <span className="font-medium capitalize text-primary">{persona}</span>
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
