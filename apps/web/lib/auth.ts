export async function signUp(username: string, password: string) {
    try {

        const response = await fetch('http://localhost:3001/signup', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
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

export async function signOut() {
  localStorage.setItem('auth-token','');
  return { success: true }
}

