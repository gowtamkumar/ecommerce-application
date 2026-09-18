"use client";
import { useCurrency } from "@/context/CurrencyContext";
import { Card, Statistic } from "antd";
import React from "react";

interface WidgetStatsProps {
  title: string;
  value: number;
  icon?: React.ReactNode;
  color?: string;
}

const WidgetStats: React.FC<WidgetStatsProps> = ({ title, value, icon }: WidgetStatsProps) => {
  const { formatPrice } = useCurrency();
  
  // const formatter = (value: any) => <CountUp end={value} separator="," />;
  return (
    <Card className="rounded-t-md relative overflow-hidden border-0">
      <div className="flex text-red-800 justify-between items-center">
        <div className="w-auto">
          <Statistic
            title={title}
            value={formatPrice(value)}
            precision={2}
            // formatter={formatter}
          />
        </div>
        {icon && (
          <div className="p-2 rounded-md shadow-md bg-slate-400 bg-opacity-75">
            <span className="text-white">{icon}</span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default WidgetStats;
