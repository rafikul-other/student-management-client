const Loader = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-white dark:bg-boxdark">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-12 w-12">
          <span className="absolute inline-block h-full w-full animate-spin rounded-full border-4 border-primary border-t-transparent"></span>
        </div>
        <p className="text-sm font-medium text-gray-500">Loading GD College...</p>
      </div>
    </div>
  );
};

export default Loader;