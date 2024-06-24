const songDurationDisplay = document.querySelector(".sondur");
const songNameDisplay = document.querySelector(".soname");
const plbtn = document.getElementById("playbtn");
const pbtnimg = document.getElementById("pbtnimg");

let currAudio = null;
let currentFolder = ''; // Variable to store the current folder

// Function to create the list item for each song
function makeSongListItem(song) {
    return `
        <li class="song-item">
            <div class="songname">${song}</div>
            <button class="play-button" data-song="${song}">Play</button>
        </li>
    `;
}

// Function to fetch songs from a folder
async function fetchSongsFromFolder(folder) {
    try {
        const response = await fetch(`https://raw.githubusercontent.com/YP-100/SpotifyClone/main/songs/${folder}/`);
        if (!response.ok) {
            throw new Error('Failed to fetch songs');
        }
        const html = await response.text();

        // Create a temporary element to parse the response HTML
        const tempElement = document.createElement('div');
        tempElement.innerHTML = html;

        // Extract song names from the fetched HTML
        const songElements = tempElement.querySelectorAll('.name');
        const songs = Array.from(songElements).map(songElement => songElement.textContent.trim());

        return songs;
    } catch (error) {
        console.error('Error fetching songs:', error);
        return [];
    }
}

// Function to play a specific song
async function playSong(folder, song) {
    try {
        const response = await fetch(`https://raw.githubusercontent.com/YP-100/SpotifyClone/main/songs/${folder}/${song}`);
        if (!response.ok) {
            throw new Error('Failed to fetch song');
        }
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        if (currAudio) {
            currAudio.pause();
            currAudio.currentTime = 0;
        }

        currAudio = new Audio();
        currAudio.src = url;

        currAudio.addEventListener('loadedmetadata', () => {
            let totalMinutes = Math.floor(currAudio.duration / 60);
            let totalSeconds = Math.floor(currAudio.duration % 60);
            let totalDuration = `${totalMinutes}:${totalSeconds.toString().padStart(2, '0')}`;
            songDurationDisplay.innerText = `00:00 / ${totalDuration}`;
        });

        currAudio.addEventListener('timeupdate', () => {
            let currentMinutes = Math.floor(currAudio.currentTime / 60);
            let currentSeconds = Math.floor(currAudio.currentTime % 60);
            let currentTime = `${currentMinutes}:${currentSeconds.toString().padStart(2, '0')}`;
            let totalMinutes = Math.floor(currAudio.duration / 60);
            let totalSeconds = Math.floor(currAudio.duration % 60);
            let totalDuration = `${totalMinutes}:${totalSeconds.toString().padStart(2, '0')}`;

            songDurationDisplay.innerText = `${currentTime} / ${totalDuration}`;

            let progress = (currAudio.currentTime / currAudio.duration) * 100;
            let circle = document.getElementById("circle");
            circle.style.left = `${progress}%`;
        });

        currAudio.play();
        pbtnimg.src = "/svg/pause.svg";
        songNameDisplay.innerText = song;

    } catch (error) {
        console.error('Error playing song:', error);
    }
}

// Event listener for the play button
plbtn.addEventListener("click", () => {
    if (currAudio && !currAudio.paused) {
        currAudio.pause();
        pbtnimg.src = "/svg/play.svg";
    } else if (currAudio) {
        currAudio.play();
        pbtnimg.src = "/svg/pause.svg";
    }
});

// Function to initialize the application
async function initialize() {
    try {
        // Fetch initial set of songs (e.g., from folder "hindi90s")
        const initialSongs = await fetchSongsFromFolder('hindi90s');

        // Render the initial song list
        renderSongList(initialSongs);

        // Add event listener to song list items for playing songs
        document.querySelectorAll('.play-button').forEach(button => {
            button.addEventListener('click', async () => {
                const song = button.dataset.song;
                await playSong(currentFolder, song);
            });
        });
    } catch (error) {
        console.error('Initialization error:', error);
    }
}

// Function to render the list of songs
function renderSongList(songs) {
    const songList = document.getElementById('song-list');
    songList.innerHTML = songs.map(song => makeSongListItem(song)).join('');
}

// Call initialize function to start the application
initialize();
