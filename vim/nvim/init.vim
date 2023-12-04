set runtimepath^=~/.vim runtimepath+=~/.vim/after
let &packpath = &runtimepath

source ~/.vimrc

lua << EOF
  -- disable netrw at the very start of your init.lua (strongly advised)
  vim.g.loaded_netrw = 1
  vim.g.loaded_netrwPlugin = 1

  -- empty setup using defaults
  require("nvim-tree").setup()

  -- open the tree when startup
  local function open_nvim_tree()
    require("nvim-tree.api").tree.open()
  end

  -- vim.api.nvim_create_autocmd({ "VimEnter" }, { callback = open_nvim_tree })

  -- telescope 
  local builtin = require('telescope.builtin')
  vim.keymap.set('n', '<C-p>', builtin.find_files, {})
  vim.keymap.set('n', '<C-f>', builtin.live_grep, {})
  vim.keymap.set('n', '<C-b>', builtin.buffers, {})
  vim.keymap.set('n', '<leader>t', builtin.treesitter, {})
  vim.keymap.set('n', '<leader>c', builtin.git_commits, {})

  require('telescope').setup{
    defaults = {
      prompt_position = 'top',
      layout_strategy = 'horizontal',
      layout_config = { height = 0.5 },
    },
  }


  -- Mappings.
  -- See `:help vim.diagnostic.*` for documentation on any of the below functions
  local opts = { noremap=true, silent=true }
  vim.keymap.set('n', '<space>e', vim.diagnostic.open_float, opts)
  vim.keymap.set('n', '[d', vim.diagnostic.goto_prev, opts)
  vim.keymap.set('n', ']d', vim.diagnostic.goto_next, opts)
  vim.keymap.set('n', '<space>q', vim.diagnostic.setloclist, opts)
  vim.keymap.set('n', '<Leader>f', vim.diagnostic.disable, opts)

  -- Use an on_attach function to only map the following keys
  -- after the language server attaches to the current buffer
  local on_attach = function(client, bufnr)
    -- Enable completion triggered by <c-x><c-o>
    vim.api.nvim_buf_set_option(bufnr, 'omnifunc', 'v:lua.vim.lsp.omnifunc')

    -- Mappings.
    -- See `:help vim.lsp.*` for documentation on any of the below functions
    local bufopts = { noremap=true, silent=true, buffer=bufnr }
    vim.keymap.set('n', 'gD', vim.lsp.buf.declaration, bufopts)
    vim.keymap.set('n', 'gd', vim.lsp.buf.definition, bufopts)
    vim.keymap.set('n', 'K', vim.lsp.buf.hover, bufopts)
    vim.keymap.set('n', 'gi', vim.lsp.buf.implementation, bufopts)
    vim.keymap.set('n', 'gr', vim.lsp.buf.references, bufopts)
    vim.keymap.set('n', '<C-k>', vim.lsp.buf.signature_help, bufopts)
    vim.keymap.set('n', '<space>D', vim.lsp.buf.type_definition, bufopts)
    vim.keymap.set('n', '<space>rn', vim.lsp.buf.rename, bufopts)
    vim.keymap.set('n', '<space>ca', vim.lsp.buf.code_action, bufopts)
    vim.keymap.set('n', '<space>f', function() vim.lsp.buf.format { async = true } end, bufopts)
  end


  -- Setup LSP 
--  local nvim_lsp = require('lspconfig')
--  local servers = {'pyright', 'gopls', 'rust_analyzer', 'solargraph'}
--  for _, lsp in ipairs(servers) do
--    nvim_lsp[lsp].setup {
--      on_attach = on_attach,
--    }
--  end

  -- Enable treesitter syntax highlight
  require'nvim-treesitter.configs'.setup {
    highlight = {
        enable = true
    },
  }

  require("chatgpt").setup{
    api_key_cmd = "pass keys/openai_api_key"
  }

  require("gitblame").setup {
    enable = true,
    message_template = "@<author> • <date> • [<summary>]",
    date_format = "%r",
    max_length = 120,
    min_distance = 10,
    delay = 1000,
  }

EOF
