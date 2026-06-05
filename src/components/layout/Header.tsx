import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useColorMode } from "../../hooks/useColorMode";

const Header = ({ sidebarOpen, setSidebarOpen }: { sidebarOpen: boolean; setSidebarOpen: (v: boolean) => void }) => {
  const { user } = useAuth();
  const [colorMode, setColorMode] = useColorMode();

  return (
    <header className="sticky top-0 z-40 flex w-full bg-white shadow-2 dark:bg-boxdark">
      <div className="flex flex-grow items-center justify-between px-4 py-4 md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 lg:hidden">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="z-50 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden">
            <span className="relative flex h-5.5 w-5.5 cursor-pointer items-center justify-center">
              <span className={`absolute block h-0.5 w-full rounded-sm bg-black duration-200 ease-in-out dark:bg-white ${sidebarOpen ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"}`}></span>
              <span className={`absolute block h-0.5 rounded-sm bg-black duration-200 ease-in-out dark:bg-white ${sidebarOpen ? "top-1/2 -translate-y-1/2 w-0 opacity-0" : "top-1/2 -translate-y-1/2 w-full"}`}></span>
              <span className={`absolute block h-0.5 w-full rounded-sm bg-black duration-200 ease-in-out dark:bg-white ${sidebarOpen ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0"}`}></span>
            </span>
          </button>
        </div>

        <div className="hidden sm:block" />

        <div className="flex items-center gap-3 2xsm:gap-7">
          <ul className="flex items-center gap-2">
            <li>
              <button onClick={() => setColorMode(colorMode === "dark" ? "light" : "dark")} className="relative m-0 block h-7.5 w-14 rounded-full bg-stroke dark:bg-meta-4">
                <span className={`absolute top-1 left-[3px] flex h-6 w-6 -translate-y-1/2 translate-x-0 items-center justify-center rounded-full bg-white shadow-switcher duration-75 ease-linear ${colorMode === "dark" && "!right-[3px] !translate-x-full"}`}>
                  <span className="dark:hidden">☀️</span>
                  <span className="hidden dark:inline-block">🌙</span>
                </span>
              </button>
            </li>
          </ul>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-black dark:text-white">
              {user?.name || user?.role}
            </span>
            <Link to="/admin/profile" className="flex items-center gap-2 rounded-full px-3 py-1.5 bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition">
              View Profile
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;