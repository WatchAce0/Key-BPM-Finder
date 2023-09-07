import React, { useState } from "react";
import "./tailwind.css";

const SongFinder = () => {
  const [songUrl, setSongUrl] = useState("");
  const [songDetails, setSongDetails] = useState(null);
  const [audioFeatures, setAudioFeatures] = useState(null);

  const clientId = "fc7900b3653345d2ae648a2c773cbbd4";
  const clientSecret = "7513b2a6a33248e398cc9088065dc3d9";

  const getSongDetails = async () => {
    const trackId = songUrl.split("track/")[1].split("?")[0];
    const accessToken = await getAccessToken();
    const trackDetails = await fetchTrackDetails(trackId, accessToken);
    const audioFeaturesData = await fetchAudioFeatures(trackId, accessToken);

    setSongDetails(trackDetails);
    setAudioFeatures(audioFeaturesData);
  };

  const getAccessToken = async () => {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + btoa(clientId + ":" + clientSecret),
      },
      body: "grant_type=client_credentials",
    });

    const data = await response.json();
    return data.access_token;
  };

  const fetchTrackDetails = async (trackId, accessToken) => {
    const response = await fetch(
      `https://api.spotify.com/v1/tracks/${trackId}`,
      {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      }
    );

    return await response.json();
  };

  const fetchAudioFeatures = async (trackId, accessToken) => {
    const response = await fetch(
      `https://api.spotify.com/v1/audio-features/${trackId}`,
      {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      }
    );

    return await response.json();
  };

  const formatKey = (key, mode) => {
    const keyNames = [
      "C",
      "C#",
      "D",
      "D#",
      "E",
      "F",
      "F#",
      "G",
      "G#",
      "A",
      "A#",
      "B",
    ];
    const keyName = keyNames[key];
    return mode === 0 ? `${keyName}m` : keyName;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-8 bg-white shadow-xl rounded-lg w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Song Key & BPM Finder
        </h1>
        <input
          type="text"
          value={songUrl}
          onChange={(e) => setSongUrl(e.target.value)}
          placeholder="Enter Spotify track URL"
          className="p-2 border rounded w-full mb-4 focus:outline-none focus:ring focus:border-blue-300"
        />
        <button
          onClick={getSongDetails}
          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded w-full transition duration-200"
        >
          Get Song Details
        </button>
        {songDetails && audioFeatures && (
          <div className="mt-6">
            <div className="song-details flex items-center space-x-4">
              <img
                src={songDetails.album.images[1].url}
                alt="Album artwork"
                className="w-24 h-24 rounded shadow"
              />
              <div>
                <strong className="block text-lg">{songDetails.name}</strong>
                <span className="text-gray-600">
                  by {songDetails.artists[0].name}
                </span>
              </div>
            </div>
            <div className="mt-6 space-y-2">
              <div className="text-gray-700">
                Key: {formatKey(audioFeatures.key, audioFeatures.mode)}
              </div>
              <div className="text-gray-700">
                BPM: {Math.round(audioFeatures.tempo)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SongFinder;
