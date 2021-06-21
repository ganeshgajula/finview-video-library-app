import { v4 as uuidv4 } from "uuid";

export const videosReducer = (state, { type, payload }) => {
  switch (type) {
    case "LOAD_VIDEOS":
      return { ...state, videos: payload };

    case "LOAD_PLAYLIST":
      return { ...state, playlist: payload };

    case "SEARCH_VIDEO":
      return { ...state, searchedKeyword: payload };

    case "ADD_TO_LIKED_VIDEOS":
      return { ...state, likedVideos: [...state.likedVideos, payload] };

    case "REMOVE_FROM_LIKED_VIDEOS":
      return {
        ...state,
        likedVideos: state.likedVideos.filter((video) => video._id !== payload),
      };

    case "ADD_TO_HISTORY":
      return { ...state, history: [...state.history, payload] };

    case "CREATE_NEW_PLAYLIST":
      return {
        ...state,
        playlist: [
          ...state.playlist,
          {
            id: uuidv4(),
            name: payload,
            videos: [],
          },
        ],
      };

    case "ADD_TO_PLAYLIST":
      return {
        ...state,
        playlist: state.playlist.map((playlist) =>
          playlist.id === payload.ongoingPlaylistId
            ? {
                ...playlist,
                videos: [...playlist.videos, payload.requestedVideo],
              }
            : playlist
        ),
      };

    case "REMOVE_FROM_PLAYLIST":
      return {
        ...state,
        playlist: state.playlist.map((playlist) =>
          playlist.id === payload.ongoingPlaylistId
            ? {
                ...playlist,
                videos: playlist.videos.filter(
                  (video) => video._id !== payload.videoId
                ),
              }
            : playlist
        ),
      };

    case "UPDATE_PLAYLIST_NAME":
      return {
        ...state,
        playlist: state.playlist.map((currentPlaylist) =>
          currentPlaylist.id === payload.playlistId
            ? { ...currentPlaylist, name: payload.playlistName }
            : currentPlaylist
        ),
      };

    case "DELETE_PLAYLIST":
      return {
        ...state,
        playlist: state.playlist.filter((playlist) => playlist.id !== payload),
      };

    case "ADD_TO_SAVED_VIDEOS_PLAYLIST":
      return {
        ...state,
        playlist: state.playlist.map((playlist) =>
          playlist.name === payload.playlistName
            ? {
                ...playlist,
                videos: [...playlist.videos, payload.requestedVideo],
              }
            : playlist
        ),
      };

    case "REMOVE_FROM_SAVED_VIDEOS_PLAYLIST":
      return {
        ...state,
        playlist: state.playlist.map((playlist) =>
          playlist.name === payload.playlistName
            ? {
                ...playlist,
                videos: playlist.videos.filter(
                  (video) => video._id !== payload.videoId
                ),
              }
            : playlist
        ),
      };

    case "ADD_TO_WATCH_LATER_PLAYLIST":
      return {
        ...state,
        playlist: state.playlist.map((playlist) =>
          playlist.name === payload.playlistName
            ? {
                ...playlist,
                videos: [...playlist.videos, payload.requestedVideo],
              }
            : playlist
        ),
      };

    case "REMOVE_FROM_WATCH_LATER_PLAYLIST":
      return {
        ...state,
        playlist: state.playlist.map((playlist) =>
          playlist.name === payload.playlistName
            ? {
                ...playlist,
                videos: playlist.videos.filter(
                  (video) => video._id !== payload.videoId
                ),
              }
            : playlist
        ),
      };

    default:
      return state;
  }
};
