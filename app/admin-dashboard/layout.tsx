import AdminNavbar from "@/components/navbar-admin";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <AdminNavbar />
      {children}
    </div>
  );
} 