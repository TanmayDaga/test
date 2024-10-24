"use client";

import { FC, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import useAxiosContext from "@/hooks/custom/useAxiosContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Types
interface Step {
  question: string;
  options: string[];
  inputType: "radio" | "text";
  key: string;
}

const steps: Step[] = [
  {
    question: "What's your native language?",
    options: [
      "Hindi",
      "Spanish",
      "Mandarin",
      "Arabic",
      "English",
      "Other (please specify)",
    ],
    inputType: "radio",
    key: "nativeLanguage",
  },
  // Add your other steps here without comments inside the array
  {
    question: "What's your language learning goal?",
    options: [
      "Fluency",
      "Basic Conversation",
      "Professional Use",
      "Academic Research",
    ],
    inputType: "radio",
    key: "goal",
  },
  {
    question: "What's your current language level?",
    options: ["Beginner", "Intermediate", "Advanced", "Fluent"],
    inputType: "radio",
    key: "languageLevel",
  },
  {
    question: "What is your main purpose for learning?",
    options: ["Travel", "Work", "Education", "Personal Interest"],
    inputType: "radio",
    key: "purpose",
  },
  {
    question: "How much time can you dedicate each week?",
    options: ["<1 hour", "1-3 hours", "3-5 hours", "5+ hours"],
    inputType: "radio",
    key: "timeToBeDedicated",
  },
  {
    question: "What's your preferred learning pace?",
    options: ["Slow", "Moderate", "Fast", "Intensive"],
    inputType: "radio",
    key: "learningPace",
  },
  {
    question: "What do you find most challenging?",
    options: ["Speaking", "Listening", "Reading", "Writing"],
    inputType: "radio",
    key: "challengingAspec",
  },
  {
    question: "How do you prefer to practice?",
    options: ["Solo", "With a Tutor", "In a Group", "Online Courses"],
    inputType: "radio",
    key: "preferredPracticingWay",
  },
  {
    question: "Any additional information you'd like to share?",
    options: [],
    inputType: "text",
    key: "additionalText",
  },
];

// Form Schema
const formSchema = z.object({
  nativeLanguage: z.string().min(1, "Please select a language"),
  languageLevel: z.string().min(1, "Please select your level"),
  goal: z.string().min(1, "Please select a goal"),
  purpose: z.string().min(1, "Please select a purpose"),
  timeToBeDedicated: z.string().min(1, "Please select time"),
  learningPace: z.string().min(1, "Please select pace"),
  challengingAspec: z.string().min(1, "Please select challenge"),
  preferredPracticingWay: z.string().min(1, "Please select preference"),
  additionalText: z.string().optional(),
  otherLanguage: z.string().optional(),
});

const OnboardingForm: FC = () => {
  const router = useRouter();
  const { toast } = useToast();
  const axios = useAxiosContext();

  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nativeLanguage: "",
      languageLevel: "",
      goal: "",
      purpose: "",
      timeToBeDedicated: "",
      learningPace: "",
      challengingAspec: "",
      preferredPracticingWay: "",
      additionalText: "",
      otherLanguage: "",
    },
  });

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = async () => {
    const currentKey = steps[currentStep].key;
    const isValid = await form.trigger(
      currentKey as keyof z.infer<typeof formSchema>
    );

    if (!isValid) return;

    if (currentStep === steps.length - 1) {
      await handleSubmit();
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const values = form.getValues();

      let formData = { ...values };
      if (values.nativeLanguage === "Other (please specify)") {
        formData.nativeLanguage = values.otherLanguage || "";
      }

      await axios.post("api/v1/user/post-onboarding", formData);

      toast({
        title: "Success",
        description:
          "Thanks for submitting. Navigating you to the learning page",
      });

      setTimeout(() => {
        router.push("/record");
      }, 1500);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unknown error occurred.",
      });
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = (step: Step) => {
    if (step.inputType === "radio") {
      return (
        <FormField
          control={form.control}
          name={step.key as keyof z.infer<typeof formSchema>}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="space-y-2"
                >
                  {step.options.map((option) => (
                    <FormItem
                      key={option}
                      className="flex items-center space-x-3"
                    >
                      <FormControl>
                        <RadioGroupItem value={option} />
                      </FormControl>
                      <FormLabel className="font-normal">{option}</FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
              {field.value === "Other (please specify)" && (
                <Input
                  placeholder="Please specify your language"
                  className="mt-2"
                  {...form.register("otherLanguage")}
                />
              )}
            </FormItem>
          )}
        />
      );
    }

    return (
      <FormField
        control={form.control}
        name={step.key as keyof z.infer<typeof formSchema>}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Textarea
                placeholder="Enter your response..."
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  return (
    <div className="min-h-screen bg-black/50 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>
            Step {currentStep + 1} of {steps.length}
          </CardTitle>
          <CardDescription>{steps[currentStep].question}</CardDescription>
          <Progress value={progress} className="h-2" />
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form className="space-y-4">
              {renderStepContent(steps[currentStep])}
            </form>
          </Form>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0 || isSubmitting}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.push("/")}
              disabled={isSubmitting}
            >
              Skip
            </Button>

            <Button onClick={handleNext} disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : currentStep === steps.length - 1 ? (
                "Submit"
              ) : (
                <>
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default OnboardingForm;
