#!/bin/sh

echo "open -r https://translate.google.com/translate?sl=auto&tl=zh-CN&u=$QUTE_URL" >> "$QUTE_FIFO"
