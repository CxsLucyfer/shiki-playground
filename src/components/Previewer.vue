<template>
  <div id="previewer" :style="{ color: fgColor, backgroundColor: bgColor }">
    <div id="preview-container">
      <div
        id="shiki-output"
        :class="{ active: showPreview }"
        v-html="highlightedCode"
        @click="hidePreview"
      ></div>
      <textarea id="shiki-input" v-model="rawCode" ref="cc" :style="{ caretColor: fgColor }" />
    </div>
    <config-bar />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { highlighter } from '../highlighter'
import ConfigBar from './ConfigBar.vue'

export default defineComponent({
  components: {
    ConfigBar
  },
  data() {
    return {
      showPreview: true,
      rawCode: '',
      highlightedCode: '',
      hl: undefined
    }
  },
  computed: {
    code(): string {
      return this.$store.state.code
    },
    langToShow(): string {
      return this.$store.state.previewLang || this.$store.state.lang
    },
    themeToShow(): string {
      return this.$store.state.previewTheme || this.$store.state.theme
    },
    fgColor() {
      return this.$store.state.fgColor
    },
    bgColor() {
      return this.$store.state.bgColor
    }
  },
  watch: {
    async code(c) {
      this.rawCode = c
      await this.updateHighlighter()
    },
    async rawCode(c) {
      this.$store.commit('changeCode', c)
      this.refreshPreview()
    },
    async langToShow() {
      await this.updateHighlighter()
    },
    async themeToShow() {
      await this.updateHighlighter()
    }
  },
  methods: {
    async updateHighlighter() {
      this.highlightedCode = highlighter.codeToHtml(this.code, this.langToShow, this.themeToShow)
    },
    async refreshPreview() {
      this.showPreview = true
      await this.updateHighlighter()
    },
    hidePreview() {
      this.showPreview = false
      ;(this.$refs as any).cc.focus()
    }
  }
})
</script>

<style>
#previewer {
  position: relative;
  height: 100%;
  border-left: var(--border);
  overflow: auto;
}
#preview-container {
  position: absolute;
  width: auto;
  display: inline-block;
  border-right: var(--border);
  border-bottom: var(--border);
}
#shiki-input,
#shiki-output {
  line-height: 1.3em;
  font-size: var(--mono-font-size);
  height: calc(100% - 16px);
  padding: 20px 32px;
  margin: 20px;
  font-family: var(--mono-font);
  border: var(--border);
}
#shiki-input {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  resize: none;
  color: transparent;
  background-color: transparent;
  border: 0;
  outline: none;
  width: 100%;
}
#shiki-output {
  display: inline-block;
  pointer-events: none;
  border-radius: 10px;
}
pre {
  margin: 0;
}
pre code {
  font-family: var(--mono-font);
  font-size: var(--mono-font-size);
  white-space: pre;
}
.shiki {
  display: inline-block;
}
</style>
