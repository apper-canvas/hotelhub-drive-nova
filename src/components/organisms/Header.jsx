import React from "react";
import { useSelector } from "react-redux";
import { useAuth } from "@/layouts/Root";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Avatar from "@/components/atoms/Avatar";
import Badge from "@/components/atoms/Badge";

const Header = ({ onToggleSidebar }) => {
const { logout } = useAuth();
  const { user, isAuthenticated } = useSelector((state) => state.user)

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <ApperIcon name="Menu" size={20} className="text-slate-600" />
          </button>
          
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Good morning, {isAuthenticated ? user?.firstName || user?.first_name_c || "Admin" : "Admin"}
            </h2>
            <p className="text-sm text-slate-600">Here's what's happening at your hotel today</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors relative">
              <ApperIcon name="Bell" size={20} className="text-slate-600" />
              <Badge variant="danger" size="sm" className="absolute -top-1 -right-1 w-5 h-5 text-xs p-0 flex items-center justify-center">
                3
              </Badge>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <Avatar 
              fallback={
                isAuthenticated && user ? 
                `${(user.firstName || user.first_name_c || "A").charAt(0)}${(user.lastName || user.last_name_c || "U").charAt(0)}` : 
                "A"
              } 
              size="md" 
            />
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-slate-900">
                {isAuthenticated ? 
                  `${user?.firstName || user?.first_name_c || "Admin"} ${user?.lastName || user?.last_name_c || "User"}` : 
                  "Admin User"
                }
              </p>
              <p className="text-xs text-slate-600">
                {isAuthenticated ? user?.role_c || "Hotel Manager" : "Hotel Manager"}
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <ApperIcon name="LogOut" size={16} />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header