import { useEffect, useState } from "react";
import { deleteUser, fetchUsers } from "../services/adminService.js";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchUsers();
        setUsers(Array.isArray(data) ? data : []);
      } catch (error) {
        setUsers([]);
      } finally {
        setStatus("idle");
      }
    };

    loadUsers();
  }, []);

  const handleDelete = async (userId) => {
    setMessage("");
    try {
      await deleteUser(userId);
      setUsers((prev) => prev.filter((user) => user.id !== userId));
      setMessage("User deleted.");
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to delete user.");
    }
  };

  return (
    <section>
      <div className="mb-4">
        <h2 className="mb-1">Admin Dashboard</h2>
        <p className="text-muted">Manage all users in the system.</p>
      </div>
      {status === "loading" ? (
        <p className="text-muted">Loading users...</p>
      ) : users.length === 0 ? (
        <p className="text-muted">No users available.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>Email</th>
                <th>Role</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td className="text-end">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(user.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {message && <p className="text-muted">{message}</p>}
    </section>
  );
};

export default AdminDashboard;
