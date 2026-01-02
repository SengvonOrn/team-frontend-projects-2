import React from "react";

export const InfoBox: React.FC = () => (
  <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
    <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
      ℹ️ Payment Method Configuration
    </h4>
    <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
      <li>• Add multiple payment methods to give customers payment options</li>
      <li>• Set one method as primary - it will be shown first to customers</li>
      <li>• Enable/disable methods without deleting them</li>
      <li>• Only active methods will be visible to customers during checkout</li>
    </ul>
  </div>
);