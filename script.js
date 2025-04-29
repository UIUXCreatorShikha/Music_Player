const songs = [
    { name: "Song One", src: "songs/song1.mp3", category: "pop" },
    { name: "Song Two", src: "songs/song2.mp3", category: "rock" },
    { name: "Song Three", src: "songs/song3.mp3", category: "lofi" },
    { name: "Song Four", src: "songs/song4.mp3", category: "pop" },
  ];
  
  const audio = document.getElementById('audio');
  const playlist = document.getElementById('playlist');
  const playBtn = document.getElementById('play');
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');
  const shuffleBtn = document.getElementById('shuffle');
  const repeatBtn = document.getElementById('repeat');
  const volumeSlider = document.getElementById('volume');
  const searchInput = document.getElementById('search');
  const categorySelect = document.getElementById('category');
  const songTitle = document.getElementById('song-title');
  const progress = document.getElementById('progress');
  const currentTimeEl = document.getElementById('current-time');
  const durationEl = document.getElementById('duration');
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  
  let currentSongIndex = 0;
  let isShuffle = false;
  let isRepeat = false;
  
  // Load playlist
  function loadPlaylist(filter = '') {
    playlist.innerHTML = '';
    let filteredSongs = songs.filter(song => 
      (song.name.toLowerCase().includes(filter.toLowerCase()) || filter === '') &&
      (categorySelect.value === 'all' || song.category === categorySelect.value)
    );
  
    filteredSongs.forEach((song, index) => {
      const li = document.createElement('li');
      li.textContent = song.name;
      li.dataset.index = songs.indexOf(song);
      li.addEventListener('click', () => {
        currentSongIndex = parseInt(li.dataset.index);
        playSong();
      });
      playlist.appendChild(li);
    });
  
    highlightCurrent();
  }
  
  // Highlight active song
  function highlightCurrent() {
    const items = playlist.querySelectorAll('li');
    items.forEach(item => item.classList.remove('active'));
    const currentItem = [...items].find(item => parseInt(item.dataset.index) === currentSongIndex);
    if (currentItem) currentItem.classList.add('active');
  }
  
  // Play selected song
  function playSong() {
    audio.src = songs[currentSongIndex].src;
    audio.play();
    songTitle.textContent = songs[currentSongIndex].name;
    playBtn.textContent = '⏸️';
    highlightCurrent();
  }
  
  // Play/Pause
  playBtn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play();
      playBtn.textContent = '⏸️';
    } else {
      audio.pause();
      playBtn.textContent = '▶️';
    }
  });
  
  // Previous Song
  prevBtn.addEventListener('click', () => {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    playSong();
  });
  
  // Next Song
  nextBtn.addEventListener('click', () => {
    if (isShuffle) {
      currentSongIndex = Math.floor(Math.random() * songs.length);
    } else {
      currentSongIndex = (currentSongIndex + 1) % songs.length;
    }
    playSong();
  });
  
  // Volume Control
  volumeSlider.addEventListener('input', () => {
    audio.volume = volumeSlider.value;
  });
  
  // Search
  searchInput.addEventListener('input', () => {
    loadPlaylist(searchInput.value);
  });
  
  // Category Filter
  categorySelect.addEventListener('change', () => {
    loadPlaylist(searchInput.value);
  });
  
  // Shuffle
  shuffleBtn.addEventListener('click', () => {
    isShuffle = !isShuffle;
    shuffleBtn.style.color = isShuffle ? '#2ebf91' : '';
  });
  
  // Repeat
  repeatBtn.addEventListener('click', () => {
    isRepeat = !isRepeat;
    repeatBtn.style.color = isRepeat ? '#2ebf91' : '';
  });
  
  // Auto next song
  audio.addEventListener('ended', () => {
    if (isRepeat) {
      playSong();
    } else {
      nextBtn.click();
    }
  });
  
  // Progress Bar
  audio.addEventListener('timeupdate', () => {
    progress.max = audio.duration;
    progress.value = audio.currentTime;
    updateTimeDisplay();
  });
  
  progress.addEventListener('input', () => {
    audio.currentTime = progress.value;
  });
  
  // Update Time Display
  function updateTimeDisplay() {
    currentTimeEl.textContent = formatTime(audio.currentTime);
    durationEl.textContent = formatTime(audio.duration);
  }
  
  function formatTime(time) {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }
  
  // Dark Mode
  darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
  });
  
  // Initial load
  loadPlaylist();
  volumeSlider.value = 0.5;
  audio.volume = 0.5;
  