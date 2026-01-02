"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/Breadcrum/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Order } from "@/types/order";
import { Backend_URL } from "@/constants/ConstantsUrl";
import Link from "next/link";
import {
  Package,
  Calendar,
  DollarSign,
  MapPin,
  CreditCard,
  ArrowLeft,
} from "lucide-react";

export default function OrderDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchOrder = async () => {
      if (status !== "authenticated" || !session) return;

      try {
        setLoading(true);
        const backendTokens = (session as any)?.backendTokens;
        const accessToken = backendTokens?.accessToken;

        if (!accessToken) {
          setError("No access token found");
          setLoading(false);
          return;
        }

        const response = await fetch(`${Backend_URL}/api/orders/${params.id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          if (response.status === 401) {
            router.push("/login");
            return;
          }
          if (response.status === 404) {
            setError("Order not found");
            setLoading(false);
            return;
          }
          throw new Error("Failed to fetch order");
        }

        const data = await response.json();
        // Handle different response formats
        const orderData = data.order || data.data || data;
        setOrder(orderData);
      } catch (err: any) {
        console.error("Error fetching order:", err);
        setError(err.message || "Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchOrder();
    }
  }, [session, status, router, params.id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "shipped":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  if (status === "loading" || loading) {
    return <LoadingSpinner />;
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <DashboardLayout
      title="Order Details"
      description={`Order #${params.id.slice(-8).toUpperCase()}`}
      showBreadcrumb={true}
    >
      <div className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {!order && !loading ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="w-16 h-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Order not found
              </h3>
              <p className="text-gray-500 text-center mb-6">
                The order you're looking for doesn't exist or you don't have
                permission to view it.
              </p>
              <Button asChild>
                <Link href="/orders">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Orders
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : order ? (
          <>
            {/* Order Header */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold mb-2">
                      Order #
                      {order.orderNumber || order.id.slice(-8).toUpperCase()}
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Placed on {formatDate(order.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <Badge
                    className={`${getStatusColor(
                      order.status
                    )} border text-sm px-3 py-1`}
                  >
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Order Items */}
              <div className="lg:col-span-2 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Order Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-start gap-4 pb-4 border-b last:border-0"
                        >
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.productName}
                              className="w-20 h-20 object-cover rounded"
                            />
                          )}
                          <div className="flex-1">
                            <h4 className="font-semibold mb-1">
                              {item.productName}
                            </h4>
                            <p className="text-sm text-gray-600 mb-2">
                              Quantity: {item.quantity}
                            </p>
                            <p className="text-lg font-semibold text-orange-600">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-semibold">
                        ${order.totalAmount.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t">
                      <span className="text-lg font-semibold">Total</span>
                      <span className="text-lg font-bold text-orange-600">
                        ${order.totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Shipping Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm space-y-1">
                      <p className="font-medium">
                        {order.shippingAddress.street}
                      </p>
                      <p>
                        {order.shippingAddress.city},{" "}
                        {order.shippingAddress.state}{" "}
                        {order.shippingAddress.zipCode}
                      </p>
                      <p>{order.shippingAddress.country}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Payment Method
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm font-medium">{order.paymentMethod}</p>
                  </CardContent>
                </Card>

                <Button asChild variant="outline" className="w-full">
                  <Link href="/orders">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Orders
                  </Link>
                </Button>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </DashboardLayout>
  );
}
