<template>
  <div id="exporter">
    <div class="export-option" @click="saveToImage">save to image</div>
    <div class="export-option" @click="saveToSVG">save to svg</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { getSVGRenderer } from 'shiki-renderer-svg/dist/index.browser.mjs'
import domtoimage from 'dom-to-image'
import { saveAs } from 'file-saver'
import { highlighter } from '../highlighter'

export default defineComponent({
  computed: {
    activeTheme(): string {
      return this.$store.state.theme
    },
    bgColor() {
      return this.$store.state.bgColor
    }
  },
  methods: {
    saveToImage() {
      const node: HTMLElement = document.querySelector('#preview-container')!

      domtoimage
        .toBlob(node, {
          width: node.offsetWidth * 2,
          height: node.offsetHeight * 2,
          style: {
            transform: 'scale(2)',
            'transform-origin': 'top left',
            background: this.bgColor,
            width: node.offsetWidth + 'px',
            height: node.offsetHeight + 'px'
          }
        })
        .then((blob) => {
          saveAs(blob, 'shiki.png')
        })
    },
    async saveToSVG() {
      const svgRenderer = await getSVGRenderer({
        bg: '#2E3440',
        fontFamily: 'SFMono-Regular',
        fontSize: 12,
        bgSideCharPadding: 2,
        bgVerticalCharPadding: 0.6
      })

      const svgOut = svgRenderer.renderToSVG(
        highlighter.codeToThemedTokens(this.$store.state.code, this.$store.state.lang, this.activeTheme),
        { bg: this.bgColor }
      )
      saveAs(new Blob([svgOut], { type: 'text/plain;charset=utf-8' }), 'shiki.svg')
    }
  }
})
</script>

<style>
#exporter {
  border-left: var(--border);
  border-right: var(--border);

  flex-shrink: 0;

  display: flex;
  flex-flow: column nowrap;
}
#exporter button {
  margin-bottom: 1rem;
}
.export-option {
  padding: 4px 12px 4px 8px;
  cursor: pointer;
}
.export-option:hover {
  color: var(--hover-foreground);
  background-color: var(--hover-background);
}
</style>