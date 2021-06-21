import React, { useState } from "react";
import { Navbar } from "../../components";
import { useAuth, useVideos } from "../../context";
import { useParams, useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { HorizontalVideoCard } from "../../components";
import { DeleteOutlineSvg, PencilSvg } from "../../components/ReusableSvgs";
import { Playlist } from "../Playlist";
import { updatePlaylistName, deletePlaylist } from "../../utils";
import "./SelectedPlaylist.css";

export const SelectedPlaylist = () => {
  const {
    data: { playlist, defaultPlaylist },
    videosDispatch,
  } = useVideos();
  const { playlistId } = useParams();
  const navigate = useNavigate();
  const { userId } = useAuth();

  const userSelectedPlaylist = playlist.find(
    (myplaylist) => myplaylist._id === playlistId
  );

  const isDefaultPlaylist = defaultPlaylist.find(
    (playlist) => playlist._id === userSelectedPlaylist._id
  );

  const [playlistName, setPlaylistName] = useState(userSelectedPlaylist?.name);
  const [isEditMode, setIsEditMode] = useState(false);

  const modifyPlaylistNameHandler = () => {
    updatePlaylistName(playlistId, playlistName, userId, videosDispatch);

    // videosDispatch({
    //   type: "UPDATE_PLAYLIST_NAME",
    //   payload: {
    //     playlistId: userSelectedPlaylist.id,
    //     playlistName,
    //   },
    // });
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
                className="playlist-action-btn btn-1"
                disabled={isDefaultPlaylist ? true : false}
                style={{
                  cursor: isDefaultPlaylist ? "not-allowed" : "pointer",
                }}
                onClick={() => setIsEditMode(true)}
              >
                {!isEditMode && <PencilSvg />}
              </button>
              <button
                className="playlist-action-btn"
                disabled={isDefaultPlaylist ? true : false}
                style={{
                  cursor: isDefaultPlaylist ? "not-allowed" : "pointer",
                }}
                onClick={() => {
                  // videosDispatch({
                  //   type: "DELETE_PLAYLIST",
                  //   payload: userSelectedPlaylist.id,
                  // });
                  deletePlaylist(playlistId, userId, videosDispatch);
                  navigate("/playlist", { replace: true });
                }}
              >
                <DeleteOutlineSvg />
              </button>
            </span>
          </div>
          {userSelectedPlaylist.videos.length > 0 ? (
            userSelectedPlaylist.videos.map((video) => (
              <HorizontalVideoCard
                key={video._id}
                playlistId={playlistId}
                {...video}
              />
            ))
          ) : (
            <p className="empty-playlist-msg">No videos in this playlist</p>
          )}
        </div>
      ) : (
        <Navigate replace to="/playlist" element={<Playlist />} />
      )}
    </>
  );
};
