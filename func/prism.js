

const styles = {
	cdata: "color:#8292a2",
	comment: "color:#8292a2",
	doctype: "color:#8292a2",
	prolog: "color:#8292a2",
	punctuation: "color:#f8f8f2",
	namespace: "opacity:.7",
	constant: "color:#f92672",
	deleted: "color:#f92672",
	property: "color:#f92672",
	symbol: "color:#f92672",
	tag: "color:#f92672",
	boolean: "color:#ae81ff",
	number: "color:#ae81ff",
	'attr-name': "color:#a6e22e",
	builtin: "color:#a6e22e",
	char: "color:#a6e22e",
	inserted: "color:#a6e22e",
	selector: "color:#a6e22e",
	string: "color:#a6e22e",
	'language-css .token.string': "color:#f8f8f2",
	'.style .token.string': "color:#f8f8f2",
	entity: "color:#f8f8f2; cursor:help",
	operator: "color:#f8f8f2",
	url: "color:#f8f8f2",
	variable: "color:#f8f8f2",
	atrule: "color:#e6db74",
	'attr-value': "color:#e6db74",
	'class-name': "color:#e6db74",
	'function': "color:#e6db74",
	keyword: 'color:#66d9ef',
	regex: "color:#fd971f",
	important: "color:#fd971f; font-weight:bold",
	bold: "font-weight:bold",
	italic: "font-style:italic"
};

function LinkedList() {
	/** @type {LinkedListNode<T>} */
	const head = { value: null, prev: null, next: null };
	/** @type {LinkedListNode<T>} */
	const tail = { value: null, prev: head, next: null };
	head.next = tail;

	/** @type {LinkedListNode<T>} */
	this.head = head;
	/** @type {LinkedListNode<T>} */
	this.tail = tail;
	this.length = 0;
}

function addAfter(list, node, value) {
	// assumes that node != list.tail && values.length >= 0
	const next = node.next;

	const newNode = { value: value, prev: node, next: next };
	node.next = newNode;
	next.prev = newNode;
	list.length++;

	return newNode;
}

function matchPattern(pattern, pos, text, lookbehind) {
	pattern.lastIndex = pos;
	const match = pattern.exec(text);
	if (match && lookbehind && match[1]) {
		// change the match to remove the text matched by the Prism lookbehind group
		const lookbehindLength = match[1].length;
		match.index += lookbehindLength;
		match[0] = match[0].slice(lookbehindLength);
	}
	return match;
}

function removeRange(list, node, count) {
	let next = node.next;
	for (var i = 0; i < count && next !== list.tail; i++) {
		next = next.next;
	}
	node.next = next;
	next.prev = node;
	list.length -= i;
}

function toArray(list) {
	const array = [];
	let node = list.head.next;
	while (node !== list.tail) {
		array.push(node.value);
		node = node.next;
	}
	return array;
}

function matchGrammar(text, tokenList, grammar, startNode, startPos, rematch) {
	for (const token in grammar) {
		if (!grammar.hasOwnProperty(token) || !grammar[token]) {
			continue;
		}

		let patterns = grammar[token];
		patterns = Array.isArray(patterns) ? patterns : [patterns];

		for (let j = 0; j < patterns.length; ++j) {
			if (rematch && rematch.cause == token + ',' + j) {
				return;
			}

			const patternObj = patterns[j];
			const inside = patternObj.inside;
			const lookbehind = !!patternObj.lookbehind;
			const greedy = !!patternObj.greedy;
			const alias = patternObj.alias;

			if (greedy && !patternObj.pattern.global) {
				// Without the global flag, lastIndex won't work
				const flags = patternObj.pattern.toString().match(/[imsuy]*$/)[0];
				patternObj.pattern = RegExp(patternObj.pattern.source, flags + 'g');
			}

			/** @type {RegExp} */
			const pattern = patternObj.pattern || patternObj;

			for ( // iterate the token list and keep track of the current token/string position
				let currentNode = startNode.next, pos = startPos;
				currentNode !== tokenList.tail;
				pos += currentNode.value.length, currentNode = currentNode.next
			) {

				if (rematch && pos >= rematch.reach) {
					break;
				}

				let str = currentNode.value;

				if (tokenList.length > text.length) {
					// Something went terribly wrong, ABORT, ABORT!
					return;
				}

				if (str instanceof Token) {
					continue;
				}

				let removeCount = 1; // this is the to parameter of removeBetween
				var match;

				if (greedy) {
					match = matchPattern(pattern, pos, text, lookbehind);
					if (!match || match.index >= text.length) {
						break;
					}

					var from = match.index;
					const to = match.index + match[0].length;
					let p = pos;

					// find the node that contains the match
					p += currentNode.value.length;
					while (from >= p) {
						currentNode = currentNode.next;
						p += currentNode.value.length;
					}
					// adjust pos (and p)
					p -= currentNode.value.length;
					pos = p;

					// the current node is a Token, then the match starts inside another Token, which is invalid
					if (currentNode.value instanceof Token) {
						continue;
					}

					// find the last node which is affected by this match
					for (
						let k = currentNode;
						k !== tokenList.tail && (p < to || typeof k.value === 'string');
						k = k.next
					) {
						removeCount++;
						p += k.value.length;
					}
					removeCount--;

					// replace with the new match
					str = text.slice(pos, p);
					match.index -= pos;
				} else {
					match = matchPattern(pattern, 0, str, lookbehind);
					if (!match) {
						continue;
					}
				}

				// eslint-disable-next-line no-redeclare
				var from = match.index;
				const matchStr = match[0];
				const before = str.slice(0, from);
				const after = str.slice(from + matchStr.length);

				const reach = pos + str.length;
				if (rematch && reach > rematch.reach) {
					rematch.reach = reach;
				}

				let removeFrom = currentNode.prev;

				if (before) {
					removeFrom = addAfter(tokenList, removeFrom, before);
					pos += before.length;
				}

				removeRange(tokenList, removeFrom, removeCount);

				const wrapped = new Token(token, inside ? _.tokenize(matchStr, inside) : matchStr, alias, matchStr);
				currentNode = addAfter(tokenList, removeFrom, wrapped);

				if (after) {
					addAfter(tokenList, currentNode, after);
				}

				if (removeCount > 1) {
					// at least one Token object was removed, so we have to do some rematching
					// this can only happen if the current pattern is greedy

					/** @type {RematchOptions} */
					const nestedRematch = {
						cause: token + ',' + j,
						reach: reach
					};
					matchGrammar(text, tokenList, grammar, currentNode.prev, pos, nestedRematch);

					// the reach might have been extended because of the rematching
					if (rematch && nestedRematch.reach > rematch.reach) {
						rematch.reach = nestedRematch.reach;
					}
				}
			}
		}
	}
}


function Token(type, content, alias, matchedStr) {
	/**
	 * The type of the token.
	 *
	 * This is usually the key of a pattern in a {@link Grammar}.
	 *
	 * @type {string}
	 * @see GrammarToken
	 * @public
	 */
	this.type = type;
	/**
	 * The strings or tokens contained by this token.
	 *
	 * This will be a token stream if the pattern matched also defined an `inside` grammar.
	 *
	 * @type {string | TokenStream}
	 * @public
	 */
	this.content = content;
	/**
	 * The alias(es) of the token.
	 *
	 * @type {string|string[]}
	 * @see GrammarToken
	 * @public
	 */
	this.alias = alias;
	// Copy of the full string this token was created from
	this.length = (matchedStr || '').length | 0;
}


Token.stringify = function stringify(o, language, options = {}) {
	const stylesCss = options.styles || styles;
	if (typeof o == 'string') {
		return o;
	}
	if (Array.isArray(o)) {
		let s = '';
		o.forEach(function (e) {
			s += stringify(e, language);
		});
		return s;
	}

	const env = {
		type: o.type,
		content: stringify(o.content, language),
		tag: 'span',
		classes: ['token', o.type],
		attributes: {},
		language: language
	};

	const aliases = o.alias;
	if (aliases) {
		if (Array.isArray(aliases)) {
			Array.prototype.push.apply(env.classes, aliases);
		} else {
			env.classes.push(aliases);
		}
	}

	_.hooks.run('wrap', env);

	let attributes = '';
	for (const name in env.attributes) {
		attributes += ' ' + name + '="' + (env.attributes[name] || '').replace(/"/g, '&quot;') + '"';
	}

	return `<${env.tag} class="${env.classes.join(' ')}"${attributes} style="${env.classes.map(c => stylesCss[c] || '').filter(i => i).join(';')}">${env.content}</${env.tag}>`;
};

const _ = {
	hooks: {
		all: {},
		add: function (name, callback) {
			const hooks = _.hooks.all;
			hooks[name] = hooks[name] || [];
			hooks[name].push(callback);
		},
		run: function (name, env) {
			const callbacks = _.hooks.all[name];

			if (!callbacks || !callbacks.length) {
				return;
			}

			for (let i = 0, callback; (callback = callbacks[i++]);) {
				callback(env);
			}
		}
	},
	util: {
		encode: function encode(tokens) {
			if (tokens instanceof Token) {
				return new Token(tokens.type, encode(tokens.content), tokens.alias);
			} else if (Array.isArray(tokens)) {
				return tokens.map(encode);
			} else {
				return tokens.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\u00a0/g, ' ');
			}
		}
	},
	tokenize: function (text, grammar) {
		const rest = grammar.rest;
		if (rest) {
			for (const token in rest) {
				grammar[token] = rest[token];
			}

			delete grammar.rest;
		}

		const tokenList = new LinkedList();
		addAfter(tokenList, tokenList.head, text);

		matchGrammar(text, tokenList, grammar, tokenList.head, 0);

		return toArray(tokenList);
	}
};

const Prism = {
	highlight: function (text, grammar, language, options = {}) {
		const env = {
			code: text,
			grammar: grammar,
			language: language
		};
		_.hooks.run('before-tokenize', env);
		if (!env.grammar) {
			throw new Error('The language "' + env.language + '" has no grammar.');
		}
		env.tokens = _.tokenize(env.code, env.grammar);
		_.hooks.run('after-tokenize', env);
		return Token.stringify(_.util.encode(env.tokens), env.language, options);
	}
};

Prism.languages = {};

Prism.languages.json = {
	'property': {
		pattern: /(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?=\s*:)/,
		lookbehind: true,
		greedy: true
	},
	'string': {
		pattern: /(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?!\s*:)/,
		lookbehind: true,
		greedy: true
	},
	'comment': {
		pattern: /\/\/.*|\/\*[\s\S]*?(?:\*\/|$)/,
		greedy: true
	},
	'number': /-?\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/i,
	'punctuation': /[{}[\],]/,
	'operator': /:/,
	'boolean': /\b(?:false|true)\b/,
	'null': {
		pattern: /\bnull\b/,
		alias: 'keyword'
	}
};

Prism.languages.jsstacktrace = {
	'error-message': {
		pattern: /^\S.*/m,
		alias: 'string'
	},

	'stack-frame': {
		pattern: /(^[ \t]+)at[ \t].*/m,
		lookbehind: true,
		inside: {
			'not-my-code': {
				pattern: /^at[ \t]+(?!\s)(?:node\.js|<unknown>|.*(?:node_modules|\(<anonymous>\)|\(<unknown>|<anonymous>$|\(internal\/|\(node\.js)).*/m,
				alias: 'comment'
			},

			'filename': {
				pattern: /(\bat\s+(?!\s)|\()(?:[a-zA-Z]:)?[^():]+(?=:)/,
				lookbehind: true,
				alias: 'url'
			},

			'function': {
				pattern: /(\bat\s+(?:new\s+)?)(?!\s)[_$a-zA-Z\xA0-\uFFFF<][.$\w\xA0-\uFFFF<>]*/,
				lookbehind: true,
				inside: {
					'punctuation': /\./
				}
			},

			'punctuation': /[()]/,

			'keyword': /\b(?:at|new)\b/,

			'alias': {
				pattern: /\[(?:as\s+)?(?!\s)[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*\]/,
				alias: 'variable'
			},

			'line-number': {
				pattern: /:\d+(?::\d+)?\b/,
				alias: 'number',
				inside: {
					'punctuation': /:/
				}
			}
		}
	}
};

Prism.languages.jsstack = Prism.languages.jsstacktrace;
Prism.languages.webmanifest = Prism.languages.json;

module.exports = Prism;