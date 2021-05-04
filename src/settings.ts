import lzstring from 'lz-string'

export const settingsFromURL = () => {
  const location = document.location
  let code: string = ''

  // Support an zipped param of #code which
  // holds the source code in a URL safe way

  // This is URL compatible with how TypeScript-y websites send
  // code between each other
  if (location.hash.startsWith('#code')) {
    const codeHash = location.hash.replace('#code/', '').trim()
    let userCode = lzstring.decompressFromEncodedURIComponent(codeHash)
    // Fallback incase there is an extra level of decoding:
    // https://gitter.im/Microsoft/TypeScript?at=5dc478ab9c39821509ff189a
    if (!userCode)
      userCode = lzstring.decompressFromEncodedURIComponent(decodeURIComponent(codeHash))
    code = userCode || ' '
  }

  // This assumes that late
  const searchParams = new URLSearchParams(location.search)

  return {
    code,
    theme: searchParams.get('theme') || '',
    lang: searchParams.get('lang') || ''
  }
}
