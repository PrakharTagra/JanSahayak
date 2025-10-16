import React, { useState, useEffect, useMemo } from "react";
import volunteersData from "./data/volunteers.json";
import postsData from "./data/posts.json";
import resolutionsData from "./data/resolutions.json";
import usersData from "./data/users.json"; // users who submit posts

export default function JansahayakGovDashboard() {
  const [route, setRoute] = useState("trending");
  const [user, setUser] = useState(null); // logged-in government employee
  const [showLogin, setShowLogin] = useState(false);

  // Mock data
  const [posts, setPosts] = useState(postsData);
  const [resolutions, setResolutions] = useState(resolutionsData);
  const [volunteers, setVolunteers] = useState(volunteersData);
  const [users, setUsers] = useState(usersData); // separate users data
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    const session = localStorage.getItem("jansahayak_gov_session");
    if (session) setUser(JSON.parse(session));
  }, []);

  function loginMock(id, password) {
    const emp = { id, name: "Gov Employee " + id, role: "officer" };
    setUser(emp);
    localStorage.setItem("jansahayak_gov_session", JSON.stringify(emp));
    setShowLogin(false);
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("jansahayak_gov_session");
  }

  function assignVolunteer(postId, volId) {
    setPosts((prevPosts) => {
      const updatedPosts = prevPosts.map((p) =>
        p.id === postId ? { ...p, assignedVolunteer: volId } : p
      );

      const assignedPost = updatedPosts.find(
        (p) => p.id === postId && p.assignedVolunteer
      );

      if (assignedPost) {
        setResolutions((prev) => [
          ...prev,
          {
            ...assignedPost,
            status: "In Progress",
            assignedVolunteer: volId,
            funds: assignedPost.funds || 0,
          },
        ]);
        return updatedPosts.filter((p) => p.id !== postId);
      }
      return updatedPosts;
    });
  }

  function markComplete(postId) {
    setResolutions((prev) =>
      prev.map((r) => (r.id === postId ? { ...r, status: "Completed" } : r))
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <button
              className="text-xl font-semibold"
              onClick={() => setRoute("trending")}
            >
              Jansahayak — Gov Dashboard
            </button>
            <nav className="hidden sm:flex gap-2 text-sm text-gray-600">
              <button
                onClick={() => setRoute("trending")}
                className={navBtn(route === "trending")}
              >
                Trending
              </button>
              <button
                onClick={() => setRoute("history")}
                className={navBtn(route === "history")}
              >
                Resolutions
              </button>
              <button
                onClick={() => setRoute("map")}
                className={navBtn(route === "map")}
              >
                Map
              </button>
              <button
                onClick={() => setRoute("manage")}
                className={navBtn(route === "manage")}
              >
                Manage Users
              </button>
              <button
                onClick={() => setRoute("volunteers")}
                className={navBtn(route === "volunteers")}
              >
                Volunteers
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="text-sm">
                  <div className="font-medium">{user.name}</div>
                  <div className="text-xs text-gray-500">{user.role}</div>
                </div>
                <button onClick={logout} className="btn-outline">
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="btn-primary"
              >
                Gov Login
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {!user && (
          <div className="mb-4 text-sm text-yellow-700 bg-yellow-50 p-3 rounded">
            You are viewing the dashboard in demo mode. Please login with
            government credentials to manage data.
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-1 bg-white p-4 rounded shadow-sm">
            <h3 className="text-lg font-semibold mb-3">Overview</h3>
            <div className="space-y-3 text-sm">
              <div>Trending posts: {posts.length}</div>
              <div>Total volunteers: {volunteers.length}</div>
              <div>Total users: {users.length}</div>
              <div>Resolutions (all): {resolutions.length}</div>
              <div className="text-xs text-gray-500">Quick actions</div>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => setRoute("trending")}
                  className="btn-ghost"
                >
                  Open Trending
                </button>
                <button
                  onClick={() => setRoute("map")}
                  className="btn-ghost"
                >
                  Open Map
                </button>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <section className="lg:col-span-3">
            {route === "trending" && (
              <TrendingPage
                posts={posts}
                volunteers={volunteers}
                onSelect={(p) => setSelectedPost(p)}
                onAssign={assignVolunteer}
              />
            )}
            {route === "history" && (
              <HistoryPage
                resolutions={resolutions}
                onMarkComplete={markComplete}
              />
            )}
            {route === "map" && <MapPage posts={posts} />}
            {route === "manage" && (
              <ManageUsersPage users={users} setUsers={setUsers} />
            )}
            {route === "volunteers" && (
              <VolunteersPage
                volunteers={volunteers}
                posts={resolutions} // volunteers assigned only in resolutions
                onAssign={(volId) => {
                  // Quick assign: pick first unassigned post
                  const first = resolutions.find((r) => !r.assignedVolunteer);
                  if (!first) return;
                  assignVolunteer(first.id, volId);
                }}
              />
            )}
          </section>
        </div>
      </main>

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onLogin={loginMock}
        />
      )}

      {selectedPost && (
        <PostModal
          post={selectedPost}
          volunteers={volunteers}
          onClose={() => setSelectedPost(null)}
          onAssign={(volId) => assignVolunteer(selectedPost.id, volId)}
        />
      )}

      <footer className="text-center text-xs text-gray-500 py-6">
        Jansahayak Dashboard — demo UI
      </footer>
    </div>
  );
}

/* ---------------- Pages ---------------- */
function TrendingPage({ posts, volunteers, onSelect, onAssign }) {
  const [showVolList, setShowVolList] = useState({});

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Trending Posts</h2>
        <div className="text-sm text-gray-600">Sorted by recent activity</div>
      </div>

      <div className="grid gap-4">
        {posts.map((post) => (
          <article
            key={post.id}
            className="bg-white p-4 rounded shadow-sm flex flex-col md:flex-row justify-between items-start gap-4"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold">{post.title}</h3>
                <span className="text-xs text-gray-500">({post.category})</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">{post.description}</p>
              {post.photo && (
                <div className="mt-2">
                  <img
                    src={post.photo}
                    alt={post.title}
                    className="w-full h-full object-cover rounded"
                  />
                </div>
              )}

              <div className="mt-2 text-xs text-gray-500 flex gap-4">
                <span>👍 {post.upvotes || 0}</span>
                <span>💬 {post.comments?.length || 0} Comments</span>
              </div>

              <div className="mt-3">
                <button
                  onClick={() =>
                    setShowVolList((prev) => ({
                      ...prev,
                      [post.id]: !prev[post.id],
                    }))
                  }
                  className={`px-3 py-1 text-xs rounded font-medium transition
                    ${
                      showVolList[post.id]
                        ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                        : "bg-indigo-600 text-white hover:bg-indigo-700"
                    }`}
                >
                  {showVolList[post.id] ? "Hide Volunteers" : "View Volunteers"}
                </button>

                {showVolList[post.id] && post.volunteers?.length > 0 && (
                  <ul className="text-xs text-gray-600 mt-2 space-y-1">
                    {post.volunteers.map((vid) => {
                      const v = volunteers.find((x) => x.id === vid);
                      if (!v) return null;
                      return (
                        <li
                          key={v.id}
                          className="flex justify-between items-center border p-2 rounded"
                        >
                          <div>
                            <div className="font-medium">
                              {v.name}{" "}
                              <span className="text-gray-500 text-xs">
                                ({v.age})
                              </span>
                            </div>
                            <div className="text-gray-500 text-xs">
                              Est time: {v.estimatedTime} • Skills:{" "}
                              {v.skills.join(", ")}
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={() => onAssign(post.id, v.id)}
                              className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition"
                            >
                              Assign
                            </button>
                            <button className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded hover:bg-gray-200 transition">
                              View Profile
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
                {showVolList[post.id] && !post.volunteers?.length && (
                  <div className="text-sm text-gray-500 mt-1">
                    No volunteers yet.
                  </div>
                )}
              </div>
            </div>

            <div className="text-right text-xs">
              <div>{post.location.name}</div>
              <div className="text-gray-400">{post.createdAt}</div>
            </div>
          </article>
        ))}

        {posts.length === 0 && (
          <div className="text-center text-gray-500 py-6">
            No trending posts available.
          </div>
        )}
      </div>
    </div>
  );
}

function HistoryPage({ resolutions, onMarkComplete }) {
  const waiting = resolutions.filter((r) => !r.assignedVolunteer);
  const inProgress = resolutions.filter(
    (r) => r.assignedVolunteer && r.status === "In Progress"
  );
  const completed = resolutions.filter((r) => r.status === "Completed");

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4">Resolutions Dashboard</h2>

      {/* Waiting */}
      <div className="bg-white p-4 rounded shadow-sm">
        <h3 className="text-lg font-semibold mb-3">Waiting for Volunteers</h3>
        {waiting.length ? (
          <ul className="space-y-2">
            {waiting.map((r) => (
              <li key={r.id} className="border p-2 rounded">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">{r.title}</div>
                    <div className="text-xs text-gray-500">{r.description}</div>
                  </div>
                  <div className="text-xs text-gray-500">
                    Volunteers applied: {r.volunteers?.length || 0}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-gray-500 text-sm">
            No posts waiting for volunteers.
          </div>
        )}
      </div>

      {/* In Progress */}
      <div className="bg-white p-4 rounded shadow-sm">
        <h3 className="text-lg font-semibold mb-3">In Progress</h3>
        {inProgress.length ? (
          <ul className="space-y-2">
            {inProgress.map((r) => (
              <li
                key={r.id}
                className="border p-2 rounded flex justify-between items-center"
              >
                <div>
                  <div className="font-medium">{r.title}</div>
                  <div className="text-xs text-gray-500">{r.description}</div>
                  <div className="text-xs text-gray-500">
                    Assigned Volunteer: {r.assignedVolunteer}
                  </div>
                  <div className="text-xs text-gray-500">
                    Funds: ₹{r.funds || 0}
                  </div>
                </div>
                <button
                  onClick={() => onMarkComplete(r.id)}
                  className="btn-primary btn-sm"
                >
                  Mark Complete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-gray-500 text-sm">No in-progress posts.</div>
        )}
      </div>

      {/* Completed */}
      <div className="bg-white p-4 rounded shadow-sm">
        <h3 className="text-lg font-semibold mb-3">Completed</h3>
        {completed.length ? (
          <ul className="space-y-2">
            {completed.map((r) => (
              <li key={r.id} className="border p-2 rounded">
                <div className="font-medium">{r.title}</div>
                <div className="text-xs text-gray-500">{r.description}</div>
                <div className="text-xs text-gray-500">
                  Completed by: {r.assignedVolunteer}
                </div>
                <div className="text-xs text-gray-500">Funds: ₹{r.funds || 0}</div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-gray-500 text-sm">No completed posts yet.</div>
        )}
      </div>
    </div>
  );
}

function MapPage({ posts }) {
  return (
    <div className="bg-white p-4 rounded shadow-sm min-h-[420px]">
      <h2 className="text-2xl font-semibold mb-3">Delhi Complaints Map</h2>
      <div className="text-sm text-gray-500 mb-4">
        Heatmap overlay shows areas with higher complaint density (red) — placeholder
        below.
      </div>
      <div className="h-96 border rounded overflow-hidden">
        <div className="w-full h-full flex items-center justify-center text-gray-400">
          Map placeholder — integrate react-leaflet or Google Maps and pass `posts` lat/lng.
        </div>
      </div>
    </div>
  );
}

/* ---------------- Volunteers ---------------- */
function VolunteersPage({ volunteers, posts, onAssign }) {
  const [selectedArea, setSelectedArea] = useState("All");

  const areas = useMemo(() => {
    const areaSet = new Set(volunteers.map((v) => v.area || "Unknown"));
    return ["All", ...Array.from(areaSet)];
  }, [volunteers]);

  const filteredVolunteers = useMemo(() => {
    if (selectedArea === "All") return volunteers;
    return volunteers.filter((v) => v.area === selectedArea);
  }, [volunteers, selectedArea]);

  const isAssigned = (volId) => {
    return posts.some((p) => p.assignedVolunteer === volId);
  };

  return (
    <div className="bg-white p-4 rounded shadow-sm">
      <h2 className="text-2xl font-semibold mb-4">Volunteers Directory</h2>
      <div className="mb-4 flex items-center gap-2">
        <label htmlFor="area" className="text-sm font-medium">
          Filter by Area:
        </label>
        <select
          id="area"
          className="border rounded px-2 py-1 text-sm"
          value={selectedArea}
          onChange={(e) => setSelectedArea(e.target.value)}
        >
          {areas.map((area) => (
            <option key={area} value={area}>
              {area}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-3">
        {filteredVolunteers.map((v) => (
          <div
            key={v.id}
            className={`p-3 border rounded flex items-center justify-between ${
              isAssigned(v.id) ? "bg-gray-50 opacity-80" : ""
            }`}
          >
            <div>
              <div className="font-semibold">
                {v.name} <span className="text-xs text-gray-500">({v.age})</span>
              </div>
              <div className="text-xs text-gray-600">{v.skills.join(", ")}</div>
              <div className="text-xs text-gray-500">
                Est time: {v.estimatedTime} • Area: {v.area || "Unknown"}
              </div>
              {isAssigned(v.id) && (
                <div className="text-xs text-green-600 font-medium mt-1">
                  Assigned to a task
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => onAssign(v.id)}
                disabled={isAssigned(v.id)}
                className={`btn-primary btn-sm ${
                  isAssigned(v.id) ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Assign
              </button>
              <button className="btn-ghost btn-sm">View Profile</button>
            </div>
          </div>
        ))}

        {filteredVolunteers.length === 0 && (
          <div className="text-center text-gray-500 py-6">
            No volunteers found for this area.
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- Modals ---------------- */
function LoginModal({ onClose, onLogin }) {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded shadow-lg w-full max-w-md p-6">
        <h3 className="text-lg font-semibold mb-2">Government Login</h3>
        <div className="text-sm text-gray-500 mb-4">
          Use government user ID and password (demo will accept any).
        </div>
        <input
          className="input mb-2"
          placeholder="User ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <input
          className="input mb-4"
          placeholder="Password"
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
        />
        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="btn-outline">
            Cancel
          </button>
          <button onClick={() => onLogin(id || "gov-001", pw)} className="btn-primary">
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

function PostModal({ post, volunteers, onClose, onAssign }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded shadow-lg w-full max-w-2xl p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold">{post.title}</h3>
            <div className="text-sm text-gray-500">
              {post.location.name} • {post.createdAt}
            </div>
          </div>
          <div>
            <button onClick={onClose} className="text-gray-500">
              Close
            </button>
          </div>
        </div>

        <p className="mt-4 text-sm text-gray-700">{post.description}</p>

        <div className="mt-4">
          <h4 className="font-semibold">Volunteers applied</h4>
          <div className="grid gap-2 mt-2">
            {(post.volunteers || []).map((vid) => {
              const v = volunteers.find((x) => x.id === vid);
              if (!v) return null;
              return (
                <div
                  key={v.id}
                  className="p-2 border rounded flex justify-between items-center"
                >
                  <div>
                    <div className="font-medium">
                      {v.name}{" "}
                      <span className="text-xs text-gray-500">({v.age})</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Est time: {v.estimatedTime} • Skills: {v.skills.join(", ")}
                    </div>
                  </div>
                  <div>
                    <button
                      onClick={() => onAssign(v.id)}
                      className="btn-primary btn-sm"
                    >
                      Assign
                    </button>
                  </div>
                </div>
              );
            })}

            {(!post.volunteers || post.volunteers.length === 0) && (
              <div className="text-sm text-gray-500">
                No volunteers yet — use quick assign.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function navBtn(active) {
  return `px-3 py-1 rounded ${active ? "bg-indigo-600 text-white" : "hover:bg-gray-100"}`;
}

function ManageUsersPage({ users }) {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div className="bg-white p-4 rounded shadow-sm">
      <h2 className="text-2xl font-semibold mb-4">Users Management</h2>

      {selectedUser ? (
        // Profile View
        <div className="border p-4 rounded shadow-sm">
          <h3 className="text-xl font-semibold mb-3">User Profile</h3>
          <p><strong>Name:</strong> {selectedUser.name}</p>
          <p><strong>Age:</strong> {selectedUser.age}</p>
          <p><strong>Address:</strong> {selectedUser.address}</p>
          <p><strong>Mobile:</strong> {selectedUser.mobile}</p>
          <p><strong>Aadhar No:</strong> {selectedUser.aadhar}</p>

          <button
            className="btn btn-sm mt-4"
            onClick={() => setSelectedUser(null)}
          >
            Back
          </button>
        </div>
      ) : users.length ? (
        // Users List
        <ul className="space-y-2">
          {users.map((u) => (
            <li
              key={u.id}
              className="border p-2 rounded flex justify-between items-center"
            >
              <div className="font-medium">{u.name}</div>
              <button
                onClick={() => setSelectedUser(u)}
                className="text-blue-600 text-sm underline"
              >
                View Profile
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-gray-500 text-sm">No users found.</div>
      )}
    </div>
  );
}