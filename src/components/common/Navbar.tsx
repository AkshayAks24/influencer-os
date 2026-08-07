import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex gap-6 md:gap-10">
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="font-bold text-primary-foreground text-xl leading-none">I</span>
            </div>
            <span className="inline-block font-bold">InfluencerOS</span>
          </Link>
          <div className="hidden md:flex gap-6">
            <a href="#product" className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground">
              Product
            </a>
            <a href="#features" className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground">
              Features
            </a>
            <Link to="/pricing" className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground">
              Pricing
            </Link>
            <a href="#faq" className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground">
              FAQ
            </a>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <Link to="/login" className="hidden sm:inline-flex text-sm font-medium hover:underline underline-offset-4">
              Login
            </Link>
            <Button asChild size="sm">
              <Link to="/register">Get Started</Link>
            </Button>
          </nav>
        </div>
      </div>
    </nav>
  );
}
