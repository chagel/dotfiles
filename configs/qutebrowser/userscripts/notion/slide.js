#!/usr/bin/env node

// # Description
//
// This userscript is to present Notion[1] docs in slides. It reads and extracts 
// current public or private Notion doc, and renders the content to a local 
// RemarkJS[2] template HTML file.
//
// # Prerequisites
// No dependencies required by default. You can clone the remark-it[3] project to
// get more themes. Otherwise, everything should be fine.
//
// # Usage
//
// :spawn --userscript notion/slide.js
//
// or bind a shortkey to trigger it:
// config.bind('<Ctrl-m>', 'spawn --userscript notion/slide.js')
//
// Copyright (c) 2021 MGC <chagel@gmail.com>
//
// [1]: https://notion.so
// [2]: https://github.com/gnab/remark
// [3]: https://github.com/1-2-3/remark-it

const qute  = require('qutejs');
const JSDOM = require('jsdom').JSDOM;
const fs    = require('fs');
const path  = require('path');
const util  = require('util');
const log = require('simple-node-logger').createSimpleLogger('/tmp/qute_notion_slide.log');

const template = `
<!DOCTYPE html>
<html>
  <head>
    <title>%s</title>
    <meta charset="utf-8">
		 <link rel="stylesheet" type="text/css" href="/home/mike/Workspaces/chagel.github.io/slides/remark-it/css/nord-dark.css" />
    <style>
      body { font-family: 'Cantarell'; }
      h1, h2, h3 {
        font-family: 'Segoe UI';
        font-weight: bold;
      }
      .remark-code, .remark-inline-code { font-family: 'mononoki'; }
			img { max-width: 100% }
    </style>
  </head>
  <body>
    <textarea id="source">
layout: true
class: nord-dark
---
%s
		</textarea>
    <script src="https://remarkjs.com/downloads/remark-latest.min.js">
    </script>
    <script>
      var slideshow = remark.create({
				ratio: '16:9',
				highlightStyle: "github",
        highlightLines: true,
			});
    </script>
  </body>
</html>
`

const scriptsDir = path.join(process.env.QUTE_DATA_DIR, 'userscripts');
const tmpFile    = path.join(scriptsDir, '/notion_deck.html');

if (!fs.existsSync(scriptsDir)) {
    fs.mkdirSync(scriptsDir);
}

class MarkFormat {
	constructor(title, items) {
		this.title = title;
		this.nodes = [];
		return this.parse(items);
	}

	p(str) {
		this.nodes.push(str);
	}

	parseNode(node) {
		if (node.type == 'H1')
			this.p("\n---\n# ")
		if (node.type == 'H2')
			this.p("## ")
		if (node.type == 'H3') 
			this.p("### ")
		if (node.type == 'PRE') 
			this.p(".remark-code.hljs[```\n")
		if(node.type == 'UL') 
			this.p("* ")
		if(node.type == 'OL') 
			this.p("1. ")
		if(node.type == 'CHECKED') 
			this.p("- [x] ")
		if(node.type == 'CHECK') 
			this.p("- [ ] ")
		if(node.type == 'BQ') 
			this.p("> ")
		if(node.type == 'IMG') 
			this.p(".center[![Image](" + node.value.url + ")]")
		else 
			this.p(node.value)
		if (node.type == 'PRE') 
			this.p("```]")
	}

	parse(items) {
		this.p("\nclass: center, middle\n");
		this.p("# " + this.title);
		this.p("\n");

		for (let node of items) {
			this.parseNode(node)
			this.p("\n")
		}

		return { content: this.nodes.join('') };
	}
}

class NotionParser {
	constructor(document) {
		this.title = document.title;
		this.nodes = [];
		return this.parse(document);
	}

	addNode(type, value = "", level = 0) {
		this.nodes.push({ type: type, value: value, level: level });
	}

	parse(document) {
		let elements = document.querySelectorAll(".notion-page-content .notion-selectable");
		for (let node of elements) {
			this.parseNode(node);
		}

		return {
			title: this.title,
			items: this.nodes
		};
	}

	parseNode(node) {
		//log.info(node.outerHTML);
		if (node.classList.contains("notion-text-block")) 
			this.parseText(node); 
		if (node.classList.contains("notion-bulleted_list-block")) 
			this.parseText(node, "UL");
		if (node.classList.contains("notion-numbered_list-block")) 
			this.parseText(node, "OL");
		if (node.classList.contains("notion-image-block")) 
			this.parseImage(node); 
		if (node.classList.contains("notion-header-block")) 
			this.parseHeader(node, "H1");
		if (node.classList.contains("notion-sub_header-block")) 
			this.parseHeader(node, "H2");
		if (node.classList.contains("notion-sub_sub_header-block")) 
			this.parseHeader(node, "H3");
		if (node.classList.contains("notion-code-block")) 
			this.parseCode(node); 
		if (node.classList.contains("notion-divider-block")) 
			this.parseHr(node); 
		if (node.classList.contains("notion-toggle-block")) 
			this.parseToggle(node);
		if (node.classList.contains("notion-callout-block")) 
			this.parseText(node, "CA");
		if (node.classList.contains("notion-quote-block")) 
			this.parseText(node, "BQ");
		if (node.classList.contains("notion-to_do-block")) 
			this.parseTodo(node);
	}

	formatContent(content) {
		content = content.replace("\n", "<br/>");
		return content;
	}

	parseImage(node) {
		let elements = node.querySelectorAll("img");
		if (elements.length == 0) return;

		let url = elements[0].getAttribute("src");
		if (url[0] == "/") url = "https://www.notion.so" + url;

		let image = url;
		if (node.style["width"])
			image = {
				url: url,
				width: parseInt(node.style["width"]),
			};

		this.addNode("IMG", image, this.getLevel(node));
	}

	parseText(node, type = "P") {
		let elements = node.querySelectorAll("[data-content-editable-leaf=true]");
		if (elements.length == 0) return;
		this.addNode(type, this.formatContent(elements[0].innerHTML), this.getLevel(node));
	}

	parseHeader(node, type) {
		let elements = node.querySelectorAll("[data-content-editable-leaf=true]");
		if (elements.length == 0) return;
		this.addNode(type, elements[0].innerHTML, this.getLevel(node));
	}

	parseCode(node) {
		let elements = node.querySelectorAll("[data-content-editable-leaf=true]");
		if (elements.length == 0) return;
		this.addNode("PRE", elements[0].textContent, this.getLevel(node));
	}

	parseHr(node) {
		this.addNode("HR", "", this.getLevel(node));
	}

	parseToggle(node) {
		let elements = node.querySelectorAll("[data-content-editable-leaf=true]");
		if (elements.length == 0) return;
		this.addNode("TL", elements[0].innerHTML, this.getLevel(node));
	}

	parseCallout(node) {
		let elements = node.querySelectorAll("[data-content-editable-leaf=true]");
		if (elements.length == 0) return;
		this.addNode("CA", elements[0].innerHTML, this.getLevel(node));
	}

	parseTodo(node) {
		let elements = node.querySelectorAll("[data-content-editable-leaf=true]");
		if (elements.length == 0) return;
		let type = elements[0].style["text-decoration"].includes("line-through") ? "CHECKED" : "CHECK";
		this.addNode(type, elements[0].innerHTML, this.getLevel(node));
	}

	getLevel(node, level = -1) {
		if (node.classList && node.classList.contains("notion-selectable")) level++;
		if (node.parentNode) return this.getLevel(node.parentNode, level);
		return level;
	}
}

let getDOM, domOpts, target;

getDOM = JSDOM.fromFile;
domOpts = {url: process.env.QUTE_URL, contentType: "text/html; charset=utf-8"};
target = process.env.QUTE_HTML;

getDOM(target, domOpts).then(dom => {
	let deck = new NotionParser(dom.window.document);
	let body = new MarkFormat(deck.title, deck.items);
	let content = util.format(template, deck.title, body.content);

	fs.writeFile(tmpFile, content, (err) => {
		if (err) {
			qute.messageError([`"${err}"`])
			return 1;
		}
		qute.open(['-r', tmpFile]);
	})
});

