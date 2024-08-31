"use client";
import { Button } from "antd";
import Link from "next/link";
import React from "react";

export default function TopBar() {
  return (
    <div className="text-center bg-[#F6F6F6] p-1 font-mono">
      <h3>FREE SHIPPING OVER $100 FREE RETURN</h3>
      {/* <div className="flex gap-5">
        <small>Help & Support</small>
        <small>
          <Link href="/about">About</Link>
        </small>
      </div>
      <div>
        <Button type="primary" size="small">
          <Link href="/">Donwload App</Link>
        </Button>
      </div> */}
    </div>
  );
}
