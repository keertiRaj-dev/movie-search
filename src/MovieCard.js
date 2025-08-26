import React from "react";
import "./movieCard.css";

export const MovieCard = ({ result }) => {
  const title =
    result?.name ||
    result?.title ||
    result?.original_title ||
    result?.originalName ||
    "Untitled";

  const rawGenres = result?.genres ?? result?.genre ?? [];
  const genres = Array.isArray(rawGenres)
    ? rawGenres
    : String(rawGenres || "")
        .split(",")
        .map((g) => g.trim())
        .filter(Boolean);

  const vote =
    Number(
      result?.vote_average ??
        result?.vote ??
        result?.rating ??
        result?.average_vote
    ) || 0;

  const photo = result?.photo || result?.poster || result?.poster_path || "";

  return (
    <div
      className="box"
      style={{
        background: photo
          ? `url(../public/assets/${photo})`
          : "linear-gradient(135deg, #422c73 0%, #88bfb5 100%)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="title">{title}</div>

      <div className="meta">
        <span className="badge">{vote.toFixed(1)}</span>
        <span className="genre">
          {genres.length ? genres.join(" · ") : "No genres"}
        </span>
      </div>
    </div>
  );
};
