import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "../../../hooks/use-mobile";

export interface ReadingContextAnswers {
  email: string;
  careerReality: string;
  relationshipStatus: string;
  specialHappenings: string;
}

interface ReadingContextDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: (answers: ReadingContextAnswers) => void;
}

const STEPS = [
  {
    key: "email" as const,
    title: "Your Email",
    description:
      "Let's personalise your reading. What email should we attach it to?",
  },
  {
    key: "careerReality" as const,
    title: "Your Recent Month",
    description:
      "How have things been going lately for your career or school?",
  },
  {
    key: "relationshipStatus" as const,
    title: "Relationship Status",
    description: "What is your current relationship status?",
  },
  {
    key: "specialHappenings" as const,
    title: "Special Happenings",
    description:
      "Any special happenings in your life the reading should know about?",
  },
];

const STEP_KEYS = ["email", "careerReality", "relationshipStatus", "specialHappenings"] as const;
type StepKey = (typeof STEP_KEYS)[number];

/**
 * 4-step intake dialog shown before a tarot reading. The answers become the
 * "context" that is fed into the AI so the reading is grounded in the reader's
 * current situation.
 */
const ReadingContextDialog: React.FC<ReadingContextDialogProps> = ({
  isOpen,
  onOpenChange,
  onComplete,
}) => {
  const isMobile = useIsMobile();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<StepKey, string>>({
    email: "",
    careerReality: "",
    relationshipStatus: "",
    specialHappenings: "",
  });

  // Reset each time the dialog opens
  useEffect(() => {
    if (isOpen) {
      setStep(0);
      setAnswers({
        email: "",
        careerReality: "",
        relationshipStatus: "",
        specialHappenings: "",
      });
    }
  }, [isOpen]);

  const stepKey = STEP_KEYS[step];
  const isLastStep = step === STEPS.length - 1;
  const value = answers[stepKey];
  const invalidEmail =
    stepKey === "email" && value.trim() !== "" && !/\S+@\S+\.\S+/.test(value.trim());
  const canProceed =
    stepKey === "email" ? value.trim() !== "" && !invalidEmail : value.trim().length > 0;

  const handleNext = () => {
    if (isLastStep) {
      onComplete({
        email: answers.email.trim(),
        careerReality: answers.careerReality.trim(),
        relationshipStatus: answers.relationshipStatus.trim(),
        specialHappenings: answers.specialHappenings.trim(),
      });
      return;
    }
    setStep((s) => s + 1);
  };

  const themeColor = "#cd9943";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className={isMobile ? "max-w-[calc(100%-1rem)] p-4" : "sm:max-w-lg"}
        style={{ borderColor: themeColor, borderWidth: 2 }}
      >
        <DialogHeader>
          <DialogTitle style={{ color: themeColor }}>
            {STEPS[step].title}
          </DialogTitle>
          <DialogDescription>{STEPS[step].description}</DialogDescription>
        </DialogHeader>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2" aria-hidden="true">
          {STEPS.map((s, i) => (
            <span
              key={s.key}
              className={`h-1.5 rounded-full transition-all ${
                i === step ? "w-6" : "w-1.5"
              } ${i <= step ? "" : "bg-muted"}`}
              style={
                i <= step
                  ? { backgroundColor: themeColor }
                  : undefined
              }
            />
          ))}
        </div>

        {stepKey === "email" ? (
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={value}
            onChange={(e) =>
              setAnswers((prev) => ({ ...prev, [stepKey]: e.target.value }))
            }
            onKeyDown={(e) => e.key === "Enter" && canProceed && handleNext()}
            className="w-full rounded-lg border bg-muted/30 px-4 py-3 text-sm text-foreground outline-none focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/30"
          />
        ) : (
          <textarea
            rows={4}
            placeholder="Share a few words..."
            value={value}
            onChange={(e) =>
              setAnswers((prev) => ({ ...prev, [stepKey]: e.target.value }))
            }
            className="w-full resize-none rounded-lg border bg-muted/30 px-4 py-3 text-sm text-foreground outline-none focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/30"
          />
        )}
        {invalidEmail && (
          <p className="text-xs text-destructive">
            Please enter a valid email address.
          </p>
        )}

        <DialogFooter className="gap-2">
          {step > 0 && (
            <Button
              variant="outline"
              onClick={() => setStep((s) => s - 1)}
              style={{ borderColor: themeColor, color: themeColor }}
            >
              Back
            </Button>
          )}
          <Button
            onClick={handleNext}
            disabled={!canProceed}
            style={{
              backgroundColor: "#d4af37",
              borderColor: "#d4af37",
              color: "#1a1202",
            }}
          >
            {isLastStep ? "Start My Reading" : "Next"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReadingContextDialog;