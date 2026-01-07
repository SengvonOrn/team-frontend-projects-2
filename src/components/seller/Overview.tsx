import React from "react";
import {
  Package,
  DollarSign,
  TrendingUp,
  Star,
  ShoppingCart,
  Users,
  ArrowUp,
  ArrowDown,
  MoreVertical,
  Eye,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/utils/utils";
import { Product } from "@/types/types";

interface OverviewPageProps {
  products: Product[];
}

const StatCard = ({
  icon: Icon,
  label,
  value,
  change,
  changeType,
  color,
}: {
  icon: any;
  label: string;
  value: string | number;
  change?: string;
  changeType?: "increase" | "decrease";
  color: string;
}) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className={cn("p-3 bg-gradient-to-br rounded-xl", color)}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {change && (
          <Badge
            variant="secondary"
            className={cn(
              "gap-1",
              changeType === "increase"
                ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
            )}
          >
            {changeType === "increase" ? (
              <ArrowUp className="w-3 h-3" />
            ) : (
              <ArrowDown className="w-3 h-3" />
            )}
            {change}
          </Badge>
        )}
      </div>
      <p className="text-2xl font-bold mb-1">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </CardContent>
  </Card>
);

const RecentOrder = ({
  orderId,
  customer,
  amount,
  status,
  time,
}: {
  orderId: string;
  customer: string;
  amount: number;
  status: "completed" | "pending" | "processing";
  time: string;
}) => {
  const statusColors = {
    completed:
      "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    pending:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
    processing: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground font-bold text-sm">
          {customer.charAt(0)}
        </div>
        <div>
          <p className="font-semibold text-sm">{customer}</p>
          <p className="text-xs text-muted-foreground">Order #{orderId}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-bold text-sm">${amount.toFixed(2)}</p>
        <Badge className={cn("text-xs", statusColors[status])}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      </div>
    </div>
  );
};

export default function OverviewPage({ products }: OverviewPageProps) {
  const storeStats = {
    totalProducts: products.length,
    totalRevenue: 12540.5,
    totalSold: products.reduce((sum, p) => sum + (p.sold || 0), 0),
    avgRating: 4.7,
    totalOrders: 1279,
    activeCustomers: 856,
  };

  const recentOrders = [
    {
      orderId: "10234",
      customer: "John Smith",
      amount: 129.99,
      status: "completed" as const,
      time: "2 mins ago",
    },
    {
      orderId: "10233",
      customer: "Sarah Johnson",
      amount: 89.5,
      status: "processing" as const,
      time: "15 mins ago",
    },
    {
      orderId: "10232",
      customer: "Mike Wilson",
      amount: 245.0,
      status: "pending" as const,
      time: "1 hour ago",
    },
    {
      orderId: "10231",
      customer: "Emma Davis",
      amount: 67.99,
      status: "completed" as const,
      time: "2 hours ago",
    },
  ];

  const categoryPerformance = [
    { name: "Electronics", sales: 3450, percentage: 35 },
    { name: "Fashion", sales: 2780, percentage: 28 },
    { name: "Home & Garden", sales: 2180, percentage: 22 },
    { name: "Sports", sales: 1490, percentage: 15 },
  ];

  return (
    <div className="space-y-6">
      {/* ======================================= */}
      {/* Header */}
      {/* ======================================= */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back to your store</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Clock className="w-4 h-4 mr-2" />
            Last 30 days
          </Button>
          <Button size="sm">Download Report</Button>
        </div>
      </div>

      {/* ======================================= */}
      {/* Stats Grid */}
      {/* ======================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Package}
          label="Total Products"
          value={storeStats.totalProducts}
          change="12%"
          changeType="increase"
          color="from-blue-500 to-blue-600"
        />
        <StatCard
          icon={DollarSign}
          label="Total Revenue"
          value={`$${storeStats.totalRevenue.toLocaleString()}`}
          change="23.5%"
          changeType="increase"
          color="from-green-500 to-green-600"
        />
        <StatCard
          icon={ShoppingCart}
          label="Total Orders"
          value={storeStats.totalOrders}
          change="8.2%"
          changeType="increase"
          color="from-purple-500 to-purple-600"
        />
        <StatCard
          icon={Users}
          label="Active Customers"
          value={storeStats.activeCustomers}
          change="3.1%"
          changeType="decrease"
          color="from-orange-500 to-orange-600"
        />
      </div>

      {/* =================================================== */}
      {/* Main Content Grid */}
      {/* =================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Sales Overview</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Weekly sales performance
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>View Details</DropdownMenuItem>
                <DropdownMenuItem>Export Data</DropdownMenuItem>
                <DropdownMenuItem>Configure</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between gap-2">
              {[
                { day: "Mon", value: 45 },
                { day: "Tue", value: 52 },
                { day: "Wed", value: 48 },
                { day: "Thu", value: 61 },
                { day: "Fri", value: 55 },
                { day: "Sat", value: 67 },
                { day: "Sun", value: 72 },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-2"
                >
                  <div className="text-xs font-bold text-muted-foreground">
                    ${item.value}k
                  </div>
                  <div
                    className="w-full bg-gradient-to-t from-primary to-primary/60 rounded-t-lg transition-all hover:from-primary/80"
                    style={{ height: `${(item.value / 80) * 100}%` }}
                  />
                  <span className="text-xs font-medium text-muted-foreground">
                    {item.day}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Status Cards */}
        <div className="space-y-4">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium opacity-90">
                  Active Products
                </p>
                <Package className="w-5 h-5 opacity-80" />
              </div>
              <p className="text-3xl font-bold mb-1">
                {products.filter((p) => p.status === "active").length}
              </p>
              <p className="text-xs opacity-75">
                {(
                  (products.filter((p) => p.status === "active").length /
                    products.length) *
                  100
                ).toFixed(0)}
                % of total
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium opacity-90">Out of Stock</p>
                <Package className="w-5 h-5 opacity-80" />
              </div>
              <p className="text-3xl font-bold mb-1">
                {products.filter((p) => p.status === "out_of_stock").length}
              </p>
              <p className="text-xs opacity-75">Needs restocking</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium opacity-90">Draft Products</p>
                <Package className="w-5 h-5 opacity-80" />
              </div>
              <p className="text-3xl font-bold mb-1">
                {products.filter((p) => p.status === "draft").length}
              </p>
              <p className="text-xs opacity-75">Ready to publish</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ================================================ */}
      {/* Bottom Grid */}
      {/* =============================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Top Products</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Best selling this month
              </p>
            </div>
            <Button variant="ghost" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {products.slice(0, 4).map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">
                      {product.name}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>${product.price}</span>
                      <span>•</span>
                      <span>{product.sold} sold</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm">
                      ${(product.price * (product.sold || 0)).toFixed(0)}
                    </p>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs text-muted-foreground">
                        {product.rating}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Latest customer orders
              </p>
            </div>
            <Button variant="ghost" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentOrders.map((order) => (
                <RecentOrder key={order.orderId} {...order} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* =============================================== */}
      {/* Category Performance */}
      {/* =============================================== */}

      <Card>
        <CardHeader>
          <CardTitle>Category Performance</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Sales distribution by category
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categoryPerformance.map((category) => (
              <div key={category.name}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-sm">
                      {category.name}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {category.percentage}%
                    </Badge>
                  </div>
                  <span className="text-sm font-bold">
                    ${category.sales.toLocaleString()}
                  </span>
                </div>
                {/* <Progress value={category.percentage} className="h-2" /> */}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
