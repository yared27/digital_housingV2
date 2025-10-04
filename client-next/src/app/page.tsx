"use client";

// Update the import path to the correct location of your store file
// Update the import path to the correct location of your store file
import { useGetPropertiesQuery } from "../../store"; // Adjust this path to match the actual location of your store file

export default function Home() {
  const { data, error, isLoading } = useGetPropertiesQuery();

  if (isLoading) return <p className="text-blue-500">Loading...</p>;
  if (error) return <p className="text-red-500">Something went wrong</p>;

  return (
    <main className="p-10">
      <h1 className="text-2xl font-bold mb-4">Properties</h1>
      <ul className="space-y-2">
        {data?.map((p, i) => (
          <li
            key={i}
            className="p-4 bg-gray-100 rounded-lg shadow-md"
          >
            {JSON.stringify(p)}
          </li>
        ))}
      </ul>
    </main>
  );
}
