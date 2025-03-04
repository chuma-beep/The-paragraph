// // import Link from 'next/link';
// "use client";
// import { useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import Image from 'next/image';


// export default function NotFound() {
//   const router = useRouter();
//   useEffect(() => {
//     setTimeout(() => {
//       router.back();
//     }, 10000);
//   }, []);
//   return (
//     <div>
//       <Image  src="/not-found.jpg" alt="Page Not Found" width={400} height={400} />
//       <h1>404 - Page Not Found</h1>
//       <p>Redirecting to Previous Page in 3seconds.....</p>
//     </div>
//   );
// }


"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.back();
    }, 3000); // redirect after 3 seconds
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full text-center">
        <Image 
          src="/not-found.jpg" 
          alt="Page Not Found" 
          width={400} 
          height={400} 
          className="w-full h-auto object-cover rounded-lg mb-6" 
        />
        <h1 className="text-3xl font-bold text-gray-800 mb-4">404 - Page Not Found</h1>
        <p className="text-gray-600 mb-4">Redirecting to Home page in 3 seconds...</p>
        <button 
          onClick={() => router.push('/')} 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
          Go Home Now
        </button>
      </div>
    </div>
  );
}

