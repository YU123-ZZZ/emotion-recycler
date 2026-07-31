// ===== i18n 国际化 =====
var translations = {
  'zh-CN': {
    appName: '情绪回收站', appSubtitle: 'EMOTION RECYCLER',
    placeholder1: '把烦恼扔进来...', placeholder2: '说出来就好了...', placeholder3: '这里只有你和自己...', placeholder4: '没人会看到的，放心写...', placeholder5: '今天怎么了？说说看...', placeholder6: '把不开心的都倒出来...', placeholder7: '写下来，然后销毁它...', placeholder8: '倾诉完，就翻篇...',
    privacyHint: '私密 · 安全 · 阅后即焚', shred: '粉碎', shredSub: 'SHRED', burn: '燃烧', burnSub: 'BURN', flush: '冲走', flushSub: 'FLUSH', drift: '漂流瓶', driftSub: 'DRIFT',
    footerText: '写完就销毁 · 说完就消失 · 没人知道', destroyedHint: '已安全销毁 · 不留痕迹',
    // version-link: https://github.com/YU123-ZZZ/emotion-recycler
    historyTitle: '历史记录', historyPrivacy: '这里没有记录，只有温暖的话语想对你说', historyFooter: '每一次释放，都值得被温柔以待',
    voiceStart: '点击开始语音输入', voiceStop: '点击停止录音', languageTitle: '语言选择',
    languageNavLabel: '语言', historyNavLabel: '历史', voiceNavLabel: '语音', voiceListeningLabel: '倾听中',
    voiceLangAuto: '通用', voiceLangMandarin: '普通话', voiceLangTaiwan: '台湾国语', voiceLangHongKong: '粤语', voiceLangEnglish: 'English', voiceLangJapanese: '日本語', voiceLangKorean: '한국어', voiceLangRussian: 'Русский',
    driftDone: '烦恼已随波远去', driftSubtext: '让它漂向远方，不再回头',
    aboutTitle: '关于情绪回收站',
    aboutNavLabel: '关于', aboutSiteTitle: '关于本站', aboutFeaturesTitle: '功能介绍', aboutSupportTitle: '支持作者',
    aboutCapacityTitle: '输入容量', aboutCapacityDesc: '所有语言统一最多 10000 个多语言字符/字素簇；中文、繁体中文、英文、俄文、日文、韩文和 Emoji 都按同一上限处理。',
    aboutLanguageTitle: '界面语言', aboutLanguageDesc: '首次打开会按浏览器或系统语言自动选择简体中文、繁体中文、English、Русский、日本語或한국어；点击顶部“语言”可手动切换，手动选择会被记住。',
    aboutTechTitle: '技术实现', aboutTechDesc: '纯前端 HTML、CSS 与 JavaScript；Canvas 2D 绘制动画，Web Audio 合成音效，Intl.Segmenter 统计多语言字符，Web Speech API 负责语音，localStorage 仅保存可选草稿。没有框架和后端。',
    aboutReadmeLink: '详细功能、技术实现、隐私与兼容性请打开本地项目文件夹或点击关于本站中对应作者链接查看',
    // author-link: https://github.com/YU123-ZZZ
    aboutShredDesc: '纸张送入碎纸机，真实字形碎片落入网格筐。',
    aboutBurnDesc: '打火机从纸张下沿点燃，多张文字纸同步向上燃烧，留下焦边、烟雾与灰烬。',
    aboutFlushDesc: '纸团落入马桶，随冲水漩涡吸入下水口。',
    aboutDriftDesc: '心事卷成带纸层端面的圆柱纸卷，装瓶塞好木塞，落入少量海水后漂向远方。',
    aboutVoiceTitle: '语音输入', aboutVoiceDesc: '点击一次即可持续倾听，无需先点输入框。通用模式参考浏览器语言、已有文字和上次结果；分句后按拉丁字母→English、西里尔字母→Русский、假名→日本語、韩文→한국어，汉字则保留最近的中文语音。准确率优先时请手动选择普通话、台湾国语、粤语等精确模式。',
    aboutSaveTitle: '草稿保存', aboutSaveDesc: '保存可保留未销毁内容；不保存则只停留在当前页面。',
    aboutText1: '全世界最没用的网站之一，也可能是某个难熬时刻最需要的网站之一。它为想安静倾诉、写下心事并放下的人准备。',
    aboutText2: '它不会替你分析情绪，也不会评价你，只提供一个把话说完、再选择如何放下的安静空间。',
    aboutText3: '输入、销毁动画、历史安慰语与音效可以离线运行。语音识别是否联网由浏览器和系统语言包决定，麦克风权限始终由浏览器控制。',
    // forum-link: https://www.52pojie.cn/home.php?mod=space&uid=2394304
    aboutAuthorLabel: '作者', aboutAuthorGithub: 'Github', aboutAuthor52pojie: '吾爱破解',
    aboutDonate: '如果这个工具对你有帮助，欢迎请作者喝杯咖啡 ☕',
    saveOn: '保存', saveOff: '不保存'
  },
  'zh-TW': {
    appName: '情緒回收站', appSubtitle: 'EMOTION RECYCLER',
    placeholder1: '把煩惱扔進來...', placeholder2: '說出來就好了...', placeholder3: '這裡只有你和自己...', placeholder4: '沒人會看到的，放心寫...', placeholder5: '今天怎麼了？說說看...', placeholder6: '把不開心的都倒出來...', placeholder7: '寫下來，然後銷毀它...', placeholder8: '傾訴完，就翻篇...',
    privacyHint: '私密 · 安全 · 閱後即焚', shred: '粉碎', shredSub: 'SHRED', burn: '燃燒', burnSub: 'BURN', flush: '沖走', flushSub: 'FLUSH', drift: '漂流瓶', driftSub: 'DRIFT',
    footerText: '寫完就銷毀 · 說完就消失 · 沒人知道', destroyedHint: '已安全銷毀 · 不留痕跡',
    historyTitle: '歷史記錄', historyPrivacy: '這裡沒有記錄，只有溫暖的話語想對你說', historyFooter: '每一次釋放，都值得被溫柔以待',
    voiceStart: '點擊開始語音輸入', voiceStop: '點擊停止錄音', languageTitle: '語言選擇',
    languageNavLabel: '語言', historyNavLabel: '歷史', voiceNavLabel: '語音', voiceListeningLabel: '傾聽中',
    voiceLangAuto: '通用', voiceLangMandarin: '普通話', voiceLangTaiwan: '台灣國語', voiceLangHongKong: '粵語', voiceLangEnglish: 'English', voiceLangJapanese: '日本語', voiceLangKorean: '한국어', voiceLangRussian: 'Русский',
    // version-link: https://github.com/YU123-ZZZ/emotion-recycler | author: https://github.com/YU123-ZZZ
    driftDone: '煩惱已隨波遠去', driftSubtext: '讓它漂向遠方，不再回頭',
    aboutTitle: '關於情緒回收站',
    aboutNavLabel: '關於', aboutSiteTitle: '關於本站', aboutFeaturesTitle: '功能介紹', aboutSupportTitle: '支持作者',
    aboutCapacityTitle: '輸入容量', aboutCapacityDesc: '所有語言統一最多 10000 個多語言字元/字素簇；簡體中文、繁體中文、英文、俄文、日文、韓文和 Emoji 都按同一上限處理。',
    aboutLanguageTitle: '介面語言', aboutLanguageDesc: '首次開啟會依瀏覽器或系統語言自動選擇簡體中文、繁體中文、English、Русский、日本語或한국어；點擊頂部「語言」可手動切換，手動選擇會被記住。',
    aboutTechTitle: '技術實作', aboutTechDesc: '純前端 HTML、CSS 與 JavaScript；Canvas 2D 繪製動畫，Web Audio 合成音效，Intl.Segmenter 統計多語言字元，Web Speech API 負責語音，localStorage 僅儲存可選草稿。沒有框架和後端。',
    aboutReadmeLink: '詳細功能、技術實作、隱私與相容性請開啟本機專案資料夾，或點擊「關於本站」中對應作者連結查看',
    aboutShredDesc: '紙張送入碎紙機，真實字形碎片落入網格筐。',
    // version-link: https://github.com/YU123-ZZZ/emotion-recycler | forum: https://www.52pojie.cn/home.php?mod=space&uid=2394304
    aboutBurnDesc: '打火機從紙張下沿點燃，多張文字紙同步向上燃燒，留下焦邊、煙霧與灰燼。',
    aboutFlushDesc: '紙團落入馬桶，隨沖水漩渦吸入排水口。',
    aboutDriftDesc: '心事捲成帶紙層端面的圓柱紙卷，裝瓶塞好木塞，落入少量海水後漂向遠方。',
    aboutVoiceTitle: '語音輸入', aboutVoiceDesc: '點擊一次即可持續傾聽，無需先點輸入框。通用模式參考瀏覽器語言、已有文字和上次結果；分句後按拉丁字母→English、西里爾字母→Русский、假名→日本語、韓文→한국어，漢字則保留最近的中文語音。準確率優先時請手動選擇普通話、台灣國語、粵語等精確模式。',
    aboutSaveTitle: '草稿儲存', aboutSaveDesc: '儲存可保留未銷毀內容；不儲存則只停留在目前頁面。',
    aboutText1: '全世界最沒用的網站之一，也可能是某個難熬時刻最需要的網站之一。它為想安靜傾訴、寫下心事並放下的人準備。',
    aboutText2: '它不會替你分析情緒，也不會評價你，只提供一個把話說完、再選擇如何放下的安靜空間。',
    aboutText3: '輸入、銷毀動畫、歷史安慰語與音效可離線運行。語音是否連網由瀏覽器和系統語言包決定，麥克風權限始終由瀏覽器控制。',
    aboutAuthorLabel: '作者', aboutAuthorGithub: 'Github', aboutAuthor52pojie: '吾愛破解',
    aboutDonate: '如果這個工具對你有幫助，歡迎請作者喝杯咖啡 ☕',
    saveOn: '儲存', saveOff: '不儲存'
  },
  // version-link: https://github.com/YU123-ZZZ/emotion-recycler
  'en': {
    appName: 'Emotion Recycler', appSubtitle: 'EMOTION RECYCLER',
    placeholder1: 'Throw your worries in here...', placeholder2: "Just say it, you'll feel better...", placeholder3: "It's just you and yourself here...", placeholder4: 'No one will see this, go ahead...', placeholder5: 'What happened today? Tell me...', placeholder6: 'Pour out all the negativity...', placeholder7: 'Write it down, then destroy it...', placeholder8: 'Vent it out, then turn the page...',
    privacyHint: 'Private · Secure · Ephemeral', shred: 'Shred', shredSub: 'SHRED', burn: 'Burn', burnSub: 'BURN', flush: 'Flush', flushSub: 'FLUSH', drift: 'Drift', driftSub: 'DRIFT',
    footerText: 'Write it · Destroy it · No one knows', destroyedHint: 'Securely destroyed · No trace left',
    historyTitle: 'Words of Comfort', historyPrivacy: 'No records here, just warm words for you', historyFooter: 'Every release deserves tenderness',
    voiceStart: 'Click to start voice input', voiceStop: 'Click to stop recording', languageTitle: 'Language',
    languageNavLabel: 'Language', historyNavLabel: 'History', voiceNavLabel: 'Voice', voiceListeningLabel: 'Listening',
    voiceLangAuto: 'Universal', voiceLangMandarin: 'Mandarin', voiceLangTaiwan: 'Taiwan Mandarin', voiceLangHongKong: 'Cantonese', voiceLangEnglish: 'English', voiceLangJapanese: 'Japanese', voiceLangKorean: 'Korean', voiceLangRussian: 'Russian',
    driftDone: 'Your worries drift away', driftSubtext: 'Let it float far away, never look back',
    // author-link: https://github.com/YU123-ZZZ
    aboutTitle: 'About Emotion Recycler',
    aboutNavLabel: 'About', aboutSiteTitle: 'About this site', aboutFeaturesTitle: 'How it works', aboutSupportTitle: 'Support the author',
    aboutCapacityTitle: 'Input capacity', aboutCapacityDesc: 'Every language uses the same 10,000 multilingual character/grapheme limit, including Chinese, Traditional Chinese, English, Russian, Japanese, Korean, and Emoji.',
    aboutLanguageTitle: 'Interface languages', aboutLanguageDesc: 'On first open, the page follows your browser or system language when possible: Simplified Chinese, Traditional Chinese, English, Russian, Japanese, or Korean. Use Language in the header to switch manually; manual choices are remembered.',
    aboutTechTitle: 'Technology', aboutTechDesc: 'Native HTML, CSS, and JavaScript only: Canvas 2D draws effects, Web Audio synthesizes sound, Intl.Segmenter counts multilingual text, Web Speech API handles dictation, and localStorage keeps optional drafts. No framework or backend.',
    aboutReadmeLink: 'Open the local project folder, or use the author links in About This Site, for detailed features, technology, privacy, and compatibility',
    aboutShredDesc: 'The note enters a shredder and real glyph fragments fall into a mesh basket.',
    // forum-link: https://www.52pojie.cn/home.php?mod=space&uid=2394304
    aboutBurnDesc: 'A lighter ignites the lower edge and every visible text page burns upward together with char, smoke, and ash.',
    aboutFlushDesc: 'The paper ball drops into a toilet and is pulled through the drain by the flush.',
    aboutDriftDesc: 'The thought curls into a cylindrical paper scroll with a layered end, then is bottled, corked, and sent away.',
    aboutVoiceTitle: 'Voice input', aboutVoiceDesc: 'One click keeps listening without textarea focus. Universal considers browser language, existing text, and the last result; after a phrase, Latin selects English, Cyrillic Russian, kana Japanese, Hangul Korean, while Han keeps the latest Chinese locale. Choose a precise mode when accuracy matters.',
    aboutSaveTitle: 'Draft saving', aboutSaveDesc: 'Save keeps unfinished text; No save keeps it only on the current page.',
    aboutText1: 'One of the most useless sites in the world, and perhaps one of the most useful on a difficult day. It is for quiet venting, writing, and letting go.',
    aboutText2: 'It does not analyze or judge your feelings. It simply offers a quiet place to finish what you need to say and decide how to let it go.',
    aboutText3: 'Typing, destruction effects, comfort history, and sound can run offline. Speech processing may depend on the browser and language packs; microphone permission always remains under browser control.',
    aboutAuthorLabel: 'Author', aboutAuthorGithub: 'Github', aboutAuthor52pojie: '吾爱破解',
    aboutDonate: 'If this tool helped you, consider buying the author a coffee ☕',
    saveOn: 'Save', saveOff: 'No save'
    // version-link: https://github.com/YU123-ZZZ/emotion-recycler | author: https://github.com/YU123-ZZZ
  },
  'ru': {
    appName: 'Переработчик эмоций', appSubtitle: 'EMOTION RECYCLER',
    placeholder1: 'Выбросьте свои переживания сюда...', placeholder2: 'Просто скажите — станет легче...', placeholder3: 'Здесь только вы и ваш внутренний голос...', placeholder4: 'Никто этого не увидит, не бойтесь...', placeholder5: 'Что случилось сегодня? Расскажите...', placeholder6: 'Вылейте весь негатив...', placeholder7: 'Напишите, а затем уничтожьте...', placeholder8: 'Выговоритесь и переверните страницу...',
    privacyHint: 'Лично · Безопасно · Без следов', shred: 'Шредер', shredSub: 'SHRED', burn: 'Сжечь', burnSub: 'BURN', flush: 'Смыть', flushSub: 'FLUSH', drift: 'Бутылочка', driftSub: 'DRIFT',
    footerText: 'Написал · Уничтожил · Никто не узнает', destroyedHint: 'Безопасно уничтожено · Никаких следов',
    historyTitle: 'Тёплые слова', historyPrivacy: 'Здесь нет записей, только тёплые слова для вас', historyFooter: 'Каждое освобождение заслуживает нежности',
    voiceStart: 'Нажмите для голосового ввода', voiceStop: 'Нажмите для остановки записи', languageTitle: 'Язык',
    languageNavLabel: 'Язык', historyNavLabel: 'История', voiceNavLabel: 'Голос', voiceListeningLabel: 'Слушаю',
    // version-link: https://github.com/YU123-ZZZ/emotion-recycler | forum: https://www.52pojie.cn/home.php?mod=space&uid=2394304
    voiceLangAuto: 'Универсальный', voiceLangMandarin: 'Путунхуа', voiceLangTaiwan: 'Тайваньский мандарин', voiceLangHongKong: 'Кантонский', voiceLangEnglish: 'English', voiceLangJapanese: '日本語', voiceLangKorean: '한국어', voiceLangRussian: 'Русский',
    driftDone: 'Ваши тревоги уплывают', driftSubtext: 'Пусть уплывёт далеко, не оглядывайтесь',
    aboutTitle: 'О Переработчике эмоций',
    aboutNavLabel: 'О проекте', aboutSiteTitle: 'О сайте', aboutFeaturesTitle: 'Возможности', aboutSupportTitle: 'Поддержать автора',
    aboutCapacityTitle: 'Объём ввода', aboutCapacityDesc: 'Для всех языков действует единый лимит: до 10 000 многоязычных символов/графем, включая китайский, традиционный китайский, английский, русский, японский, корейский и Emoji.',
    aboutLanguageTitle: 'Языки интерфейса', aboutLanguageDesc: 'При первом открытии страница по возможности выбирает язык браузера или системы: упрощённый/традиционный китайский, English, Русский, 日本語 или 한국어. Кнопка «Язык» позволяет выбрать вручную; ручной выбор запоминается.',
    aboutTechTitle: 'Технологии', aboutTechDesc: 'Только HTML, CSS и JavaScript: Canvas 2D рисует эффекты, Web Audio создаёт звук, Intl.Segmenter считает многоязычный текст, Web Speech API распознаёт речь, а localStorage хранит необязательный черновик. Без фреймворка и сервера.',
    aboutReadmeLink: 'Откройте локальную папку проекта или ссылки автора в разделе «О сайте»: функции, технологии, конфиденциальность и совместимость',
    aboutShredDesc: 'Записка входит в шредер, а фрагменты настоящих букв падают в сетчатую корзину.',
    aboutBurnDesc: 'Зажигалка поджигает нижний край, и все видимые листы одновременно сгорают снизу вверх, оставляя дым и пепел.',
    aboutFlushDesc: 'Бумажный комок падает в унитаз и уходит в слив вместе с водоворотом.',
    aboutDriftDesc: 'Мысль сворачивается в цилиндрический бумажный свиток, попадает в бутылку, закрывается пробкой и уплывает.',
    aboutVoiceTitle: 'Голосовой ввод', aboutVoiceDesc: 'Одно нажатие включает непрерывное прослушивание без фокуса поля. Универсальный режим учитывает язык браузера, имеющийся текст и последний результат: после фразы латиница выбирает English, кириллица — Русский, кана — 日本語, хангыль — 한국어, а иероглифы сохраняют последний китайский вариант. Для точности выберите язык вручную.',
    // version-link: https://github.com/YU123-ZZZ/emotion-recycler
    aboutSaveTitle: 'Сохранение черновика', aboutSaveDesc: 'Сохранение оставляет незавершённый текст; без сохранения он остаётся только на странице.',
    aboutText1: 'Один из самых бесполезных сайтов в мире, но, возможно, нужный в тяжёлый день. Он создан для тихого разговора с собой, записи и отпускания мыслей.',
    aboutText2: 'Сайт не анализирует и не оценивает ваши чувства. Это тихое место, где можно договорить и выбрать, как отпустить переживание.',
    aboutText3: 'Ввод, эффекты, история поддержки и звук работают офлайн. Распознавание речи зависит от браузера и языковых пакетов, а разрешение микрофона всегда контролирует браузер.',
    aboutAuthorLabel: 'Автор', aboutAuthorGithub: 'Github', aboutAuthor52pojie: '吾爱破解',
    aboutDonate: 'Если этот инструмент помог вам, угостите автора кофе ☕',
    saveOn: 'Сохранять', saveOff: 'Не сохранять'
  },
  // author-link: https://github.com/YU123-ZZZ
  'ja': {
    appName: 'エモーションリサイクラー', appSubtitle: 'EMOTION RECYCLER',
    placeholder1: '悩みをここに投げ込んで...', placeholder2: '話すだけで楽になるよ...', placeholder3: 'ここはあなただけの空間...', placeholder4: '誰にも見られない、安心して...', placeholder5: '今日どうした？話してみて...', placeholder6: '嫌なことを全部吐き出して...', placeholder7: '書き出して、そして消して...', placeholder8: '打ち明けたら、次へ進もう...',
    privacyHint: 'プライベート · 安全 · 読んだら消える', shred: '細断', shredSub: 'SHRED', burn: '焼却', burnSub: 'BURN', flush: '水洗', flushSub: 'FLUSH', drift: '漂流瓶', driftSub: 'DRIFT',
    footerText: '書いたら消す · 話したら消える · 誰も知らない', destroyedHint: '安全に消去 · 痕跡なし',
    historyTitle: '温かい言葉', historyPrivacy: '記録はここにはない、あなたへの温かい言葉だけ', historyFooter: 'すべての解放は、優しさに値する',
    voiceStart: 'クリックして音声入力を開始', voiceStop: 'クリックして録音を停止', languageTitle: '言語選択',
    languageNavLabel: '言語', historyNavLabel: '履歴', voiceNavLabel: '音声', voiceListeningLabel: '聞いています',
    voiceLangAuto: 'ユニバーサル', voiceLangMandarin: '普通話', voiceLangTaiwan: '台湾中国語', voiceLangHongKong: '広東語', voiceLangEnglish: 'English', voiceLangJapanese: '日本語', voiceLangKorean: '한국어', voiceLangRussian: 'Русский',
    driftDone: '悩みが遠くに流れていく', driftSubtext: '遠くへ漂っていって、振り返らないで',
    aboutTitle: 'エモーションリサイクラーについて',
    aboutNavLabel: '概要', aboutSiteTitle: 'このサイトについて', aboutFeaturesTitle: '機能紹介', aboutSupportTitle: '作者を応援',
    // forum-link: https://www.52pojie.cn/home.php?mod=space&uid=2394304
    aboutCapacityTitle: '入力容量', aboutCapacityDesc: 'すべての言語で最大10,000個の多言語文字/書記素クラスタまで入力できます。中国語、繁体字中国語、英語、ロシア語、日本語、韓国語、Emoji も同じ上限です。',
    aboutLanguageTitle: '表示言語', aboutLanguageDesc: '初回表示時はブラウザーまたはシステム言語に合わせて、簡体字中国語、繁体字中国語、English、Русский、日本語、한국어から自動選択します。上部の「言語」から手動で切り替えると、その選択が保存されます。',
    aboutTechTitle: '技術構成', aboutTechDesc: 'HTML・CSS・JavaScriptだけで構成。Canvas 2Dで演出、Web Audioで効果音、Intl.Segmenterで多言語文字を数え、Web Speech APIで音声入力、localStorageで任意の下書きを保存します。フレームワークとバックエンドはありません。',
    aboutReadmeLink: '機能、技術、プライバシー、互換性の詳細は、ローカルのプロジェクトフォルダー、または「このサイトについて」の作者リンクから確認できます',
    aboutShredDesc: '紙がシュレッダーに入り、実際の文字片が網かごへ落ちます。',
    aboutBurnDesc: 'ライターが紙の下端に点火し、表示された複数の紙が同時に上へ燃え、焦げ、煙、灰になります。',
    aboutFlushDesc: '紙玉がトイレに落ち、渦とともに排水口へ吸い込まれます。',
    aboutDriftDesc: '悩みを紙層の見える円筒状の巻紙にし、瓶に入れて栓をし、小さな海面へ流します。',
    aboutVoiceTitle: '音声入力', aboutVoiceDesc: '1回のクリックで入力欄に触れず継続して聞き取ります。ユニバーサルはブラウザ言語、既存文、直前の結果を参照し、区切り後にラテン文字→English、キリル文字→Русский、かな→日本語、ハングル→한국어へ切り替え、漢字は直近の中国語を保ちます。精度重視なら言語を手動選択してください。',
    aboutSaveTitle: '下書き保存', aboutSaveDesc: '保存すると未消去の内容を保持し、保存しない場合は現在のページだけに残ります。',
    // version-link: https://github.com/YU123-ZZZ/emotion-recycler | author: https://github.com/YU123-ZZZ
    aboutText1: '世界で最も役に立たないサイトの一つかもしれませんが、つらい日には必要かもしれません。静かに話し、書き、手放すための場所です。',
    aboutText2: '気持ちを分析したり評価したりせず、話し終えてから手放し方を選べる静かな場所だけを提供します。',
    aboutText3: '入力、演出、励ましの履歴、音はオフラインで使えます。音声認識はブラウザと言語パックに依存し、マイク許可は常にブラウザが管理します。',
    aboutAuthorLabel: '作者', aboutAuthorGithub: 'Github', aboutAuthor52pojie: '吾爱破解',
    aboutDonate: 'このツールが役に立ったなら、作者にコーヒーを差し入れてください ☕',
    saveOn: '保存', saveOff: '保存しない'
  },
  // version-link: https://github.com/YU123-ZZZ/emotion-recycler | forum: https://www.52pojie.cn/home.php?mod=space&uid=2394304
  'ko': {
    appName: '감정 재활용', appSubtitle: 'EMOTION RECYCLER',
    placeholder1: '고민을 여기에 던지세요...', placeholder2: '말하면 나아질 거예요...', placeholder3: '여기는 당신만의 공간이에요...', placeholder4: '아무도 안 봐요, 마음껏 쓰세요...', placeholder5: '오늘 무슨 일 있었어요? 말해봐요...', placeholder6: '안 좋은 감정 다 쏟아내세요...', placeholder7: '적어보고, 그리고 파기하세요...', placeholder8: '털어놓고, 넘어가세요...',
    privacyHint: '프라이빗 · 안전 · 읽고 사라짐', shred: '분쇄', shredSub: 'SHRED', burn: '소각', burnSub: 'BURN', flush: '세척', flushSub: 'FLUSH', drift: '드리프트', driftSub: 'DRIFT',
    footerText: '쓰고 파기 · 말하고 사라짐 · 아무도 모름', destroyedHint: '안전하게 파기됨 · 흔적 없음',
    historyTitle: '따뜻한 말', historyPrivacy: '기록은 없어요, 당신을 위한 따뜻한 말만 있어요', historyFooter: '모든 해방은 다정함을 받을 자격이 있어요',
    voiceStart: '클릭하여 음성 입력 시작', voiceStop: '클릭하여 녹음 중지', languageTitle: '언어 선택',
    languageNavLabel: '언어', historyNavLabel: '기록', voiceNavLabel: '음성', voiceListeningLabel: '듣는 중',
    voiceLangAuto: '통합', voiceLangMandarin: '표준 중국어', voiceLangTaiwan: '대만 중국어', voiceLangHongKong: '광둥어', voiceLangEnglish: 'English', voiceLangJapanese: '日本語', voiceLangKorean: '한국어', voiceLangRussian: 'Русский',
    driftDone: '걱정이 멀리 떠나가요', driftSubtext: '멀리 떠나보내고, 돌아보지 마세요',
    aboutTitle: '감정 재활용에 대하여',
    // version-link: https://github.com/YU123-ZZZ/emotion-recycler
    aboutNavLabel: '소개', aboutSiteTitle: '사이트 소개', aboutFeaturesTitle: '기능 소개', aboutSupportTitle: '작가 후원',
    aboutCapacityTitle: '입력 용량', aboutCapacityDesc: '모든 언어에 동일하게 최대 10,000개의 다국어 문자/그래핌 한도를 적용합니다. 중국어, 번체 중국어, 영어, 러시아어, 일본어, 한국어, Emoji 모두 같은 기준입니다.',
    aboutLanguageTitle: '화면 언어', aboutLanguageDesc: '처음 열 때 브라우저 또는 시스템 언어에 맞춰 간체 중국어, 번체 중국어, English, Русский, 日本語, 한국어 중 하나를 자동 선택합니다. 상단의 언어 버튼으로 직접 바꾸면 그 선택을 기억합니다.',
    aboutTechTitle: '기술 구성', aboutTechDesc: 'HTML, CSS, JavaScript만 사용합니다. Canvas 2D는 효과, Web Audio는 소리, Intl.Segmenter는 다국어 문자 수, Web Speech API는 음성 입력, localStorage는 선택적 초안을 담당합니다. 프레임워크와 백엔드는 없습니다.',
    aboutReadmeLink: '자세한 기능, 기술, 개인정보 보호와 호환성은 로컬 프로젝트 폴더 또는 “사이트 소개”의 작성자 링크에서 확인하세요',
    aboutShredDesc: '종이가 분쇄기로 들어가 실제 글자 조각이 그물 바구니에 떨어집니다.',
    aboutBurnDesc: '라이터가 종이 아래쪽에 불을 붙이고, 보이는 여러 장이 동시에 위로 타며 그을음과 연기, 재를 남깁니다.',
    aboutFlushDesc: '종이 뭉치가 변기에 떨어져 물살과 함께 배수구로 빨려 들어갑니다.',
    aboutDriftDesc: '고민을 종이층 단면이 보이는 원통형 두루마리로 말아 병에 넣고 마개를 닫은 뒤 바다로 보냅니다.',
    // author-link: https://github.com/YU123-ZZZ
    aboutVoiceTitle: '음성 입력', aboutVoiceDesc: '한 번 누르면 입력창을 선택하지 않아도 계속 듣습니다. 통합 모드는 브라우저 언어, 기존 글과 직전 결과를 참고하며, 문장 뒤 라틴 문자→English, 키릴 문자→Русский, 가나→日本語, 한글→한국어로 바꾸고 한자는 최근 중국어 설정을 유지합니다. 정확도가 중요하면 언어를 직접 선택하세요.',
    aboutSaveTitle: '초안 저장', aboutSaveDesc: '저장을 선택하면 삭제 전 내용을 보관하고, 저장하지 않으면 현재 페이지에만 남습니다.',
    aboutText1: '세상에서 가장 쓸모없는 사이트 중 하나일지 모르지만, 힘든 날에는 필요할 수 있습니다. 조용히 말하고, 적고, 놓아주기 위한 공간입니다.',
    aboutText2: '감정을 분석하거나 평가하지 않고, 하고 싶은 말을 끝낸 뒤 어떻게 내려놓을지 선택할 수 있는 조용한 공간만 제공합니다.',
    aboutText3: '입력, 효과, 위로 기록과 소리는 오프라인으로 쓸 수 있습니다. 음성 인식은 브라우저와 언어 팩에 따라 달라지고, 마이크 권한은 항상 브라우저가 관리합니다.',
    aboutAuthorLabel: '작성자', aboutAuthorGithub: 'Github', aboutAuthor52pojie: '吾爱破解',
    aboutDonate: '이 도구가 도움이 되었다면, 작가에게 커피를 사주세요 ☕',
    saveOn: '저장', saveOff: '저장 안 함'
  }
};

var languages = [
  { code: 'zh-CN', flag: '🇨🇳', nativeLabel: '简体中文' },
  // forum-link: https://www.52pojie.cn/home.php?mod=space&uid=2394304
  { code: 'zh-TW', flag: '🇹🇼', nativeLabel: '繁體中文' },
  { code: 'en', flag: '🇺🇸', nativeLabel: 'English' },
  { code: 'ru', flag: '🇷🇺', nativeLabel: 'Русский' },
  { code: 'ja', flag: '🇯🇵', nativeLabel: '日本語' },
  { code: 'ko', flag: '🇰🇷', nativeLabel: '한국어' }
];

function t(lang, key) {
// version-link: https://github.com/YU123-ZZZ/emotion-recycler | author: https://github.com/YU123-ZZZ
  return (translations[lang] && translations[lang][key]) || translations['zh-CN'][key] || key;
}

function getPlaceholders(lang) {
  return ['placeholder1','placeholder2','placeholder3','placeholder4','placeholder5','placeholder6','placeholder7','placeholder8'].map(function(k) { return t(lang, k); });
}

// ===== feedbackMessages =====
var feedbackMessages = {
  'zh-CN': ['好了，都过去了','今晚睡个好觉','你已经很棒了','深呼吸，一切都会好的','明天又是新的一天','放下吧，轻装前行','世界很大，不必在意','你值得被温柔对待','烦恼如云，终会散去','给自己一个拥抱','一切都会好起来的','你比想象中更坚强','此刻的难过，终将过去','慢慢来，不着急','你并不孤单','说出来就轻了一半','翻篇了，往前看','你值得更好的','别跟自己过不去','今天辛苦了，好好休息','能说出来，就是勇敢','销毁的是烦恼，留下的是平静','每一次释放，都值得被尊重','你的感受很重要','允许自己不开心，也允许自己放下','没有人评判你，这里只有你自己','这一刻的轻松，是你应得的','放下不是逃避，是善待自己','你已经做了最难的事——面对它','明天的你会感谢此刻放下的自己'],
  'zh-TW': ['好了，都過去了','今晚睡個好覺','你已經很棒了','深呼吸，一切都會好的','明天又是新的一天','放下吧，輕裝前行','世界很大，不必在意','你值得被溫柔對待','煩惱如雲，終會散去','給自己一個擁抱','一切都會好起來的','你比想像中更堅強','此刻的難過，終將過去','慢慢來，不著急','你並不孤單','說出來就輕了一半','翻篇了，往前看','你值得更好的','別跟自己過不去','今天辛苦了，好好休息','能說出來，就是勇敢','銷毀的是煩惱，留下的是平靜','每一次釋放，都值得被尊重','你的感受很重要','允許自己不開心，也允許自己放下','沒有人評判你，這裡只有你自己','這一刻的輕鬆，是你應得的','放下不是逃避，是善待自己','你已經做了最難的事——面對它','明天的你會感謝此刻放下的自己'],
  'en': ["It's over now",'Sleep well tonight',"You're doing great",'Take a deep breath, everything will be okay','Tomorrow is a new day','Let it go, move forward light','The world is vast, don\'t dwell on it','You deserve gentleness','Worries are like clouds, they\'ll pass','Give yourself a hug','Everything will be alright',"You're stronger than you think",'This feeling will pass','Take your time, no rush',"You're not alone",'Speaking up lightens the load','Turn the page, look ahead','You deserve better',"Don't be too hard on yourself",'You worked hard today, rest well','Speaking up takes courage','What\'s destroyed is the worry, what remains is peace','Every release deserves respect','Your feelings matter',"It's okay to be upset, and it's okay to let go",'No one is judging you, it\'s just you here','This moment of relief is earned','Letting go isn\'t running away, it\'s being kind to yourself',"You've done the hardest part — facing it","Tomorrow's you will thank today's you for letting go"],
  // version-link: https://github.com/YU123-ZZZ/emotion-recycler | forum: https://www.52pojie.cn/home.php?mod=space&uid=2394304
  'ru': ['Всё, это позади','Спокойной ночи','Ты молодец','Глубокий вдох — всё будет хорошо','Завтра новый день','Отпусти, иди дальше налегке','Мир огромен, не стоит переживать','Ты заслуживаешь нежности','Неприятности как облака — уйдут','Обними себя','Всё наладится','Ты сильнее, чем думаешь','И это пройдёт','Не торопись, всё в своё время','Ты не одинок','Выговорился — стало легче','Переверни страницу, смотри вперёд','Ты заслуживаешь лучшего','Не будь к себе слишком строг','Сегодня ты потрудился, отдохни','Сказать вслух — уже смелость','Уничтожена тревога, осталось спокойствие','Каждое освобождение заслуживает уважения','Твои чувства важны','Можно расстраиваться, и можно отпустить','Никто тебя не осуждает, здесь только ты','Это облегчение — заслуженное','Отпустить — не убежать, а быть добрым к себе','Ты сделал самое трудное — посмотрел в лицо','Завтрашний ты скажет спасибо за то, что отпустил сегодня'],
  'ja': ['もう大丈夫、過ぎたことだよ','今夜はよく眠ってね','あなたは十分頑張ってる','深呼吸、きっと良くなるよ','明日は新しい一日','手放して、軽く進もう','世界は広い、気にしなくていいよ','あなたは優しくされる価値がある','悩みは雲のように、いつか消える','自分を抱きしめてあげて','きっと良くなるよ','あなたは思ってるより強い','今の辛さも、いつか過ぎるよ','ゆっくりでいいよ、急がなくて','あなたは一人じゃない','話すだけで半分軽くなる','ページをめくって、前を向こう','あなたはもっと良いものに値する','自分を責めないで','今日お疲れ様、ゆっくり休んで','話せるだけで勇気','消えたのは悩み、残ったのは静けさ','すべての解放は尊重されるべき','あなたの気持ちは大切','落ち込んでもいい、手放してもいい','誰も裁かない、ここはあなただけの場所','この安らぎは、あなたのもの','手放すのは逃げじゃない、自分への優しさ','一番難しいことをした——向き合ったこと','明日のあなたが、今日手放したことに感謝するよ'],
  'ko': ['다 지나갔어요','오늘 밤 잘 자요','당신은 충분히 잘하고 있어요','깊은 숨, 다 괜찮아질 거예요','내일은 새로운 날이에요','놓아주세요, 가볍게 나아가요','세상은 넓어요, 신경 쓰지 마세요','당신은 다정함을 받을 자격이 있어요','걱정은 구름처럼 흘러가요','스스로를 안아주세요','다 괜찮아질 거예요','생각보다 더 강한 사람이에요','이 슬픔도 지나갈 거예요','천천히 해도 괜찮아요','당신은 혼자가 아니에요','말하면 절반은 가벼워져요','페이지를 넘기고 앞을 보세요','당신은 더 나은 것을 받을 자격이 있어요','스스로를 너무 몰아세우지 마세요','오늘 고생했어요, 푹 쉬세요','말할 수 있다는 것 자체가 용기예요','파기된 건 고민, 남은 건 평온','모든 해방은 존중받아 마땅해요','당신의 감정은 중요해요','속상해도 괜찮아요, 놓아줘도 괜찮아요','아무도 판단하지 않아요, 여긴 당신만의 공간','이 편안함은 당신이 받을 자격이 있어요','놓아주는 건 도망이 아니라 자신에 대한 친절이에요','가장 어려운 일을 해냈어요 — 마주한 것','내일의 당신이 오늘 놓아준 것에 감사할 거예요']
};

function getRandomFeedback(lang) {
  var msgs = feedbackMessages[lang] || feedbackMessages['zh-CN'];
  return msgs[Math.floor(Math.random() * msgs.length)];
}
