'use client';

import { Button, Result } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-lg w-full transform hover:scale-[1.01] transition-transform duration-300">
        <Result
          status="404"
          title={<h1 className="text-4xl font-bold text-gray-800 mb-2">404</h1>}
          subTitle={
            <div className="text-gray-500 text-base mb-6">
              Oops! The page you are looking for does not exist or has been moved.
            </div>
          }
          extra={
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <Button type="primary" size="large" className="bg-black hover:bg-gray-800 min-w-[140px] h-11 rounded-lg">
                  Back Home
                </Button>
              </Link>
              <Button
                size="large"
                onClick={() => router.back()}
                className="min-w-[140px] h-11 rounded-lg border-gray-300 hover:border-gray-400 hover:text-gray-700"
              >
                Go Back
              </Button>
            </div>
          }
        />
      </div>

      <div className="mt-8 text-center text-gray-400 text-sm">
        <p>Need help? <Link href="/contact" className="text-blue-500 hover:underline">Contact Support</Link></p>
      </div>
    </div>
  );
}