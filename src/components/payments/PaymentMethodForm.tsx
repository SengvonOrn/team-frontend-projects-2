import React from "react";
import { Save } from "lucide-react";
import { PaymentFormData } from "@/types/payment.types";
import { paymentMethodOptions } from "@/constants/payment.constants";

interface PaymentMethodFormProps {
  formData: PaymentFormData;
  isEditing: boolean;
  onFormChange: (field: string, value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export const PaymentMethodForm: React.FC<PaymentMethodFormProps> = ({
  formData,
  isEditing,
  onFormChange,
  onSubmit,
  onCancel,
}) => (
  <div className="mb-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-green-600">
    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
      {isEditing ? "Edit Payment Method" : "Add New Payment Method"}
    </h3>

    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Payment Method Type *
        </label>
        <select
          value={formData.type}
          onChange={(e) => onFormChange("type", e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-600 focus:border-transparent"
        >
          {paymentMethodOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.logo} {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Account Name *
        </label>
        <input
          type="text"
          value={formData.accountName}
          onChange={(e) => onFormChange("accountName", e.target.value)}
          placeholder="Enter account holder name"
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-600 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Account Number *
        </label>
        <input
          type="text"
          value={formData.accountNumber}
          onChange={(e) => onFormChange("accountNumber", e.target.value)}
          placeholder="Enter account number"
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-600 focus:border-transparent"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onSubmit}
          className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          {isEditing ? "Update" : "Add"} Method
        </button>
      </div>
    </div>
  </div>
);