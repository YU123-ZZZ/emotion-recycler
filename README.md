# 情绪粉碎机 / Emotion Recycler

<p align="center">
  <a href="#中文说明">点我看中文说明</a> · <a href="#english-guide">Click here for English Guide</a>
</p>
<p align="center">
<!-- version-link: https://github.com/YU123-ZZZ/emotion-recycler -->
  <a href="https://github.com/YU123-ZZZ/emotion-recycler/stargazers"><img src="https://img.shields.io/github/stars/YU123-ZZZ/emotion-recycler?style=for-the-badge&logo=github&label=Stars&color=ff69b4" alt="Stars"></a><a href="https://github.com/YU123-ZZZ/emotion-recycler/forks"><img src="https://img.shields.io/github/forks/YU123-ZZZ/emotion-recycler?style=for-the-badge&logo=github&label=Fork&color=8a7dff" alt="Fork"></a><a href="https://github.com/YU123-ZZZ/emotion-recycler/watchers"><img src="https://img.shields.io/github/watchers/YU123-ZZZ/emotion-recycler?style=for-the-badge&logo=github&label=Watch&color=00bcd4" alt="Watch"></a><a href="https://github.com/YU123-ZZZ/emotion-recycler/issues"><img src="https://img.shields.io/github/issues/YU123-ZZZ/emotion-recycler?style=for-the-badge&logo=github&label=Issues" alt="Issues"></a><a href="https://github.com/YU123-ZZZ/emotion-recycler/commits"><img src="https://img.shields.io/github/last-commit/YU123-ZZZ/emotion-recycler?style=for-the-badge&logo=github&label=Last%20Commit&color=ff69b4" alt="Last Commit"></a>
</p>

> 🌏全世界最没用的网站之一，也可能是某个难熬时刻最需要的网站之一。

一个纯前端的情绪释放工具：把心事写下或说出来，再选择粉碎、燃烧、冲走或放进漂流瓶。它不试图替你解决问题，只为你留出一个把话说完、然后放下的地方。

## 简单介绍

情绪粉碎机是一个纯 HTML、CSS、JavaScript 写成的本地优先小网页。它支持键盘输入和多语言语音输入，把临时想法、烦恼或碎碎念交给粉碎、燃烧、冲走、漂流瓶四种轻量动画处理。项目没有后端、没有账号、没有数据库，适合部署到 GitHub Pages，也适合直接作为静态网页收藏使用。

作者：[Github](https://github.com/YU123-ZZZ/emotion-recycler) / [吾爱破解](https://www.52pojie.cn/home.php?mod=space&uid=2394304)

## 免责声明、开源与使用说明

- 本项目仅用于情绪表达、写作热身和轻量自我整理；它不是医疗、心理咨询、心理诊断、治疗或危机干预服务，也不能替代专业帮助。
- 如果你或身边的人正经历紧急危险、持续痛苦、自伤念头或现实安全风险，请优先联系当地急救服务、可信任的人，或专业心理/医疗支持。
- 本项目没有自建服务器，不会向本站上传文字、草稿、录音或历史记录；但语音识别依赖浏览器的 Web Speech API，其联网需求、识别过程与数据处理规则由浏览器厂商或系统服务决定。
- 请不要在共享设备、公共电脑或不可信环境中输入高度敏感内容。需要更高隐私时，请关闭草稿保存并优先使用键盘输入；浏览器的 `localStorage` 不是加密保险箱。
- 仓库代码和页面按“现状”提供，不保证适用于所有浏览器、设备、地区语音服务或特定用途。使用前请自行评估风险，并遵守所在地区的法律法规。
- **本项目公开、免费分享，不存在官方收费版本。任何以安装费、授权费、辛苦费、技术服务费或其他名义索取费用的人，均非本项目官方授权。**
- **作者最终发布形式为网页端。除作者在 Github 或吾爱破解主页明确发布的内容外，任何桌面软件、安装包、移动 App、浏览器扩展、镜像站或以本项目名义提供的服务，均不代表作者官方作品，也不享有官方支持。**
- 请以作者发布的最终版本为准。本项目传承开源精神，在遵守适用法律、原作者声明及相关第三方许可的前提下，欢迎下载、学习、修改和二次开发；二次分发时请保留代码与页面中已有的原作者版权注释、署名链接和免责声明，不得把非官方修改版冒充为作者最终版本。

## 中文说明

### 能做什么

- 在淡黄色记事本中输入最多 `10000` 个多语言字素簇，兼容中文、英文、俄文、日文、韩文和 Emoji。
- 用粉碎、燃烧、冲走、漂流瓶四种动画和同步程序化音效销毁文字。
- 使用麦克风持续转写，不需要先点击输入框。
- 在本站内打开关于、语言、历史等面板时，已开启的语音会继续保持监听意图。
- 首次打开会尝试按浏览器或系统语言自动切换界面；仍可使用语言菜单手动切换，顶部的语言、历史、语音工具均有文字标签。
- “历史”展示的是本地内置的安慰语，不会记录或回放你的输入。
- 保存开关只控制当前浏览器 `localStorage` 中的草稿；关闭保存后草稿会被清除。

### 四种销毁方式

| 模式 | 大致时长 | 过程 |
|---|---:|---|
| 粉碎 | 约 5.5–11 秒 | 完整纸张进入居中的碎纸机，经过滚轮后切成带原文字笔画的纸片，落入网格筐。 |
| 燃烧 | 约 5.2–8.5 秒 | 打火机从纸张下沿点燃，多张密排文字纸同步向上燃烧，火焰和烟向上飘，留下焦边与灰烬。 |
| 冲走 | 约 7–13 秒 | 纸张揉成纸团，落入完整马桶，随水流、漩涡和下水口消失。 |
| 漂流瓶 | 约 8–13 秒 | 纸张卷成带高光、暗部和纸层端面的圆柱纸卷，装瓶、塞好木塞，落到少量海水上并逐渐漂向远处。 |

动画时长随文字长度以平方根曲线增加。长文本会得到更长的过程，但不会线性增加粒子或纸片数量。

### 界面语言

首次打开时，页面会读取 `navigator.languages` / `navigator.language`，尝试按浏览器或系统语言自动选择简体中文、繁体中文、English、Русский、日本語或한국어；无法匹配时默认简体中文。顶部“语言”按钮只切换页面文字，手动选择后会写入本机 `localStorage` 并优先生效，避免系统语言变化打断你的偏好。界面语言与麦克风识别语言互相独立：切换页面语言不会覆盖已经手动选择的语音模式；语音设为“通用”时，页面语言或浏览器语言只作为首次识别的参考之一。

### 语音输入

语音功能使用浏览器原生 Web Speech API。点击一次麦克风后，本站会持续尝试保持识别；识别器自行结束、短暂无声或从其他浏览器标签回到本站时，只要没有主动停止，就会自动恢复。

默认“通用”模式不要求先选语言。它会优先参考已有内容、浏览器首选语言和上一次有效识别；在一个分句完成后，会根据识别出的字符体系自动结束当前浏览器识别会话，并以对应精确语言开始下一次识别：韩文字母倾向韩语、拉丁字母倾向英文、西里尔字母倾向俄文、平假名或片假名倾向日文、汉字保留最近使用的中文地区。它适合日常混合使用，但不能保证同一句中英日韩俄混说拥有精确模式同等准确率。

需要更高准确率时，可以在麦克风旁选择精确模式：普通话 `zh-CN`、台湾国语 `zh-TW`、粤语 `zh-HK`、English `en-US`、日本語 `ja-JP`、한국어 `ko-KR`、Русский `ru-RU`。说韩语时优先选择 `한국어`，避免第一句被通用模式的起始语言误判。

| 使用场景 | 建议选择 |
|---|---|
| 平时会交替说多种语言，不想频繁切换 | 通用；它会在一个分句结束后为下一段调整语言。 |
| 一段话主要是普通话、台湾国语或粤语 | 直接选择对应精确模式；只有汉字时通用模式不能可靠判断三种中文口音。 |
| 一段话主要是英语、日语、韩语或俄语 | 直接选择 `English`、`日本語`、`한국어` 或 `Русский`，准确率通常高于通用。 |
| 同一句话频繁混合多种语言 | 浏览器原生接口无法同时声明多个识别语言，建议按主要语言选择精确模式。 |

语音开启期间仍可直接编辑便签。手动删除或改写后的内容会立即成为新的文本基准，旧识别会话中尚未提交的结果会被丢弃，不会把已经删除的文字自动补回来。

浏览器限制必须说明清楚：本站不能在关闭或离开本站后继续录音，也不能绕过系统或浏览器的麦克风权限。首次授权后本站不会主动再次请求权限；是否再次弹窗由浏览器的站点权限设置决定。不同浏览器和系统语言包对语音识别的支持、联网方式与准确率不同。

### 技术实现

项目只由原生 HTML、CSS 和 JavaScript 构成：

- `Canvas 2D`：粉碎、燃烧和冲走的低开销绘制。
- DOM + CSS：漂流瓶、少量海水、菜单、弹窗和响应式界面。
- `Web Audio API`：本地合成电机、纸张、火焰、水流、玻璃和海浪声音，不下载音频文件。
- `Intl.Segmenter`：按字素簇而不是 UTF-16 长度统计多语言输入。
- `Web Speech API`：浏览器提供的连续语音识别与自动重启。
- `localStorage`：只在开启“保存”时保留本机草稿和偏好设置。

没有框架、没有后端、没有账号、没有本站数据库，也没有第三方动画引擎。

### 隐私、保密与离线

- 本站不会把文字、草稿、语音音频或“历史”发送给本站服务器，因为本站没有服务器。
- 本站不会创建或保存原始语音录音文件，也不使用 `MediaRecorder`。
- 键盘输入、四种销毁动画、程序化音效、语言界面、历史安慰语和关于说明可在本地离线使用。
- 草稿仅存在当前浏览器的 `localStorage`，且只有打开“保存”时才写入；使用共享设备时建议关闭保存。
- 浏览器原生语音识别可能由浏览器厂商或系统语言服务处理，是否需要网络并不由本站保证。需要绝对离线或绝对保密时，请使用键盘输入并关闭草稿保存。

### 适合谁

适合想暂时整理情绪、练习表达、写下不准备保留的话、做轻量写作热身，或只是需要一个安静出口的人。它不是医疗、心理诊断或危机干预工具；紧急危险或持续痛苦时，请优先联系可信任的人、当地急救服务或专业心理支持。

### 项目结构与开发说明

普通使用或部署静态网页时，核心文件是 `index.html`、`css/`、`js/`、`public/` 和 `README.md`。项目没有后端、没有构建步骤、没有框架、没有账号系统，也没有数据库。

开发阶段曾使用 `docs/` 记录设计规格和实现计划；这些开发文档的核心结论已整理到本 README，并在发布整理时从项目目录移除：页面坚持纯 HTML、CSS、JavaScript；输入按多语言字素簇统计，最多 `10000`；粉碎、燃烧、冲走、漂流瓶共用长度感知时间轴，让动画与程序化音效同步；Canvas 粒子、纸片和水流数量都有上限，优先保证低配置电脑、手机和平板流畅运行。

语音部分只使用浏览器原生 Web Speech API，不上传录音、不创建音频文件。通用模式会参考已有文字、系统/浏览器语言和上一次有效识别，并在分句后按文字体系调整下一次识别语言；也可以手动选择普通话、台湾国语、粤语、英语、日语、韩语或俄语。语音开启后会持续保持监听意图，直到你主动停止、离开页面或浏览器/系统强制暂停；网页不会再设置固定时长自动停止。

界面首次打开会尝试根据系统或浏览器语言自动切换为简体中文、繁体中文、English、Русский、日本語或한국어；手动选择后会记住偏好，不再被系统语言变化覆盖。关于弹窗采用固定标题/页签和独立滚动正文，避免手机或小屏幕上内容显示不全；打赏二维码位置保持固定，并加了遮罩层减少误触或右键跳转。

开发期曾有 `tests/` 自动化回归测试，用来检查关于弹窗响应式、动画时间轴、语音识别状态和音效时间线。普通用户打开网页不需要这些测试文件，因此发布整理时已移除 `tests/` 目录；如果后续继续开发，可再单独恢复或重建测试目录。

### 性能与兼容性

- Canvas 像素比最高为 `1.5`。
- 碎纸最多约 84 个真实纸面切片，手机端最多约 50 个，减少动态模式更少。
- 火焰最多 160 个粒子，冲水最多 90 个粒子。
- 使用 `prefers-reduced-motion: reduce` 时降低非必要动画。
- 长文本输入计数会复用 `Intl.Segmenter`，并对常见中文、英文、俄文、日文、韩文走快速路径；复杂 Emoji 或组合字符仍按字素簇准确处理。
- 页面适配 360px 手机、平板和桌面；低配置设备优先保留内容和反馈，而不是复杂特效。
- 推荐新版 Chrome、Edge、Safari 或 Firefox。语音识别可用性取决于具体浏览器，部分桌面 Firefox 可能不提供 Web Speech API。

## English Guide

### What It Does

Emotion Recycler is a local-first emotional release page. Write or dictate a thought, then choose Shred, Burn, Flush, or Drift. It does not solve the thought for you; it makes room to say it, finish it, and let it go.

- Accepts up to `10,000` multilingual grapheme clusters, including CJK text, Latin and Cyrillic scripts, and Emoji.
- Provides four length-aware destruction scenes with synchronized locally generated sound.
- Streams speech into the note without requiring textarea focus.
- Keeps the intent to listen while opening this site's History, Language, and About panels.
- Automatically follows the browser or system language on first open when possible, while still showing a manual Language menu and visible labels for language, history, and voice controls.
- History contains local comfort messages only. It never stores a transcript of what you wrote or said.
- The Save switch controls only this browser's `localStorage` draft.

### Destruction Modes

| Mode | Approx. duration | Sequence |
|---|---:|---|
| Shred | 5.5–11 s | An intact note enters the centered shredder, becomes real cached-paper pieces after the rollers, and falls into a mesh basket. |
| Burn | 5.2–8.5 s | A lighter ignites the lower edge; the dense text-page stack burns upward together while flame and smoke rise. |
| Flush | 7–13 s | The note crumples, drops into a toilet, and disappears through the water vortex and drain. |
| Drift | 8–13 s | The note becomes a shaded cylindrical scroll with a layered end, enters the bottle, lands on a small sea surface, and drifts away. |

Durations grow on a square-root curve with text length, not by creating unbounded rendering work.

### Interface Languages

On first open, the page reads `navigator.languages` / `navigator.language` and tries to choose Simplified Chinese, Traditional Chinese, English, Russian, Japanese, or Korean automatically; if nothing matches, it falls back to Simplified Chinese. The Language button changes interface text only. A manual choice is saved in this browser's `localStorage` and takes priority, so later system-language changes do not unexpectedly override your preference. Interface language and microphone locale are independent. Changing the interface does not override a voice mode selected manually; in Universal mode, the interface or browser language is only one hint for the first recognition session.

### Voice Input

Voice input uses the browser's native Web Speech API. After one microphone click, the page keeps trying to continue recognition until you explicitly stop it. It also resumes when a browser recognition session ends, after silence, or when you return to this site from another browser tab.

Universal mode requires no language choice. It first considers existing text, the browser's preferred language, and the last successful language. After a phrase is finalized, it ends the current browser recognition session and starts the next one with the matching precise locale: Hangul suggests Korean, Latin text suggests English, Cyrillic suggests Russian, Japanese kana suggests Japanese, and Han text preserves the most recent Chinese region. It is useful for ordinary multilingual use, but a single sentence that mixes Chinese, English, Japanese, Korean, and Russian cannot be promised the same accuracy as a chosen precise locale.

Precise modes are available beside the microphone: Mandarin `zh-CN`, Taiwan Mandarin `zh-TW`, Cantonese `zh-HK`, English `en-US`, Japanese `ja-JP`, Korean `ko-KR`, and Russian `ru-RU`. Select Korean directly for Korean speech when accuracy matters.

| Situation | Recommended mode |
|---|---|
| You alternate languages and do not want to switch often | Universal; it adapts the next session after a completed phrase. |
| A passage is mainly Mandarin, Taiwan Mandarin, or Cantonese | Select that precise mode. Han characters alone cannot reliably distinguish these spoken varieties. |
| A passage is mainly English, Japanese, Korean, or Russian | Select `English`, `日本語`, `한국어`, or `Русский`; this is usually more accurate than Universal. |
| One sentence frequently mixes several languages | The native browser API cannot declare several recognition locales at once; select the main spoken language. |

You can edit the note while listening. A manual deletion or rewrite immediately becomes the new text baseline; uncommitted results from the previous recognition session are discarded and deleted text is not restored.

Browser privacy boundaries still apply. This page cannot keep recording after you close or leave it, and it cannot bypass microphone permission. The page does not intentionally request permission again after an initial grant; whether a browser prompts again is controlled by that browser's site permission policy.

### Technology

- Native HTML, CSS, and JavaScript only. No framework, backend, account, database, or animation engine.
Canvas 2D for shredding, burning, and flushing.
- DOM/CSS for the bottle, sea surface, menus, dialogs, and responsive layout.
- Web Audio API for synthesized motor, paper, fire, water, glass, and wave sounds.
- `Intl.Segmenter` for correct multilingual character limits.
- Web Speech API for browser-provided continuous speech recognition.
- `localStorage` only for optional local drafts and interface preferences.

### Privacy and Offline Use

- This site has no server and does not receive your text, drafts, or raw audio.
- It does not create or retain audio recordings and does not use `MediaRecorder`.
- Typing, destruction effects, generated sounds, interface language, History comfort messages, and About content work locally offline.
- Speech recognition may be processed by the browser vendor or system language service. Network requirements and data handling are browser-dependent, not guaranteed by this site.
- For strict offline or confidential use, type instead of dictating and turn draft saving off, especially on shared devices.

### Disclaimer, Open Source, And Use

- This project is only for emotional expression, writing warm-ups, and light self-organization. It is not medical advice, psychological counseling, diagnosis, treatment, crisis intervention, or a substitute for professional help.
- If you or someone nearby is in immediate danger, prolonged distress, experiencing thoughts of self-harm, or facing a real-world safety risk, contact local emergency services, a trusted person, or qualified mental-health or medical support first.
- This project has no self-hosted server and does not upload text, drafts, recordings, or history to this site. Speech recognition uses the browser's Web Speech API, so network requirements, recognition processing, and data-handling rules are determined by the browser vendor or operating-system service.
- Do not enter highly sensitive information on shared devices, public computers, or untrusted environments. For stronger privacy, turn draft saving off and prefer typing; browser `localStorage` is not an encrypted vault.
- The repository code and page are provided as is, without a guarantee that they suit every browser, device, regional speech service, or use case. Assess the risks yourself and follow applicable laws and regulations.
- **This project is shared publicly and free of charge. There is no official paid version. Anyone requesting an installation fee, license fee, service fee, or payment under any other name is not officially authorized by this project.**
- **The author's final release format is the web version. Unless the author explicitly publishes it through the GitHub or 52pojie pages linked above, any desktop software, installer, mobile app, browser extension, mirror site, or service using this project's name is not an official work and has no official support.**
- Use the author's final release as the reference version. Subject to applicable law, the author's notices, and relevant third-party licenses, you may download, study, modify, and build on the project. When redistributing a derivative, keep the existing author attribution, copyright notices, links, and disclaimers; do not present an unofficial modification as the author's final release.

### Project Structure and Design Notes

For normal use or static hosting, the essential files are `index.html`, `css/`, `js/`, `public/`, and `README.md`. There is no backend, build step, framework, account system, or database.

During development, `docs/` held design specs and implementation plans. Those development notes have been summarized in this README and removed from the release directory: the app stays native HTML, CSS, and JavaScript; input is counted as multilingual grapheme clusters up to `10,000`; Shred, Burn, Flush, and Drift share length-aware timelines so visuals and generated sound stay synchronized; rendering budgets are capped to keep low-end desktops, phones, and tablets smooth.

Voice input uses only the browser's native Web Speech API. The site does not upload audio and does not create recordings. Universal mode considers existing text, browser/system language, and the last useful recognition result, then adapts the next recognition session after a completed phrase by script. Precise modes are also available for Mandarin, Taiwan Mandarin, Cantonese, English, Japanese, Korean, and Russian. When voice is enabled, the page keeps the listening intent until you explicitly stop it, leave the page, or the browser/operating system suspends it; the page does not apply a fixed-duration automatic timeout.

On first open, the interface tries to follow the system or browser language: Simplified Chinese, Traditional Chinese, English, Russian, Japanese, or Korean. A manual language choice is remembered and takes priority over later system-language changes. The About dialog keeps its title and tabs fixed while the body scrolls independently, which helps small screens show all content; the donation QR area keeps its position and uses an overlay to reduce accidental clicks or context-menu jumps.

Development previously included a `tests/` folder for regression checks around the responsive About dialog, animation timelines, voice-recognition state, and sound timing. Normal users do not need those files to open the page, so the `tests/` folder has been removed for a cleaner release. Future development can restore or rebuild tests separately if needed.

### Performance and Compatibility

- Canvas device pixel ratio is capped at `1.5`.
- Shredding uses at most about 84 cached-paper slices on desktop and about 50 on phones; reduced motion uses fewer.
- Fire is capped at 160 particles and flush water at 90.
- Long-text counting reuses `Intl.Segmenter` and uses a fast path for common Chinese, English, Russian, Japanese, and Korean text, while complex Emoji or combining characters are still counted as grapheme clusters.
- The UI targets 360px phones, tablets, and desktop screens.
- Use a modern Chrome, Edge, Safari, or Firefox. Web Speech availability varies by browser and platform; some Firefox desktop builds do not expose it.

## 打赏码 / Support

<p align="center">
  <img src="public/WAQR.png" width="400" alt="打赏二维码 / Donation QR code">
</p>
