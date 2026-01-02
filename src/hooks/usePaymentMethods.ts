import { useState } from "react";
import { PaymentAccount, PaymentFormData, PaymentMethodType } from "@/types/payment.types";

export const usePaymentMethods = (initialAccounts: PaymentAccount[] = []) => {
  const [accounts, setAccounts] = useState<PaymentAccount[]>(initialAccounts);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<PaymentFormData>({
    type: "aba",
    accountName: "",
    accountNumber: "",
  });

  const handleFormChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleAddAccount = () => {
    if (!formData.accountName || !formData.accountNumber) return;

    const newAccount: PaymentAccount = {
      id: Date.now().toString(),
      type: formData.type,
      accountName: formData.accountName,
      accountNumber: formData.accountNumber,
      isActive: true,
      isPrimary: accounts.length === 0,
    };

    setAccounts([...accounts, newAccount]);
    resetForm();
  };

  const handleUpdateAccount = () => {
    if (!editingId) return;

    setAccounts(
      accounts.map((acc) =>
        acc.id === editingId ? { ...acc, ...formData } : acc
      )
    );
    resetForm();
  };

  const handleDeleteAccount = (id: string) => {
    if (window.confirm("Are you sure you want to delete this payment method?")) {
      setAccounts(accounts.filter((acc) => acc.id !== id));
    }
  };

  const handleToggleActive = (id: string) => {
    setAccounts(
      accounts.map((acc) =>
        acc.id === id ? { ...acc, isActive: !acc.isActive } : acc
      )
    );
  };

  const handleSetPrimary = (id: string) => {
    setAccounts(
      accounts.map((acc) => ({
        ...acc,
        isPrimary: acc.id === id,
      }))
    );
  };

  const startEdit = (account: PaymentAccount) => {
    setFormData({
      type: account.type,
      accountName: account.accountName,
      accountNumber: account.accountNumber,
    });
    setEditingId(account.id);
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData({ type: "aba", accountName: "", accountNumber: "" });
    setShowAddForm(false);
    setEditingId(null);
  };

  return {
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
  };
};