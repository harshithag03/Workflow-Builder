import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Navbar = () => {
  const router = useRouter();

  return (
    <nav className="bg-blue-700 text-white shadow-md relative z-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-xl font-bold flex items-center">
            
            Workflow Builder Application
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;