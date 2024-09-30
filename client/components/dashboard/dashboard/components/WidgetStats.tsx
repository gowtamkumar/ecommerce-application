"use client";
import React from "react";
import { Card, Statistic } from "antd";
import CountUp from "react-countup";

interface WidgetStatsProps {
  title: string;
  value: number;
  icon?: React.ReactNode;
  color?: string;
}

const WidgetStats: React.FC<WidgetStatsProps> = ({ title, value, icon, color }: any) => {
  
  // const formatter = (value: any) => <CountUp end={value} separator="," />;
  return (
    <Card className="rounded-t-md relative overflow-hidden border-0">
      <div className="flex text-red-800 justify-between items-center">
        <div className="w-auto">
          <Statistic
            title={title}
            value={value}
            prefix="৳"
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
