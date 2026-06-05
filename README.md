# Bilibili 视频下载器

一个功能强大的 Chrome 浏览器扩展，可以直接下载 Bilibili 网页版视频。

## 功能特性

✨ **核心功能**
- 一键下载当前页面的 Bilibili 视频
- 支持多种清晰度选择（1080p、720p、480p 等）
- 支持选择不同的视频格式（MP4、HEVC）
- 支持选择不同的音频轨道
- 友好的用户界面，操作简单

🎯 **特点**
- 自动识别 Bilibili 视频页面
- 实时显示视频信息（标题、清晰度、音频选项）
- 支持刷新获取最新视频信息
- 下载进度实时显示
- 自动生成合理的文件名

## 安装方法

### 方式一：开发者模式安装（推荐）

1. 克隆本仓库或下载源代码
   ```bash
   git clone https://github.com/linininin314/bilibili-video-downloader.git
   ```

2. 打开 Chrome 浏览器，访问 `chrome://extensions/`

3. 启用右上角的"开发者模式"

4. 点击"加载已解压的扩展程序"

5. 选择本项目的文件夹

6. 扩展会被安装并显示在扩展列表中

### 方式二：直接使用（Windows/Mac/Linux）

1. 下载最新的 Release 包
2. 按照方式一的步骤 2-5 进行安装

## 使用方法

1. **打开 Bilibili 视频页面**
   - 在浏览器中打开任意 Bilibili 视频页面
   - 支持的 URL 格式：
     - `https://www.bilibili.com/video/BVxxxxxx`
     - `https://www.bilibili.com/video/avxxxxxx`

2. **点击扩展图标**
   - 在 Chrome 工具栏中点击"B站视频下载"扩展图标
   - 扩展会自动获取当前视频的信息

3. **选择下载选项**
   - **清晰度**：选择想要的视频清晰度
   - **视频格式**：选择 MP4 或 HEVC 格式
   - **音频**：选择想要的音频轨道

4. **开始下载**
   - 点击"下载视频"按钮
   - 浏览器会调用系统下载功能
   - 在下载管理器中查看下载进度

5. **刷新信息**
   - 如需更新视频信息，点击"刷新信息"按钮

## 项目结构

```
bilibili-video-downloader/
├── manifest.json          # 扩展配置文件
├── popup.html            # 弹窗界面
├── popup.js              # 弹窗逻辑
├── content.js            # 内容脚本（视频信息提取）
├── background.js         # 后台服务脚本（下载处理）
├── styles.css            # 样式文件
├── images/               # 图标文件夹
│   ├── icon-16.png
│   ├── icon-48.png
│   └── icon-128.png
└── README.md             # 本文件
```

## 文件说明

| 文件 | 说明 |
|------|------|
| `manifest.json` | Chrome 扩展配置，定义权限和功能入口 |
| `popup.html` | 扩展弹窗 UI，包含下载选项和进度显示 |
| `popup.js` | 弹窗交互逻辑，处理用户操作和 UI 更新 |
| `content.js` | 在网页中运行，提取视频信息和链接 |
| `background.js` | 后台脚本，处理文件下载和进度管理 |
| `styles.css` | 样式表，美化扩展界面 |

## 技术栈

- **JavaScript** - 核心编程语言
- **Chrome Extensions API** - 扩展框架
- **HTML/CSS** - 用户界面
- **Bilibili API** - 视频信息获取

## 工作原理

1. **视频信息提取** (`content.js`)
   - 在 Bilibili 视频页面注入脚本
   - 从页面的 `__initialState` 提取视频数据
   - 解析清晰度、音频和播放链接信息

2. **用户交互** (`popup.js`)
   - 显示视频信息和下载选项
   - 处理用户的清晰度和格式选择
   - 管理下载进度显示

3. **后台处理** (`background.js`)
   - 接收下载任务
   - 使用 Chrome Downloads API 下载文件
   - 生成合理的文件名
   - 监听下载状态

## 常见问题

### Q: 为什么看不到清晰度选项？
A: 这可能是因为：
- 页面还未完全加载，请等待几秒后刷新
- 点击"刷新信息"按钮重新获取
- 某些视频可能不支持多个清晰度

### Q: 下载后的视频无法播放？
A: 可能的原因：
- 浏览器下载被中断
- 视频格式与您的播放器不兼容
- 尝试更换视频格式（MP4 或 HEVC）

### Q: 支持下载 UP 主的全部视频吗？
A: 目前版本只支持下载当前正在播放的视频。批量下载功能将在后续版本添加。

### Q: 这是合法的吗？
A: 请遵守 Bilibili 的使用条款。此工具仅供个人学习和研究使用。

## 浏览器兼容性

- ✅ Chrome 88+
- ✅ Edge 88+
- ⚠️ Firefox（需要改动权限声明）
- ❌ Safari（不支持 MV3 清单）

## 更新日志

### v1.0.0 (2024-01-XX)
- ✨ 初始版本发布
- ✅ 支持视频下载
- ✅ 支持清晰度选择
- ✅ 支持格式选择
- ✅ 支持音频轨道选择

## 后续计划

- [ ] 批量下载功能
- [ ] 字幕下载
- [ ] 封面下载
- [ ] 下载历史记录
- [ ] 自定义下载路径
- [ ] 更多视频格式支持
- [ ] 国际化支持

## 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature')`
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 许可证

本项目采用 MIT 许可证。详见 [LICENSE](LICENSE) 文件。

## 免责声明

- 本工具仅供个人学习和研究使用
- 用户需自行承担使用本工具产生的一切后果
- 禁止用于任何商业目的或非法用途
- 请遵守 Bilibili 的使用条款和当地法律法规

## 联系方式

- 💬 提交 Issue：https://github.com/linininin314/bilibili-video-downloader/issues
- 📧 邮件：（请填写您的邮箱）

## 致谢

感谢所有贡献者和使用者的支持！

---

**⭐ 如果这个项目对你有帮助，请给个 Star 吧！**
