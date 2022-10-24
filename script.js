const heading = document.querySelector(".heading");
const artist = document.querySelector(".artist");

const timestamp = document.querySelector("#timestamp");
const img = document.querySelector(".artwork");

const audio = document.querySelector("audio");
const playPauseIcon = document.querySelector(".play-pause-icon");

const playPauseBtn = document.querySelector(".play-pause");
const previousBtn = document.querySelector(".previous");
const nextBtn = document.querySelector(".next");

const nextTrack = document.querySelector(".nextTrack");

const shuffleBtn = document.querySelector(".shuffle");
const repeatBtn = document.querySelector(".repeat");

const currentTimeEl = document.querySelector(".current-time");
const durationTimeEl = document.querySelector(".duration-time");

const app = {
    currentIndex: 0,
    isPlaying: false,
    isShuffle: false,
    isRepeat: false,
    tracks: [
        {
            id: 1,
            trackName: "Jack & Rose",
            trackArtist: "Kennedy",
            trackPath: "./assets/music/Kennedy - Jack and Rose.mp3",
            trackAlbumArt: "./assets/imgs/jack&rose.jpg",
        },
        {
            id: 2,
            trackName: "3 Types",
            trackArtist: "Kennedy",
            trackPath: "./assets/music/Kennedy - 3 Types.mp3",
            trackAlbumArt: "./assets/imgs/3types.jpg",
        },
        {
            id: 3,
            trackName: "Old Me",
            trackArtist: "5 Seconds of Summer",
            trackPath: "./assets/music/5 Seconds of Summer - Old Me.mp3",
            trackAlbumArt: "./assets/imgs/old-me.jpg",
        },
        {
            id: 4,
            trackName: "Sweet but Psycho (BEAUZ Remix)",
            trackArtist: "Ava Max",
            trackPath: "./assets/music/Ava Max - Sweet but Psycho (BEAUZ Remix).mp3",
            trackAlbumArt: "./assets/imgs/sweet-but-psycho-beauz-remix.jpg",
        },
        {
            id: 5,
            trackName: "I Won't",
            trackArtist: "AJR",
            trackPath: "./assets/music/I Won't - AJR.mp3",
            trackAlbumArt: "./assets/imgs/i-wont.jpg",
        },
        {
            id: 6,
            trackName: "World's Smallest Violin",
            trackArtist: "AJR",
            trackPath: "./assets/music/World's Smallest Violin - AJR.mp3",
            trackAlbumArt: "./assets/imgs/worlds-smallest-violin.jpg",
        },
    ],

    defineObjectProperties: function () {
        Object.defineProperty(this, "currentTrack", {
            get: function () {
                return this.tracks[this.currentIndex];
            },
        });
    },

    loadCurrentTrack: function () {
        heading.textContent = this.currentTrack.trackName;
        artist.textContent = this.currentTrack.trackArtist;
        audio.src = this.currentTrack.trackPath;
        img.src = this.currentTrack.trackAlbumArt;
    },

    updateIconToPause: function () {
        playPauseIcon.classList.add("fa-pause");
        playPauseIcon.classList.remove("fa-play");
    },

    updateIconToPlay: function () {
        playPauseIcon.classList.add("fa-play");
        playPauseIcon.classList.remove("fa-pause");
    },

    handleEvents: function () {
        const _this = this;
        const tracksLength = this.tracks.length;

        playPauseBtn.onclick = function () {
            if (_this.isPlaying) {
                _this.pauseTrack();
                _this.updateIconToPlay();
            } else {
                _this.playTrack();
                _this.updateIconToPause();
            }
        };

        previousBtn.onclick = function () {
            if (_this.currentIndex <= 0) {
                _this.currentIndex = tracksLength;
            }
            _this.currentIndex--;
            _this.loadCurrentTrack();
            _this.playTrack();
        };

        nextBtn.onclick = function () {
            if (!_this.isShuffle) {
                if (_this.currentIndex >= tracksLength - 1) {
                    _this.currentIndex = 0;
                } else _this.currentIndex++;
            } else _this.currentIndex = _this.getRandomIndex();
            if (_this.isRepeat) {
                audio.loop = true;
            } else {
                audio.loop = false;
                _this.loadCurrentTrack();
                _this.playTrack(); 
                _this.updateNextTrack();
            }
        };

        shuffleBtn.onclick = function () {
            _this.isShuffle = !_this.isShuffle;
            shuffleBtn.classList.toggle("active", _this.isShuffle);
            if (_this.isShuffle) {
                const randomIndex = _this.getRandomIndex();
                if (audio.ended) {
                    _this.currentIndex = randomIndex;
                    _this.loadCurrentTrack();
                }
            }
        },
        
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat;
            if (_this.isRepeat) {
                audio.loop = true;
            } else audio.loop = false;
            repeatBtn.classList.toggle("active", _this.isRepeat);
        },

        audio.ontimeupdate = function () {
            if (audio.duration) {
                _this.changeTimestampForInputRange(
                    Math.floor((audio.currentTime / audio.duration) * 100)
                );
            }
            currentTimeEl.textContent = _this.formatTimestamp(audio.currentTime);
            if (audio.ended) {
                if (_this.currentIndex >= tracksLength - 1) {
                    _this.currentIndex = 0;
                }
                if (_this.isShuffle) {
                    _this.currentIndex = _this.getRandomIndex();
                } else {
                    _this.currentIndex++;
                }
                if (_this.isRepeat) {
                    audio.loop = true;
                } else {
                    audio.loop = false;
                    _this.loadCurrentTrack();
                    _this.playTrack();
                    _this.updateNextTrack();
                }
            }
        };

        audio.onloadedmetadata = function () {
            _this.getTrackDurationAndRenderToView(audio.duration);
        };

        audio.onplaying = function () {
            if (_this.isPlaying) {
                _this.updateIconToPause();
            } else {
                _this.updateIconToPlay();
            }
        };

        timestamp.oninput = function () {
            audio.currentTime = timestamp.value * audio.duration / 100;
        };
    },

    playTrack: function () {
        this.isPlaying = true;
        audio.play();
    },

    pauseTrack: function () {
        this.isPlaying = false;
        audio.pause();
    },

    changeTimestampForInputRange: function (currentTimestamp) {
        timestamp.value = currentTimestamp;
    },

    getTrackDurationAndRenderToView: function (trackDuration) {
        durationTimeEl.textContent = this.formatTimestamp(trackDuration);
    },

    formatTimestamp: function (mTimestamp) {
        const mTimestampFloored = Math.floor(mTimestamp);
        const minutes = Math.floor(mTimestampFloored / 60);
        const seconds = mTimestampFloored - minutes * 60;
        return seconds < 10
            ? `${minutes}:0${seconds}`
            : `${minutes}:${seconds}`;
    },

    updateNextTrack: function () {
        let currentTrack;
        currentTrack = this.tracks[this.currentIndex + 1];
        if (this.currentIndex >= this.tracks.length - 1) {
            currentTrack = this.tracks[0];
        }
        nextTrack.textContent = `Next track: ${currentTrack.trackName} by ${currentTrack.trackArtist}`;
    },

    getRandomIndex: function () {
        return Math.floor(Math.random() * this.tracks.length);
    },

    playShuffleTrack: function () {
        if (this.isShuffle) {
            this.currentIndex = this.getRandomIndex();
            this.loadCurrentTrack();
            this.playTrack();
            this.updateNextTrack();
        }
    },

    start: function () {
        this.defineObjectProperties();
        this.loadCurrentTrack();
        this.updateNextTrack();
        this.handleEvents();
        this.getTrackDurationAndRenderToView();
    },
};

app.start();
