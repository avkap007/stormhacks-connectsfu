import UserProfile from "@/components/UserProfile";
import Navbar from "@/components/Navbar";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="h-16" />
      <UserProfile />
    </div>
  );
}
