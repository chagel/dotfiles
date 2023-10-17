local wezterm = require 'wezterm'
local config = {}

config.font = wezterm.font {
  family = 'JetBrains Mono',
  weight = 'Regular',
  stretch = 'Normal',
  -- harfbuzz_features = { 'calt=0', 'clig=0', 'liga=0' },
}
config.font_size = 14
config.color_scheme = 'Dracula'
config.freetype_load_target = 'Normal'

config.hide_tab_bar_if_only_one_tab = true

return config
