import { Button } from "@/components/ui/button";
import { Plus, Search, MoreHorizontal } from "lucide-react";
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

/**
 * Users List Page
 *
 * Displays all users (admin/manager only)
 */
export default function UsersPage() {
  // Mock data - replace with actual API calls
  const users = [
    {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      role: "admin",
      location: "WH-001",
      status: "active",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      role: "manager",
      location: "Store-A",
      status: "active",
    },
    {
      id: "3",
      name: "Bob Johnson",
      email: "bob.johnson@example.com",
      role: "operator",
      location: "WH-002",
      status: "active",
    },
    {
      id: "4",
      name: "Alice Williams",
      email: "alice.williams@example.com",
      role: "viewer",
      location: "Store-B",
      status: "inactive",
    },
    {
      id: "5",
      name: "Charlie Brown",
      email: "charlie.brown@example.com",
      role: "operator",
      location: "WH-001",
      status: "suspended",
    },
  ];

  const roleLabels: Record<string, string> = {
    admin: "Admin",
    manager: "Manager",
    operator: "Operator",
    viewer: "Viewer",
  };

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
        <Link href="/users/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </Link>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search users..."
            className="pl-9"
          />
        </div>
        <Select defaultValue="all">
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
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            <SelectItem value="wh-001">Warehouse 1</SelectItem>
            <SelectItem value="wh-002">Warehouse 2</SelectItem>
            <SelectItem value="store-a">Store A</SelectItem>
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
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{roleLabels[user.role]}</TableCell>
                <TableCell>{user.location}</TableCell>
                <TableCell>
                  <StatusBadge status={user.status} type="user" />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/users/${user.id}`}>View</Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/users/${user.id}/edit`}>Edit</Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
