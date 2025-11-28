// Imports

"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../page.module.css";

// Exports

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
      setIsLoading(true);
  
      try {
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });
  
        if (result?.error) {
          setError("Invalid email or password");
          setIsLoading(false);
        } else if (result?.ok) {
          router.push("/");
          router.refresh();
        }
      } catch (error) {
        console.error("Login error:", error);
        setError("An error occurred during login");
        setIsLoading(false);
      }
    };
  
    return (
      <div className={`${styles["column-container"]} ${styles["width-100"]} ${styles["pd-all-round"]}`}>
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                />
            </div>
            <div>
                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                />
            </div>
            {error && (
                <div>
                    {error}
                </div>
            )}
            <button 
                type="submit" 
                disabled={isLoading}
            >
                {isLoading ? "Signing in..." : "Sign In"}
            </button>
        </form>
      </div>
    );
}