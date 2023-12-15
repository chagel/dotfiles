function! funs#goyo_enter()
  silent !tmux set status off
  silent !tmux list-panes -F '\#F' | grep -q Z || tmux resize-pane -Z
  set noshowmode
  set noshowcmd
  set scrolloff=999
  Limelight
endfunction

function! funs#goyo_leave()
  silent !tmux set status on
  silent !tmux list-panes -F '\#F' | grep -q Z && tmux resize-pane -Z
  set showmode
  set showcmd
  set scrolloff=5
  Limelight!
endfunction

function! funs#LightLineFilename()
  return pathshorten(fnamemodify(expand('%'), ":."))
endfunction

function! funs#config_neovide()
  if exists("g:neovide")
    let g:neovide_transparency = 0.8
    set guifont=JetBrains\ Mono:h14
    set linespace=10
    let g:neovide_scale_factor = 1.0
    let g:neovide_padding_top = 20
    let g:neovide_padding_bottom = 10
    let g:neovide_padding_right = 10
    let g:neovide_padding_left = 10
    let g:neovide_scroll_animation_length = 0
    let g:neovide_cursor_animation_length = 0
    let g:neovide_cursor_trail_size = 0

  endif
endfunction
