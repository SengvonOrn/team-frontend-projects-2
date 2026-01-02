
import React from "react";
import { Edit2, Trash2, CheckCircle2 } from "lucide-react";
import { PaymentAccount } from "@/types/payment.types";
import { getMethodLabel, getMethodLogo } from "@/utils/payment.utils";

interface PaymentAccountCardProps {
  account: PaymentAccount;
  onEdit: () => void;
  onDelete: () => void;
  onToggleActive: () => void;
  onSetPrimary: () => void;
}

export const PaymentAccountCard: React.FC<PaymentAccountCardProps> = ({
  account,
  onEdit,
  onDelete,
  onToggleActive,
  onSetPrimary,
}) => (
  <div
    className={`p-5 rounded-lg border-2 transition-all ${
      account.isActive
        ? "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
        : "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 opacity-60"
    }`}
  >
    <div className="flex items-start justify-between">
      <div className="flex items-start gap-4 flex-1">
        <div className="text-4xl">{getMethodLogo(account.type)}</div>

        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {getMethodLabel(account.type)}
            </h3>

            {account.isPrimary && (
              <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full">
                Primary
              </span>
            )}

            {account.isActive ? (
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                Active
              </span>
            ) : (
              <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full">
                Inactive
              </span>
            )}
          </div>

          <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
            <p>
              <span className="font-medium">Account Name:</span>{" "}
              {account.accountName}
            </p>
            <p>
              <span className="font-medium">Account Number:</span>{" "}
              {account.accountNumber}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {!account.isPrimary && account.isActive && (
          <button
            onClick={onSetPrimary}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Set as primary"
          >
            <CheckCircle2 className="w-5 h-5" />
          </button>
        )}

        <button
          onClick={onEdit}
          className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          title="Edit"
        >
          <Edit2 className="w-5 h-5" />
        </button>

        <button
          onClick={onToggleActive}
          className={`px-3 py-1 text-sm rounded-lg transition-colors ${
            account.isActive
              ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 hover:bg-yellow-200 dark:hover:bg-yellow-800"
              : "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800"
          }`}
        >
          {account.isActive ? "Disable" : "Enable"}
        </button>

        <button
          onClick={onDelete}
          className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          title="Delete"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
);