/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import React, { ReactNode } from "react";
import Link from "next/link";
import { BsDashLg } from "react-icons/bs";

type TBreadCrumbProps = {
  // separator: ReactNode
  containerClasses?: string;
  path?: any;
};

const BreadCrumb = ({
  containerClasses = "",
  path,
}: TBreadCrumbProps) => {
  return (
    <div className="hidden md:block">
      <nav
        className={`flex justify-center md:my-2 my-0 py-4 ${containerClasses}`}
      >
        <ul className="flex flex-col md:flex-row items-center space-x-1">
          {path.map((item: any, index: any) => {
            return (
              <React.Fragment key={index}>
                {index !== 0 && <BsDashLg size={30}  />}
                <li>
                  <Link className="font-bold" href={item.url}>
                    {item.title}
                  </Link>
                </li>
              </React.Fragment>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default BreadCrumb;
