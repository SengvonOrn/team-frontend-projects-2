import React from "react";
import { Building2 } from "lucide-react";

export const EmptyState: React.FC = () => (
  <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
    <Building2 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
    <p className="text-gray-600 dark:text-gray-400">
      No payment methods configured yet
    </p>
    <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
      Add your first payment method to start receiving payments
    </p>
  </div>
);