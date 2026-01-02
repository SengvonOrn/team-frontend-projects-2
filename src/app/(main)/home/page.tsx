"use client";
import Footer from "@/components/Footer";
import FreeDeliverySection from "@/components/FreeDeliverySection";
import { SectionCards } from "@/components/section-cards";
import { CustomHeaderSearchInput } from "./headerSearch";
import { TopDeal } from "@/components/TopDeals";
import { productsData } from "@/constants/productsData";
export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6">
      {/* <SectionCards /> */}

      {/* Hero Section with Search */}
      <CustomHeaderSearchInput />

      <FreeDeliverySection />

      {/* <TopDeal topDeals={topDealsData} /> */}
      <TopDeal topDeals={productsData.slice(0, 12)} />

      <Footer />
    </div>
  );
}
