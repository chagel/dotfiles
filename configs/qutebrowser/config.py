
config.load_autoconfig()

import dracula
dracula.blood(c, {})

c.auto_save.session = True

# c.qt.highdpi = True

c.editor.command = ['st', '-e', 'nvim', '{file}']

c.tabs.show = 'multiple'
c.tabs.position = 'top'
c.url.open_base_url = True
c.url.start_pages = ['https://web.tabliss.io']
c.url.default_page = "https://web.tabliss.io"
c.url.searchengines = {'DEFAULT': 'https://www.google.com/search?q={}', 
                       'w': 'https://en.wikipedia.org/wiki/{}', 
                       'd': 'https://devhints.io/{}', 
                       'a': 'https://wiki.archlinux.org/index.php/{}'}
c.window.hide_decoration = True
c.fonts.default_family = "Cantarell"
c.fonts.default_size = "14px"

c.colors.webpage.preferred_color_scheme = 'dark'
# c.colors.webpage.darkmode.enabled = True

c.downloads.location.directory = '~/Downloads/'

config.bind('X', 'undo')
config.bind('d', 'scroll-page 0 0.5')
config.bind('u', 'scroll-page 0 -0.5')
config.bind('j', 'scroll down ;; scroll down')
config.bind('k', 'scroll up ;; scroll up')
config.bind('x', 'tab-close')

config.bind('<Ctrl-Shift-j>', 'zoom-out')
config.bind('<Ctrl-Shift-k>', 'zoom-in')

config.bind('<Ctrl-b>', 'config-cycle statusbar.show always never')
config.bind('<Ctrl-h>', 'config-cycle tabs.show always never')

config.bind('<Ctrl-.>', 'spawn --userscript qute_1pass.py fill_credentials --cache-session')
config.bind('<Ctrl-,>', 'spawn --userscript qute_1pass.py fill_username --cache-session')
config.bind('<Ctrl-/>', 'spawn --userscript qute_1pass.py fill_password --cache-session')
config.bind('<Ctrl-?>', 'spawn --userscript qute_1pass.py fill_totp --cache-session')

config.bind('<Ctrl-r>', 'spawn --userscript readability.js')
config.bind('<Ctrl-d>', 'spawn --userscript pinboard.sh')
config.bind('<Ctrl-o>', 'spawn --userscript translate.sh')
config.bind('<Ctrl-g>', 'spawn --userscript translate_page.sh')

