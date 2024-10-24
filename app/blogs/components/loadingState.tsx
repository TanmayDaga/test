"use client"
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const LoadingState = () => {
  return (
    <div className="container py-8">
      <div className="flex gap-8">
        <main className="flex-1 space-y-8">
          {[1, 2, 3].map((index) => (
            <Card key={index} className="w-full overflow-hidden">
              <CardContent className="p-6 flex gap-4">
                <div className="animate-pulse flex-shrink-0">
                  <div className="w-12 h-12 bg-muted rounded-full" />
                </div>

                <div className="flex-grow space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="h-4 bg-muted rounded w-24 animate-pulse" />
                    <div className="h-4 bg-muted rounded w-16 animate-pulse" />
                  </div>

                  <div className="h-6 bg-muted rounded w-3/4 animate-pulse" />

                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-full animate-pulse" />
                    <div className="h-4 bg-muted rounded w-5/6 animate-pulse" />
                  </div>
                </div>

                <div className="hidden md:block flex-shrink-0 w-[280px]">
                  <div className="h-32 bg-muted rounded animate-pulse" />
                </div>
              </CardContent>
            </Card>
          ))}
        </main>

        <div className="w-72 sticky top-4 max-lg:hidden">
          <Card>
            <CardHeader>
              <div className="h-6 bg-muted rounded w-32 animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((index) => (
                  <div
                    key={index}
                    className="h-8 bg-muted rounded w-full animate-pulse"
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
