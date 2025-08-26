import React from "react";
import { MovieCard } from "./MovieCard";
import "./search.css";

const API_URL = "https://my-json-server.typicode.com/fabioelia/yoop/movies";

const YOOP_TOKEN =
  "token c3VwZXIgc2VjdXJlLi4uIFlvb3AgVmlzaW9uIHdpbGwgYmUgYSBodWdlIHN1Y2Nlc3MuIExldCBtZSBrbm93IGlmIHlvdSByZWFkIHRoaXMgOik=";

function normalize(m = {}, idx = 0) {
  const title =
    m.name ||
    m.title ||
    m.original_title ||
    m.originalName ||
    `Untitled #${idx + 1}`;
  const rawGenres = m.genres ?? m.genre ?? [];
  const genres = Array.isArray(rawGenres)
    ? rawGenres
    : String(rawGenres || "")
        .split(",")
        .map((g) => g.trim())
        .filter(Boolean);
  const vote =
    Number(m.vote_average ?? m.vote ?? m.rating ?? m.average_vote) || 0;

  return {
    id: String(m.id ?? `idx-${idx}`),
    name: title,
    genres,
    vote_average: vote,
    photo: m.photo || m.poster || m.poster_path || "",
    raw: m,
  };
}

export const Search = () => {
  const [movies, setMovies] = React.useState([]);
  const [status, setStatus] = React.useState("idle");
  const [error, setError] = React.useState("");

  const [query, setQuery] = React.useState("");
  const [genre, setGenre] = React.useState("All");
  const [minVote, setMinVote] = React.useState(0);

  const [debouncedQuery, setDebouncedQuery] = React.useState(query);
  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 250);
    return () => clearTimeout(t);
  }, [query]);

  React.useEffect(() => {
    (async () => {
      try {
        setStatus("loading");
        const res = await fetch(API_URL, {
          headers: { YoopToken: YOOP_TOKEN },
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
        const data = await res.json();
        const arr = Array.isArray(data) ? data : data?.movies ?? [];
        setMovies(arr.map(normalize));
        setStatus("ready");
      } catch (e) {
        setError(e.message || "Unknown error");
        setStatus("error");
      }
    })();
  }, []);

  const allGenres = React.useMemo(() => {
    const set = new Set();
    movies.forEach((m) => m.genres.forEach((g) => g && set.add(g)));
    return ["All", ...Array.from(set).sort()];
  }, [movies]);

  const filtered = React.useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    return movies.filter((m) => {
      const matchesName = q === "" || m.name.toLowerCase().includes(q);
      const matchesGenre =
        genre === "All" ||
        m.genres.some((g) => g.toLowerCase() === genre.toLowerCase());
      const matchesVote = (m.vote_average ?? 0) >= minVote;
      return matchesName && matchesGenre && matchesVote;
    });
  }, [movies, debouncedQuery, genre, minVote]);

  return (
    <>
      <h3>Search Results:</h3>

      <div className="filters">
        <div className="field">
          <label htmlFor="searchName">Search by name</label>
          <input
            id="searchName"
            type="text"
            placeholder="e.g. Toy Story"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="genre">Genre</label>
          <select
            id="genre"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
          >
            {allGenres.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="minVote">
            Min. average vote <strong>{minVote.toFixed(1)}</strong>
          </label>
          <input
            id="minVote"
            type="range"
            min="0"
            max="100"
            step="1"
            value={minVote}
            onChange={(e) => setMinVote(Number(e.target.value))}
          />
        </div>
      </div>

      {status === "loading" && <p className="muted">Loading movies…</p>}
      {status === "error" && (
        <p className="error">
          Couldn’t load movies. {error}
          <br />
        </p>
      )}

      {status === "ready" && (
        <>
          <p className="muted">
            Showing <strong>{filtered.length}</strong> of{" "}
            <strong>{movies.length}</strong> movies
          </p>

          <div className="grid">
            {filtered.map((result) => (
              <MovieCard key={result.id} result={result} />
            ))}
          </div>
        </>
      )}
    </>
  );
};
