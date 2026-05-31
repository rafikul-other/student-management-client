import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-boxdark px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary">404</h1>
        <h2 className="mt-4 text-2xl font-semibold text-black dark:text-white">Page Not Found</h2>
        <p className="mt-2 text-gray-500">The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/admin/dashboard" className="mt-6 inline-block rounded-lg bg-primary px-6 py-3 text-white font-medium hover:bg-primary/90">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;