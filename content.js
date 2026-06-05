// 接收来自 popup 的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'getVideoInfo') {
        const videoInfo = extractVideoInfo();
        if (videoInfo) {
            sendResponse({ success: true, data: videoInfo });
        } else {
            sendResponse({ success: false, error: '无法提取视频信息' });
        }
    }
});

// 提取视频信息
function extractVideoInfo() {
    try {
        // 获取页面的初始数据（通常在 window.__initialState 中）
        let initialState = null;
        
        // 方法1: 从 window 对象获取
        if (window.__initialState) {
            initialState = window.__initialState;
        }
        
        // 方法2: 从页面脚本中获取
        if (!initialState) {
            const scripts = document.querySelectorAll('script');
            for (let script of scripts) {
                if (script.textContent.includes('__initialState')) {
                    try {
                        const match = script.textContent.match(/__initialState=({[\s\S]*?});/);
                        if (match) {
                            initialState = JSON.parse(match[1]);
                            break;
                        }
                    } catch (e) {
                        // 继续尝试下一个脚本
                    }
                }
            }
        }
        
        if (!initialState) {
            return null;
        }
        
        // 提取视频基本信息
        const videoData = initialState.videoData || {};
        const playInfo = initialState.playInfo || {};
        
        const title = videoData.title || document.title;
        
        // 提取清晰度信息
        const qualities = [];
        if (playInfo.quality) {
            const qualityList = playInfo.quality;
            qualityList.forEach(q => {
                qualities.push({
                    id: q.id.toString(),
                    name: q.desc || `${q.id}p`
                });
            });
        } else {
            // 默认清晰度
            qualities.push({
                id: '1',
                name: '清晰度 1'
            });
        }
        
        // 提取音频信息
        const audios = [];
        if (playInfo.audio) {
            playInfo.audio.forEach(a => {
                audios.push({
                    id: a.id.toString(),
                    name: a.desc || 'AC3'
                });
            });
        } else {
            audios.push({
                id: '1',
                name: '默认音频'
            });
        }
        
        // 获取播放链接
        const playUrl = playInfo.durl && playInfo.durl[0] ? playInfo.durl[0].url : '';
        
        return {
            title: title,
            url: window.location.href,
            playUrl: playUrl,
            qualities: qualities,
            audios: audios,
            bvid: videoData.bvid || extractBvid(),
            aid: videoData.aid || extractAid()
        };
        
    } catch (error) {
        console.error('Error extracting video info:', error);
        return null;
    }
}

// 从 URL 提取 bvid
function extractBvid() {
    const match = window.location.href.match(/video\/(BV\w+)/);
    return match ? match[1] : '';
}

// 从 URL 提取 aid
function extractAid() {
    const match = window.location.href.match(/av(\d+)/);
    return match ? match[1] : '';
}

// 向 popup 发送视频信息（页面加载时）
window.addEventListener('load', () => {
    // 页面加载完成
    console.log('Bilibili video page loaded');
});
