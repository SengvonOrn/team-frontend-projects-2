"use client";
import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Store, Sparkles, Loader2 } from "lucide-react";
import { createStore, getStates } from "@/lib/action/stores";

export interface StoreFormData {
  name: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
}

interface CreateStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (storeData: any) => void;
}

export const CreateStoreModal: React.FC<CreateStoreModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);
  const [states, setStates] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<StoreFormData>({
    name: "",
    description: "",
    address: "",
    city: "",
    state: "",
  });

  // Fetch states when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchStates();
    }
  }, [isOpen]);

  const fetchStates = async () => {
    setLoadingStates(true);
    try {
      const result = await getStates();
      if (result.success && result.data) {
        setStates(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch states:", error);
    } finally {
      setLoadingStates(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      setError("Store name is required");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await createStore({
        name: formData.name.trim(),
        description: formData.description?.trim() || undefined,
        address: formData.address?.trim() || undefined,
        city: formData.city?.trim() || undefined,
        state: formData.state?.trim() || undefined,
      });

      if (!result.success) {
        setError(
          Array.isArray(result.message)
            ? result.message.join(", ")
            : result.message
        );
        return;
      }

      // Reset form
      setFormData({
        name: "",
        description: "",
        address: "",
        city: "",
        state: "",
      });

      // Call success callback
      if (onSuccess) {
        onSuccess(result.data);
      }

      // Close modal
      onClose();
    } catch (error) {
      console.error("Error creating store:", error);
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = formData.name.trim();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
              <Store className="w-6 h-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl">Create New Store</DialogTitle>
              <DialogDescription className="mt-1">
                Enter basic information about your store
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {error && (
            <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">
              Store Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., My Awesome Store"
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Tell customers about your store..."
              className="min-h-[90px] resize-none"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Street, building, etc."
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="City"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <div className="relative">
                <select
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  disabled={isLoading || loadingStates}
                  className="w-full px-3 py-2 border rounded-md bg-background"
                >
                  <option value="">Select a state</option>
                  {states.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
                {loadingStates && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            type="button"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !isFormValid}
            className="bg-gradient-to-r from-primary to-primary/80"
            type="button"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Creating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Create Store
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
