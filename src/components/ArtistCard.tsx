import React from 'react';

interface ArtistCardProps {
    name: string;
    image: string;
    genres: string[];
}

const ArtistCard: React.FC<ArtistCardProps> = ({ name, image, genres }) => {
  return (
    <article className="artist">
      <div
        className="artist-cover"
        style={{
          backgroundImage: `url('${image || 'https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png'}')`
        }}
      />
      <p className="artist-name">{name}</p>
      {genres.length > 0 && (
              <div className="artist-genres">
                {genres.slice(0, 3).join(' · ').toLowerCase()}
              </div>
            )}
    </article>
  );
};

export default ArtistCard;
