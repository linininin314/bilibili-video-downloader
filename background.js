// 后台服务 Worker - 处理下载任务

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'downloadVideo') {
        handleVideoDownload(message, sendResponse);
    }
});

// 处理视频下载
async function handleVideoDownload(message, sendResponse) {
    try {
        const { videoUrl, audioUrl, videoTitle, quality, format } = message;
        
        if (!videoUrl) {
            sendResponse({ success: false, error: '视频链接不可用' });
            return;
        }
        
        // 生成文件名
        const timestamp = new Date().toISOString().slice(0, 10);
        const filename = `${sanitizeFilename(videoTitle)}_${quality}_${timestamp}.${format === 'mp4' ? 'mp4' : 'mkv'}`;
        
        // 下载视频
        const downloadId = await downloadFile(videoUrl, filename);
        
        if (downloadId !== undefined) {
            sendResponse({ success: true, downloadId: downloadId });
            
            // 如果有音频 URL，也下载音频
            if (audioUrl) {
                const audioFilename = `${sanitizeFilename(videoTitle)}_audio.m4a`;
                await downloadFile(audioUrl, audioFilename);
            }
        } else {
            sendResponse({ success: false, error: '下载失败' });
        }
        
    } catch (error) {
        console.error('Download error:', error);
        sendResponse({ success: false, error: error.message });
    }
}

// 下载文件
function downloadFile(url, filename) {
    return new Promise((resolve, reject) => {
        try {
            chrome.downloads.download({
                url: url,
                filename: filename,
                saveAs: true
            }, (downloadId) => {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                } else {
                    resolve(downloadId);
                    
                    // 监听下载状态
                    chrome.downloads.onChanged.addListener((delta) => {
                        if (delta.id === downloadId) {
                            if (delta.state && delta.state.current === 'complete') {
                                console.log(`Download completed: ${filename}`);
                            } else if (delta.state && delta.state.current === 'interrupted') {
                                console.log(`Download interrupted: ${filename}`);
                            }
                        }
                    });
                }
            });
        } catch (error) {
            reject(error);
        }
    });
}

// 清理文件名
function sanitizeFilename(filename) {
    return filename
        .replace(/[<>:"/\\|?*]/g, '')
        .replace(/\s+/g, '_')
        .slice(0, 100);
}

// 处理下载进度
chrome.downloads.onDeterminingFilename.addListener((item, suggest) => {
    console.log('Download determining filename:', item);
});

// 处理下载完成
chrome.downloads.onChanged.addListener((delta) => {
    if (delta.state) {
        console.log('Download state changed:', delta.state.current);
    }
});
