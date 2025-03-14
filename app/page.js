"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Link href={"/daytona500"}>
        <h1>Daytona 500</h1>
      </Link>
      <Link href={"/atlanta"}>
        <h1 className="mt-8">Atlanta</h1>
      </Link>
    </div>
  );
}
