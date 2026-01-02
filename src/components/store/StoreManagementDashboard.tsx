"use client";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, TrendingUp, Users, DollarSign } from "lucide-react";

interface StoreStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
}

interface StoreData {
  id: string;
  name: string;
  category: string;
  description: string;
  status: "active" | "inactive";
  createdAt: string;
}

interface Props {
  storeData: StoreData;
  stats: StoreStats;
  onAddProduct: () => void;
  onEditStore: () => void;
}

const StatCard = ({ 
  icon: Icon, 
  label, 
  value, 
  trend 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string | number; 
  trend?: string;
}) => (
  <Card className="hover:shadow-lg transition-shadow">
    <CardContent className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <h3 className="text-3xl font-bold mt-2">{value}</h3>
          {trend && (
            <p className="text-xs text-green-600 font-medium mt-2">
              ↑ {trend} vs last month
            </p>
          )}
        </div>
        <div className="p-3 bg-primary/10 rounded-lg text-primary">
          {Icon}
        </div>
      </div>
    </CardContent>
  </Card>
);

export const StoreManagementDashboard = ({
  storeData,
  stats,
  onAddProduct,
  onEditStore,
}: Props) => {
  return (
    <div className="space-y-8">
      {/* Store Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">{storeData.name}</h1>
          <p className="text-muted-foreground mt-2">{storeData.description}</p>
          <div className="flex gap-4 mt-4">
            <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              {storeData.status}
            </span>
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              {storeData.category}
            </span>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onEditStore}
            className="px-6 py-2 border border-input rounded-lg hover:bg-accent transition-colors"
          >
            Edit Store
          </button>
          <button
            onClick={onAddProduct}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Add Product
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          icon={<ShoppingCart className="w-6 h-6" />}
          label="Total Products"
          value={stats.totalProducts}
          trend="20%"
        />
        <StatCard
          icon={<TrendingUp className="w-6 h-6" />}
          label="Total Orders"
          value={stats.totalOrders}
          trend="12%"
        />
        <StatCard
          icon={<DollarSign className="w-6 h-6" />}
          label="Total Revenue"
          value={`$${stats.totalRevenue}`}
          trend="8%"
        />
        <StatCard
          icon={<Users className="w-6 h-6" />}
          label="Total Customers"
          value={stats.totalCustomers}
          trend="15%"
        />
      </div>
    </div>
  );
};