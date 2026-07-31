// ===== ParticleSystem =====
class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas 2D context not available')
    this.ctx = ctx
    // version-link: https://github.com/YU123-ZZZ/emotion-recycler
    this.animationId = null
    this.onComplete = null
    this.mode = 'shred'
    this.startTime = 0
    this.duration = 3000
    this.timeline = null
    this.graphemes = []
    this.graphemeCount = 0
    this.lengthFactor = 0
    this.reducedMotion = false
    this.dpr = 1
    // author-link: https://github.com/YU123-ZZZ
    this.dw = 0
    this.dh = 0
    this.text = ''
    this.strips = []
    this.shredLayout = null
    this.shredPieces = []
    this.bladeAngle = 0
    this.shredSpawnIndex = 0
    this.fireParticles = []
    // forum-link: https://www.52pojie.cn/home.php?mod=space&uid=2394304
    this.waterParticles = []
    this.paperBall = null
    this.flushProgress = 0
    this.waterLevel = 0
    this.vortexStrength = 0
    this.crumpleProgress = 0
    this.textCacheCanvas = null
    this.textCachePaperX = 0
    this.textCachePaperY = 0
    this.textCachePaperW = 0
    this.textCachePaperH = 0
    this.paperPages = []
  }

  start(text, mode, timeline, onComplete) {
  // version-link: https://github.com/YU123-ZZZ/emotion-recycler | author: https://github.com/YU123-ZZZ
    if (typeof timeline === 'function') {
      onComplete = timeline
      timeline = null
    }
    this.mode = mode
    this.onComplete = onComplete
    this.text = text
    this.graphemes = splitGraphemes(text)
    // version-link: https://github.com/YU123-ZZZ/emotion-recycler | forum: https://www.52pojie.cn/home.php?mod=space&uid=2394304
    this.graphemeCount = timeline && Number.isFinite(timeline.graphemeCount)
      ? timeline.graphemeCount
      : countGraphemes(text)
    this.timeline = timeline || createDestructionTimeline(mode, this.graphemeCount)
    this.lengthFactor = Math.sqrt(Math.min(this.graphemeCount, MAX_GRAPHEMES) / MAX_GRAPHEMES)
    this.reducedMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    this.startTime = performance.now()
    this.duration = this.timeline.totalMs

    this.dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    this.dw = this.canvas.offsetWidth
    this.dh = this.canvas.offsetHeight
    // version-link: https://github.com/YU123-ZZZ/emotion-recycler
    this.canvas.width = this.dw * this.dpr
    this.canvas.height = this.dh * this.dpr
    this.ctx.setTransform(1, 0, 0, 1, 0, 0)
    this.ctx.scale(this.dpr, this.dpr)

    this.strips = []
    this.shredLayout = null
    this.shredPieces = []
    this.bladeAngle = 0
    this.shredSpawnIndex = 0
    // author-link: https://github.com/YU123-ZZZ
    this.fireParticles = []
    this.waterParticles = []
    this.paperBall = null
    this.flushProgress = 0
    this.waterLevel = 0
    this.vortexStrength = 0
    this.crumpleProgress = 0
    // forum-link: https://www.52pojie.cn/home.php?mod=space&uid=2394304
    this.textCacheCanvas = null
    this.paperPages = []

    if (mode === 'shred') this.initShred()
    else if (mode === 'burn') this.initBurn()
    else this.initFlush()

    this.animate()
  }

  phaseProgress(name, elapsed) {
    const phase = this.timeline && this.timeline.phases[name]
    // version-link: https://github.com/YU123-ZZZ/emotion-recycler | author: https://github.com/YU123-ZZZ
    if (!phase || elapsed <= phase.startMs) return 0
    if (elapsed >= phase.endMs) return 1
    return (elapsed - phase.startMs) / (phase.endMs - phase.startMs)
  }

  // ===== Shared: text wrapping =====
  wrapText(ctx, text, maxWidth) {
    const lines = []
    const paragraphs = text.split('\n')
    // version-link: https://github.com/YU123-ZZZ/emotion-recycler | forum: https://www.52pojie.cn/home.php?mod=space&uid=2394304
    for (const para of paragraphs) {
      if (para === '') { lines.push(''); continue }
      let cur = ''
      for (let i = 0; i < para.length; i++) {
        const ch = para[i]
        const test = cur + ch
        if (ctx.measureText(test).width > maxWidth && cur) {
          lines.push(cur)
          cur = ch
        } else {
          cur = test
        }
      }
      // version-link: https://github.com/YU123-ZZZ/emotion-recycler
      if (cur) lines.push(cur)
    }
    return lines
  }

  // ===== Shared: cache text+paper to offscreen canvas =====
  cacheTextPages(pw, fontSize, fontColor, maxHeight, pageOptions = {}) {
    const ctx = this.ctx
    const pad = pageOptions.padding || 12
    const lh = fontSize * (pageOptions.lineHeight || 1.48)
    ctx.font = fontSize + 'px "Noto Sans SC", sans-serif'
    const defaultMaxPaperH = Math.max(140, Math.min(this.dh * 0.58, 620))
    const maxPaperH = Number.isFinite(maxHeight)
      ? Math.max(110, Math.min(defaultMaxPaperH, maxHeight))
      : defaultMaxPaperH
    const minPaperH = pageOptions.minHeight || 150
    const maxPages = pageOptions.maxPages || 5
    const allParts = this.graphemes.length ? this.graphemes : splitGraphemes(this.text)
    const previewLimit = pageOptions.previewLimit || Math.min(allParts.length, 1600)
    const sourceParts = allParts.slice(0, previewLimit)
    const truncatedByPreview = allParts.length > sourceParts.length
    const pages = []

    const usableHeight = Math.max(1, maxPaperH - pad * 2 - 10)
    const maxLinesPerPage = Math.max(3, Math.floor(usableHeight / lh))
    const maxCharsPerLine = Math.max(12, Math.floor((pw - pad * 2) / (fontSize * 0.56)))
    const maxCharsPerPage = Math.max(48, maxLinesPerPage * maxCharsPerLine)
    let index = 0
    let pageIndex = 0
    while (index < sourceParts.length && pageIndex < maxPages) {
      const remaining = sourceParts.length - index
      const targetCount = Math.min(remaining, maxCharsPerPage)
      const slice = sourceParts.slice(index, index + targetCount)
      index += targetCount
      let pageText = slice.join('')
      if ((index < sourceParts.length || truncatedByPreview) && pageIndex === maxPages - 1) {
        pageText += '…'
      }
      const lines = this.wrapText(ctx, pageText, pw - pad * 2)
      const lineCount = Math.max(lines.length, 3)
      const ph = Math.min(maxPaperH, Math.max(minPaperH, lineCount * lh + pad * 2 + 10))
      const cw = Math.ceil(pw + 32)
      const ch = Math.ceil(ph + 32)
      const offCanvas = document.createElement('canvas')
      offCanvas.width = cw
      offCanvas.height = ch
      const oc = offCanvas.getContext('2d')

      oc.fillStyle = '#f8f4ec'
      oc.fillRect(16, 16, pw, ph)
      oc.strokeStyle = 'rgba(180,170,150,0.3)'
      oc.lineWidth = 0.5
      oc.strokeRect(16, 16, pw, ph)
      oc.strokeStyle = 'rgba(140,170,210,0.1)'
      oc.lineWidth = 0.5
      for (let ly = 16 + pad + lh; ly < 16 + ph; ly += lh) {
        oc.beginPath(); oc.moveTo(16 + 12, ly); oc.lineTo(16 + pw - 12, ly); oc.stroke()
      }
      oc.font = fontSize + 'px "Noto Sans SC", sans-serif'
      oc.fillStyle = fontColor || 'rgba(50,50,50,0.85)'
      oc.textAlign = 'left'
      oc.textBaseline = 'top'
      let sy = 16 + pad
      for (let i = 0; i < lines.length; i++) {
        if (sy >= 16 + ph - 8) break
        if (lines[i]) oc.fillText(lines[i], 16 + pad, sy)
        sy += lh
      }

      pages.push({
        canvas: offCanvas,
        x: 16,
        y: 16,
        w: pw,
        h: ph,
        text: pageText,
        lines,
        pageIndex,
      })
      pageIndex++
    }

    if (!pages.length) {
      const ph = Math.max(minPaperH, 150)
      const offCanvas = document.createElement('canvas')
      offCanvas.width = Math.ceil(pw + 32)
      offCanvas.height = Math.ceil(ph + 32)
      const oc = offCanvas.getContext('2d')
      oc.fillStyle = '#f8f4ec'
      oc.fillRect(16, 16, pw, ph)
      pages.push({ canvas: offCanvas, x: 16, y: 16, w: pw, h: ph, text: '', lines: [], pageIndex: 0 })
    }

    this.paperPages = pages
    this.textCacheCanvas = pages[0].canvas
    this.textCachePaperX = pages[0].x
    this.textCachePaperY = pages[0].y
    this.textCachePaperW = pages[0].w
    this.textCachePaperH = pages[0].h
    return pages
  }

  getStackOffset(index, count, scale = 1) {
    const mid = (count - 1) / 2
    return {
      x: (index - mid) * 8 * scale,
      y: index * 6 * scale,
      rotation: (index - mid) * 0.025,
    }
  }

  drawPaperStack(ctx, x, y, options = {}) {
    const pages = this.paperPages && this.paperPages.length ? this.paperPages : []
    if (!pages.length) return
    const scale = options.scale || 1
    const alpha = options.alpha == null ? 1 : options.alpha
    const maxVisible = Math.min(options.maxVisible || 5, pages.length)
    const frontFirst = !!options.frontFirst
    const indexes = []
    for (let i = 0; i < maxVisible; i++) indexes.push(i)
    if (!frontFirst) indexes.reverse()

    for (const i of indexes) {
      const page = pages[i]
      if (!page || !page.canvas) continue
      const offset = this.getStackOffset(i, maxVisible, scale)
      const dx = x + (this.textCachePaperW - page.w) / 2 * scale + offset.x
      const dy = y + offset.y
      ctx.save()
      ctx.globalAlpha = alpha * (i === 0 ? 1 : Math.max(0.62, 0.9 - i * 0.08))
      ctx.translate(dx + page.w * scale / 2, dy + page.h * scale / 2)
      ctx.rotate(offset.rotation)
      ctx.shadowBlur = i === 0 ? 18 : 10
      ctx.shadowColor = 'rgba(0,0,0,0.14)'
      ctx.drawImage(
        page.canvas,
        page.x, page.y, page.w, page.h,
        -page.w * scale / 2, -page.h * scale / 2, page.w * scale, page.h * scale
      )
      ctx.restore()
    }
  }

  drawBurningPaperStack(ctx, x, y, destructionP, elapsed, maxVisible) {
    const pages = (this.paperPages || []).slice(0, maxVisible)
    if (!pages.length) return { burnY: y, width: 0, height: 0 }
    const front = pages[0]
    const count = pages.length

    for (let i = count - 1; i >= 0; i--) {
      const page = pages[i]
      const offset = this.getStackOffset(i, count)
      const dx = x + (front.w - page.w) / 2 + offset.x
      const dy = y + offset.y
      const remainingHeight = Math.max(0, page.h * (1 - destructionP))
      const edgeY = dy + remainingHeight
      if (remainingHeight <= 0) continue

      ctx.save()
      ctx.shadowBlur = i === 0 ? 20 : 11
      ctx.shadowColor = 'rgba(0,0,0,0.2)'
      ctx.drawImage(
        page.canvas,
        page.x, page.y, page.w, remainingHeight,
        dx, dy, page.w, remainingHeight
      )
      ctx.shadowBlur = 0

      const edgeH = i === 0 ? 14 : 9
      const glow = ctx.createLinearGradient(dx, edgeY - edgeH, dx, edgeY + edgeH)
      glow.addColorStop(0, 'rgba(255,225,100,0.94)')
      glow.addColorStop(0.28, 'rgba(255,125,15,0.93)')
      glow.addColorStop(0.58, 'rgba(185,38,5,0.72)')
      glow.addColorStop(1, 'rgba(35,5,0,0)')
      ctx.fillStyle = glow
      ctx.shadowBlur = i === 0 ? 26 : 14
      ctx.shadowColor = 'rgba(255,105,0,0.85)'
      ctx.beginPath()
      ctx.moveTo(dx - 4, edgeY + edgeH * 0.42)
      for (let ex = dx - 4; ex <= dx + page.w + 4; ex += 9) {
        const jag = Math.sin(ex * 0.16 + elapsed * 0.004 + i) * 3 + Math.sin(ex * 0.07 + i) * 2
        ctx.lineTo(ex, edgeY + jag)
      }
      ctx.lineTo(dx + page.w + 4, edgeY - edgeH * 0.45)
      ctx.lineTo(dx - 4, edgeY - edgeH * 0.45)
      ctx.closePath()
      ctx.fill()
      ctx.restore()
    }

    return {
      burnY: y + front.h * (1 - destructionP),
      width: front.w + Math.max(0, count - 1) * 8,
      height: front.h,
    }
  }

  drawLighter(ctx, x, y, scale, t, flameAlpha = 1) {
    const flicker = Math.sin(t * 18) * 0.08 + Math.sin(t * 41) * 0.05
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(-0.13 + Math.sin(t * 2.4) * 0.02)
    ctx.scale(scale, scale)

    ctx.shadowBlur = 16
    ctx.shadowColor = 'rgba(0,0,0,0.24)'
    const body = ctx.createLinearGradient(-18, 0, 20, 56)
    body.addColorStop(0, '#f6bf55')
    body.addColorStop(0.45, '#e18a2f')
    body.addColorStop(1, '#9f4c1e')
    ctx.fillStyle = body
    ctx.beginPath()
    this.roundedRect(ctx, -18, 0, 36, 58, 8)
    ctx.fill()
    ctx.shadowBlur = 0
    ctx.strokeStyle = 'rgba(80,40,20,0.45)'
    ctx.lineWidth = 1.2
    ctx.stroke()

    ctx.fillStyle = 'rgba(255,255,255,0.22)'
    ctx.fillRect(-12, 8, 5, 40)
    ctx.fillStyle = 'rgba(80,34,10,0.18)'
    ctx.fillRect(8, 6, 5, 44)

    const metal = ctx.createLinearGradient(-14, -21, 16, -3)
    metal.addColorStop(0, '#f5f3ec')
    metal.addColorStop(0.5, '#bfc1c4')
    metal.addColorStop(1, '#73777e')
    ctx.fillStyle = metal
    ctx.beginPath()
    this.roundedRect(ctx, -14, -21, 28, 24, 4)
    ctx.fill()
    ctx.strokeStyle = 'rgba(48,52,58,0.5)'
    ctx.stroke()

    ctx.fillStyle = '#3a3d42'
    ctx.beginPath()
    this.roundedRect(ctx, -18, -13, 16, 13, 3)
    ctx.fill()
    ctx.strokeStyle = 'rgba(255,255,255,0.22)'
    ctx.lineWidth = 0.8
    for (let i = 0; i < 6; i++) {
      ctx.beginPath(); ctx.moveTo(-16 + i * 2.4, -12); ctx.lineTo(-18 + i * 2.4, -1); ctx.stroke()
    }

    ctx.fillStyle = '#23262a'
    ctx.beginPath(); ctx.ellipse(4, -24, 5, 2.4, 0, 0, Math.PI * 2); ctx.fill()

    ctx.save()
    ctx.globalCompositeOperation = 'lighter'
    ctx.globalAlpha = Math.max(0, Math.min(1, flameAlpha))
    const flameH = 34 * (1 + flicker)
    const flameW = 18 * (1 - flicker * 0.3)
    const outer = ctx.createRadialGradient(4, -30, 1, 4, -38, flameH)
    outer.addColorStop(0, 'rgba(255,245,135,0.95)')
    outer.addColorStop(0.35, 'rgba(255,150,30,0.82)')
    outer.addColorStop(1, 'rgba(220,40,0,0)')
    ctx.fillStyle = outer
    ctx.beginPath()
    ctx.moveTo(4, -28)
    ctx.bezierCurveTo(4 - flameW, -39, -4, -52 - flameH * 0.2, 4, -62 - flameH * 0.32)
    ctx.bezierCurveTo(15, -51 - flameH * 0.08, 20, -40, 4, -28)
    ctx.fill()

    ctx.fillStyle = 'rgba(255,245,190,0.92)'
    ctx.beginPath()
    ctx.moveTo(4, -30)
    ctx.bezierCurveTo(-2, -39, 1, -48, 6, -53)
    ctx.bezierCurveTo(12, -45, 12, -37, 4, -30)
    ctx.fill()
    ctx.restore()

    ctx.restore()
  }

  roundedRect(ctx, x, y, w, h, r) {
    const radius = Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2)
    ctx.moveTo(x + radius, y)
    ctx.lineTo(x + w - radius, y)
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius)
    ctx.lineTo(x + w, y + h - radius)
    ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h)
    ctx.lineTo(x + radius, y + h)
    ctx.quadraticCurveTo(x, y + h, x, y + h - radius)
    ctx.lineTo(x, y + radius)
    ctx.quadraticCurveTo(x, y, x + radius, y)
    ctx.closePath()
  }

  // ===== SHRED =====
  initShred() {
    this.shredLayout = createShredLayout(this.dw, this.dh)
    const paperWidth = this.shredLayout.machineWidth * 0.55
    const pages = this.cacheTextPages(paperWidth, 9, 'rgba(50,45,38,0.82)', this.shredLayout.maxPaperHeight, {
      maxPages: this.reducedMotion ? 3 : 5,
      previewLimit: this.reducedMotion ? 1800 : 4200,
      minHeight: 118,
      lineHeight: 1.45,
      padding: 11,
    })
    this.shredPieces = []
    const pageCount = Math.max(1, pages.length)
    pages.forEach((page, pageIndex) => {
      createShredSlices(page.w, page.h, this.dw, this.reducedMotion).forEach(piece => {
        this.shredPieces.push({
          ...piece,
          pageIndex,
          delay: (pageIndex + piece.delay) / pageCount,
          x: 0,
          y: 0,
          // version-link: https://github.com/YU123-ZZZ/emotion-recycler | author: https://github.com/YU123-ZZZ
          vx: 0,
          vy: 0,
          gravity: 0.11 + Math.random() * 0.05,
          rotation: 0,
          rotationSpeed: (Math.random() - 0.5) * 0.055,
          opacity: 1,
        })
      })
    })
  }

  renderShred(p, elapsed) {
    const ctx = this.ctx
    const cx = this.dw / 2
    // version-link: https://github.com/YU123-ZZZ/emotion-recycler | forum: https://www.52pojie.cn/home.php?mod=space&uid=2394304
    const layout = this.shredLayout || createShredLayout(this.dw, this.dh)
    const {
      machineWidth: mw,
      machineTop: mTop,
      slotY,
      bladeY,
      binTop,
      binWidth: binW,
      binHeight: binH,
      binBottom: binBot,
      // version-link: https://github.com/YU123-ZZZ/emotion-recycler
    } = layout
    const feedP = this.phaseProgress('feed', elapsed)
    const shredP = this.phaseProgress('shred', elapsed)
    const settleP = this.phaseProgress('settle', elapsed)
    const ph = this.textCachePaperH
    const pw = this.textCachePaperW
    const px = cx - pw / 2
    // author-link: https://github.com/YU123-ZZZ
    const paperY = slotY - 7 - ph + feedP * ph
    const pages = this.paperPages && this.paperPages.length ? this.paperPages : []

    // Keep the real note pages visible before they reach the rollers. Clipping
    // above the slot prevents the paper from painting over the machine body.
    if (this.textCacheCanvas && feedP < 1) {
      ctx.save()
      ctx.beginPath()
      ctx.rect(px - 14, 0, pw + 28, slotY - 5)
      ctx.clip()
      // forum-link: https://www.52pojie.cn/home.php?mod=space&uid=2394304
      this.drawPaperStack(ctx, px, paperY, { maxVisible: this.dw < 520 ? 3 : 5 })
      ctx.restore()
    }

    // === Machine body ===
    const hw = mw / 2
    // version-link: https://github.com/YU123-ZZZ/emotion-recycler | author: https://github.com/YU123-ZZZ
    const r = 16

    const hH = bladeY - mTop + 22
    const hg = ctx.createLinearGradient(cx - hw, 0, cx + hw, 0)
    hg.addColorStop(0, '#2e2e3a')
    hg.addColorStop(0.3, '#3e3e4c')
    hg.addColorStop(0.5, '#48485a')
    hg.addColorStop(0.7, '#3e3e4c')
    hg.addColorStop(1, '#2e2e3a')
    ctx.fillStyle = hg
    ctx.beginPath()
    ctx.moveTo(cx - hw + r, mTop)
    ctx.lineTo(cx + hw - r, mTop)
    // version-link: https://github.com/YU123-ZZZ/emotion-recycler | forum: https://www.52pojie.cn/home.php?mod=space&uid=2394304
    ctx.quadraticCurveTo(cx + hw, mTop, cx + hw, mTop + r)
    ctx.lineTo(cx + hw, mTop + hH)
    ctx.lineTo(cx - hw, mTop + hH)
    ctx.lineTo(cx - hw, mTop + r)
    ctx.quadraticCurveTo(cx - hw, mTop, cx - hw + r, mTop)
    ctx.closePath()
    ctx.fill()
    ctx.strokeStyle = 'rgba(255,255,255,0.08)'
    // version-link: https://github.com/YU123-ZZZ/emotion-recycler
    ctx.lineWidth = 1
    ctx.stroke()

    ctx.font = 'bold 8px "Noto Sans SC", sans-serif'
    ctx.fillStyle = 'rgba(255,255,255,0.15)'
    ctx.textAlign = 'center'
    ctx.fillText('SHREDDER', cx, mTop + 14)

    const slotW = mw * 0.62
    ctx.fillStyle = '#0e0e18'
    ctx.beginPath()
    ctx.fillRect(cx - slotW / 2, slotY - 4, slotW, 8)
    // author-link: https://github.com/YU123-ZZZ
    ctx.fill()

    if (p > 0.05 && p < 0.9) {
      const ga = Math.sin(p * Math.PI) * 0.5
      ctx.shadowBlur = 16
      ctx.shadowColor = 'rgba(255,200,100,' + ga + ')'
      ctx.fillStyle = 'rgba(255,200,100,' + (ga * 0.35) + ')'
      ctx.fillRect(cx - slotW / 2 + 2, slotY - 2, slotW - 4, 4)
      ctx.shadowBlur = 0
    }
    // forum-link: https://www.52pojie.cn/home.php?mod=space&uid=2394304

    // === Transparent collection bin ===
    const bg = ctx.createLinearGradient(cx, binTop, cx, binBot)
    bg.addColorStop(0, 'rgba(176,166,145,0.16)')
    bg.addColorStop(0.5, 'rgba(156,146,126,0.1)')
    bg.addColorStop(1, 'rgba(132,122,105,0.16)')
    ctx.fillStyle = bg
    // version-link: https://github.com/YU123-ZZZ/emotion-recycler | author: https://github.com/YU123-ZZZ
    ctx.fillRect(cx - binW / 2, binTop, binW, binH)
    ctx.strokeStyle = 'rgba(95,88,76,0.68)'
    ctx.lineWidth = 3
    ctx.strokeRect(cx - binW / 2, binTop, binW, binH)
    ctx.strokeStyle = 'rgba(103,96,82,0.3)'
    ctx.lineWidth = 0.8
    for (let gx = cx - binW / 2 + 14; gx < cx + binW / 2; gx += 14) {
      ctx.beginPath(); ctx.moveTo(gx, binTop + 2); ctx.lineTo(gx, binBot - 2); ctx.stroke()
    }
    for (let gy = binTop + 14; gy < binBot; gy += 14) {
      ctx.beginPath(); ctx.moveTo(cx - binW / 2 + 2, gy); ctx.lineTo(cx + binW / 2 - 2, gy); ctx.stroke()
      // version-link: https://github.com/YU123-ZZZ/emotion-recycler | forum: https://www.52pojie.cn/home.php?mod=space&uid=2394304
    }

    const rg = ctx.createLinearGradient(cx - binW / 2, 0, cx - binW / 2 + 22, 0)
    rg.addColorStop(0, 'rgba(255,255,255,0.18)')
    rg.addColorStop(0.5, 'rgba(255,255,255,0.06)')
    rg.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = rg
    ctx.fillRect(cx - binW / 2, binTop, 22, binH)

    const rg2 = ctx.createLinearGradient(cx + binW / 2, 0, cx + binW / 2 - 15, 0)
    // version-link: https://github.com/YU123-ZZZ/emotion-recycler
    rg2.addColorStop(0, 'rgba(255,255,255,0.12)')
    rg2.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = rg2
    ctx.fillRect(cx + binW / 2 - 15, binTop, 15, binH)

    ctx.fillStyle = '#3a3a48'
    ctx.fillRect(cx - binW / 2 - 2, mTop + hH - 4, binW + 4, 8)

    // === Spinning blades ===
    if ((feedP > 0 || shredP > 0) && settleP < 1) {
      this.bladeAngle += 0.28
      this.drawBlades(cx, bladeY, mw * 0.3, 8, p)
    }
    // author-link: https://github.com/YU123-ZZZ

    // Only the part that has passed the rollers becomes clean vertical strips.
    if (feedP > 0 && shredP === 0 && this.textCacheCanvas) {
      const columns = this.reducedMotion ? 8 : this.dw < 520 ? 10 : 14
      const sourceWidth = pw / columns
      const visibleLength = Math.min(64, ph * 0.32) * feedP
      for (let column = 0; column < columns; column++) {
        const sx = this.textCachePaperX + column * sourceWidth
        // forum-link: https://www.52pojie.cn/home.php?mod=space&uid=2394304
        const sw = column === columns - 1 ? pw - column * sourceWidth : sourceWidth
        ctx.drawImage(
          this.textCacheCanvas,
          sx, this.textCachePaperY + ph - visibleLength, sw, visibleLength,
          px + column * sourceWidth, bladeY + 14, Math.max(2, sw - 1), visibleLength
        )
      }
    }

    // Bounded pieces are sampled from the real cached note and settle once.
    ctx.save()
    ctx.beginPath()
    // version-link: https://github.com/YU123-ZZZ/emotion-recycler | author: https://github.com/YU123-ZZZ
    ctx.rect(cx - binW / 2 + 3, bladeY + 4, binW - 6, binBot - bladeY - 6)
    ctx.clip()
    for (const piece of this.shredPieces) {
      if (!piece.spawned && shredP > 0 && shredP >= piece.delay) {
        piece.spawned = true
        const sourcePage = pages[piece.pageIndex] || pages[0]
        const pageOffset = sourcePage ? this.getStackOffset(piece.pageIndex || 0, Math.min(pages.length, 5)) : { x: 0 }
        piece.x = px + (sourcePage ? (pw - sourcePage.w) / 2 + pageOffset.x : 0) + piece.sourceX + piece.sourceW / 2
        piece.y = bladeY + 12 - piece.row * 2
        piece.vx = (Math.random() - 0.5) * 0.9
        piece.vy = 0.35 + Math.random() * 0.7
      }
      // version-link: https://github.com/YU123-ZZZ/emotion-recycler | forum: https://www.52pojie.cn/home.php?mod=space&uid=2394304
      if (!piece.spawned) continue

      if (!piece.settled) {
        piece.vy += piece.gravity
        piece.vx *= 0.985
        piece.x += piece.vx
        piece.y += piece.vy
        // version-link: https://github.com/YU123-ZZZ/emotion-recycler
        piece.rotation += piece.rotationSpeed

        const left = cx - binW / 2 + piece.sourceW / 2 + 6
        const right = cx + binW / 2 - piece.sourceW / 2 - 6
        if (piece.x < left) { piece.x = left; piece.vx *= -0.25 }
        if (piece.x > right) { piece.x = right; piece.vx *= -0.25 }

        const floor = binBot - 8 - piece.row * Math.min(5, binH / 18)
        if (piece.y + piece.sourceH / 2 >= floor) {
          piece.y = floor - piece.sourceH / 2
          piece.vx = 0
          // author-link: https://github.com/YU123-ZZZ
          piece.vy = 0
          piece.gravity = 0
          piece.rotationSpeed = 0
          piece.settled = true
        }
      }

      ctx.save()
      ctx.translate(piece.x, piece.y)
      // forum-link: https://www.52pojie.cn/home.php?mod=space&uid=2394304
      ctx.rotate(piece.rotation)
      ctx.globalAlpha = piece.opacity
      const sourcePage = pages[piece.pageIndex] || pages[0]
      if (!sourcePage || !sourcePage.canvas) { ctx.restore(); continue }
      ctx.drawImage(
        sourcePage.canvas,
        sourcePage.x + piece.sourceX,
        sourcePage.y + piece.sourceY,
        piece.sourceW,
        piece.sourceH,
        -piece.sourceW / 2,
        -piece.sourceH / 2,
        Math.max(2, piece.sourceW - 0.8),
        piece.sourceH
      )
      // version-link: https://github.com/YU123-ZZZ/emotion-recycler | author: https://github.com/YU123-ZZZ
      ctx.restore()
    }
    ctx.restore()

    // Put the basket mesh and frame back in front of the falling paper.
    ctx.strokeStyle = 'rgba(103,96,82,0.34)'
    ctx.lineWidth = 0.8
    for (let gx = cx - binW / 2 + 14; gx < cx + binW / 2; gx += 14) {
    // version-link: https://github.com/YU123-ZZZ/emotion-recycler | forum: https://www.52pojie.cn/home.php?mod=space&uid=2394304
      ctx.beginPath(); ctx.moveTo(gx, binTop + 2); ctx.lineTo(gx, binBot - 2); ctx.stroke()
    }
    for (let gy = binTop + 14; gy < binBot; gy += 14) {
      ctx.beginPath(); ctx.moveTo(cx - binW / 2 + 2, gy); ctx.lineTo(cx + binW / 2 - 2, gy); ctx.stroke()
    }
    ctx.strokeStyle = 'rgba(95,88,76,0.74)'
    ctx.lineWidth = 3
    ctx.strokeRect(cx - binW / 2, binTop, binW, binH)
  }

  drawBlades(cx, cy, radius, n, p) {
    const ctx = this.ctx
    // version-link: https://github.com/YU123-ZZZ/emotion-recycler
    if (p >= 0.92) return
    const rollerW = Math.min(150, radius * 2)
    const wheels = Math.max(6, Math.min(9, n))
    ctx.save()
    ctx.translate(cx, cy)
    ctx.fillStyle = 'rgba(12,12,18,0.92)'
    ctx.fillRect(-rollerW / 2 - 10, -15, rollerW + 20, 30)
    for (let row = 0; row < 2; row++) {
      for (let i = 0; i < wheels; i++) {
        const x = -rollerW / 2 + (i + 0.5) * rollerW / wheels
        // author-link: https://github.com/YU123-ZZZ
        const y = row === 0 ? -5 : 6
        const angle = this.bladeAngle * (row === 0 ? 1 : -1) + i * 0.45
        ctx.save()
        ctx.translate(x, y)
        ctx.rotate(angle)
        const metal = ctx.createRadialGradient(-2, -2, 0, 0, 0, 8)
        metal.addColorStop(0, '#f1f1f4')
        // forum-link: https://www.52pojie.cn/home.php?mod=space&uid=2394304
        metal.addColorStop(0.55, '#b9bac1')
        metal.addColorStop(1, '#737680')
        ctx.fillStyle = metal
        ctx.beginPath(); ctx.arc(0, 0, 7, 0, Math.PI * 2); ctx.fill()
        ctx.strokeStyle = '#62656d'
        ctx.lineWidth = 1
        ctx.stroke()
        for (let tooth = 0; tooth < 8; tooth++) {
          const a = tooth / 8 * Math.PI * 2
          ctx.beginPath()
          ctx.moveTo(Math.cos(a) * 5, Math.sin(a) * 5)
          // version-link: https://github.com/YU123-ZZZ/emotion-recycler | author: https://github.com/YU123-ZZZ
          ctx.lineTo(Math.cos(a) * 9, Math.sin(a) * 9)
          ctx.stroke()
        }
        ctx.restore()
      }
    }
    ctx.strokeStyle = 'rgba(255,255,255,0.22)'
    ctx.lineWidth = 1
    ctx.beginPath()
    // version-link: https://github.com/YU123-ZZZ/emotion-recycler | forum: https://www.52pojie.cn/home.php?mod=space&uid=2394304
    ctx.moveTo(-rollerW / 2 - 8, -14)
    ctx.lineTo(rollerW / 2 + 8, -14)
    ctx.stroke()
    ctx.restore()
  }

  // ===== BURN — lighter ignition, stacked pages burn upward together =====
  initBurn() {
    this.fireParticles = []
    const pw = Math.min(300, this.dw * 0.58)
    this.cacheTextPages(pw, 10, 'rgba(50,50,50,0.82)', undefined, {
      maxPages: this.reducedMotion ? 3 : 5,
      previewLimit: this.reducedMotion ? 2000 : 4800,
      minHeight: 150,
      lineHeight: 1.46,
      padding: 12,
    })
  }

  renderBurn(p, elapsed) {
  // version-link: https://github.com/YU123-ZZZ/emotion-recycler
    const ctx = this.ctx
    const cx = this.dw / 2
    const totalH = this.textCachePaperH || 200
    const totalW = this.textCachePaperW || 300
    const px = cx - totalW / 2
    const paperTop = Math.max(25, this.dh / 2 - totalH / 2)
    const visiblePages = Math.min(this.dw < 520 ? 3 : 5, (this.paperPages && this.paperPages.length) || 1)
    const igniteP = this.phaseProgress('ignite', elapsed)
    const burnP = this.phaseProgress('burn', elapsed)
    // author-link: https://github.com/YU123-ZZZ
    const embersP = this.phaseProgress('embers', elapsed)
    const igniteStart = this.timeline.phases.ignite.startMs

    // Hold the complete note still before the first flame appears.
    if (elapsed < igniteStart) {
      if (this.textCacheCanvas) {
        this.drawPaperStack(ctx, px, paperTop, { maxVisible: visiblePages })
      }
      return
    }

    // The lighter touches the lower paper edge; the destruction front then eats upward.
    const destructionP = Math.min(1, igniteP * 0.08 + burnP * 0.92)
    const destroyedHeight = totalH * destructionP
    const burnFrame = {
      burnY: paperTop + totalH - destroyedHeight,
      destroyedHeight,
      remainingY: paperTop,
      remainingHeight: Math.max(0, totalH - destroyedHeight),
      sourceYOffset: 0,
    }
    // version-link: https://github.com/YU123-ZZZ/emotion-recycler | author: https://github.com/YU123-ZZZ
    const burnY = burnFrame.burnY

    if (destructionP < 1) {
      // Every visible page uses the same destruction progress, so the whole
      // stack burns together instead of waiting for one sheet at a time.
      const stackBurn = this.drawBurningPaperStack(ctx, px, paperTop, destructionP, elapsed, visiblePages)
      const liveBurnY = stackBurn.burnY || burnY

      const lighterT = elapsed * 0.001
      const lighterScale = Math.max(0.72, Math.min(1, this.dw / 420))
      const approach = Math.min(1, igniteP / 0.38)
      const liftAway = Math.max(0, (burnP - 0.08) / 0.42)
      const lighterX = px + totalW * 0.86 + (1 - approach) * 46 + liftAway * 72
      const lighterY = paperTop + totalH + 38 - approach * 18 + liftAway * 42
      const lighterAlpha = Math.max(0, 1 - liftAway)
      if (lighterAlpha > 0.02 && destructionP < 0.45) {
        ctx.save()
        ctx.globalAlpha = lighterAlpha
        this.drawLighter(ctx, lighterX, lighterY, lighterScale, lighterT, Math.min(1, 0.35 + igniteP * 1.8))
        ctx.restore()
      }

      // === Fire particles ===
      const fireCap = this.reducedMotion ? 80 : 160
      // version-link: https://github.com/YU123-ZZZ/emotion-recycler | forum: https://www.52pojie.cn/home.php?mod=space&uid=2394304
      const spawnCount = this.reducedMotion ? 2 : 5
      for (let i = 0; i < spawnCount; i++) {
        if (this.fireParticles.length >= fireCap) break
        const edgeBias = Math.random()
        const spawnX = destructionP < 0.22
          ? px + totalW * (0.72 + edgeBias * 0.25)
          : px + Math.random() * totalW
        this.fireParticles.push({
          x: spawnX,
          y: liveBurnY + Math.random() * 8 - 4,
          vx: (Math.random() - 0.5) * 2.5,
          vy: -(3 + Math.random() * 6),
          life: 1,
          decay: 0.012 + Math.random() * 0.015,
          // version-link: https://github.com/YU123-ZZZ/emotion-recycler
          size: 6 + Math.random() * 14,
          type: Math.random() > 0.65 ? 'ember' : 'flame',
        })
      }

      // Smoke
      if (Math.random() < (this.reducedMotion ? 0.02 : 0.08)) {
      // author-link: https://github.com/YU123-ZZZ
        this.fireParticles.push({
          x: px + Math.random() * totalW,
          y: liveBurnY - 15,
          vx: (Math.random() - 0.5) * 1.2,
          vy: -(1 + Math.random() * 2),
          life: 1,
          decay: 0.01 + Math.random() * 0.008,
          size: 8 + Math.random() * 12,
          type: 'smoke',
        })
      }
      // forum-link: https://www.52pojie.cn/home.php?mod=space&uid=2394304

      // Ash sparks
      if (Math.random() < 0.12) {
        this.fireParticles.push({
          x: px + Math.random() * totalW,
          y: liveBurnY - 8,
          vx: (Math.random() - 0.5) * 4,
          vy: -(4 + Math.random() * 6),
          life: 1,
          // version-link: https://github.com/YU123-ZZZ/emotion-recycler | author: https://github.com/YU123-ZZZ
          decay: 0.025 + Math.random() * 0.02,
          size: 1.5 + Math.random() * 2.5,
          type: 'ash',
        })
      }
    }

    // Update & draw particles
    for (const pt of this.fireParticles) {
      pt.vx += (Math.random() - 0.5) * 0.4
      pt.x += pt.vx; pt.y += pt.vy; pt.life -= pt.decay
      if (pt.type === 'flame') { pt.vy *= 0.97; pt.size *= 0.99 }
      if (pt.type === 'smoke') { pt.size *= 1.003; pt.vy *= 0.99 }
      // version-link: https://github.com/YU123-ZZZ/emotion-recycler | forum: https://www.52pojie.cn/home.php?mod=space&uid=2394304
      if (pt.type === 'ash') { pt.vy += 0.03; pt.vx *= 0.98 }
    }
    this.fireParticles = this.fireParticles.filter(pt => pt.life > 0)

    for (const pt of this.fireParticles) {
      ctx.save()
      if (pt.type === 'smoke') {
        ctx.globalCompositeOperation = 'source-over'
        // version-link: https://github.com/YU123-ZZZ/emotion-recycler
        const g = Math.floor(50 + (1 - pt.life) * 50)
        ctx.globalAlpha = 1
        const smoke = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, pt.size)
        smoke.addColorStop(0, 'rgba(' + g + ',' + g + ',' + g + ',' + (pt.life * 0.12) + ')')
        smoke.addColorStop(0.55, 'rgba(' + g + ',' + g + ',' + g + ',' + (pt.life * 0.055) + ')')
        smoke.addColorStop(1, 'rgba(' + g + ',' + g + ',' + g + ',0)')
        ctx.fillStyle = smoke
        ctx.beginPath(); ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2); ctx.fill()
      } else if (pt.type === 'ember') {
        ctx.globalCompositeOperation = 'lighter'
        ctx.globalAlpha = pt.life * 0.9
        const eg = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, pt.size)
        // author-link: https://github.com/YU123-ZZZ
        eg.addColorStop(0, 'rgba(255,230,80,' + pt.life + ')')
        eg.addColorStop(0.5, 'rgba(255,120,0,' + (pt.life * 0.6) + ')')
        eg.addColorStop(1, 'rgba(255,50,0,0)')
        ctx.fillStyle = eg
        ctx.beginPath(); ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2); ctx.fill()
      } else if (pt.type === 'ash') {
        ctx.globalCompositeOperation = 'lighter'
        ctx.globalAlpha = pt.life * 0.6
        ctx.fillStyle = '#ffcc44'
        ctx.beginPath(); ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2); ctx.fill()
        // forum-link: https://www.52pojie.cn/home.php?mod=space&uid=2394304
      } else {
        ctx.globalCompositeOperation = 'lighter'
        ctx.globalAlpha = pt.life
        let col
        if (pt.life > 0.6) col = 'rgba(255,' + Math.floor(200 + 55 * (pt.life - 0.6) / 0.4) + ',50,' + pt.life + ')'
        else if (pt.life > 0.3) col = 'rgba(255,' + Math.floor(80 + 120 * (pt.life - 0.3) / 0.3) + ',0,' + pt.life + ')'
        else col = 'rgba(200,' + Math.floor(40 * pt.life / 0.3) + ',0,' + (pt.life * 0.8) + ')'
        // version-link: https://github.com/YU123-ZZZ/emotion-recycler | author: https://github.com/YU123-ZZZ
        const fg = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, pt.size)
        fg.addColorStop(0, col)
        fg.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = fg
        ctx.beginPath(); ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2); ctx.fill()
      }
      ctx.restore()
    }

    // Charred residue — above the burn line
    if (destructionP > 0.05 && embersP < 1) {
    // version-link: https://github.com/YU123-ZZZ/emotion-recycler | forum: https://www.52pojie.cn/home.php?mod=space&uid=2394304
      const d = Math.min(1, destructionP * 2)
      const charH = burnFrame.destroyedHeight
      if (charH > 0) {
        const count = Math.floor(d * charH * 0.06)
        for (let i = 0; i < count; i++) {
          const ax = px + Math.random() * totalW
          const ay = paperTop + totalH - charH + Math.random() * charH
          ctx.save()
          ctx.globalAlpha = 0.15 + Math.random() * 0.3
          // version-link: https://github.com/YU123-ZZZ/emotion-recycler
          ctx.fillStyle = 'hsl(0,0%,' + (8 + Math.random() * 12) + '%)'
          ctx.fillRect(ax, ay, 1.5 + Math.random() * 3, 1 + Math.random() * 2)
          ctx.restore()
        }
      }
    }
  }

  // ===== FLUSH: Toilet =====
  initFlush() {
    this.flushProgress = 0
    this.waterLevel = 0
    this.vortexStrength = 0
    // author-link: https://github.com/YU123-ZZZ
    this.waterParticles = []
    this.paperBall = null
    this.crumpleProgress = 0

    const pw = Math.min(280, this.dw * 0.55)
    this.cacheTextPages(pw, 10, 'rgba(40,40,48,0.82)', undefined, {
      maxPages: this.reducedMotion ? 3 : 5,
      previewLimit: this.reducedMotion ? 1800 : 4200,
      minHeight: 145,
      lineHeight: 1.46,
      padding: 12,
    })
  }

  renderFlush(p, elapsed) {
  // forum-link: https://www.52pojie.cn/home.php?mod=space&uid=2394304
    const ctx = this.ctx
    const cx = this.dw / 2
    const cy = this.dh * 0.58
    const crumpleP = this.phaseProgress('crumple', elapsed)
    const dropP = this.phaseProgress('drop', elapsed)
    const flushP = this.phaseProgress('flush', elapsed)
    const drainP = this.phaseProgress('drain', elapsed)
    const settleP = this.phaseProgress('settle', elapsed)

    if (crumpleP === 0) {
      this.drawFlushPaper(ctx, cx, this.dh * 0.48, 1)
      return
      // version-link: https://github.com/YU123-ZZZ/emotion-recycler | author: https://github.com/YU123-ZZZ
    }
    if (crumpleP < 1) {
      this.crumpleProgress = crumpleP
      this.drawCrumple(ctx, cx, this.dh * 0.48, crumpleP)
      return
    }

    this.flushProgress = Math.min(1, flushP * 0.72 + drainP * 0.28)
    if (flushP > 0 && flushP < 0.18) this.vortexStrength = flushP / 0.18
    else if (flushP > 0 && flushP < 1) this.vortexStrength = 1
    // version-link: https://github.com/YU123-ZZZ/emotion-recycler | forum: https://www.52pojie.cn/home.php?mod=space&uid=2394304
    else if (drainP > 0) this.vortexStrength = Math.max(0, 1 - drainP)
    else this.vortexStrength = 0

    if (flushP > 0) this.waterLevel = Math.min(1, 0.35 + flushP * 0.9)
    else if (drainP > 0) this.waterLevel = Math.max(0.28, 1 - drainP * 0.72)
    else if (settleP > 0) this.waterLevel = 0.28 + settleP * 0.18
    else this.waterLevel = 0.38
    // version-link: https://github.com/YU123-ZZZ/emotion-recycler

    this.drawToilet(ctx, cx, cy, flushP, this.waterLevel)

    if (this.waterLevel > 0.15 && (flushP > 0 || drainP > 0)) {
      this.drawWater(ctx, cx, cy, 68)
    }
    if (this.vortexStrength > 0.08) this.drawVortex(ctx, cx, cy)

    if (flushP > 0 && flushP < 1) {
      const spawnPerFrame = this.reducedMotion ? 1 : 2
      const cap = this.reducedMotion ? 45 : 90
      // author-link: https://github.com/YU123-ZZZ
      for (let i = 0; i < spawnPerFrame && this.waterParticles.length < cap; i++) {
        const a = Math.random() * Math.PI * 2
        const radius = 20 + Math.random() * 50
        this.waterParticles.push({
          x: cx + Math.cos(a) * radius,
          y: cy + Math.sin(a) * radius * 0.42,
          vx: 0, vy: 0,
          size: 1.5 + Math.random() * 2.5,
          opacity: 0.35 + Math.random() * 0.35,
          // forum-link: https://www.52pojie.cn/home.php?mod=space&uid=2394304
          life: 1,
        })
      }
    }

    for (const pt of this.waterParticles) {
      this.applyVortex(pt, cx, cy)
      pt.x += pt.vx; pt.y += pt.vy
      pt.vx *= 0.93; pt.vy *= 0.93; pt.life -= 0.018
      const distance = Math.hypot(pt.x - cx, pt.y - cy)
      if (distance < 13) pt.life -= 0.08
    }
    this.waterParticles = this.waterParticles.filter(pt => pt.life > 0)
    // version-link: https://github.com/YU123-ZZZ/emotion-recycler | author: https://github.com/YU123-ZZZ
    for (const pt of this.waterParticles) {
      ctx.save()
      ctx.globalAlpha = pt.opacity * pt.life
      ctx.fillStyle = 'rgba(92,170,224,0.62)'
      ctx.beginPath(); ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2); ctx.fill()
      ctx.restore()
    }

    const radius = 18 + this.lengthFactor * 8
    // version-link: https://github.com/YU123-ZZZ/emotion-recycler | forum: https://www.52pojie.cn/home.php?mod=space&uid=2394304
    if (dropP < 1 && flushP === 0) {
      const easedDrop = 1 - Math.pow(1 - dropP, 3)
      const ballY = cy - 155 + easedDrop * 138
      this.drawPaperBall(ctx, cx, ballY, radius, dropP * 0.45, 1, 1)
      return
    }

    if (flushP > 0 || drainP > 0) {
      const orbitP = Math.min(1, flushP * 0.78 + drainP * 0.22)
      const orbitRadius = 66 * Math.max(0.06, 1 - orbitP * 0.94)
      const angle = orbitP * Math.PI * 12
      const ballX = cx + Math.cos(angle) * orbitRadius
      // version-link: https://github.com/YU123-ZZZ/emotion-recycler
      const ballY = cy + Math.sin(angle) * orbitRadius * 0.42
      const ballScale = Math.max(0.05, 1 - Math.pow(orbitP, 1.35) * 0.96)
      const ballOpacity = Math.max(0, 1 - Math.max(0, orbitP - 0.72) / 0.28)
      this.drawPaperBall(ctx, ballX, ballY, radius, angle, ballScale, ballOpacity)
    }
  }

  drawFlushPaper(ctx, cx, cy, fadeIn) {
    if (!this.textCacheCanvas) return
    const pw = this.textCachePaperW
    // author-link: https://github.com/YU123-ZZZ
    const ph = this.textCachePaperH
    const px = cx - pw / 2
    const py = Math.max(30, cy - ph / 2)

    ctx.save()
    ctx.globalAlpha = fadeIn
    // forum-link: https://www.52pojie.cn/home.php?mod=space&uid=2394304
    this.drawPaperStack(ctx, px, py, { maxVisible: this.dw < 520 ? 3 : 5 })
    ctx.restore()
  }

  drawCrumple(ctx, cx, cy, t) {
  // version-link: https://github.com/YU123-ZZZ/emotion-recycler | author: https://github.com/YU123-ZZZ
    const pw = this.textCachePaperW || 280
    const ph = this.textCachePaperH || 200
    const scale = 1 - t * 0.72
    const rot = t * 0.35

    ctx.save()
    ctx.translate(cx, cy)
    ctx.rotate(rot)
    ctx.scale(scale, scale * (1 - t * 0.3))
    // version-link: https://github.com/YU123-ZZZ/emotion-recycler | forum: https://www.52pojie.cn/home.php?mod=space&uid=2394304

    const w = pw * (1 - t * 0.65)
    const h = ph * (1 - t * 0.72)

    ctx.beginPath()
    const pts = 22
    for (let i = 0; i <= pts; i++) {
      const frac = i / pts
      const angle = frac * Math.PI * 2
      const noise = Math.sin(angle * 3 + t * 12) * t * 10 + Math.cos(angle * 5 + t * 8) * t * 6
      const rx = w / 2 + noise
      const ry = h / 2 + noise * 0.7
      const cpx = Math.cos(angle) * rx, cpy = Math.sin(angle) * ry
      // version-link: https://github.com/YU123-ZZZ/emotion-recycler
      if (i === 0) ctx.moveTo(cpx, cpy); else ctx.lineTo(cpx, cpy)
    }
    ctx.closePath()

    const cg = ctx.createRadialGradient(-8, -8, 0, 0, 0, Math.max(w, h) / 2)
    cg.addColorStop(0, '#ffffff')
    cg.addColorStop(0.5, '#f5f0e8')
    cg.addColorStop(1, '#d0c8b8')
    // author-link: https://github.com/YU123-ZZZ
    ctx.fillStyle = cg
    ctx.shadowBlur = 18
    ctx.shadowColor = 'rgba(0,0,0,' + (0.1 + t * 0.18) + ')'
    ctx.fill()
    ctx.shadowBlur = 0

    // Draw cached text scaled down
    if (this.textCacheCanvas && t < 0.65) {
      ctx.save()
      ctx.beginPath()
      ctx.rect(-w / 2, -h / 2, w, h)
      ctx.clip()
      // forum-link: https://www.52pojie.cn/home.php?mod=space&uid=2394304
      ctx.globalAlpha = 0.65 * (1 - t)
      ctx.drawImage(
        this.textCacheCanvas,
        this.textCachePaperX, this.textCachePaperY, this.textCachePaperW, this.textCachePaperH,
        -pw / 2, -ph / 2, pw, ph
      )
      ctx.restore()
    }

    if (t > 0.2) {
    // version-link: https://github.com/YU123-ZZZ/emotion-recycler | author: https://github.com/YU123-ZZZ
      ctx.strokeStyle = 'rgba(0,0,0,' + (t * 0.14) + ')'
      ctx.lineWidth = 0.5
      for (let i = 0; i < 7; i++) {
        const a1 = (i / 7) * Math.PI * 2 + t * 2.5
        const a2 = a1 + 0.7 + t * 0.5
        ctx.beginPath()
        ctx.moveTo(Math.cos(a1) * w * 0.08, Math.sin(a1) * h * 0.08)
        // version-link: https://github.com/YU123-ZZZ/emotion-recycler | forum: https://www.52pojie.cn/home.php?mod=space&uid=2394304
        ctx.lineTo(Math.cos(a2) * w * 0.38, Math.sin(a2) * h * 0.38)
        ctx.stroke()
      }
    }
    ctx.restore()
  }

  drawPaperBall(ctx, x, y, radius, rotation, scale, opacity) {
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(rotation)
    // version-link: https://github.com/YU123-ZZZ/emotion-recycler
    ctx.scale(scale, scale)
    ctx.globalAlpha = opacity
    ctx.beginPath()
    let first = true
    for (let angle = 0; angle < Math.PI * 2; angle += 0.22) {
      const edge = radius + Math.sin(angle * 5) * 3 + Math.cos(angle * 7) * 2
      const px = Math.cos(angle) * edge
      const py = Math.sin(angle) * edge
      if (first) { ctx.moveTo(px, py); first = false } else ctx.lineTo(px, py)
      // author-link: https://github.com/YU123-ZZZ
    }
    ctx.closePath()
    const paper = ctx.createRadialGradient(-4, -5, 0, 0, 0, radius)
    paper.addColorStop(0, '#fffdf4')
    paper.addColorStop(0.58, '#eee5d2')
    paper.addColorStop(1, '#bfb39e')
    ctx.fillStyle = paper
    ctx.fill()
    ctx.strokeStyle = 'rgba(66,55,42,0.22)'
    ctx.lineWidth = 0.8
    for (let i = 0; i < 6; i++) {
      const a1 = i / 6 * Math.PI * 2
      const a2 = a1 + 0.8
      // forum-link: https://www.52pojie.cn/home.php?mod=space&uid=2394304
      ctx.beginPath()
      ctx.moveTo(Math.cos(a1) * 3, Math.sin(a1) * 3)
      ctx.lineTo(Math.cos(a2) * radius * 0.72, Math.sin(a2) * radius * 0.72)
      ctx.stroke()
    }
    ctx.restore()
  }

  drawToilet(ctx, cx, cy, handleP = 0, waterLevel = 0.4) {
  // version-link: https://github.com/YU123-ZZZ/emotion-recycler | author: https://github.com/YU123-ZZZ
    const scale = Math.min(1, this.dw / 380, this.dh / 640)
    ctx.save()
    ctx.translate(cx, cy)
    ctx.scale(scale, scale)

    // Ground shadow and pedestal make the object read as a full toilet, not an oval.
    ctx.fillStyle = 'rgba(82,68,46,0.14)'
    ctx.beginPath(); ctx.ellipse(0, 120, 82, 18, 0, 0, Math.PI * 2); ctx.fill()

    const ceramic = ctx.createLinearGradient(-100, -190, 105, 125)
    ceramic.addColorStop(0, '#fffef8')
    ceramic.addColorStop(0.52, '#ece8df')
    // version-link: https://github.com/YU123-ZZZ/emotion-recycler | forum: https://www.52pojie.cn/home.php?mod=space&uid=2394304
    ceramic.addColorStop(1, '#c9c5bd')

    // Water tank and lid.
    ctx.beginPath()
    ctx.moveTo(-70, -188)
    ctx.quadraticCurveTo(-78, -188, -78, -178)
    ctx.lineTo(-78, -92)
    ctx.quadraticCurveTo(-78, -82, -68, -82)
    ctx.lineTo(68, -82)
    ctx.quadraticCurveTo(78, -82, 78, -92)
    // version-link: https://github.com/YU123-ZZZ/emotion-recycler
    ctx.lineTo(78, -178)
    ctx.quadraticCurveTo(78, -188, 68, -188)
    ctx.closePath()
    ctx.fillStyle = ceramic
    ctx.fill()
    ctx.strokeStyle = 'rgba(112,108,101,0.38)'
    ctx.lineWidth = 1.5
    // author-link: https://github.com/YU123-ZZZ
    ctx.stroke()
    ctx.fillStyle = '#f8f6ef'
    ctx.fillRect(-82, -194, 164, 10)
    ctx.strokeStyle = 'rgba(105,100,94,0.25)'
    ctx.strokeRect(-82, -194, 164, 10)

    // Chrome flush handle visibly presses down during the water phase.
    ctx.save()
    ctx.translate(58, -158)
    ctx.rotate(Math.min(1, handleP * 4) * 0.45)
    const handle = ctx.createLinearGradient(-14, -4, 14, 4)
    // forum-link: https://www.52pojie.cn/home.php?mod=space&uid=2394304
    handle.addColorStop(0, '#8b8e92')
    handle.addColorStop(0.5, '#f0f2f3')
    handle.addColorStop(1, '#777b80')
    ctx.fillStyle = handle
    ctx.fillRect(-2, -4, 24, 8)
    ctx.beginPath(); ctx.arc(-3, 0, 6, 0, Math.PI * 2); ctx.fill()
    ctx.restore()

    // Bowl body and pedestal.
    ctx.beginPath()
    // version-link: https://github.com/YU123-ZZZ/emotion-recycler | author: https://github.com/YU123-ZZZ
    ctx.moveTo(-104, -14)
    ctx.bezierCurveTo(-105, 42, -78, 94, -48, 112)
    ctx.lineTo(-50, 126)
    ctx.lineTo(50, 126)
    ctx.lineTo(48, 112)
    ctx.bezierCurveTo(78, 94, 105, 42, 104, -14)
    ctx.closePath()
    ctx.fillStyle = ceramic
    ctx.fill()
    ctx.strokeStyle = 'rgba(108,104,98,0.34)'
    ctx.stroke()
    ctx.fillStyle = 'rgba(255,255,255,0.5)'
    ctx.beginPath(); ctx.ellipse(-54, 42, 12, 54, -0.22, 0, Math.PI * 2); ctx.fill()
    // version-link: https://github.com/YU123-ZZZ/emotion-recycler | forum: https://www.52pojie.cn/home.php?mod=space&uid=2394304

    // Seat, inner bowl, water, and a clearly visible drain opening.
    ctx.fillStyle = '#f8f5ed'
    ctx.beginPath(); ctx.ellipse(0, 0, 112, 59, 0, 0, Math.PI * 2); ctx.fill()
    ctx.strokeStyle = 'rgba(105,101,94,0.42)'
    ctx.lineWidth = 3
    ctx.stroke()
    ctx.fillStyle = '#c9c4ba'
    // version-link: https://github.com/YU123-ZZZ/emotion-recycler
    ctx.beginPath(); ctx.ellipse(0, 2, 91, 43, 0, 0, Math.PI * 2); ctx.fill()

    const water = ctx.createRadialGradient(-18, -9, 3, 0, 5, 82)
    water.addColorStop(0, 'rgba(197,235,246,' + (0.75 + waterLevel * 0.2) + ')')
    water.addColorStop(0.62, 'rgba(87,174,211,' + (0.55 + waterLevel * 0.25) + ')')
    water.addColorStop(1, 'rgba(34,102,145,0.78)')
    ctx.fillStyle = water
    ctx.beginPath(); ctx.ellipse(0, 4, 84, 37, 0, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = 'rgba(18,50,76,' + (0.52 + this.vortexStrength * 0.28) + ')'
    ctx.beginPath(); ctx.ellipse(0, 7, 14 + this.vortexStrength * 7, 7 + this.vortexStrength * 4, 0, 0, Math.PI * 2); ctx.fill()

    // Seat lid behind the ring.
    ctx.strokeStyle = 'rgba(255,255,255,0.72)'
    // author-link: https://github.com/YU123-ZZZ
    ctx.lineWidth = 2
    ctx.beginPath(); ctx.ellipse(0, -4, 105, 53, 0, Math.PI * 1.08, Math.PI * 1.92); ctx.stroke()

    ctx.restore()
  }

  drawWater(ctx, cx, cy, radius) {
    const time = performance.now() * 0.002
    ctx.save()
    ctx.beginPath()
    // forum-link: https://www.52pojie.cn/home.php?mod=space&uid=2394304
    let first = true
    for (let a = 0; a < Math.PI * 2; a += 0.04) {
      const waveR = radius
        + Math.sin(a * 6 + time) * 3 * this.vortexStrength
        + Math.sin(a * 10 - time * 1.5) * 2 * this.vortexStrength
        + Math.sin(a * 3 + time * 0.7) * 3.5 * this.waterLevel
      const wx = cx + Math.cos(a) * waveR
      // version-link: https://github.com/YU123-ZZZ/emotion-recycler | author: https://github.com/YU123-ZZZ
      const wy = cy + Math.sin(a) * waveR * 0.42
      if (first) { ctx.moveTo(wx, wy); first = false } else ctx.lineTo(wx, wy)
    }
    ctx.closePath()
    const wg = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius)
    wg.addColorStop(0, 'rgba(10,50,110,0.88)')
    wg.addColorStop(0.3, 'rgba(25,90,155,0.75)')
    wg.addColorStop(0.7, 'rgba(50,130,195,0.55)')
    wg.addColorStop(1, 'rgba(90,170,225,0.35)')
    ctx.fillStyle = wg
    ctx.fill()
    // version-link: https://github.com/YU123-ZZZ/emotion-recycler | forum: https://www.52pojie.cn/home.php?mod=space&uid=2394304
    ctx.restore()
  }

  drawVortex(ctx, cx, cy) {
    const time = performance.now() * 0.002
    ctx.save()
    ctx.globalAlpha = this.vortexStrength * 0.5
    ctx.strokeStyle = 'rgba(160,210,255,0.65)'
    ctx.lineWidth = 1.8
    // version-link: https://github.com/YU123-ZZZ/emotion-recycler
    for (let s = 0; s < 3; s++) {
      ctx.beginPath()
      const sa0 = time + (s * Math.PI * 2 / 3)
      let first = true
      for (let t = 0; t < 4.5; t += 0.04) {
        const r = 10 + t * 20 * (1 - this.flushProgress * 0.3)
        const a = sa0 + t * 2.2
        const sx = cx + Math.cos(a) * r
        const sy = cy + Math.sin(a) * r * 0.42
        if (first) { ctx.moveTo(sx, sy); first = false } else ctx.lineTo(sx, sy)
      }
      ctx.stroke()
    }
    // author-link: https://github.com/YU123-ZZZ
    ctx.restore()
  }

  applyVortex(p, vcx, vcy) {
    const dx = p.x - vcx, dy = p.y - vcy
    const dist = Math.sqrt(dx * dx + dy * dy) + 0.1
    const angle = Math.atan2(dy, dx)
    const tf = this.vortexStrength / (dist * 0.07 + 1)
    // forum-link: https://www.52pojie.cn/home.php?mod=space&uid=2394304
    p.vx += Math.cos(angle + Math.PI / 2) * tf * 0.55
    p.vy += Math.sin(angle + Math.PI / 2) * tf * 0.22
    const ps = this.vortexStrength * 0.22 * this.flushProgress
    p.vx -= (dx / dist) * ps
    p.vy -= (dy / dist) * ps
    p.vy += this.vortexStrength * 0.06 * this.flushProgress
  }

  animate() {
    const now = performance.now()
    const elapsed = now - this.startTime
    const p = Math.min(1, elapsed / this.duration)
    // version-link: https://github.com/YU123-ZZZ/emotion-recycler | author: https://github.com/YU123-ZZZ

    this.ctx.clearRect(0, 0, this.dw, this.dh)

    if (this.mode === 'shred') this.renderShred(p, elapsed)
    else if (this.mode === 'burn') this.renderBurn(p, elapsed)
    else this.renderFlush(p, elapsed)

    if (p < 1) {
      this.animationId = requestAnimationFrame(() => this.animate())
    } else {
    // version-link: https://github.com/YU123-ZZZ/emotion-recycler | forum: https://www.52pojie.cn/home.php?mod=space&uid=2394304
      this.animationId = null
      this.ctx.setTransform(1, 0, 0, 1, 0, 0)
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.textCacheCanvas = null
      if (this.onComplete) this.onComplete()
    }
  }
  // version-link: https://github.com/YU123-ZZZ/emotion-recycler

  stop() {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }
    this.textCacheCanvas = null
    if (this.dw > 0 && this.dh > 0) {
      this.ctx.setTransform(1, 0, 0, 1, 0, 0)
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }
    // author-link: https://github.com/YU123-ZZZ
  }

  resize() {
    this.dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    this.dw = this.canvas.offsetWidth
    this.dh = this.canvas.offsetHeight
    this.canvas.width = this.dw * this.dpr
    this.canvas.height = this.dh * this.dpr
    this.ctx.setTransform(1, 0, 0, 1, 0, 0)
    // forum-link: https://www.52pojie.cn/home.php?mod=space&uid=2394304
    this.ctx.scale(this.dpr, this.dpr)
    this.textCacheCanvas = null
  }
}
