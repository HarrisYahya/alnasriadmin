"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

type User = {
  id: string;
  email: string;
  role: "admin" | "pharmacy" | "staff" | string;
};

export default function UserManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // ➕ NEW USER FORM STATE
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("staff");
  const [saving, setSaving] = useState(false);

  // 🔄 LOAD USERS
  const loadUsers = async () => {
    setLoading(true);

    const { data } = await supabase
      .from("staff")
      .select("*")
      .order("email", { ascending: true });

    setUsers(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // ➕ ADD USER
  const addUser = async () => {
    if (!email.trim()) return;

    setSaving(true);

    const { error } = await supabase.from("staff").insert({
      email,
      role,
    });

    setSaving(false);

    if (error) {
      alert(error.message);
      return;
    }

    setEmail("");
    setRole("staff");
    loadUsers();
  };

  // 🔐 UPDATE ROLE
  const updateRole = async (id: string, role: string) => {
    await supabase.from("staff").update({ role }).eq("id", id);

    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, role } : u
      )
    );
  };

  // ❌ DELETE USER
  const deleteUser = async (id: string) => {
    const ok = confirm("Delete this user?");
    if (!ok) return;

    await supabase.from("staff").delete().eq("id", id);

    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <div className="space-y-6 text-white">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="text-cyan-300 text-lg font-semibold">
          👤 User Manager
        </h2>

        <button
          onClick={loadUsers}
          className="text-xs px-3 py-1 rounded-lg border border-cyan-500/30 text-cyan-300"
        >
          Refresh
        </button>
      </div>

      {/* ➕ ADD USER CARD */}
      <div className="p-4 rounded-xl bg-black/50 border border-cyan-500/20 space-y-3">

        <p className="text-cyan-300 font-semibold">
          Add New User
        </p>

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          className="
            w-full p-2 rounded
            bg-black/60
            border border-cyan-500/30
            text-white
            outline-none
          "
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="
            w-full p-2 rounded
            bg-black/60
            border border-cyan-500/30
            text-white
          "
        >
          <option value="admin">Admin</option>
          <option value="pharmacy">Pharmacy</option>
          <option value="staff">Staff</option>
        </select>

        <button
          onClick={addUser}
          disabled={saving}
          className="
            w-full p-2 rounded
            bg-cyan-600
            hover:bg-cyan-500
            text-white
            font-medium
          "
        >
          {saving ? "Adding..." : "➕ Add User"}
        </button>

      </div>

      {/* LOADING */}
      {loading && (
        <p className="text-gray-400 text-sm">
          Loading users...
        </p>
      )}

      {/* USERS LIST */}
      <div className="grid gap-4">

        {users.map((u) => (
          <div
            key={u.id}
            className="
              flex items-center justify-between
              p-4 rounded-xl
              bg-black/50
              border border-cyan-500/20
            "
          >

            {/* INFO */}
            <div>
              <p className="text-white font-medium">
                {u.email}
              </p>

              <p className="text-sm text-gray-300">
                Role:{" "}
                <span className="text-cyan-300">
                  {u.role}
                </span>
              </p>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-2">

              <select
                value={u.role}
                onChange={(e) =>
                  updateRole(u.id, e.target.value)
                }
                className="
                  bg-black/70
                  border border-cyan-500/30
                  text-white
                  px-2 py-1 rounded
                "
              >
                <option value="admin">Admin</option>
                <option value="pharmacy">Pharmacy</option>
                <option value="staff">Staff</option>
              </select>

              <button
                onClick={() => deleteUser(u.id)}
                className="
                  px-3 py-1 rounded
                  bg-red-500/10
                  border border-red-500/30
                  text-red-400
                "
              >
                Delete
              </button>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}