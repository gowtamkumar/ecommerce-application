/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

export default function MoreDiscover() {
  return (
    <section className="w-8/12 mx-auto py-5 text-center">
      <div className="py-5">
        <h2 className="text-xl font-semibold pb-4">More to Discover</h2>
        <p>
          Our bundles were designed to conveniently package your tanning
          essentials while saving you money.
        </p>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <img src="/image-box-12.jpg" className="h-auto w-full" alt="image" />
          <h2>From Our Blog</h2>
          <div className="underline text-center ">
            <Link href="/">
              <div className="flex justify-center items-center">
                <span className="px-2">Discover Now</span>
              </div>
            </Link>
          </div>
        </div>
        <div>
          <img src="/image-box-12.jpg" className="h-auto w-full" alt="image" />
          <h2>From Our Blog</h2>
          <div className="underline text-center">
            <Link href="/">
              <div className="flex justify-center items-center">
                <span className="px-2">Discover Now</span>
              </div>
            </Link>
          </div>
        </div>
        <div>
          <img src="/image-box-12.jpg" className="h-auto w-full" alt="image" />
          <h2>From Our Blog</h2>
          <div className="underline text-center">
            <Link href="/blog">
              <div className="flex justify-center items-center">
                <span className="px-2">Discover Now</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
