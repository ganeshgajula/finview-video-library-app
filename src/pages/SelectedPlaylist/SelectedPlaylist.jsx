import React, { useState } from "react";
import { Navbar } from "../../components";
import { useVideos } from "../../context";
import { useParams, useNavigate } from "react-router-dom";
import { Link, Navigate } from "react-router-dom";
import { HorizontalVideoCard } from "../../components";
import { DeleteOutlineSvg, PencilSvg } from "../../components/ReusableSvgs";
import { Playlist } from "../Playlist";
import "./SelectedPlaylist.css";

export const SelectedPlaylist = () => {
  const {
    data: { playlist },
    videosDispatch,
  } = useVideos();
  const { playlistId } = useParams();
  const navigate = useNavigate();

  const userSelectedPlaylist = playlist.find(
    (myplaylist) => myplaylist.id === playlistId
  );

  const [playlistName, setPlaylistName] = useState(userSelectedPlaylist?.name);
  const [isEditMode, setIsEditMode] = useState(false);

  const modifyPlaylistNameHandler = () => {
    videosDispatch({
      type: "UPDATE_PLAYLIST_NAME",
      payload: {
        playlistId: userSelectedPlaylist.id,
        playlistName,
      },
    });
    setIsEditMode(false);
  };

  return (
    <>
      <Navbar />
      {userSelectedPlaylist ? (
        <div className="selected-playlist-videos">
          <div className="selected-playlist-actions">
            {isEditMode ? (
              <form onSubmit={modifyPlaylistNameHandler}>
                <input
                  type="text"
                  className="modify-playlistname"
                  value={playlistName}
                  onChange={(e) => setPlaylistName(e.target.value)}
                />

                <div className="user-playlist-action-btns">
                  <button type="submit" className="btn-primary btn-xs save-btn">
                    Save
                  </button>
                  <button
                    className="btn-outline btn-xs"
                    onClick={() => {
                      setPlaylistName(userSelectedPlaylist.name);
                      setIsEditMode(false);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <h2 className="selected-playlist-title">{playlistName}</h2>
            )}
            <span className="playlist-action-btns">
              <button
                className="playlist-action-btn"
                onClick={() => setIsEditMode(true)}
              >
                {!isEditMode ? <PencilSvg /> : null}
              </button>
              <button
                className="playlist-action-btn"
                onClick={() => {
                  videosDispatch({
                    type: "DELETE_PLAYLIST",
                    payload: userSelectedPlaylist.id,
                  });
                  navigate("/playlist");
                }}
              >
                <DeleteOutlineSvg />
              </button>
            </span>
          </div>
          {userSelectedPlaylist.videos.map((video) => (
            <Link
              to={`/watch/${video.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <HorizontalVideoCard key={video.id} {...video} />
            </Link>
          ))}
        </div>
      ) : (
        <Navigate replace to="/playlist" element={<Playlist />} />
      )}
    </>
  );
};