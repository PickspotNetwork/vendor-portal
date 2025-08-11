"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { Notification } from "@/components/ui/notification"
import { LogOut, Loader2, User, Bell, Settings, TrendingUp, Package, Truck, DollarSign, ChevronDown } from "lucide-react"
import { useState, useRef, useEffect } from "react"

export default function Dashboard() {
  const { isLoading, error, success, logout, clearMessages } = useAuth()
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  const handleLogout = async () => {
    await logout()
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsAccountDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#D62E1F] rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Vendor Dashboard</h1>
                <p className="text-sm text-gray-600">Manage your business operations</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-[#D62E1F] text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </Button>

            {/* Account Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <Button
                variant="ghost"
                onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                className="flex items-center gap-2 hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-[#D62E1F] to-[#B8251A] rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="hidden sm:block text-sm font-medium">Account</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isAccountDropdownOpen ? 'rotate-180' : ''}`} />
              </Button>

              {/* Dropdown Menu */}
              {isAccountDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">Vendor Account</p>
                    <p className="text-xs text-gray-500">vendor@pickspot.world</p>
                  </div>
                  
                  <div className="py-1">
                    <button className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <Settings className="h-4 w-4" />
                      Account Settings
                    </button>
                    <button className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <Bell className="h-4 w-4" />
                      Notifications
                    </button>
                  </div>
                  
                  <div className="border-t border-gray-100 py-1">
                    <button
                      onClick={handleLogout}
                      disabled={isLoading}
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Logging out...
                        </>
                      ) : (
                        <>
                          <LogOut className="h-4 w-4" />
                          Logout
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Package className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Orders</h3>
              </div>
              <div className="flex items-center gap-1 text-green-600 text-sm">
                <TrendingUp className="h-4 w-4" />
                <span>+12%</span>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">24</p>
            <p className="text-sm text-gray-500">This month</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Revenue</h3>
              </div>
              <div className="flex items-center gap-1 text-green-600 text-sm">
                <TrendingUp className="h-4 w-4" />
                <span>+8%</span>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">KSh 45,280</p>
            <p className="text-sm text-gray-500">This month</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#D62E1F]/10 rounded-lg flex items-center justify-center">
                  <Truck className="h-5 w-5 text-[#D62E1F]" />
                </div>
                <h3 className="font-semibold text-gray-900">Deliveries</h3>
              </div>
              <div className="flex items-center gap-1 text-green-600 text-sm">
                <TrendingUp className="h-4 w-4" />
                <span>+15%</span>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">18</p>
            <p className="text-sm text-gray-500">Completed this month</p>
          </div>
        </div>

        {/* Recent Activity & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-lg text-gray-900">Recent Activity</h3>
              <Button variant="ghost" size="sm" className="text-[#D62E1F] hover:bg-[#D62E1F]/10">
                View All
              </Button>
            </div>
            
            <div className="space-y-4">
              {/* Sample activity items */}
              <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Package className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">New order received</p>
                  <p className="text-xs text-gray-500">Order #1234 - KSh 2,500</p>
                </div>
                <span className="text-xs text-gray-400">2 hours ago</span>
              </div>
              
              <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Truck className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Delivery completed</p>
                  <p className="text-xs text-gray-500">Order #1230 delivered successfully</p>
                </div>
                <span className="text-xs text-gray-400">5 hours ago</span>
              </div>
              
              <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 bg-[#D62E1F]/10 rounded-full flex items-center justify-center">
                  <DollarSign className="h-4 w-4 text-[#D62E1F]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Payment received</p>
                  <p className="text-xs text-gray-500">KSh 1,800 from Order #1228</p>
                </div>
                <span className="text-xs text-gray-400">1 day ago</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="font-semibold text-lg text-gray-900 mb-6">Quick Actions</h3>
            
            <div className="space-y-3">
              <Button className="w-full justify-start bg-[#D62E1F] hover:bg-[#B8251A] text-white">
                <Package className="h-4 w-4 mr-2" />
                Add New Product
              </Button>
              
              <Button variant="outline" className="w-full justify-start border-gray-200 hover:bg-gray-50">
                <TrendingUp className="h-4 w-4 mr-2" />
                View Analytics
              </Button>
              
              <Button variant="outline" className="w-full justify-start border-gray-200 hover:bg-gray-50">
                <Settings className="h-4 w-4 mr-2" />
                Manage Inventory
              </Button>
              
              <Button variant="outline" className="w-full justify-start border-gray-200 hover:bg-gray-50">
                <Truck className="h-4 w-4 mr-2" />
                Track Deliveries
              </Button>
            </div>
            
            {/* Quick Stats */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <h4 className="font-medium text-gray-900 mb-3">Today&apos;s Summary</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">New Orders</span>
                  <span className="font-medium">3</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Pending Deliveries</span>
                  <span className="font-medium">2</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Revenue</span>
                  <span className="font-medium text-green-600">KSh 4,200</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Notifications */}
        {error && (
          <Notification
            type="error"
            message={error}
            onClose={clearMessages}
          />
        )}
        {success && (
          <Notification
            type="success"
            message={success}
            onClose={clearMessages}
          />
        )}
      </div>
    </div>
  )
}
