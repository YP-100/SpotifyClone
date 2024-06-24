const songDurationDisplay = document.querySelector(".sondur");
let sname = [];
let processedSname = [];
let currAudio = null;
const plbtn = document.getElementById("playbtn");
const pbtnimg = document.getElementById("pbtnimg");
const songNameDisplay = document.querySelector(".soname");
let currefolder;
let asongs;

function makecont(song) {
    let liconhtm = `
    <div class="limcon">
        <div class="sbanner"><img src="svg/music.svg" alt=""></div>
        <div class="songname">${song}</div>
        <div class="sbanner">
            <button class="play-button">
                <img src="svg/play.svg" alt="">
            </button>
        </div>
    </div>`;
    let hl = document.getElementById("licon");
    hl.innerHTML += liconhtm;
}

async function getSongs(gfolder) {
    currefolder = gfolder;
    try {
        let songs = await fetch(`http://127.0.0.1:5501/songs/${currefolder}`);
        let res = await songs.text();

        let div = document.createElement("div");
        div.innerHTML = res;
        let as = div.getElementsByClassName("name");

        let result = [];
        for (let index = 0; index < as.length; index++) {
            let snameih = as[index];
            if (snameih.innerHTML != "..") {
                result.push(snameih.innerHTML);
            }
        }
        return result;
    } catch (error) {
        console.error('Error fetching songs:', error);
        return [];
    }
}

plbtn.addEventListener("click", () => {
    if (currAudio.paused) {
        currAudio.play();
        pbtnimg.src = "/svg/pause.svg";
    } else {
        currAudio.pause();
        pbtnimg.src = "/svg/play.svg";
    }
});

const playMusic = (mp3) => {
    if (currAudio) {
        currAudio.pause(); // Stop the current audio
        currAudio.currentTime = 0; // Reset the current audio
    }
    currAudio = new Audio(mp3);
    let url = mp3;

    // Define the prefix to remove
    let prefix =   `http://127.0.0.1:5501/songs/${currefolder}/` ;

    // Get the remaining part of the string after the prefix
    let remainingPart = url.substring(prefix.length);

    let songname = remainingPart.slice(0, -4)
        .replace(/_/g, ' ') // Replace underscores with blank spaces
        .replace(/\d/g, '') // Remove all digits
        .replace(/Full|Video|Songs|Song|Blockbuster/g, '') // Remove specific words
        .split("-")[0] // Remove everything after and including "-"
        .replace(/\(.*?\)|\[.*?\]/g, ''); // Remove everything inside brackets along with the brackets

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

        let circlee = document.getElementById("circle");
        circlee.style.left = (currAudio.currentTime / currAudio.duration) * 100 + "%";
    });


    currAudio.play();
    pbtnimg.src = "/svg/pause.svg";
    songNameDisplay.innerText = songname;
};

async function main() {
    try {
        sname = await getSongs("hindi90s");
        Array.from(document.getElementsByClassName("pcardcontainer")).forEach(elem => {
            elem.addEventListener("click", async event => {
                asongs = event.currentTarget.dataset.folder;
                // console.log(asongs);
                sname = await getSongs(asongs);
                // console.log('Fetched sname array:', sname);
        
                // Process the fetched song names
                processedSname = sname.map(name =>
                    name.slice(0, -4)       // Remove the last 4 characters
                        .replace(/_/g, ' ') // Replace underscores with blank spaces
                        .replace(/\d/g, '') // Remove all digits
                        .replace(/Full|Video|Songs|Song|Blockbuster/g, '') // Remove specific words
                        .split("-")[0]      // Remove everything after and including "-"
                        .replace(/\(.*?\)|\[.*?\]/g, '') // Remove everything inside brackets along with the brackets
                );
                // console.log('Processed sname array:', processedSname);
        
                // Clear existing song list
                let hl = document.getElementById("licon");
                hl.innerHTML = '';
        
                // Display the songs
                for (let index = 0; index < processedSname.length; index++) {
                    const element = processedSname[index];
                    makecont(element);
                }
        
                // Add event listeners to the new song elements
                Array.from(document.getElementById("licon").querySelectorAll(".limcon")).forEach(element => {
                    // console.log(element)
                    element.addEventListener("click", event => {
                        let songName = event.target.innerHTML;
                // console.log(songName)
                let originalName = sname.find(name =>
                    name.slice(0, -4)       // Remove the last 4 characters
                        .replace(/_/g, ' ') // Replace underscores with blank spaces
                        .replace(/\d/g, '') // Remove all digits
                        .replace(/Full|Video|Songs|Song|Blockbuster/g, '') // Remove specific words
                        .split("-")[0]      // Remove everything after and including "-"
                        .replace(/\(.*?\)|\[.*?\]/g, '') // Remove everything inside brackets along with the brackets
                    === songName
                );
                if (originalName) {
                    playMusic(`http://127.0.0.1:5501/songs/${currefolder}/${originalName}`);
                }
                    });
                });
            });
        });
        








        // console.log('Fetched sname array:', sname);

        // Slice the last 4 letters, replace underscores with blank spaces, and remove digits
        processedSname = sname.map(name =>
            name.slice(0, -4)       // Remove the last 4 characters
                .replace(/_/g, ' ') // Replace underscores with blank spaces
                .replace(/\d/g, '') // Remove all digits
                .replace(/Full|Video|Songs|Song|Blockbuster/g, '') // Remove specific words
                .split("-")[0]      // Remove everything after and including "-"
                .replace(/\(.*?\)|\[.*?\]/g, '') // Remove everything inside brackets along with the brackets
        );
        // console.log('Processed sname array:', processedSname);

        for (let index = 0; index < processedSname.length; index++) {
            const element = processedSname[index];
            makecont(element);
        }

        Array.from(document.getElementById("licon").querySelectorAll(".limcon")).forEach(element => {
            // console.log(element)
            element.addEventListener("click", event => {
                let songName = event.target.innerHTML;
                // console.log(songName)
                let originalName = sname.find(name =>
                    name.slice(0, -4)       // Remove the last 4 characters
                        .replace(/_/g, ' ') // Replace underscores with blank spaces
                        .replace(/\d/g, '') // Remove all digits
                        .replace(/Full|Video|Songs|Song|Blockbuster/g, '') // Remove specific words
                        .split("-")[0]      // Remove everything after and including "-"
                        .replace(/\(.*?\)|\[.*?\]/g, '') // Remove everything inside brackets along with the brackets
                    === songName
                );
                if (originalName) {
                    playMusic(`http://127.0.0.1:5501/songs/${currefolder}/${originalName}`);
                }
            });
        });

        document.querySelector(".seekbar").addEventListener("click", event => {
            // console.log((event.offsetX / event.target.getBoundingClientRect().width) * 100);
            let seekper = (event.offsetX / event.target.getBoundingClientRect().width);
            document.getElementById("circle").style.left = seekper * 100 +"%"
            currAudio.currentTime = currAudio.duration * seekper;
    })

    document.getElementById("prevbtn").addEventListener("click",eve=>{
        // console.log("prev button was clicked");
        let url = currAudio.src;
        // console.log(currAudio)

    // Define the prefix to remove
    let prefix =   `http://127.0.0.1:5501/songs/${currefolder}/`;

    // Get the remaining part of the string after the prefix
    let remainingPart = url.substring(prefix.length);
    // console.log(remainingPart);
    // console.log(sname);
    let indexof = sname.indexOf(remainingPart)
    // console.log(indexof);

    if (indexof != 0) {
        // playMusic(currAudio[indexof]+1);
        playMusic(`http://127.0.0.1:5501/songs/${currefolder}/${sname[indexof - 1]}`);
    }
    })

    document.getElementById("nextbtn").addEventListener("click",eve=>{
        // console.log("next button was clicked");
        let url = currAudio.src;
        // console.log(currAudio)

    // Define the prefix to remove
    let prefix = `http://127.0.0.1:5501/songs/${currefolder}/`;

    // Get the remaining part of the string after the prefix
    let remainingPart = url.substring(prefix.length);
    // console.log(remainingPart);
    // console.log(sname);
    let indexof = sname.indexOf(remainingPart)
    // console.log(indexof);

    if (indexof < sname.length-1) {
        // playMusic(currAudio[indexof]+1);
        playMusic(`http://127.0.0.1:5501/songs/${currefolder}/${sname[indexof + 1]}`);
    }
    })

    document.getElementById("threelines").addEventListener("click" , ()=>{
        document.getElementById("left").style.right = -30 + "%";
    })
    document.getElementById("crossimg").addEventListener("click" , ()=>{
        document.getElementById("left").style.right = 200 +"%";
        // document.getElementById("left").style.overflow = "hidden";
    })



    
    
    
} catch (error) {
    console.error('Error fetching songs:', error);
}
}



main();
