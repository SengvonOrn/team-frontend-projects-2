"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Store, Sparkles, Loader2 } from "lucide-react";
import { createStore, getStates, updateStore } from "@/lib/action/stores";
import { IStore } from "@/types/store";
import { useToast } from "@/components/ui/use-toast";

// Zod schema for validation
export const storeFormSchema = z.object({
  name: z.string().min(1, "Store name is required").max(100, "Store name is too long"),
  description: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
});

type StoreFormValues = z.infer<typeof storeFormSchema>;

interface CreateStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (storeData: any) => void;
  store?: IStore | null;
  isEditing?: boolean;
}

export const CreateStoreModal: React.FC<CreateStoreModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  store,
  isEditing = false,
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);
  const [states, setStates] = useState<string[]>([]);

  // Initialize form with react-hook-form and zod
  const form = useForm<StoreFormValues>({
    resolver: zodResolver(storeFormSchema),
    defaultValues: {
      name: "",
      description: "",
      address: "",
      city: "",
      state: "",
    },
  });

  // Fetch states when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchStates();
      
      // Populate form with store data if editing
      if (isEditing && store) {
        form.reset({
          name: store.name || "",
          description: store.description || "",
          address: store.address || "",
          city: store.city || "",
          state: store.state || "",
        });
      } else {
        // Reset form for create mode
        form.reset({
          name: "",
          description: "",
          address: "",
          city: "",
          state: "",
        });
      }
    }
  }, [isOpen, isEditing, store, form]);

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

  const onSubmit = async (values: StoreFormValues) => {
    setIsLoading(true);

    try {
      let result;

      if (isEditing && store?.id) {
        // UPDATE: Use FormData for PATCH request
        const formData = new FormData();
        formData.append('name', values.name.trim());
        
        if (values.description?.trim()) {
          formData.append('description', values.description.trim());
        }
        if (values.address?.trim()) {
          formData.append('address', values.address.trim());
        }
        if (values.city?.trim()) {
          formData.append('city', values.city.trim());
        }
        if (values.state?.trim()) {
          formData.append('state', values.state.trim());
        }
        
        result = await updateStore(store.id, formData);
      } else {
        // CREATE: Use plain object for POST request
        const storeData = {
          name: values.name.trim(),
          description: values.description?.trim() || undefined,
          address: values.address?.trim() || undefined,
          city: values.city?.trim() || undefined,
          state: values.state?.trim() || undefined,
        };
        
        result = await createStore(storeData);
      }

      if (!result.success) {
        toast({
          variant: "destructive",
          title: "Error",
          description: Array.isArray(result.message)
            ? result.message.join(", ")
            : result.message,
        });
        return;
      }

      // Success
      toast({
        title: "Success",
        description: isEditing 
          ? "Store updated successfully" 
          : "Store created successfully",
      });

      // Call success callback
      if (onSuccess) {
        onSuccess(result.data);
      }

      // Close modal
      onClose();
      
      // Reset form
      form.reset();
    } catch (error) {
      console.error("Error processing store:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const title = isEditing ? "Edit Store" : "Create New Store";
  const description = isEditing
    ? "Update your store information"
    : "Enter basic information about your store";
  const buttonText = isEditing ? "Update Store" : "Create Store";

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
              <Store className="w-6 h-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl">{title}</DialogTitle>
              <DialogDescription className="mt-1">
                {description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            {/* Store Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Store Name <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., My Awesome Store"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell customers about your store..."
                      className="min-h-[90px] resize-none"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Address */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Street, building, etc."
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* City and State */}
            <div className="grid grid-cols-2 gap-4">
              {/* City */}
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="City"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* State */}
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <Select
                      disabled={isLoading || loadingStates}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a state" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {states.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-primary to-primary/80"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {isEditing ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    {buttonText}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};