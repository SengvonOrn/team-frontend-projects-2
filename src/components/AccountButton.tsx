"use client";

import { Button } from "@/components/ui/button";
import AuthDialog from "@/components/common/auth/AuthDialog";

export default function AccountButton() {
  return (
    <div className="flex gap-2">
      <AuthDialog type="login" className="text-left h-auto p-2" />
      <AuthDialog type="register" className="text-left h-auto p-2" />
    </div>
  );
}
