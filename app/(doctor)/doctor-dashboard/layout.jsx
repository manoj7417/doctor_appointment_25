import DoctorSidebar from "@/components/shared/DoctorSidebar";

export const metadata = {
  title: "Doctor Dashboard",
  description: "Doctor management dashboard",
};

export default function RootLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-100">
      <DoctorSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4">
          {children}
        </main>
      </div>
    </div>
  );
}
