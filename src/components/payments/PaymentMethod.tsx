import React from "react";
import { PaymentMethodHeader } from "./PaymentMethodHeader";
import { PaymentMethodForm } from "./PaymentMethodForm";
import { PaymentAccountCard } from "./PaymentAccountCard";
import { EmptyState } from "./EmptyState";
import { InfoBox } from "./InfoBox";
import { usePaymentMethods } from "@/hooks/usePaymentMethods";

const initialAccounts = [
  {
    id: "1",
    type: "aba" as const,
    accountName: "Business Account",
    accountNumber: "001234567",
    isActive: true,
    isPrimary: true,
  },
];

export const PaymentMethods: React.FC = () => {
  const {
    accounts,
    showAddForm,
    editingId,
    formData,
    handleFormChange,
    handleAddAccount,
    handleUpdateAccount,
    handleDeleteAccount,
    handleToggleActive,
    handleSetPrimary,
    startEdit,
    resetForm,
    setShowAddForm,
  } = usePaymentMethods(initialAccounts);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 max-w-5xl mx-auto">
      <PaymentMethodHeader
        showAddForm={showAddForm}
        onToggleForm={() => setShowAddForm(!showAddForm)}
      />

      {showAddForm && (
        <PaymentMethodForm
          formData={formData}
          isEditing={!!editingId}
          onFormChange={handleFormChange}
          onSubmit={editingId ? handleUpdateAccount : handleAddAccount}
          onCancel={resetForm}
        />
      )}

      <div className="space-y-4">
        {accounts.length === 0 ? (
          <EmptyState />
        ) : (
          accounts.map((account) => (
            <PaymentAccountCard
              key={account.id}
              account={account}
              onEdit={() => startEdit(account)}
              onDelete={() => handleDeleteAccount(account.id)}
              onToggleActive={() => handleToggleActive(account.id)}
              onSetPrimary={() => handleSetPrimary(account.id)}
            />
          ))
        )}
      </div>

      <InfoBox />
    </div>
  );
};