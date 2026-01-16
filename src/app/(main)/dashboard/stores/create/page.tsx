"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CreateStorePage() {
  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Create New Store
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Set up your store to start selling
        </p>
      </div>

      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>Store Details</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateStorePage />
        </CardContent>
      </Card>
    </div>
  );
}
