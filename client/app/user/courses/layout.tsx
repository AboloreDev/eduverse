import Navbar from "@/components/code/Navbar";
import ProtectedRoute from "@/components/code/ProtectedRoutes";

export default function UserCoursesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div>{children}</div>
      </div>
    </ProtectedRoute>
  );
}
