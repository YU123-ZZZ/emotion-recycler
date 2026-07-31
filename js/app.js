// ===== Store (pub/sub) =====
const GITHUB_REPO_URL = 'https://github.com/YU123-ZZZ/emotion-recycler'
const UI_LANGUAGE_STORAGE_KEY = 'lang'
const UI_LANGUAGE_SOURCE_STORAGE_KEY = 'langSource'
const LANGUAGE_SOURCE_AUTO = 'auto'
const LANGUAGE_SOURCE_MANUAL = 'manual'
// version-link: https://github.com/YU123-ZZZ/emotion-recycler
const DEFAULT_INTERFACE_LANGUAGE = 'zh-CN'
const SUPPORTED_INTERFACE_LANGUAGES = ['zh-CN', 'zh-TW', 'en', 'ru', 'ja', 'ko']

function getBrowserLanguageHints() {
  const hints = []
  if (typeof Intl !== 'undefined' && Intl.DateTimeFormat) {
    try {
      const systemLocale = Intl.DateTimeFormat().resolvedOptions().locale
      if (systemLocale) hints.push(systemLocale)
    } catch (e) {
      // Some older browsers can expose Intl partially. Navigator hints below still work.
    }
    // author-link: https://github.com/YU123-ZZZ
  }
  if (typeof navigator !== 'undefined') {
    if (Array.isArray(navigator.languages)) hints.push(...navigator.languages)
    if (navigator.language) hints.push(navigator.language)
    if (navigator.userLanguage) hints.push(navigator.userLanguage)
  }
  return hints.filter(Boolean)
}

function normalizeLanguageTag(tag) {
// forum-link: https://www.52pojie.cn/home.php?mod=space&uid=2394304
  return String(tag || '').trim().replace(/_/g, '-').toLowerCase()
}

function matchSupportedInterfaceLanguage(tag) {
  const normalized = normalizeLanguageTag(tag)
  if (!normalized) return null
  if (normalized === 'zh-tw' || normalized === 'zh-hk' || normalized === 'zh-mo' || normalized.includes('hant')) return 'zh-TW'
  if (normalized === 'zh' || normalized === 'zh-cn' || normalized === 'zh-sg' || normalized === 'zh-my' || normalized.includes('hans')) return 'zh-CN'
  if (normalized.startsWith('en')) return 'en'
  if (normalized.startsWith('ru')) return 'ru'
  if (normalized.startsWith('ja')) return 'ja'
  if (normalized.startsWith('ko')) return 'ko'
  return null
  // version-link: https://github.com/YU123-ZZZ/emotion-recycler | author: https://github.com/YU123-ZZZ
}

function resolveSystemInterfaceLanguage(fallback = DEFAULT_INTERFACE_LANGUAGE) {
  for (const hint of getBrowserLanguageHints()) {
    const matched = matchSupportedInterfaceLanguage(hint)
    if (matched) return matched
  }
  return fallback
  // version-link: https://github.com/YU123-ZZZ/emotion-recycler | forum: https://www.52pojie.cn/home.php?mod=space&uid=2394304
}

function isSupportedInterfaceLanguage(language) {
  return SUPPORTED_INTERFACE_LANGUAGES.includes(language)
}

function resolveInitialInterfaceLanguagePreference() {
  const storedSource = localStorage.getItem(UI_LANGUAGE_SOURCE_STORAGE_KEY)
  const storedLanguage = localStorage.getItem(UI_LANGUAGE_STORAGE_KEY)

  if (storedSource === LANGUAGE_SOURCE_MANUAL && isSupportedInterfaceLanguage(storedLanguage)) {
    return { language: storedLanguage, source: LANGUAGE_SOURCE_MANUAL }
    // version-link: https://github.com/YU123-ZZZ/emotion-recycler
  }

  return { language: resolveSystemInterfaceLanguage(), source: LANGUAGE_SOURCE_AUTO }
}

function persistInterfaceLanguagePreference(language, source) {
  localStorage.setItem(UI_LANGUAGE_STORAGE_KEY, language)
  localStorage.setItem(UI_LANGUAGE_SOURCE_STORAGE_KEY, source || LANGUAGE_SOURCE_AUTO)
}

function shouldFollowSystemInterfaceLanguage(state) {
// author-link: https://github.com/YU123-ZZZ
  return state.languagePreferenceSource !== LANGUAGE_SOURCE_MANUAL
}

const initialInterfaceLanguagePreference = resolveInitialInterfaceLanguagePreference()
const initialTextState = normalizeGraphemeText(localStorage.getItem('draftText') || '', MAX_GRAPHEMES)

const store = {
// forum-link: https://www.52pojie.cn/home.php?mod=space&uid=2394304
  state: {
    text: initialTextState.text,
    textLength: initialTextState.count,
    mode: 'idle',
    destroyMode: null,
    feedbackMessage: '',
    showDriftBottle: false,
    showHistory: false,
    language: initialInterfaceLanguagePreference.language,
    languagePreferenceSource: initialInterfaceLanguagePreference.source,
    showLanguage: false,
    // version-link: https://github.com/YU123-ZZZ/emotion-recycler | author: https://github.com/YU123-ZZZ
    voiceLanguage: localStorage.getItem('voiceLanguage') || 'auto',
    showVoiceLanguage: false,
    showAbout: false,
    aboutTab: 'site',
    saveDraft: localStorage.getItem('saveDraft') !== 'off',
  },
  listeners: [],
  getState() { return this.state },
  setState(partial) {
  // version-link: https://github.com/YU123-ZZZ/emotion-recycler | forum: https://www.52pojie.cn/home.php?mod=space&uid=2394304
    let changed = false
    Object.keys(partial).forEach(key => {
      if (!Object.is(this.state[key], partial[key])) changed = true
    })
    if (!changed) return
    Object.assign(this.state, partial)
    this.listeners.forEach(fn => fn(this.state))
  },
  subscribe(fn) {
    this.listeners.push(fn)
    return () => { this.listeners = this.listeners.filter(l => l !== fn) }
  }
}
// version-link: https://github.com/YU123-ZZZ/emotion-recycler

// ===== DOM References =====
const $ = (sel) => document.querySelector(sel)
const $$ = (sel) => document.querySelectorAll(sel)

let els = {}

function cacheDom() {
// author-link: https://github.com/YU123-ZZZ
  els = {
    app: $('#app'),
    textarea: $('#textarea'),
    inputSection: $('#inputSection'),
    inputContainer: $('#inputContainer'),
    charCount: $('#charCount'),
    charCountNum: $('#charCountNum'),
    privacyHint: $('#privacyHint'),
    destroySection: $('#destroySection'),
    footerText: $('#footerText'),
    appTitle: $('#appTitle'),
    appSubtitle: $('#appSubtitle'),
    // forum-link: https://www.52pojie.cn/home.php?mod=space&uid=2394304
    langBtn: $('#langBtn'),
    langBtnLabel: $('#langBtnLabel'),
    aboutBtn: $('#aboutBtn'),
    historyBtn: $('#historyBtn'),
    historyBtnLabel: $('#historyBtnLabel'),
    voiceControl: $('#voiceControl'),
    voiceBtn: $('#voiceBtn'),
    voiceBtnLabel: $('#voiceBtnLabel'),
    voiceIconMic: $('#voiceIconMic'),
    voiceIconMicOff: $('#voiceIconMicOff'),
    // version-link: https://github.com/YU123-ZZZ/emotion-recycler | author: https://github.com/YU123-ZZZ
    voiceLangBtn: $('#voiceLangBtn'),
    voiceLangCurrent: $('#voiceLangCurrent'),
    voiceLangMenu: $('#voiceLangMenu'),
    canvasContainer: $('#canvasContainer'),
    flashOverlay: $('#flashOverlay'),
    feedbackOverlay: $('#feedbackOverlay'),
    feedbackText: $('#feedbackText'),
    // version-link: https://github.com/YU123-ZZZ/emotion-recycler | forum: https://www.52pojie.cn/home.php?mod=space&uid=2394304
    feedbackHint: $('#feedbackHint'),
    driftOverlay: $('#driftOverlay'),
    driftSea: $('#driftSea'),
    driftPaper: $('#driftPaper'),
    driftPaperInner: $('#driftPaperInner'),
    driftPaperText: $('#driftPaperText'),
    driftBottle: $('#driftBottle'),
    driftCork: $('#driftCork'),
    driftScrollInBottle: $('#driftScrollInBottle'),
    driftDone: $('#driftDone'),
    driftDoneText: $('#driftDoneText'),
    driftSubtext: $('#driftSubtext'),
    // version-link: https://github.com/YU123-ZZZ/emotion-recycler
    historyPanel: $('#historyPanel'),
    historyClose: $('#historyClose'),
    historyList: $('#historyList'),
    historyTitle: $('#historyTitle'),
    historyPrivacy: $('#historyPrivacy'),
    historyFooterText: $('#historyFooterText'),
    languagePanel: $('#languagePanel'),
    langClose: $('#langClose'),
    langList: $('#langList'),
    // author-link: https://github.com/YU123-ZZZ
    langTitle: $('#langTitle'),
    shredLabel: $('#shredLabel'),
    shredSub: $('#shredSub'),
    burnLabel: $('#burnLabel'),
    burnSub: $('#burnSub'),
    flushLabel: $('#flushLabel'),
    flushSub: $('#flushSub'),
    driftLabel: $('#driftLabel'),
    driftSub: $('#driftSub'),
    aboutPanel: $('#aboutPanel'),
    aboutClose: $('#aboutClose'),
    aboutTitle: $('#aboutTitle'),
    aboutBtnLabel: $('#aboutBtnLabel'),
    // forum-link: https://www.52pojie.cn/home.php?mod=space&uid=2394304
    aboutSiteTab: $('#aboutSiteTab'),
    aboutFeaturesTab: $('#aboutFeaturesTab'),
    aboutSitePanel: $('#aboutSitePanel'),
    aboutFeaturesPanel: $('#aboutFeaturesPanel'),
    aboutBody: $('.about-body'),
    aboutSiteTitle: $('#aboutSiteTitle'),
    aboutFeaturesTitle: $('#aboutFeaturesTitle'),
    aboutText1: $('#aboutText1'),
    // version-link: https://github.com/YU123-ZZZ/emotion-recycler | author: https://github.com/YU123-ZZZ
    aboutText2: $('#aboutText2'),
    aboutText3: $('#aboutText3'),
    aboutFeatureShredTitle: $('#aboutFeatureShredTitle'),
    aboutFeatureShredDesc: $('#aboutFeatureShredDesc'),
    aboutFeatureBurnTitle: $('#aboutFeatureBurnTitle'),
    aboutFeatureBurnDesc: $('#aboutFeatureBurnDesc'),
    aboutFeatureFlushTitle: $('#aboutFeatureFlushTitle'),
    aboutFeatureFlushDesc: $('#aboutFeatureFlushDesc'),
    aboutFeatureDriftTitle: $('#aboutFeatureDriftTitle'),
    aboutFeatureDriftDesc: $('#aboutFeatureDriftDesc'),
    aboutFeatureVoiceTitle: $('#aboutFeatureVoiceTitle'),
    aboutFeatureVoiceDesc: $('#aboutFeatureVoiceDesc'),
    // version-link: https://github.com/YU123-ZZZ/emotion-recycler | forum: https://www.52pojie.cn/home.php?mod=space&uid=2394304
    aboutFeatureSaveTitle: $('#aboutFeatureSaveTitle'),
    aboutFeatureSaveDesc: $('#aboutFeatureSaveDesc'),
    aboutFeatureLanguageTitle: $('#aboutFeatureLanguageTitle'),
    aboutFeatureLanguageDesc: $('#aboutFeatureLanguageDesc'),
    aboutFeatureTechTitle: $('#aboutFeatureTechTitle'),
    aboutFeatureTechDesc: $('#aboutFeatureTechDesc'),
    aboutCapacityTitle: $('#aboutCapacityTitle'),
    aboutCapacityDesc: $('#aboutCapacityDesc'),
    aboutReadmeLink: $('#aboutReadmeLink'),
    aboutAuthor: $('#aboutAuthor'),
    // version-link: https://github.com/YU123-ZZZ/emotion-recycler
    aboutDonate: $('#aboutDonate'),
    saveToggle: $('#saveToggle'),
    toggleSaveOn: $('#toggleSaveOn'),
    toggleSaveOff: $('#toggleSaveOff'),
  }
}

// ===== Render =====
let lastLanguage = ''
// author-link: https://github.com/YU123-ZZZ
let lastPersistedLanguage = ''
let lastPersistedLanguageSource = ''
let lastIsDestroying = false
let lastShowHistory = false
let lastShowLanguage = false
let lastShowAbout = false
let lastShowDrift = false
let lastRenderedText = null
let lastRenderedTextLength = -1

const voiceLanguages = [
// forum-link: https://www.52pojie.cn/home.php?mod=space&uid=2394304
  { code: 'auto', labelKey: 'voiceLangAuto' },
  { code: 'zh-CN', labelKey: 'voiceLangMandarin' },
  { code: 'zh-TW', labelKey: 'voiceLangTaiwan' },
  { code: 'zh-HK', labelKey: 'voiceLangHongKong' },
  { code: 'en-US', labelKey: 'voiceLangEnglish' },
  { code: 'ja-JP', labelKey: 'voiceLangJapanese' },
  { code: 'ko-KR', labelKey: 'voiceLangKorean' },
  { code: 'ru-RU', labelKey: 'voiceLangRussian' },
]
// version-link: https://github.com/YU123-ZZZ/emotion-recycler | author: https://github.com/YU123-ZZZ

function render(state) {
  const lang = state.language
  const languageSource = state.languagePreferenceSource || LANGUAGE_SOURCE_AUTO

  // Only do full text update if language actually changed
  if (lang !== lastLanguage) {
    lastLanguage = lang
    document.documentElement.lang = lang
    updateAllText(lang)
  }
  if (lang !== lastPersistedLanguage || languageSource !== lastPersistedLanguageSource) {
    lastPersistedLanguage = lang
    // version-link: https://github.com/YU123-ZZZ/emotion-recycler | forum: https://www.52pojie.cn/home.php?mod=space&uid=2394304
    lastPersistedLanguageSource = languageSource
    persistInterfaceLanguagePreference(lang, languageSource)
  }

  // Mode visibility — only touch DOM when value changes
  const isDestroying = state.mode === 'destroying' || state.mode === 'feedback'
  if (isDestroying !== lastIsDestroying) {
    lastIsDestroying = isDestroying
    // version-link: https://github.com/YU123-ZZZ/emotion-recycler
    els.inputSection.style.opacity = isDestroying ? '0' : '1'
    els.inputSection.style.transform = isDestroying ? 'scale(0.97)' : 'scale(1)'
    els.inputSection.style.pointerEvents = isDestroying ? 'none' : ''
    els.destroySection.style.opacity = isDestroying ? '0' : '1'
    els.destroySection.style.transform = isDestroying ? 'translateY(1.5rem)' : 'translateY(0)'
    els.destroySection.style.pointerEvents = isDestroying ? 'none' : ''
  }

  // Textarea value and count — only update when text changes to preserve cursor position and keep long notes smooth.
  const textLength = getStateTextLength(state)
  if (state.text !== lastRenderedText || textLength !== lastRenderedTextLength) {
    lastRenderedText = state.text
    // author-link: https://github.com/YU123-ZZZ
    lastRenderedTextLength = textLength
    if (els.textarea.value !== state.text) {
      els.textarea.value = state.text
    }
    els.charCountNum.textContent = textLength + ' / ' + MAX_GRAPHEMES
  }

  // Panel visibility — only touch DOM when value changes
  if (state.showHistory !== lastShowHistory) {
    lastShowHistory = state.showHistory
    // forum-link: https://www.52pojie.cn/home.php?mod=space&uid=2394304
    els.historyPanel.style.display = state.showHistory ? '' : 'none'
  }
  if (state.showLanguage !== lastShowLanguage) {
    lastShowLanguage = state.showLanguage
    els.languagePanel.style.display = state.showLanguage ? '' : 'none'
    if (!state.showLanguage) els.langList.innerHTML = ''
  }
  // version-link: https://github.com/YU123-ZZZ/emotion-recycler | author: https://github.com/YU123-ZZZ
  if (state.showAbout !== lastShowAbout) {
    lastShowAbout = state.showAbout
    els.aboutPanel.style.display = state.showAbout ? '' : 'none'
  }
  if (state.showDriftBottle !== lastShowDrift) {
    lastShowDrift = state.showDriftBottle
    els.driftOverlay.style.display = state.showDriftBottle ? '' : 'none'
  }

  // Language list (only when open)
  if (state.showLanguage) {
  // version-link: https://github.com/YU123-ZZZ/emotion-recycler | forum: https://www.52pojie.cn/home.php?mod=space&uid=2394304
    renderLanguageList(lang)
  }

  const voiceOption = voiceLanguages.find(option => option.code === state.voiceLanguage) || voiceLanguages[0]
  const activeLocaleOption = voiceLanguages.find(option => option.code === voiceRecognition.getCurrentLocale())
  const activeLocaleLabel = activeLocaleOption ? t(lang, activeLocaleOption.labelKey) : ''
  els.voiceLangCurrent.textContent = state.voiceLanguage === 'auto' && voiceRecognition.getIsActive() && activeLocaleLabel
    ? t(lang, voiceOption.labelKey) + ' · ' + activeLocaleLabel
    : t(lang, voiceOption.labelKey)
  els.voiceLangMenu.style.display = state.showVoiceLanguage ? '' : 'none'
  els.voiceLangBtn.setAttribute('aria-expanded', String(state.showVoiceLanguage))
  if (state.showVoiceLanguage) {
    renderVoiceLanguageMenu(state.voiceLanguage, lang)
    // version-link: https://github.com/YU123-ZZZ/emotion-recycler
  }

  // About panel (only when open)
  if (state.showAbout) {
    const showSite = state.aboutTab !== 'features'
    els.aboutSiteTab.classList.toggle('active', showSite)
    els.aboutFeaturesTab.classList.toggle('active', !showSite)
    els.aboutSiteTab.setAttribute('aria-selected', String(showSite))
    els.aboutFeaturesTab.setAttribute('aria-selected', String(!showSite))
    els.aboutSiteTab.tabIndex = showSite ? 0 : -1
    els.aboutFeaturesTab.tabIndex = showSite ? -1 : 0
    els.aboutSitePanel.hidden = !showSite
    els.aboutFeaturesPanel.hidden = showSite
    // author-link: https://github.com/YU123-ZZZ
    els.aboutTitle.textContent = t(lang, 'aboutTitle')
    els.aboutSiteTitle.textContent = t(lang, 'aboutSiteTitle')
    els.aboutFeaturesTitle.textContent = t(lang, 'aboutFeaturesTitle')
    els.aboutText1.textContent = t(lang, 'aboutText1')
    els.aboutText2.textContent = t(lang, 'aboutText2')
    els.aboutText3.textContent = t(lang, 'aboutText3')
    els.aboutFeatureShredTitle.textContent = t(lang, 'shred')
    els.aboutFeatureShredDesc.textContent = t(lang, 'aboutShredDesc')
    // forum-link: https://www.52pojie.cn/home.php?mod=space&uid=2394304
    els.aboutFeatureBurnTitle.textContent = t(lang, 'burn')
    els.aboutFeatureBurnDesc.textContent = t(lang, 'aboutBurnDesc')
    els.aboutFeatureFlushTitle.textContent = t(lang, 'flush')
    els.aboutFeatureFlushDesc.textContent = t(lang, 'aboutFlushDesc')
    els.aboutFeatureDriftTitle.textContent = t(lang, 'drift')
    els.aboutFeatureDriftDesc.textContent = t(lang, 'aboutDriftDesc')
    els.aboutFeatureVoiceTitle.textContent = t(lang, 'aboutVoiceTitle')
    els.aboutFeatureVoiceDesc.textContent = t(lang, 'aboutVoiceDesc')
    els.aboutFeatureSaveTitle.textContent = t(lang, 'aboutSaveTitle')
    els.aboutFeatureSaveDesc.textContent = t(lang, 'aboutSaveDesc')
    els.aboutFeatureLanguageTitle.textContent = t(lang, 'aboutLanguageTitle')
    els.aboutFeatureLanguageDesc.textContent = t(lang, 'aboutLanguageDesc')
    // version-link: https://github.com/YU123-ZZZ/emotion-recycler | author: https://github.com/YU123-ZZZ
    els.aboutFeatureTechTitle.textContent = t(lang, 'aboutTechTitle')
    els.aboutFeatureTechDesc.textContent = t(lang, 'aboutTechDesc')
    els.aboutCapacityTitle.textContent = t(lang, 'aboutCapacityTitle')
    els.aboutCapacityDesc.textContent = t(lang, 'aboutCapacityDesc')
    els.aboutReadmeLink.textContent = t(lang, 'aboutReadmeLink')
    els.aboutAuthor.textContent = ''
    const authorLabel = t(lang, 'aboutAuthorLabel')
    // version-link: https://github.com/YU123-ZZZ/emotion-recycler | forum: https://www.52pojie.cn/home.php?mod=space&uid=2394304
    const authorGitHub = t(lang, 'aboutAuthorGithub')
    const author52pojie = t(lang, 'aboutAuthor52pojie')
    els.aboutAuthor.append(document.createTextNode(authorLabel + '：'))
    const authorGitHubLink = document.createElement('a')
    authorGitHubLink.href = GITHUB_REPO_URL
    authorGitHubLink.target = '_blank'
    authorGitHubLink.rel = 'noopener'
    // version-link: https://github.com/YU123-ZZZ/emotion-recycler
    authorGitHubLink.textContent = authorGitHub
    els.aboutAuthor.append(authorGitHubLink)
    els.aboutAuthor.append(document.createTextNode(' / '))
    const author52pojieLink = document.createElement('a')
    author52pojieLink.href = 'https://www.52pojie.cn/home.php?mod=space&uid=2394304'
    author52pojieLink.target = '_blank'
    author52pojieLink.rel = 'noopener'
    author52pojieLink.textContent = author52pojie
    els.aboutAuthor.append(author52pojieLink)
    els.aboutDonate.textContent = t(lang, 'aboutDonate')
    els.toggleSaveOn.textContent = t(lang, 'saveOn')
    // author-link: https://github.com/YU123-ZZZ
    els.toggleSaveOff.textContent = t(lang, 'saveOff')
    updateToggleUI(state.saveDraft)
  }
}

function getStateTextLength(state) {
  return Number.isFinite(state.textLength) ? state.textLength : countGraphemes(state.text)
}

function updateAllText(lang) {
// forum-link: https://www.52pojie.cn/home.php?mod=space&uid=2394304
  els.appTitle.textContent = t(lang, 'appName')
  els.appSubtitle.textContent = t(lang, 'appSubtitle')
  const placeholders = getPlaceholders(lang)
  els.textarea.placeholder = placeholders[Math.floor(Math.random() * placeholders.length)]
  els.privacyHint.textContent = t(lang, 'privacyHint')
  els.footerText.textContent = t(lang, 'footerText')
  els.shredLabel.textContent = t(lang, 'shred')
  els.shredSub.textContent = t(lang, 'shredSub')
  els.burnLabel.textContent = t(lang, 'burn')
  els.burnSub.textContent = t(lang, 'burnSub')
  els.flushLabel.textContent = t(lang, 'flush')
  els.flushSub.textContent = t(lang, 'flushSub')
  els.driftLabel.textContent = t(lang, 'drift')
  // version-link: https://github.com/YU123-ZZZ/emotion-recycler | author: https://github.com/YU123-ZZZ
  els.driftSub.textContent = t(lang, 'driftSub')
  els.langTitle.textContent = t(lang, 'languageTitle')
  els.historyTitle.textContent = t(lang, 'historyTitle')
  els.historyPrivacy.textContent = t(lang, 'historyPrivacy')
  els.historyFooterText.textContent = t(lang, 'historyFooter')
  els.langBtnLabel.textContent = t(lang, 'languageNavLabel')
  els.historyBtnLabel.textContent = t(lang, 'historyNavLabel')
  const isListening = voiceRecognition.getIsActive()
  // version-link: https://github.com/YU123-ZZZ/emotion-recycler | forum: https://www.52pojie.cn/home.php?mod=space&uid=2394304
  els.voiceBtnLabel.textContent = t(lang, isListening ? 'voiceListeningLabel' : 'voiceNavLabel')
  els.voiceBtn.title = t(lang, isListening ? 'voiceStop' : 'voiceStart')
  els.voiceBtn.setAttribute('aria-label', els.voiceBtn.title)
  els.aboutBtn.title = t(lang, 'aboutTitle')
  els.aboutBtnLabel.textContent = t(lang, 'aboutNavLabel')
  els.langBtn.title = t(lang, 'languageTitle')
  els.historyBtn.title = t(lang, 'historyTitle')
  updateToggleUI(store.getState().saveDraft)
}

function resetAboutBodyScroll() {
  if (els.aboutBody) {
  // version-link: https://github.com/YU123-ZZZ/emotion-recycler
    els.aboutBody.scrollTop = 0
  }
}

function renderLanguageList(currentLang) {
  els.langList.innerHTML = ''
  languages.forEach(lang => {
    const btn = document.createElement('button')
    btn.className = 'lang-btn' + (lang.code === currentLang ? ' active' : '')
    btn.innerHTML = '<span class="lang-flag">' + lang.flag + '</span>' +
    // author-link: https://github.com/YU123-ZZZ
      '<span class="lang-name' + (lang.code === currentLang ? ' active' : '') + '">' + lang.flag + ' ' + lang.nativeLabel + '</span>'
    btn.addEventListener('click', () => {
      store.setState({ language: lang.code, languagePreferenceSource: LANGUAGE_SOURCE_MANUAL, showLanguage: false })
    })
    els.langList.appendChild(btn)
  })
}
// forum-link: https://www.52pojie.cn/home.php?mod=space&uid=2394304

function renderVoiceLanguageMenu(current, lang) {
  els.voiceLangMenu.innerHTML = ''
  voiceLanguages.forEach(option => {
    const btn = document.createElement('button')
    const active = option.code === current
    btn.type = 'button'
    btn.className = 'voice-lang-option' + (active ? ' active' : '')
    btn.setAttribute('role', 'menuitemradio')
    btn.setAttribute('aria-checked', String(active))
    btn.textContent = t(lang, option.labelKey)
    // version-link: https://github.com/YU123-ZZZ/emotion-recycler | author: https://github.com/YU123-ZZZ
    btn.addEventListener('click', () => {
      localStorage.setItem('voiceLanguage', option.code)
      store.setState({ voiceLanguage: option.code, showVoiceLanguage: false })
      voiceRecognition.setVoiceMode(option.code, store.getState().language)
    })
    els.voiceLangMenu.appendChild(btn)
  })
}

// ===== Particle System =====
let particleSystem = null
// version-link: https://github.com/YU123-ZZZ/emotion-recycler | forum: https://www.52pojie.cn/home.php?mod=space&uid=2394304
let particleCanvas = null

function createParticleCanvas() {
  const canvas = document.createElement('canvas')
  canvas.className = 'particle-canvas'
  canvas.setAttribute('aria-hidden', 'true')
  els.canvasContainer.innerHTML = ''
  els.canvasContainer.appendChild(canvas)
  return canvas
}

function startDestroy(mode) {
  const state = store.getState()
  // version-link: https://github.com/YU123-ZZZ/emotion-recycler
  if (state.mode !== 'idle' && state.mode !== 'input') return
  if (!state.text.trim()) return

  // Stop voice if recording
  if (voiceRecognition.getIsActive()) {
    voiceRecognition.stop()
    stopVoiceUI()
  }
  // author-link: https://github.com/YU123-ZZZ

  store.setState({ mode: 'destroying', destroyMode: mode })
  const timeline = createDestructionTimeline(mode, getStateTextLength(state))

  // Screen shake
  els.app.classList.add('screen-shake')
  setTimeout(() => els.app.classList.remove('screen-shake'), 500)

  // Flash
  const colorMap = {
    shred: 'rgba(200,200,208,0.5)',
    burn: 'rgba(255,80,0,0.35)',
    // forum-link: https://www.52pojie.cn/home.php?mod=space&uid=2394304
    flush: 'rgba(50,150,255,0.3)',
  }
  const animMap = {
    shred: 'flashWhite',
    burn: 'flashRed',
    flush: 'flashBlue',
  }
  els.flashOverlay.style.display = ''
  els.flashOverlay.style.background = colorMap[mode]
  els.flashOverlay.style.animation = animMap[mode] + ' 0.3s ease-out forwards'
  // version-link: https://github.com/YU123-ZZZ/emotion-recycler | author: https://github.com/YU123-ZZZ
  setTimeout(() => {
    els.flashOverlay.style.display = 'none'
    els.flashOverlay.style.animation = ''
  }, 300)

  // Sound and visuals share the same length-aware timeline.
  soundManager.playForMode(mode, timeline)
  // version-link: https://github.com/YU123-ZZZ/emotion-recycler | forum: https://www.52pojie.cn/home.php?mod=space&uid=2394304
  switch (mode) {
    case 'shred': vibrateShred(); break
    case 'burn': vibrateBurn(); break
    case 'flush':
      vibrateFlush()
      break
  }

  // Particle animation
  particleCanvas = createParticleCanvas()
  particleSystem = new ParticleSystem(particleCanvas)
  // version-link: https://github.com/YU123-ZZZ/emotion-recycler
  particleSystem.start(state.text, mode, timeline, () => {
    soundManager.stopAll()
    els.canvasContainer.innerHTML = ''
    particleCanvas = null
    particleSystem = null
    const msg = getRandomFeedback(state.language)
    store.setState({ mode: 'feedback', feedbackMessage: msg, text: '', textLength: 0, destroyMode: null })
    localStorage.removeItem('draftText')
    showFeedback(msg)
    // author-link: https://github.com/YU123-ZZZ
  })
}

function stopDestroy() {
  if (particleSystem) {
    particleSystem.stop()
    particleSystem = null
  }
  if (particleCanvas) {
    els.canvasContainer.innerHTML = ''
    particleCanvas = null
  }
  soundManager.stopAll()
  // forum-link: https://www.52pojie.cn/home.php?mod=space&uid=2394304
  stopHistoryScroll()
  hideFeedback()
}

// ===== Feedback =====
let feedbackTimer1 = null
let feedbackTimer2 = null

function showFeedback(message) {
// version-link: https://github.com/YU123-ZZZ/emotion-recycler | author: https://github.com/YU123-ZZZ
  const lang = store.getState().language
  els.feedbackOverlay.style.display = ''
  els.feedbackOverlay.style.animation = 'fadeInUp 0.8s ease-out forwards'
  els.feedbackText.textContent = message
  els.feedbackHint.textContent = t(lang, 'destroyedHint')

  feedbackTimer1 = setTimeout(() => {
    els.feedbackOverlay.style.animation = 'fadeOutDown 0.8s ease-out forwards'
  }, 2500)

  feedbackTimer2 = setTimeout(() => {
    els.feedbackOverlay.style.display = 'none'
    // version-link: https://github.com/YU123-ZZZ/emotion-recycler | forum: https://www.52pojie.cn/home.php?mod=space&uid=2394304
    els.feedbackOverlay.style.animation = ''
    store.setState({ mode: 'idle', text: '', textLength: 0, destroyMode: null, feedbackMessage: '' })
  }, 3300)
}

function hideFeedback() {
  clearTimeout(feedbackTimer1)
  clearTimeout(feedbackTimer2)
  els.feedbackOverlay.style.display = 'none'
  els.feedbackOverlay.style.animation = ''
  // version-link: https://github.com/YU123-ZZZ/emotion-recycler
}

// ===== Drift Bottle =====
let driftTimers = []

function showDriftBottle() {
  const state = store.getState()
  // author-link: https://github.com/YU123-ZZZ
  if (!state.text.trim()) return

  // Stop voice if recording
  if (voiceRecognition.getIsActive()) {
    voiceRecognition.stop()
    stopVoiceUI()
  }

  const lang = state.language
  const text = state.text
  const timeline = createDestructionTimeline('drift', getStateTextLength(state))
  // forum-link: https://www.52pojie.cn/home.php?mod=space&uid=2394304
  const phaseDuration = (name) => timeline.phases[name].endMs - timeline.phases[name].startMs
  store.setState({ showDriftBottle: true, mode: 'destroying', destroyMode: 'drift' })

  soundManager.playForMode('drift', timeline)
  vibrateDriftBottle()

  // Reset all elements
  els.driftPaper.className = 'drift-paper'
  els.driftPaper.style.display = ''
  // version-link: https://github.com/YU123-ZZZ/emotion-recycler | author: https://github.com/YU123-ZZZ
  els.driftBottle.className = 'drift-bottle'
  els.driftBottle.style.display = 'none'
  els.driftSea.className = 'drift-sea'
  els.driftDone.style.display = 'none'
  els.driftCork.classList.remove('closed')
  els.driftScrollInBottle.setAttribute('opacity', '0')
  els.driftOverlay.style.setProperty('--paper-enter-ms', phaseDuration('paperEnter') + 'ms')
  els.driftOverlay.style.setProperty('--paper-roll-ms', phaseDuration('roll') + 'ms')
  els.driftOverlay.style.setProperty('--bottle-enter-ms', phaseDuration('bottle') + 'ms')
  els.driftOverlay.style.setProperty('--bottle-throw-ms', phaseDuration('throw') + 'ms')

  // Show a few real handwritten pages while keeping 10,000-character notes lightweight.
  const graphemes = splitGraphemes(text)
  // version-link: https://github.com/YU123-ZZZ/emotion-recycler | forum: https://www.52pojie.cn/home.php?mod=space&uid=2394304
  const charsPerPage = 230
  const maxPages = window.innerWidth < 520 ? 3 : 4
  const pageCount = Math.max(1, Math.min(maxPages, Math.ceil(graphemes.length / charsPerPage)))
  els.driftPaperInner.innerHTML = ''
  for (let page = 0; page < pageCount; page++) {
    const start = page * charsPerPage
    const end = start + charsPerPage
    let displayText = graphemes.slice(start, end).join('')
    if (page === pageCount - 1 && graphemes.length > end) displayText += '…'
    const sheet = document.createElement('div')
    sheet.className = 'drift-paper-sheet'
    sheet.style.setProperty('--sheet-index', String(page))
    sheet.style.setProperty('--sheet-tilt', ((page - (pageCount - 1) / 2) * 1.8).toFixed(2) + 'deg')
    const textEl = document.createElement('p')
    textEl.className = 'drift-paper-text'
    textEl.textContent = displayText
    sheet.appendChild(textEl)
    els.driftPaperInner.appendChild(sheet)
  }

  // Paper enters, then remains still for the length-aware preview phase.
  driftTimers.push(setTimeout(() => {
    els.driftPaper.classList.add('entering')
  }, 30))

  driftTimers.push(setTimeout(() => {
  // version-link: https://github.com/YU123-ZZZ/emotion-recycler
    els.driftPaper.classList.remove('entering')
    els.driftPaper.classList.add('rolling')
  }, timeline.phases.roll.startMs))

  driftTimers.push(setTimeout(() => {
    els.driftPaper.style.display = 'none'
    els.driftBottle.style.display = ''
    els.driftBottle.classList.add('entering')
  }, timeline.phases.bottle.startMs))

  driftTimers.push(setTimeout(() => {
    els.driftScrollInBottle.setAttribute('opacity', '1')
    // author-link: https://github.com/YU123-ZZZ
  }, timeline.phases.bottle.startMs + phaseDuration('bottle') * 0.45))

  driftTimers.push(setTimeout(() => {
    els.driftCork.classList.add('closed')
  }, timeline.phases.cork.startMs))

  driftTimers.push(setTimeout(() => {
    els.driftSea.classList.add('active')
    els.driftBottle.className = 'drift-bottle throwing'
  }, timeline.phases.throw.startMs))
  // forum-link: https://www.52pojie.cn/home.php?mod=space&uid=2394304

  driftTimers.push(setTimeout(() => {
    els.driftDone.style.display = ''
    els.driftDoneText.textContent = t(lang, 'driftDone') || ''
    els.driftSubtext.textContent = t(lang, 'driftSubtext') || ''
  }, timeline.phases.finish.startMs))

  driftTimers.push(setTimeout(() => {
  // version-link: https://github.com/YU123-ZZZ/emotion-recycler | author: https://github.com/YU123-ZZZ
    hideDriftBottle()
    store.setState({ text: '', textLength: 0, mode: 'idle', destroyMode: null })
    localStorage.removeItem('draftText')
  }, timeline.totalMs))
}

function hideDriftBottle() {
  driftTimers.forEach(t => clearTimeout(t))
  driftTimers = []
  store.setState({ showDriftBottle: false })
  soundManager.stopAll()
  // version-link: https://github.com/YU123-ZZZ/emotion-recycler | forum: https://www.52pojie.cn/home.php?mod=space&uid=2394304
  els.driftOverlay.style.display = 'none'
  els.driftPaper.className = 'drift-paper'
  els.driftPaper.style.display = ''
  els.driftBottle.className = 'drift-bottle'
  els.driftBottle.style.display = 'none'
  els.driftSea.className = 'drift-sea'
  els.driftDone.style.display = 'none'
  els.driftCork.classList.remove('closed')
  els.driftScrollInBottle.setAttribute('opacity', '0')
  // version-link: https://github.com/YU123-ZZZ/emotion-recycler
}

function updateToggleUI(saveDraft) {
  els.toggleSaveOn.classList.toggle('active', saveDraft)
  els.toggleSaveOff.classList.toggle('active', !saveDraft)
  const lang = store.getState().language
  els.toggleSaveOn.textContent = t(lang, 'saveOn')
  els.toggleSaveOff.textContent = t(lang, 'saveOff')
}

// ===== History Panel =====
let historyFloatTimer = null
let historyCurrentIndex = 0
// author-link: https://github.com/YU123-ZZZ
let historyActive = false

const encouragements = [
  { 'zh-CN': '每一次释放，都是一次成长', 'zh-TW': '每一次釋放，都是一次成長', 'en': 'Every release is a step forward', 'ru': 'Каждое освобождение — шаг вперёд', 'ja': 'すべての解放は、成長の一步', 'ko': '모든 해방은 성장이에요' },
  { 'zh-CN': '破茧成蝶的过程虽然痛苦，但结局很美', 'zh-TW': '破繭成蝶的過程雖然痛苦，但結局很美', 'en': 'The butterfly emerges beautiful after the struggle', 'ru': 'Бабочка красивеет после борьбы', 'ja': '茧を破って蝶になる過程は辛いけど、結末は美しい', 'ko': '고통스러운 과정 끝에 아름다운 나비가 되어요' },
  { 'zh-CN': '今天也是值得被善待的一天', 'zh-TW': '今天也是值得被善待的一天', 'en': 'Today deserves kindness too', 'ru': 'Сегодня тоже заслуживает доброты', 'ja': '今日も優しくされるに値する日', 'ko': '오늘도 친절을 받을 자격이 있어요' },
  { 'zh-CN': '潮起潮落，一切都会过去的', 'zh-TW': '潮起潮落，一切都會過去的', 'en': 'Tides rise and fall, this too shall pass', 'ru': 'Прилив и отлив — и это пройдёт', 'ja': '潮の満ち引き、すべては過ぎ去る', 'ko': '밀물과 썰물, 모든 것은 지나가요' },
  { 'zh-CN': '夜晚再黑，星星也在', 'zh-TW': '夜晚再黑，星星也在', 'en': 'No matter how dark, the stars are there', 'ru': 'Как бы ни было темно, звёзды есть', 'ja': '夜がどんなに暗くても、星は在那里', 'ko': '밤이 아무리 어두워도 별은 있어요' },
  // forum-link: https://www.52pojie.cn/home.php?mod=space&uid=2394304
  { 'zh-CN': '你比自己想象的更强大', 'zh-TW': '你比自己想像的更強大', 'en': 'You are stronger than you think', 'ru': 'Вы сильнее, чем кажется', 'ja': 'あなたは思っているより強い', 'ko': '당신은 생각보다 강해요' },
  { 'zh-CN': '花会沿路盛开，你也是', 'zh-TW': '花會沿路盛開，你也是', 'en': 'Flowers bloom along the way, and so do you', 'ru': 'Цветы расцветают по пути, как и вы', 'ja': '道沿いに花が咲くように、あなたも', 'ko': '길가에 꽃이 피듯, 당신도 피어요' },
  { 'zh-CN': '允许自己不开心，也允许自己放下', 'zh-TW': '允許自己不開心，也允許自己放下', 'en': "It's okay to feel down, and it's okay to let go", 'ru': 'Можно расстроиться, можно отпустить', 'ja': '落ち込んでもいい、手放してもいい', 'ko': '속상해도 괜찮아요, 놓아줘도 괜찮아요' },
  { 'zh-CN': '风雨过后，彩虹会来的', 'zh-TW': '風雨過後，彩虹會來的', 'en': 'After the storm, the rainbow comes', 'ru': 'После бури приходит радуга', 'ja': '嵐の後には虹が来る', 'ko': '폭풍우 뒤에 무지개가 와요' },
  { 'zh-CN': '你值得被温柔以待', 'zh-TW': '你值得被溫柔以待', 'en': 'You deserve tenderness', 'ru': 'Вы заслуживаете нежности', 'ja': 'あなたは優しくされる価値がある', 'ko': '당신은 다정함을 받을 자격이 있어요' },
  { 'zh-CN': '深呼吸，一切都会好的', 'zh-TW': '深呼吸，一切都會好的', 'en': 'Take a deep breath, everything will be okay', 'ru': 'Глубокий вдох — всё будет хорошо', 'ja': '深呼吸、きっと良くなるよ', 'ko': '깊은 숨, 다 괜찮아질 거예요' },
  { 'zh-CN': '给心情放个假吧', 'zh-TW': '給心情放個假吧', 'en': 'Give your mind a break', 'ru': 'Дайте себе передышку', 'ja': '気持ちに休暇をあげて', 'ko': '마음에 휴가를 주세요' },
  { 'zh-CN': '你已经很棒了，剩下的交给时间', 'zh-TW': '你已經很棒了，剩下的交給時間', 'en': "You've done great, leave the rest to time", 'ru': 'Вы молодец, остальное — дело времени', 'ja': '十分頑張った、あとは時間に任せよう', 'ko': '이미 충분히 잘했어요, 나머지는 시간에 맡기세요' },
  { 'zh-CN': '难过的时候，记得抱抱自己', 'zh-TW': '難過的時候，記得抱抱自己', 'en': "When you're sad, remember to give yourself a hug", 'ru': 'Когда грустно, обнимите себя', 'ja': '辛いときは、自分を抱きしめて', 'ko': '슬플 때는 스스로를 안아주세요' },
  { 'zh-CN': '明天又是新的开始', 'zh-TW': '明天又是新的開始', 'en': 'Tomorrow is a new beginning', 'ru': 'Завтра — новое начало', 'ja': '明日は新しい始まり', 'ko': '내일은 새로운 시작이에요' },
  { 'zh-CN': '你不是一个人在战斗', 'zh-TW': '你不是一個人在戰鬥', 'en': "You're not fighting alone", 'ru': 'Вы не одиноки в борьбе', 'ja': 'あなたは一人で戦ってるんじゃない', 'ko': '당신은 혼자가 아니에요' },
]
// version-link: https://github.com/YU123-ZZZ/emotion-recycler | author: https://github.com/YU123-ZZZ

function renderHistory() {
  const state = store.getState()
  if (!state.showHistory) return

  const lang = state.language
  els.historyTitle.textContent = t(lang, 'historyTitle')
  els.historyPrivacy.textContent = t(lang, 'historyPrivacy')
  els.historyFooterText.textContent = t(lang, 'historyFooter')

  els.historyList.innerHTML = ''
  // version-link: https://github.com/YU123-ZZZ/emotion-recycler | forum: https://www.52pojie.cn/home.php?mod=space&uid=2394304
  els.historyList.className = 'history-float-container'

  historyCurrentIndex = 0
  historyActive = true
  spawnNextMessage(lang)
}

function spawnNextMessage(lang) {
// version-link: https://github.com/YU123-ZZZ/emotion-recycler
  if (!historyActive) return

  const state = store.getState()
  if (!state.showHistory) return

  const msg = encouragements[historyCurrentIndex][lang] || encouragements[historyCurrentIndex]['zh-CN']
  historyCurrentIndex = (historyCurrentIndex + 1) % encouragements.length

  const div = document.createElement('div')
  div.className = 'history-float-msg'
  div.textContent = msg
  // author-link: https://github.com/YU123-ZZZ
  els.historyList.appendChild(div)

  // Trigger animation
  requestAnimationFrame(() => {
    div.classList.add('visible')
  })

  // Remove after animation and spawn next
  historyFloatTimer = setTimeout(() => {
  // forum-link: https://www.52pojie.cn/home.php?mod=space&uid=2394304
    div.classList.remove('visible')
    div.classList.add('fade-out')
    setTimeout(() => {
      if (div.parentNode) div.parentNode.removeChild(div)
    }, 600)
    // Spawn next message quickly
    historyFloatTimer = setTimeout(() => {
      spawnNextMessage(lang)
    }, 200)
  }, 2200)
}

function stopHistoryScroll() {
// version-link: https://github.com/YU123-ZZZ/emotion-recycler | author: https://github.com/YU123-ZZZ
  historyActive = false
  if (historyFloatTimer) {
    clearTimeout(historyFloatTimer)
    historyFloatTimer = null
  }
}

// ===== Voice Input =====
let voiceBtnHandler = null
// version-link: https://github.com/YU123-ZZZ/emotion-recycler | forum: https://www.52pojie.cn/home.php?mod=space&uid=2394304

function voiceCallback(text, isFinal) {
  const s = store.getState()
  if (s.mode === 'destroying' || s.mode === 'feedback') return
  const normalized = normalizeGraphemeText(text, MAX_GRAPHEMES)
  const value = normalized.text
  store.setState({ text: value, textLength: normalized.count, mode: value.length > 0 ? 'input' : 'idle' })
  if (els.textarea.value !== value) els.textarea.value = value
  els.textarea.scrollTop = els.textarea.scrollHeight
  if (s.saveDraft && isFinal) {
    localStorage.setItem('draftText', value)
  }
  // version-link: https://github.com/YU123-ZZZ/emotion-recycler
}

function voiceErrorCallback() {
  stopVoiceUI()
}

function startVoice() {
  const state = store.getState()
  voiceRecognition.start(
    voiceCallback,
    // author-link: https://github.com/YU123-ZZZ
    voiceErrorCallback,
    state.voiceLanguage,
    state.text,
    state.language
  )
  startVoiceUI()
}
// forum-link: https://www.52pojie.cn/home.php?mod=space&uid=2394304

function setupVoice() {
  if (!voiceRecognition.isSupported()) {
    els.voiceControl.style.display = 'none'
    return
  }
  els.voiceControl.style.display = ''

  // Remove old listener to prevent accumulation on language switch
  if (voiceBtnHandler) {
    els.voiceBtn.removeEventListener('click', voiceBtnHandler)
    // version-link: https://github.com/YU123-ZZZ/emotion-recycler | author: https://github.com/YU123-ZZZ
  }

  voiceBtnHandler = () => {
    if (voiceRecognition.getIsActive()) {
      voiceRecognition.stop()
      stopVoiceUI()
    } else {
      startVoice()
    }
    // version-link: https://github.com/YU123-ZZZ/emotion-recycler | forum: https://www.52pojie.cn/home.php?mod=space&uid=2394304
  }

  els.voiceBtn.addEventListener('click', voiceBtnHandler)
}

function startVoiceUI() {
  els.voiceBtn.classList.add('listening')
  els.voiceIconMic.style.display = 'none'
  els.voiceIconMicOff.style.display = ''
  els.voiceBtn.title = t(store.getState().language, 'voiceStop')
  els.voiceBtnLabel.textContent = t(store.getState().language, 'voiceListeningLabel')
  // Add ripple elements
  if (!els.voiceBtn.querySelector('.voice-ripple')) {
  // version-link: https://github.com/YU123-ZZZ/emotion-recycler
    const r1 = document.createElement('span')
    r1.className = 'voice-ripple'
    const r2 = document.createElement('span')
    r2.className = 'voice-ripple'
    els.voiceBtn.appendChild(r1)
    els.voiceBtn.appendChild(r2)
  }
}
// author-link: https://github.com/YU123-ZZZ

function stopVoiceUI() {
  els.voiceBtn.classList.remove('listening')
  els.voiceIconMic.style.display = ''
  els.voiceIconMicOff.style.display = 'none'
  els.voiceBtn.title = t(store.getState().language, 'voiceStart')
  els.voiceBtnLabel.textContent = t(store.getState().language, 'voiceNavLabel')
  // Remove ripple elements
  els.voiceBtn.querySelectorAll('.voice-ripple').forEach(el => el.remove())
  // Restore focus to textarea so user can keep typing
  els.textarea.focus()
}
// forum-link: https://www.52pojie.cn/home.php?mod=space&uid=2394304

// ===== Event Bindings =====
let draftSaveTimer = null
let isComposing = false

function saveDraftDebounced(val) {
  if (draftSaveTimer) clearTimeout(draftSaveTimer)
  draftSaveTimer = setTimeout(() => {
    if (store.getState().saveDraft) {
      localStorage.setItem('draftText', val)
      // version-link: https://github.com/YU123-ZZZ/emotion-recycler | author: https://github.com/YU123-ZZZ
    }
  }, 300)
}

function acceptInputValue(rawValue, discardPendingVoice = false) {
  const state = store.getState()
  if (state.mode === 'destroying' || state.mode === 'feedback') return
  // version-link: https://github.com/YU123-ZZZ/emotion-recycler | forum: https://www.52pojie.cn/home.php?mod=space&uid=2394304
  const normalized = normalizeGraphemeText(rawValue, MAX_GRAPHEMES)
  const value = normalized.text
  store.setState({ text: value, textLength: normalized.count, mode: value.length > 0 ? 'input' : 'idle' })
  if (els.textarea.value !== value) els.textarea.value = value
  if (voiceRecognition.getIsActive()) {
    voiceRecognition.syncExternalText(value, discardPendingVoice)
  }
  if (state.saveDraft) {
    saveDraftDebounced(value)
  } else {
    if (draftSaveTimer) { clearTimeout(draftSaveTimer); draftSaveTimer = null }
    // version-link: https://github.com/YU123-ZZZ/emotion-recycler
    localStorage.removeItem('draftText')
  }
}

function bindEvents() {
  // Textarea
  els.textarea.addEventListener('input', (e) => {
    if (!isComposing) {
      const previousValue = store.getState().text
      // author-link: https://github.com/YU123-ZZZ
      const isDeletion = e.inputType
        ? e.inputType.indexOf('delete') === 0
        : e.target.value.length < previousValue.length
      acceptInputValue(e.target.value, isDeletion)
    }
  })

  els.textarea.addEventListener('compositionstart', () => {
    isComposing = true
  })

  els.textarea.addEventListener('compositionend', (e) => {
    isComposing = false
    // forum-link: https://www.52pojie.cn/home.php?mod=space&uid=2394304
    acceptInputValue(e.target.value)
  })

  els.textarea.addEventListener('focus', () => {
    els.inputContainer.classList.add('focused')
  })

  els.textarea.addEventListener('blur', () => {
  // version-link: https://github.com/YU123-ZZZ/emotion-recycler | author: https://github.com/YU123-ZZZ
    els.inputContainer.classList.remove('focused')
  })

  // Destroy buttons
  $$('.btn-destroy').forEach(btn => {
    const mode = btn.dataset.mode
    btn.addEventListener('click', () => {
      if (mode === 'drift') {
        showDriftBottle()
      } else {
        startDestroy(mode)
      }
      // version-link: https://github.com/YU123-ZZZ/emotion-recycler | forum: https://www.52pojie.cn/home.php?mod=space&uid=2394304
    })
  })

  // History button
  els.historyBtn.addEventListener('click', () => {
    const state = store.getState()
    const opening = !state.showHistory
    store.setState({ showHistory: opening })
    if (opening) {
      requestAnimationFrame(() => renderHistory())
      // version-link: https://github.com/YU123-ZZZ/emotion-recycler
    } else {
      stopHistoryScroll()
    }
  })

  els.historyClose.addEventListener('click', () => {
    stopHistoryScroll()
    // author-link: https://github.com/YU123-ZZZ
    store.setState({ showHistory: false })
  })

  els.historyPanel.addEventListener('click', (e) => {
    if (e.target === els.historyPanel || e.target.classList.contains('modal-backdrop')) {
      stopHistoryScroll()
      store.setState({ showHistory: false })
    }
  })

  // Language button
  els.langBtn.addEventListener('click', () => {
  // forum-link: https://www.52pojie.cn/home.php?mod=space&uid=2394304
    const state = store.getState()
    store.setState({ showLanguage: !state.showLanguage })
  })

  els.voiceLangBtn.addEventListener('click', (e) => {
    e.stopPropagation()
    const state = store.getState()
    store.setState({ showVoiceLanguage: !state.showVoiceLanguage })
  })
  // version-link: https://github.com/YU123-ZZZ/emotion-recycler | author: https://github.com/YU123-ZZZ

  document.addEventListener('click', (e) => {
    if (!els.voiceControl.contains(e.target) && store.getState().showVoiceLanguage) {
      store.setState({ showVoiceLanguage: false })
    }
  })

  els.langClose.addEventListener('click', () => {
    store.setState({ showLanguage: false })
  })

  els.languagePanel.addEventListener('click', (e) => {
    if (e.target === els.languagePanel || e.target.classList.contains('modal-backdrop')) {
    // version-link: https://github.com/YU123-ZZZ/emotion-recycler | forum: https://www.52pojie.cn/home.php?mod=space&uid=2394304
      store.setState({ showLanguage: false })
    }
  })

  // About panel
  els.aboutBtn.addEventListener('click', () => {
    store.setState({ showAbout: true, aboutTab: 'site' })
    resetAboutBodyScroll()
    // version-link: https://github.com/YU123-ZZZ/emotion-recycler
  })

  els.aboutSiteTab.addEventListener('click', () => {
    store.setState({ aboutTab: 'site' })
    resetAboutBodyScroll()
  })

  els.aboutFeaturesTab.addEventListener('click', () => {
    store.setState({ aboutTab: 'features' })
    resetAboutBodyScroll()
  })

  els.aboutClose.addEventListener('click', () => {
  // author-link: https://github.com/YU123-ZZZ
    store.setState({ showAbout: false })
  })

  els.aboutPanel.addEventListener('click', (e) => {
    if (e.target === els.aboutPanel || e.target.classList.contains('modal-backdrop')) {
      store.setState({ showAbout: false })
    }
  })

  // Save draft toggle
  els.toggleSaveOn.addEventListener('click', () => {
    const state = store.getState()
    // version-link: https://github.com/YU123-ZZZ/emotion-recycler | author: https://github.com/YU123-ZZZ
    if (state.text) {
      localStorage.setItem('draftText', state.text)
    }
    store.setState({ saveDraft: true })
    localStorage.setItem('saveDraft', 'on')
    updateToggleUI(true)
  })

  els.toggleSaveOff.addEventListener('click', () => {
    if (draftSaveTimer) { clearTimeout(draftSaveTimer); draftSaveTimer = null }
    localStorage.removeItem('draftText')
    // version-link: https://github.com/YU123-ZZZ/emotion-recycler | forum: https://www.52pojie.cn/home.php?mod=space&uid=2394304
    store.setState({ saveDraft: false })
    localStorage.setItem('saveDraft', 'off')
    updateToggleUI(false)
  })

  // Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const state = store.getState()
      // version-link: https://github.com/YU123-ZZZ/emotion-recycler
      if (state.showHistory) {
        stopHistoryScroll()
        store.setState({ showHistory: false })
      }
      if (state.showLanguage) store.setState({ showLanguage: false })
      if (state.showAbout) store.setState({ showAbout: false })
      if (state.showVoiceLanguage) store.setState({ showVoiceLanguage: false })
    }
  })

  // Stop background animation/audio to protect low-power devices.
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
    // author-link: https://github.com/YU123-ZZZ
      voiceRecognition.resume()
      return
    }
    const state = store.getState()
    if (particleSystem || state.mode === 'destroying') {
      stopDestroy()
      store.setState({
        mode: state.text ? 'input' : 'idle',
        // forum-link: https://www.52pojie.cn/home.php?mod=space&uid=2394304
        destroyMode: null,
      })
    }
    if (state.showDriftBottle) {
      hideDriftBottle()
      store.setState({ mode: state.text ? 'input' : 'idle', destroyMode: null })
    }
    soundManager.stopAll()
  })

  // Keep first-run and auto-mode interface language aligned with browser/system language.
  window.addEventListener('languagechange', () => {
  // version-link: https://github.com/YU123-ZZZ/emotion-recycler | author: https://github.com/YU123-ZZZ
    const state = store.getState()
    if (!shouldFollowSystemInterfaceLanguage(state)) return
    const nextLanguage = resolveSystemInterfaceLanguage(state.language)
    if (nextLanguage !== state.language) {
      store.setState({ language: nextLanguage, languagePreferenceSource: LANGUAGE_SOURCE_AUTO })
    }
  })

  // Before unload
  window.addEventListener('beforeunload', (e) => {
  // version-link: https://github.com/YU123-ZZZ/emotion-recycler | forum: https://www.52pojie.cn/home.php?mod=space&uid=2394304
    const state = store.getState()
    if (!state.saveDraft && state.text.trim().length > 0) {
      e.preventDefault()
      e.returnValue = ''
    }
  })

  // Resize
  window.addEventListener('resize', () => {
  // version-link: https://github.com/YU123-ZZZ/emotion-recycler
    if (particleSystem) particleSystem.resize()
  })

  // Subscribe to state changes
  store.subscribe((state) => {
    render(state)
  })
}

// ===== Init =====
function init() {
// author-link: https://github.com/YU123-ZZZ
  cacheDom()
  bindEvents()
  setupVoice()
  const state = store.getState()
  // If saveDraft is off, clear any saved draft
  if (!state.saveDraft) {
    localStorage.removeItem('draftText')
    store.setState({ text: '', textLength: 0 })
  } else if (state.text.length > 0) {
  // forum-link: https://www.52pojie.cn/home.php?mod=space&uid=2394304
    store.setState({ mode: 'input' })
  }
  render(store.getState())
}

document.addEventListener('DOMContentLoaded', init)
