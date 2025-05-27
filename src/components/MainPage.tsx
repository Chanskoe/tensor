import React, { useState, useEffect } from 'react';
import ArtistCard from './ArtistCard';
import TrackCard from './TrackCard';

const API_KEY = '7bbb605ff85189f87f99e14724473ecf';
const LIMIT1 = 12;
const LIMIT2 = 18;

interface Artist {
    name: string;
    image: string;
    genres: string[];
}

interface Track {
    name: string;
    artist: string;
    image: string;
    genres: string[];
}

interface Image {
    size: string;
    '#text': string;
}

interface Tag {
    name: string;
}

interface ArtistInfo {
    artist: any;
    tags?: {
    tag?: Tag[];
    };
}

interface TrackInfo {
    track?: {
    album?: {
      image?: Image[];
    };
    artist?: {
      name?: string;
      tags?: {
        tag?: Tag[];
      };
    };
    };
}

const MainPage: React.FC = () => {
    const [artists, setArtists] = useState<Artist[]>([]);
    const [tracks, setTracks] = useState<Track[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
          try {
            setLoading(true);
            const [artistsData, tracksData] = await Promise.all([
              getTopArtists(),
              getTopTracks()
            ]);
            setArtists(artistsData);
            setTracks(tracksData);
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
          } finally {
            setLoading(false);
          }
    };

    fetchData();
  }, []);

  async function getTopArtists(): Promise<Artist[]> {
    try {
      const response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=${API_KEY}&limit=${LIMIT1}&format=json`);
      const data = await response.json();

      if (data.error) {
        throw new Error(data.message);
      }

      const artistsDetails = await Promise.all(
        data.artists.artist.slice(0, LIMIT1).map(async (artist: any) => {
          try {
            const infoResponse = await fetch(`https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${encodeURIComponent(artist.name)}&api_key=${API_KEY}&format=json`);
            const infoData: ArtistInfo = await infoResponse.json();

            return {
              name: artist.name,
              image: artist.image.find((img: Image) => img.size === 'large')?.['#text'] ||
                    artist.image.find((img: Image) => img.size === 'medium')?.['#text'] || '',
              genres: infoData.artist.tags?.tag?.map((tag: Tag) => tag.name) || []
            };
          } catch (error) {
            console.error(`Error fetching details for artist ${artist.name}:`, error);
            return {
              name: artist.name,
              image: '',
              genres: []
            };
          }
        })
      );

      return artistsDetails;
    } catch (error) {
      console.error('Error fetching top artists:', error);
      throw error;
    }
  }

  async function getTopTracks(): Promise<Track[]> {
    try {
      const response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=${API_KEY}&limit=${LIMIT2}&format=json`);
      const data = await response.json();

      if (data.error) {
        throw new Error(data.message);
      }

      const tracksDetails = await Promise.all(
        data.tracks.track.slice(0, LIMIT2).map(async (track: any) => {
          try {
            const trackInfoResponse = await fetch(`https://ws.audioscrobbler.com/2.0/?method=track.getInfo&artist=${encodeURIComponent(track.artist.name)}&track=${encodeURIComponent(track.name)}&api_key=${API_KEY}&format=json`);
            const trackInfo: TrackInfo = await trackInfoResponse.json();

            let genres: string[] = [];
            if (trackInfo.track?.artist?.tags?.tag) {
                genres = trackInfo.track.artist.tags.tag.map((tag: Tag) => tag.name);
            } else {
                const artistInfoResponse = await fetch(`https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${encodeURIComponent(track.artist.name)}&api_key=${API_KEY}&format=json`);
                const artistInfo: ArtistInfo = await artistInfoResponse.json();
                genres = artistInfo.artist?.tags?.tag?.map((tag: Tag) => tag.name) || [];
            }

            const trackImage = trackInfo.track?.album?.image?.find((img: Image) => img.size === 'large')?.['#text'] ||
                             track.image?.find((img: Image) => img.size === 'large')?.['#text'] ||
                             track.image?.find((img: Image) => img.size === 'medium')?.['#text'] || '';

            return {
              name: track.name,
              artist: track.artist.name,
              image: trackImage,
              genres: genres
            };
          } catch (error) {
            console.error(`Error fetching details for track ${track.name}:`, error);
            return {
              name: track.name,
              artist: track.artist.name,
              image: track.image?.find((img: Image) => img.size === 'large')?.['#text'] ||
                    track.image?.find((img: Image) => img.size === 'medium')?.['#text'] || '',
              genres: []
            };
          }
        })
      );

      return tracksDetails;
    } catch (error) {
      console.error('Error fetching top tracks:', error);
      throw error;
    }
  }

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }


    return (<>
        <h1>Music</h1>

        <section className="sect-hot-tracks">
            <h4 className="info">Hot right now</h4>
            <div className="line"></div>
            <div className="hot-artists">
                {artists.map((artist, index) => (
                    <ArtistCard
                        key={`artist-${index}`}
                        name={artist.name}
                        image={artist.image}
                        genres={artist.genres}
                    />
                ))}
            </div>
        </section>

        <section className="sect-popular-tracks">
            <h4 className="info">Popular tracks</h4>
            <div className="line"></div>
            <div className="popular-tracks">
                {tracks.map((track, index) => (
                    <TrackCard
                        key={`track-${index}`}
                        name={track.name}
                        artist={track.artist}
                        image={track.image}
                        genres={track.genres}
                        />
                 ))}
            </div>
        </section>
    </>
  );
};

export default MainPage;