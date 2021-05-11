#!/bin/sh

echo "open -t https://pinboard.in/add?showtags=yes&url=$QUTE_URL&description=$QUTE_SELECTED_TEXT&title=$QUTE_TITLE" >> $QUTE_FIFO
