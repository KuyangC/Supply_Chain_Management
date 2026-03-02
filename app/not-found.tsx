import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PackageSearch } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
      <div className="text-center space-y-4">
        <PackageSearch className="mx-auto h-16 w-16 text-muted-foreground" />
        <h1 className="text-2xl font-bold">Page Not Found</h1>
        <p className="text-muted-foreground">
          The page you are looking for does not exist or has been moved.
        </p>
        <Button asChild>
          <Link href="/">Go to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
