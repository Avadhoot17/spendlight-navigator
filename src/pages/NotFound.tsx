
import React from "react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground p-4">
      <div className="text-center space-y-4 max-w-md mx-auto animate-fade-in">
        <div className="p-4 bg-muted/40 inline-flex rounded-full mx-auto">
          <div className="text-6xl font-light">404</div>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">Page not found</h1>
        <p className="text-muted-foreground">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>
        <Button asChild className="mt-4">
          <a href="/" className="inline-flex items-center gap-2">
            <Home size={16} />
            <span>Return Home</span>
          </a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
