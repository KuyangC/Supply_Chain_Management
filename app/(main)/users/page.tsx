"use client";

import { Button } from "@/components/ui/button";
import { Plus, Search, MoreVertical, RefreshCw, Trash2, Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/status-badge";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUsers, useDeleteUser } from "@/hooks/use-api-data";
import { TableLoading, TableError, TableEmpty } from "@/components/shared/table-states";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { User } from "@/lib/api";

/**
 * Users List Page
 *
 * Displays all users with delete functionality (admin/manager only)
 */
export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { data: users = [], isLoading, error, refetch } = useUsers();

  const deleteMutation = useDeleteUser({
    onSuccess: () => {
      toast({
        title: "User deleted",
        description: "User has been deleted successfully.",
      });
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete user.",
        variant: "destructive",
      });
    },
  });

  const roleLabels: Record<string, string> = {
    ADMIN: "Admin",
    MANAGER: "Manager",
    OPERATOR: "Operator",
    VIEWER: "Viewer",
  };

  // Filter users based on search and role
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      !searchQuery ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole =
      roleFilter === "all" ||
      user.role.toLowerCase() === roleFilter.toLowerCase();

    return matchesSearch && matchesRole;
  });

  /**
   * Open delete confirmation dialog
   */
  function openDeleteDialog(user: User) {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  }

  /**
   * Handle delete user
   */
  function handleDelete() {
    if (!selectedUser) return;
    deleteMutation.mutate(selectedUser.id);
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">
            Manage user accounts and permissions
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Link href="/users/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </Link>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search users..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="manager">Manager</SelectItem>
            <SelectItem value="operator">Operator</SelectItem>
            <SelectItem value="viewer">Viewer</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Users Table */}
      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableLoading colSpan={6} />
            ) : error ? (
              <TableError
                colSpan={6}
                message={error instanceof Error ? error.message : "Failed to load users"}
                onRetry={() => refetch()}
              />
            ) : filteredUsers.length === 0 ? (
              <TableEmpty
                colSpan={6}
                message={users.length === 0 ? "No users found." : "No users match your filters."}
              />
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{roleLabels[user.role] || user.role}</TableCell>
                  <TableCell>
                    <StatusBadge status="active" type="user" />
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                        >
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/users/${user.id}`}
                            className="flex items-center cursor-pointer"
                          >
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/users/${user.id}/edit`}
                            className="flex items-center cursor-pointer"
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-500 focus:text-red-500"
                          onClick={() => openDeleteDialog(user)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete user <span className="font-semibold">"{selectedUser?.name}"</span> ({selectedUser?.email})?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
