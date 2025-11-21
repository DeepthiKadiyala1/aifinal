import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const Header = () => {
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const currentTime = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="flex items-center justify-between px-8 py-4">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Good Morning</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {currentDate} · {currentTime}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Avatar className="h-10 w-10 ring-2 ring-primary/20">
            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=User" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};
