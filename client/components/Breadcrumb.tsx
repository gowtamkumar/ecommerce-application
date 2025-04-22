"use client";
import React, { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

type TBreadCrumbProps = {
  homeElement: ReactNode;
  separator: ReactNode;
  containerClasses?: string;
  listClasses?: string;
  activeClasses?: string;
  capitalizeLinks?: boolean;
};

const Breadcrumb = ({
  homeElement,
  separator,
  containerClasses = "",
  listClasses = "",
  activeClasses = "",
  capitalizeLinks = false,
}: TBreadCrumbProps) => {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean); // Removes empty segments

  const formatLink = (link: string) =>
    capitalizeLinks ? link.charAt(0).toUpperCase() + link.slice(1) : link;

  return (
    <nav className={`flex justify-center my-3 py-4 ${containerClasses}`}>
      <ul className="flex items-center space-x-2">
        <li className={listClasses}>
          <Link href="/">{homeElement}</Link>
        </li>

        {pathSegments.map((segment, index) => {
          const isLast = index === pathSegments.length - 1;
          const href = "/" + pathSegments.slice(0, index + 1).join("/");
          const itemClasses = isLast
            ? `${listClasses} ${activeClasses}`
            : listClasses;

          return (
            <React.Fragment key={index}>
              {separator}
              <li className={itemClasses}>
                <Link href={href}>{formatLink(segment)}</Link>
              </li>
            </React.Fragment>
          );
        })}
      </ul>
    </nav>
  );
};

export default Breadcrumb;
