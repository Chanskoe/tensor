import React from 'react';

interface TrackCardProps {
    name: string;
    artist: string;
    image: string;
    genres: string[];
}

const TrackCard: React.FC<TrackCardProps> = ({ name, artist, image, genres }) => {
  return (
    <article className="song">
      <div
        className="song-cover"
        style={{
          backgroundImage: `url('${image || 'images/no-cover.png'}')`
        }}
      />
      <div className="column">
        <div className="song-title">{name}</div>
        <div className="song-artist">{artist}</div>
        {genres.length > 0 && (
          <div className="song-genres">
            {genres.slice(0, 3).join(' · ').toLowerCase()}
          </div>
        )}
      </div>
    </article>
  );
};

export default TrackCard;
