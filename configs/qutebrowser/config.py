import subprocess 

config.load_autoconfig()

import dracula
dracula.blood(c, {})

c.qt.environ = {"NODE_PATH": subprocess.check_output(["npm","root","-g"]).decode('utf-8').strip()}
c.qt.highdpi = True
c.zoom.default = '100%'
c.qt.args += [
    "ignore-gpu-blacklist",
    "enable-accelerated-2d-canvas",
    "enable-gpu-memory-buffer-video-frames",
    "enable-gpu-rasterization",
    "enable-native-gpu-memory-buffers",
    "enable-oop-rasterization",
    "enable-zero-copy",
]

c.auto_save.session = True

c.editor.command = ['foot', 'nvim', '{file}']

c.tabs.show = 'multiple'
c.tabs.position = 'top'

c.url.open_base_url = True
c.url.start_pages = ['https://web.tabliss.io']
c.url.default_page = "https://web.tabliss.io"
c.url.searchengines = {'DEFAULT': 'https://www.google.com/search?q={}', 
                       'w': 'https://en.wikipedia.org/wiki/{}', 
                       'd': 'https://devhints.io/{}', 
                       'a': 'https://wiki.archlinux.org/index.php/{}',
                       'r': 'https://apidock.com/ruby/{}', 
                       'l': 'https://apidock.com/rails/{}'} 

c.window.hide_decoration = True
c.fonts.default_family = "Cantarell"
c.fonts.default_size = "14px"

c.colors.webpage.preferred_color_scheme = 'dark'
# c.colors.webpage.darkmode.enabled = True

c.downloads.location.directory = '~/Downloads/'

c.content.javascript.clipboard = 'access'
c.content.notifications.enabled = True

config.bind('X', 'undo')
config.bind('hh', 'home')
config.bind('d', 'scroll-page 0 0.5')
config.bind('u', 'scroll-page 0 -0.5')
config.bind('j', 'scroll down ;; scroll down')
config.bind('k', 'scroll up ;; scroll up')
config.bind('x', 'tab-close')

config.bind('<Ctrl-Shift-j>', 'zoom-out')
config.bind('<Ctrl-Shift-k>', 'zoom-in')

config.bind('1', 'tab-focus 1')
config.bind('2', 'tab-focus 2')
config.bind('3', 'tab-focus 3')
config.bind('4', 'tab-focus 4')
config.bind('5', 'tab-focus 5')
config.bind('6', 'tab-focus 6')
config.bind('7', 'tab-focus 7')
config.bind('8', 'tab-focus 8')
config.bind('9', 'tab-focus 9')

config.bind('<Ctrl-b>', 'config-cycle statusbar.show always never')
config.bind('<Ctrl-h>', 'config-cycle tabs.show always never')

config.bind('<Ctrl-r>', 'spawn --userscript reading/readability.js')
config.bind('<Ctrl-d>', 'spawn --userscript reading/pinboard.sh')
config.bind('<Ctrl-o>', 'spawn --userscript translate/word.sh')
config.bind('<Ctrl-g>', 'spawn --userscript translate/page.sh')
config.bind('<Ctrl-m>', 'spawn --userscript notion/slide.js')


