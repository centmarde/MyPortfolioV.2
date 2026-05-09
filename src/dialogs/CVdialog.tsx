import { useEffect } from "react";
import { FileDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type CVDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CVdialog({ isOpen, onClose }: CVDialogProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-xl border border-border bg-background p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cv-dialog-title"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 id="cv-dialog-title" className="text-xl font-semibold">
              Choose your resume
            </h3>
            <p className="text-sm text-muted-foreground">
              Pick the version that fits your need.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 grid gap-3">
          <div className="rounded-lg border border-border p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold">Simple CV</p>
                <p className="text-sm text-muted-foreground">
                  Quick overview for fast screening.
                </p>
              </div>
              <Button asChild className="shrink-0">
                <a href="/CV/CentmardeCV.pdf" download="CentmardeCV.pdf">
                  <FileDown />
                  Download
                </a>
              </Button>
            </div>
          </div>

          <div className="rounded-lg border border-border p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold">Detailed CV</p>
                <p className="text-sm text-muted-foreground">
                  Full experience, projects, and details.
                </p>
              </div>
              <Button asChild variant="outline" className="shrink-0">
                <a href="/CV/CV.pdf" download="CV.pdf">
                  <FileDown />
                  Download
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
