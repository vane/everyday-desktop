class FileExtension {
  static Unknown = 0
  static SourceCode = 1
  static PlainText = 2
  static MarkDown = 3
  static Image = 4
  static Video = 5
}

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
    return FileExtension.SourceCode
  } else if (plainText.indexOf(ext) !== -1) {
    return FileExtension.PlainText
  } else if (markDown.indexOf(ext) !== -1) {
    return FileExtension.MarkDown
  } else if (image.indexOf(ext) !== -1) {
    return FileExtension.Image
  } else if (video.indexOf(ext) !== -1) {
    return FileExtension.Video
  }
  return FileExtension.Unknown
}

exports.FileExtension = FileExtension
