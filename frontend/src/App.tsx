import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import {
  Link,
  Navigate,
  Route,
  Routes,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import "./App.css";
type College = {
  id: number;
  name: string;
  location: string;
  fees: number;
  rating: number;
  cutoffRank?: number;
  exam?: string;
  placementRate: number;
  courses: string[];
  description: string;
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
function Header({
  token,
  onLogout,
}: {
  token: string | null;
  onLogout: () => void;
}) {
  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between p-4">
        <Link to="/" className="text-lg font-bold">
          <span style={{ color: "#6366f1" }}>College</span>
          <span style={{ color: "#9333ea" }}>Compass</span>
        </Link>
        <nav className="flex gap-4 text-sm">
          <Link to="/">Colleges</Link>
          <Link to="/compare">Compare</Link>
          <Link to="/saved">Saved</Link>
          <Link to="/predict">Predictor</Link>
          {token ? (
            <button
              onClick={onLogout}
              className="rounded bg-slate-900 px-3 py-1 text-white"
            >
              Logout
            </button>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </nav>
      </div>
    </header>
  );
}

function CollegeList() {
  const [params, setParams] = useSearchParams();
  const [items, setItems] = useState<College[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [, setLoading] = useState(false);
  const [, setError] = useState("");
  const page = Number(params.get("page") || "1");
  const search = params.get("search") || "";
  const location = params.get("location") || "";
  const maxFees = params.get("maxFees") || "";

  useEffect(() => {
    setLoading(true);
    setError("");
    api
      .get("/colleges", { params: { page, search, location, maxFees } })
      .then((res) => {
        setItems(res.data.data);
        setTotalPages(res.data.pagination.totalPages);
      })
      .catch(() => {
        setError(
          "Could not load colleges. Check backend is running and VITE_API_URL is correct.",
        );
      })
      .finally(() => setLoading(false));
  }, [page, search, location, maxFees]);

  return (
    <div className="app-container">
      {/* HERO */}
      <div className="hero-box">
        <h1>
          Find your <span>perfect college</span>
        </h1>
        <p>Discover, compare, and decide smarter.</p>
      </div>

      {/* SEARCH */}
      <div className="search-box">
        <input
          placeholder="Search college"
          value={search}
          onChange={(e) =>
            setParams({
              ...Object.fromEntries(params.entries()),
              search: e.target.value,
              page: "1",
            })
          }
        />
        <input
          placeholder="Location"
          value={location}
          onChange={(e) => {
            const newParams = new URLSearchParams(params);
            newParams.set("location", e.target.value);
            newParams.set("page", "1");
            setParams(newParams);
          }}
        />
        <input
          type="number"
          placeholder="Max Fees"
          value={maxFees}
          onChange={(e) => {
            const newParams = new URLSearchParams(params);

            if (e.target.value) {
              newParams.set("maxFees", e.target.value);
            } else {
              newParams.delete("maxFees");
            }

            newParams.set("page", "1");
            setParams(newParams);
          }}
        />
      </div>

      {/* CARDS */}
      <div className="card-grid">
        {items.map((college) => (
          <Link
            key={college.id}
            to={`/college/${college.id}`}
            className="college-card"
          >
            <div className="card-top"></div>

            <div className="card-content">
              <div className="card-header">
                <h2>{college.name}</h2>

                {college.rating >= 4.8 && <span className="badge">Top</span>}
              </div>

              <p className="location">{college.location}</p>

              <div className="stats">
                <div>
                  <span>Fees</span>
                  <strong>₹{college.fees.toLocaleString()}</strong>
                </div>
                <div>
                  <span>Rating</span>
                  <strong>⭐ {college.rating}</strong>
                </div>
                <div>
                  <span>Placement</span>
                  <strong>{college.placementRate}%</strong>
                </div>
              </div>

              <div className="courses">
                {college.courses.slice(0, 3).map((c) => (
                  <span key={c}>{c}</span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* PAGINATION */}
      <div className="pagination">
        <button
          disabled={page <= 1}
          onClick={() =>
            setParams({
              ...Object.fromEntries(params.entries()),
              page: String(page - 1),
            })
          }
        >
          Prev
        </button>

        <span>
          Page {page} / {totalPages}
        </span>

        <button
          disabled={page >= totalPages}
          onClick={() =>
            setParams({
              ...Object.fromEntries(params.entries()),
              page: String(page + 1),
            })
          }
        >
          Next
        </button>
      </div>
    </div>
  );
}

function CollegeDetail({ token }: { token: string | null }) {
  const { id } = useParams();
  const [college, setCollege] = useState<College | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
    api
      .get(`/colleges/${id}`)
      .then((res) => setCollege(res.data))
      .catch(() => setError("Could not load this college."));
  }, [id]);

  async function saveCollege() {
    if (!token || !college) return;
    await api.post(
      `/saved/${college.id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } },
    );
    alert("Saved");
  }

  if (error) return <p className="text-red-700">{error}</p>;
  if (!college) return <p>Loading...</p>;
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{college.name}</h1>
      <p className="text-slate-700">{college.description}</p>
      <section className="rounded border bg-white p-4">
        <h2 className="font-semibold">Overview</h2>
        <p>Fees: Rs {college.fees.toLocaleString()}</p>
        <p>Location: {college.location}</p>
        <p>Rating: {college.rating}</p>
      </section>
      <section className="rounded border bg-white p-4">
        <h2 className="font-semibold">Courses</h2>
        <ul className="list-disc pl-5">
          {college.courses.map((course) => (
            <li key={course}>{course}</li>
          ))}
        </ul>
      </section>
      <section className="rounded border bg-white p-4">
        <h2 className="font-semibold">Placements</h2>
        <p>Placement Rate: {college.placementRate}%</p>
      </section>
      <button onClick={saveCollege} className="save-btn">
        {token ? "Save College" : "Login to Save"}
      </button>
    </div>
  );
}

function ComparePage() {
  const [allColleges, setAllColleges] = useState<College[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [data, setData] = useState<College[]>([]);
  const [error, setError] = useState("");
  const [isCompared, setIsCompared] = useState(false);

  useEffect(() => {
    api.get("/colleges", { params: { page: 1, pageSize: 100 } }).then((res) => {
      setAllColleges(res.data.data);
    });
  }, []);

  const selectedIdCsv = useMemo(() => selectedIds.join(","), [selectedIds]);

  function toggleSelection(id: number) {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((item) => item !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  }

  async function onCompare(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (selectedIds.length < 2) {
      setError("Select at least 2 colleges.");
      return;
    }

    try {
      const res = await api.get("/colleges/compare/list", {
        params: { ids: selectedIdCsv },
      });
      setData(res.data);
      setIsCompared(true);
    } catch {
      setError("Comparison failed. Please try again.");
    }
  }

  function resetCompare() {
    setIsCompared(false);
    setData([]);
    setSelectedIds([]);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Compare Colleges</h1>

      {!isCompared ? (
        <form onSubmit={onCompare} className="space-y-4">
          <p className="text-sm text-slate-600">
            Select 2–3 colleges to compare
          </p>

          <div className="grid gap-3 md:grid-cols-2">
            {allColleges.map((college) => {
              const checked = selectedIds.includes(college.id);
              const disableNewSelection = !checked && selectedIds.length >= 3;

              return (
                <label
                  key={college.id}
                  className={`flex items-center gap-3 rounded-xl border bg-white p-3 shadow-sm transition ${
                    checked ? "border-blue-500 bg-blue-50" : ""
                  } ${disableNewSelection ? "opacity-50" : ""}`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={disableNewSelection}
                    onChange={() => toggleSelection(college.id)}
                  />
                  <span className="font-medium">{college.name}</span>
                </label>
              );
            })}
          </div>

          <button className="rounded-xl bg-black px-5 py-2 text-white hover:scale-105 transition">
            Compare Selected
          </button>

          {!!error && <p className="text-red-600 text-sm">{error}</p>}
        </form>
      ) : (
        <div className="space-y-5">
          {/* HEADER */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Comparison Result</h2>
            <div className="flex gap-3">
              <button
                onClick={() => setIsCompared(false)}
                className="text-sm text-blue-600"
              >
                Edit Selection
              </button>
              <button
                onClick={resetCompare}
                className="rounded bg-black px-3 py-1 text-white text-sm"
              >
                Compare Again
              </button>
            </div>
          </div>

          {/* CARDS COMPARISON */}
          <div className="grid gap-4 md:grid-cols-3">
            {data.map((college) => (
              <div
                key={college.id}
                className="rounded-2xl border bg-white p-4 shadow-md hover:shadow-lg transition"
              >
                <h3 className="text-lg font-semibold">{college.name}</h3>
                <p className="text-sm text-gray-500">{college.location}</p>

                <div className="mt-4 space-y-2 text-sm">
                  <p>
                    💰 <strong>Fees:</strong> ₹{college.fees.toLocaleString()}
                  </p>
                  <p>
                    ⭐ <strong>Rating:</strong> {college.rating}
                  </p>
                  <p>
                    📊 <strong>Placement:</strong> {college.placementRate}%
                  </p>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {college.courses.slice(0, 3).map((c) => (
                    <span
                      key={c}
                      className="rounded-full bg-gray-100 px-2 py-1 text-xs"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* BEST COLLEGE HIGHLIGHT */}
          <div className="rounded-xl bg-green-50 p-4 border">
            <h3 className="font-semibold text-green-700">🏆 Best Choice</h3>
            <p className="text-sm text-green-800">
              {[...data].sort((a, b) => b.rating - a.rating)[0]?.name} has the
              highest rating among selected colleges.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
function PredictorPage() {
  const [exam, setExam] = useState("JEE");
  const [rank, setRank] = useState("");
  const [results, setResults] = useState<College[]>([]);
  const [loading, setLoading] = useState(false);

  async function handlePredict(e: React.FormEvent) {
    e.preventDefault();
    if (!rank) return;

    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:4000/api/colleges/predict?exam=${exam}&rank=${rank}`,
      );
      const data = await res.json();
      setResults(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <h1 className="title">🎯 College Predictor</h1>

      <form onSubmit={handlePredict} className="predict-form">
        <select value={exam} onChange={(e) => setExam(e.target.value)}>
          <option value="JEE">JEE</option>
          <option value="NEET">NEET</option>
        </select>

        <input
          type="number"
          placeholder="Enter your rank"
          value={rank}
          onChange={(e) => setRank(e.target.value)}
        />

        <button>Predict</button>
      </form>

      {loading && <p>Loading...</p>}

      <div className="predict-grid">
        {results.map((c) => {
          const rankNum = Number(rank);

          const type =
            c.cutoffRank && rankNum <= c.cutoffRank * 0.8
              ? "safe"
              : c.cutoffRank && rankNum <= c.cutoffRank
                ? "moderate"
                : "dream";

          return (
            <div key={c.id} className={`predict-card ${type}`}>
              <div className="card-header">
                <h3>{c.name}</h3>
                <span className="badge">{type.toUpperCase()}</span>
              </div>

              <p className="location">{c.location}</p>

              <div className="stats">
                <div>
                  <span>Fees</span>
                  <strong>₹{c.fees.toLocaleString()}</strong>
                </div>

                <div>
                  <span>Rating</span>
                  <strong>⭐ {c.rating}</strong>
                </div>

                <div>
                  <span>Cutoff</span>
                  <strong>🎯 {c.cutoffRank ?? "N/A"}</strong>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LoginPage({ onAuth }: { onAuth: (token: string) => void }) {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      if (isRegister)
        await api.post("/auth/register", { name, email, password });
      const res = await api.post("/auth/login", { email, password });
      onAuth(res.data.token);
      navigate("/saved");
    } catch {
      setError(
        "Authentication failed. Check email/password or try register first.",
      );
    }
  }

  return (
    <div className="mx-auto max-w-md rounded border bg-white p-4">
      <h1 className="mb-3 text-xl font-bold">
        {isRegister ? "Register" : "Login"}
      </h1>
      <form onSubmit={onSubmit} className="space-y-2">
        {isRegister && (
          <input
            className="w-full rounded border p-2"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}
        <input
          className="w-full rounded border p-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full rounded border p-2"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full rounded bg-sky-700 p-2 text-white">
          {isRegister ? "Register" : "Login"}
        </button>
      </form>
      {!!error && <p className="mt-2 text-sm text-red-700">{error}</p>}
      <button
        onClick={() => setIsRegister((v) => !v)}
        className="mt-2 text-sm text-sky-700"
      >
        {isRegister
          ? "Already have an account? Login"
          : "Need an account? Register"}
      </button>
    </div>
  );
}

function SavedPage({ token }: { token: string | null }) {
  const [data, setData] = useState<College[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!token) return;
    setError("");
    api
      .get("/saved", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setData(res.data))
      .catch(() => setError("Could not load saved colleges."));
  }, [token]);

  if (!token) return <Navigate to="/login" replace />;

  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-bold">Saved Colleges</h1>
      {!!error && <p className="text-sm text-red-700">{error}</p>}
      {!error && data.length === 0 && (
        <p className="text-sm text-slate-600">No saved colleges yet.</p>
      )}
      {data.map((college) => (
        <div key={college.id} className="rounded border bg-white p-3">
          <p className="font-semibold">{college.name}</p>
          <p className="text-sm text-slate-600">{college.location}</p>
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );
  function onAuth(nextToken: string) {
    setToken(nextToken);
    localStorage.setItem("token", nextToken);
  }
  function onLogout() {
    setToken(null);
    localStorage.removeItem("token");
  }

  return (
    <div className="min-h-screen">
      <Header token={token} onLogout={onLogout} />
      <main className="mx-auto max-w-6xl p-4">
        <Routes>
          <Route path="/" element={<CollegeList />} />
          <Route
            path="/college/:id"
            element={<CollegeDetail token={token} />}
          />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/predict" element={<PredictorPage />} />
          <Route path="/login" element={<LoginPage onAuth={onAuth} />} />
          <Route path="/saved" element={<SavedPage token={token} />} />
        </Routes>
      </main>
    </div>
  );
}
