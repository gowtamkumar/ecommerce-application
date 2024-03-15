"use client";

import { increment } from "@/redux/features/counter/counterSlice";
import { RootState } from "@/redux/store";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Orders() {
  const counter = useSelector((state: RootState) => state.counter);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(increment());
  }, []);
  return <div>Orders{counter.value}</div>;
}
