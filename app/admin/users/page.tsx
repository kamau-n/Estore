"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Users, Shield, User, Mail } from "lucide-react"
import { collection, getDocs, updateDoc, doc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { LoadingSpinner } from "@/components/loading-spinner"
import { useToast } from "@/hooks/use-toast"
import { Switch } from "@/components/ui/switch"

interface UserData {
  id: string
  uid: string
  email: string
  displayName: string
  photoURL?: string
  isAdmin: boolean
  createdAt: string
}

export default function UsersManagementPage() {
  const { user, isAdmin, loading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [updatingAdmin, setUpdatingAdmin] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push("/")
      return
    }
  }, [user, isAdmin, authLoading, router])

  useEffect(() => {
    const fetchUsers = async () => {
      if (!user || !isAdmin) return

      try {
        const usersSnapshot = await getDocs(collection(db, "users"))
        const usersData = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as UserData[]

        setUsers(usersData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
      } catch (error) {
        console.error("Error fetching users:", error)
        toast({
          title: "Error",
          description: "Failed to load users",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [user, isAdmin, toast])

  const handleAdminToggle = async (userId: string, isAdmin: boolean) => {
    if (userId === user?.uid) {
      toast({
        title: "Error",
        description: "You cannot change your own admin status",
        variant: "destructive",
      })
      return
    }

    setUpdatingAdmin(userId)
    try {
      await updateDoc(doc(db, "users", userId), {
        isAdmin: isAdmin,
      })

      setUsers(users.map((u) => (u.id === userId ? { ...u, isAdmin } : u)))

      toast({
        title: "Success",
        description: `User ${isAdmin ? "granted" : "removed"} admin access`,
      })
    } catch (error) {
      console.error("Error updating user admin status:", error)
      toast({
        title: "Error",
        description: "Failed to update user admin status",
        variant: "destructive",
      })
    } finally {
      setUpdatingAdmin(null)
    }
  }

  const filteredUsers = users.filter(
    (userData) =>
      userData.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userData.displayName?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  if (!user || !isAdmin) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground">Manage customer accounts and permissions</p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Users List */}
      {filteredUsers.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">{searchTerm ? "No users found" : "No users yet"}</h3>
            <p className="text-muted-foreground text-center">
              {searchTerm ? "Try adjusting your search terms" : "Users will appear here when they register"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredUsers.map((userData) => (
            <Card key={userData.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      {userData.photoURL ? (
                        <img
                          src={userData.photoURL || "/placeholder.svg"}
                          alt={userData.displayName || "User"}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-6 w-6 text-primary" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{userData.displayName || "No Name"}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {userData.email}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {userData.isAdmin && (
                      <Badge variant="default" className="flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        Admin
                      </Badge>
                    )}
                    <Badge variant="outline">Joined {new Date(userData.createdAt).toLocaleDateString()}</Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    <p>User ID: {userData.uid}</p>
                    <p>Account created: {new Date(userData.createdAt).toLocaleString()}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Admin Access</span>
                      <Switch
                        checked={userData.isAdmin}
                        onCheckedChange={(checked) => handleAdminToggle(userData.id, checked)}
                        disabled={updatingAdmin === userData.id || userData.uid === user?.uid}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{users.length}</div>
            <div className="text-sm text-muted-foreground">Total Users</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{users.filter((u) => u.isAdmin).length}</div>
            <div className="text-sm text-muted-foreground">Admin Users</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{users.filter((u) => !u.isAdmin).length}</div>
            <div className="text-sm text-muted-foreground">Regular Users</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
