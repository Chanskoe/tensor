import React from 'react';

interface AlbumCardProps {
    name: string;
    artist: string;
    image: string;
}

const AlbumCard: React.FC<AlbumCardProps> = ({ name, artist, image }) => {
    return (
        <div className="album-card" style={{backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent), url('${image || 'https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png'}')`}}>
            <div className="album">
                <div className="album-name">{name}</div>
                <div className="album-artist">{artist}</div>
            </div>
        </div>
    );
};

export default AlbumCard;