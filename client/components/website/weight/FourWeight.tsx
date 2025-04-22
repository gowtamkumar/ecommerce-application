import dynamic from "next/dynamic";

export default function FourWeight() {
  return (
    <div>
      <h4 className="text-lg font-semibold mb-4">Contact</h4>
      <p className="text-sm">Email: support@example.com</p>
      <p className="text-sm mt-1">Phone: +880 123 456 789</p>
      <div className="mt-4 flex space-x-4">
        <a href="#">
          <img src="/facebook-icon.svg" alt="Facebook" className="h-5" />
        </a>
        <a href="#">
          <img src="/twitter-icon.svg" alt="Twitter" className="h-5" />
        </a>
        <a href="#">
          <img src="/instagram-icon.svg" alt="Instagram" className="h-5" />
        </a>
      </div>
    </div>
  );
}
