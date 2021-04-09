#!/bin/sh
notmuch new

COUNT=$(notmuch count tag:unread)
if [ ${COUNT} != 0 ]; then
	notify-send "EMAIL" "${COUNT} new messages"
fi
