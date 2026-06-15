import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-6">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="mt-4 text-xl text-gray-300">Page not found</p>
      <p className="mt-2 text-center text-gray-400 max-w-xl">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex rounded-lg bg-blue-500 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-400"
      >
        Back to Home
      </Link>
    </div>
  );
}

export default NotFound;
