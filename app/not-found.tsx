import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-400 mb-6">Page not found — even the computer couldn&apos;t find this one!</p>
        <Link href="/" className="px-6 py-3 bg-purple-600 rounded-xl text-white font-semibold hover:bg-purple-700 transition">
          Go Home
        </Link>
      </div>
    </div>
  );
}
