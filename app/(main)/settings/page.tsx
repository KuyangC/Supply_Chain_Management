import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Save, Bell, Lock, User, Palette } from "lucide-react";

/**
 * Settings Page
 *
 * User settings for profile, notifications, and preferences
 */
export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Settings Navigation */}
        <Card className="lg:col-span-1 p-4">
          <nav className="space-y-1">
            <button className="flex w-full items-center gap-3 rounded-md bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700">
              <User className="h-4 w-4" />
              Profile
            </button>
            <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              <Bell className="h-4 w-4" />
              Notifications
            </button>
            <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              <Lock className="h-4 w-4" />
              Security
            </button>
            <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              <Palette className="h-4 w-4" />
              Appearance
            </button>
          </nav>
        </Card>

        {/* Settings Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Settings */}
          <Card className="p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Profile Settings</h2>
              <p className="text-sm text-muted-foreground">
                Update your personal information
              </p>
            </div>

            <div className="space-y-4">
              {/* Avatar Section */}
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-500 text-white text-xl font-semibold">
                  A
                </div>
                <div>
                  <Button variant="outline" size="sm">
                    Change Avatar
                  </Button>
                  <p className="mt-1 text-xs text-muted-foreground">
                    JPG, PNG or GIF. Max 1MB.
                  </p>
                </div>
              </div>

              <Separator />

              {/* Form Fields */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" defaultValue="Admin User" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="admin@supplychain.com" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" type="tel" placeholder="+62 812 3456 7890" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" value="Administrator" disabled />
                </div>
              </div>

              <Separator />

              {/* Actions */}
              <div className="flex justify-end gap-3">
                <Button variant="outline">Cancel</Button>
                <Button className="bg-blue-500 hover:bg-blue-600">
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </div>
          </Card>

          {/* Notification Settings */}
          <Card className="p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Notification Preferences</h2>
              <p className="text-sm text-muted-foreground">
                Choose how you want to be notified
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Receive email updates about your account
                  </p>
                </div>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  <span className="translate-x-6 inline-block h-5 w-5 transform rounded-full bg-white transition-transform" />
                </button>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Low Stock Alerts</p>
                  <p className="text-sm text-muted-foreground">
                    Get notified when products are low in stock
                  </p>
                </div>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  <span className="translate-x-6 inline-block h-5 w-5 transform rounded-full bg-white transition-transform" />
                </button>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Shipment Updates</p>
                  <p className="text-sm text-muted-foreground">
                    Receive updates for shipment status changes
                  </p>
                </div>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  <span className="translate-x-1 inline-block h-5 w-5 transform rounded-full bg-white transition-transform" />
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
