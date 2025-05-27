import React, { useState } from 'react';
import ArtistCard from './ArtistCard';
import TrackCard from './TrackCard';
import AlbumCard from './AlbumCard';

const API_KEY = '7bbb605ff85189f87f99e14724473ecf';
const LIMIT1 = 8;
const LIMIT2 = 10;

interface SearchResult {
    artists: Artist[];
    albums: Album[];
    tracks: Track[];
}

interface Artist {
    name: string;
    image: string;
    genres: string[];
}

interface Album {
    name: string;
    artist: string;
    image: string;
}

interface Track {
    name: string;
    artist: string;
    image: string;
    genres: string[];
}

const SearchPage: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult>({ artists: [], albums: [], tracks: [] });
    const [loading, setLoading] = useState(false);

    const genres: string[] = [];

    const handleSearch = async () => {
        if (!query.trim()) return;

        setLoading(true);
        try {
            const artistsRes = await fetch(`https://ws.audioscrobbler.com/2.0/?method=artist.search&artist=${encodeURIComponent(query)}&api_key=${API_KEY}&format=json&limit=${LIMIT1}`);
            const artistsData = await artistsRes.json();

            const albumsRes = await fetch(`https://ws.audioscrobbler.com/2.0/?method=album.search&album=${encodeURIComponent(query)}&api_key=${API_KEY}&format=json&limit=${LIMIT1}`);
            const albumsData = await albumsRes.json();

            const tracksRes = await fetch(`https://ws.audioscrobbler.com/2.0/?method=track.search&track=${encodeURIComponent(query)}&api_key=${API_KEY}&format=json&limit=${LIMIT2}`);
            const tracksData = await tracksRes.json();

            setResults({
                artists: artistsData.results?.artistmatches?.artist?.map((a: any) => ({
                    name: a.name,
                    image: a.image?.find((i: any) => i.size === 'large')?.['#text'] || '',
                })) || [],

                albums: albumsData.results?.albummatches?.album?.map((a: any) => ({
                    name: a.name,
                    artist: a.artist,
                    image: a.image?.find((i: any) => i.size === 'large')?.['#text'] || ''
                })) || [],

                tracks: tracksData.results?.trackmatches?.track?.map((t: any) => ({
                    name: t.name,
                    artist: t.artist,
                    image: t.image?.find((i: any) => i.size === 'large')?.['#text'] || '',
                })) || []
            });
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="search-page">

        {query ? <h3 className="search-info">Search results for "{query}"</h3> : <h3 className="search-info">Search</h3>}

        <p className="top-results">Top Results</p>

        <div className="line-search"></div>

        <div className="searching">
            <input
              className="in-put"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search artists, albums, tracks..."
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />

            <button className="close-search" onClick={onClose}>×</button>

            <span className="line-in-put"></span>

            <button className="do-search" onClick={handleSearch}></button>
        </div>

        {loading && <div className="loading">Loading...</div>}

        {!loading && (
            <>
              <div className="search-section">
                <h3 className="info-founded">Artists</h3>
                <div className="artists-grid">
                  {results.artists.slice(0, LIMIT1).map((artist, index) => (
                    <ArtistCard
                      key={`artist-${index}`}
                      name={artist.name}
                      image={artist.image}
                      genres={genres}
                    />
                  ))}
                </div>
              </div>

              <div className="search-section">
                <h3 className="info-founded">Albums</h3>
                <div className="albums-grid">
                  {results.albums.slice(0, LIMIT1).map((album, index) => (
                    <AlbumCard
                      key={`album-${index}`}
                      name={album.name}
                      artist={album.artist}
                      image={album.image}
                    />
                  ))}
                </div>
              </div>

              <div className="search-section">
                <h3 className="info-founded">Tracks</h3>
                <div className="tracks-list">
                  {results.tracks.slice(0, LIMIT2).map((track, index) => (
                    <TrackCard
                      key={`track-${index}`}
                      name={track.name}
                      artist={track.artist}
                      image={track.image}
                      genres={genres}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
    );
    };

export default SearchPage;