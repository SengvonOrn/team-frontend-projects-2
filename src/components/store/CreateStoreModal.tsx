"use client";
import React, { useState } from "react";
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
import { Store, Sparkles } from "lucide-react";
import { Backend_URL } from "@/constants/ConstantsUrl";
import { useSession } from "next-auth/react";
import { Toaster } from "../ui/toaster";

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
  onSubmit?: (data: StoreFormData) => void | Promise<void>;
}

export const CreateStoreModal: React.FC<CreateStoreModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<StoreFormData>({
    name: "",
    description: "",
    address: "",
    city: "",
    state: "",
  });
  const token = (session as any)?.backendTokens?.accessToken;
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  //==================================================================
  //
  //==================================================================

  const handleSubmit = async () => {
    if (!token) {
      alert("You must be logged in to create a store");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`${Backend_URL}/api/stores`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(
          Array.isArray(data.message) ? data.message.join(", ") : data.message
        );
      }
      setFormData({
        name: "",
        description: "",
        address: "",
        city: "",
        state: "",
      });

      onClose();
      if (onSubmit) await onSubmit(formData);
    } catch (error) {
      console.error("Error creating store:", error);
      alert("Server error while creating store");
    } finally {
      setIsLoading(false);
    }
  };

  //=================================================================
  //
  //=================================================================

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
          <div className="space-y-2">
            <Label htmlFor="name">Store Name *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., My Awesome Store"
              disabled={isLoading}
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
              <Input
                id="state"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                placeholder="State / Province"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !isFormValid}
            className="bg-gradient-to-r from-primary to-primary/80"
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
