"use client"
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";

export default function Home() {
    const session = useSession();
    return(
        <div>
            <main className="flex min-h-screen flex-col items-center justify-between p-24 flex-wrap">
                <pre>
                    <h1>client</h1>
                    {JSON.stringify(session)}
                </pre>
                <button
          onClick={() => {
            signOut();
          }}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Sign out
        </button>
            </main>
        </div>
    )
}