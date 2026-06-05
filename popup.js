// DOM 元素
const loadingEl = document.getElementById('loading');
const errorEl = document.getElementById('error');
const errorMessageEl = document.getElementById('errorMessage');
const videoInfoEl = document.getElementById('videoInfo');
const notBilibiliEl = document.getElementById('notBilibili');
const videoTitleEl = document.getElementById('videoTitle');
const qualitySelectEl = document.getElementById('qualitySelect');
const formatSelectEl = document.getElementById('formatSelect');
const audioSelectEl = document.getElementById('audioSelect');
const downloadBtnEl = document.getElementById('downloadBtn');
const refreshBtnEl = document.getElementById('refreshBtn');
const downloadProgressEl = document.getElementById('downloadProgress');
const progressFillEl = document.getElementById('progressFill');
const progressTextEl = document.getElementById('progressText');

// 当前视频数据
let currentVideoData = null;
let currentQualityData = null;

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    loadVideoInfo();
    downloadBtnEl.addEventListener('click', handleDownload);
    refreshBtnEl.addEventListener('click', loadVideoInfo);
    qualitySelectEl.addEventListener('change', handleQualityChange);
});

// 加载视频信息
async function loadVideoInfo() {
    showLoading();
    hideError();
    hideVideoInfo();
    hideNotBilibili();
    
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        // 检查是否为 Bilibili 页面
        if (!tab.url.includes('bilibili.com')) {
            showNotBilibili();
            hideLoading();
            return;
        }
        
        // 从内容脚本获取视频信息
        const response = await chrome.tabs.sendMessage(tab.id, { action: 'getVideoInfo' });
        
        if (response.success) {
            currentVideoData = response.data;
            displayVideoInfo(response.data);
            showVideoInfo();
        } else {
            showError(response.error || '无法获取视频信息');
        }
    } catch (error) {
        console.error('Error:', error);
        showError('获取视频信息失败，请确保当前页面是 Bilibili 视频页面');
    } finally {
        hideLoading();
    }
}

// 显示视频信息
function displayVideoInfo(data) {
    videoTitleEl.textContent = data.title;
    
    // 清晰度选项
    qualitySelectEl.innerHTML = '';
    if (data.qualities && data.qualities.length > 0) {
        data.qualities.forEach(quality => {
            const option = document.createElement('option');
            option.value = quality.id;
            option.textContent = quality.name;
            qualitySelectEl.appendChild(option);
        });
        handleQualityChange();
    } else {
        qualitySelectEl.innerHTML = '<option value="">暂无清晰度信息</option>';
    }
    
    // 音频选项
    audioSelectEl.innerHTML = '';
    if (data.audios && data.audios.length > 0) {
        data.audios.forEach(audio => {
            const option = document.createElement('option');
            option.value = audio.id;
            option.textContent = audio.name;
            audioSelectEl.appendChild(option);
        });
    } else {
        audioSelectEl.innerHTML = '<option value="">暂无音频信息</option>';
    }
}

// 处理清晰度变化
function handleQualityChange() {
    const qualityId = qualitySelectEl.value;
    if (currentVideoData && currentVideoData.qualities) {
        currentQualityData = currentVideoData.qualities.find(q => q.id === qualityId);
    }
}

// 处理下载
async function handleDownload() {
    if (!currentVideoData || !currentQualityData) {
        showError('请选择要下载的清晰度');
        return;
    }
    
    downloadBtnEl.disabled = true;
    showDownloadProgress();
    
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        const downloadData = {
            action: 'downloadVideo',
            videoUrl: currentQualityData.url || currentVideoData.playUrl,
            audioUrl: currentQualityData.audioUrl,
            videoTitle: currentVideoData.title,
            quality: currentQualityData.name,
            format: formatSelectEl.value
        };
        
        // 发送下载请求到后台脚本
        chrome.runtime.sendMessage(downloadData, (response) => {
            if (response && response.success) {
                showDownloadProgress();
                progressTextEl.textContent = '下载已开始，请在浏览器下载管理器中查看';
            } else {
                showError(response?.error || '下载失败');
            }
            downloadBtnEl.disabled = false;
            hideDownloadProgress();
        });
        
    } catch (error) {
        console.error('Download error:', error);
        showError('下载失败: ' + error.message);
        downloadBtnEl.disabled = false;
        hideDownloadProgress();
    }
}

// UI 状态管理
function showLoading() {
    loadingEl.classList.remove('hidden');
}

function hideLoading() {
    loadingEl.classList.add('hidden');
}

function showError(message) {
    errorMessageEl.textContent = message;
    errorEl.classList.remove('hidden');
}

function hideError() {
    errorEl.classList.add('hidden');
}

function showVideoInfo() {
    videoInfoEl.classList.remove('hidden');
}

function hideVideoInfo() {
    videoInfoEl.classList.add('hidden');
}

function showNotBilibili() {
    notBilibiliEl.classList.remove('hidden');
}

function hideNotBilibili() {
    notBilibiliEl.classList.add('hidden');
}

function showDownloadProgress() {
    downloadProgressEl.classList.remove('hidden');
}

function hideDownloadProgress() {
    downloadProgressEl.classList.add('hidden');
}

// 监听下载进度
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'downloadProgress') {
        const progress = message.progress;
        progressFillEl.style.width = progress + '%';
        progressTextEl.textContent = `下载进度: ${progress}%`;
    }
});
