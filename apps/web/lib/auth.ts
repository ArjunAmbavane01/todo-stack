'use server'
import { cookies } from "next/headers"

export async function signUp(name: string, email: string, password: string) {
    try {

        const response = await fetch('http://localhost:3001/signup', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return { success: true }
    } catch (error) {
        console.error("Sign up error:", error)
        return { success: false, error: "An error occurred during sign up" }
    }
}

// export async function signOut() {
//   cookies().delete("auth-token")
//   return { success: true }
// }

