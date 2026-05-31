import toast, { Toaster } from "react-hot-toast";

export const showToast = {
  success: (message: string) => toast.success(message, { duration: 3000, position: "top-right" }),
  error: (message: string) => toast.error(message, { duration: 4000, position: "top-right" }),
  loading: (message: string) => toast.loading(message, { duration: 2000 }),
  custom: (message: string, icon: string) => toast(message, { icon, duration: 3000 }),
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>
    <Toaster reverseOrder={false} />
    {children}
  </>
);