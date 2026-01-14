// 音乐播放器伸缩功能
document.addEventListener('DOMContentLoaded', function() {
  // 等待meting-js加载完成
  const checkMeting = setInterval(function() {
    const aplayer = document.querySelector('#nav-music meting-js .aplayer');
    if (aplayer) {
      clearInterval(checkMeting);
      initMusicPlayer();
    }
  }, 100);

  function initMusicPlayer() {
    const aplayer = document.querySelector('#nav-music meting-js .aplayer');
    if (!aplayer) return;

    // 添加收缩按钮
    addCollapseButton(aplayer);
    
    // 添加展开按钮
    addExpandButton(aplayer);
    
    // 添加点击事件
    addClickEvents(aplayer);
  }

  function addCollapseButton(aplayer) {
    // 检查是否已存在收缩按钮
    if (aplayer.querySelector('.collapse-btn')) return;
    
    const collapseBtn = document.createElement('div');
    collapseBtn.className = 'collapse-btn';
    collapseBtn.title = '收缩播放器';
    aplayer.appendChild(collapseBtn);
    
    collapseBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      collapsePlayer(aplayer);
    });
  }

  function addExpandButton(aplayer) {
    // 检查是否已存在展开按钮
    if (aplayer.querySelector('.expand-btn')) return;
    
    const expandBtn = document.createElement('div');
    expandBtn.className = 'expand-btn';
    expandBtn.title = '展开播放器';
    expandBtn.innerHTML = '<i class="fas fa-expand"></i>';
    aplayer.appendChild(expandBtn);
    
    expandBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      expandPlayer(aplayer);
    });
  }

  function addClickEvents(aplayer) {
    // 胶囊状态下的点击展开
    aplayer.addEventListener('click', function(e) {
      if (aplayer.classList.contains('collapsed') && !e.target.closest('.expand-btn')) {
        expandPlayer(aplayer);
      }
    });
  }

  function collapsePlayer(aplayer) {
    aplayer.classList.add('collapsed');
    
    // 保存状态到localStorage
    localStorage.setItem('musicPlayerCollapsed', 'true');
    
    // 触发自定义事件
    aplayer.dispatchEvent(new CustomEvent('playerCollapsed'));
  }

  function expandPlayer(aplayer) {
    aplayer.classList.remove('collapsed');
    
    // 保存状态到localStorage
    localStorage.setItem('musicPlayerCollapsed', 'false');
    
    // 触发自定义事件
    aplayer.dispatchEvent(new CustomEvent('playerExpanded'));
  }

  // 恢复播放器状态
  function restorePlayerState() {
    const aplayer = document.querySelector('#nav-music meting-js .aplayer');
    if (!aplayer) return;
    
    // 获取存储的状态，如果没有则默认为折叠状态
    const storedCollapsed = localStorage.getItem('musicPlayerCollapsed');
    const isCollapsed = storedCollapsed ? storedCollapsed === 'true' : true; // 默认为true（折叠）
    if (isCollapsed) {
      // 延迟一下确保DOM完全加载
      setTimeout(() => {
        collapsePlayer(aplayer);
      }, 500);
    } else {
      // 如果不是折叠状态，则确保它是展开的
      setTimeout(() => {
        expandPlayer(aplayer);
      }, 500);
    }
  }

  // 页面加载完成后恢复状态
  window.addEventListener('load', function() {
    setTimeout(restorePlayerState, 1000);
  });
});

// 监听meting-js的加载完成事件
document.addEventListener('meting-loaded', function() {
  const aplayer = document.querySelector('#nav-music meting-js .aplayer');
  if (aplayer) {
    initMusicPlayer();
  }
}); 