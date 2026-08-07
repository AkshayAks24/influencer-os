import { Link } from "react-router-dom"
import { FiHome } from "react-icons/fi"
import { Button } from "@/components/ui/button"

export function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-center px-4">
      <div className="mb-8 rounded-2xl bg-secondary/50 px-6 py-2 text-sm font-medium text-muted-foreground">
        404 Error
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl mb-4">
        Page not found
      </h1>
      <p className="text-lg text-muted-foreground max-w-[500px] mb-8 leading-relaxed">
        Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
      </p>
      <Button asChild size="lg">
        <Link to="/">
          <FiHome className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </Button>
    </div>
  )
}
