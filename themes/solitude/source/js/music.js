class MusicPlayer {
    constructor() {
        this.init();
        this.volumeStep = 0.05; // 音量调节步长
        this.lastVolume = 1; // 记录上次音量
    }

    init() {
        document.documentElement.style.setProperty('--vh', `${window.innerHeight}px`);
        this.getCustomPlayList();
        this.addEventListeners();
        this.initVolumeControl();
    }

    getCustomPlayList() {
        this.changeMusicBg(false);
    }

    addEventListeners() {
        document.addEventListener("keydown", this.handleKeydown.bind(this));
        const aplayerList = document.querySelector(".aplayer-list");
        const aplayerLrc = document.querySelector(".aplayer-lrc");
        if (aplayerLrc && !aplayerLrc.dataset.clickBound) {
            aplayerLrc.addEventListener("click", () => {
                aplayerList.classList.toggle("aplayer-list-hide");
            });
            aplayerLrc.dataset.clickBound = true;
        }
    }

    // 初始化音量控制
    initVolumeControl() {
        // 等待播放器加载完成
        const checkAplayer = setInterval(() => {
            const aplayer = document.querySelector('meting-js').aplayer;
            if (aplayer) {
                clearInterval(checkAplayer);
                this.setupVolumeControl(aplayer);
            }
        }, 100);
    }

    // 设置音量控制
    setupVolumeControl(aplayer) {
        // 添加音量控制事件监听
        this.addVolumeControlListeners(aplayer);
        
        // 添加音量显示功能
        this.addVolumeDisplay(aplayer);
        
        // 恢复上次音量设置
        this.restoreVolume(aplayer);
    }

    // 添加音量控制监听器
    addVolumeControlListeners(aplayer) {
        // 音量按钮点击事件
        const volumeDownBtn = aplayer.querySelector('.aplayer-icon-volume-down');
        const volumeUpBtn = aplayer.querySelector('.aplayer-icon-volume-up');
        
        if (volumeDownBtn) {
            volumeDownBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.adjustVolume(aplayer, -this.volumeStep);
            });
        }
        
        if (volumeUpBtn) {
            volumeUpBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.adjustVolume(aplayer, this.volumeStep);
            });
        }

        // 音量滑块事件
        const volumeBar = aplayer.querySelector('.aplayer-volume-bar');
        if (volumeBar) {
            volumeBar.addEventListener('click', (e) => {
                const rect = volumeBar.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const percentage = clickX / rect.width;
                this.setVolume(aplayer, percentage);
            });
        }

        // 静音功能
        const volumeIcon = aplayer.querySelector('.aplayer-icon-volume-down');
        if (volumeIcon) {
            volumeIcon.addEventListener('dblclick', (e) => {
                e.preventDefault();
                this.toggleMute(aplayer);
            });
        }
    }

    // 调整音量
    adjustVolume(aplayer, delta) {
        const currentVolume = aplayer.volume || 1;
        const newVolume = Math.max(0, Math.min(1, currentVolume + delta));
        this.setVolume(aplayer, newVolume);
    }

    // 设置音量
    setVolume(aplayer, volume) {
        volume = Math.max(0, Math.min(1, volume));
        aplayer.volume(volume);
        this.lastVolume = volume;
        this.updateVolumeDisplay(aplayer, volume);
        this.saveVolume(volume);
    }

    // 切换静音
    toggleMute(aplayer) {
        const currentVolume = aplayer.volume || 1;
        if (currentVolume > 0) {
            this.lastVolume = currentVolume;
            this.setVolume(aplayer, 0);
        } else {
            this.setVolume(aplayer, this.lastVolume);
        }
    }

    // 添加音量显示
    addVolumeDisplay(aplayer) {
        // 创建音量显示元素
        const volumeDisplay = document.createElement('div');
        volumeDisplay.className = 'volume-display';
        volumeDisplay.style.cssText = `
            position: absolute;
            top: -30px;
            right: 0;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            opacity: 0;
            transition: opacity 0.3s;
            pointer-events: none;
            z-index: 1000;
        `;
        
        const volumeWrap = aplayer.querySelector('.aplayer-volume-wrap');
        if (volumeWrap) {
            volumeWrap.style.position = 'relative';
            volumeWrap.appendChild(volumeDisplay);
        }
    }

    // 更新音量显示
    updateVolumeDisplay(aplayer, volume) {
        const volumeDisplay = aplayer.querySelector('.volume-display');
        if (volumeDisplay) {
            const percentage = Math.round(volume * 100);
            volumeDisplay.textContent = `${percentage}%`;
            volumeDisplay.style.opacity = '1';
            
            // 3秒后隐藏
            setTimeout(() => {
                volumeDisplay.style.opacity = '0';
            }, 3000);
        }
    }

    // 保存音量设置
    saveVolume(volume) {
        localStorage.setItem('musicPlayerVolume', volume.toString());
    }

    // 恢复音量设置
    restoreVolume(aplayer) {
        const savedVolume = localStorage.getItem('musicPlayerVolume');
        if (savedVolume !== null) {
            const volume = parseFloat(savedVolume);
            this.setVolume(aplayer, volume);
        }
    }

    changeMusicBg(isChangeBg = true) {
        const musicBg = document.getElementById("Music-bg");
        const musicLoading = document.getElementsByClassName("Music-loading")[0];

        isChangeBg ? this.updateBackgroundImage(musicBg) : this.setLoadingScreen(musicLoading, musicBg);
    }

    updateBackgroundImage(element) {
        const musicCover = document.querySelector("#Music-page .aplayer-pic");
        const img = new Image();
        img.src = this.extractValue(musicCover.style.backgroundImage);
        img.onload = () => {
            element.style.backgroundImage = musicCover.style.backgroundImage;
            element.className = 'show';
        };
    }

    setLoadingScreen(loadingElement, backgroundElement) {
        const timer = setInterval(() => {
            this.addEventListeners();
            const musicCover = document.querySelector("#Music-page .aplayer-pic");
            if (musicCover) {
                loadingElement.style.display = "none";
                clearInterval(timer);
                this.addEventListenerChangeMusicBg();
                backgroundElement.style.display = "block";
            }
        }, 100);
    }

    extractValue(input) {
        const match = /url\("([^"]+)"\)/.exec(input);
        return match ? match[1] : '';
    }

    addEventListenerChangeMusicBg() {
        const aplayer = document.querySelector("#Music-page meting-js").aplayer;
        aplayer.on('loadeddata', () => this.changeMusicBg(true));
        aplayer.on('timeupdate', this.lrcUpdate.bind(this));
    }

    lrcUpdate() {
        const aplayerLrcContents = document.querySelector('.aplayer-lrc-contents');
        const currentLrc = aplayerLrcContents.querySelector('p.aplayer-lrc-current');
        if (currentLrc) {
            const currentIndex = Array.from(aplayerLrcContents.children).indexOf(currentLrc);
            aplayerLrcContents.style.transform = `translateY(${-currentIndex * 80}px)`;
        }
    }

    handleKeydown(event) {
        const aplayer = document.querySelector('meting-js').aplayer;
        if (!aplayer) return;

        const actions = {
            "Space": () => aplayer.toggle(),
            "ArrowRight": () => aplayer.skipForward(),
            "ArrowLeft": () => aplayer.skipBack(),
            "ArrowUp": () => this.adjustVolume(aplayer, this.volumeStep),
            "ArrowDown": () => this.adjustVolume(aplayer, -this.volumeStep),
            "KeyM": () => this.toggleMute(aplayer),
            "Digit0": () => this.setVolume(aplayer, 0),
            "Digit1": () => this.setVolume(aplayer, 0.1),
            "Digit2": () => this.setVolume(aplayer, 0.2),
            "Digit3": () => this.setVolume(aplayer, 0.3),
            "Digit4": () => this.setVolume(aplayer, 0.4),
            "Digit5": () => this.setVolume(aplayer, 0.5),
            "Digit6": () => this.setVolume(aplayer, 0.6),
            "Digit7": () => this.setVolume(aplayer, 0.7),
            "Digit8": () => this.setVolume(aplayer, 0.8),
            "Digit9": () => this.setVolume(aplayer, 0.9),
            "Digit0": () => this.setVolume(aplayer, 1.0)
        };

        if (actions[event.code]) {
            event.preventDefault();
            actions[event.code]();
        }
    }

    destroy() {
        document.removeEventListener("keydown", this.handleKeydown);
    }
}

function initializeMusicPlayer() {
    const exitingMusic = window.scoMusic;
    if (exitingMusic) exitingMusic.destroy();
    window.scoMusic = new MusicPlayer();
}