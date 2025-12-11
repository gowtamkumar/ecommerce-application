import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Report',
  description: 'This is a Report.',
};

export default function page() {
  return <div>
    section list:
    2. total Revenue
    3. total Customer
    4. product stock with variant
    5. Total Sale
    1. Revenue
    2. profit
    3. loss

  </div>
}
