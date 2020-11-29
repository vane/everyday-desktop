const sourceCode = [
  '.c', '.h', // C
  '.cpp', '.cc','.cxx','.hpp','.hh','.hxx', // C++
  '.cs', // C#
  '.css', // css
  '.dart', // Dart
  '.diff', // Diff
  '.erl', // Erlang
  '.go', // Go
  '.html', '.htm', // HTML
  '.java', // Java
  '.js', '.jsx', // JavaScript
  '.json', // JSON
  '.lua', // Lua
  '.pl','.pm', // Perl
  '.php','.php3','.php4','.php5','.phtml', // PHP
  '.py', // Python
  '.rb', // Ruby
  '.rs', // Rust
  '.scala', // Scala
  '.sql', // SQL
  '.svelte', // Svelte
  '.yaml','.yml', // YAML
  '.vue', // VueJS
]
const plainText = [
  'txt','text','conf','def','list','log'
]
const markDown = [
  'markdown','md','mkd'
]
const image = [
  '.png', '.jpg', '.jpeg'
]
const video = [
  '.mp4',
]
exports.isKnownFileType = (ext) => {
  if (sourceCode.indexOf(ext) !== -1) {
    return 1
  } else if (plainText.indexOf(ext) !== -1) {
    return 2
  } else if (markDown.indexOf(ext) !== -1) {
    return 3
  } else if (image.indexOf(ext) !== -1) {
    return 4
  } else if (video.indexOf(ext) !== -1) {
    return 5
  }
  return 0
}
