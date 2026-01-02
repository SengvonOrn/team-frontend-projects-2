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
import { Package, Calendar, DollarSign, ArrowRight } from "lucide-react";

export default function MyOrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchOrders = async () => {
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

        const response = await fetch(`${Backend_URL}/api/orders`, {
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
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();
        // Handle different response formats
        const ordersData = Array.isArray(data)
          ? data
          : data.orders || data.data || [];
        setOrders(ordersData);
      } catch (err: any) {
        console.error("Error fetching orders:", err);
        setError(err.message || "Failed to load orders");
        // For development, set empty array if API doesn't exist yet
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchOrders();
    }
  }, [session, status, router]);

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
        month: "short",
        day: "numeric",
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
      title="My Orders"
      description="View and manage your order history"
      showBreadcrumb={true}
    >
      <div className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {orders.length === 0 && !loading ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="w-16 h-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No orders yet
              </h3>
              <p className="text-gray-500 text-center mb-6">
                You haven't placed any orders yet. Start shopping to see your
                orders here.
              </p>
              <Button asChild>
                <Link href="/">Start Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card
                key={order.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold mb-2">
                        Order #
                        {order.orderNumber || order.id.slice(-8).toUpperCase()}
                      </CardTitle>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(order.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          <span className="font-semibold">
                            ${order.totalAmount.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Package className="w-4 h-4" />
                          <span>{order.items.length} item(s)</span>
                        </div>
                      </div>
                    </div>
                    <Badge className={`${getStatusColor(order.status)} border`}>
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Order Items Preview */}
                    <div className="space-y-2">
                      {order.items.slice(0, 3).map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 text-sm"
                        >
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.productName}
                              className="w-12 h-12 object-cover rounded"
                            />
                          )}
                          <div className="flex-1">
                            <p className="font-medium">{item.productName}</p>
                            <p className="text-gray-500">
                              Qty: {item.quantity} × ${item.price.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <p className="text-sm text-gray-500">
                          +{order.items.length - 3} more item(s)
                        </p>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="flex justify-end pt-2 border-t">
                      <Button variant="outline" asChild>
                        <Link href={`/orders/${order.id}`}>
                          View Details
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
