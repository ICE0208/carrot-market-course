import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div className="bg-red-300">
      <h1 className="p-3 pt-2 text-blue-600">It works</h1>
    </div>
  );
}
