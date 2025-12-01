// Imports

"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import styles from "./page.module.css";

// Exports

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <div className={`${styles["column-container"]} ${styles["width-100"]} ${styles["pd-all-round"]}`}>
      <h1>Hello World</h1>
    </div>
  );
}
