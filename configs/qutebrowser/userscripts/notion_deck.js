#!/usr/bin/env node

const qute = require('qutejs');
const JSDOM = require('jsdom').JSDOM;
const fs = require('fs');
const path = require('path');
const util = require('util');

const TEMPLATE = `
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
    <script src="/home/mike/Workspaces/chagel.github.io/slides/remark-latest.min.js">
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
const tmpFile = path.join(scriptsDir, '/notion_deck.html');

if (!fs.existsSync(scriptsDir)) {
    fs.mkdirSync(scriptsDir);
}

class RemarkFormat {
	constructor(title, items) {
		this.title = title;
		return this.parse(items);
	}

	parse(items) {
		let result = "\nclass: center, middle\n"
		result += "# " + this.title
		result += "\n"

		for (let node of items) {
			if (node.type == 'H1') {
				result += "\n"
				result += '---'
				result += "\n"
				result += "# "
			}
			if (node.type == 'H2') {
				result += "## "
			}
			if (node.type == 'H3') {
				result += "### "
			}
			if (node.type == 'PRE') {
				result += ".remark-code.hljs[```"
				result += "\n"
			}
			if(node.type == 'UL') {
				result += "* "
			}
			if(node.type == 'OL') {
				result += "1. "
			}
			if(node.type == 'CHECKED') {
				result += "- [x] "
			}
			if(node.type == 'CHECK') {
				result += "- [ ] "
			}
			if(node.type == 'BQ') {
				result += "> "
			}
			if(node.type == 'IMG') {
				result += ".center[![Image](" 
				result += node.value.url 
				result += ")]"
			}
			else {
				result += node.value
			}
			if (node.type == 'PRE') {
				result += "```]"
			}
			result += "\n"
		}
		return { content: result };
	}
}

class NotionParser {
	constructor(document) {
		this.config = {
			title: document.title,
			dark: document.body.classList.contains("dark"),
		};
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
			config: this.config,
			items: this.nodes,
			createdAt: String(new Date()),
		};
	}

	parseNode(node) {
		if (node.classList.contains("notion-text-block")) this.parseText(node); // P
		if (node.classList.contains("notion-bulleted_list-block")) this.parseText(node, "UL");
		if (node.classList.contains("notion-numbered_list-block")) this.parseText(node, "OL");
		if (node.classList.contains("notion-image-block")) this.parseImage(node); // IMG
		if (node.classList.contains("notion-header-block")) this.parseHeader(node, "H1");
		if (node.classList.contains("notion-sub_header-block")) this.parseHeader(node, "H2");
		if (node.classList.contains("notion-sub_sub_header-block")) this.parseHeader(node, "H3");
		if (node.classList.contains("notion-code-block")) this.parseCode(node); // PRE
		if (node.classList.contains("notion-divider-block")) this.parseHr(node); // HR
		if (node.classList.contains("notion-toggle-block")) this.parseToggle(node); // TL
		if (node.classList.contains("notion-callout-block")) this.parseText(node, "CA");
		if (node.classList.contains("notion-quote-block")) this.parseText(node, "BQ");
		if (node.classList.contains("notion-to_do-block")) this.parseTodo(node); // type=CHECK||CHECKED
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
		let elements = node.querySelectorAll("[data-root=true]");
		if (elements.length == 0) return;
		this.addNode(type, this.formatContent(elements[0].innerHTML), this.getLevel(node));
	}

	parseHeader(node, type) {
		let elements = node.querySelectorAll("[data-root=true]");
		if (elements.length == 0) return;
		this.addNode(type, elements[0].innerHTML, this.getLevel(node));
	}

	parseCode(node) {
		let elements = node.querySelectorAll("[data-root=true]");
		if (elements.length == 0) return;
		this.addNode("PRE", elements[0].textContent, this.getLevel(node));
	}

	parseHr(node) {
		this.addNode("HR", "", this.getLevel(node));
	}

	parseToggle(node) {
		let elements = node.querySelectorAll("[data-root=true]");
		if (elements.length == 0) return;
		this.addNode("TL", elements[0].innerHTML, this.getLevel(node));
	}

	parseCallout(node) {
		let elements = node.querySelectorAll("[data-root=true]");
		if (elements.length == 0) return;
		this.addNode("CA", elements[0].innerHTML, this.getLevel(node));
	}

	parseTodo(node) {
		let elements = node.querySelectorAll("[data-root=true]");
		if (elements.length == 0) return;
		let type = elements[0].style["text-decoration"] == "line-through" ? "CHECKED" : "CHECK";
		this.addNode(type, elements[0].innerHTML, this.getLevel(node));
	}

	getLevel(node, level = -1) {
		if (node.classList && node.classList.contains("notion-selectable")) level++;
		if (node.parentNode) return this.getLevel(node.parentNode, level);
		return level;
	}
}

let getDOM, domOpts, target;
if (process.env.QUTE_MODE === 'hints') {
	getDOM = JSDOM.fromURL;
	target = process.env.QUTE_URL;
}
else {
	getDOM = JSDOM.fromFile;
	domOpts = {url: process.env.QUTE_URL, contentType: "text/html; charset=utf-8"};
	target = process.env.QUTE_HTML;
}

getDOM(target, domOpts).then(dom => {
	let deck = new NotionParser(dom.window.document);
	let body = new RemarkFormat(deck.config.title, deck.items);

	let content = util.format(TEMPLATE, deck.config.title, body.content);

	fs.writeFile(tmpFile, content, (err) => {
		if (err) {
			qute.messageError([`"${err}"`])
			return 1;
		}
		qute.open(['-r', tmpFile]);
	})
});

