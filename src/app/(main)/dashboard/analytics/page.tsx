"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { TrendingUp, Users, ShoppingCart, DollarSign } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function AnalyticsPage() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status !== "loading") {
      setIsLoading(false);
    }
  }, [status]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  // Sample data - Replace with real data from API
  const salesData = [
    { month: "Jan", sales: 4000, revenue: 2400 },
    { month: "Feb", sales: 3000, revenue: 1398 },
    { month: "Mar", sales: 2000, revenue: 9800 },
    { month: "Apr", sales: 2780, revenue: 3908 },
    { month: "May", sales: 1890, revenue: 4800 },
    { month: "Jun", sales: 2390, revenue: 3800 },
  ];

  const productPerformance = [
    { name: "Product A", value: 45, fill: "#3b82f6" },
    { name: "Product B", value: 30, fill: "#8b5cf6" },
    { name: "Product C", value: 25, fill: "#ec4899" },
  ];

  const statsCards = [
    {
      title: "Total Revenue",
      value: "$45,231.89",
      change: "+20.1%",
      icon: DollarSign,
      color: "from-green-600 to-green-400",
    },
    {
      title: "Total Orders",
      value: "1,234",
      change: "+15.3%",
      icon: ShoppingCart,
      color: "from-blue-600 to-blue-400",
    },
    {
      title: "New Customers",
      value: "456",
      change: "+12.5%",
      icon: Users,
      color: "from-purple-600 to-purple-400",
    },
    {
      title: "Growth Rate",
      value: "23.5%",
      change: "+4.3%",
      icon: TrendingUp,
      color: "from-orange-600 to-orange-400",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Analytics
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Track your store performance and insights
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {stat.title}
                </CardTitle>
                <div
                  className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}
                >
                  <Icon size={20} className="text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {stat.value}
                </div>
                <p className="text-xs text-green-600 dark:text-green-400 font-semibold mt-1">
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Sales & Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#3b82f6"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Product Performance Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={productPerformance}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {productPerformance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="#3b82f6" />
              <Bar dataKey="revenue" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-300 text-sm">
                    Order ID
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-300 text-sm">
                    Customer
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-300 text-sm">
                    Amount
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-300 text-sm">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    id: "ORD-001",
                    customer: "John Doe",
                    amount: "$299.99",
                    status: "Completed",
                  },
                  {
                    id: "ORD-002",
                    customer: "Jane Smith",
                    amount: "$149.99",
                    status: "Pending",
                  },
                  {
                    id: "ORD-003",
                    customer: "Bob Johnson",
                    amount: "$89.99",
                    status: "Completed",
                  },
                ].map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  >
                    <td className="px-4 py-4 font-medium text-slate-900 dark:text-white">
                      {order.id}
                    </td>
                    <td className="px-4 py-4 text-slate-600 dark:text-slate-400">
                      {order.customer}
                    </td>
                    <td className="px-4 py-4 text-slate-600 dark:text-slate-400">
                      {order.amount}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          order.status === "Completed"
                            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                            : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
