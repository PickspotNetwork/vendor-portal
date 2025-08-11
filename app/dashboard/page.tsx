"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { Notification } from "@/components/ui/notification"
import { LogOut, Loader2 } from "lucide-react"

export default function Dashboard() {
  const { isLoading, error, success, logout, clearMessages } = useAuth()
  
  const handleLogout = async () => {
    await logout()
  }
  return (
    <div className="min-h-screen bg-muted p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Image
              src="/images/logo.png"
              alt="Pickspot wordmark image"
              width={2972}
              height={748}
              priority
              className="h-8 w-auto"
            />
            <h1 className="text-2xl font-bold">Vendor Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Welcome to your dashboard!
            </div>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              disabled={isLoading}
              className="flex items-center gap-2"
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
            </Button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold text-lg mb-2">Orders</h3>
            <p className="text-3xl font-bold text-blue-600">0</p>
            <p className="text-sm text-muted-foreground">Total orders</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold text-lg mb-2">Revenue</h3>
            <p className="text-3xl font-bold text-green-600">KSh 0</p>
            <p className="text-sm text-muted-foreground">Total earnings</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold text-lg mb-2">Deliveries</h3>
            <p className="text-3xl font-bold text-purple-600">0</p>
            <p className="text-sm text-muted-foreground">Completed deliveries</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-lg p-6 shadow-sm">
          <h3 className="font-semibold text-lg mb-4">Recent Activity</h3>
          <div className="text-center py-8 text-muted-foreground">
            <p>No recent activity to display</p>
            <p className="text-sm mt-2">Your orders and deliveries will appear here</p>
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
