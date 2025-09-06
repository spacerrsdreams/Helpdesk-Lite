import { AlertTriangle, RefreshCw, X } from "@/components/icons";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface ConflictBannerProps {
  onRefresh: () => void;
  onDismiss: () => void;
}

export function ConflictBanner({ onRefresh, onDismiss }: ConflictBannerProps) {
  return (
    <Alert className="mb-4 border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20">
      <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
      <AlertDescription className="flex items-center justify-between">
        <span className="text-yellow-800 dark:text-yellow-200">
          This ticket has been updated by someone else. Refresh to see the latest changes.
        </span>
        <div className="ml-4 flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={onRefresh} className="h-7 bg-transparent text-xs">
            <RefreshCw className="mr-1 h-3 w-3" />
            Refresh
          </Button>
          <Button size="sm" variant="ghost" onClick={onDismiss} className="h-7 w-7 p-0">
            <X className="h-3 w-3" />
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
