"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Save, User as UserIcon, Lock, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { api, ApiError } from "@/lib/api";
import type { User } from "@/lib/api";
import { authApi } from "@/lib/api";

/**
 * Settings Page
 *
 * User settings for profile and password management
 */
export default function SettingsPage() {
  const queryClient = useQueryClient();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
  });
  const [profileErrors, setProfileErrors] = useState<Partial<Record<keyof typeof profileForm, string>>>({});

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState<Partial<Record<keyof typeof passwordForm, string>>>({});

  // Loading states
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Fetch current user on mount
  useEffect(() => {
    fetchCurrentUser();
  }, []);

  /**
   * Fetch current user from localStorage
   */
  async function fetchCurrentUser() {
    try {
      setIsLoading(true);
      // Get user data from localStorage (stored during login)
      const token = localStorage.getItem("auth_token");
      if (!token) {
        throw new Error("Not authenticated");
      }

      // Decode JWT to get user ID (simple approach)
      const payload = JSON.parse(atob(token.split(".")[1]));
      const userId = payload.sub || payload.userId;

      // Fetch user details from API
      const user = await api.get<User>(`/users/${userId}`);
      setCurrentUser(user);
      setProfileForm({
        name: user.name,
        email: user.email,
      });
    } catch (error) {
      console.error("Failed to fetch user:", error);
      toast({
        title: "Error",
        description: "Failed to load user data. Please log in again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * Validate profile form
   */
  function validateProfile(): boolean {
    const errors: Partial<Record<keyof typeof profileForm, string>> = {};

    if (!profileForm.name.trim()) errors.name = "Name is required";
    if (!profileForm.email.trim()) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(profileForm.email)) errors.email = "Invalid email address";

    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  }

  /**
   * Validate password form
   */
  function validatePassword(): boolean {
    const errors: Partial<Record<keyof typeof passwordForm, string>> = {};

    if (!passwordForm.currentPassword) errors.currentPassword = "Current password is required";
    if (!passwordForm.newPassword) errors.newPassword = "New password is required";
    else if (passwordForm.newPassword.length < 6) errors.newPassword = "Password must be at least 6 characters";
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  }

  /**
   * Handle profile update
   */
  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!validateProfile() || !currentUser) return;

    try {
      setIsUpdatingProfile(true);
      await api.patch(`/users/${currentUser.id}`, {
        name: profileForm.name,
        email: profileForm.email,
      });

      // Update localStorage user data
      const token = localStorage.getItem("auth_token");
      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const updatedUser = { ...currentUser, name: profileForm.name, email: profileForm.email };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }

      setCurrentUser((prev) => prev ? { ...prev, name: profileForm.name, email: profileForm.email } : null);

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "Failed to update profile";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  }

  /**
   * Handle password change
   */
  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (!validatePassword()) return;

    try {
      setIsChangingPassword(true);
      await api.patch("/auth/change-password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      // Reset password form
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      toast({
        title: "Password changed",
        description: "Your password has been changed successfully.",
      });
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "Failed to change password";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsChangingPassword(false);
    }
  }

  /**
   * Get initials for avatar
   */
  function getInitials(): string {
    if (!profileForm.name) return "?";
    return profileForm.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

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
        <Card className="lg:col-span-1 p-4 h-fit">
          <nav className="space-y-1">
            <button className="flex w-full items-center gap-3 rounded-md bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700">
              <UserIcon className="h-4 w-4" />
              Profile
            </button>
            <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              <Lock className="h-4 w-4" />
              Security
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

            <form onSubmit={handleUpdateProfile}>
              <div className="space-y-4">
                {/* Avatar Section */}
                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-500 text-white text-xl font-semibold">
                    {getInitials()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{profileForm.name}</p>
                    <p className="text-xs text-muted-foreground">{profileForm.email}</p>
                  </div>
                </div>

                <Separator />

                {/* Form Fields */}
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={profileForm.name}
                      onChange={(e) => {
                        setProfileForm({ ...profileForm, name: e.target.value });
                        if (profileErrors.name) setProfileErrors({ ...profileErrors, name: undefined });
                      }}
                      className={profileErrors.name ? "border-red-500" : ""}
                      placeholder="John Doe"
                    />
                    {profileErrors.name && <p className="text-xs text-red-500">{profileErrors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => {
                        setProfileForm({ ...profileForm, email: e.target.value });
                        if (profileErrors.email) setProfileErrors({ ...profileErrors, email: undefined });
                      }}
                      className={profileErrors.email ? "border-red-500" : ""}
                      placeholder="john@example.com"
                    />
                    {profileErrors.email && <p className="text-xs text-red-500">{profileErrors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input
                      id="role"
                      value={currentUser?.role || ""}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                </div>

                <Separator />

                {/* Actions */}
                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (currentUser) {
                        setProfileForm({ name: currentUser.name, email: currentUser.email });
                      }
                    }}
                    disabled={isUpdatingProfile}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600"
                    disabled={isUpdatingProfile}
                  >
                    {isUpdatingProfile ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </Card>

          {/* Security Settings */}
          <Card className="p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
              <p className="text-sm text-muted-foreground">
                Update your password to keep your account secure
              </p>
            </div>

            <form onSubmit={handleChangePassword}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => {
                      setPasswordForm({ ...passwordForm, currentPassword: e.target.value });
                      if (passwordErrors.currentPassword) setPasswordErrors({ ...passwordErrors, currentPassword: undefined });
                    }}
                    className={passwordErrors.currentPassword ? "border-red-500" : ""}
                    placeholder="Enter current password"
                  />
                  {passwordErrors.currentPassword && <p className="text-xs text-red-500">{passwordErrors.currentPassword}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => {
                      setPasswordForm({ ...passwordForm, newPassword: e.target.value });
                      if (passwordErrors.newPassword) setPasswordErrors({ ...passwordErrors, newPassword: undefined });
                    }}
                    className={passwordErrors.newPassword ? "border-red-500" : ""}
                    placeholder="Enter new password"
                  />
                  {passwordErrors.newPassword && <p className="text-xs text-red-500">{passwordErrors.newPassword}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => {
                      setPasswordForm({ ...passwordForm, confirmPassword: e.target.value });
                      if (passwordErrors.confirmPassword) setPasswordErrors({ ...passwordErrors, confirmPassword: undefined });
                    }}
                    className={passwordErrors.confirmPassword ? "border-red-500" : ""}
                    placeholder="Confirm new password"
                  />
                  {passwordErrors.confirmPassword && <p className="text-xs text-red-500">{passwordErrors.confirmPassword}</p>}
                </div>

                <Separator />

                {/* Actions */}
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600"
                    disabled={isChangingPassword}
                  >
                    {isChangingPassword ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Changing...
                      </>
                    ) : (
                      <>
                        <Lock className="mr-2 h-4 w-4" />
                        Change Password
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
