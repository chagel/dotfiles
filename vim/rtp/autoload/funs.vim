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

function! funs#zen_html_tab()
  " try to determine if we're within quotes or tags.
  " if so, assume we're in an emmet fill area.
  let line = getline('.')
  if col('.') < len(line)
    let line = matchstr(line, '[">][^<"]*\%'.col('.').'c[^>"]*[<"]')

    if len(line) >= 2
      return "\<C-y>n"
    endif
  endif

  " go to next item in a popup menu.
  " this will insert a snippet if it's selected in the menu
  " due to neosnippets being the first check.
  if pumvisible()
    return "\<C-n>"
  endif

  " expand anything emmet thinks is expandable.
  " I'm not sure anything happens below this block.
  if emmet#isExpandable()
    return "\<C-y>,"
  endif

  " return a regular tab character
  return "\<tab>"
endfunction

function! funs#LightLineFilename()
  return pathshorten(fnamemodify(expand('%'), ":."))
endfunction
