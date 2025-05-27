const API_KEY = '7bbb605ff85189f87f99e14724473ecf';
const LIMIT1 = 12;
const LIMIT2 = 18;

async function getTopArtists() {
    try {
        const response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=${API_KEY}&limit=${LIMIT1}&format=json`);
        const data = await response.json();

        if (data.error) {
            throw new Error(data.message);
        }

        const artistsDetails = await Promise.all(
            data.artists.artist.slice(0, LIMIT1).map(async artist => {
                try {
                    const infoResponse = await fetch(`https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${encodeURIComponent(artist.name)}&api_key=${API_KEY}&format=json`);
                    const infoData = await infoResponse.json();

                    return {
                        name: artist.name,
                        image: artist.image.find(img => img.size === 'large')?.['#text'] || artist.image.find(img => img.size === 'medium')?.['#text'] || '',
                        genres: infoData.artist?.tags?.tag?.map(tag => tag.name) || []
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
        document.getElementById('top-artists').innerHTML = `<div class="error">Error loading artists: ${error.message}</div>`;
        return [];
    }
    }

function displayTopArtists(artists) {
    const artistsList = document.getElementById('top-artists');
    artistsList.innerHTML = '';

    artists.forEach(artist => {
        const genres = artist.genres.slice(0, 3).join(' · ').toLowerCase();
        const article = document.createElement('article');
        article.className = 'artist';

        article.innerHTML = `
            <div class="artist-cover" style="background-image: url('${artist.image || 'https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png'}')"></div>
            <p class="artist-name">${artist.name}</p>
            <span class="artist-genres">${genres || ''}</span>
        `;

        artistsList.appendChild(article);
    });
    }



async function getTopTracks() {
    try {
        const response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=${API_KEY}&limit=${LIMIT2}&format=json`);
        const data = await response.json();

        if (data.error) {
            throw new Error(data.message);
        }

        const tracksDetails = await Promise.all(
            data.tracks.track.slice(0, LIMIT2).map(async track => {
                try {
                    const infoResponse = await fetch(`https://ws.audioscrobbler.com/2.0/?method=track.getInfo&artist=${encodeURIComponent(track.artist.name)}&track=${encodeURIComponent(track.name)}&api_key=${API_KEY}&format=json`);
                    const infoData = await infoResponse.json();

                    const trackImage = infoData.track?.album?.image?.find(img => img.size === 'large')?.['#text'] ||
                                     track.image?.find(img => img.size === 'large')?.['#text'] ||
                                     track.image?.find(img => img.size === 'medium')?.['#text'] || '';

                    return {
                        name: track.name,
                        artist: track.artist.name,
                        image: trackImage,
                        genres: infoData.artist?.tags?.tag?.map(tag => tag.name) || []
                    };
                } catch (error) {
                    console.error(`Error fetching details for track ${track.name}:`, error);
                    return {
                        name: track.name,
                        artist: track.artist.name,
                        image: track.image?.find(img => img.size === 'large')?.['#text'] ||
                              track.image?.find(img => img.size === 'medium')?.['#text'] || '',
                        genres: []
                    };
                }
            })
        );

        return tracksDetails;

    } catch (error) {
        console.error('Error fetching top tracks:', error);
        document.getElementById('top-tracks').innerHTML = `<div class="error">Error loading tracks: ${error.message}</li>`;
        return [];
    }
    }

function displayTopTracks(tracks) {
    const tracksList = document.getElementById('top-tracks');
    tracksList.innerHTML = '';

    tracks.forEach(track => {
        const article = document.createElement('article');
        article.className = 'song';

        article.innerHTML = `
            <div class="song-cover" style="background-image: url('${track.image || 'images/no-cover.png'}')"></div>
            <div class="column">
                <div class="song-title">${track.name}</div>
                <div class="song-artist">${track.artist}</div>
                ${track.genres.length > 0 ? `
                <div class="song-genres">
                    ${track.genres.slice(0, 3).join(' · ').toLowerCase()}
                </div>
                ` : ''}
            </div>
        `;

        tracksList.appendChild(article);
    });
}

async function loadData() {
    try {
        const [artists, tracks] = await Promise.all([
            getTopArtists(),
            getTopTracks()
        ]);

        if (artists.length > 0) {
            displayTopArtists(artists);
        }

        if (tracks.length > 0) {
            displayTopTracks(tracks);
        }
    } catch (error) {
        console.error('Error in loadData:', error);
    }
}


document.addEventListener('DOMContentLoaded', loadData);