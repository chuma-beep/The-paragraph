// import Link from 'next/link';
"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();
  useEffect(() => {
    setTimeout(() => {
      router.back();
    }, 3000);
  }, []);
  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <p>Redirecting to Previous Page in 3seconds.....</p>
    </div>
  );
}