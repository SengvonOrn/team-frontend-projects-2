"use client";

import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building2,
  MapPin,
  Globe,
  Upload,
  Save,
  X,
  Image as ImageIcon,
  Settings,
  Store,
  Mail,
  Phone,
  AlertCircle,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-Toast";
import { IStore, BusinessHours } from "@/types/store";
import { cn, storeFormSchema } from "@/utils/utils";
import { updateStore } from "@/lib/action/stores";

// Form validation schema

type StoreFormValues = z.infer<typeof storeFormSchema>;

interface StoreProfileFormProps {
  store: IStore;
  isLoading?: boolean;
}

export default function StoreProfileForm({
  store,
  isLoading = false,
}: StoreProfileFormProps) {
  const { toast } = useToast();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  // Initialize form with store data
  const form = useForm<StoreFormValues>({
    resolver: zodResolver(storeFormSchema),
    defaultValues: {
      name: store.name || "",
      description: store.description || "",
      address: store.address || "",
      city: store.city || "",
      state: store.state || "",
      // country: store.country || "",
      // postalCode: store.postalCode || "",
      // contactEmail: store.contactEmail || "",
      // contactPhone: store.contactPhone || "",
      // website: store.website || "",
      // isActive: store.isActive ?? true, // ✅ Add isActive with default
      // businessHours: {
      //   open: store.businessHours?.open || "",
      //   close: store.businessHours?.close || "",
      //   days: store.businessHours?.days || [],
      // },
    },
  });

  // Handle image upload for logo
  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle image upload for banner
  const handleBannerUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 10MB",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // ✅ Form submission handler - FIXED
  const onSubmit = async (data: StoreFormValues) => {
    setIsSubmitting(true);
    try {
      // ✅ Call server action directly
      const result = await updateStore(store.id, data);

      if (result.success) {
        toast({
          title: "Success",
          description: "Store profile updated successfully",
        });
        form.reset(data);
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Update store error:", error);
      toast({
        title: "Error",
        description: "Failed to update store profile",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Business hours days options
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (
    <div className="space-y-6">
      {/* Store Status Banner */}
      <Alert className="bg-blue-50 border-blue-200">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-700">
          Your store profile is {store.isActive ? "active" : "inactive"}.
          Customers {store.isActive ? "can" : "cannot"} view your products.
        </AlertDescription>
      </Alert>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic" className="flex items-center gap-2">
                <Store className="w-4 h-4" />
                Basic Info
              </TabsTrigger>
              <TabsTrigger value="media" className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Media
              </TabsTrigger>
              <TabsTrigger value="contact" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Contact
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            {/* Basic Information Tab */}
            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{store.name} Store Information</CardTitle>
                  <CardDescription>
                    Update your store's basic information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {store.name}-----------------------
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Store className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input
                              placeholder="Enter store name"
                              className="pl-10"
                              value={store.name}
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          This will be displayed to your customers
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Store Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your store"
                            className="min-h-[120px]"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormDescription>
                          Briefly describe what your store offers
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Location Information</CardTitle>
                  <CardDescription>Where your store is located</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input
                              placeholder="Enter street address"
                              className="pl-10"
                              {...field}
                              value={field.value || ""}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="City"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State/Province</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="State"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select country" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="US">United States</SelectItem>
                              <SelectItem value="CA">Canada</SelectItem>
                              <SelectItem value="UK">United Kingdom</SelectItem>
                              <SelectItem value="AU">Australia</SelectItem>
                              <SelectItem value="IN">India</SelectItem>
                              <SelectItem value="KH">Cambodia</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    /> */}

                    {/* <FormField
                      control={form.control}
                      name="postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postal Code</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Postal code"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    /> */}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Media Tab */}
            <TabsContent value="media" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Store Media</CardTitle>
                  <CardDescription>
                    Upload your store logo and banner
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row items-start gap-6">
                    {/* Logo Section */}
                    <div className="space-y-4">
                      <div className="w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                        {logoPreview ? (
                          <div className="relative">
                            <img
                              src={logoPreview}
                              alt="Logo preview"
                              className="w-full h-full object-contain rounded-lg"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute -top-2 -right-2 w-6 h-6"
                              onClick={() => setLogoPreview(null)}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        ) : (
                          <div className="text-center">
                            <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-500">
                              No logo uploaded
                            </p>
                          </div>
                        )}
                      </div>

                      <div>
                        <Input
                          ref={logoInputRef}
                          id="logo-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => logoInputRef.current?.click()}
                          className="w-full"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Logo
                        </Button>
                      </div>
                    </div>

                    {/* Banner Section */}
                    <div className="flex-1 space-y-4">
                      <div className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                        {bannerPreview ? (
                          <div className="relative w-full h-full">
                            <img
                              src={bannerPreview}
                              alt="Banner preview"
                              className="w-full h-full object-cover rounded-lg"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2 w-6 h-6"
                              onClick={() => setBannerPreview(null)}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        ) : (
                          <div className="text-center">
                            <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-500">
                              No banner uploaded
                            </p>
                          </div>
                        )}
                      </div>

                      <div>
                        <Input
                          ref={bannerInputRef}
                          id="banner-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleBannerUpload}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => bannerInputRef.current?.click()}
                          className="w-full"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Banner
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Contact Information Tab */}
            <TabsContent value="contact" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>
                    How customers can contact your store
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* <FormField
                    control={form.control}
                    name="contactEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input
                              type="email"
                              placeholder="contact@example.com"
                              className="pl-10"
                              {...field}
                              value={field.value || ""}
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Customers will use this email to contact you
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}

                  {/* <FormField
                    control={form.control}
                    name="contactPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Phone</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input
                              type="tel"
                              placeholder="+1 (555) 123-4567"
                              className="pl-10"
                              {...field}
                              value={field.value || ""}
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Include country code if applicable
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}

                  {/* <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input
                              placeholder="https://example.com"
                              className="pl-10"
                              {...field}
                              value={field.value || ""}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            {/* <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Store Settings</CardTitle>
                  <CardDescription>
                    Manage your store preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Store Status
                          </FormLabel>
                          <FormDescription>
                            {field.value
                              ? "Your store is visible to customers"
                              : "Your store is hidden from customers"}
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Business Hours</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="businessHours.open"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Opening Time</FormLabel>
                            <FormControl>
                              <Input
                                type="time"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="businessHours.close"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Closing Time</FormLabel>
                            <FormControl>
                              <Input
                                type="time"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="businessHours.days"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Days</FormLabel>
                          <div className="flex flex-wrap gap-2">
                            {daysOfWeek.map((day) => (
                              <Button
                                key={day}
                                type="button"
                                variant={
                                  field.value?.includes(day)
                                    ? "default"
                                    : "outline"
                                }
                                size="sm"
                                onClick={() => {
                                  const currentDays = field.value || [];
                                  const newDays = currentDays.includes(day)
                                    ? currentDays.filter((d) => d !== day)
                                    : [...currentDays, day];
                                  field.onChange(newDays);
                                }}
                              >
                                {day.slice(0, 3)}
                              </Button>
                            ))}
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent> */}
          </Tabs>

          {/* Action Buttons */}
          <div className="flex items-center justify-between border-t pt-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                Created: {new Date(store.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                disabled={isSubmitting}
              >
                Reset Changes
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="gap-2"
              >
                <Save className="w-4 h-4" />
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
