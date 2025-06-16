"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import {
  type User,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  FacebookAuthProvider,
  TwitterAuthProvider,
} from "firebase/auth"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { useToast } from "@/hooks/use-toast"

interface AuthContextType {
  user: User | null
  loading: boolean
  isAdmin: boolean
  signInWithGoogle: () => Promise<void>
  signInWithFacebook: () => Promise<void>
  signInWithTwitter: () => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<void>
  signUpWithEmail: (email: string, password: string, displayName: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)

      if (user) {
        // Check if user is admin
        const userDoc = await getDoc(doc(db, "users", user.uid))
        if (userDoc.exists()) {
          setIsAdmin(userDoc.data().isAdmin || false)
        }
      } else {
        setIsAdmin(false)
      }

      setLoading(false)
    })

    return unsubscribe
  }, [])

  const createUserDocument = async (user: User) => {
    const userRef = doc(db, "users", user.uid)
    const userDoc = await getDoc(userRef)

    if (!userDoc.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        isAdmin: false,
        createdAt: new Date().toISOString(),
      })
    }
  }

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      await createUserDocument(result.user)
      toast({
        title: "Success",
        description: "Signed in with Google successfully!",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const signInWithFacebook = async () => {
    try {
      const provider = new FacebookAuthProvider()
      const result = await signInWithPopup(auth, provider)
      await createUserDocument(result.user)
      toast({
        title: "Success",
        description: "Signed in with Facebook successfully!",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const signInWithTwitter = async () => {
    try {
      const provider = new TwitterAuthProvider()
      const result = await signInWithPopup(auth, provider)
      await createUserDocument(result.user)
      toast({
        title: "Success",
        description: "Signed in with Twitter successfully!",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const signInWithEmail = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      toast({
        title: "Success",
        description: "Signed in successfully!",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const signUpWithEmail = async (email: string, password: string, displayName: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      // Update display name
      await result.user.updateProfile({ displayName })
      await createUserDocument(result.user)
      toast({
        title: "Success",
        description: "Account created successfully!",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
      toast({
        title: "Success",
        description: "Signed out successfully!",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const value = {
    user,
    loading,
    isAdmin,
    signInWithGoogle,
    signInWithFacebook,
    signInWithTwitter,
    signInWithEmail,
    signUpWithEmail,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
