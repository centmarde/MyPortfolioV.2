import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/customUi/button";
import { Printer } from "lucide-react";

interface UnderDevelopmentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  accentColor?: string;
}

/**
 * Informational dialog shown when a feature is not yet available.
 * Used e.g. by the "Print as PDF" button on the tarot reading page.
 */
const UnderDevelopmentDialog: React.FC<UnderDevelopmentDialogProps> = ({
  isOpen,
  onOpenChange,
  accentColor = "#cd9943",
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-md"
        style={{ borderColor: `${accentColor}55`, borderWidth: 2 }}
      >
        <DialogHeader>
          <DialogTitle
            className="flex items-center gap-2 font-serif text-xl"
            style={{ color: accentColor }}
          >
            <Printer size={20} />
            Print as PDF
          </DialogTitle>
          <DialogDescription className="text-base leading-relaxed">
            Oops, sorry! This feature is still under development. We're working
            hard to bring it to you soon. Please check back later.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            size="lg"
            className="gap-2 font-medium text-[#1a1202]"
            style={{ backgroundColor: "#d4af37", borderColor: "#d4af37" }}
            onClick={() => onOpenChange(false)}
          >
            Got it
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UnderDevelopmentDialog;