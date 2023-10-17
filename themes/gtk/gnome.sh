#!/bin/bash

# gsettings set org.gnome.desktop.interface gtk-theme "Catppuccin-Mocha"
# gsettings set org.gnome.desktop.wm.preferences theme "Catppuccin-Mocha"

cd ~/.config || exit

rm -rf gtk-3.0-old
rm -rf gtk-4.0-old

mv gtk-3.0 gtk-3.0-old
mv gtk-4.0 gtk-4.0-old

ln -s /usr/share/themes/Catppuccin-Mocha-Standard-Blue-Dark/gtk-3.0 gtk-3.0
ln -s /usr/share/themes/Catppuccin-Mocha-Standard-Blue-Dark/gtk-4.0 gtk-4.0

sudo chown "$(whoami):$(whoami)" gtk-3.0
sudo chown "$(whoami):$(whoami)" gtk-4.0

cp gtk-3.0-old/settings.ini gtk-3.0/
cp gtk-4.0-old/settings.ini gtk-4.0/
