import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, MapPin, CheckCircle } from "lucide-react";

export default function StudentDashboard() {
  const profileCompletion = 85;
  const mathcedCount = 12;
  const activeApplications = 3;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Welcome back, Alex!</h1>
      <p className="text-muted-foreground">
        Here is an overview of your study abroad journey.
      </p>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-background/60 backdrop-blur-md border-primary/20 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Profile Completion
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profileCompletion}%</div>
            <Progress value={profileCompletion} className="mt-3 h-2" />
          </CardContent>
        </Card>

        <Card className="bg-background/60 backdrop-blur-md border-primary/20 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Matched Universities
            </CardTitle>
            <MapPin className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mathcedCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Based on your latest preferences
            </p>
          </CardContent>
        </Card>

        <Card className="bg-background/60 backdrop-blur-md border-primary/20 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Active Applications
            </CardTitle>
            <BookOpen className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeApplications}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Currently in progress
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Recommended Next Steps</h2>
        <Card>
          <CardContent className="p-6">
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-medium">Complete Financial Profile</h3>
                  <p className="text-sm text-muted-foreground">
                    Add your budget to unlock more accurate matches.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-medium">Review Matches</h3>
                  <p className="text-sm text-muted-foreground">
                    You have 12 new universities to review in Canada.
                  </p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
