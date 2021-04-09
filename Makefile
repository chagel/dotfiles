DOTS := $(shell ls dots)
CONFIGS := $(shell ls configs)
BASE := $(shell pwd)


all: dotfile config
config: vim-config tmux-config zsh-config
update: vim-update tmux-update zsh-update
server: init basic

init: 
	@mkdir -pv ${HOME}/.config
	@touch ${HOME}/.bash_profile

basic:
	## add basic alias to .bash init
	@echo "source ${BASE}/aliases/basic" >> ${HOME}/.bash_profile

dotfile:
	## make dotfile in home root folder
	@for item in $(DOTS); do ln -vsf ${BASE}/dots/$$item ${HOME}/.$$item; done
	@for item in $(CONFIGS); do ln -vsfn ${BASE}/configs/$$item ${HOME}/.config/$$item; done

vim-config:
	## config vim 
	@ln -vsfn ${BASE}/vim ${HOME}/.vim
	@ln -vsfn ${BASE}/vim/nvim ${HOME}/.config/nvim
	@ln -vsf ${BASE}/vim/vimrc ${HOME}/.vimrc

vim-update:
	## update vim plugins
	@vim +PlugUpgrade +PlugInstall +PlugUpdate 

zsh-config:
	## config zsh 
	@ln -vsf ${BASE}/zsh/zshrc ${HOME}/.zshrc
	@ln -vsf ${BASE}/zsh/themes/mgc.zsh-theme ${HOME}/.oh-my-zsh/themes/mgc.zsh-theme

zsh-update:
	## update omz
	@omz update 

tmux-config:
	## config tmux 
	@ln -vsfn ${BASE}/tmux ${HOME}/.tmux
	@ln -vsf ${BASE}/tmux/tmux.conf ${HOME}/.tmux.conf

tmux-update:
	## update tmux plugins 
	~/.tmux/plugins/tpm/bin/install_plugins
	~/.tmux/plugins/tpm/bin/update_plugins all

clean: 
	## clean up 

