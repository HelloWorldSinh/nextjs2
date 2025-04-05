"use client";

import { useState } from "react";

export default function SearchUserPage() {
    const [query, setQuery] = useState("");
    const [users, setUsers] = useState<any[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSearched(false);

        try {
            const res = await fetch("/api/searchUser", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message);

            setUsers(data.users);
            setSearched(true);
        } catch (err: any) {
            setError(err.message);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-center">Tìm kiếm người dùng</h2>

                <form onSubmit={handleSearch} className="mb-4">
                    <input
                        type="text"
                        placeholder="Nhập email cần tìm..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-2 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                    >
                        {loading ? "Đang tìm..." : "Tìm kiếm"}
                    </button>
                </form>

                {error && <p className="text-red-500 text-center">{error}</p>}

                {searched && users.length === 0 && (
                    <p className="text-center text-gray-600">Không tìm thấy người dùng nào.</p>
                )}

                {users.length > 0 && (
                    <ul className="space-y-2 mt-4">
                        {users.map((user) => (
                            <li key={user.id} className="p-2 bg-gray-100 rounded shadow-sm">
                                <p className="text-sm text-gray-700"><strong>Email:</strong> {user.email}</p>
                                <p className="text-xs text-gray-500">
                                    <strong>Tạo lúc:</strong> {new Date(user.created_at).toLocaleString()}
                                </p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
