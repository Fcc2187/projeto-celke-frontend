import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>Welcome to My App</h1>
      <button><Link href="/users/list">Go to User List</Link></button>
    </div>
  );
}
