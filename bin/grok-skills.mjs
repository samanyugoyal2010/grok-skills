#!/usr/bin/env node
import { createRequire as __grokCreateRequire } from "node:module";
const require = __grokCreateRequire(import.meta.url);

var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/nodes/identity.js
var require_identity = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/nodes/identity.js"(exports) {
    "use strict";
    var ALIAS = Symbol.for("yaml.alias");
    var DOC = Symbol.for("yaml.document");
    var MAP = Symbol.for("yaml.map");
    var PAIR = Symbol.for("yaml.pair");
    var SCALAR = Symbol.for("yaml.scalar");
    var SEQ = Symbol.for("yaml.seq");
    var NODE_TYPE = Symbol.for("yaml.node.type");
    var isAlias = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === ALIAS;
    var isDocument = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === DOC;
    var isMap = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === MAP;
    var isPair = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === PAIR;
    var isScalar = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === SCALAR;
    var isSeq = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === SEQ;
    function isCollection(node) {
      if (node && typeof node === "object")
        switch (node[NODE_TYPE]) {
          case MAP:
          case SEQ:
            return true;
        }
      return false;
    }
    function isNode(node) {
      if (node && typeof node === "object")
        switch (node[NODE_TYPE]) {
          case ALIAS:
          case MAP:
          case SCALAR:
          case SEQ:
            return true;
        }
      return false;
    }
    var hasAnchor = (node) => (isScalar(node) || isCollection(node)) && !!node.anchor;
    exports.ALIAS = ALIAS;
    exports.DOC = DOC;
    exports.MAP = MAP;
    exports.NODE_TYPE = NODE_TYPE;
    exports.PAIR = PAIR;
    exports.SCALAR = SCALAR;
    exports.SEQ = SEQ;
    exports.hasAnchor = hasAnchor;
    exports.isAlias = isAlias;
    exports.isCollection = isCollection;
    exports.isDocument = isDocument;
    exports.isMap = isMap;
    exports.isNode = isNode;
    exports.isPair = isPair;
    exports.isScalar = isScalar;
    exports.isSeq = isSeq;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/visit.js
var require_visit = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/visit.js"(exports) {
    "use strict";
    var identity = require_identity();
    var BREAK = Symbol("break visit");
    var SKIP = Symbol("skip children");
    var REMOVE = Symbol("remove node");
    function visit(node, visitor) {
      const visitor_ = initVisitor(visitor);
      if (identity.isDocument(node)) {
        const cd = visit_(null, node.contents, visitor_, Object.freeze([node]));
        if (cd === REMOVE)
          node.contents = null;
      } else
        visit_(null, node, visitor_, Object.freeze([]));
    }
    visit.BREAK = BREAK;
    visit.SKIP = SKIP;
    visit.REMOVE = REMOVE;
    function visit_(key, node, visitor, path) {
      const ctrl = callVisitor(key, node, visitor, path);
      if (identity.isNode(ctrl) || identity.isPair(ctrl)) {
        replaceNode(key, path, ctrl);
        return visit_(key, ctrl, visitor, path);
      }
      if (typeof ctrl !== "symbol") {
        if (identity.isCollection(node)) {
          path = Object.freeze(path.concat(node));
          for (let i = 0; i < node.items.length; ++i) {
            const ci = visit_(i, node.items[i], visitor, path);
            if (typeof ci === "number")
              i = ci - 1;
            else if (ci === BREAK)
              return BREAK;
            else if (ci === REMOVE) {
              node.items.splice(i, 1);
              i -= 1;
            }
          }
        } else if (identity.isPair(node)) {
          path = Object.freeze(path.concat(node));
          const ck = visit_("key", node.key, visitor, path);
          if (ck === BREAK)
            return BREAK;
          else if (ck === REMOVE)
            node.key = null;
          const cv = visit_("value", node.value, visitor, path);
          if (cv === BREAK)
            return BREAK;
          else if (cv === REMOVE)
            node.value = null;
        }
      }
      return ctrl;
    }
    async function visitAsync(node, visitor) {
      const visitor_ = initVisitor(visitor);
      if (identity.isDocument(node)) {
        const cd = await visitAsync_(null, node.contents, visitor_, Object.freeze([node]));
        if (cd === REMOVE)
          node.contents = null;
      } else
        await visitAsync_(null, node, visitor_, Object.freeze([]));
    }
    visitAsync.BREAK = BREAK;
    visitAsync.SKIP = SKIP;
    visitAsync.REMOVE = REMOVE;
    async function visitAsync_(key, node, visitor, path) {
      const ctrl = await callVisitor(key, node, visitor, path);
      if (identity.isNode(ctrl) || identity.isPair(ctrl)) {
        replaceNode(key, path, ctrl);
        return visitAsync_(key, ctrl, visitor, path);
      }
      if (typeof ctrl !== "symbol") {
        if (identity.isCollection(node)) {
          path = Object.freeze(path.concat(node));
          for (let i = 0; i < node.items.length; ++i) {
            const ci = await visitAsync_(i, node.items[i], visitor, path);
            if (typeof ci === "number")
              i = ci - 1;
            else if (ci === BREAK)
              return BREAK;
            else if (ci === REMOVE) {
              node.items.splice(i, 1);
              i -= 1;
            }
          }
        } else if (identity.isPair(node)) {
          path = Object.freeze(path.concat(node));
          const ck = await visitAsync_("key", node.key, visitor, path);
          if (ck === BREAK)
            return BREAK;
          else if (ck === REMOVE)
            node.key = null;
          const cv = await visitAsync_("value", node.value, visitor, path);
          if (cv === BREAK)
            return BREAK;
          else if (cv === REMOVE)
            node.value = null;
        }
      }
      return ctrl;
    }
    function initVisitor(visitor) {
      if (typeof visitor === "object" && (visitor.Collection || visitor.Node || visitor.Value)) {
        return Object.assign({
          Alias: visitor.Node,
          Map: visitor.Node,
          Scalar: visitor.Node,
          Seq: visitor.Node
        }, visitor.Value && {
          Map: visitor.Value,
          Scalar: visitor.Value,
          Seq: visitor.Value
        }, visitor.Collection && {
          Map: visitor.Collection,
          Seq: visitor.Collection
        }, visitor);
      }
      return visitor;
    }
    function callVisitor(key, node, visitor, path) {
      if (typeof visitor === "function")
        return visitor(key, node, path);
      if (identity.isMap(node))
        return visitor.Map?.(key, node, path);
      if (identity.isSeq(node))
        return visitor.Seq?.(key, node, path);
      if (identity.isPair(node))
        return visitor.Pair?.(key, node, path);
      if (identity.isScalar(node))
        return visitor.Scalar?.(key, node, path);
      if (identity.isAlias(node))
        return visitor.Alias?.(key, node, path);
      return void 0;
    }
    function replaceNode(key, path, node) {
      const parent = path[path.length - 1];
      if (identity.isCollection(parent)) {
        parent.items[key] = node;
      } else if (identity.isPair(parent)) {
        if (key === "key")
          parent.key = node;
        else
          parent.value = node;
      } else if (identity.isDocument(parent)) {
        parent.contents = node;
      } else {
        const pt = identity.isAlias(parent) ? "alias" : "scalar";
        throw new Error(`Cannot replace node with ${pt} parent`);
      }
    }
    exports.visit = visit;
    exports.visitAsync = visitAsync;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/doc/directives.js
var require_directives = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/doc/directives.js"(exports) {
    "use strict";
    var identity = require_identity();
    var visit = require_visit();
    var escapeChars = {
      "!": "%21",
      ",": "%2C",
      "[": "%5B",
      "]": "%5D",
      "{": "%7B",
      "}": "%7D"
    };
    var escapeTagName = (tn) => tn.replace(/[!,[\]{}]/g, (ch) => escapeChars[ch]);
    var Directives = class _Directives {
      constructor(yaml, tags) {
        this.docStart = null;
        this.docEnd = false;
        this.yaml = Object.assign({}, _Directives.defaultYaml, yaml);
        this.tags = Object.assign({}, _Directives.defaultTags, tags);
      }
      clone() {
        const copy = new _Directives(this.yaml, this.tags);
        copy.docStart = this.docStart;
        return copy;
      }
      /**
       * During parsing, get a Directives instance for the current document and
       * update the stream state according to the current version's spec.
       */
      atDocument() {
        const res = new _Directives(this.yaml, this.tags);
        switch (this.yaml.version) {
          case "1.1":
            this.atNextDocument = true;
            break;
          case "1.2":
            this.atNextDocument = false;
            this.yaml = {
              explicit: _Directives.defaultYaml.explicit,
              version: "1.2"
            };
            this.tags = Object.assign({}, _Directives.defaultTags);
            break;
        }
        return res;
      }
      /**
       * @param onError - May be called even if the action was successful
       * @returns `true` on success
       */
      add(line, onError) {
        if (this.atNextDocument) {
          this.yaml = { explicit: _Directives.defaultYaml.explicit, version: "1.1" };
          this.tags = Object.assign({}, _Directives.defaultTags);
          this.atNextDocument = false;
        }
        const parts = line.trim().split(/[ \t]+/);
        const name = parts.shift();
        switch (name) {
          case "%TAG": {
            if (parts.length !== 2) {
              onError(0, "%TAG directive should contain exactly two parts");
              if (parts.length < 2)
                return false;
            }
            const [handle, prefix] = parts;
            this.tags[handle] = prefix;
            return true;
          }
          case "%YAML": {
            this.yaml.explicit = true;
            if (parts.length !== 1) {
              onError(0, "%YAML directive should contain exactly one part");
              return false;
            }
            const [version] = parts;
            if (version === "1.1" || version === "1.2") {
              this.yaml.version = version;
              return true;
            } else {
              const isValid = /^\d+\.\d+$/.test(version);
              onError(6, `Unsupported YAML version ${version}`, isValid);
              return false;
            }
          }
          default:
            onError(0, `Unknown directive ${name}`, true);
            return false;
        }
      }
      /**
       * Resolves a tag, matching handles to those defined in %TAG directives.
       *
       * @returns Resolved tag, which may also be the non-specific tag `'!'` or a
       *   `'!local'` tag, or `null` if unresolvable.
       */
      tagName(source, onError) {
        if (source === "!")
          return "!";
        if (source[0] !== "!") {
          onError(`Not a valid tag: ${source}`);
          return null;
        }
        if (source[1] === "<") {
          const verbatim = source.slice(2, -1);
          if (verbatim === "!" || verbatim === "!!") {
            onError(`Verbatim tags aren't resolved, so ${source} is invalid.`);
            return null;
          }
          if (source[source.length - 1] !== ">")
            onError("Verbatim tags must end with a >");
          return verbatim;
        }
        const [, handle, suffix] = source.match(/^(.*!)([^!]*)$/s);
        if (!suffix)
          onError(`The ${source} tag has no suffix`);
        const prefix = this.tags[handle];
        if (prefix) {
          try {
            return prefix + decodeURIComponent(suffix);
          } catch (error) {
            onError(String(error));
            return null;
          }
        }
        if (handle === "!")
          return source;
        onError(`Could not resolve tag: ${source}`);
        return null;
      }
      /**
       * Given a fully resolved tag, returns its printable string form,
       * taking into account current tag prefixes and defaults.
       */
      tagString(tag) {
        for (const [handle, prefix] of Object.entries(this.tags)) {
          if (tag.startsWith(prefix))
            return handle + escapeTagName(tag.substring(prefix.length));
        }
        return tag[0] === "!" ? tag : `!<${tag}>`;
      }
      toString(doc) {
        const lines = this.yaml.explicit ? [`%YAML ${this.yaml.version || "1.2"}`] : [];
        const tagEntries = Object.entries(this.tags);
        let tagNames;
        if (doc && tagEntries.length > 0 && identity.isNode(doc.contents)) {
          const tags = {};
          visit.visit(doc.contents, (_key, node) => {
            if (identity.isNode(node) && node.tag)
              tags[node.tag] = true;
          });
          tagNames = Object.keys(tags);
        } else
          tagNames = [];
        for (const [handle, prefix] of tagEntries) {
          if (handle === "!!" && prefix === "tag:yaml.org,2002:")
            continue;
          if (!doc || tagNames.some((tn) => tn.startsWith(prefix)))
            lines.push(`%TAG ${handle} ${prefix}`);
        }
        return lines.join("\n");
      }
    };
    Directives.defaultYaml = { explicit: false, version: "1.2" };
    Directives.defaultTags = { "!!": "tag:yaml.org,2002:" };
    exports.Directives = Directives;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/doc/anchors.js
var require_anchors = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/doc/anchors.js"(exports) {
    "use strict";
    var identity = require_identity();
    var visit = require_visit();
    function anchorIsValid(anchor) {
      if (/[\x00-\x19\s,[\]{}]/.test(anchor)) {
        const sa = JSON.stringify(anchor);
        const msg = `Anchor must not contain whitespace or control characters: ${sa}`;
        throw new Error(msg);
      }
      return true;
    }
    function anchorNames(root) {
      const anchors = /* @__PURE__ */ new Set();
      visit.visit(root, {
        Value(_key, node) {
          if (node.anchor)
            anchors.add(node.anchor);
        }
      });
      return anchors;
    }
    function findNewAnchor(prefix, exclude) {
      for (let i = 1; true; ++i) {
        const name = `${prefix}${i}`;
        if (!exclude.has(name))
          return name;
      }
    }
    function createNodeAnchors(doc, prefix) {
      const aliasObjects = [];
      const sourceObjects = /* @__PURE__ */ new Map();
      let prevAnchors = null;
      return {
        onAnchor: (source) => {
          aliasObjects.push(source);
          prevAnchors ?? (prevAnchors = anchorNames(doc));
          const anchor = findNewAnchor(prefix, prevAnchors);
          prevAnchors.add(anchor);
          return anchor;
        },
        /**
         * With circular references, the source node is only resolved after all
         * of its child nodes are. This is why anchors are set only after all of
         * the nodes have been created.
         */
        setAnchors: () => {
          for (const source of aliasObjects) {
            const ref = sourceObjects.get(source);
            if (typeof ref === "object" && ref.anchor && (identity.isScalar(ref.node) || identity.isCollection(ref.node))) {
              ref.node.anchor = ref.anchor;
            } else {
              const error = new Error("Failed to resolve repeated object (this should not happen)");
              error.source = source;
              throw error;
            }
          }
        },
        sourceObjects
      };
    }
    exports.anchorIsValid = anchorIsValid;
    exports.anchorNames = anchorNames;
    exports.createNodeAnchors = createNodeAnchors;
    exports.findNewAnchor = findNewAnchor;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/doc/applyReviver.js
var require_applyReviver = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/doc/applyReviver.js"(exports) {
    "use strict";
    function applyReviver(reviver, obj, key, val) {
      if (val && typeof val === "object") {
        if (Array.isArray(val)) {
          for (let i = 0, len = val.length; i < len; ++i) {
            const v0 = val[i];
            const v1 = applyReviver(reviver, val, String(i), v0);
            if (v1 === void 0)
              delete val[i];
            else if (v1 !== v0)
              val[i] = v1;
          }
        } else if (val instanceof Map) {
          for (const k of Array.from(val.keys())) {
            const v0 = val.get(k);
            const v1 = applyReviver(reviver, val, k, v0);
            if (v1 === void 0)
              val.delete(k);
            else if (v1 !== v0)
              val.set(k, v1);
          }
        } else if (val instanceof Set) {
          for (const v0 of Array.from(val)) {
            const v1 = applyReviver(reviver, val, v0, v0);
            if (v1 === void 0)
              val.delete(v0);
            else if (v1 !== v0) {
              val.delete(v0);
              val.add(v1);
            }
          }
        } else {
          for (const [k, v0] of Object.entries(val)) {
            const v1 = applyReviver(reviver, val, k, v0);
            if (v1 === void 0)
              delete val[k];
            else if (v1 !== v0)
              val[k] = v1;
          }
        }
      }
      return reviver.call(obj, key, val);
    }
    exports.applyReviver = applyReviver;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/nodes/toJS.js
var require_toJS = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/nodes/toJS.js"(exports) {
    "use strict";
    var identity = require_identity();
    function toJS(value, arg, ctx) {
      if (Array.isArray(value))
        return value.map((v, i) => toJS(v, String(i), ctx));
      if (value && typeof value.toJSON === "function") {
        if (!ctx || !identity.hasAnchor(value))
          return value.toJSON(arg, ctx);
        const data = { aliasCount: 0, count: 1, res: void 0 };
        ctx.anchors.set(value, data);
        ctx.onCreate = (res2) => {
          data.res = res2;
          delete ctx.onCreate;
        };
        const res = value.toJSON(arg, ctx);
        if (ctx.onCreate)
          ctx.onCreate(res);
        return res;
      }
      if (typeof value === "bigint" && !ctx?.keep)
        return Number(value);
      return value;
    }
    exports.toJS = toJS;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/nodes/Node.js
var require_Node = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/nodes/Node.js"(exports) {
    "use strict";
    var applyReviver = require_applyReviver();
    var identity = require_identity();
    var toJS = require_toJS();
    var NodeBase = class {
      constructor(type) {
        Object.defineProperty(this, identity.NODE_TYPE, { value: type });
      }
      /** Create a copy of this node.  */
      clone() {
        const copy = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
        if (this.range)
          copy.range = this.range.slice();
        return copy;
      }
      /** A plain JavaScript representation of this node. */
      toJS(doc, { mapAsMap, maxAliasCount, onAnchor, reviver } = {}) {
        if (!identity.isDocument(doc))
          throw new TypeError("A document argument is required");
        const ctx = {
          anchors: /* @__PURE__ */ new Map(),
          doc,
          keep: true,
          mapAsMap: mapAsMap === true,
          mapKeyWarned: false,
          maxAliasCount: typeof maxAliasCount === "number" ? maxAliasCount : 100
        };
        const res = toJS.toJS(this, "", ctx);
        if (typeof onAnchor === "function")
          for (const { count, res: res2 } of ctx.anchors.values())
            onAnchor(res2, count);
        return typeof reviver === "function" ? applyReviver.applyReviver(reviver, { "": res }, "", res) : res;
      }
    };
    exports.NodeBase = NodeBase;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/nodes/Alias.js
var require_Alias = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/nodes/Alias.js"(exports) {
    "use strict";
    var anchors = require_anchors();
    var visit = require_visit();
    var identity = require_identity();
    var Node = require_Node();
    var toJS = require_toJS();
    var Alias = class extends Node.NodeBase {
      constructor(source) {
        super(identity.ALIAS);
        this.source = source;
        Object.defineProperty(this, "tag", {
          set() {
            throw new Error("Alias nodes cannot have tags");
          }
        });
      }
      /**
       * Resolve the value of this alias within `doc`, finding the last
       * instance of the `source` anchor before this node.
       */
      resolve(doc, ctx) {
        if (ctx?.maxAliasCount === 0)
          throw new ReferenceError("Alias resolution is disabled");
        let nodes;
        if (ctx?.aliasResolveCache) {
          nodes = ctx.aliasResolveCache;
        } else {
          nodes = [];
          visit.visit(doc, {
            Node: (_key, node) => {
              if (identity.isAlias(node) || identity.hasAnchor(node))
                nodes.push(node);
            }
          });
          if (ctx)
            ctx.aliasResolveCache = nodes;
        }
        let found = void 0;
        for (const node of nodes) {
          if (node === this)
            break;
          if (node.anchor === this.source)
            found = node;
        }
        return found;
      }
      toJSON(_arg, ctx) {
        if (!ctx)
          return { source: this.source };
        const { anchors: anchors2, doc, maxAliasCount } = ctx;
        const source = this.resolve(doc, ctx);
        if (!source) {
          const msg = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
          throw new ReferenceError(msg);
        }
        let data = anchors2.get(source);
        if (!data) {
          toJS.toJS(source, null, ctx);
          data = anchors2.get(source);
        }
        if (data?.res === void 0) {
          const msg = "This should not happen: Alias anchor was not resolved?";
          throw new ReferenceError(msg);
        }
        if (maxAliasCount >= 0) {
          data.count += 1;
          if (data.aliasCount === 0)
            data.aliasCount = getAliasCount(doc, source, anchors2);
          if (data.count * data.aliasCount > maxAliasCount) {
            const msg = "Excessive alias count indicates a resource exhaustion attack";
            throw new ReferenceError(msg);
          }
        }
        return data.res;
      }
      toString(ctx, _onComment, _onChompKeep) {
        const src = `*${this.source}`;
        if (ctx) {
          anchors.anchorIsValid(this.source);
          if (ctx.options.verifyAliasOrder && !ctx.anchors.has(this.source)) {
            const msg = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
            throw new Error(msg);
          }
          if (ctx.implicitKey)
            return `${src} `;
        }
        return src;
      }
    };
    function getAliasCount(doc, node, anchors2) {
      if (identity.isAlias(node)) {
        const source = node.resolve(doc);
        const anchor = anchors2 && source && anchors2.get(source);
        return anchor ? anchor.count * anchor.aliasCount : 0;
      } else if (identity.isCollection(node)) {
        let count = 0;
        for (const item of node.items) {
          const c = getAliasCount(doc, item, anchors2);
          if (c > count)
            count = c;
        }
        return count;
      } else if (identity.isPair(node)) {
        const kc = getAliasCount(doc, node.key, anchors2);
        const vc = getAliasCount(doc, node.value, anchors2);
        return Math.max(kc, vc);
      }
      return 1;
    }
    exports.Alias = Alias;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/nodes/Scalar.js
var require_Scalar = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/nodes/Scalar.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Node = require_Node();
    var toJS = require_toJS();
    var isScalarValue = (value) => !value || typeof value !== "function" && typeof value !== "object";
    var Scalar = class extends Node.NodeBase {
      constructor(value) {
        super(identity.SCALAR);
        this.value = value;
      }
      toJSON(arg, ctx) {
        return ctx?.keep ? this.value : toJS.toJS(this.value, arg, ctx);
      }
      toString() {
        return String(this.value);
      }
    };
    Scalar.BLOCK_FOLDED = "BLOCK_FOLDED";
    Scalar.BLOCK_LITERAL = "BLOCK_LITERAL";
    Scalar.PLAIN = "PLAIN";
    Scalar.QUOTE_DOUBLE = "QUOTE_DOUBLE";
    Scalar.QUOTE_SINGLE = "QUOTE_SINGLE";
    exports.Scalar = Scalar;
    exports.isScalarValue = isScalarValue;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/doc/createNode.js
var require_createNode = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/doc/createNode.js"(exports) {
    "use strict";
    var Alias = require_Alias();
    var identity = require_identity();
    var Scalar = require_Scalar();
    var defaultTagPrefix = "tag:yaml.org,2002:";
    function findTagObject(value, tagName, tags) {
      if (tagName) {
        const match = tags.filter((t) => t.tag === tagName);
        const tagObj = match.find((t) => !t.format) ?? match[0];
        if (!tagObj)
          throw new Error(`Tag ${tagName} not found`);
        return tagObj;
      }
      return tags.find((t) => t.identify?.(value) && !t.format);
    }
    function createNode(value, tagName, ctx) {
      if (identity.isDocument(value))
        value = value.contents;
      if (identity.isNode(value))
        return value;
      if (identity.isPair(value)) {
        const map = ctx.schema[identity.MAP].createNode?.(ctx.schema, null, ctx);
        map.items.push(value);
        return map;
      }
      if (value instanceof String || value instanceof Number || value instanceof Boolean || typeof BigInt !== "undefined" && value instanceof BigInt) {
        value = value.valueOf();
      }
      const { aliasDuplicateObjects, onAnchor, onTagObj, schema, sourceObjects } = ctx;
      let ref = void 0;
      if (aliasDuplicateObjects && value && typeof value === "object") {
        ref = sourceObjects.get(value);
        if (ref) {
          ref.anchor ?? (ref.anchor = onAnchor(value));
          return new Alias.Alias(ref.anchor);
        } else {
          ref = { anchor: null, node: null };
          sourceObjects.set(value, ref);
        }
      }
      if (tagName?.startsWith("!!"))
        tagName = defaultTagPrefix + tagName.slice(2);
      let tagObj = findTagObject(value, tagName, schema.tags);
      if (!tagObj) {
        if (value && typeof value.toJSON === "function") {
          value = value.toJSON();
        }
        if (!value || typeof value !== "object") {
          const node2 = new Scalar.Scalar(value);
          if (ref)
            ref.node = node2;
          return node2;
        }
        tagObj = value instanceof Map ? schema[identity.MAP] : Symbol.iterator in Object(value) ? schema[identity.SEQ] : schema[identity.MAP];
      }
      if (onTagObj) {
        onTagObj(tagObj);
        delete ctx.onTagObj;
      }
      const node = tagObj?.createNode ? tagObj.createNode(ctx.schema, value, ctx) : typeof tagObj?.nodeClass?.from === "function" ? tagObj.nodeClass.from(ctx.schema, value, ctx) : new Scalar.Scalar(value);
      if (tagName)
        node.tag = tagName;
      else if (!tagObj.default)
        node.tag = tagObj.tag;
      if (ref)
        ref.node = node;
      return node;
    }
    exports.createNode = createNode;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/nodes/Collection.js
var require_Collection = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/nodes/Collection.js"(exports) {
    "use strict";
    var createNode = require_createNode();
    var identity = require_identity();
    var Node = require_Node();
    function collectionFromPath(schema, path, value) {
      let v = value;
      for (let i = path.length - 1; i >= 0; --i) {
        const k = path[i];
        if (typeof k === "number" && Number.isInteger(k) && k >= 0) {
          const a = [];
          a[k] = v;
          v = a;
        } else {
          v = /* @__PURE__ */ new Map([[k, v]]);
        }
      }
      return createNode.createNode(v, void 0, {
        aliasDuplicateObjects: false,
        keepUndefined: false,
        onAnchor: () => {
          throw new Error("This should not happen, please report a bug.");
        },
        schema,
        sourceObjects: /* @__PURE__ */ new Map()
      });
    }
    var isEmptyPath = (path) => path == null || typeof path === "object" && !!path[Symbol.iterator]().next().done;
    var Collection = class extends Node.NodeBase {
      constructor(type, schema) {
        super(type);
        Object.defineProperty(this, "schema", {
          value: schema,
          configurable: true,
          enumerable: false,
          writable: true
        });
      }
      /**
       * Create a copy of this collection.
       *
       * @param schema - If defined, overwrites the original's schema
       */
      clone(schema) {
        const copy = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
        if (schema)
          copy.schema = schema;
        copy.items = copy.items.map((it) => identity.isNode(it) || identity.isPair(it) ? it.clone(schema) : it);
        if (this.range)
          copy.range = this.range.slice();
        return copy;
      }
      /**
       * Adds a value to the collection. For `!!map` and `!!omap` the value must
       * be a Pair instance or a `{ key, value }` object, which may not have a key
       * that already exists in the map.
       */
      addIn(path, value) {
        if (isEmptyPath(path))
          this.add(value);
        else {
          const [key, ...rest] = path;
          const node = this.get(key, true);
          if (identity.isCollection(node))
            node.addIn(rest, value);
          else if (node === void 0 && this.schema)
            this.set(key, collectionFromPath(this.schema, rest, value));
          else
            throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
        }
      }
      /**
       * Removes a value from the collection.
       * @returns `true` if the item was found and removed.
       */
      deleteIn(path) {
        const [key, ...rest] = path;
        if (rest.length === 0)
          return this.delete(key);
        const node = this.get(key, true);
        if (identity.isCollection(node))
          return node.deleteIn(rest);
        else
          throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
      }
      /**
       * Returns item at `key`, or `undefined` if not found. By default unwraps
       * scalar values from their surrounding node; to disable set `keepScalar` to
       * `true` (collections are always returned intact).
       */
      getIn(path, keepScalar) {
        const [key, ...rest] = path;
        const node = this.get(key, true);
        if (rest.length === 0)
          return !keepScalar && identity.isScalar(node) ? node.value : node;
        else
          return identity.isCollection(node) ? node.getIn(rest, keepScalar) : void 0;
      }
      hasAllNullValues(allowScalar) {
        return this.items.every((node) => {
          if (!identity.isPair(node))
            return false;
          const n = node.value;
          return n == null || allowScalar && identity.isScalar(n) && n.value == null && !n.commentBefore && !n.comment && !n.tag;
        });
      }
      /**
       * Checks if the collection includes a value with the key `key`.
       */
      hasIn(path) {
        const [key, ...rest] = path;
        if (rest.length === 0)
          return this.has(key);
        const node = this.get(key, true);
        return identity.isCollection(node) ? node.hasIn(rest) : false;
      }
      /**
       * Sets a value in this collection. For `!!set`, `value` needs to be a
       * boolean to add/remove the item from the set.
       */
      setIn(path, value) {
        const [key, ...rest] = path;
        if (rest.length === 0) {
          this.set(key, value);
        } else {
          const node = this.get(key, true);
          if (identity.isCollection(node))
            node.setIn(rest, value);
          else if (node === void 0 && this.schema)
            this.set(key, collectionFromPath(this.schema, rest, value));
          else
            throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
        }
      }
    };
    exports.Collection = Collection;
    exports.collectionFromPath = collectionFromPath;
    exports.isEmptyPath = isEmptyPath;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/stringify/stringifyComment.js
var require_stringifyComment = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/stringify/stringifyComment.js"(exports) {
    "use strict";
    var stringifyComment = (str) => str.replace(/^(?!$)(?: $)?/gm, "#");
    function indentComment(comment, indent) {
      if (/^\n+$/.test(comment))
        return comment.substring(1);
      return indent ? comment.replace(/^(?! *$)/gm, indent) : comment;
    }
    var lineComment = (str, indent, comment) => str.endsWith("\n") ? indentComment(comment, indent) : comment.includes("\n") ? "\n" + indentComment(comment, indent) : (str.endsWith(" ") ? "" : " ") + comment;
    exports.indentComment = indentComment;
    exports.lineComment = lineComment;
    exports.stringifyComment = stringifyComment;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/stringify/foldFlowLines.js
var require_foldFlowLines = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/stringify/foldFlowLines.js"(exports) {
    "use strict";
    var FOLD_FLOW = "flow";
    var FOLD_BLOCK = "block";
    var FOLD_QUOTED = "quoted";
    function foldFlowLines(text, indent, mode = "flow", { indentAtStart, lineWidth = 80, minContentWidth = 20, onFold, onOverflow } = {}) {
      if (!lineWidth || lineWidth < 0)
        return text;
      if (lineWidth < minContentWidth)
        minContentWidth = 0;
      const endStep = Math.max(1 + minContentWidth, 1 + lineWidth - indent.length);
      if (text.length <= endStep)
        return text;
      const folds = [];
      const escapedFolds = {};
      let end = lineWidth - indent.length;
      if (typeof indentAtStart === "number") {
        if (indentAtStart > lineWidth - Math.max(2, minContentWidth))
          folds.push(0);
        else
          end = lineWidth - indentAtStart;
      }
      let split = void 0;
      let prev = void 0;
      let overflow = false;
      let i = -1;
      let escStart = -1;
      let escEnd = -1;
      if (mode === FOLD_BLOCK) {
        i = consumeMoreIndentedLines(text, i, indent.length);
        if (i !== -1)
          end = i + endStep;
      }
      for (let ch; ch = text[i += 1]; ) {
        if (mode === FOLD_QUOTED && ch === "\\") {
          escStart = i;
          switch (text[i + 1]) {
            case "x":
              i += 3;
              break;
            case "u":
              i += 5;
              break;
            case "U":
              i += 9;
              break;
            default:
              i += 1;
          }
          escEnd = i;
        }
        if (ch === "\n") {
          if (mode === FOLD_BLOCK)
            i = consumeMoreIndentedLines(text, i, indent.length);
          end = i + indent.length + endStep;
          split = void 0;
        } else {
          if (ch === " " && prev && prev !== " " && prev !== "\n" && prev !== "	") {
            const next = text[i + 1];
            if (next && next !== " " && next !== "\n" && next !== "	")
              split = i;
          }
          if (i >= end) {
            if (split) {
              folds.push(split);
              end = split + endStep;
              split = void 0;
            } else if (mode === FOLD_QUOTED) {
              while (prev === " " || prev === "	") {
                prev = ch;
                ch = text[i += 1];
                overflow = true;
              }
              const j = i > escEnd + 1 ? i - 2 : escStart - 1;
              if (escapedFolds[j])
                return text;
              folds.push(j);
              escapedFolds[j] = true;
              end = j + endStep;
              split = void 0;
            } else {
              overflow = true;
            }
          }
        }
        prev = ch;
      }
      if (overflow && onOverflow)
        onOverflow();
      if (folds.length === 0)
        return text;
      if (onFold)
        onFold();
      let res = text.slice(0, folds[0]);
      for (let i2 = 0; i2 < folds.length; ++i2) {
        const fold = folds[i2];
        const end2 = folds[i2 + 1] || text.length;
        if (fold === 0)
          res = `
${indent}${text.slice(0, end2)}`;
        else {
          if (mode === FOLD_QUOTED && escapedFolds[fold])
            res += `${text[fold]}\\`;
          res += `
${indent}${text.slice(fold + 1, end2)}`;
        }
      }
      return res;
    }
    function consumeMoreIndentedLines(text, i, indent) {
      let end = i;
      let start = i + 1;
      let ch = text[start];
      while (ch === " " || ch === "	") {
        if (i < start + indent) {
          ch = text[++i];
        } else {
          do {
            ch = text[++i];
          } while (ch && ch !== "\n");
          end = i;
          start = i + 1;
          ch = text[start];
        }
      }
      return end;
    }
    exports.FOLD_BLOCK = FOLD_BLOCK;
    exports.FOLD_FLOW = FOLD_FLOW;
    exports.FOLD_QUOTED = FOLD_QUOTED;
    exports.foldFlowLines = foldFlowLines;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/stringify/stringifyString.js
var require_stringifyString = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/stringify/stringifyString.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    var foldFlowLines = require_foldFlowLines();
    var getFoldOptions = (ctx, isBlock) => ({
      indentAtStart: isBlock ? ctx.indent.length : ctx.indentAtStart,
      lineWidth: ctx.options.lineWidth,
      minContentWidth: ctx.options.minContentWidth
    });
    var containsDocumentMarker = (str) => /^(%|---|\.\.\.)/m.test(str);
    function lineLengthOverLimit(str, lineWidth, indentLength) {
      if (!lineWidth || lineWidth < 0)
        return false;
      const limit = lineWidth - indentLength;
      const strLen = str.length;
      if (strLen <= limit)
        return false;
      for (let i = 0, start = 0; i < strLen; ++i) {
        if (str[i] === "\n") {
          if (i - start > limit)
            return true;
          start = i + 1;
          if (strLen - start <= limit)
            return false;
        }
      }
      return true;
    }
    function doubleQuotedString(value, ctx) {
      const json = JSON.stringify(value);
      if (ctx.options.doubleQuotedAsJSON)
        return json;
      const { implicitKey } = ctx;
      const minMultiLineLength = ctx.options.doubleQuotedMinMultiLineLength;
      const indent = ctx.indent || (containsDocumentMarker(value) ? "  " : "");
      let str = "";
      let start = 0;
      for (let i = 0, ch = json[i]; ch; ch = json[++i]) {
        if (ch === " " && json[i + 1] === "\\" && json[i + 2] === "n") {
          str += json.slice(start, i) + "\\ ";
          i += 1;
          start = i;
          ch = "\\";
        }
        if (ch === "\\")
          switch (json[i + 1]) {
            case "u":
              {
                str += json.slice(start, i);
                const code = json.substr(i + 2, 4);
                switch (code) {
                  case "0000":
                    str += "\\0";
                    break;
                  case "0007":
                    str += "\\a";
                    break;
                  case "000b":
                    str += "\\v";
                    break;
                  case "001b":
                    str += "\\e";
                    break;
                  case "0085":
                    str += "\\N";
                    break;
                  case "00a0":
                    str += "\\_";
                    break;
                  case "2028":
                    str += "\\L";
                    break;
                  case "2029":
                    str += "\\P";
                    break;
                  default:
                    if (code.substr(0, 2) === "00")
                      str += "\\x" + code.substr(2);
                    else
                      str += json.substr(i, 6);
                }
                i += 5;
                start = i + 1;
              }
              break;
            case "n":
              if (implicitKey || json[i + 2] === '"' || json.length < minMultiLineLength) {
                i += 1;
              } else {
                str += json.slice(start, i) + "\n\n";
                while (json[i + 2] === "\\" && json[i + 3] === "n" && json[i + 4] !== '"') {
                  str += "\n";
                  i += 2;
                }
                str += indent;
                if (json[i + 2] === " ")
                  str += "\\";
                i += 1;
                start = i + 1;
              }
              break;
            default:
              i += 1;
          }
      }
      str = start ? str + json.slice(start) : json;
      return implicitKey ? str : foldFlowLines.foldFlowLines(str, indent, foldFlowLines.FOLD_QUOTED, getFoldOptions(ctx, false));
    }
    function singleQuotedString(value, ctx) {
      if (ctx.options.singleQuote === false || ctx.implicitKey && value.includes("\n") || /[ \t]\n|\n[ \t]/.test(value))
        return doubleQuotedString(value, ctx);
      const indent = ctx.indent || (containsDocumentMarker(value) ? "  " : "");
      const res = "'" + value.replace(/'/g, "''").replace(/\n+/g, `$&
${indent}`) + "'";
      return ctx.implicitKey ? res : foldFlowLines.foldFlowLines(res, indent, foldFlowLines.FOLD_FLOW, getFoldOptions(ctx, false));
    }
    function quotedString(value, ctx) {
      const { singleQuote } = ctx.options;
      let qs;
      if (singleQuote === false)
        qs = doubleQuotedString;
      else {
        const hasDouble = value.includes('"');
        const hasSingle = value.includes("'");
        if (hasDouble && !hasSingle)
          qs = singleQuotedString;
        else if (hasSingle && !hasDouble)
          qs = doubleQuotedString;
        else
          qs = singleQuote ? singleQuotedString : doubleQuotedString;
      }
      return qs(value, ctx);
    }
    var blockEndNewlines;
    try {
      blockEndNewlines = new RegExp("(^|(?<!\n))\n+(?!\n|$)", "g");
    } catch {
      blockEndNewlines = /\n+(?!\n|$)/g;
    }
    function blockString({ comment, type, value }, ctx, onComment, onChompKeep) {
      const { blockQuote, commentString, lineWidth } = ctx.options;
      if (!blockQuote || /\n[\t ]+$/.test(value)) {
        return quotedString(value, ctx);
      }
      const indent = ctx.indent || (ctx.forceBlockIndent || containsDocumentMarker(value) ? "  " : "");
      const literal = blockQuote === "literal" ? true : blockQuote === "folded" || type === Scalar.Scalar.BLOCK_FOLDED ? false : type === Scalar.Scalar.BLOCK_LITERAL ? true : !lineLengthOverLimit(value, lineWidth, indent.length);
      if (!value)
        return literal ? "|\n" : ">\n";
      let chomp;
      let endStart;
      for (endStart = value.length; endStart > 0; --endStart) {
        const ch = value[endStart - 1];
        if (ch !== "\n" && ch !== "	" && ch !== " ")
          break;
      }
      let end = value.substring(endStart);
      const endNlPos = end.indexOf("\n");
      if (endNlPos === -1) {
        chomp = "-";
      } else if (value === end || endNlPos !== end.length - 1) {
        chomp = "+";
        if (onChompKeep)
          onChompKeep();
      } else {
        chomp = "";
      }
      if (end) {
        value = value.slice(0, -end.length);
        if (end[end.length - 1] === "\n")
          end = end.slice(0, -1);
        end = end.replace(blockEndNewlines, `$&${indent}`);
      }
      let startWithSpace = false;
      let startEnd;
      let startNlPos = -1;
      for (startEnd = 0; startEnd < value.length; ++startEnd) {
        const ch = value[startEnd];
        if (ch === " ")
          startWithSpace = true;
        else if (ch === "\n")
          startNlPos = startEnd;
        else
          break;
      }
      let start = value.substring(0, startNlPos < startEnd ? startNlPos + 1 : startEnd);
      if (start) {
        value = value.substring(start.length);
        start = start.replace(/\n+/g, `$&${indent}`);
      }
      const indentSize = indent ? "2" : "1";
      let header = (startWithSpace ? indentSize : "") + chomp;
      if (comment) {
        header += " " + commentString(comment.replace(/ ?[\r\n]+/g, " "));
        if (onComment)
          onComment();
      }
      if (!literal) {
        const foldedValue = value.replace(/\n+/g, "\n$&").replace(/(?:^|\n)([\t ].*)(?:([\n\t ]*)\n(?![\n\t ]))?/g, "$1$2").replace(/\n+/g, `$&${indent}`);
        let literalFallback = false;
        const foldOptions = getFoldOptions(ctx, true);
        if (blockQuote !== "folded" && type !== Scalar.Scalar.BLOCK_FOLDED) {
          foldOptions.onOverflow = () => {
            literalFallback = true;
          };
        }
        const body = foldFlowLines.foldFlowLines(`${start}${foldedValue}${end}`, indent, foldFlowLines.FOLD_BLOCK, foldOptions);
        if (!literalFallback)
          return `>${header}
${indent}${body}`;
      }
      value = value.replace(/\n+/g, `$&${indent}`);
      return `|${header}
${indent}${start}${value}${end}`;
    }
    function plainString(item, ctx, onComment, onChompKeep) {
      const { type, value } = item;
      const { actualString, implicitKey, indent, indentStep, inFlow } = ctx;
      if (implicitKey && value.includes("\n") || inFlow && /[[\]{},]/.test(value)) {
        return quotedString(value, ctx);
      }
      if (/^[\n\t ,[\]{}#&*!|>'"%@`]|^[?-]$|^[?-][ \t]|[\n:][ \t]|[ \t]\n|[\n\t ]#|[\n\t :]$/.test(value)) {
        return implicitKey || inFlow || !value.includes("\n") ? quotedString(value, ctx) : blockString(item, ctx, onComment, onChompKeep);
      }
      if (!implicitKey && !inFlow && type !== Scalar.Scalar.PLAIN && value.includes("\n")) {
        return blockString(item, ctx, onComment, onChompKeep);
      }
      if (containsDocumentMarker(value)) {
        if (indent === "") {
          ctx.forceBlockIndent = true;
          return blockString(item, ctx, onComment, onChompKeep);
        } else if (implicitKey && indent === indentStep) {
          return quotedString(value, ctx);
        }
      }
      const str = value.replace(/\n+/g, `$&
${indent}`);
      if (actualString) {
        const test = (tag) => tag.default && tag.tag !== "tag:yaml.org,2002:str" && tag.test?.test(str);
        const { compat, tags } = ctx.doc.schema;
        if (tags.some(test) || compat?.some(test))
          return quotedString(value, ctx);
      }
      return implicitKey ? str : foldFlowLines.foldFlowLines(str, indent, foldFlowLines.FOLD_FLOW, getFoldOptions(ctx, false));
    }
    function stringifyString(item, ctx, onComment, onChompKeep) {
      const { implicitKey, inFlow } = ctx;
      const ss = typeof item.value === "string" ? item : Object.assign({}, item, { value: String(item.value) });
      let { type } = item;
      if (type !== Scalar.Scalar.QUOTE_DOUBLE) {
        if (/[\x00-\x08\x0b-\x1f\x7f-\x9f\u{D800}-\u{DFFF}]/u.test(ss.value))
          type = Scalar.Scalar.QUOTE_DOUBLE;
      }
      const _stringify = (_type) => {
        switch (_type) {
          case Scalar.Scalar.BLOCK_FOLDED:
          case Scalar.Scalar.BLOCK_LITERAL:
            return implicitKey || inFlow ? quotedString(ss.value, ctx) : blockString(ss, ctx, onComment, onChompKeep);
          case Scalar.Scalar.QUOTE_DOUBLE:
            return doubleQuotedString(ss.value, ctx);
          case Scalar.Scalar.QUOTE_SINGLE:
            return singleQuotedString(ss.value, ctx);
          case Scalar.Scalar.PLAIN:
            return plainString(ss, ctx, onComment, onChompKeep);
          default:
            return null;
        }
      };
      let res = _stringify(type);
      if (res === null) {
        const { defaultKeyType, defaultStringType } = ctx.options;
        const t = implicitKey && defaultKeyType || defaultStringType;
        res = _stringify(t);
        if (res === null)
          throw new Error(`Unsupported default string type ${t}`);
      }
      return res;
    }
    exports.stringifyString = stringifyString;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/stringify/stringify.js
var require_stringify = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/stringify/stringify.js"(exports) {
    "use strict";
    var anchors = require_anchors();
    var identity = require_identity();
    var stringifyComment = require_stringifyComment();
    var stringifyString = require_stringifyString();
    function createStringifyContext(doc, options) {
      const opt = Object.assign({
        blockQuote: true,
        commentString: stringifyComment.stringifyComment,
        defaultKeyType: null,
        defaultStringType: "PLAIN",
        directives: null,
        doubleQuotedAsJSON: false,
        doubleQuotedMinMultiLineLength: 40,
        falseStr: "false",
        flowCollectionPadding: true,
        indentSeq: true,
        lineWidth: 80,
        minContentWidth: 20,
        nullStr: "null",
        simpleKeys: false,
        singleQuote: null,
        trailingComma: false,
        trueStr: "true",
        verifyAliasOrder: true
      }, doc.schema.toStringOptions, options);
      let inFlow;
      switch (opt.collectionStyle) {
        case "block":
          inFlow = false;
          break;
        case "flow":
          inFlow = true;
          break;
        default:
          inFlow = null;
      }
      return {
        anchors: /* @__PURE__ */ new Set(),
        doc,
        flowCollectionPadding: opt.flowCollectionPadding ? " " : "",
        indent: "",
        indentStep: typeof opt.indent === "number" ? " ".repeat(opt.indent) : "  ",
        inFlow,
        options: opt
      };
    }
    function getTagObject(tags, item) {
      if (item.tag) {
        const match = tags.filter((t) => t.tag === item.tag);
        if (match.length > 0)
          return match.find((t) => t.format === item.format) ?? match[0];
      }
      let tagObj = void 0;
      let obj;
      if (identity.isScalar(item)) {
        obj = item.value;
        let match = tags.filter((t) => t.identify?.(obj));
        if (match.length > 1) {
          const testMatch = match.filter((t) => t.test);
          if (testMatch.length > 0)
            match = testMatch;
        }
        tagObj = match.find((t) => t.format === item.format) ?? match.find((t) => !t.format);
      } else {
        obj = item;
        tagObj = tags.find((t) => t.nodeClass && obj instanceof t.nodeClass);
      }
      if (!tagObj) {
        const name = obj?.constructor?.name ?? (obj === null ? "null" : typeof obj);
        throw new Error(`Tag not resolved for ${name} value`);
      }
      return tagObj;
    }
    function stringifyProps(node, tagObj, { anchors: anchors$1, doc }) {
      if (!doc.directives)
        return "";
      const props = [];
      const anchor = (identity.isScalar(node) || identity.isCollection(node)) && node.anchor;
      if (anchor && anchors.anchorIsValid(anchor)) {
        anchors$1.add(anchor);
        props.push(`&${anchor}`);
      }
      const tag = node.tag ?? (tagObj.default ? null : tagObj.tag);
      if (tag)
        props.push(doc.directives.tagString(tag));
      return props.join(" ");
    }
    function stringify(item, ctx, onComment, onChompKeep) {
      if (identity.isPair(item))
        return item.toString(ctx, onComment, onChompKeep);
      if (identity.isAlias(item)) {
        if (ctx.doc.directives)
          return item.toString(ctx);
        if (ctx.resolvedAliases?.has(item)) {
          throw new TypeError(`Cannot stringify circular structure without alias nodes`);
        } else {
          if (ctx.resolvedAliases)
            ctx.resolvedAliases.add(item);
          else
            ctx.resolvedAliases = /* @__PURE__ */ new Set([item]);
          item = item.resolve(ctx.doc);
        }
      }
      let tagObj = void 0;
      const node = identity.isNode(item) ? item : ctx.doc.createNode(item, { onTagObj: (o) => tagObj = o });
      tagObj ?? (tagObj = getTagObject(ctx.doc.schema.tags, node));
      const props = stringifyProps(node, tagObj, ctx);
      if (props.length > 0)
        ctx.indentAtStart = (ctx.indentAtStart ?? 0) + props.length + 1;
      const str = typeof tagObj.stringify === "function" ? tagObj.stringify(node, ctx, onComment, onChompKeep) : identity.isScalar(node) ? stringifyString.stringifyString(node, ctx, onComment, onChompKeep) : node.toString(ctx, onComment, onChompKeep);
      if (!props)
        return str;
      return identity.isScalar(node) || str[0] === "{" || str[0] === "[" ? `${props} ${str}` : `${props}
${ctx.indent}${str}`;
    }
    exports.createStringifyContext = createStringifyContext;
    exports.stringify = stringify;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/stringify/stringifyPair.js
var require_stringifyPair = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/stringify/stringifyPair.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Scalar = require_Scalar();
    var stringify = require_stringify();
    var stringifyComment = require_stringifyComment();
    function stringifyPair({ key, value }, ctx, onComment, onChompKeep) {
      const { allNullValues, doc, indent, indentStep, options: { commentString, indentSeq, simpleKeys } } = ctx;
      let keyComment = identity.isNode(key) && key.comment || null;
      if (simpleKeys) {
        if (keyComment) {
          throw new Error("With simple keys, key nodes cannot have comments");
        }
        if (identity.isCollection(key) || !identity.isNode(key) && typeof key === "object") {
          const msg = "With simple keys, collection cannot be used as a key value";
          throw new Error(msg);
        }
      }
      let explicitKey = !simpleKeys && (!key || keyComment && value == null && !ctx.inFlow || identity.isCollection(key) || (identity.isScalar(key) ? key.type === Scalar.Scalar.BLOCK_FOLDED || key.type === Scalar.Scalar.BLOCK_LITERAL : typeof key === "object"));
      ctx = Object.assign({}, ctx, {
        allNullValues: false,
        implicitKey: !explicitKey && (simpleKeys || !allNullValues),
        indent: indent + indentStep
      });
      let keyCommentDone = false;
      let chompKeep = false;
      let str = stringify.stringify(key, ctx, () => keyCommentDone = true, () => chompKeep = true);
      if (!explicitKey && !ctx.inFlow && str.length > 1024) {
        if (simpleKeys)
          throw new Error("With simple keys, single line scalar must not span more than 1024 characters");
        explicitKey = true;
      }
      if (ctx.inFlow) {
        if (allNullValues || value == null) {
          if (keyCommentDone && onComment)
            onComment();
          return str === "" ? "?" : explicitKey ? `? ${str}` : str;
        }
      } else if (allNullValues && !simpleKeys || value == null && explicitKey) {
        str = `? ${str}`;
        if (keyComment && !keyCommentDone) {
          str += stringifyComment.lineComment(str, ctx.indent, commentString(keyComment));
        } else if (chompKeep && onChompKeep)
          onChompKeep();
        return str;
      }
      if (keyCommentDone)
        keyComment = null;
      if (explicitKey) {
        if (keyComment)
          str += stringifyComment.lineComment(str, ctx.indent, commentString(keyComment));
        str = `? ${str}
${indent}:`;
      } else {
        str = `${str}:`;
        if (keyComment)
          str += stringifyComment.lineComment(str, ctx.indent, commentString(keyComment));
      }
      let vsb, vcb, valueComment;
      if (identity.isNode(value)) {
        vsb = !!value.spaceBefore;
        vcb = value.commentBefore;
        valueComment = value.comment;
      } else {
        vsb = false;
        vcb = null;
        valueComment = null;
        if (value && typeof value === "object")
          value = doc.createNode(value);
      }
      ctx.implicitKey = false;
      if (!explicitKey && !keyComment && identity.isScalar(value))
        ctx.indentAtStart = str.length + 1;
      chompKeep = false;
      if (!indentSeq && indentStep.length >= 2 && !ctx.inFlow && !explicitKey && identity.isSeq(value) && !value.flow && !value.tag && !value.anchor) {
        ctx.indent = ctx.indent.substring(2);
      }
      let valueCommentDone = false;
      const valueStr = stringify.stringify(value, ctx, () => valueCommentDone = true, () => chompKeep = true);
      let ws = " ";
      if (keyComment || vsb || vcb) {
        ws = vsb ? "\n" : "";
        if (vcb) {
          const cs = commentString(vcb);
          ws += `
${stringifyComment.indentComment(cs, ctx.indent)}`;
        }
        if (valueStr === "" && !ctx.inFlow) {
          if (ws === "\n" && valueComment)
            ws = "\n\n";
        } else {
          ws += `
${ctx.indent}`;
        }
      } else if (!explicitKey && identity.isCollection(value)) {
        const vs0 = valueStr[0];
        const nl0 = valueStr.indexOf("\n");
        const hasNewline = nl0 !== -1;
        const flow = ctx.inFlow ?? value.flow ?? value.items.length === 0;
        if (hasNewline || !flow) {
          let hasPropsLine = false;
          if (hasNewline && (vs0 === "&" || vs0 === "!")) {
            let sp0 = valueStr.indexOf(" ");
            if (vs0 === "&" && sp0 !== -1 && sp0 < nl0 && valueStr[sp0 + 1] === "!") {
              sp0 = valueStr.indexOf(" ", sp0 + 1);
            }
            if (sp0 === -1 || nl0 < sp0)
              hasPropsLine = true;
          }
          if (!hasPropsLine)
            ws = `
${ctx.indent}`;
        }
      } else if (valueStr === "" || valueStr[0] === "\n") {
        ws = "";
      }
      str += ws + valueStr;
      if (ctx.inFlow) {
        if (valueCommentDone && onComment)
          onComment();
      } else if (valueComment && !valueCommentDone) {
        str += stringifyComment.lineComment(str, ctx.indent, commentString(valueComment));
      } else if (chompKeep && onChompKeep) {
        onChompKeep();
      }
      return str;
    }
    exports.stringifyPair = stringifyPair;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/log.js
var require_log = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/log.js"(exports) {
    "use strict";
    var node_process = __require("process");
    function debug(logLevel, ...messages) {
      if (logLevel === "debug")
        console.log(...messages);
    }
    function warn(logLevel, warning) {
      if (logLevel === "debug" || logLevel === "warn") {
        if (typeof node_process.emitWarning === "function")
          node_process.emitWarning(warning);
        else
          console.warn(warning);
      }
    }
    exports.debug = debug;
    exports.warn = warn;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/yaml-1.1/merge.js
var require_merge = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/yaml-1.1/merge.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Scalar = require_Scalar();
    var MERGE_KEY = "<<";
    var merge = {
      identify: (value) => value === MERGE_KEY || typeof value === "symbol" && value.description === MERGE_KEY,
      default: "key",
      tag: "tag:yaml.org,2002:merge",
      test: /^<<$/,
      resolve: () => Object.assign(new Scalar.Scalar(Symbol(MERGE_KEY)), {
        addToJSMap: addMergeToJSMap
      }),
      stringify: () => MERGE_KEY
    };
    var isMergeKey = (ctx, key) => (merge.identify(key) || identity.isScalar(key) && (!key.type || key.type === Scalar.Scalar.PLAIN) && merge.identify(key.value)) && ctx?.doc.schema.tags.some((tag) => tag.tag === merge.tag && tag.default);
    function addMergeToJSMap(ctx, map, value) {
      const source = resolveAliasValue(ctx, value);
      if (identity.isSeq(source))
        for (const it of source.items)
          mergeValue(ctx, map, it);
      else if (Array.isArray(source))
        for (const it of source)
          mergeValue(ctx, map, it);
      else
        mergeValue(ctx, map, source);
    }
    function mergeValue(ctx, map, value) {
      const source = resolveAliasValue(ctx, value);
      if (!identity.isMap(source))
        throw new Error("Merge sources must be maps or map aliases");
      const srcMap = source.toJSON(null, ctx, Map);
      for (const [key, value2] of srcMap) {
        if (map instanceof Map) {
          if (!map.has(key))
            map.set(key, value2);
        } else if (map instanceof Set) {
          map.add(key);
        } else if (!Object.prototype.hasOwnProperty.call(map, key)) {
          Object.defineProperty(map, key, {
            value: value2,
            writable: true,
            enumerable: true,
            configurable: true
          });
        }
      }
      return map;
    }
    function resolveAliasValue(ctx, value) {
      return ctx && identity.isAlias(value) ? value.resolve(ctx.doc, ctx) : value;
    }
    exports.addMergeToJSMap = addMergeToJSMap;
    exports.isMergeKey = isMergeKey;
    exports.merge = merge;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/nodes/addPairToJSMap.js
var require_addPairToJSMap = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/nodes/addPairToJSMap.js"(exports) {
    "use strict";
    var log = require_log();
    var merge = require_merge();
    var stringify = require_stringify();
    var identity = require_identity();
    var toJS = require_toJS();
    function addPairToJSMap(ctx, map, { key, value }) {
      if (identity.isNode(key) && key.addToJSMap)
        key.addToJSMap(ctx, map, value);
      else if (merge.isMergeKey(ctx, key))
        merge.addMergeToJSMap(ctx, map, value);
      else {
        const jsKey = toJS.toJS(key, "", ctx);
        if (map instanceof Map) {
          map.set(jsKey, toJS.toJS(value, jsKey, ctx));
        } else if (map instanceof Set) {
          map.add(jsKey);
        } else {
          const stringKey = stringifyKey(key, jsKey, ctx);
          const jsValue = toJS.toJS(value, stringKey, ctx);
          if (stringKey in map)
            Object.defineProperty(map, stringKey, {
              value: jsValue,
              writable: true,
              enumerable: true,
              configurable: true
            });
          else
            map[stringKey] = jsValue;
        }
      }
      return map;
    }
    function stringifyKey(key, jsKey, ctx) {
      if (jsKey === null)
        return "";
      if (typeof jsKey !== "object")
        return String(jsKey);
      if (identity.isNode(key) && ctx?.doc) {
        const strCtx = stringify.createStringifyContext(ctx.doc, {});
        strCtx.anchors = /* @__PURE__ */ new Set();
        for (const node of ctx.anchors.keys())
          strCtx.anchors.add(node.anchor);
        strCtx.inFlow = true;
        strCtx.inStringifyKey = true;
        const strKey = key.toString(strCtx);
        if (!ctx.mapKeyWarned) {
          let jsonStr = JSON.stringify(strKey);
          if (jsonStr.length > 40)
            jsonStr = jsonStr.substring(0, 36) + '..."';
          log.warn(ctx.doc.options.logLevel, `Keys with collection values will be stringified due to JS Object restrictions: ${jsonStr}. Set mapAsMap: true to use object keys.`);
          ctx.mapKeyWarned = true;
        }
        return strKey;
      }
      return JSON.stringify(jsKey);
    }
    exports.addPairToJSMap = addPairToJSMap;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/nodes/Pair.js
var require_Pair = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/nodes/Pair.js"(exports) {
    "use strict";
    var createNode = require_createNode();
    var stringifyPair = require_stringifyPair();
    var addPairToJSMap = require_addPairToJSMap();
    var identity = require_identity();
    function createPair(key, value, ctx) {
      const k = createNode.createNode(key, void 0, ctx);
      const v = createNode.createNode(value, void 0, ctx);
      return new Pair(k, v);
    }
    var Pair = class _Pair {
      constructor(key, value = null) {
        Object.defineProperty(this, identity.NODE_TYPE, { value: identity.PAIR });
        this.key = key;
        this.value = value;
      }
      clone(schema) {
        let { key, value } = this;
        if (identity.isNode(key))
          key = key.clone(schema);
        if (identity.isNode(value))
          value = value.clone(schema);
        return new _Pair(key, value);
      }
      toJSON(_, ctx) {
        const pair = ctx?.mapAsMap ? /* @__PURE__ */ new Map() : {};
        return addPairToJSMap.addPairToJSMap(ctx, pair, this);
      }
      toString(ctx, onComment, onChompKeep) {
        return ctx?.doc ? stringifyPair.stringifyPair(this, ctx, onComment, onChompKeep) : JSON.stringify(this);
      }
    };
    exports.Pair = Pair;
    exports.createPair = createPair;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/stringify/stringifyCollection.js
var require_stringifyCollection = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/stringify/stringifyCollection.js"(exports) {
    "use strict";
    var identity = require_identity();
    var stringify = require_stringify();
    var stringifyComment = require_stringifyComment();
    function stringifyCollection(collection, ctx, options) {
      const flow = ctx.inFlow ?? collection.flow;
      const stringify2 = flow ? stringifyFlowCollection : stringifyBlockCollection;
      return stringify2(collection, ctx, options);
    }
    function stringifyBlockCollection({ comment, items }, ctx, { blockItemPrefix, flowChars, itemIndent, onChompKeep, onComment }) {
      const { indent, options: { commentString } } = ctx;
      const itemCtx = Object.assign({}, ctx, { indent: itemIndent, type: null });
      let chompKeep = false;
      const lines = [];
      for (let i = 0; i < items.length; ++i) {
        const item = items[i];
        let comment2 = null;
        if (identity.isNode(item)) {
          if (!chompKeep && item.spaceBefore)
            lines.push("");
          addCommentBefore(ctx, lines, item.commentBefore, chompKeep);
          if (item.comment)
            comment2 = item.comment;
        } else if (identity.isPair(item)) {
          const ik = identity.isNode(item.key) ? item.key : null;
          if (ik) {
            if (!chompKeep && ik.spaceBefore)
              lines.push("");
            addCommentBefore(ctx, lines, ik.commentBefore, chompKeep);
          }
        }
        chompKeep = false;
        let str2 = stringify.stringify(item, itemCtx, () => comment2 = null, () => chompKeep = true);
        if (comment2)
          str2 += stringifyComment.lineComment(str2, itemIndent, commentString(comment2));
        if (chompKeep && comment2)
          chompKeep = false;
        lines.push(blockItemPrefix + str2);
      }
      let str;
      if (lines.length === 0) {
        str = flowChars.start + flowChars.end;
      } else {
        str = lines[0];
        for (let i = 1; i < lines.length; ++i) {
          const line = lines[i];
          str += line ? `
${indent}${line}` : "\n";
        }
      }
      if (comment) {
        str += "\n" + stringifyComment.indentComment(commentString(comment), indent);
        if (onComment)
          onComment();
      } else if (chompKeep && onChompKeep)
        onChompKeep();
      return str;
    }
    function stringifyFlowCollection({ items }, ctx, { flowChars, itemIndent }) {
      const { indent, indentStep, flowCollectionPadding: fcPadding, options: { commentString } } = ctx;
      itemIndent += indentStep;
      const itemCtx = Object.assign({}, ctx, {
        indent: itemIndent,
        inFlow: true,
        type: null
      });
      let reqNewline = false;
      let linesAtValue = 0;
      const lines = [];
      for (let i = 0; i < items.length; ++i) {
        const item = items[i];
        let comment = null;
        if (identity.isNode(item)) {
          if (item.spaceBefore)
            lines.push("");
          addCommentBefore(ctx, lines, item.commentBefore, false);
          if (item.comment)
            comment = item.comment;
        } else if (identity.isPair(item)) {
          const ik = identity.isNode(item.key) ? item.key : null;
          if (ik) {
            if (ik.spaceBefore)
              lines.push("");
            addCommentBefore(ctx, lines, ik.commentBefore, false);
            if (ik.comment)
              reqNewline = true;
          }
          const iv = identity.isNode(item.value) ? item.value : null;
          if (iv) {
            if (iv.comment)
              comment = iv.comment;
            if (iv.commentBefore)
              reqNewline = true;
          } else if (item.value == null && ik?.comment) {
            comment = ik.comment;
          }
        }
        if (comment)
          reqNewline = true;
        let str = stringify.stringify(item, itemCtx, () => comment = null);
        reqNewline || (reqNewline = lines.length > linesAtValue || str.includes("\n"));
        if (i < items.length - 1) {
          str += ",";
        } else if (ctx.options.trailingComma) {
          if (ctx.options.lineWidth > 0) {
            reqNewline || (reqNewline = lines.reduce((sum, line) => sum + line.length + 2, 2) + (str.length + 2) > ctx.options.lineWidth);
          }
          if (reqNewline) {
            str += ",";
          }
        }
        if (comment)
          str += stringifyComment.lineComment(str, itemIndent, commentString(comment));
        lines.push(str);
        linesAtValue = lines.length;
      }
      const { start, end } = flowChars;
      if (lines.length === 0) {
        return start + end;
      } else {
        if (!reqNewline) {
          const len = lines.reduce((sum, line) => sum + line.length + 2, 2);
          reqNewline = ctx.options.lineWidth > 0 && len > ctx.options.lineWidth;
        }
        if (reqNewline) {
          let str = start;
          for (const line of lines)
            str += line ? `
${indentStep}${indent}${line}` : "\n";
          return `${str}
${indent}${end}`;
        } else {
          return `${start}${fcPadding}${lines.join(" ")}${fcPadding}${end}`;
        }
      }
    }
    function addCommentBefore({ indent, options: { commentString } }, lines, comment, chompKeep) {
      if (comment && chompKeep)
        comment = comment.replace(/^\n+/, "");
      if (comment) {
        const ic = stringifyComment.indentComment(commentString(comment), indent);
        lines.push(ic.trimStart());
      }
    }
    exports.stringifyCollection = stringifyCollection;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/nodes/YAMLMap.js
var require_YAMLMap = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/nodes/YAMLMap.js"(exports) {
    "use strict";
    var stringifyCollection = require_stringifyCollection();
    var addPairToJSMap = require_addPairToJSMap();
    var Collection = require_Collection();
    var identity = require_identity();
    var Pair = require_Pair();
    var Scalar = require_Scalar();
    function findPair(items, key) {
      const k = identity.isScalar(key) ? key.value : key;
      for (const it of items) {
        if (identity.isPair(it)) {
          if (it.key === key || it.key === k)
            return it;
          if (identity.isScalar(it.key) && it.key.value === k)
            return it;
        }
      }
      return void 0;
    }
    var YAMLMap = class extends Collection.Collection {
      static get tagName() {
        return "tag:yaml.org,2002:map";
      }
      constructor(schema) {
        super(identity.MAP, schema);
        this.items = [];
      }
      /**
       * A generic collection parsing method that can be extended
       * to other node classes that inherit from YAMLMap
       */
      static from(schema, obj, ctx) {
        const { keepUndefined, replacer } = ctx;
        const map = new this(schema);
        const add = (key, value) => {
          if (typeof replacer === "function")
            value = replacer.call(obj, key, value);
          else if (Array.isArray(replacer) && !replacer.includes(key))
            return;
          if (value !== void 0 || keepUndefined)
            map.items.push(Pair.createPair(key, value, ctx));
        };
        if (obj instanceof Map) {
          for (const [key, value] of obj)
            add(key, value);
        } else if (obj && typeof obj === "object") {
          for (const key of Object.keys(obj))
            add(key, obj[key]);
        }
        if (typeof schema.sortMapEntries === "function") {
          map.items.sort(schema.sortMapEntries);
        }
        return map;
      }
      /**
       * Adds a value to the collection.
       *
       * @param overwrite - If not set `true`, using a key that is already in the
       *   collection will throw. Otherwise, overwrites the previous value.
       */
      add(pair, overwrite) {
        let _pair;
        if (identity.isPair(pair))
          _pair = pair;
        else if (!pair || typeof pair !== "object" || !("key" in pair)) {
          _pair = new Pair.Pair(pair, pair?.value);
        } else
          _pair = new Pair.Pair(pair.key, pair.value);
        const prev = findPair(this.items, _pair.key);
        const sortEntries = this.schema?.sortMapEntries;
        if (prev) {
          if (!overwrite)
            throw new Error(`Key ${_pair.key} already set`);
          if (identity.isScalar(prev.value) && Scalar.isScalarValue(_pair.value))
            prev.value.value = _pair.value;
          else
            prev.value = _pair.value;
        } else if (sortEntries) {
          const i = this.items.findIndex((item) => sortEntries(_pair, item) < 0);
          if (i === -1)
            this.items.push(_pair);
          else
            this.items.splice(i, 0, _pair);
        } else {
          this.items.push(_pair);
        }
      }
      delete(key) {
        const it = findPair(this.items, key);
        if (!it)
          return false;
        const del = this.items.splice(this.items.indexOf(it), 1);
        return del.length > 0;
      }
      get(key, keepScalar) {
        const it = findPair(this.items, key);
        const node = it?.value;
        return (!keepScalar && identity.isScalar(node) ? node.value : node) ?? void 0;
      }
      has(key) {
        return !!findPair(this.items, key);
      }
      set(key, value) {
        this.add(new Pair.Pair(key, value), true);
      }
      /**
       * @param ctx - Conversion context, originally set in Document#toJS()
       * @param {Class} Type - If set, forces the returned collection type
       * @returns Instance of Type, Map, or Object
       */
      toJSON(_, ctx, Type) {
        const map = Type ? new Type() : ctx?.mapAsMap ? /* @__PURE__ */ new Map() : {};
        if (ctx?.onCreate)
          ctx.onCreate(map);
        for (const item of this.items)
          addPairToJSMap.addPairToJSMap(ctx, map, item);
        return map;
      }
      toString(ctx, onComment, onChompKeep) {
        if (!ctx)
          return JSON.stringify(this);
        for (const item of this.items) {
          if (!identity.isPair(item))
            throw new Error(`Map items must all be pairs; found ${JSON.stringify(item)} instead`);
        }
        if (!ctx.allNullValues && this.hasAllNullValues(false))
          ctx = Object.assign({}, ctx, { allNullValues: true });
        return stringifyCollection.stringifyCollection(this, ctx, {
          blockItemPrefix: "",
          flowChars: { start: "{", end: "}" },
          itemIndent: ctx.indent || "",
          onChompKeep,
          onComment
        });
      }
    };
    exports.YAMLMap = YAMLMap;
    exports.findPair = findPair;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/common/map.js
var require_map = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/common/map.js"(exports) {
    "use strict";
    var identity = require_identity();
    var YAMLMap = require_YAMLMap();
    var map = {
      collection: "map",
      default: true,
      nodeClass: YAMLMap.YAMLMap,
      tag: "tag:yaml.org,2002:map",
      resolve(map2, onError) {
        if (!identity.isMap(map2))
          onError("Expected a mapping for this tag");
        return map2;
      },
      createNode: (schema, obj, ctx) => YAMLMap.YAMLMap.from(schema, obj, ctx)
    };
    exports.map = map;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/nodes/YAMLSeq.js
var require_YAMLSeq = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/nodes/YAMLSeq.js"(exports) {
    "use strict";
    var createNode = require_createNode();
    var stringifyCollection = require_stringifyCollection();
    var Collection = require_Collection();
    var identity = require_identity();
    var Scalar = require_Scalar();
    var toJS = require_toJS();
    var YAMLSeq = class extends Collection.Collection {
      static get tagName() {
        return "tag:yaml.org,2002:seq";
      }
      constructor(schema) {
        super(identity.SEQ, schema);
        this.items = [];
      }
      add(value) {
        this.items.push(value);
      }
      /**
       * Removes a value from the collection.
       *
       * `key` must contain a representation of an integer for this to succeed.
       * It may be wrapped in a `Scalar`.
       *
       * @returns `true` if the item was found and removed.
       */
      delete(key) {
        const idx = asItemIndex(key);
        if (typeof idx !== "number")
          return false;
        const del = this.items.splice(idx, 1);
        return del.length > 0;
      }
      get(key, keepScalar) {
        const idx = asItemIndex(key);
        if (typeof idx !== "number")
          return void 0;
        const it = this.items[idx];
        return !keepScalar && identity.isScalar(it) ? it.value : it;
      }
      /**
       * Checks if the collection includes a value with the key `key`.
       *
       * `key` must contain a representation of an integer for this to succeed.
       * It may be wrapped in a `Scalar`.
       */
      has(key) {
        const idx = asItemIndex(key);
        return typeof idx === "number" && idx < this.items.length;
      }
      /**
       * Sets a value in this collection. For `!!set`, `value` needs to be a
       * boolean to add/remove the item from the set.
       *
       * If `key` does not contain a representation of an integer, this will throw.
       * It may be wrapped in a `Scalar`.
       */
      set(key, value) {
        const idx = asItemIndex(key);
        if (typeof idx !== "number")
          throw new Error(`Expected a valid index, not ${key}.`);
        const prev = this.items[idx];
        if (identity.isScalar(prev) && Scalar.isScalarValue(value))
          prev.value = value;
        else
          this.items[idx] = value;
      }
      toJSON(_, ctx) {
        const seq = [];
        if (ctx?.onCreate)
          ctx.onCreate(seq);
        let i = 0;
        for (const item of this.items)
          seq.push(toJS.toJS(item, String(i++), ctx));
        return seq;
      }
      toString(ctx, onComment, onChompKeep) {
        if (!ctx)
          return JSON.stringify(this);
        return stringifyCollection.stringifyCollection(this, ctx, {
          blockItemPrefix: "- ",
          flowChars: { start: "[", end: "]" },
          itemIndent: (ctx.indent || "") + "  ",
          onChompKeep,
          onComment
        });
      }
      static from(schema, obj, ctx) {
        const { replacer } = ctx;
        const seq = new this(schema);
        if (obj && Symbol.iterator in Object(obj)) {
          let i = 0;
          for (let it of obj) {
            if (typeof replacer === "function") {
              const key = obj instanceof Set ? it : String(i++);
              it = replacer.call(obj, key, it);
            }
            seq.items.push(createNode.createNode(it, void 0, ctx));
          }
        }
        return seq;
      }
    };
    function asItemIndex(key) {
      let idx = identity.isScalar(key) ? key.value : key;
      if (idx && typeof idx === "string")
        idx = Number(idx);
      return typeof idx === "number" && Number.isInteger(idx) && idx >= 0 ? idx : null;
    }
    exports.YAMLSeq = YAMLSeq;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/common/seq.js
var require_seq = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/common/seq.js"(exports) {
    "use strict";
    var identity = require_identity();
    var YAMLSeq = require_YAMLSeq();
    var seq = {
      collection: "seq",
      default: true,
      nodeClass: YAMLSeq.YAMLSeq,
      tag: "tag:yaml.org,2002:seq",
      resolve(seq2, onError) {
        if (!identity.isSeq(seq2))
          onError("Expected a sequence for this tag");
        return seq2;
      },
      createNode: (schema, obj, ctx) => YAMLSeq.YAMLSeq.from(schema, obj, ctx)
    };
    exports.seq = seq;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/common/string.js
var require_string = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/common/string.js"(exports) {
    "use strict";
    var stringifyString = require_stringifyString();
    var string = {
      identify: (value) => typeof value === "string",
      default: true,
      tag: "tag:yaml.org,2002:str",
      resolve: (str) => str,
      stringify(item, ctx, onComment, onChompKeep) {
        ctx = Object.assign({ actualString: true }, ctx);
        return stringifyString.stringifyString(item, ctx, onComment, onChompKeep);
      }
    };
    exports.string = string;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/common/null.js
var require_null = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/common/null.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    var nullTag = {
      identify: (value) => value == null,
      createNode: () => new Scalar.Scalar(null),
      default: true,
      tag: "tag:yaml.org,2002:null",
      test: /^(?:~|[Nn]ull|NULL)?$/,
      resolve: () => new Scalar.Scalar(null),
      stringify: ({ source }, ctx) => typeof source === "string" && nullTag.test.test(source) ? source : ctx.options.nullStr
    };
    exports.nullTag = nullTag;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/core/bool.js
var require_bool = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/core/bool.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    var boolTag = {
      identify: (value) => typeof value === "boolean",
      default: true,
      tag: "tag:yaml.org,2002:bool",
      test: /^(?:[Tt]rue|TRUE|[Ff]alse|FALSE)$/,
      resolve: (str) => new Scalar.Scalar(str[0] === "t" || str[0] === "T"),
      stringify({ source, value }, ctx) {
        if (source && boolTag.test.test(source)) {
          const sv = source[0] === "t" || source[0] === "T";
          if (value === sv)
            return source;
        }
        return value ? ctx.options.trueStr : ctx.options.falseStr;
      }
    };
    exports.boolTag = boolTag;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/stringify/stringifyNumber.js
var require_stringifyNumber = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/stringify/stringifyNumber.js"(exports) {
    "use strict";
    function stringifyNumber({ format, minFractionDigits, tag, value }) {
      if (typeof value === "bigint")
        return String(value);
      const num = typeof value === "number" ? value : Number(value);
      if (!isFinite(num))
        return isNaN(num) ? ".nan" : num < 0 ? "-.inf" : ".inf";
      let n = Object.is(value, -0) ? "-0" : JSON.stringify(value);
      if (!format && minFractionDigits && (!tag || tag === "tag:yaml.org,2002:float") && /^-?\d/.test(n) && !n.includes("e")) {
        let i = n.indexOf(".");
        if (i < 0) {
          i = n.length;
          n += ".";
        }
        let d = minFractionDigits - (n.length - i - 1);
        while (d-- > 0)
          n += "0";
      }
      return n;
    }
    exports.stringifyNumber = stringifyNumber;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/core/float.js
var require_float = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/core/float.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    var stringifyNumber = require_stringifyNumber();
    var floatNaN = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
      resolve: (str) => str.slice(-3).toLowerCase() === "nan" ? NaN : str[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
      stringify: stringifyNumber.stringifyNumber
    };
    var floatExp = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      format: "EXP",
      test: /^[-+]?(?:\.[0-9]+|[0-9]+(?:\.[0-9]*)?)[eE][-+]?[0-9]+$/,
      resolve: (str) => parseFloat(str),
      stringify(node) {
        const num = Number(node.value);
        return isFinite(num) ? num.toExponential() : stringifyNumber.stringifyNumber(node);
      }
    };
    var float = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      test: /^[-+]?(?:\.[0-9]+|[0-9]+\.[0-9]*)$/,
      resolve(str) {
        const node = new Scalar.Scalar(parseFloat(str));
        const dot = str.indexOf(".");
        if (dot !== -1 && str[str.length - 1] === "0")
          node.minFractionDigits = str.length - dot - 1;
        return node;
      },
      stringify: stringifyNumber.stringifyNumber
    };
    exports.float = float;
    exports.floatExp = floatExp;
    exports.floatNaN = floatNaN;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/core/int.js
var require_int = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/core/int.js"(exports) {
    "use strict";
    var stringifyNumber = require_stringifyNumber();
    var intIdentify = (value) => typeof value === "bigint" || Number.isInteger(value);
    var intResolve = (str, offset, radix, { intAsBigInt }) => intAsBigInt ? BigInt(str) : parseInt(str.substring(offset), radix);
    function intStringify(node, radix, prefix) {
      const { value } = node;
      if (intIdentify(value) && value >= 0)
        return prefix + value.toString(radix);
      return stringifyNumber.stringifyNumber(node);
    }
    var intOct = {
      identify: (value) => intIdentify(value) && value >= 0,
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "OCT",
      test: /^0o[0-7]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 2, 8, opt),
      stringify: (node) => intStringify(node, 8, "0o")
    };
    var int = {
      identify: intIdentify,
      default: true,
      tag: "tag:yaml.org,2002:int",
      test: /^[-+]?[0-9]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 0, 10, opt),
      stringify: stringifyNumber.stringifyNumber
    };
    var intHex = {
      identify: (value) => intIdentify(value) && value >= 0,
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "HEX",
      test: /^0x[0-9a-fA-F]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 2, 16, opt),
      stringify: (node) => intStringify(node, 16, "0x")
    };
    exports.int = int;
    exports.intHex = intHex;
    exports.intOct = intOct;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/core/schema.js
var require_schema = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/core/schema.js"(exports) {
    "use strict";
    var map = require_map();
    var _null = require_null();
    var seq = require_seq();
    var string = require_string();
    var bool = require_bool();
    var float = require_float();
    var int = require_int();
    var schema = [
      map.map,
      seq.seq,
      string.string,
      _null.nullTag,
      bool.boolTag,
      int.intOct,
      int.int,
      int.intHex,
      float.floatNaN,
      float.floatExp,
      float.float
    ];
    exports.schema = schema;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/json/schema.js
var require_schema2 = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/json/schema.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    var map = require_map();
    var seq = require_seq();
    function intIdentify(value) {
      return typeof value === "bigint" || Number.isInteger(value);
    }
    var stringifyJSON = ({ value }) => JSON.stringify(value);
    var jsonScalars = [
      {
        identify: (value) => typeof value === "string",
        default: true,
        tag: "tag:yaml.org,2002:str",
        resolve: (str) => str,
        stringify: stringifyJSON
      },
      {
        identify: (value) => value == null,
        createNode: () => new Scalar.Scalar(null),
        default: true,
        tag: "tag:yaml.org,2002:null",
        test: /^null$/,
        resolve: () => null,
        stringify: stringifyJSON
      },
      {
        identify: (value) => typeof value === "boolean",
        default: true,
        tag: "tag:yaml.org,2002:bool",
        test: /^true$|^false$/,
        resolve: (str) => str === "true",
        stringify: stringifyJSON
      },
      {
        identify: intIdentify,
        default: true,
        tag: "tag:yaml.org,2002:int",
        test: /^-?(?:0|[1-9][0-9]*)$/,
        resolve: (str, _onError, { intAsBigInt }) => intAsBigInt ? BigInt(str) : parseInt(str, 10),
        stringify: ({ value }) => intIdentify(value) ? value.toString() : JSON.stringify(value)
      },
      {
        identify: (value) => typeof value === "number",
        default: true,
        tag: "tag:yaml.org,2002:float",
        test: /^-?(?:0|[1-9][0-9]*)(?:\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$/,
        resolve: (str) => parseFloat(str),
        stringify: stringifyJSON
      }
    ];
    var jsonError = {
      default: true,
      tag: "",
      test: /^/,
      resolve(str, onError) {
        onError(`Unresolved plain scalar ${JSON.stringify(str)}`);
        return str;
      }
    };
    var schema = [map.map, seq.seq].concat(jsonScalars, jsonError);
    exports.schema = schema;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/yaml-1.1/binary.js
var require_binary = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/yaml-1.1/binary.js"(exports) {
    "use strict";
    var node_buffer = __require("buffer");
    var Scalar = require_Scalar();
    var stringifyString = require_stringifyString();
    var binary = {
      identify: (value) => value instanceof Uint8Array,
      // Buffer inherits from Uint8Array
      default: false,
      tag: "tag:yaml.org,2002:binary",
      /**
       * Returns a Buffer in node and an Uint8Array in browsers
       *
       * To use the resulting buffer as an image, you'll want to do something like:
       *
       *   const blob = new Blob([buffer], { type: 'image/jpeg' })
       *   document.querySelector('#photo').src = URL.createObjectURL(blob)
       */
      resolve(src, onError) {
        if (typeof node_buffer.Buffer === "function") {
          return node_buffer.Buffer.from(src, "base64");
        } else if (typeof atob === "function") {
          const str = atob(src.replace(/[\n\r]/g, ""));
          const buffer = new Uint8Array(str.length);
          for (let i = 0; i < str.length; ++i)
            buffer[i] = str.charCodeAt(i);
          return buffer;
        } else {
          onError("This environment does not support reading binary tags; either Buffer or atob is required");
          return src;
        }
      },
      stringify({ comment, type, value }, ctx, onComment, onChompKeep) {
        if (!value)
          return "";
        const buf = value;
        let str;
        if (typeof node_buffer.Buffer === "function") {
          str = buf instanceof node_buffer.Buffer ? buf.toString("base64") : node_buffer.Buffer.from(buf.buffer).toString("base64");
        } else if (typeof btoa === "function") {
          let s = "";
          for (let i = 0; i < buf.length; ++i)
            s += String.fromCharCode(buf[i]);
          str = btoa(s);
        } else {
          throw new Error("This environment does not support writing binary tags; either Buffer or btoa is required");
        }
        type ?? (type = Scalar.Scalar.BLOCK_LITERAL);
        if (type !== Scalar.Scalar.QUOTE_DOUBLE) {
          const lineWidth = Math.max(ctx.options.lineWidth - ctx.indent.length, ctx.options.minContentWidth);
          const n = Math.ceil(str.length / lineWidth);
          const lines = new Array(n);
          for (let i = 0, o = 0; i < n; ++i, o += lineWidth) {
            lines[i] = str.substr(o, lineWidth);
          }
          str = lines.join(type === Scalar.Scalar.BLOCK_LITERAL ? "\n" : " ");
        }
        return stringifyString.stringifyString({ comment, type, value: str }, ctx, onComment, onChompKeep);
      }
    };
    exports.binary = binary;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/yaml-1.1/pairs.js
var require_pairs = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/yaml-1.1/pairs.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Pair = require_Pair();
    var Scalar = require_Scalar();
    var YAMLSeq = require_YAMLSeq();
    function resolvePairs(seq, onError) {
      if (identity.isSeq(seq)) {
        for (let i = 0; i < seq.items.length; ++i) {
          let item = seq.items[i];
          if (identity.isPair(item))
            continue;
          else if (identity.isMap(item)) {
            if (item.items.length > 1)
              onError("Each pair must have its own sequence indicator");
            const pair = item.items[0] || new Pair.Pair(new Scalar.Scalar(null));
            if (item.commentBefore)
              pair.key.commentBefore = pair.key.commentBefore ? `${item.commentBefore}
${pair.key.commentBefore}` : item.commentBefore;
            if (item.comment) {
              const cn = pair.value ?? pair.key;
              cn.comment = cn.comment ? `${item.comment}
${cn.comment}` : item.comment;
            }
            item = pair;
          }
          seq.items[i] = identity.isPair(item) ? item : new Pair.Pair(item);
        }
      } else
        onError("Expected a sequence for this tag");
      return seq;
    }
    function createPairs(schema, iterable, ctx) {
      const { replacer } = ctx;
      const pairs2 = new YAMLSeq.YAMLSeq(schema);
      pairs2.tag = "tag:yaml.org,2002:pairs";
      let i = 0;
      if (iterable && Symbol.iterator in Object(iterable))
        for (let it of iterable) {
          if (typeof replacer === "function")
            it = replacer.call(iterable, String(i++), it);
          let key, value;
          if (Array.isArray(it)) {
            if (it.length === 2) {
              key = it[0];
              value = it[1];
            } else
              throw new TypeError(`Expected [key, value] tuple: ${it}`);
          } else if (it && it instanceof Object) {
            const keys = Object.keys(it);
            if (keys.length === 1) {
              key = keys[0];
              value = it[key];
            } else {
              throw new TypeError(`Expected tuple with one key, not ${keys.length} keys`);
            }
          } else {
            key = it;
          }
          pairs2.items.push(Pair.createPair(key, value, ctx));
        }
      return pairs2;
    }
    var pairs = {
      collection: "seq",
      default: false,
      tag: "tag:yaml.org,2002:pairs",
      resolve: resolvePairs,
      createNode: createPairs
    };
    exports.createPairs = createPairs;
    exports.pairs = pairs;
    exports.resolvePairs = resolvePairs;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/yaml-1.1/omap.js
var require_omap = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/yaml-1.1/omap.js"(exports) {
    "use strict";
    var identity = require_identity();
    var toJS = require_toJS();
    var YAMLMap = require_YAMLMap();
    var YAMLSeq = require_YAMLSeq();
    var pairs = require_pairs();
    var YAMLOMap = class _YAMLOMap extends YAMLSeq.YAMLSeq {
      constructor() {
        super();
        this.add = YAMLMap.YAMLMap.prototype.add.bind(this);
        this.delete = YAMLMap.YAMLMap.prototype.delete.bind(this);
        this.get = YAMLMap.YAMLMap.prototype.get.bind(this);
        this.has = YAMLMap.YAMLMap.prototype.has.bind(this);
        this.set = YAMLMap.YAMLMap.prototype.set.bind(this);
        this.tag = _YAMLOMap.tag;
      }
      /**
       * If `ctx` is given, the return type is actually `Map<unknown, unknown>`,
       * but TypeScript won't allow widening the signature of a child method.
       */
      toJSON(_, ctx) {
        if (!ctx)
          return super.toJSON(_);
        const map = /* @__PURE__ */ new Map();
        if (ctx?.onCreate)
          ctx.onCreate(map);
        for (const pair of this.items) {
          let key, value;
          if (identity.isPair(pair)) {
            key = toJS.toJS(pair.key, "", ctx);
            value = toJS.toJS(pair.value, key, ctx);
          } else {
            key = toJS.toJS(pair, "", ctx);
          }
          if (map.has(key))
            throw new Error("Ordered maps must not include duplicate keys");
          map.set(key, value);
        }
        return map;
      }
      static from(schema, iterable, ctx) {
        const pairs$1 = pairs.createPairs(schema, iterable, ctx);
        const omap2 = new this();
        omap2.items = pairs$1.items;
        return omap2;
      }
    };
    YAMLOMap.tag = "tag:yaml.org,2002:omap";
    var omap = {
      collection: "seq",
      identify: (value) => value instanceof Map,
      nodeClass: YAMLOMap,
      default: false,
      tag: "tag:yaml.org,2002:omap",
      resolve(seq, onError) {
        const pairs$1 = pairs.resolvePairs(seq, onError);
        const seenKeys = [];
        for (const { key } of pairs$1.items) {
          if (identity.isScalar(key)) {
            if (seenKeys.includes(key.value)) {
              onError(`Ordered maps must not include duplicate keys: ${key.value}`);
            } else {
              seenKeys.push(key.value);
            }
          }
        }
        return Object.assign(new YAMLOMap(), pairs$1);
      },
      createNode: (schema, iterable, ctx) => YAMLOMap.from(schema, iterable, ctx)
    };
    exports.YAMLOMap = YAMLOMap;
    exports.omap = omap;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/yaml-1.1/bool.js
var require_bool2 = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/yaml-1.1/bool.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    function boolStringify({ value, source }, ctx) {
      const boolObj = value ? trueTag : falseTag;
      if (source && boolObj.test.test(source))
        return source;
      return value ? ctx.options.trueStr : ctx.options.falseStr;
    }
    var trueTag = {
      identify: (value) => value === true,
      default: true,
      tag: "tag:yaml.org,2002:bool",
      test: /^(?:Y|y|[Yy]es|YES|[Tt]rue|TRUE|[Oo]n|ON)$/,
      resolve: () => new Scalar.Scalar(true),
      stringify: boolStringify
    };
    var falseTag = {
      identify: (value) => value === false,
      default: true,
      tag: "tag:yaml.org,2002:bool",
      test: /^(?:N|n|[Nn]o|NO|[Ff]alse|FALSE|[Oo]ff|OFF)$/,
      resolve: () => new Scalar.Scalar(false),
      stringify: boolStringify
    };
    exports.falseTag = falseTag;
    exports.trueTag = trueTag;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/yaml-1.1/float.js
var require_float2 = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/yaml-1.1/float.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    var stringifyNumber = require_stringifyNumber();
    var floatNaN = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
      resolve: (str) => str.slice(-3).toLowerCase() === "nan" ? NaN : str[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
      stringify: stringifyNumber.stringifyNumber
    };
    var floatExp = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      format: "EXP",
      test: /^[-+]?(?:[0-9][0-9_]*)?(?:\.[0-9_]*)?[eE][-+]?[0-9]+$/,
      resolve: (str) => parseFloat(str.replace(/_/g, "")),
      stringify(node) {
        const num = Number(node.value);
        return isFinite(num) ? num.toExponential() : stringifyNumber.stringifyNumber(node);
      }
    };
    var float = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      test: /^[-+]?(?:[0-9][0-9_]*)?\.[0-9_]*$/,
      resolve(str) {
        const node = new Scalar.Scalar(parseFloat(str.replace(/_/g, "")));
        const dot = str.indexOf(".");
        if (dot !== -1) {
          const f = str.substring(dot + 1).replace(/_/g, "");
          if (f[f.length - 1] === "0")
            node.minFractionDigits = f.length;
        }
        return node;
      },
      stringify: stringifyNumber.stringifyNumber
    };
    exports.float = float;
    exports.floatExp = floatExp;
    exports.floatNaN = floatNaN;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/yaml-1.1/int.js
var require_int2 = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/yaml-1.1/int.js"(exports) {
    "use strict";
    var stringifyNumber = require_stringifyNumber();
    var intIdentify = (value) => typeof value === "bigint" || Number.isInteger(value);
    function intResolve(str, offset, radix, { intAsBigInt }) {
      const sign = str[0];
      if (sign === "-" || sign === "+")
        offset += 1;
      str = str.substring(offset).replace(/_/g, "");
      if (intAsBigInt) {
        switch (radix) {
          case 2:
            str = `0b${str}`;
            break;
          case 8:
            str = `0o${str}`;
            break;
          case 16:
            str = `0x${str}`;
            break;
        }
        const n2 = BigInt(str);
        return sign === "-" ? BigInt(-1) * n2 : n2;
      }
      const n = parseInt(str, radix);
      return sign === "-" ? -1 * n : n;
    }
    function intStringify(node, radix, prefix) {
      const { value } = node;
      if (intIdentify(value)) {
        const str = value.toString(radix);
        return value < 0 ? "-" + prefix + str.substr(1) : prefix + str;
      }
      return stringifyNumber.stringifyNumber(node);
    }
    var intBin = {
      identify: intIdentify,
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "BIN",
      test: /^[-+]?0b[0-1_]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 2, 2, opt),
      stringify: (node) => intStringify(node, 2, "0b")
    };
    var intOct = {
      identify: intIdentify,
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "OCT",
      test: /^[-+]?0[0-7_]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 1, 8, opt),
      stringify: (node) => intStringify(node, 8, "0")
    };
    var int = {
      identify: intIdentify,
      default: true,
      tag: "tag:yaml.org,2002:int",
      test: /^[-+]?[0-9][0-9_]*$/,
      resolve: (str, _onError, opt) => intResolve(str, 0, 10, opt),
      stringify: stringifyNumber.stringifyNumber
    };
    var intHex = {
      identify: intIdentify,
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "HEX",
      test: /^[-+]?0x[0-9a-fA-F_]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 2, 16, opt),
      stringify: (node) => intStringify(node, 16, "0x")
    };
    exports.int = int;
    exports.intBin = intBin;
    exports.intHex = intHex;
    exports.intOct = intOct;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/yaml-1.1/set.js
var require_set = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/yaml-1.1/set.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Pair = require_Pair();
    var YAMLMap = require_YAMLMap();
    var YAMLSet = class _YAMLSet extends YAMLMap.YAMLMap {
      constructor(schema) {
        super(schema);
        this.tag = _YAMLSet.tag;
      }
      add(key) {
        let pair;
        if (identity.isPair(key))
          pair = key;
        else if (key && typeof key === "object" && "key" in key && "value" in key && key.value === null)
          pair = new Pair.Pair(key.key, null);
        else
          pair = new Pair.Pair(key, null);
        const prev = YAMLMap.findPair(this.items, pair.key);
        if (!prev)
          this.items.push(pair);
      }
      /**
       * If `keepPair` is `true`, returns the Pair matching `key`.
       * Otherwise, returns the value of that Pair's key.
       */
      get(key, keepPair) {
        const pair = YAMLMap.findPair(this.items, key);
        return !keepPair && identity.isPair(pair) ? identity.isScalar(pair.key) ? pair.key.value : pair.key : pair;
      }
      set(key, value) {
        if (typeof value !== "boolean")
          throw new Error(`Expected boolean value for set(key, value) in a YAML set, not ${typeof value}`);
        const prev = YAMLMap.findPair(this.items, key);
        if (prev && !value) {
          this.items.splice(this.items.indexOf(prev), 1);
        } else if (!prev && value) {
          this.items.push(new Pair.Pair(key));
        }
      }
      toJSON(_, ctx) {
        return super.toJSON(_, ctx, Set);
      }
      toString(ctx, onComment, onChompKeep) {
        if (!ctx)
          return JSON.stringify(this);
        if (this.hasAllNullValues(true))
          return super.toString(Object.assign({}, ctx, { allNullValues: true }), onComment, onChompKeep);
        else
          throw new Error("Set items must all have null values");
      }
      static from(schema, iterable, ctx) {
        const { replacer } = ctx;
        const set2 = new this(schema);
        if (iterable && Symbol.iterator in Object(iterable))
          for (let value of iterable) {
            if (typeof replacer === "function")
              value = replacer.call(iterable, value, value);
            set2.items.push(Pair.createPair(value, null, ctx));
          }
        return set2;
      }
    };
    YAMLSet.tag = "tag:yaml.org,2002:set";
    var set = {
      collection: "map",
      identify: (value) => value instanceof Set,
      nodeClass: YAMLSet,
      default: false,
      tag: "tag:yaml.org,2002:set",
      createNode: (schema, iterable, ctx) => YAMLSet.from(schema, iterable, ctx),
      resolve(map, onError) {
        if (identity.isMap(map)) {
          if (map.hasAllNullValues(true))
            return Object.assign(new YAMLSet(), map);
          else
            onError("Set items must all have null values");
        } else
          onError("Expected a mapping for this tag");
        return map;
      }
    };
    exports.YAMLSet = YAMLSet;
    exports.set = set;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/yaml-1.1/timestamp.js
var require_timestamp = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/yaml-1.1/timestamp.js"(exports) {
    "use strict";
    var stringifyNumber = require_stringifyNumber();
    function parseSexagesimal(str, asBigInt) {
      const sign = str[0];
      const parts = sign === "-" || sign === "+" ? str.substring(1) : str;
      const num = (n) => asBigInt ? BigInt(n) : Number(n);
      const res = parts.replace(/_/g, "").split(":").reduce((res2, p) => res2 * num(60) + num(p), num(0));
      return sign === "-" ? num(-1) * res : res;
    }
    function stringifySexagesimal(node) {
      let { value } = node;
      let num = (n) => n;
      if (typeof value === "bigint")
        num = (n) => BigInt(n);
      else if (isNaN(value) || !isFinite(value))
        return stringifyNumber.stringifyNumber(node);
      let sign = "";
      if (value < 0) {
        sign = "-";
        value *= num(-1);
      }
      const _60 = num(60);
      const parts = [value % _60];
      if (value < 60) {
        parts.unshift(0);
      } else {
        value = (value - parts[0]) / _60;
        parts.unshift(value % _60);
        if (value >= 60) {
          value = (value - parts[0]) / _60;
          parts.unshift(value);
        }
      }
      return sign + parts.map((n) => String(n).padStart(2, "0")).join(":").replace(/000000\d*$/, "");
    }
    var intTime = {
      identify: (value) => typeof value === "bigint" || Number.isInteger(value),
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "TIME",
      test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+$/,
      resolve: (str, _onError, { intAsBigInt }) => parseSexagesimal(str, intAsBigInt),
      stringify: stringifySexagesimal
    };
    var floatTime = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      format: "TIME",
      test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\.[0-9_]*$/,
      resolve: (str) => parseSexagesimal(str, false),
      stringify: stringifySexagesimal
    };
    var timestamp = {
      identify: (value) => value instanceof Date,
      default: true,
      tag: "tag:yaml.org,2002:timestamp",
      // If the time zone is omitted, the timestamp is assumed to be specified in UTC. The time part
      // may be omitted altogether, resulting in a date format. In such a case, the time part is
      // assumed to be 00:00:00Z (start of day, UTC).
      test: RegExp("^([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})(?:(?:t|T|[ \\t]+)([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}(\\.[0-9]+)?)(?:[ \\t]*(Z|[-+][012]?[0-9](?::[0-9]{2})?))?)?$"),
      resolve(str) {
        const match = str.match(timestamp.test);
        if (!match)
          throw new Error("!!timestamp expects a date, starting with yyyy-mm-dd");
        const [, year, month, day, hour, minute, second] = match.map(Number);
        const millisec = match[7] ? Number((match[7] + "00").substr(1, 3)) : 0;
        let date = Date.UTC(year, month - 1, day, hour || 0, minute || 0, second || 0, millisec);
        const tz = match[8];
        if (tz && tz !== "Z") {
          let d = parseSexagesimal(tz, false);
          if (Math.abs(d) < 30)
            d *= 60;
          date -= 6e4 * d;
        }
        return new Date(date);
      },
      stringify: ({ value }) => value?.toISOString().replace(/(T00:00:00)?\.000Z$/, "") ?? ""
    };
    exports.floatTime = floatTime;
    exports.intTime = intTime;
    exports.timestamp = timestamp;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/yaml-1.1/schema.js
var require_schema3 = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/yaml-1.1/schema.js"(exports) {
    "use strict";
    var map = require_map();
    var _null = require_null();
    var seq = require_seq();
    var string = require_string();
    var binary = require_binary();
    var bool = require_bool2();
    var float = require_float2();
    var int = require_int2();
    var merge = require_merge();
    var omap = require_omap();
    var pairs = require_pairs();
    var set = require_set();
    var timestamp = require_timestamp();
    var schema = [
      map.map,
      seq.seq,
      string.string,
      _null.nullTag,
      bool.trueTag,
      bool.falseTag,
      int.intBin,
      int.intOct,
      int.int,
      int.intHex,
      float.floatNaN,
      float.floatExp,
      float.float,
      binary.binary,
      merge.merge,
      omap.omap,
      pairs.pairs,
      set.set,
      timestamp.intTime,
      timestamp.floatTime,
      timestamp.timestamp
    ];
    exports.schema = schema;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/tags.js
var require_tags = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/tags.js"(exports) {
    "use strict";
    var map = require_map();
    var _null = require_null();
    var seq = require_seq();
    var string = require_string();
    var bool = require_bool();
    var float = require_float();
    var int = require_int();
    var schema = require_schema();
    var schema$1 = require_schema2();
    var binary = require_binary();
    var merge = require_merge();
    var omap = require_omap();
    var pairs = require_pairs();
    var schema$2 = require_schema3();
    var set = require_set();
    var timestamp = require_timestamp();
    var schemas = /* @__PURE__ */ new Map([
      ["core", schema.schema],
      ["failsafe", [map.map, seq.seq, string.string]],
      ["json", schema$1.schema],
      ["yaml11", schema$2.schema],
      ["yaml-1.1", schema$2.schema]
    ]);
    var tagsByName = {
      binary: binary.binary,
      bool: bool.boolTag,
      float: float.float,
      floatExp: float.floatExp,
      floatNaN: float.floatNaN,
      floatTime: timestamp.floatTime,
      int: int.int,
      intHex: int.intHex,
      intOct: int.intOct,
      intTime: timestamp.intTime,
      map: map.map,
      merge: merge.merge,
      null: _null.nullTag,
      omap: omap.omap,
      pairs: pairs.pairs,
      seq: seq.seq,
      set: set.set,
      timestamp: timestamp.timestamp
    };
    var coreKnownTags = {
      "tag:yaml.org,2002:binary": binary.binary,
      "tag:yaml.org,2002:merge": merge.merge,
      "tag:yaml.org,2002:omap": omap.omap,
      "tag:yaml.org,2002:pairs": pairs.pairs,
      "tag:yaml.org,2002:set": set.set,
      "tag:yaml.org,2002:timestamp": timestamp.timestamp
    };
    function getTags(customTags, schemaName, addMergeTag) {
      const schemaTags = schemas.get(schemaName);
      if (schemaTags && !customTags) {
        return addMergeTag && !schemaTags.includes(merge.merge) ? schemaTags.concat(merge.merge) : schemaTags.slice();
      }
      let tags = schemaTags;
      if (!tags) {
        if (Array.isArray(customTags))
          tags = [];
        else {
          const keys = Array.from(schemas.keys()).filter((key) => key !== "yaml11").map((key) => JSON.stringify(key)).join(", ");
          throw new Error(`Unknown schema "${schemaName}"; use one of ${keys} or define customTags array`);
        }
      }
      if (Array.isArray(customTags)) {
        for (const tag of customTags)
          tags = tags.concat(tag);
      } else if (typeof customTags === "function") {
        tags = customTags(tags.slice());
      }
      if (addMergeTag)
        tags = tags.concat(merge.merge);
      return tags.reduce((tags2, tag) => {
        const tagObj = typeof tag === "string" ? tagsByName[tag] : tag;
        if (!tagObj) {
          const tagName = JSON.stringify(tag);
          const keys = Object.keys(tagsByName).map((key) => JSON.stringify(key)).join(", ");
          throw new Error(`Unknown custom tag ${tagName}; use one of ${keys}`);
        }
        if (!tags2.includes(tagObj))
          tags2.push(tagObj);
        return tags2;
      }, []);
    }
    exports.coreKnownTags = coreKnownTags;
    exports.getTags = getTags;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/Schema.js
var require_Schema = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/Schema.js"(exports) {
    "use strict";
    var identity = require_identity();
    var map = require_map();
    var seq = require_seq();
    var string = require_string();
    var tags = require_tags();
    var sortMapEntriesByKey = (a, b) => a.key < b.key ? -1 : a.key > b.key ? 1 : 0;
    var Schema = class _Schema {
      constructor({ compat, customTags, merge, resolveKnownTags, schema, sortMapEntries, toStringDefaults }) {
        this.compat = Array.isArray(compat) ? tags.getTags(compat, "compat") : compat ? tags.getTags(null, compat) : null;
        this.name = typeof schema === "string" && schema || "core";
        this.knownTags = resolveKnownTags ? tags.coreKnownTags : {};
        this.tags = tags.getTags(customTags, this.name, merge);
        this.toStringOptions = toStringDefaults ?? null;
        Object.defineProperty(this, identity.MAP, { value: map.map });
        Object.defineProperty(this, identity.SCALAR, { value: string.string });
        Object.defineProperty(this, identity.SEQ, { value: seq.seq });
        this.sortMapEntries = typeof sortMapEntries === "function" ? sortMapEntries : sortMapEntries === true ? sortMapEntriesByKey : null;
      }
      clone() {
        const copy = Object.create(_Schema.prototype, Object.getOwnPropertyDescriptors(this));
        copy.tags = this.tags.slice();
        return copy;
      }
    };
    exports.Schema = Schema;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/stringify/stringifyDocument.js
var require_stringifyDocument = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/stringify/stringifyDocument.js"(exports) {
    "use strict";
    var identity = require_identity();
    var stringify = require_stringify();
    var stringifyComment = require_stringifyComment();
    function stringifyDocument(doc, options) {
      const lines = [];
      let hasDirectives = options.directives === true;
      if (options.directives !== false && doc.directives) {
        const dir = doc.directives.toString(doc);
        if (dir) {
          lines.push(dir);
          hasDirectives = true;
        } else if (doc.directives.docStart)
          hasDirectives = true;
      }
      if (hasDirectives)
        lines.push("---");
      const ctx = stringify.createStringifyContext(doc, options);
      const { commentString } = ctx.options;
      if (doc.commentBefore) {
        if (lines.length !== 1)
          lines.unshift("");
        const cs = commentString(doc.commentBefore);
        lines.unshift(stringifyComment.indentComment(cs, ""));
      }
      let chompKeep = false;
      let contentComment = null;
      if (doc.contents) {
        if (identity.isNode(doc.contents)) {
          if (doc.contents.spaceBefore && hasDirectives)
            lines.push("");
          if (doc.contents.commentBefore) {
            const cs = commentString(doc.contents.commentBefore);
            lines.push(stringifyComment.indentComment(cs, ""));
          }
          ctx.forceBlockIndent = !!doc.comment;
          contentComment = doc.contents.comment;
        }
        const onChompKeep = contentComment ? void 0 : () => chompKeep = true;
        let body = stringify.stringify(doc.contents, ctx, () => contentComment = null, onChompKeep);
        if (contentComment)
          body += stringifyComment.lineComment(body, "", commentString(contentComment));
        if ((body[0] === "|" || body[0] === ">") && lines[lines.length - 1] === "---") {
          lines[lines.length - 1] = `--- ${body}`;
        } else
          lines.push(body);
      } else {
        lines.push(stringify.stringify(doc.contents, ctx));
      }
      if (doc.directives?.docEnd) {
        if (doc.comment) {
          const cs = commentString(doc.comment);
          if (cs.includes("\n")) {
            lines.push("...");
            lines.push(stringifyComment.indentComment(cs, ""));
          } else {
            lines.push(`... ${cs}`);
          }
        } else {
          lines.push("...");
        }
      } else {
        let dc = doc.comment;
        if (dc && chompKeep)
          dc = dc.replace(/^\n+/, "");
        if (dc) {
          if ((!chompKeep || contentComment) && lines[lines.length - 1] !== "")
            lines.push("");
          lines.push(stringifyComment.indentComment(commentString(dc), ""));
        }
      }
      return lines.join("\n") + "\n";
    }
    exports.stringifyDocument = stringifyDocument;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/doc/Document.js
var require_Document = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/doc/Document.js"(exports) {
    "use strict";
    var Alias = require_Alias();
    var Collection = require_Collection();
    var identity = require_identity();
    var Pair = require_Pair();
    var toJS = require_toJS();
    var Schema = require_Schema();
    var stringifyDocument = require_stringifyDocument();
    var anchors = require_anchors();
    var applyReviver = require_applyReviver();
    var createNode = require_createNode();
    var directives = require_directives();
    var Document = class _Document {
      constructor(value, replacer, options) {
        this.commentBefore = null;
        this.comment = null;
        this.errors = [];
        this.warnings = [];
        Object.defineProperty(this, identity.NODE_TYPE, { value: identity.DOC });
        let _replacer = null;
        if (typeof replacer === "function" || Array.isArray(replacer)) {
          _replacer = replacer;
        } else if (options === void 0 && replacer) {
          options = replacer;
          replacer = void 0;
        }
        const opt = Object.assign({
          intAsBigInt: false,
          keepSourceTokens: false,
          logLevel: "warn",
          prettyErrors: true,
          strict: true,
          stringKeys: false,
          uniqueKeys: true,
          version: "1.2"
        }, options);
        this.options = opt;
        let { version } = opt;
        if (options?._directives) {
          this.directives = options._directives.atDocument();
          if (this.directives.yaml.explicit)
            version = this.directives.yaml.version;
        } else
          this.directives = new directives.Directives({ version });
        this.setSchema(version, options);
        this.contents = value === void 0 ? null : this.createNode(value, _replacer, options);
      }
      /**
       * Create a deep copy of this Document and its contents.
       *
       * Custom Node values that inherit from `Object` still refer to their original instances.
       */
      clone() {
        const copy = Object.create(_Document.prototype, {
          [identity.NODE_TYPE]: { value: identity.DOC }
        });
        copy.commentBefore = this.commentBefore;
        copy.comment = this.comment;
        copy.errors = this.errors.slice();
        copy.warnings = this.warnings.slice();
        copy.options = Object.assign({}, this.options);
        if (this.directives)
          copy.directives = this.directives.clone();
        copy.schema = this.schema.clone();
        copy.contents = identity.isNode(this.contents) ? this.contents.clone(copy.schema) : this.contents;
        if (this.range)
          copy.range = this.range.slice();
        return copy;
      }
      /** Adds a value to the document. */
      add(value) {
        if (assertCollection(this.contents))
          this.contents.add(value);
      }
      /** Adds a value to the document. */
      addIn(path, value) {
        if (assertCollection(this.contents))
          this.contents.addIn(path, value);
      }
      /**
       * Create a new `Alias` node, ensuring that the target `node` has the required anchor.
       *
       * If `node` already has an anchor, `name` is ignored.
       * Otherwise, the `node.anchor` value will be set to `name`,
       * or if an anchor with that name is already present in the document,
       * `name` will be used as a prefix for a new unique anchor.
       * If `name` is undefined, the generated anchor will use 'a' as a prefix.
       */
      createAlias(node, name) {
        if (!node.anchor) {
          const prev = anchors.anchorNames(this);
          node.anchor = // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          !name || prev.has(name) ? anchors.findNewAnchor(name || "a", prev) : name;
        }
        return new Alias.Alias(node.anchor);
      }
      createNode(value, replacer, options) {
        let _replacer = void 0;
        if (typeof replacer === "function") {
          value = replacer.call({ "": value }, "", value);
          _replacer = replacer;
        } else if (Array.isArray(replacer)) {
          const keyToStr = (v) => typeof v === "number" || v instanceof String || v instanceof Number;
          const asStr = replacer.filter(keyToStr).map(String);
          if (asStr.length > 0)
            replacer = replacer.concat(asStr);
          _replacer = replacer;
        } else if (options === void 0 && replacer) {
          options = replacer;
          replacer = void 0;
        }
        const { aliasDuplicateObjects, anchorPrefix, flow, keepUndefined, onTagObj, tag } = options ?? {};
        const { onAnchor, setAnchors, sourceObjects } = anchors.createNodeAnchors(
          this,
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          anchorPrefix || "a"
        );
        const ctx = {
          aliasDuplicateObjects: aliasDuplicateObjects ?? true,
          keepUndefined: keepUndefined ?? false,
          onAnchor,
          onTagObj,
          replacer: _replacer,
          schema: this.schema,
          sourceObjects
        };
        const node = createNode.createNode(value, tag, ctx);
        if (flow && identity.isCollection(node))
          node.flow = true;
        setAnchors();
        return node;
      }
      /**
       * Convert a key and a value into a `Pair` using the current schema,
       * recursively wrapping all values as `Scalar` or `Collection` nodes.
       */
      createPair(key, value, options = {}) {
        const k = this.createNode(key, null, options);
        const v = this.createNode(value, null, options);
        return new Pair.Pair(k, v);
      }
      /**
       * Removes a value from the document.
       * @returns `true` if the item was found and removed.
       */
      delete(key) {
        return assertCollection(this.contents) ? this.contents.delete(key) : false;
      }
      /**
       * Removes a value from the document.
       * @returns `true` if the item was found and removed.
       */
      deleteIn(path) {
        if (Collection.isEmptyPath(path)) {
          if (this.contents == null)
            return false;
          this.contents = null;
          return true;
        }
        return assertCollection(this.contents) ? this.contents.deleteIn(path) : false;
      }
      /**
       * Returns item at `key`, or `undefined` if not found. By default unwraps
       * scalar values from their surrounding node; to disable set `keepScalar` to
       * `true` (collections are always returned intact).
       */
      get(key, keepScalar) {
        return identity.isCollection(this.contents) ? this.contents.get(key, keepScalar) : void 0;
      }
      /**
       * Returns item at `path`, or `undefined` if not found. By default unwraps
       * scalar values from their surrounding node; to disable set `keepScalar` to
       * `true` (collections are always returned intact).
       */
      getIn(path, keepScalar) {
        if (Collection.isEmptyPath(path))
          return !keepScalar && identity.isScalar(this.contents) ? this.contents.value : this.contents;
        return identity.isCollection(this.contents) ? this.contents.getIn(path, keepScalar) : void 0;
      }
      /**
       * Checks if the document includes a value with the key `key`.
       */
      has(key) {
        return identity.isCollection(this.contents) ? this.contents.has(key) : false;
      }
      /**
       * Checks if the document includes a value at `path`.
       */
      hasIn(path) {
        if (Collection.isEmptyPath(path))
          return this.contents !== void 0;
        return identity.isCollection(this.contents) ? this.contents.hasIn(path) : false;
      }
      /**
       * Sets a value in this document. For `!!set`, `value` needs to be a
       * boolean to add/remove the item from the set.
       */
      set(key, value) {
        if (this.contents == null) {
          this.contents = Collection.collectionFromPath(this.schema, [key], value);
        } else if (assertCollection(this.contents)) {
          this.contents.set(key, value);
        }
      }
      /**
       * Sets a value in this document. For `!!set`, `value` needs to be a
       * boolean to add/remove the item from the set.
       */
      setIn(path, value) {
        if (Collection.isEmptyPath(path)) {
          this.contents = value;
        } else if (this.contents == null) {
          this.contents = Collection.collectionFromPath(this.schema, Array.from(path), value);
        } else if (assertCollection(this.contents)) {
          this.contents.setIn(path, value);
        }
      }
      /**
       * Change the YAML version and schema used by the document.
       * A `null` version disables support for directives, explicit tags, anchors, and aliases.
       * It also requires the `schema` option to be given as a `Schema` instance value.
       *
       * Overrides all previously set schema options.
       */
      setSchema(version, options = {}) {
        if (typeof version === "number")
          version = String(version);
        let opt;
        switch (version) {
          case "1.1":
            if (this.directives)
              this.directives.yaml.version = "1.1";
            else
              this.directives = new directives.Directives({ version: "1.1" });
            opt = { resolveKnownTags: false, schema: "yaml-1.1" };
            break;
          case "1.2":
          case "next":
            if (this.directives)
              this.directives.yaml.version = version;
            else
              this.directives = new directives.Directives({ version });
            opt = { resolveKnownTags: true, schema: "core" };
            break;
          case null:
            if (this.directives)
              delete this.directives;
            opt = null;
            break;
          default: {
            const sv = JSON.stringify(version);
            throw new Error(`Expected '1.1', '1.2' or null as first argument, but found: ${sv}`);
          }
        }
        if (options.schema instanceof Object)
          this.schema = options.schema;
        else if (opt)
          this.schema = new Schema.Schema(Object.assign(opt, options));
        else
          throw new Error(`With a null YAML version, the { schema: Schema } option is required`);
      }
      // json & jsonArg are only used from toJSON()
      toJS({ json, jsonArg, mapAsMap, maxAliasCount, onAnchor, reviver } = {}) {
        const ctx = {
          anchors: /* @__PURE__ */ new Map(),
          doc: this,
          keep: !json,
          mapAsMap: mapAsMap === true,
          mapKeyWarned: false,
          maxAliasCount: typeof maxAliasCount === "number" ? maxAliasCount : 100
        };
        const res = toJS.toJS(this.contents, jsonArg ?? "", ctx);
        if (typeof onAnchor === "function")
          for (const { count, res: res2 } of ctx.anchors.values())
            onAnchor(res2, count);
        return typeof reviver === "function" ? applyReviver.applyReviver(reviver, { "": res }, "", res) : res;
      }
      /**
       * A JSON representation of the document `contents`.
       *
       * @param jsonArg Used by `JSON.stringify` to indicate the array index or
       *   property name.
       */
      toJSON(jsonArg, onAnchor) {
        return this.toJS({ json: true, jsonArg, mapAsMap: false, onAnchor });
      }
      /** A YAML representation of the document. */
      toString(options = {}) {
        if (this.errors.length > 0)
          throw new Error("Document with errors cannot be stringified");
        if ("indent" in options && (!Number.isInteger(options.indent) || Number(options.indent) <= 0)) {
          const s = JSON.stringify(options.indent);
          throw new Error(`"indent" option must be a positive integer, not ${s}`);
        }
        return stringifyDocument.stringifyDocument(this, options);
      }
    };
    function assertCollection(contents) {
      if (identity.isCollection(contents))
        return true;
      throw new Error("Expected a YAML collection as document contents");
    }
    exports.Document = Document;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/errors.js
var require_errors = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/errors.js"(exports) {
    "use strict";
    var YAMLError = class extends Error {
      constructor(name, pos, code, message) {
        super();
        this.name = name;
        this.code = code;
        this.message = message;
        this.pos = pos;
      }
    };
    var YAMLParseError = class extends YAMLError {
      constructor(pos, code, message) {
        super("YAMLParseError", pos, code, message);
      }
    };
    var YAMLWarning = class extends YAMLError {
      constructor(pos, code, message) {
        super("YAMLWarning", pos, code, message);
      }
    };
    var prettifyError = (src, lc) => (error) => {
      if (error.pos[0] === -1)
        return;
      error.linePos = error.pos.map((pos) => lc.linePos(pos));
      const { line, col } = error.linePos[0];
      error.message += ` at line ${line}, column ${col}`;
      let ci = col - 1;
      let lineStr = src.substring(lc.lineStarts[line - 1], lc.lineStarts[line]).replace(/[\n\r]+$/, "");
      if (ci >= 60 && lineStr.length > 80) {
        const trimStart = Math.min(ci - 39, lineStr.length - 79);
        lineStr = "\u2026" + lineStr.substring(trimStart);
        ci -= trimStart - 1;
      }
      if (lineStr.length > 80)
        lineStr = lineStr.substring(0, 79) + "\u2026";
      if (line > 1 && /^ *$/.test(lineStr.substring(0, ci))) {
        let prev = src.substring(lc.lineStarts[line - 2], lc.lineStarts[line - 1]);
        if (prev.length > 80)
          prev = prev.substring(0, 79) + "\u2026\n";
        lineStr = prev + lineStr;
      }
      if (/[^ ]/.test(lineStr)) {
        let count = 1;
        const end = error.linePos[1];
        if (end?.line === line && end.col > col) {
          count = Math.max(1, Math.min(end.col - col, 80 - ci));
        }
        const pointer = " ".repeat(ci) + "^".repeat(count);
        error.message += `:

${lineStr}
${pointer}
`;
      }
    };
    exports.YAMLError = YAMLError;
    exports.YAMLParseError = YAMLParseError;
    exports.YAMLWarning = YAMLWarning;
    exports.prettifyError = prettifyError;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/resolve-props.js
var require_resolve_props = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/resolve-props.js"(exports) {
    "use strict";
    function resolveProps(tokens, { flow, indicator, next, offset, onError, parentIndent, startOnNewline }) {
      let spaceBefore = false;
      let atNewline = startOnNewline;
      let hasSpace = startOnNewline;
      let comment = "";
      let commentSep = "";
      let hasNewline = false;
      let reqSpace = false;
      let tab = null;
      let anchor = null;
      let tag = null;
      let newlineAfterProp = null;
      let comma = null;
      let found = null;
      let start = null;
      for (const token of tokens) {
        if (reqSpace) {
          if (token.type !== "space" && token.type !== "newline" && token.type !== "comma")
            onError(token.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space");
          reqSpace = false;
        }
        if (tab) {
          if (atNewline && token.type !== "comment" && token.type !== "newline") {
            onError(tab, "TAB_AS_INDENT", "Tabs are not allowed as indentation");
          }
          tab = null;
        }
        switch (token.type) {
          case "space":
            if (!flow && (indicator !== "doc-start" || next?.type !== "flow-collection") && token.source.includes("	")) {
              tab = token;
            }
            hasSpace = true;
            break;
          case "comment": {
            if (!hasSpace)
              onError(token, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
            const cb = token.source.substring(1) || " ";
            if (!comment)
              comment = cb;
            else
              comment += commentSep + cb;
            commentSep = "";
            atNewline = false;
            break;
          }
          case "newline":
            if (atNewline) {
              if (comment)
                comment += token.source;
              else if (!found || indicator !== "seq-item-ind")
                spaceBefore = true;
            } else
              commentSep += token.source;
            atNewline = true;
            hasNewline = true;
            if (anchor || tag)
              newlineAfterProp = token;
            hasSpace = true;
            break;
          case "anchor":
            if (anchor)
              onError(token, "MULTIPLE_ANCHORS", "A node can have at most one anchor");
            if (token.source.endsWith(":"))
              onError(token.offset + token.source.length - 1, "BAD_ALIAS", "Anchor ending in : is ambiguous", true);
            anchor = token;
            start ?? (start = token.offset);
            atNewline = false;
            hasSpace = false;
            reqSpace = true;
            break;
          case "tag": {
            if (tag)
              onError(token, "MULTIPLE_TAGS", "A node can have at most one tag");
            tag = token;
            start ?? (start = token.offset);
            atNewline = false;
            hasSpace = false;
            reqSpace = true;
            break;
          }
          case indicator:
            if (anchor || tag)
              onError(token, "BAD_PROP_ORDER", `Anchors and tags must be after the ${token.source} indicator`);
            if (found)
              onError(token, "UNEXPECTED_TOKEN", `Unexpected ${token.source} in ${flow ?? "collection"}`);
            found = token;
            atNewline = indicator === "seq-item-ind" || indicator === "explicit-key-ind";
            hasSpace = false;
            break;
          case "comma":
            if (flow) {
              if (comma)
                onError(token, "UNEXPECTED_TOKEN", `Unexpected , in ${flow}`);
              comma = token;
              atNewline = false;
              hasSpace = false;
              break;
            }
          // else fallthrough
          default:
            onError(token, "UNEXPECTED_TOKEN", `Unexpected ${token.type} token`);
            atNewline = false;
            hasSpace = false;
        }
      }
      const last = tokens[tokens.length - 1];
      const end = last ? last.offset + last.source.length : offset;
      if (reqSpace && next && next.type !== "space" && next.type !== "newline" && next.type !== "comma" && (next.type !== "scalar" || next.source !== "")) {
        onError(next.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space");
      }
      if (tab && (atNewline && tab.indent <= parentIndent || next?.type === "block-map" || next?.type === "block-seq"))
        onError(tab, "TAB_AS_INDENT", "Tabs are not allowed as indentation");
      return {
        comma,
        found,
        spaceBefore,
        comment,
        hasNewline,
        anchor,
        tag,
        newlineAfterProp,
        end,
        start: start ?? end
      };
    }
    exports.resolveProps = resolveProps;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/util-contains-newline.js
var require_util_contains_newline = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/util-contains-newline.js"(exports) {
    "use strict";
    function containsNewline(key) {
      if (!key)
        return null;
      switch (key.type) {
        case "alias":
        case "scalar":
        case "double-quoted-scalar":
        case "single-quoted-scalar":
          if (key.source.includes("\n"))
            return true;
          if (key.end) {
            for (const st of key.end)
              if (st.type === "newline")
                return true;
          }
          return false;
        case "flow-collection":
          for (const it of key.items) {
            for (const st of it.start)
              if (st.type === "newline")
                return true;
            if (it.sep) {
              for (const st of it.sep)
                if (st.type === "newline")
                  return true;
            }
            if (containsNewline(it.key) || containsNewline(it.value))
              return true;
          }
          return false;
        default:
          return true;
      }
    }
    exports.containsNewline = containsNewline;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/util-flow-indent-check.js
var require_util_flow_indent_check = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/util-flow-indent-check.js"(exports) {
    "use strict";
    var utilContainsNewline = require_util_contains_newline();
    function flowIndentCheck(indent, fc, onError) {
      if (fc?.type === "flow-collection") {
        const end = fc.end[0];
        if (end.indent === indent && (end.source === "]" || end.source === "}") && utilContainsNewline.containsNewline(fc)) {
          const msg = "Flow end indicator should be more indented than parent";
          onError(end, "BAD_INDENT", msg, true);
        }
      }
    }
    exports.flowIndentCheck = flowIndentCheck;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/util-map-includes.js
var require_util_map_includes = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/util-map-includes.js"(exports) {
    "use strict";
    var identity = require_identity();
    function mapIncludes(ctx, items, search) {
      const { uniqueKeys } = ctx.options;
      if (uniqueKeys === false)
        return false;
      const isEqual = typeof uniqueKeys === "function" ? uniqueKeys : (a, b) => a === b || identity.isScalar(a) && identity.isScalar(b) && a.value === b.value;
      return items.some((pair) => isEqual(pair.key, search));
    }
    exports.mapIncludes = mapIncludes;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/resolve-block-map.js
var require_resolve_block_map = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/resolve-block-map.js"(exports) {
    "use strict";
    var Pair = require_Pair();
    var YAMLMap = require_YAMLMap();
    var resolveProps = require_resolve_props();
    var utilContainsNewline = require_util_contains_newline();
    var utilFlowIndentCheck = require_util_flow_indent_check();
    var utilMapIncludes = require_util_map_includes();
    var startColMsg = "All mapping items must start at the same column";
    function resolveBlockMap({ composeNode, composeEmptyNode }, ctx, bm, onError, tag) {
      const NodeClass = tag?.nodeClass ?? YAMLMap.YAMLMap;
      const map = new NodeClass(ctx.schema);
      if (ctx.atRoot)
        ctx.atRoot = false;
      let offset = bm.offset;
      let commentEnd = null;
      for (const collItem of bm.items) {
        const { start, key, sep, value } = collItem;
        const keyProps = resolveProps.resolveProps(start, {
          indicator: "explicit-key-ind",
          next: key ?? sep?.[0],
          offset,
          onError,
          parentIndent: bm.indent,
          startOnNewline: true
        });
        const implicitKey = !keyProps.found;
        if (implicitKey) {
          if (key) {
            if (key.type === "block-seq")
              onError(offset, "BLOCK_AS_IMPLICIT_KEY", "A block sequence may not be used as an implicit map key");
            else if ("indent" in key && key.indent !== bm.indent)
              onError(offset, "BAD_INDENT", startColMsg);
          }
          if (!keyProps.anchor && !keyProps.tag && !sep) {
            commentEnd = keyProps.end;
            if (keyProps.comment) {
              if (map.comment)
                map.comment += "\n" + keyProps.comment;
              else
                map.comment = keyProps.comment;
            }
            continue;
          }
          if (keyProps.newlineAfterProp || utilContainsNewline.containsNewline(key)) {
            onError(key ?? start[start.length - 1], "MULTILINE_IMPLICIT_KEY", "Implicit keys need to be on a single line");
          }
        } else if (keyProps.found?.indent !== bm.indent) {
          onError(offset, "BAD_INDENT", startColMsg);
        }
        ctx.atKey = true;
        const keyStart = keyProps.end;
        const keyNode = key ? composeNode(ctx, key, keyProps, onError) : composeEmptyNode(ctx, keyStart, start, null, keyProps, onError);
        if (ctx.schema.compat)
          utilFlowIndentCheck.flowIndentCheck(bm.indent, key, onError);
        ctx.atKey = false;
        if (utilMapIncludes.mapIncludes(ctx, map.items, keyNode))
          onError(keyStart, "DUPLICATE_KEY", "Map keys must be unique");
        const valueProps = resolveProps.resolveProps(sep ?? [], {
          indicator: "map-value-ind",
          next: value,
          offset: keyNode.range[2],
          onError,
          parentIndent: bm.indent,
          startOnNewline: !key || key.type === "block-scalar"
        });
        offset = valueProps.end;
        if (valueProps.found) {
          if (implicitKey) {
            if (value?.type === "block-map" && !valueProps.hasNewline)
              onError(offset, "BLOCK_AS_IMPLICIT_KEY", "Nested mappings are not allowed in compact mappings");
            if (ctx.options.strict && keyProps.start < valueProps.found.offset - 1024)
              onError(keyNode.range, "KEY_OVER_1024_CHARS", "The : indicator must be at most 1024 chars after the start of an implicit block mapping key");
          }
          const valueNode = value ? composeNode(ctx, value, valueProps, onError) : composeEmptyNode(ctx, offset, sep, null, valueProps, onError);
          if (ctx.schema.compat)
            utilFlowIndentCheck.flowIndentCheck(bm.indent, value, onError);
          offset = valueNode.range[2];
          const pair = new Pair.Pair(keyNode, valueNode);
          if (ctx.options.keepSourceTokens)
            pair.srcToken = collItem;
          map.items.push(pair);
        } else {
          if (implicitKey)
            onError(keyNode.range, "MISSING_CHAR", "Implicit map keys need to be followed by map values");
          if (valueProps.comment) {
            if (keyNode.comment)
              keyNode.comment += "\n" + valueProps.comment;
            else
              keyNode.comment = valueProps.comment;
          }
          const pair = new Pair.Pair(keyNode);
          if (ctx.options.keepSourceTokens)
            pair.srcToken = collItem;
          map.items.push(pair);
        }
      }
      if (commentEnd && commentEnd < offset)
        onError(commentEnd, "IMPOSSIBLE", "Map comment with trailing content");
      map.range = [bm.offset, offset, commentEnd ?? offset];
      return map;
    }
    exports.resolveBlockMap = resolveBlockMap;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/resolve-block-seq.js
var require_resolve_block_seq = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/resolve-block-seq.js"(exports) {
    "use strict";
    var YAMLSeq = require_YAMLSeq();
    var resolveProps = require_resolve_props();
    var utilFlowIndentCheck = require_util_flow_indent_check();
    function resolveBlockSeq({ composeNode, composeEmptyNode }, ctx, bs, onError, tag) {
      const NodeClass = tag?.nodeClass ?? YAMLSeq.YAMLSeq;
      const seq = new NodeClass(ctx.schema);
      if (ctx.atRoot)
        ctx.atRoot = false;
      if (ctx.atKey)
        ctx.atKey = false;
      let offset = bs.offset;
      let commentEnd = null;
      for (const { start, value } of bs.items) {
        const props = resolveProps.resolveProps(start, {
          indicator: "seq-item-ind",
          next: value,
          offset,
          onError,
          parentIndent: bs.indent,
          startOnNewline: true
        });
        if (!props.found) {
          if (props.anchor || props.tag || value) {
            if (value?.type === "block-seq")
              onError(props.end, "BAD_INDENT", "All sequence items must start at the same column");
            else
              onError(offset, "MISSING_CHAR", "Sequence item without - indicator");
          } else {
            commentEnd = props.end;
            if (props.comment)
              seq.comment = props.comment;
            continue;
          }
        }
        const node = value ? composeNode(ctx, value, props, onError) : composeEmptyNode(ctx, props.end, start, null, props, onError);
        if (ctx.schema.compat)
          utilFlowIndentCheck.flowIndentCheck(bs.indent, value, onError);
        offset = node.range[2];
        seq.items.push(node);
      }
      seq.range = [bs.offset, offset, commentEnd ?? offset];
      return seq;
    }
    exports.resolveBlockSeq = resolveBlockSeq;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/resolve-end.js
var require_resolve_end = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/resolve-end.js"(exports) {
    "use strict";
    function resolveEnd(end, offset, reqSpace, onError) {
      let comment = "";
      if (end) {
        let hasSpace = false;
        let sep = "";
        for (const token of end) {
          const { source, type } = token;
          switch (type) {
            case "space":
              hasSpace = true;
              break;
            case "comment": {
              if (reqSpace && !hasSpace)
                onError(token, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
              const cb = source.substring(1) || " ";
              if (!comment)
                comment = cb;
              else
                comment += sep + cb;
              sep = "";
              break;
            }
            case "newline":
              if (comment)
                sep += source;
              hasSpace = true;
              break;
            default:
              onError(token, "UNEXPECTED_TOKEN", `Unexpected ${type} at node end`);
          }
          offset += source.length;
        }
      }
      return { comment, offset };
    }
    exports.resolveEnd = resolveEnd;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/resolve-flow-collection.js
var require_resolve_flow_collection = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/resolve-flow-collection.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Pair = require_Pair();
    var YAMLMap = require_YAMLMap();
    var YAMLSeq = require_YAMLSeq();
    var resolveEnd = require_resolve_end();
    var resolveProps = require_resolve_props();
    var utilContainsNewline = require_util_contains_newline();
    var utilMapIncludes = require_util_map_includes();
    var blockMsg = "Block collections are not allowed within flow collections";
    var isBlock = (token) => token && (token.type === "block-map" || token.type === "block-seq");
    function resolveFlowCollection({ composeNode, composeEmptyNode }, ctx, fc, onError, tag) {
      const isMap = fc.start.source === "{";
      const fcName = isMap ? "flow map" : "flow sequence";
      const NodeClass = tag?.nodeClass ?? (isMap ? YAMLMap.YAMLMap : YAMLSeq.YAMLSeq);
      const coll = new NodeClass(ctx.schema);
      coll.flow = true;
      const atRoot = ctx.atRoot;
      if (atRoot)
        ctx.atRoot = false;
      if (ctx.atKey)
        ctx.atKey = false;
      let offset = fc.offset + fc.start.source.length;
      for (let i = 0; i < fc.items.length; ++i) {
        const collItem = fc.items[i];
        const { start, key, sep, value } = collItem;
        const props = resolveProps.resolveProps(start, {
          flow: fcName,
          indicator: "explicit-key-ind",
          next: key ?? sep?.[0],
          offset,
          onError,
          parentIndent: fc.indent,
          startOnNewline: false
        });
        if (!props.found) {
          if (!props.anchor && !props.tag && !sep && !value) {
            if (i === 0 && props.comma)
              onError(props.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${fcName}`);
            else if (i < fc.items.length - 1)
              onError(props.start, "UNEXPECTED_TOKEN", `Unexpected empty item in ${fcName}`);
            if (props.comment) {
              if (coll.comment)
                coll.comment += "\n" + props.comment;
              else
                coll.comment = props.comment;
            }
            offset = props.end;
            continue;
          }
          if (!isMap && ctx.options.strict && utilContainsNewline.containsNewline(key))
            onError(
              key,
              // checked by containsNewline()
              "MULTILINE_IMPLICIT_KEY",
              "Implicit keys of flow sequence pairs need to be on a single line"
            );
        }
        if (i === 0) {
          if (props.comma)
            onError(props.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${fcName}`);
        } else {
          if (!props.comma)
            onError(props.start, "MISSING_CHAR", `Missing , between ${fcName} items`);
          if (props.comment) {
            let prevItemComment = "";
            loop: for (const st of start) {
              switch (st.type) {
                case "comma":
                case "space":
                  break;
                case "comment":
                  prevItemComment = st.source.substring(1);
                  break loop;
                default:
                  break loop;
              }
            }
            if (prevItemComment) {
              let prev = coll.items[coll.items.length - 1];
              if (identity.isPair(prev))
                prev = prev.value ?? prev.key;
              if (prev.comment)
                prev.comment += "\n" + prevItemComment;
              else
                prev.comment = prevItemComment;
              props.comment = props.comment.substring(prevItemComment.length + 1);
            }
          }
        }
        if (!isMap && !sep && !props.found) {
          const valueNode = value ? composeNode(ctx, value, props, onError) : composeEmptyNode(ctx, props.end, sep, null, props, onError);
          coll.items.push(valueNode);
          offset = valueNode.range[2];
          if (isBlock(value))
            onError(valueNode.range, "BLOCK_IN_FLOW", blockMsg);
        } else {
          ctx.atKey = true;
          const keyStart = props.end;
          const keyNode = key ? composeNode(ctx, key, props, onError) : composeEmptyNode(ctx, keyStart, start, null, props, onError);
          if (isBlock(key))
            onError(keyNode.range, "BLOCK_IN_FLOW", blockMsg);
          ctx.atKey = false;
          const valueProps = resolveProps.resolveProps(sep ?? [], {
            flow: fcName,
            indicator: "map-value-ind",
            next: value,
            offset: keyNode.range[2],
            onError,
            parentIndent: fc.indent,
            startOnNewline: false
          });
          if (valueProps.found) {
            if (!isMap && !props.found && ctx.options.strict) {
              if (sep)
                for (const st of sep) {
                  if (st === valueProps.found)
                    break;
                  if (st.type === "newline") {
                    onError(st, "MULTILINE_IMPLICIT_KEY", "Implicit keys of flow sequence pairs need to be on a single line");
                    break;
                  }
                }
              if (props.start < valueProps.found.offset - 1024)
                onError(valueProps.found, "KEY_OVER_1024_CHARS", "The : indicator must be at most 1024 chars after the start of an implicit flow sequence key");
            }
          } else if (value) {
            if ("source" in value && value.source?.[0] === ":")
              onError(value, "MISSING_CHAR", `Missing space after : in ${fcName}`);
            else
              onError(valueProps.start, "MISSING_CHAR", `Missing , or : between ${fcName} items`);
          }
          const valueNode = value ? composeNode(ctx, value, valueProps, onError) : valueProps.found ? composeEmptyNode(ctx, valueProps.end, sep, null, valueProps, onError) : null;
          if (valueNode) {
            if (isBlock(value))
              onError(valueNode.range, "BLOCK_IN_FLOW", blockMsg);
          } else if (valueProps.comment) {
            if (keyNode.comment)
              keyNode.comment += "\n" + valueProps.comment;
            else
              keyNode.comment = valueProps.comment;
          }
          const pair = new Pair.Pair(keyNode, valueNode);
          if (ctx.options.keepSourceTokens)
            pair.srcToken = collItem;
          if (isMap) {
            const map = coll;
            if (utilMapIncludes.mapIncludes(ctx, map.items, keyNode))
              onError(keyStart, "DUPLICATE_KEY", "Map keys must be unique");
            map.items.push(pair);
          } else {
            const map = new YAMLMap.YAMLMap(ctx.schema);
            map.flow = true;
            map.items.push(pair);
            const endRange = (valueNode ?? keyNode).range;
            map.range = [keyNode.range[0], endRange[1], endRange[2]];
            coll.items.push(map);
          }
          offset = valueNode ? valueNode.range[2] : valueProps.end;
        }
      }
      const expectedEnd = isMap ? "}" : "]";
      const [ce, ...ee] = fc.end;
      let cePos = offset;
      if (ce?.source === expectedEnd)
        cePos = ce.offset + ce.source.length;
      else {
        const name = fcName[0].toUpperCase() + fcName.substring(1);
        const msg = atRoot ? `${name} must end with a ${expectedEnd}` : `${name} in block collection must be sufficiently indented and end with a ${expectedEnd}`;
        onError(offset, atRoot ? "MISSING_CHAR" : "BAD_INDENT", msg);
        if (ce && ce.source.length !== 1)
          ee.unshift(ce);
      }
      if (ee.length > 0) {
        const end = resolveEnd.resolveEnd(ee, cePos, ctx.options.strict, onError);
        if (end.comment) {
          if (coll.comment)
            coll.comment += "\n" + end.comment;
          else
            coll.comment = end.comment;
        }
        coll.range = [fc.offset, cePos, end.offset];
      } else {
        coll.range = [fc.offset, cePos, cePos];
      }
      return coll;
    }
    exports.resolveFlowCollection = resolveFlowCollection;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/compose-collection.js
var require_compose_collection = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/compose-collection.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Scalar = require_Scalar();
    var YAMLMap = require_YAMLMap();
    var YAMLSeq = require_YAMLSeq();
    var resolveBlockMap = require_resolve_block_map();
    var resolveBlockSeq = require_resolve_block_seq();
    var resolveFlowCollection = require_resolve_flow_collection();
    function resolveCollection(CN, ctx, token, onError, tagName, tag) {
      const coll = token.type === "block-map" ? resolveBlockMap.resolveBlockMap(CN, ctx, token, onError, tag) : token.type === "block-seq" ? resolveBlockSeq.resolveBlockSeq(CN, ctx, token, onError, tag) : resolveFlowCollection.resolveFlowCollection(CN, ctx, token, onError, tag);
      const Coll = coll.constructor;
      if (tagName === "!" || tagName === Coll.tagName) {
        coll.tag = Coll.tagName;
        return coll;
      }
      if (tagName)
        coll.tag = tagName;
      return coll;
    }
    function composeCollection(CN, ctx, token, props, onError) {
      const tagToken = props.tag;
      const tagName = !tagToken ? null : ctx.directives.tagName(tagToken.source, (msg) => onError(tagToken, "TAG_RESOLVE_FAILED", msg));
      if (token.type === "block-seq") {
        const { anchor, newlineAfterProp: nl } = props;
        const lastProp = anchor && tagToken ? anchor.offset > tagToken.offset ? anchor : tagToken : anchor ?? tagToken;
        if (lastProp && (!nl || nl.offset < lastProp.offset)) {
          const message = "Missing newline after block sequence props";
          onError(lastProp, "MISSING_CHAR", message);
        }
      }
      const expType = token.type === "block-map" ? "map" : token.type === "block-seq" ? "seq" : token.start.source === "{" ? "map" : "seq";
      if (!tagToken || !tagName || tagName === "!" || tagName === YAMLMap.YAMLMap.tagName && expType === "map" || tagName === YAMLSeq.YAMLSeq.tagName && expType === "seq") {
        return resolveCollection(CN, ctx, token, onError, tagName);
      }
      let tag = ctx.schema.tags.find((t) => t.tag === tagName && t.collection === expType);
      if (!tag) {
        const kt = ctx.schema.knownTags[tagName];
        if (kt?.collection === expType) {
          ctx.schema.tags.push(Object.assign({}, kt, { default: false }));
          tag = kt;
        } else {
          if (kt) {
            onError(tagToken, "BAD_COLLECTION_TYPE", `${kt.tag} used for ${expType} collection, but expects ${kt.collection ?? "scalar"}`, true);
          } else {
            onError(tagToken, "TAG_RESOLVE_FAILED", `Unresolved tag: ${tagName}`, true);
          }
          return resolveCollection(CN, ctx, token, onError, tagName);
        }
      }
      const coll = resolveCollection(CN, ctx, token, onError, tagName, tag);
      const res = tag.resolve?.(coll, (msg) => onError(tagToken, "TAG_RESOLVE_FAILED", msg), ctx.options) ?? coll;
      const node = identity.isNode(res) ? res : new Scalar.Scalar(res);
      node.range = coll.range;
      node.tag = tagName;
      if (tag?.format)
        node.format = tag.format;
      return node;
    }
    exports.composeCollection = composeCollection;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/resolve-block-scalar.js
var require_resolve_block_scalar = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/resolve-block-scalar.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    function resolveBlockScalar(ctx, scalar, onError) {
      const start = scalar.offset;
      const header = parseBlockScalarHeader(scalar, ctx.options.strict, onError);
      if (!header)
        return { value: "", type: null, comment: "", range: [start, start, start] };
      const type = header.mode === ">" ? Scalar.Scalar.BLOCK_FOLDED : Scalar.Scalar.BLOCK_LITERAL;
      const lines = scalar.source ? splitLines(scalar.source) : [];
      let chompStart = lines.length;
      for (let i = lines.length - 1; i >= 0; --i) {
        const content = lines[i][1];
        if (content === "" || content === "\r")
          chompStart = i;
        else
          break;
      }
      if (chompStart === 0) {
        const value2 = header.chomp === "+" && lines.length > 0 ? "\n".repeat(Math.max(1, lines.length - 1)) : "";
        let end2 = start + header.length;
        if (scalar.source)
          end2 += scalar.source.length;
        return { value: value2, type, comment: header.comment, range: [start, end2, end2] };
      }
      let trimIndent = scalar.indent + header.indent;
      let offset = scalar.offset + header.length;
      let contentStart = 0;
      for (let i = 0; i < chompStart; ++i) {
        const [indent, content] = lines[i];
        if (content === "" || content === "\r") {
          if (header.indent === 0 && indent.length > trimIndent)
            trimIndent = indent.length;
        } else {
          if (indent.length < trimIndent) {
            const message = "Block scalars with more-indented leading empty lines must use an explicit indentation indicator";
            onError(offset + indent.length, "MISSING_CHAR", message);
          }
          if (header.indent === 0)
            trimIndent = indent.length;
          contentStart = i;
          if (trimIndent === 0 && !ctx.atRoot) {
            const message = "Block scalar values in collections must be indented";
            onError(offset, "BAD_INDENT", message);
          }
          break;
        }
        offset += indent.length + content.length + 1;
      }
      for (let i = lines.length - 1; i >= chompStart; --i) {
        if (lines[i][0].length > trimIndent)
          chompStart = i + 1;
      }
      let value = "";
      let sep = "";
      let prevMoreIndented = false;
      for (let i = 0; i < contentStart; ++i)
        value += lines[i][0].slice(trimIndent) + "\n";
      for (let i = contentStart; i < chompStart; ++i) {
        let [indent, content] = lines[i];
        offset += indent.length + content.length + 1;
        const crlf = content[content.length - 1] === "\r";
        if (crlf)
          content = content.slice(0, -1);
        if (content && indent.length < trimIndent) {
          const src = header.indent ? "explicit indentation indicator" : "first line";
          const message = `Block scalar lines must not be less indented than their ${src}`;
          onError(offset - content.length - (crlf ? 2 : 1), "BAD_INDENT", message);
          indent = "";
        }
        if (type === Scalar.Scalar.BLOCK_LITERAL) {
          value += sep + indent.slice(trimIndent) + content;
          sep = "\n";
        } else if (indent.length > trimIndent || content[0] === "	") {
          if (sep === " ")
            sep = "\n";
          else if (!prevMoreIndented && sep === "\n")
            sep = "\n\n";
          value += sep + indent.slice(trimIndent) + content;
          sep = "\n";
          prevMoreIndented = true;
        } else if (content === "") {
          if (sep === "\n")
            value += "\n";
          else
            sep = "\n";
        } else {
          value += sep + content;
          sep = " ";
          prevMoreIndented = false;
        }
      }
      switch (header.chomp) {
        case "-":
          break;
        case "+":
          for (let i = chompStart; i < lines.length; ++i)
            value += "\n" + lines[i][0].slice(trimIndent);
          if (value[value.length - 1] !== "\n")
            value += "\n";
          break;
        default:
          value += "\n";
      }
      const end = start + header.length + scalar.source.length;
      return { value, type, comment: header.comment, range: [start, end, end] };
    }
    function parseBlockScalarHeader({ offset, props }, strict, onError) {
      if (props[0].type !== "block-scalar-header") {
        onError(props[0], "IMPOSSIBLE", "Block scalar header not found");
        return null;
      }
      const { source } = props[0];
      const mode = source[0];
      let indent = 0;
      let chomp = "";
      let error = -1;
      for (let i = 1; i < source.length; ++i) {
        const ch = source[i];
        if (!chomp && (ch === "-" || ch === "+"))
          chomp = ch;
        else {
          const n = Number(ch);
          if (!indent && n)
            indent = n;
          else if (error === -1)
            error = offset + i;
        }
      }
      if (error !== -1)
        onError(error, "UNEXPECTED_TOKEN", `Block scalar header includes extra characters: ${source}`);
      let hasSpace = false;
      let comment = "";
      let length = source.length;
      for (let i = 1; i < props.length; ++i) {
        const token = props[i];
        switch (token.type) {
          case "space":
            hasSpace = true;
          // fallthrough
          case "newline":
            length += token.source.length;
            break;
          case "comment":
            if (strict && !hasSpace) {
              const message = "Comments must be separated from other tokens by white space characters";
              onError(token, "MISSING_CHAR", message);
            }
            length += token.source.length;
            comment = token.source.substring(1);
            break;
          case "error":
            onError(token, "UNEXPECTED_TOKEN", token.message);
            length += token.source.length;
            break;
          /* istanbul ignore next should not happen */
          default: {
            const message = `Unexpected token in block scalar header: ${token.type}`;
            onError(token, "UNEXPECTED_TOKEN", message);
            const ts = token.source;
            if (ts && typeof ts === "string")
              length += ts.length;
          }
        }
      }
      return { mode, indent, chomp, comment, length };
    }
    function splitLines(source) {
      const split = source.split(/\n( *)/);
      const first = split[0];
      const m = first.match(/^( *)/);
      const line0 = m?.[1] ? [m[1], first.slice(m[1].length)] : ["", first];
      const lines = [line0];
      for (let i = 1; i < split.length; i += 2)
        lines.push([split[i], split[i + 1]]);
      return lines;
    }
    exports.resolveBlockScalar = resolveBlockScalar;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/resolve-flow-scalar.js
var require_resolve_flow_scalar = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/resolve-flow-scalar.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    var resolveEnd = require_resolve_end();
    function resolveFlowScalar(scalar, strict, onError) {
      const { offset, type, source, end } = scalar;
      let _type;
      let value;
      const _onError = (rel, code, msg) => onError(offset + rel, code, msg);
      switch (type) {
        case "scalar":
          _type = Scalar.Scalar.PLAIN;
          value = plainValue(source, _onError);
          break;
        case "single-quoted-scalar":
          _type = Scalar.Scalar.QUOTE_SINGLE;
          value = singleQuotedValue(source, _onError);
          break;
        case "double-quoted-scalar":
          _type = Scalar.Scalar.QUOTE_DOUBLE;
          value = doubleQuotedValue(source, _onError);
          break;
        /* istanbul ignore next should not happen */
        default:
          onError(scalar, "UNEXPECTED_TOKEN", `Expected a flow scalar value, but found: ${type}`);
          return {
            value: "",
            type: null,
            comment: "",
            range: [offset, offset + source.length, offset + source.length]
          };
      }
      const valueEnd = offset + source.length;
      const re = resolveEnd.resolveEnd(end, valueEnd, strict, onError);
      return {
        value,
        type: _type,
        comment: re.comment,
        range: [offset, valueEnd, re.offset]
      };
    }
    function plainValue(source, onError) {
      let badChar = "";
      switch (source[0]) {
        /* istanbul ignore next should not happen */
        case "	":
          badChar = "a tab character";
          break;
        case ",":
          badChar = "flow indicator character ,";
          break;
        case "%":
          badChar = "directive indicator character %";
          break;
        case "|":
        case ">": {
          badChar = `block scalar indicator ${source[0]}`;
          break;
        }
        case "@":
        case "`": {
          badChar = `reserved character ${source[0]}`;
          break;
        }
      }
      if (badChar)
        onError(0, "BAD_SCALAR_START", `Plain value cannot start with ${badChar}`);
      return foldLines(source);
    }
    function singleQuotedValue(source, onError) {
      if (source[source.length - 1] !== "'" || source.length === 1)
        onError(source.length, "MISSING_CHAR", "Missing closing 'quote");
      return foldLines(source.slice(1, -1)).replace(/''/g, "'");
    }
    function foldLines(source) {
      let first, line;
      try {
        first = new RegExp("(.*?)(?<![ 	])[ 	]*\r?\n", "sy");
        line = new RegExp("[ 	]*(.*?)(?:(?<![ 	])[ 	]*)?\r?\n", "sy");
      } catch {
        first = /(.*?)[ \t]*\r?\n/sy;
        line = /[ \t]*(.*?)[ \t]*\r?\n/sy;
      }
      let match = first.exec(source);
      if (!match)
        return source;
      let res = match[1];
      let sep = " ";
      let pos = first.lastIndex;
      line.lastIndex = pos;
      while (match = line.exec(source)) {
        if (match[1] === "") {
          if (sep === "\n")
            res += sep;
          else
            sep = "\n";
        } else {
          res += sep + match[1];
          sep = " ";
        }
        pos = line.lastIndex;
      }
      const last = /[ \t]*(.*)/sy;
      last.lastIndex = pos;
      match = last.exec(source);
      return res + sep + (match?.[1] ?? "");
    }
    function doubleQuotedValue(source, onError) {
      let res = "";
      for (let i = 1; i < source.length - 1; ++i) {
        const ch = source[i];
        if (ch === "\r" && source[i + 1] === "\n")
          continue;
        if (ch === "\n") {
          const { fold, offset } = foldNewline(source, i);
          res += fold;
          i = offset;
        } else if (ch === "\\") {
          let next = source[++i];
          const cc = escapeCodes[next];
          if (cc)
            res += cc;
          else if (next === "\n") {
            next = source[i + 1];
            while (next === " " || next === "	")
              next = source[++i + 1];
          } else if (next === "\r" && source[i + 1] === "\n") {
            next = source[++i + 1];
            while (next === " " || next === "	")
              next = source[++i + 1];
          } else if (next === "x" || next === "u" || next === "U") {
            const length = next === "x" ? 2 : next === "u" ? 4 : 8;
            res += parseCharCode(source, i + 1, length, onError);
            i += length;
          } else {
            const raw = source.substr(i - 1, 2);
            onError(i - 1, "BAD_DQ_ESCAPE", `Invalid escape sequence ${raw}`);
            res += raw;
          }
        } else if (ch === " " || ch === "	") {
          const wsStart = i;
          let next = source[i + 1];
          while (next === " " || next === "	")
            next = source[++i + 1];
          if (next !== "\n" && !(next === "\r" && source[i + 2] === "\n"))
            res += i > wsStart ? source.slice(wsStart, i + 1) : ch;
        } else {
          res += ch;
        }
      }
      if (source[source.length - 1] !== '"' || source.length === 1)
        onError(source.length, "MISSING_CHAR", 'Missing closing "quote');
      return res;
    }
    function foldNewline(source, offset) {
      let fold = "";
      let ch = source[offset + 1];
      while (ch === " " || ch === "	" || ch === "\n" || ch === "\r") {
        if (ch === "\r" && source[offset + 2] !== "\n")
          break;
        if (ch === "\n")
          fold += "\n";
        offset += 1;
        ch = source[offset + 1];
      }
      if (!fold)
        fold = " ";
      return { fold, offset };
    }
    var escapeCodes = {
      "0": "\0",
      // null character
      a: "\x07",
      // bell character
      b: "\b",
      // backspace
      e: "\x1B",
      // escape character
      f: "\f",
      // form feed
      n: "\n",
      // line feed
      r: "\r",
      // carriage return
      t: "	",
      // horizontal tab
      v: "\v",
      // vertical tab
      N: "\x85",
      // Unicode next line
      _: "\xA0",
      // Unicode non-breaking space
      L: "\u2028",
      // Unicode line separator
      P: "\u2029",
      // Unicode paragraph separator
      " ": " ",
      '"': '"',
      "/": "/",
      "\\": "\\",
      "	": "	"
    };
    function parseCharCode(source, offset, length, onError) {
      const cc = source.substr(offset, length);
      const ok = cc.length === length && /^[0-9a-fA-F]+$/.test(cc);
      const code = ok ? parseInt(cc, 16) : NaN;
      try {
        return String.fromCodePoint(code);
      } catch {
        const raw = source.substr(offset - 2, length + 2);
        onError(offset - 2, "BAD_DQ_ESCAPE", `Invalid escape sequence ${raw}`);
        return raw;
      }
    }
    exports.resolveFlowScalar = resolveFlowScalar;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/compose-scalar.js
var require_compose_scalar = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/compose-scalar.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Scalar = require_Scalar();
    var resolveBlockScalar = require_resolve_block_scalar();
    var resolveFlowScalar = require_resolve_flow_scalar();
    function composeScalar(ctx, token, tagToken, onError) {
      const { value, type, comment, range } = token.type === "block-scalar" ? resolveBlockScalar.resolveBlockScalar(ctx, token, onError) : resolveFlowScalar.resolveFlowScalar(token, ctx.options.strict, onError);
      const tagName = tagToken ? ctx.directives.tagName(tagToken.source, (msg) => onError(tagToken, "TAG_RESOLVE_FAILED", msg)) : null;
      let tag;
      if (ctx.options.stringKeys && ctx.atKey) {
        tag = ctx.schema[identity.SCALAR];
      } else if (tagName)
        tag = findScalarTagByName(ctx.schema, value, tagName, tagToken, onError);
      else if (token.type === "scalar")
        tag = findScalarTagByTest(ctx, value, token, onError);
      else
        tag = ctx.schema[identity.SCALAR];
      let scalar;
      try {
        const res = tag.resolve(value, (msg) => onError(tagToken ?? token, "TAG_RESOLVE_FAILED", msg), ctx.options);
        scalar = identity.isScalar(res) ? res : new Scalar.Scalar(res);
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        onError(tagToken ?? token, "TAG_RESOLVE_FAILED", msg);
        scalar = new Scalar.Scalar(value);
      }
      scalar.range = range;
      scalar.source = value;
      if (type)
        scalar.type = type;
      if (tagName)
        scalar.tag = tagName;
      if (tag.format)
        scalar.format = tag.format;
      if (comment)
        scalar.comment = comment;
      return scalar;
    }
    function findScalarTagByName(schema, value, tagName, tagToken, onError) {
      if (tagName === "!")
        return schema[identity.SCALAR];
      const matchWithTest = [];
      for (const tag of schema.tags) {
        if (!tag.collection && tag.tag === tagName) {
          if (tag.default && tag.test)
            matchWithTest.push(tag);
          else
            return tag;
        }
      }
      for (const tag of matchWithTest)
        if (tag.test?.test(value))
          return tag;
      const kt = schema.knownTags[tagName];
      if (kt && !kt.collection) {
        schema.tags.push(Object.assign({}, kt, { default: false, test: void 0 }));
        return kt;
      }
      onError(tagToken, "TAG_RESOLVE_FAILED", `Unresolved tag: ${tagName}`, tagName !== "tag:yaml.org,2002:str");
      return schema[identity.SCALAR];
    }
    function findScalarTagByTest({ atKey, directives, schema }, value, token, onError) {
      const tag = schema.tags.find((tag2) => (tag2.default === true || atKey && tag2.default === "key") && tag2.test?.test(value)) || schema[identity.SCALAR];
      if (schema.compat) {
        const compat = schema.compat.find((tag2) => tag2.default && tag2.test?.test(value)) ?? schema[identity.SCALAR];
        if (tag.tag !== compat.tag) {
          const ts = directives.tagString(tag.tag);
          const cs = directives.tagString(compat.tag);
          const msg = `Value may be parsed as either ${ts} or ${cs}`;
          onError(token, "TAG_RESOLVE_FAILED", msg, true);
        }
      }
      return tag;
    }
    exports.composeScalar = composeScalar;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/util-empty-scalar-position.js
var require_util_empty_scalar_position = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/util-empty-scalar-position.js"(exports) {
    "use strict";
    function emptyScalarPosition(offset, before, pos) {
      if (before) {
        pos ?? (pos = before.length);
        for (let i = pos - 1; i >= 0; --i) {
          let st = before[i];
          switch (st.type) {
            case "space":
            case "comment":
            case "newline":
              offset -= st.source.length;
              continue;
          }
          st = before[++i];
          while (st?.type === "space") {
            offset += st.source.length;
            st = before[++i];
          }
          break;
        }
      }
      return offset;
    }
    exports.emptyScalarPosition = emptyScalarPosition;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/compose-node.js
var require_compose_node = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/compose-node.js"(exports) {
    "use strict";
    var Alias = require_Alias();
    var identity = require_identity();
    var composeCollection = require_compose_collection();
    var composeScalar = require_compose_scalar();
    var resolveEnd = require_resolve_end();
    var utilEmptyScalarPosition = require_util_empty_scalar_position();
    var CN = { composeNode, composeEmptyNode };
    function composeNode(ctx, token, props, onError) {
      const atKey = ctx.atKey;
      const { spaceBefore, comment, anchor, tag } = props;
      let node;
      let isSrcToken = true;
      switch (token.type) {
        case "alias":
          node = composeAlias(ctx, token, onError);
          if (anchor || tag)
            onError(token, "ALIAS_PROPS", "An alias node must not specify any properties");
          break;
        case "scalar":
        case "single-quoted-scalar":
        case "double-quoted-scalar":
        case "block-scalar":
          node = composeScalar.composeScalar(ctx, token, tag, onError);
          if (anchor)
            node.anchor = anchor.source.substring(1);
          break;
        case "block-map":
        case "block-seq":
        case "flow-collection":
          try {
            node = composeCollection.composeCollection(CN, ctx, token, props, onError);
            if (anchor)
              node.anchor = anchor.source.substring(1);
          } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            onError(token, "RESOURCE_EXHAUSTION", message);
          }
          break;
        default: {
          const message = token.type === "error" ? token.message : `Unsupported token (type: ${token.type})`;
          onError(token, "UNEXPECTED_TOKEN", message);
          isSrcToken = false;
        }
      }
      node ?? (node = composeEmptyNode(ctx, token.offset, void 0, null, props, onError));
      if (anchor && node.anchor === "")
        onError(anchor, "BAD_ALIAS", "Anchor cannot be an empty string");
      if (atKey && ctx.options.stringKeys && (!identity.isScalar(node) || typeof node.value !== "string" || node.tag && node.tag !== "tag:yaml.org,2002:str")) {
        const msg = "With stringKeys, all keys must be strings";
        onError(tag ?? token, "NON_STRING_KEY", msg);
      }
      if (spaceBefore)
        node.spaceBefore = true;
      if (comment) {
        if (token.type === "scalar" && token.source === "")
          node.comment = comment;
        else
          node.commentBefore = comment;
      }
      if (ctx.options.keepSourceTokens && isSrcToken)
        node.srcToken = token;
      return node;
    }
    function composeEmptyNode(ctx, offset, before, pos, { spaceBefore, comment, anchor, tag, end }, onError) {
      const token = {
        type: "scalar",
        offset: utilEmptyScalarPosition.emptyScalarPosition(offset, before, pos),
        indent: -1,
        source: ""
      };
      const node = composeScalar.composeScalar(ctx, token, tag, onError);
      if (anchor) {
        node.anchor = anchor.source.substring(1);
        if (node.anchor === "")
          onError(anchor, "BAD_ALIAS", "Anchor cannot be an empty string");
      }
      if (spaceBefore)
        node.spaceBefore = true;
      if (comment) {
        node.comment = comment;
        node.range[2] = end;
      }
      return node;
    }
    function composeAlias({ options }, { offset, source, end }, onError) {
      const alias = new Alias.Alias(source.substring(1));
      if (alias.source === "")
        onError(offset, "BAD_ALIAS", "Alias cannot be an empty string");
      if (alias.source.endsWith(":"))
        onError(offset + source.length - 1, "BAD_ALIAS", "Alias ending in : is ambiguous", true);
      const valueEnd = offset + source.length;
      const re = resolveEnd.resolveEnd(end, valueEnd, options.strict, onError);
      alias.range = [offset, valueEnd, re.offset];
      if (re.comment)
        alias.comment = re.comment;
      return alias;
    }
    exports.composeEmptyNode = composeEmptyNode;
    exports.composeNode = composeNode;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/compose-doc.js
var require_compose_doc = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/compose-doc.js"(exports) {
    "use strict";
    var Document = require_Document();
    var composeNode = require_compose_node();
    var resolveEnd = require_resolve_end();
    var resolveProps = require_resolve_props();
    function composeDoc(options, directives, { offset, start, value, end }, onError) {
      const opts = Object.assign({ _directives: directives }, options);
      const doc = new Document.Document(void 0, opts);
      const ctx = {
        atKey: false,
        atRoot: true,
        directives: doc.directives,
        options: doc.options,
        schema: doc.schema
      };
      const props = resolveProps.resolveProps(start, {
        indicator: "doc-start",
        next: value ?? end?.[0],
        offset,
        onError,
        parentIndent: 0,
        startOnNewline: true
      });
      if (props.found) {
        doc.directives.docStart = true;
        if (value && (value.type === "block-map" || value.type === "block-seq") && !props.hasNewline)
          onError(props.end, "MISSING_CHAR", "Block collection cannot start on same line with directives-end marker");
      }
      doc.contents = value ? composeNode.composeNode(ctx, value, props, onError) : composeNode.composeEmptyNode(ctx, props.end, start, null, props, onError);
      const contentEnd = doc.contents.range[2];
      const re = resolveEnd.resolveEnd(end, contentEnd, false, onError);
      if (re.comment)
        doc.comment = re.comment;
      doc.range = [offset, contentEnd, re.offset];
      return doc;
    }
    exports.composeDoc = composeDoc;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/composer.js
var require_composer = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/composer.js"(exports) {
    "use strict";
    var node_process = __require("process");
    var directives = require_directives();
    var Document = require_Document();
    var errors = require_errors();
    var identity = require_identity();
    var composeDoc = require_compose_doc();
    var resolveEnd = require_resolve_end();
    function getErrorPos(src) {
      if (typeof src === "number")
        return [src, src + 1];
      if (Array.isArray(src))
        return src.length === 2 ? src : [src[0], src[1]];
      const { offset, source } = src;
      return [offset, offset + (typeof source === "string" ? source.length : 1)];
    }
    function parsePrelude(prelude) {
      let comment = "";
      let atComment = false;
      let afterEmptyLine = false;
      for (let i = 0; i < prelude.length; ++i) {
        const source = prelude[i];
        switch (source[0]) {
          case "#":
            comment += (comment === "" ? "" : afterEmptyLine ? "\n\n" : "\n") + (source.substring(1) || " ");
            atComment = true;
            afterEmptyLine = false;
            break;
          case "%":
            if (prelude[i + 1]?.[0] !== "#")
              i += 1;
            atComment = false;
            break;
          default:
            if (!atComment)
              afterEmptyLine = true;
            atComment = false;
        }
      }
      return { comment, afterEmptyLine };
    }
    var Composer = class {
      constructor(options = {}) {
        this.doc = null;
        this.atDirectives = false;
        this.prelude = [];
        this.errors = [];
        this.warnings = [];
        this.onError = (source, code, message, warning) => {
          const pos = getErrorPos(source);
          if (warning)
            this.warnings.push(new errors.YAMLWarning(pos, code, message));
          else
            this.errors.push(new errors.YAMLParseError(pos, code, message));
        };
        this.directives = new directives.Directives({ version: options.version || "1.2" });
        this.options = options;
      }
      decorate(doc, afterDoc) {
        const { comment, afterEmptyLine } = parsePrelude(this.prelude);
        if (comment) {
          const dc = doc.contents;
          if (afterDoc) {
            doc.comment = doc.comment ? `${doc.comment}
${comment}` : comment;
          } else if (afterEmptyLine || doc.directives.docStart || !dc) {
            doc.commentBefore = comment;
          } else if (identity.isCollection(dc) && !dc.flow && dc.items.length > 0) {
            let it = dc.items[0];
            if (identity.isPair(it))
              it = it.key;
            const cb = it.commentBefore;
            it.commentBefore = cb ? `${comment}
${cb}` : comment;
          } else {
            const cb = dc.commentBefore;
            dc.commentBefore = cb ? `${comment}
${cb}` : comment;
          }
        }
        if (afterDoc) {
          for (let i = 0; i < this.errors.length; ++i)
            doc.errors.push(this.errors[i]);
          for (let i = 0; i < this.warnings.length; ++i)
            doc.warnings.push(this.warnings[i]);
        } else {
          doc.errors = this.errors;
          doc.warnings = this.warnings;
        }
        this.prelude = [];
        this.errors = [];
        this.warnings = [];
      }
      /**
       * Current stream status information.
       *
       * Mostly useful at the end of input for an empty stream.
       */
      streamInfo() {
        return {
          comment: parsePrelude(this.prelude).comment,
          directives: this.directives,
          errors: this.errors,
          warnings: this.warnings
        };
      }
      /**
       * Compose tokens into documents.
       *
       * @param forceDoc - If the stream contains no document, still emit a final document including any comments and directives that would be applied to a subsequent document.
       * @param endOffset - Should be set if `forceDoc` is also set, to set the document range end and to indicate errors correctly.
       */
      *compose(tokens, forceDoc = false, endOffset = -1) {
        for (const token of tokens)
          yield* this.next(token);
        yield* this.end(forceDoc, endOffset);
      }
      /** Advance the composer by one CST token. */
      *next(token) {
        if (node_process.env.LOG_STREAM)
          console.dir(token, { depth: null });
        switch (token.type) {
          case "directive":
            this.directives.add(token.source, (offset, message, warning) => {
              const pos = getErrorPos(token);
              pos[0] += offset;
              this.onError(pos, "BAD_DIRECTIVE", message, warning);
            });
            this.prelude.push(token.source);
            this.atDirectives = true;
            break;
          case "document": {
            const doc = composeDoc.composeDoc(this.options, this.directives, token, this.onError);
            if (this.atDirectives && !doc.directives.docStart)
              this.onError(token, "MISSING_CHAR", "Missing directives-end/doc-start indicator line");
            this.decorate(doc, false);
            if (this.doc)
              yield this.doc;
            this.doc = doc;
            this.atDirectives = false;
            break;
          }
          case "byte-order-mark":
          case "space":
            break;
          case "comment":
          case "newline":
            this.prelude.push(token.source);
            break;
          case "error": {
            const msg = token.source ? `${token.message}: ${JSON.stringify(token.source)}` : token.message;
            const error = new errors.YAMLParseError(getErrorPos(token), "UNEXPECTED_TOKEN", msg);
            if (this.atDirectives || !this.doc)
              this.errors.push(error);
            else
              this.doc.errors.push(error);
            break;
          }
          case "doc-end": {
            if (!this.doc) {
              const msg = "Unexpected doc-end without preceding document";
              this.errors.push(new errors.YAMLParseError(getErrorPos(token), "UNEXPECTED_TOKEN", msg));
              break;
            }
            this.doc.directives.docEnd = true;
            const end = resolveEnd.resolveEnd(token.end, token.offset + token.source.length, this.doc.options.strict, this.onError);
            this.decorate(this.doc, true);
            if (end.comment) {
              const dc = this.doc.comment;
              this.doc.comment = dc ? `${dc}
${end.comment}` : end.comment;
            }
            this.doc.range[2] = end.offset;
            break;
          }
          default:
            this.errors.push(new errors.YAMLParseError(getErrorPos(token), "UNEXPECTED_TOKEN", `Unsupported token ${token.type}`));
        }
      }
      /**
       * Call at end of input to yield any remaining document.
       *
       * @param forceDoc - If the stream contains no document, still emit a final document including any comments and directives that would be applied to a subsequent document.
       * @param endOffset - Should be set if `forceDoc` is also set, to set the document range end and to indicate errors correctly.
       */
      *end(forceDoc = false, endOffset = -1) {
        if (this.doc) {
          this.decorate(this.doc, true);
          yield this.doc;
          this.doc = null;
        } else if (forceDoc) {
          const opts = Object.assign({ _directives: this.directives }, this.options);
          const doc = new Document.Document(void 0, opts);
          if (this.atDirectives)
            this.onError(endOffset, "MISSING_CHAR", "Missing directives-end indicator line");
          doc.range = [0, endOffset, endOffset];
          this.decorate(doc, false);
          yield doc;
        }
      }
    };
    exports.Composer = Composer;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/parse/cst-scalar.js
var require_cst_scalar = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/parse/cst-scalar.js"(exports) {
    "use strict";
    var resolveBlockScalar = require_resolve_block_scalar();
    var resolveFlowScalar = require_resolve_flow_scalar();
    var errors = require_errors();
    var stringifyString = require_stringifyString();
    function resolveAsScalar(token, strict = true, onError) {
      if (token) {
        const _onError = (pos, code, message) => {
          const offset = typeof pos === "number" ? pos : Array.isArray(pos) ? pos[0] : pos.offset;
          if (onError)
            onError(offset, code, message);
          else
            throw new errors.YAMLParseError([offset, offset + 1], code, message);
        };
        switch (token.type) {
          case "scalar":
          case "single-quoted-scalar":
          case "double-quoted-scalar":
            return resolveFlowScalar.resolveFlowScalar(token, strict, _onError);
          case "block-scalar":
            return resolveBlockScalar.resolveBlockScalar({ options: { strict } }, token, _onError);
        }
      }
      return null;
    }
    function createScalarToken(value, context) {
      const { implicitKey = false, indent, inFlow = false, offset = -1, type = "PLAIN" } = context;
      const source = stringifyString.stringifyString({ type, value }, {
        implicitKey,
        indent: indent > 0 ? " ".repeat(indent) : "",
        inFlow,
        options: { blockQuote: true, lineWidth: -1 }
      });
      const end = context.end ?? [
        { type: "newline", offset: -1, indent, source: "\n" }
      ];
      switch (source[0]) {
        case "|":
        case ">": {
          const he = source.indexOf("\n");
          const head = source.substring(0, he);
          const body = source.substring(he + 1) + "\n";
          const props = [
            { type: "block-scalar-header", offset, indent, source: head }
          ];
          if (!addEndtoBlockProps(props, end))
            props.push({ type: "newline", offset: -1, indent, source: "\n" });
          return { type: "block-scalar", offset, indent, props, source: body };
        }
        case '"':
          return { type: "double-quoted-scalar", offset, indent, source, end };
        case "'":
          return { type: "single-quoted-scalar", offset, indent, source, end };
        default:
          return { type: "scalar", offset, indent, source, end };
      }
    }
    function setScalarValue(token, value, context = {}) {
      let { afterKey = false, implicitKey = false, inFlow = false, type } = context;
      let indent = "indent" in token ? token.indent : null;
      if (afterKey && typeof indent === "number")
        indent += 2;
      if (!type)
        switch (token.type) {
          case "single-quoted-scalar":
            type = "QUOTE_SINGLE";
            break;
          case "double-quoted-scalar":
            type = "QUOTE_DOUBLE";
            break;
          case "block-scalar": {
            const header = token.props[0];
            if (header.type !== "block-scalar-header")
              throw new Error("Invalid block scalar header");
            type = header.source[0] === ">" ? "BLOCK_FOLDED" : "BLOCK_LITERAL";
            break;
          }
          default:
            type = "PLAIN";
        }
      const source = stringifyString.stringifyString({ type, value }, {
        implicitKey: implicitKey || indent === null,
        indent: indent !== null && indent > 0 ? " ".repeat(indent) : "",
        inFlow,
        options: { blockQuote: true, lineWidth: -1 }
      });
      switch (source[0]) {
        case "|":
        case ">":
          setBlockScalarValue(token, source);
          break;
        case '"':
          setFlowScalarValue(token, source, "double-quoted-scalar");
          break;
        case "'":
          setFlowScalarValue(token, source, "single-quoted-scalar");
          break;
        default:
          setFlowScalarValue(token, source, "scalar");
      }
    }
    function setBlockScalarValue(token, source) {
      const he = source.indexOf("\n");
      const head = source.substring(0, he);
      const body = source.substring(he + 1) + "\n";
      if (token.type === "block-scalar") {
        const header = token.props[0];
        if (header.type !== "block-scalar-header")
          throw new Error("Invalid block scalar header");
        header.source = head;
        token.source = body;
      } else {
        const { offset } = token;
        const indent = "indent" in token ? token.indent : -1;
        const props = [
          { type: "block-scalar-header", offset, indent, source: head }
        ];
        if (!addEndtoBlockProps(props, "end" in token ? token.end : void 0))
          props.push({ type: "newline", offset: -1, indent, source: "\n" });
        for (const key of Object.keys(token))
          if (key !== "type" && key !== "offset")
            delete token[key];
        Object.assign(token, { type: "block-scalar", indent, props, source: body });
      }
    }
    function addEndtoBlockProps(props, end) {
      if (end)
        for (const st of end)
          switch (st.type) {
            case "space":
            case "comment":
              props.push(st);
              break;
            case "newline":
              props.push(st);
              return true;
          }
      return false;
    }
    function setFlowScalarValue(token, source, type) {
      switch (token.type) {
        case "scalar":
        case "double-quoted-scalar":
        case "single-quoted-scalar":
          token.type = type;
          token.source = source;
          break;
        case "block-scalar": {
          const end = token.props.slice(1);
          let oa = source.length;
          if (token.props[0].type === "block-scalar-header")
            oa -= token.props[0].source.length;
          for (const tok of end)
            tok.offset += oa;
          delete token.props;
          Object.assign(token, { type, source, end });
          break;
        }
        case "block-map":
        case "block-seq": {
          const offset = token.offset + source.length;
          const nl = { type: "newline", offset, indent: token.indent, source: "\n" };
          delete token.items;
          Object.assign(token, { type, source, end: [nl] });
          break;
        }
        default: {
          const indent = "indent" in token ? token.indent : -1;
          const end = "end" in token && Array.isArray(token.end) ? token.end.filter((st) => st.type === "space" || st.type === "comment" || st.type === "newline") : [];
          for (const key of Object.keys(token))
            if (key !== "type" && key !== "offset")
              delete token[key];
          Object.assign(token, { type, indent, source, end });
        }
      }
    }
    exports.createScalarToken = createScalarToken;
    exports.resolveAsScalar = resolveAsScalar;
    exports.setScalarValue = setScalarValue;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/parse/cst-stringify.js
var require_cst_stringify = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/parse/cst-stringify.js"(exports) {
    "use strict";
    var stringify = (cst) => "type" in cst ? stringifyToken(cst) : stringifyItem(cst);
    function stringifyToken(token) {
      switch (token.type) {
        case "block-scalar": {
          let res = "";
          for (const tok of token.props)
            res += stringifyToken(tok);
          return res + token.source;
        }
        case "block-map":
        case "block-seq": {
          let res = "";
          for (const item of token.items)
            res += stringifyItem(item);
          return res;
        }
        case "flow-collection": {
          let res = token.start.source;
          for (const item of token.items)
            res += stringifyItem(item);
          for (const st of token.end)
            res += st.source;
          return res;
        }
        case "document": {
          let res = stringifyItem(token);
          if (token.end)
            for (const st of token.end)
              res += st.source;
          return res;
        }
        default: {
          let res = token.source;
          if ("end" in token && token.end)
            for (const st of token.end)
              res += st.source;
          return res;
        }
      }
    }
    function stringifyItem({ start, key, sep, value }) {
      let res = "";
      for (const st of start)
        res += st.source;
      if (key)
        res += stringifyToken(key);
      if (sep)
        for (const st of sep)
          res += st.source;
      if (value)
        res += stringifyToken(value);
      return res;
    }
    exports.stringify = stringify;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/parse/cst-visit.js
var require_cst_visit = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/parse/cst-visit.js"(exports) {
    "use strict";
    var BREAK = Symbol("break visit");
    var SKIP = Symbol("skip children");
    var REMOVE = Symbol("remove item");
    function visit(cst, visitor) {
      if ("type" in cst && cst.type === "document")
        cst = { start: cst.start, value: cst.value };
      _visit(Object.freeze([]), cst, visitor);
    }
    visit.BREAK = BREAK;
    visit.SKIP = SKIP;
    visit.REMOVE = REMOVE;
    visit.itemAtPath = (cst, path) => {
      let item = cst;
      for (const [field, index] of path) {
        const tok = item?.[field];
        if (tok && "items" in tok) {
          item = tok.items[index];
        } else
          return void 0;
      }
      return item;
    };
    visit.parentCollection = (cst, path) => {
      const parent = visit.itemAtPath(cst, path.slice(0, -1));
      const field = path[path.length - 1][0];
      const coll = parent?.[field];
      if (coll && "items" in coll)
        return coll;
      throw new Error("Parent collection not found");
    };
    function _visit(path, item, visitor) {
      let ctrl = visitor(item, path);
      if (typeof ctrl === "symbol")
        return ctrl;
      for (const field of ["key", "value"]) {
        const token = item[field];
        if (token && "items" in token) {
          for (let i = 0; i < token.items.length; ++i) {
            const ci = _visit(Object.freeze(path.concat([[field, i]])), token.items[i], visitor);
            if (typeof ci === "number")
              i = ci - 1;
            else if (ci === BREAK)
              return BREAK;
            else if (ci === REMOVE) {
              token.items.splice(i, 1);
              i -= 1;
            }
          }
          if (typeof ctrl === "function" && field === "key")
            ctrl = ctrl(item, path);
        }
      }
      return typeof ctrl === "function" ? ctrl(item, path) : ctrl;
    }
    exports.visit = visit;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/parse/cst.js
var require_cst = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/parse/cst.js"(exports) {
    "use strict";
    var cstScalar = require_cst_scalar();
    var cstStringify = require_cst_stringify();
    var cstVisit = require_cst_visit();
    var BOM = "\uFEFF";
    var DOCUMENT = "";
    var FLOW_END = "";
    var SCALAR = "";
    var isCollection = (token) => !!token && "items" in token;
    var isScalar = (token) => !!token && (token.type === "scalar" || token.type === "single-quoted-scalar" || token.type === "double-quoted-scalar" || token.type === "block-scalar");
    function prettyToken(token) {
      switch (token) {
        case BOM:
          return "<BOM>";
        case DOCUMENT:
          return "<DOC>";
        case FLOW_END:
          return "<FLOW_END>";
        case SCALAR:
          return "<SCALAR>";
        default:
          return JSON.stringify(token);
      }
    }
    function tokenType(source) {
      switch (source) {
        case BOM:
          return "byte-order-mark";
        case DOCUMENT:
          return "doc-mode";
        case FLOW_END:
          return "flow-error-end";
        case SCALAR:
          return "scalar";
        case "---":
          return "doc-start";
        case "...":
          return "doc-end";
        case "":
        case "\n":
        case "\r\n":
          return "newline";
        case "-":
          return "seq-item-ind";
        case "?":
          return "explicit-key-ind";
        case ":":
          return "map-value-ind";
        case "{":
          return "flow-map-start";
        case "}":
          return "flow-map-end";
        case "[":
          return "flow-seq-start";
        case "]":
          return "flow-seq-end";
        case ",":
          return "comma";
      }
      switch (source[0]) {
        case " ":
        case "	":
          return "space";
        case "#":
          return "comment";
        case "%":
          return "directive-line";
        case "*":
          return "alias";
        case "&":
          return "anchor";
        case "!":
          return "tag";
        case "'":
          return "single-quoted-scalar";
        case '"':
          return "double-quoted-scalar";
        case "|":
        case ">":
          return "block-scalar-header";
      }
      return null;
    }
    exports.createScalarToken = cstScalar.createScalarToken;
    exports.resolveAsScalar = cstScalar.resolveAsScalar;
    exports.setScalarValue = cstScalar.setScalarValue;
    exports.stringify = cstStringify.stringify;
    exports.visit = cstVisit.visit;
    exports.BOM = BOM;
    exports.DOCUMENT = DOCUMENT;
    exports.FLOW_END = FLOW_END;
    exports.SCALAR = SCALAR;
    exports.isCollection = isCollection;
    exports.isScalar = isScalar;
    exports.prettyToken = prettyToken;
    exports.tokenType = tokenType;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/parse/lexer.js
var require_lexer = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/parse/lexer.js"(exports) {
    "use strict";
    var cst = require_cst();
    function isEmpty(ch) {
      switch (ch) {
        case void 0:
        case " ":
        case "\n":
        case "\r":
        case "	":
          return true;
        default:
          return false;
      }
    }
    var hexDigits = new Set("0123456789ABCDEFabcdef");
    var tagChars = new Set("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-#;/?:@&=+$_.!~*'()");
    var flowIndicatorChars = new Set(",[]{}");
    var invalidAnchorChars = new Set(" ,[]{}\n\r	");
    var isNotAnchorChar = (ch) => !ch || invalidAnchorChars.has(ch);
    var Lexer = class {
      constructor() {
        this.atEnd = false;
        this.blockScalarIndent = -1;
        this.blockScalarKeep = false;
        this.buffer = "";
        this.flowKey = false;
        this.flowLevel = 0;
        this.indentNext = 0;
        this.indentValue = 0;
        this.lineEndPos = null;
        this.next = null;
        this.pos = 0;
      }
      /**
       * Generate YAML tokens from the `source` string. If `incomplete`,
       * a part of the last line may be left as a buffer for the next call.
       *
       * @returns A generator of lexical tokens
       */
      *lex(source, incomplete = false) {
        if (source) {
          if (typeof source !== "string")
            throw TypeError("source is not a string");
          this.buffer = this.buffer ? this.buffer + source : source;
          this.lineEndPos = null;
        }
        this.atEnd = !incomplete;
        let next = this.next ?? "stream";
        while (next && (incomplete || this.hasChars(1)))
          next = yield* this.parseNext(next);
      }
      atLineEnd() {
        let i = this.pos;
        let ch = this.buffer[i];
        while (ch === " " || ch === "	")
          ch = this.buffer[++i];
        if (!ch || ch === "#" || ch === "\n")
          return true;
        if (ch === "\r")
          return this.buffer[i + 1] === "\n";
        return false;
      }
      charAt(n) {
        return this.buffer[this.pos + n];
      }
      continueScalar(offset) {
        let ch = this.buffer[offset];
        if (this.indentNext > 0) {
          let indent = 0;
          while (ch === " ")
            ch = this.buffer[++indent + offset];
          if (ch === "\r") {
            const next = this.buffer[indent + offset + 1];
            if (next === "\n" || !next && !this.atEnd)
              return offset + indent + 1;
          }
          return ch === "\n" || indent >= this.indentNext || !ch && !this.atEnd ? offset + indent : -1;
        }
        if (ch === "-" || ch === ".") {
          const dt = this.buffer.substr(offset, 3);
          if ((dt === "---" || dt === "...") && isEmpty(this.buffer[offset + 3]))
            return -1;
        }
        return offset;
      }
      getLine() {
        let end = this.lineEndPos;
        if (typeof end !== "number" || end !== -1 && end < this.pos) {
          end = this.buffer.indexOf("\n", this.pos);
          this.lineEndPos = end;
        }
        if (end === -1)
          return this.atEnd ? this.buffer.substring(this.pos) : null;
        if (this.buffer[end - 1] === "\r")
          end -= 1;
        return this.buffer.substring(this.pos, end);
      }
      hasChars(n) {
        return this.pos + n <= this.buffer.length;
      }
      setNext(state) {
        this.buffer = this.buffer.substring(this.pos);
        this.pos = 0;
        this.lineEndPos = null;
        this.next = state;
        return null;
      }
      peek(n) {
        return this.buffer.substr(this.pos, n);
      }
      *parseNext(next) {
        switch (next) {
          case "stream":
            return yield* this.parseStream();
          case "line-start":
            return yield* this.parseLineStart();
          case "block-start":
            return yield* this.parseBlockStart();
          case "doc":
            return yield* this.parseDocument();
          case "flow":
            return yield* this.parseFlowCollection();
          case "quoted-scalar":
            return yield* this.parseQuotedScalar();
          case "block-scalar":
            return yield* this.parseBlockScalar();
          case "plain-scalar":
            return yield* this.parsePlainScalar();
        }
      }
      *parseStream() {
        let line = this.getLine();
        if (line === null)
          return this.setNext("stream");
        if (line[0] === cst.BOM) {
          yield* this.pushCount(1);
          line = line.substring(1);
        }
        if (line[0] === "%") {
          let dirEnd = line.length;
          let cs = line.indexOf("#");
          while (cs !== -1) {
            const ch = line[cs - 1];
            if (ch === " " || ch === "	") {
              dirEnd = cs - 1;
              break;
            } else {
              cs = line.indexOf("#", cs + 1);
            }
          }
          while (true) {
            const ch = line[dirEnd - 1];
            if (ch === " " || ch === "	")
              dirEnd -= 1;
            else
              break;
          }
          const n = (yield* this.pushCount(dirEnd)) + (yield* this.pushSpaces(true));
          yield* this.pushCount(line.length - n);
          this.pushNewline();
          return "stream";
        }
        if (this.atLineEnd()) {
          const sp = yield* this.pushSpaces(true);
          yield* this.pushCount(line.length - sp);
          yield* this.pushNewline();
          return "stream";
        }
        yield cst.DOCUMENT;
        return yield* this.parseLineStart();
      }
      *parseLineStart() {
        const ch = this.charAt(0);
        if (!ch && !this.atEnd)
          return this.setNext("line-start");
        if (ch === "-" || ch === ".") {
          if (!this.atEnd && !this.hasChars(4))
            return this.setNext("line-start");
          const s = this.peek(3);
          if ((s === "---" || s === "...") && isEmpty(this.charAt(3))) {
            yield* this.pushCount(3);
            this.indentValue = 0;
            this.indentNext = 0;
            return s === "---" ? "doc" : "stream";
          }
        }
        this.indentValue = yield* this.pushSpaces(false);
        if (this.indentNext > this.indentValue && !isEmpty(this.charAt(1)))
          this.indentNext = this.indentValue;
        return yield* this.parseBlockStart();
      }
      *parseBlockStart() {
        const [ch0, ch1] = this.peek(2);
        if (!ch1 && !this.atEnd)
          return this.setNext("block-start");
        if ((ch0 === "-" || ch0 === "?" || ch0 === ":") && isEmpty(ch1)) {
          const n = (yield* this.pushCount(1)) + (yield* this.pushSpaces(true));
          this.indentNext = this.indentValue + 1;
          this.indentValue += n;
          return "block-start";
        }
        return "doc";
      }
      *parseDocument() {
        yield* this.pushSpaces(true);
        const line = this.getLine();
        if (line === null)
          return this.setNext("doc");
        let n = yield* this.pushIndicators();
        switch (line[n]) {
          case "#":
            yield* this.pushCount(line.length - n);
          // fallthrough
          case void 0:
            yield* this.pushNewline();
            return yield* this.parseLineStart();
          case "{":
          case "[":
            yield* this.pushCount(1);
            this.flowKey = false;
            this.flowLevel = 1;
            return "flow";
          case "}":
          case "]":
            yield* this.pushCount(1);
            return "doc";
          case "*":
            yield* this.pushUntil(isNotAnchorChar);
            return "doc";
          case '"':
          case "'":
            return yield* this.parseQuotedScalar();
          case "|":
          case ">":
            n += yield* this.parseBlockScalarHeader();
            n += yield* this.pushSpaces(true);
            yield* this.pushCount(line.length - n);
            yield* this.pushNewline();
            return yield* this.parseBlockScalar();
          default:
            return yield* this.parsePlainScalar();
        }
      }
      *parseFlowCollection() {
        let nl, sp;
        let indent = -1;
        do {
          nl = yield* this.pushNewline();
          if (nl > 0) {
            sp = yield* this.pushSpaces(false);
            this.indentValue = indent = sp;
          } else {
            sp = 0;
          }
          sp += yield* this.pushSpaces(true);
        } while (nl + sp > 0);
        const line = this.getLine();
        if (line === null)
          return this.setNext("flow");
        if (indent !== -1 && indent < this.indentNext && line[0] !== "#" || indent === 0 && (line.startsWith("---") || line.startsWith("...")) && isEmpty(line[3])) {
          const atFlowEndMarker = indent === this.indentNext - 1 && this.flowLevel === 1 && (line[0] === "]" || line[0] === "}");
          if (!atFlowEndMarker) {
            this.flowLevel = 0;
            yield cst.FLOW_END;
            return yield* this.parseLineStart();
          }
        }
        let n = 0;
        while (line[n] === ",") {
          n += yield* this.pushCount(1);
          n += yield* this.pushSpaces(true);
          this.flowKey = false;
        }
        n += yield* this.pushIndicators();
        switch (line[n]) {
          case void 0:
            return "flow";
          case "#":
            yield* this.pushCount(line.length - n);
            return "flow";
          case "{":
          case "[":
            yield* this.pushCount(1);
            this.flowKey = false;
            this.flowLevel += 1;
            return "flow";
          case "}":
          case "]":
            yield* this.pushCount(1);
            this.flowKey = true;
            this.flowLevel -= 1;
            return this.flowLevel ? "flow" : "doc";
          case "*":
            yield* this.pushUntil(isNotAnchorChar);
            return "flow";
          case '"':
          case "'":
            this.flowKey = true;
            return yield* this.parseQuotedScalar();
          case ":": {
            const next = this.charAt(1);
            if (this.flowKey || isEmpty(next) || next === ",") {
              this.flowKey = false;
              yield* this.pushCount(1);
              yield* this.pushSpaces(true);
              return "flow";
            }
          }
          // fallthrough
          default:
            this.flowKey = false;
            return yield* this.parsePlainScalar();
        }
      }
      *parseQuotedScalar() {
        const quote = this.charAt(0);
        let end = this.buffer.indexOf(quote, this.pos + 1);
        if (quote === "'") {
          while (end !== -1 && this.buffer[end + 1] === "'")
            end = this.buffer.indexOf("'", end + 2);
        } else {
          while (end !== -1) {
            let n = 0;
            while (this.buffer[end - 1 - n] === "\\")
              n += 1;
            if (n % 2 === 0)
              break;
            end = this.buffer.indexOf('"', end + 1);
          }
        }
        const qb = this.buffer.substring(0, end);
        let nl = qb.indexOf("\n", this.pos);
        if (nl !== -1) {
          while (nl !== -1) {
            const cs = this.continueScalar(nl + 1);
            if (cs === -1)
              break;
            nl = qb.indexOf("\n", cs);
          }
          if (nl !== -1) {
            end = nl - (qb[nl - 1] === "\r" ? 2 : 1);
          }
        }
        if (end === -1) {
          if (!this.atEnd)
            return this.setNext("quoted-scalar");
          end = this.buffer.length;
        }
        yield* this.pushToIndex(end + 1, false);
        return this.flowLevel ? "flow" : "doc";
      }
      *parseBlockScalarHeader() {
        this.blockScalarIndent = -1;
        this.blockScalarKeep = false;
        let i = this.pos;
        while (true) {
          const ch = this.buffer[++i];
          if (ch === "+")
            this.blockScalarKeep = true;
          else if (ch > "0" && ch <= "9")
            this.blockScalarIndent = Number(ch) - 1;
          else if (ch !== "-")
            break;
        }
        return yield* this.pushUntil((ch) => isEmpty(ch) || ch === "#");
      }
      *parseBlockScalar() {
        let nl = this.pos - 1;
        let indent = 0;
        let ch;
        loop: for (let i2 = this.pos; ch = this.buffer[i2]; ++i2) {
          switch (ch) {
            case " ":
              indent += 1;
              break;
            case "\n":
              nl = i2;
              indent = 0;
              break;
            case "\r": {
              const next = this.buffer[i2 + 1];
              if (!next && !this.atEnd)
                return this.setNext("block-scalar");
              if (next === "\n")
                break;
            }
            // fallthrough
            default:
              break loop;
          }
        }
        if (!ch && !this.atEnd)
          return this.setNext("block-scalar");
        if (indent >= this.indentNext) {
          if (this.blockScalarIndent === -1)
            this.indentNext = indent;
          else {
            this.indentNext = this.blockScalarIndent + (this.indentNext === 0 ? 1 : this.indentNext);
          }
          do {
            const cs = this.continueScalar(nl + 1);
            if (cs === -1)
              break;
            nl = this.buffer.indexOf("\n", cs);
          } while (nl !== -1);
          if (nl === -1) {
            if (!this.atEnd)
              return this.setNext("block-scalar");
            nl = this.buffer.length;
          }
        }
        let i = nl + 1;
        ch = this.buffer[i];
        while (ch === " ")
          ch = this.buffer[++i];
        if (ch === "	") {
          while (ch === "	" || ch === " " || ch === "\r" || ch === "\n")
            ch = this.buffer[++i];
          nl = i - 1;
        } else if (!this.blockScalarKeep) {
          do {
            let i2 = nl - 1;
            let ch2 = this.buffer[i2];
            if (ch2 === "\r")
              ch2 = this.buffer[--i2];
            const lastChar = i2;
            while (ch2 === " ")
              ch2 = this.buffer[--i2];
            if (ch2 === "\n" && i2 >= this.pos && i2 + 1 + indent > lastChar)
              nl = i2;
            else
              break;
          } while (true);
        }
        yield cst.SCALAR;
        yield* this.pushToIndex(nl + 1, true);
        return yield* this.parseLineStart();
      }
      *parsePlainScalar() {
        const inFlow = this.flowLevel > 0;
        let end = this.pos - 1;
        let i = this.pos - 1;
        let ch;
        while (ch = this.buffer[++i]) {
          if (ch === ":") {
            const next = this.buffer[i + 1];
            if (isEmpty(next) || inFlow && flowIndicatorChars.has(next))
              break;
            end = i;
          } else if (isEmpty(ch)) {
            let next = this.buffer[i + 1];
            if (ch === "\r") {
              if (next === "\n") {
                i += 1;
                ch = "\n";
                next = this.buffer[i + 1];
              } else
                end = i;
            }
            if (next === "#" || inFlow && flowIndicatorChars.has(next))
              break;
            if (ch === "\n") {
              const cs = this.continueScalar(i + 1);
              if (cs === -1)
                break;
              i = Math.max(i, cs - 2);
            }
          } else {
            if (inFlow && flowIndicatorChars.has(ch))
              break;
            end = i;
          }
        }
        if (!ch && !this.atEnd)
          return this.setNext("plain-scalar");
        yield cst.SCALAR;
        yield* this.pushToIndex(end + 1, true);
        return inFlow ? "flow" : "doc";
      }
      *pushCount(n) {
        if (n > 0) {
          yield this.buffer.substr(this.pos, n);
          this.pos += n;
          return n;
        }
        return 0;
      }
      *pushToIndex(i, allowEmpty) {
        const s = this.buffer.slice(this.pos, i);
        if (s) {
          yield s;
          this.pos += s.length;
          return s.length;
        } else if (allowEmpty)
          yield "";
        return 0;
      }
      *pushIndicators() {
        let n = 0;
        loop: while (true) {
          switch (this.charAt(0)) {
            case "!":
              n += yield* this.pushTag();
              n += yield* this.pushSpaces(true);
              continue loop;
            case "&":
              n += yield* this.pushUntil(isNotAnchorChar);
              n += yield* this.pushSpaces(true);
              continue loop;
            case "-":
            // this is an error
            case "?":
            // this is an error outside flow collections
            case ":": {
              const inFlow = this.flowLevel > 0;
              const ch1 = this.charAt(1);
              if (isEmpty(ch1) || inFlow && flowIndicatorChars.has(ch1)) {
                if (!inFlow)
                  this.indentNext = this.indentValue + 1;
                else if (this.flowKey)
                  this.flowKey = false;
                n += yield* this.pushCount(1);
                n += yield* this.pushSpaces(true);
                continue loop;
              }
            }
          }
          break loop;
        }
        return n;
      }
      *pushTag() {
        if (this.charAt(1) === "<") {
          let i = this.pos + 2;
          let ch = this.buffer[i];
          while (!isEmpty(ch) && ch !== ">")
            ch = this.buffer[++i];
          return yield* this.pushToIndex(ch === ">" ? i + 1 : i, false);
        } else {
          let i = this.pos + 1;
          let ch = this.buffer[i];
          while (ch) {
            if (tagChars.has(ch))
              ch = this.buffer[++i];
            else if (ch === "%" && hexDigits.has(this.buffer[i + 1]) && hexDigits.has(this.buffer[i + 2])) {
              ch = this.buffer[i += 3];
            } else
              break;
          }
          return yield* this.pushToIndex(i, false);
        }
      }
      *pushNewline() {
        const ch = this.buffer[this.pos];
        if (ch === "\n")
          return yield* this.pushCount(1);
        else if (ch === "\r" && this.charAt(1) === "\n")
          return yield* this.pushCount(2);
        else
          return 0;
      }
      *pushSpaces(allowTabs) {
        let i = this.pos - 1;
        let ch;
        do {
          ch = this.buffer[++i];
        } while (ch === " " || allowTabs && ch === "	");
        const n = i - this.pos;
        if (n > 0) {
          yield this.buffer.substr(this.pos, n);
          this.pos = i;
        }
        return n;
      }
      *pushUntil(test) {
        let i = this.pos;
        let ch = this.buffer[i];
        while (!test(ch))
          ch = this.buffer[++i];
        return yield* this.pushToIndex(i, false);
      }
    };
    exports.Lexer = Lexer;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/parse/line-counter.js
var require_line_counter = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/parse/line-counter.js"(exports) {
    "use strict";
    var LineCounter = class {
      constructor() {
        this.lineStarts = [];
        this.addNewLine = (offset) => this.lineStarts.push(offset);
        this.linePos = (offset) => {
          let low = 0;
          let high = this.lineStarts.length;
          while (low < high) {
            const mid = low + high >> 1;
            if (this.lineStarts[mid] < offset)
              low = mid + 1;
            else
              high = mid;
          }
          if (this.lineStarts[low] === offset)
            return { line: low + 1, col: 1 };
          if (low === 0)
            return { line: 0, col: offset };
          const start = this.lineStarts[low - 1];
          return { line: low, col: offset - start + 1 };
        };
      }
    };
    exports.LineCounter = LineCounter;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/parse/parser.js
var require_parser = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/parse/parser.js"(exports) {
    "use strict";
    var node_process = __require("process");
    var cst = require_cst();
    var lexer = require_lexer();
    function includesToken(list, type) {
      for (let i = 0; i < list.length; ++i)
        if (list[i].type === type)
          return true;
      return false;
    }
    function findNonEmptyIndex(list) {
      for (let i = 0; i < list.length; ++i) {
        switch (list[i].type) {
          case "space":
          case "comment":
          case "newline":
            break;
          default:
            return i;
        }
      }
      return -1;
    }
    function isFlowToken(token) {
      switch (token?.type) {
        case "alias":
        case "scalar":
        case "single-quoted-scalar":
        case "double-quoted-scalar":
        case "flow-collection":
          return true;
        default:
          return false;
      }
    }
    function getPrevProps(parent) {
      switch (parent.type) {
        case "document":
          return parent.start;
        case "block-map": {
          const it = parent.items[parent.items.length - 1];
          return it.sep ?? it.start;
        }
        case "block-seq":
          return parent.items[parent.items.length - 1].start;
        /* istanbul ignore next should not happen */
        default:
          return [];
      }
    }
    function getFirstKeyStartProps(prev) {
      if (prev.length === 0)
        return [];
      let i = prev.length;
      loop: while (--i >= 0) {
        switch (prev[i].type) {
          case "doc-start":
          case "explicit-key-ind":
          case "map-value-ind":
          case "seq-item-ind":
          case "newline":
            break loop;
        }
      }
      while (prev[++i]?.type === "space") {
      }
      return prev.splice(i, prev.length);
    }
    function arrayPushArray(target, source) {
      if (source.length < 1e5)
        Array.prototype.push.apply(target, source);
      else
        for (let i = 0; i < source.length; ++i)
          target.push(source[i]);
    }
    function fixFlowSeqItems(fc) {
      if (fc.start.type === "flow-seq-start") {
        for (const it of fc.items) {
          if (it.sep && !it.value && !includesToken(it.start, "explicit-key-ind") && !includesToken(it.sep, "map-value-ind")) {
            if (it.key)
              it.value = it.key;
            delete it.key;
            if (isFlowToken(it.value)) {
              if (it.value.end)
                arrayPushArray(it.value.end, it.sep);
              else
                it.value.end = it.sep;
            } else
              arrayPushArray(it.start, it.sep);
            delete it.sep;
          }
        }
      }
    }
    var Parser = class {
      /**
       * @param onNewLine - If defined, called separately with the start position of
       *   each new line (in `parse()`, including the start of input).
       */
      constructor(onNewLine) {
        this.atNewLine = true;
        this.atScalar = false;
        this.indent = 0;
        this.offset = 0;
        this.onKeyLine = false;
        this.stack = [];
        this.source = "";
        this.type = "";
        this.lexer = new lexer.Lexer();
        this.onNewLine = onNewLine;
      }
      /**
       * Parse `source` as a YAML stream.
       * If `incomplete`, a part of the last line may be left as a buffer for the next call.
       *
       * Errors are not thrown, but yielded as `{ type: 'error', message }` tokens.
       *
       * @returns A generator of tokens representing each directive, document, and other structure.
       */
      *parse(source, incomplete = false) {
        if (this.onNewLine && this.offset === 0)
          this.onNewLine(0);
        for (const lexeme of this.lexer.lex(source, incomplete))
          yield* this.next(lexeme);
        if (!incomplete)
          yield* this.end();
      }
      /**
       * Advance the parser by the `source` of one lexical token.
       */
      *next(source) {
        this.source = source;
        if (node_process.env.LOG_TOKENS)
          console.log("|", cst.prettyToken(source));
        if (this.atScalar) {
          this.atScalar = false;
          yield* this.step();
          this.offset += source.length;
          return;
        }
        const type = cst.tokenType(source);
        if (!type) {
          const message = `Not a YAML token: ${source}`;
          yield* this.pop({ type: "error", offset: this.offset, message, source });
          this.offset += source.length;
        } else if (type === "scalar") {
          this.atNewLine = false;
          this.atScalar = true;
          this.type = "scalar";
        } else {
          this.type = type;
          yield* this.step();
          switch (type) {
            case "newline":
              this.atNewLine = true;
              this.indent = 0;
              if (this.onNewLine)
                this.onNewLine(this.offset + source.length);
              break;
            case "space":
              if (this.atNewLine && source[0] === " ")
                this.indent += source.length;
              break;
            case "explicit-key-ind":
            case "map-value-ind":
            case "seq-item-ind":
              if (this.atNewLine)
                this.indent += source.length;
              break;
            case "doc-mode":
            case "flow-error-end":
              return;
            default:
              this.atNewLine = false;
          }
          this.offset += source.length;
        }
      }
      /** Call at end of input to push out any remaining constructions */
      *end() {
        while (this.stack.length > 0)
          yield* this.pop();
      }
      get sourceToken() {
        const st = {
          type: this.type,
          offset: this.offset,
          indent: this.indent,
          source: this.source
        };
        return st;
      }
      *step() {
        const top = this.peek(1);
        if (this.type === "doc-end" && top?.type !== "doc-end") {
          while (this.stack.length > 0)
            yield* this.pop();
          this.stack.push({
            type: "doc-end",
            offset: this.offset,
            source: this.source
          });
          return;
        }
        if (!top)
          return yield* this.stream();
        switch (top.type) {
          case "document":
            return yield* this.document(top);
          case "alias":
          case "scalar":
          case "single-quoted-scalar":
          case "double-quoted-scalar":
            return yield* this.scalar(top);
          case "block-scalar":
            return yield* this.blockScalar(top);
          case "block-map":
            return yield* this.blockMap(top);
          case "block-seq":
            return yield* this.blockSequence(top);
          case "flow-collection":
            return yield* this.flowCollection(top);
          case "doc-end":
            return yield* this.documentEnd(top);
        }
        yield* this.pop();
      }
      peek(n) {
        return this.stack[this.stack.length - n];
      }
      *pop(error) {
        const token = error ?? this.stack.pop();
        if (!token) {
          const message = "Tried to pop an empty stack";
          yield { type: "error", offset: this.offset, source: "", message };
        } else if (this.stack.length === 0) {
          yield token;
        } else {
          const top = this.peek(1);
          if (token.type === "block-scalar") {
            token.indent = "indent" in top ? top.indent : 0;
          } else if (token.type === "flow-collection" && top.type === "document") {
            token.indent = 0;
          }
          if (token.type === "flow-collection")
            fixFlowSeqItems(token);
          switch (top.type) {
            case "document":
              top.value = token;
              break;
            case "block-scalar":
              top.props.push(token);
              break;
            case "block-map": {
              const it = top.items[top.items.length - 1];
              if (it.value) {
                top.items.push({ start: [], key: token, sep: [] });
                this.onKeyLine = true;
                return;
              } else if (it.sep) {
                it.value = token;
              } else {
                Object.assign(it, { key: token, sep: [] });
                this.onKeyLine = !it.explicitKey;
                return;
              }
              break;
            }
            case "block-seq": {
              const it = top.items[top.items.length - 1];
              if (it.value)
                top.items.push({ start: [], value: token });
              else
                it.value = token;
              break;
            }
            case "flow-collection": {
              const it = top.items[top.items.length - 1];
              if (!it || it.value)
                top.items.push({ start: [], key: token, sep: [] });
              else if (it.sep)
                it.value = token;
              else
                Object.assign(it, { key: token, sep: [] });
              return;
            }
            /* istanbul ignore next should not happen */
            default:
              yield* this.pop();
              yield* this.pop(token);
          }
          if ((top.type === "document" || top.type === "block-map" || top.type === "block-seq") && (token.type === "block-map" || token.type === "block-seq")) {
            const last = token.items[token.items.length - 1];
            if (last && !last.sep && !last.value && last.start.length > 0 && findNonEmptyIndex(last.start) === -1 && (token.indent === 0 || last.start.every((st) => st.type !== "comment" || st.indent < token.indent))) {
              if (top.type === "document")
                top.end = last.start;
              else
                top.items.push({ start: last.start });
              token.items.splice(-1, 1);
            }
          }
        }
      }
      *stream() {
        switch (this.type) {
          case "directive-line":
            yield { type: "directive", offset: this.offset, source: this.source };
            return;
          case "byte-order-mark":
          case "space":
          case "comment":
          case "newline":
            yield this.sourceToken;
            return;
          case "doc-mode":
          case "doc-start": {
            const doc = {
              type: "document",
              offset: this.offset,
              start: []
            };
            if (this.type === "doc-start")
              doc.start.push(this.sourceToken);
            this.stack.push(doc);
            return;
          }
        }
        yield {
          type: "error",
          offset: this.offset,
          message: `Unexpected ${this.type} token in YAML stream`,
          source: this.source
        };
      }
      *document(doc) {
        if (doc.value)
          return yield* this.lineEnd(doc);
        switch (this.type) {
          case "doc-start": {
            if (findNonEmptyIndex(doc.start) !== -1) {
              yield* this.pop();
              yield* this.step();
            } else
              doc.start.push(this.sourceToken);
            return;
          }
          case "anchor":
          case "tag":
          case "space":
          case "comment":
          case "newline":
            doc.start.push(this.sourceToken);
            return;
        }
        const bv = this.startBlockValue(doc);
        if (bv)
          this.stack.push(bv);
        else {
          yield {
            type: "error",
            offset: this.offset,
            message: `Unexpected ${this.type} token in YAML document`,
            source: this.source
          };
        }
      }
      *scalar(scalar) {
        if (this.type === "map-value-ind") {
          const prev = getPrevProps(this.peek(2));
          const start = getFirstKeyStartProps(prev);
          let sep;
          if (scalar.end) {
            sep = scalar.end;
            sep.push(this.sourceToken);
            delete scalar.end;
          } else
            sep = [this.sourceToken];
          const map = {
            type: "block-map",
            offset: scalar.offset,
            indent: scalar.indent,
            items: [{ start, key: scalar, sep }]
          };
          this.onKeyLine = true;
          this.stack[this.stack.length - 1] = map;
        } else
          yield* this.lineEnd(scalar);
      }
      *blockScalar(scalar) {
        switch (this.type) {
          case "space":
          case "comment":
          case "newline":
            scalar.props.push(this.sourceToken);
            return;
          case "scalar":
            scalar.source = this.source;
            this.atNewLine = true;
            this.indent = 0;
            if (this.onNewLine) {
              let nl = this.source.indexOf("\n") + 1;
              while (nl !== 0) {
                this.onNewLine(this.offset + nl);
                nl = this.source.indexOf("\n", nl) + 1;
              }
            }
            yield* this.pop();
            break;
          /* istanbul ignore next should not happen */
          default:
            yield* this.pop();
            yield* this.step();
        }
      }
      *blockMap(map) {
        const it = map.items[map.items.length - 1];
        switch (this.type) {
          case "newline":
            this.onKeyLine = false;
            if (it.value) {
              const end = "end" in it.value ? it.value.end : void 0;
              const last = Array.isArray(end) ? end[end.length - 1] : void 0;
              if (last?.type === "comment")
                end?.push(this.sourceToken);
              else
                map.items.push({ start: [this.sourceToken] });
            } else if (it.sep) {
              it.sep.push(this.sourceToken);
            } else {
              it.start.push(this.sourceToken);
            }
            return;
          case "space":
          case "comment":
            if (it.value) {
              map.items.push({ start: [this.sourceToken] });
            } else if (it.sep) {
              it.sep.push(this.sourceToken);
            } else {
              if (this.atIndentedComment(it.start, map.indent)) {
                const prev = map.items[map.items.length - 2];
                const end = prev?.value?.end;
                if (Array.isArray(end)) {
                  arrayPushArray(end, it.start);
                  end.push(this.sourceToken);
                  map.items.pop();
                  return;
                }
              }
              it.start.push(this.sourceToken);
            }
            return;
        }
        if (this.indent >= map.indent) {
          const atMapIndent = !this.onKeyLine && this.indent === map.indent;
          const atNextItem = atMapIndent && (it.sep || it.explicitKey) && this.type !== "seq-item-ind";
          let start = [];
          if (atNextItem && it.sep && !it.value) {
            const nl = [];
            for (let i = 0; i < it.sep.length; ++i) {
              const st = it.sep[i];
              switch (st.type) {
                case "newline":
                  nl.push(i);
                  break;
                case "space":
                  break;
                case "comment":
                  if (st.indent > map.indent)
                    nl.length = 0;
                  break;
                default:
                  nl.length = 0;
              }
            }
            if (nl.length >= 2)
              start = it.sep.splice(nl[1]);
          }
          switch (this.type) {
            case "anchor":
            case "tag":
              if (atNextItem || it.value) {
                start.push(this.sourceToken);
                map.items.push({ start });
                this.onKeyLine = true;
              } else if (it.sep) {
                it.sep.push(this.sourceToken);
              } else {
                it.start.push(this.sourceToken);
              }
              return;
            case "explicit-key-ind":
              if (!it.sep && !it.explicitKey) {
                it.start.push(this.sourceToken);
                it.explicitKey = true;
              } else if (atNextItem || it.value) {
                start.push(this.sourceToken);
                map.items.push({ start, explicitKey: true });
              } else {
                this.stack.push({
                  type: "block-map",
                  offset: this.offset,
                  indent: this.indent,
                  items: [{ start: [this.sourceToken], explicitKey: true }]
                });
              }
              this.onKeyLine = true;
              return;
            case "map-value-ind":
              if (it.explicitKey) {
                if (!it.sep) {
                  if (includesToken(it.start, "newline")) {
                    Object.assign(it, { key: null, sep: [this.sourceToken] });
                  } else {
                    const start2 = getFirstKeyStartProps(it.start);
                    this.stack.push({
                      type: "block-map",
                      offset: this.offset,
                      indent: this.indent,
                      items: [{ start: start2, key: null, sep: [this.sourceToken] }]
                    });
                  }
                } else if (it.value) {
                  map.items.push({ start: [], key: null, sep: [this.sourceToken] });
                } else if (includesToken(it.sep, "map-value-ind")) {
                  this.stack.push({
                    type: "block-map",
                    offset: this.offset,
                    indent: this.indent,
                    items: [{ start, key: null, sep: [this.sourceToken] }]
                  });
                } else if (isFlowToken(it.key) && !includesToken(it.sep, "newline")) {
                  const start2 = getFirstKeyStartProps(it.start);
                  const key = it.key;
                  const sep = it.sep;
                  sep.push(this.sourceToken);
                  delete it.key;
                  delete it.sep;
                  this.stack.push({
                    type: "block-map",
                    offset: this.offset,
                    indent: this.indent,
                    items: [{ start: start2, key, sep }]
                  });
                } else if (start.length > 0) {
                  it.sep = it.sep.concat(start, this.sourceToken);
                } else {
                  it.sep.push(this.sourceToken);
                }
              } else {
                if (!it.sep) {
                  Object.assign(it, { key: null, sep: [this.sourceToken] });
                } else if (it.value || atNextItem) {
                  map.items.push({ start, key: null, sep: [this.sourceToken] });
                } else if (includesToken(it.sep, "map-value-ind")) {
                  this.stack.push({
                    type: "block-map",
                    offset: this.offset,
                    indent: this.indent,
                    items: [{ start: [], key: null, sep: [this.sourceToken] }]
                  });
                } else {
                  it.sep.push(this.sourceToken);
                }
              }
              this.onKeyLine = true;
              return;
            case "alias":
            case "scalar":
            case "single-quoted-scalar":
            case "double-quoted-scalar": {
              const fs = this.flowScalar(this.type);
              if (atNextItem || it.value) {
                map.items.push({ start, key: fs, sep: [] });
                this.onKeyLine = true;
              } else if (it.sep) {
                this.stack.push(fs);
              } else {
                Object.assign(it, { key: fs, sep: [] });
                this.onKeyLine = true;
              }
              return;
            }
            default: {
              const bv = this.startBlockValue(map);
              if (bv) {
                if (bv.type === "block-seq") {
                  if (!it.explicitKey && it.sep && !includesToken(it.sep, "newline")) {
                    yield* this.pop({
                      type: "error",
                      offset: this.offset,
                      message: "Unexpected block-seq-ind on same line with key",
                      source: this.source
                    });
                    return;
                  }
                } else if (atMapIndent) {
                  map.items.push({ start });
                }
                this.stack.push(bv);
                return;
              }
            }
          }
        }
        yield* this.pop();
        yield* this.step();
      }
      *blockSequence(seq) {
        const it = seq.items[seq.items.length - 1];
        switch (this.type) {
          case "newline":
            if (it.value) {
              const end = "end" in it.value ? it.value.end : void 0;
              const last = Array.isArray(end) ? end[end.length - 1] : void 0;
              if (last?.type === "comment")
                end?.push(this.sourceToken);
              else
                seq.items.push({ start: [this.sourceToken] });
            } else
              it.start.push(this.sourceToken);
            return;
          case "space":
          case "comment":
            if (it.value)
              seq.items.push({ start: [this.sourceToken] });
            else {
              if (this.atIndentedComment(it.start, seq.indent)) {
                const prev = seq.items[seq.items.length - 2];
                const end = prev?.value?.end;
                if (Array.isArray(end)) {
                  arrayPushArray(end, it.start);
                  end.push(this.sourceToken);
                  seq.items.pop();
                  return;
                }
              }
              it.start.push(this.sourceToken);
            }
            return;
          case "anchor":
          case "tag":
            if (it.value || this.indent <= seq.indent)
              break;
            it.start.push(this.sourceToken);
            return;
          case "seq-item-ind":
            if (this.indent !== seq.indent)
              break;
            if (it.value || includesToken(it.start, "seq-item-ind"))
              seq.items.push({ start: [this.sourceToken] });
            else
              it.start.push(this.sourceToken);
            return;
        }
        if (this.indent > seq.indent) {
          const bv = this.startBlockValue(seq);
          if (bv) {
            this.stack.push(bv);
            return;
          }
        }
        yield* this.pop();
        yield* this.step();
      }
      *flowCollection(fc) {
        const it = fc.items[fc.items.length - 1];
        if (this.type === "flow-error-end") {
          let top;
          do {
            yield* this.pop();
            top = this.peek(1);
          } while (top?.type === "flow-collection");
        } else if (fc.end.length === 0) {
          switch (this.type) {
            case "comma":
            case "explicit-key-ind":
              if (!it || it.sep)
                fc.items.push({ start: [this.sourceToken] });
              else
                it.start.push(this.sourceToken);
              return;
            case "map-value-ind":
              if (!it || it.value)
                fc.items.push({ start: [], key: null, sep: [this.sourceToken] });
              else if (it.sep)
                it.sep.push(this.sourceToken);
              else
                Object.assign(it, { key: null, sep: [this.sourceToken] });
              return;
            case "space":
            case "comment":
            case "newline":
            case "anchor":
            case "tag":
              if (!it || it.value)
                fc.items.push({ start: [this.sourceToken] });
              else if (it.sep)
                it.sep.push(this.sourceToken);
              else
                it.start.push(this.sourceToken);
              return;
            case "alias":
            case "scalar":
            case "single-quoted-scalar":
            case "double-quoted-scalar": {
              const fs = this.flowScalar(this.type);
              if (!it || it.value)
                fc.items.push({ start: [], key: fs, sep: [] });
              else if (it.sep)
                this.stack.push(fs);
              else
                Object.assign(it, { key: fs, sep: [] });
              return;
            }
            case "flow-map-end":
            case "flow-seq-end":
              fc.end.push(this.sourceToken);
              return;
          }
          const bv = this.startBlockValue(fc);
          if (bv)
            this.stack.push(bv);
          else {
            yield* this.pop();
            yield* this.step();
          }
        } else {
          const parent = this.peek(2);
          if (parent.type === "block-map" && (this.type === "map-value-ind" && parent.indent === fc.indent || this.type === "newline" && !parent.items[parent.items.length - 1].sep)) {
            yield* this.pop();
            yield* this.step();
          } else if (this.type === "map-value-ind" && parent.type !== "flow-collection") {
            const prev = getPrevProps(parent);
            const start = getFirstKeyStartProps(prev);
            fixFlowSeqItems(fc);
            const sep = fc.end.splice(1, fc.end.length);
            sep.push(this.sourceToken);
            const map = {
              type: "block-map",
              offset: fc.offset,
              indent: fc.indent,
              items: [{ start, key: fc, sep }]
            };
            this.onKeyLine = true;
            this.stack[this.stack.length - 1] = map;
          } else {
            yield* this.lineEnd(fc);
          }
        }
      }
      flowScalar(type) {
        if (this.onNewLine) {
          let nl = this.source.indexOf("\n") + 1;
          while (nl !== 0) {
            this.onNewLine(this.offset + nl);
            nl = this.source.indexOf("\n", nl) + 1;
          }
        }
        return {
          type,
          offset: this.offset,
          indent: this.indent,
          source: this.source
        };
      }
      startBlockValue(parent) {
        switch (this.type) {
          case "alias":
          case "scalar":
          case "single-quoted-scalar":
          case "double-quoted-scalar":
            return this.flowScalar(this.type);
          case "block-scalar-header":
            return {
              type: "block-scalar",
              offset: this.offset,
              indent: this.indent,
              props: [this.sourceToken],
              source: ""
            };
          case "flow-map-start":
          case "flow-seq-start":
            return {
              type: "flow-collection",
              offset: this.offset,
              indent: this.indent,
              start: this.sourceToken,
              items: [],
              end: []
            };
          case "seq-item-ind":
            return {
              type: "block-seq",
              offset: this.offset,
              indent: this.indent,
              items: [{ start: [this.sourceToken] }]
            };
          case "explicit-key-ind": {
            this.onKeyLine = true;
            const prev = getPrevProps(parent);
            const start = getFirstKeyStartProps(prev);
            start.push(this.sourceToken);
            return {
              type: "block-map",
              offset: this.offset,
              indent: this.indent,
              items: [{ start, explicitKey: true }]
            };
          }
          case "map-value-ind": {
            this.onKeyLine = true;
            const prev = getPrevProps(parent);
            const start = getFirstKeyStartProps(prev);
            return {
              type: "block-map",
              offset: this.offset,
              indent: this.indent,
              items: [{ start, key: null, sep: [this.sourceToken] }]
            };
          }
        }
        return null;
      }
      atIndentedComment(start, indent) {
        if (this.type !== "comment")
          return false;
        if (this.indent <= indent)
          return false;
        return start.every((st) => st.type === "newline" || st.type === "space");
      }
      *documentEnd(docEnd) {
        if (this.type !== "doc-mode") {
          if (docEnd.end)
            docEnd.end.push(this.sourceToken);
          else
            docEnd.end = [this.sourceToken];
          if (this.type === "newline")
            yield* this.pop();
        }
      }
      *lineEnd(token) {
        switch (this.type) {
          case "comma":
          case "doc-start":
          case "doc-end":
          case "flow-seq-end":
          case "flow-map-end":
          case "map-value-ind":
            yield* this.pop();
            yield* this.step();
            break;
          case "newline":
            this.onKeyLine = false;
          // fallthrough
          case "space":
          case "comment":
          default:
            if (token.end)
              token.end.push(this.sourceToken);
            else
              token.end = [this.sourceToken];
            if (this.type === "newline")
              yield* this.pop();
        }
      }
    };
    exports.Parser = Parser;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/public-api.js
var require_public_api = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/public-api.js"(exports) {
    "use strict";
    var composer = require_composer();
    var Document = require_Document();
    var errors = require_errors();
    var log = require_log();
    var identity = require_identity();
    var lineCounter = require_line_counter();
    var parser = require_parser();
    function parseOptions(options) {
      const prettyErrors = options.prettyErrors !== false;
      const lineCounter$1 = options.lineCounter || prettyErrors && new lineCounter.LineCounter() || null;
      return { lineCounter: lineCounter$1, prettyErrors };
    }
    function parseAllDocuments(source, options = {}) {
      const { lineCounter: lineCounter2, prettyErrors } = parseOptions(options);
      const parser$1 = new parser.Parser(lineCounter2?.addNewLine);
      const composer$1 = new composer.Composer(options);
      const docs = Array.from(composer$1.compose(parser$1.parse(source)));
      if (prettyErrors && lineCounter2)
        for (const doc of docs) {
          doc.errors.forEach(errors.prettifyError(source, lineCounter2));
          doc.warnings.forEach(errors.prettifyError(source, lineCounter2));
        }
      if (docs.length > 0)
        return docs;
      return Object.assign([], { empty: true }, composer$1.streamInfo());
    }
    function parseDocument(source, options = {}) {
      const { lineCounter: lineCounter2, prettyErrors } = parseOptions(options);
      const parser$1 = new parser.Parser(lineCounter2?.addNewLine);
      const composer$1 = new composer.Composer(options);
      let doc = null;
      for (const _doc of composer$1.compose(parser$1.parse(source), true, source.length)) {
        if (!doc)
          doc = _doc;
        else if (doc.options.logLevel !== "silent") {
          doc.errors.push(new errors.YAMLParseError(_doc.range.slice(0, 2), "MULTIPLE_DOCS", "Source contains multiple documents; please use YAML.parseAllDocuments()"));
          break;
        }
      }
      if (prettyErrors && lineCounter2) {
        doc.errors.forEach(errors.prettifyError(source, lineCounter2));
        doc.warnings.forEach(errors.prettifyError(source, lineCounter2));
      }
      return doc;
    }
    function parse(src, reviver, options) {
      let _reviver = void 0;
      if (typeof reviver === "function") {
        _reviver = reviver;
      } else if (options === void 0 && reviver && typeof reviver === "object") {
        options = reviver;
      }
      const doc = parseDocument(src, options);
      if (!doc)
        return null;
      doc.warnings.forEach((warning) => log.warn(doc.options.logLevel, warning));
      if (doc.errors.length > 0) {
        if (doc.options.logLevel !== "silent")
          throw doc.errors[0];
        else
          doc.errors = [];
      }
      return doc.toJS(Object.assign({ reviver: _reviver }, options));
    }
    function stringify(value, replacer, options) {
      let _replacer = null;
      if (typeof replacer === "function" || Array.isArray(replacer)) {
        _replacer = replacer;
      } else if (options === void 0 && replacer) {
        options = replacer;
      }
      if (typeof options === "string")
        options = options.length;
      if (typeof options === "number") {
        const indent = Math.round(options);
        options = indent < 1 ? void 0 : indent > 8 ? { indent: 8 } : { indent };
      }
      if (value === void 0) {
        const { keepUndefined } = options ?? replacer ?? {};
        if (!keepUndefined)
          return void 0;
      }
      if (identity.isDocument(value) && !_replacer)
        return value.toString(options);
      return new Document.Document(value, _replacer, options).toString(options);
    }
    exports.parse = parse;
    exports.parseAllDocuments = parseAllDocuments;
    exports.parseDocument = parseDocument;
    exports.stringify = stringify;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/index.js
var require_dist = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/index.js"(exports) {
    "use strict";
    var composer = require_composer();
    var Document = require_Document();
    var Schema = require_Schema();
    var errors = require_errors();
    var Alias = require_Alias();
    var identity = require_identity();
    var Pair = require_Pair();
    var Scalar = require_Scalar();
    var YAMLMap = require_YAMLMap();
    var YAMLSeq = require_YAMLSeq();
    var cst = require_cst();
    var lexer = require_lexer();
    var lineCounter = require_line_counter();
    var parser = require_parser();
    var publicApi = require_public_api();
    var visit = require_visit();
    exports.Composer = composer.Composer;
    exports.Document = Document.Document;
    exports.Schema = Schema.Schema;
    exports.YAMLError = errors.YAMLError;
    exports.YAMLParseError = errors.YAMLParseError;
    exports.YAMLWarning = errors.YAMLWarning;
    exports.Alias = Alias.Alias;
    exports.isAlias = identity.isAlias;
    exports.isCollection = identity.isCollection;
    exports.isDocument = identity.isDocument;
    exports.isMap = identity.isMap;
    exports.isNode = identity.isNode;
    exports.isPair = identity.isPair;
    exports.isScalar = identity.isScalar;
    exports.isSeq = identity.isSeq;
    exports.Pair = Pair.Pair;
    exports.Scalar = Scalar.Scalar;
    exports.YAMLMap = YAMLMap.YAMLMap;
    exports.YAMLSeq = YAMLSeq.YAMLSeq;
    exports.CST = cst;
    exports.Lexer = lexer.Lexer;
    exports.LineCounter = lineCounter.LineCounter;
    exports.Parser = parser.Parser;
    exports.parse = publicApi.parse;
    exports.parseAllDocuments = publicApi.parseAllDocuments;
    exports.parseDocument = publicApi.parseDocument;
    exports.stringify = publicApi.stringify;
    exports.visit = visit.visit;
    exports.visitAsync = visit.visitAsync;
  }
});

// packages/cli/src/cli.ts
import { readFile as readFile4, stat } from "node:fs/promises";
import { basename, join as join8 } from "node:path";
import { pathToFileURL } from "node:url";

// packages/spec/src/types.ts
var REQUIRED_BOT_HEADINGS = [
  "when to use",
  "required inputs and access",
  "sequence of work",
  "how to validate the result",
  "what to return",
  "approvals and safety"
];
var RUNTIMES = ["grok-bot", "grok-build", "both"];
var SKILL_NAME_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// packages/spec/src/parse.ts
var import_yaml = __toESM(require_dist(), 1);
var FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;
function headingList(body) {
  return [...body.matchAll(/^#{1,3}\s+(.+)$/gm)].map(
    (m) => m[1].trim().toLowerCase().replace(/[.:]/g, "")
  );
}
function asString(value) {
  return typeof value === "string" ? value.trim() : "";
}
function asStringList(value) {
  if (Array.isArray(value)) {
    return value.map((v) => String(v).trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value.split(/[,\s]+/).map((v) => v.trim()).filter(Boolean);
  }
  return [];
}
function normalizeRuntime(value) {
  if (typeof value === "string" && RUNTIMES.includes(value)) {
    return value;
  }
  return "both";
}
function parseSkillMarkdown(content, filePath = "SKILL.md") {
  const match = content.match(FRONTMATTER_RE);
  let frontmatter = {};
  let body = content;
  if (match) {
    const parsed = (0, import_yaml.parse)(match[1]);
    frontmatter = parsed && typeof parsed === "object" ? parsed : {};
    body = match[2] ?? "";
  }
  const metadata = frontmatter.metadata && typeof frontmatter.metadata === "object" ? frontmatter.metadata : {};
  const dir = filePath.replace(/[/\\]SKILL\.md$/i, "");
  const folderName = dir.split(/[/\\]/).filter(Boolean).pop() ?? "unnamed-skill";
  const firstParagraph = body.split(/\n\n+/).map((p) => p.replace(/^#+\s+.+\n?/, "").trim()).find((p) => p.length > 0) ?? "";
  const name = asString(frontmatter.name) || folderName;
  const description = asString(frontmatter.description) || firstParagraph;
  const whenToUse = asString(frontmatter["when-to-use"]) || asString(frontmatter.when_to_use);
  return {
    path: filePath,
    dir,
    name,
    description,
    whenToUse,
    body: body.trim(),
    frontmatter,
    metadata,
    runtime: normalizeRuntime(metadata.runtime),
    connectors: asStringList(metadata.connectors),
    computerUse: Boolean(metadata["computer-use"]),
    approvals: asStringList(metadata.approvals),
    headings: headingList(body)
  };
}
function headingMatches(headings, required) {
  const needle = required.toLowerCase();
  return headings.some((h) => h.includes(needle) || needle.includes(h));
}

// packages/spec/src/check.ts
var CREDENTIAL_RE = /\b(api[_-]?key|secret|password|token)\s*[:=]\s*['"]?[A-Za-z0-9_\-]{12,}/i;
var PIPE_BASH_RE = /curl\s+[^\n|]+\|\s*(?:ba)?sh/i;
var IGNORE_PREVIOUS_RE = /ignore (all )?(previous|prior) instructions/i;
function checkSkill(skill) {
  const issues = [];
  if (!skill.name) {
    issues.push({ level: "error", code: "name.missing", message: "Skill name is required." });
  } else if (!SKILL_NAME_RE.test(skill.name)) {
    issues.push({
      level: "error",
      code: "name.invalid",
      message: "Name must be lowercase letters, digits, and single hyphens (1\u201364 chars)."
    });
  } else if (skill.name.length > 64) {
    issues.push({ level: "error", code: "name.length", message: "Name must be at most 64 characters." });
  }
  if (!skill.description) {
    issues.push({
      level: "error",
      code: "description.missing",
      message: "Description is required (frontmatter or first body paragraph)."
    });
  } else if (skill.description.length > 1024) {
    issues.push({
      level: "error",
      code: "description.length",
      message: "Description must be at most 1024 characters."
    });
  }
  const botLike = skill.runtime === "grok-bot" || skill.runtime === "both";
  if (botLike) {
    for (const required of REQUIRED_BOT_HEADINGS) {
      if (!headingMatches(skill.headings, required)) {
        issues.push({
          level: "error",
          code: "heading.missing",
          message: `Grok Bot skills must include a heading covering: ${required}.`
        });
      }
    }
    if (skill.approvals.length === 0) {
      issues.push({
        level: "error",
        code: "approvals.missing",
        message: "Set metadata.approvals (or an Approvals section) for Grok Bot skills."
      });
    }
  }
  const blob = `${skill.description}
${skill.body}`;
  if (CREDENTIAL_RE.test(blob)) {
    issues.push({
      level: "error",
      code: "security.credential",
      message: "Possible hardcoded credential detected."
    });
  }
  if (PIPE_BASH_RE.test(blob)) {
    issues.push({
      level: "error",
      code: "security.pipe-bash",
      message: "curl | bash patterns are not allowed in listed skills."
    });
  }
  if (IGNORE_PREVIOUS_RE.test(blob)) {
    issues.push({
      level: "error",
      code: "security.injection",
      message: "Prompt-injection phrasing detected."
    });
  }
  if (skill.body.length > 8e4) {
    issues.push({
      level: "warning",
      code: "body.size",
      message: "SKILL.md body is unusually large."
    });
  }
  return { ok: issues.every((i) => i.level !== "error"), issues };
}

// packages/core/src/discover.ts
import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
var SKIP_DIRS = /* @__PURE__ */ new Set(["node_modules", ".git", "dist", ".next"]);
async function readSkill(skillMdPath, sourceRoot) {
  const content = await readFile(skillMdPath, "utf8");
  const parsed = parseSkillMarkdown(content, skillMdPath);
  return { ...parsed, sourceRoot };
}
async function discoverSkills(root) {
  const found = [];
  const seen = /* @__PURE__ */ new Set();
  async function addSkill(skillMdPath) {
    const skill = await readSkill(skillMdPath, root);
    if (seen.has(skill.name)) {
      return;
    }
    seen.add(skill.name);
    found.push(skill);
  }
  const rootSkill = join(root, "SKILL.md");
  if (existsSync(rootSkill)) {
    await addSkill(rootSkill);
  }
  await scanImmediateChildren(root, addSkill);
  const scanRoots = [
    join(root, "skills"),
    join(root, "skills", ".curated"),
    join(root, "skills", ".experimental"),
    join(root, ".grok", "skills")
  ];
  for (const scanRoot of scanRoots) {
    await scanImmediateChildren(scanRoot, addSkill);
  }
  const skillsDir = join(root, "skills");
  if (existsSync(skillsDir)) {
    await walkSkills(skillsDir, 0, 3, addSkill);
  }
  return found;
}
async function scanImmediateChildren(dir, addSkill) {
  if (!existsSync(dir)) {
    return;
  }
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry2 of entries) {
    if (!entry2.isDirectory() || SKIP_DIRS.has(entry2.name)) {
      continue;
    }
    const skillMd = join(dir, entry2.name, "SKILL.md");
    if (existsSync(skillMd)) {
      await addSkill(skillMd);
    }
  }
}
async function walkSkills(dir, depth, maxDepth, addSkill) {
  if (depth > maxDepth) {
    return;
  }
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry2 of entries) {
    if (SKIP_DIRS.has(entry2.name)) {
      continue;
    }
    if (!entry2.isDirectory()) {
      continue;
    }
    const child = join(dir, entry2.name);
    const skillMd = join(child, "SKILL.md");
    if (existsSync(skillMd)) {
      await addSkill(skillMd);
    }
    if (depth < maxDepth) {
      await walkSkills(child, depth + 1, maxDepth, addSkill);
    }
  }
}

// packages/core/src/resolve.ts
import { existsSync as existsSync3 } from "node:fs";
import { resolve } from "node:path";

// packages/core/src/search.ts
import { existsSync as existsSync2, readFileSync } from "node:fs";
import { join as join2 } from "node:path";

// packages/core/src/bundled-catalog.json
var bundled_catalog_default = {
  generatedAt: "2026-09-02T02:14:00.946Z",
  source: "samanyugoyal2010/grok-skills",
  count: 162,
  skills: [
    {
      id: "samanyugoyal2010/grok-skills/expense-draft",
      skillId: "expense-draft",
      name: "expense-draft",
      description: "Draft an expense report from receipts without submitting. Use when the user asks about expense report, file expenses, receipts.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "browser",
        "drive"
      ],
      computerUse: true,
      approvals: [
        "submit-expense",
        "purchase"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Draft an expense report from receipts without submitting",
      category: "finance",
      featured: true,
      skillMd: "---\nname: expense-draft\ndescription: >\n  Match receipts to policy and draft an expense report without submitting.\n  Use when filing expenses, reconciling receipts, or preparing a report.\nwhen-to-use: expense report, receipts, file expenses\nmetadata:\n  author: grok-skills\n  short-description: Draft expense report from receipts\n  runtime: grok-bot\n  connectors: [browser, drive]\n  computer-use: true\n  approvals: [submit-expense, purchase]\n  category: finance\n---\n\n## When to use\n\nPrepare an expense report. Do not book travel or submit payment.\n\n## Required inputs and access\n\n- Receipts (files, Drive folder, or mail attachments)\n- Policy: alcohol, caps, attendees. If none, list assumptions and flag every line as unverified\n- Expense tool login only if they want in-app draft; otherwise a table is enough\n\n## Sequence of work\n\n1. Extract merchant, date, amount, currency, category per receipt. Omit unreadable files and say so.\n2. Check policy; flag exceptions with the rule.\n3. Draft the report in the tool **without clicking submit**, or as a table.\n4. Totals must match included receipts.\n\n## How to validate the result\n\nSubmit was not pressed. Totals reconcile. Exceptions listed. No invented receipts.\n\n## What to return\n\nDraft report + exceptions + \u201Cready to submit if you approve\u201D.\n\n## Approvals and safety\n\nSubmit, reimbursement, and any purchase need approval. Computer-use: stay on the expense app they named. Never reuse last month\u2019s lines when new receipts are missing.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/find-skills",
      skillId: "find-skills",
      name: "find-skills",
      description: "Discover and install Grok Bot skills from the grok-skills catalog. Use when the user asks about how do I, find a skill, is there a skill, install a skill, search skills, extend grok bot, missing capability.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [],
      computerUse: false,
      approvals: [
        "install-skill"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Discover and install Grok Bot skills from the grok-skills catalog",
      category: "meta",
      featured: true,
      skillMd: '---\nname: find-skills\ndescription: >\n  Discover and install Grok skills from the grok-skills catalog when the user\n  asks to find a skill, install a skill, search skills, extend Grok Bot, or\n  says they need a capability that might already exist as a skill.\nwhen-to-use: find a skill, is there a skill, install a skill, search skills, extend grok bot\nmetadata:\n  author: grok-skills\n  short-description: Discover and install skills from the grok-skills catalog\n  runtime: grok-bot\n  connectors: []\n  computer-use: false\n  approvals: [install-skill]\n  category: meta\n---\n\n## When to use\n\nUse when the user wants a **catalog skill** they do not already have: \u201Cfind a skill for inbox triage\u201D, \u201Cinstall the expense skill\u201D, \u201Cis there a skill for QBRs\u201D.\n\nDo not use for general \u201Chow do I \u2026\u201D coding questions that are not about installing skills. Do not use this skill in place of inbox-triage, pr-review-pack, or other domain skills.\n\n## Required inputs and access\n\n- The user\u2019s task in one sentence\n- Network to run `npx github:samanyugoyal2010/grok-skills` (bundled catalog; does not need GitHub `main`)\n\n## Sequence of work\n\n1. Keywords: 2\u20135 words from the task.\n2. Search:\n\n```bash\nnpx --yes github:samanyugoyal2010/grok-skills find "<keywords>" --json\n```\n\nCheckout fallback: `node bin/grok-skills.mjs find "<keywords>" --json`\n\n3. Show the top matches: name, short description, connectors, approvals, add command.\n4. Install **one skill by catalog name** only after they agree (or immediately if they said install it):\n\n```bash\nnpx --yes github:samanyugoyal2010/grok-skills add <name> -g\n```\n\n5. Open `~/.grok/skills/<name>/SKILL.md` and continue the original task with that skill.\n\n## How to validate the result\n\nSearch JSON contains `skills[]`. Install created `SKILL.md`. You did not add an entire GitHub repo. You did not invent a skill that was not in the JSON.\n\n## What to return\n\nMatches table + what you installed + whether Grok Build vs Grok Bot still needs a paste into Plugins.\n\n## Approvals and safety\n\n`install-skill` requires a yes unless the user already asked to install a named skill. Never `add owner/repo` without `--skill` or a catalog name. Never execute scripts inside a downloaded skill before reading SKILL.md.\n\n## Grok Bot vs Grok Build\n\nGrok **Build** reads `~/.grok/skills` and project `.grok/skills`. Grok **Bot** slash commands come from saved/plugin skills. If `/` does not list it, paste SKILL.md (print with `npx --yes github:samanyugoyal2010/grok-skills print <name>`) or enable under Settings \u2192 Plugins.\n'
    },
    {
      id: "samanyugoyal2010/grok-skills/inbox-triage",
      skillId: "inbox-triage",
      name: "inbox-triage",
      description: "Triage an inbox into needs-reply, FYI, and noise. Use when the user asks about inbox triage, catch up on email, gmail review.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "gmail"
      ],
      computerUse: false,
      approvals: [
        "send-email",
        "archive"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Triage an inbox into needs-reply, FYI, and noise",
      category: "inbox",
      featured: true,
      skillMd: "---\nname: inbox-triage\ndescription: >\n  Triage Gmail/Outlook into needs-reply, FYI, and noise and draft replies\n  without sending. Use when the user asks to catch up on email, triage an\n  inbox, or clear unread mail.\nwhen-to-use: inbox triage, catch up on email, gmail review, unread mail\nmetadata:\n  author: grok-skills\n  short-description: Inbox triage with draft-only replies\n  runtime: grok-bot\n  connectors: [gmail]\n  computer-use: false\n  approvals: [send-email, archive]\n  category: inbox\n---\n\n## When to use\n\nUse for a time-boxed inbox pass (default last 24 hours, or the window they name). Do not use to send mail, manage calendar, or file expenses.\n\n## Required inputs and access\n\n- Mail connector with **read** access (Gmail or Outlook)\n- Optional: VIP list, mute senders, lookback window\n- If the connector is missing, stop and say which plugin to enable. Do not scrape the mail website unless they explicitly allow computer-use.\n\n## Sequence of work\n\n1. Confirm the window and VIP rules. Default: unread + last 24h.\n2. Fetch thread ids, from, subject, date, unread. Do not dump full bodies of unrelated people into shared chats.\n3. Label each thread: `needs-reply`, `FYI`, `noise`, `needs-human`.\n4. For `needs-reply`, draft a reply in the user\u2019s voice. Mark it DRAFT. Do not send.\n5. Return a digest grouped by label with thread ids and draft text.\n\n## How to validate the result\n\nEvery row has a thread id. No send/archive/delete ran. Drafts are labeled drafts. If mail cannot be read, report the connector error instead of guessing.\n\n## What to return\n\nDigest + drafts + a short list of actions still needing approval (send, archive).\n\n## Approvals and safety\n\nSending, forwarding, deleting, and bulk archive require approval. Never paste other customers\u2019 mail into Slack. If the mailbox is unreadable, stop.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/pr-review-pack",
      skillId: "pr-review-pack",
      name: "pr-review-pack",
      description: "Build a structured PR review pack. Use when the user asks about pr review, review this pull request.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "github"
      ],
      computerUse: false,
      approvals: [
        "merge-pr",
        "production-change"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Build a structured PR review pack",
      category: "eng",
      featured: true,
      skillMd: "---\nname: pr-review-pack\ndescription: >\n  Build a structured pull-request review: summary, risks, tests, and questions.\n  Use when asked to review a PR. Do not merge, approve, or push.\nwhen-to-use: pr review, review this pull request, github review\nmetadata:\n  author: grok-skills\n  short-description: Structured PR review pack\n  runtime: grok-bot\n  connectors: [github]\n  computer-use: false\n  approvals: [merge-pr, production-change]\n  category: eng\n---\n\n## When to use\n\nReview a named PR (URL or number). Not for writing the feature.\n\n## Required inputs and access\n\n- PR URL or repo + number\n- GitHub **read** (gh, API, or checked-out diff)\n- Test/CI status if available\n\n## Sequence of work\n\n1. Read the PR title, description, and diff. Note missing tests.\n2. Summarize intent in 5 lines.\n3. List risks (auth, data, migrations, API breaks) with file paths.\n4. List what you would test. Do not merge. Do not click approve.\n5. Open questions for the author.\n\n## How to validate the result\n\nEvery risk cites a path. No merge/approve. Secrets in the diff are flagged, not copied.\n\n## What to return\n\nReview pack ready to paste as a comment **if they ask**. Default: only in this conversation.\n\n## Approvals and safety\n\nMerge, force-push, production deploy, and publishing the review on GitHub need approval.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/staging-repro-pack",
      skillId: "staging-repro-pack",
      name: "staging-repro-pack",
      description: "Reproduce a bug in staging and return a repro pack. Use when the user asks about reproduce bug, staging repro, ticket repro.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "browser"
      ],
      computerUse: true,
      approvals: [
        "customer-contact",
        "production-access"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Reproduce a bug in staging and return a repro pack",
      category: "support",
      featured: true,
      skillMd: "---\nname: staging-repro-pack\ndescription: >\n  Reproduce a bug in staging and return steps, evidence, and a minimal test\n  case. Use for ticket repros. Never use production or real customer data.\nwhen-to-use: reproduce bug, staging repro, ticket repro pack\nmetadata:\n  author: grok-skills\n  short-description: Staging bug repro pack\n  runtime: grok-bot\n  connectors: [browser, github]\n  computer-use: true\n  approvals: [production-access, customer-data]\n  category: support\n---\n\n## When to use\n\nStaging reproduction of a reported bug. Not for production hotfixes.\n\n## Required inputs and access\n\n- Ticket or report (expected vs actual)\n- Staging URL and a **fresh test account**\n- Browser on the Bot computer\n- Optional repo for a failing test\n\n## Sequence of work\n\n1. Extract expected vs actual and environment.\n2. Use only staging + test account. If they offer production, refuse.\n3. Reproduce; capture steps, screenshots, console/network notes.\n4. If it reproduces and a repo is in scope, add a minimal failing test. Do not merge.\n5. If it does not, document attempts and blockers.\n\n## How to validate the result\n\nPack has steps, browser/OS, expected vs actual, evidence. Production untouched. No customer PII.\n\n## What to return\n\nRepro pack in the conversation.\n\n## Approvals and safety\n\nProduction access and real customer data are forbidden without explicit approval. Do not post to Slack/GitHub until they approve. Staging down: fail, do not switch to production.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/weekly-account-health",
      skillId: "weekly-account-health",
      name: "weekly-account-health",
      description: "Score CRM accounts for churn and expansion risk. Use when the user asks about weekly account health, churn risk, customer-risk.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "salesforce"
      ],
      computerUse: false,
      approvals: [
        "customer-contact",
        "send-email"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Score CRM accounts for churn and expansion risk",
      category: "crm",
      featured: true,
      skillMd: "---\nname: weekly-account-health\ndescription: >\n  Score CRM accounts for churn and expansion risk and return a review list.\n  Use for weekly account health, customer-risk, or churn review. Never contact\n  customers from this skill.\nwhen-to-use: weekly account health, churn risk, customer risk review\nmetadata:\n  author: grok-skills\n  short-description: Weekly CRM risk review\n  runtime: grok-bot\n  connectors: [salesforce]\n  computer-use: false\n  approvals: [customer-contact, send-email]\n  category: crm\n---\n\n## When to use\n\nRecurring CRM health. Not for one-off account research (use account-research) and not for outbound (use outbound-drafts).\n\n## Required inputs and access\n\n- Salesforce (or named CRM) **read** on a list view or report they name\n- Risk rules, or use: no activity 14d = medium, open sev ticket = high, renewal < 60d with usage down = high\n- Time window default 7 days\n\n## Sequence of work\n\n1. Pull Account Id, Name, Owner, ARR if present, last activity, open cases, next close date.\n2. Score each account with the rule that fired. Skip anyone they mark as in an active sequence.\n3. Up to three contacts per at-risk account from CRM only. Do not email or LinkedIn them.\n4. Table: account, id, score, evidence, recommended next step (human).\n\n## How to validate the result\n\nEvery row has an Account Id. Scores cite fields. No CRM writes. No customer contact.\n\n## What to return\n\nReview list only. Stop.\n\n## Approvals and safety\n\nCustomer contact, email, and sequence enrollment always need approval. Missing CRM: stop, do not reuse last week\u2019s extract.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/access-review-pack",
      skillId: "access-review-pack",
      name: "access-review-pack",
      description: "Assemble an access-review pack. Use when the user asks about access review, soc2 access.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "browser"
      ],
      computerUse: true,
      approvals: [
        "vendor-change",
        "purchase"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Assemble an access-review pack",
      category: "ops",
      featured: false,
      skillMd: "---\nname: access-review-pack\ndescription: >\n  Assemble an access-review pack. Use when the user asks about access review, soc2 access.\nwhen-to-use: access review, soc2 access\nmetadata:\n  author: grok-skills\n  short-description: Assemble an access-review pack\n  runtime: grok-bot\n  connectors: [browser]\n  computer-use: true\n  approvals: [vendor-change, purchase]\n  category: ops\n---\n\n## When to use\n\nUse for: Assemble an access-review pack.\nTrigger phrases: access review, soc2 access.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to browser (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. List accounts by system if provided.\n2. Do not revoke access until approved.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: vendor-change, purchase.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is allowed for listed sites; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/account-recovery-checklist",
      skillId: "account-recovery-checklist",
      name: "account-recovery-checklist",
      description: "Checklist account-recovery steps without handling secrets. Use when the user asks about account recovery checklist, 2fa setup checklist.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "browser"
      ],
      computerUse: false,
      approvals: [
        "external-send"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Checklist account-recovery steps without handling secrets",
      category: "personal",
      featured: false,
      skillMd: "---\nname: account-recovery-checklist\ndescription: >\n  Checklist account-recovery steps without handling secrets. Use when the user asks about account recovery checklist, 2fa setup checklist.\nwhen-to-use: account recovery checklist, 2fa setup checklist\nmetadata:\n  author: grok-skills\n  short-description: Checklist account-recovery steps without handling secrets\n  runtime: grok-bot\n  connectors: [browser]\n  computer-use: false\n  approvals: [external-send]\n  category: personal\n---\n\n## When to use\n\nUse for: Checklist account-recovery steps without handling secrets.\nTrigger phrases: account recovery checklist, 2fa setup checklist.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to browser (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. List steps.\n2. Never store passwords, codes, or recovery keys.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: external-send.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/account-research",
      skillId: "account-research",
      name: "account-research",
      description: "Research an account across web and CRM. Use when the user asks about account research, company brief before a call.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "salesforce"
      ],
      computerUse: false,
      approvals: [
        "customer-contact",
        "send-email"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Research an account across web and CRM",
      category: "crm",
      featured: false,
      skillMd: "---\nname: account-research\ndescription: >\n  Research an account across web and CRM. Use when the user asks about account research, company brief before a call.\nwhen-to-use: account research, company brief before a call\nmetadata:\n  author: grok-skills\n  short-description: Research an account across web and CRM\n  runtime: grok-bot\n  connectors: [salesforce]\n  computer-use: false\n  approvals: [customer-contact, send-email]\n  category: crm\n---\n\n## When to use\n\nUse for: Research an account across web and CRM.\nTrigger phrases: account research, company brief before a call.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to salesforce (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Pull CRM + public web.\n2. Return a brief. Do not contact anyone.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: customer-contact, send-email.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/admin-console-diff",
      skillId: "admin-console-diff",
      name: "admin-console-diff",
      description: "Diff admin-console screenshots or exports. Use when the user asks about admin console diff, settings changed.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "browser"
      ],
      computerUse: true,
      approvals: [
        "saas-write",
        "send-message"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Diff admin-console screenshots or exports",
      category: "saas",
      featured: false,
      skillMd: "---\nname: admin-console-diff\ndescription: >\n  Diff admin-console screenshots or exports. Use when the user asks about admin console diff, settings changed.\nwhen-to-use: admin console diff, settings changed\nmetadata:\n  author: grok-skills\n  short-description: Diff admin-console screenshots or exports\n  runtime: grok-bot\n  connectors: [browser]\n  computer-use: true\n  approvals: [saas-write, send-message]\n  category: saas\n---\n\n## When to use\n\nUse for: Diff admin-console screenshots or exports.\nTrigger phrases: admin console diff, settings changed.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to browser (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Compare before/after.\n2. Do not revert until approved.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: saas-write, send-message.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is allowed for listed sites; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/ap-aging",
      skillId: "ap-aging",
      name: "ap-aging",
      description: "Build an accounts-payable aging list. Use when the user asks about ap aging, unpaid bills.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "browser",
        "drive"
      ],
      computerUse: true,
      approvals: [
        "submit-expense",
        "purchase"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Build an accounts-payable aging list",
      category: "finance",
      featured: false,
      skillMd: "---\nname: ap-aging\ndescription: >\n  Build an accounts-payable aging list. Use when the user asks about ap aging, unpaid bills.\nwhen-to-use: ap aging, unpaid bills\nmetadata:\n  author: grok-skills\n  short-description: Build an accounts-payable aging list\n  runtime: grok-bot\n  connectors: [browser, drive]\n  computer-use: true\n  approvals: [submit-expense, purchase]\n  category: finance\n---\n\n## When to use\n\nUse for: Build an accounts-payable aging list.\nTrigger phrases: ap aging, unpaid bills.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to browser (read unless a later step says otherwise)\n- Access to drive (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Bucket by age.\n2. Do not pay bills.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: submit-expense, purchase.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is allowed for listed sites; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/api-breaking-change-scan",
      skillId: "api-breaking-change-scan",
      name: "api-breaking-change-scan",
      description: "Scan a diff for likely breaking API changes. Use when the user asks about breaking change, api compatibility.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "github"
      ],
      computerUse: false,
      approvals: [
        "merge-pr",
        "production-change"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Scan a diff for likely breaking API changes",
      category: "eng",
      featured: false,
      skillMd: "---\nname: api-breaking-change-scan\ndescription: >\n  Scan a diff for likely breaking API changes. Use when the user asks about breaking change, api compatibility.\nwhen-to-use: breaking change, api compatibility\nmetadata:\n  author: grok-skills\n  short-description: Scan a diff for likely breaking API changes\n  runtime: grok-bot\n  connectors: [github]\n  computer-use: false\n  approvals: [merge-pr, production-change]\n  category: eng\n---\n\n## When to use\n\nUse for: Scan a diff for likely breaking API changes.\nTrigger phrases: breaking change, api compatibility.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to github (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Inspect exports and routes.\n2. Do not ship.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: merge-pr, production-change.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/app-store-review-themes",
      skillId: "app-store-review-themes",
      name: "app-store-review-themes",
      description: "Theme app-store or G2 reviews. Use when the user asks about app reviews, g2 themes.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "browser"
      ],
      computerUse: true,
      approvals: [
        "external-post"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Theme app-store or G2 reviews",
      category: "research",
      featured: false,
      skillMd: "---\nname: app-store-review-themes\ndescription: >\n  Theme app-store or G2 reviews. Use when the user asks about app reviews, g2 themes.\nwhen-to-use: app reviews, g2 themes\nmetadata:\n  author: grok-skills\n  short-description: Theme app-store or G2 reviews\n  runtime: grok-bot\n  connectors: [browser]\n  computer-use: true\n  approvals: [external-post]\n  category: research\n---\n\n## When to use\n\nUse for: Theme app-store or G2 reviews.\nTrigger phrases: app reviews, g2 themes.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to browser (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Cluster themes.\n2. Do not reply to reviews.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: external-post.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is allowed for listed sites; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/ar-followup-draft",
      skillId: "ar-followup-draft",
      name: "ar-followup-draft",
      description: "Draft AR follow-ups for overdue invoices. Use when the user asks about ar followup, collections draft.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "browser",
        "drive"
      ],
      computerUse: true,
      approvals: [
        "submit-expense",
        "purchase"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Draft AR follow-ups for overdue invoices",
      category: "finance",
      featured: false,
      skillMd: "---\nname: ar-followup-draft\ndescription: >\n  Draft AR follow-ups for overdue invoices. Use when the user asks about ar followup, collections draft.\nwhen-to-use: ar followup, collections draft\nmetadata:\n  author: grok-skills\n  short-description: Draft AR follow-ups for overdue invoices\n  runtime: grok-bot\n  connectors: [browser, drive]\n  computer-use: true\n  approvals: [submit-expense, purchase]\n  category: finance\n---\n\n## When to use\n\nUse for: Draft AR follow-ups for overdue invoices.\nTrigger phrases: ar followup, collections draft.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to browser (read unless a later step says otherwise)\n- Access to drive (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. List overdue invoices.\n2. Draft emails. Do not send.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: submit-expense, purchase.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is allowed for listed sites; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/attachment-intake",
      skillId: "attachment-intake",
      name: "attachment-intake",
      description: "Index email attachments into a review list. Use when the user asks about email attachments, intake invoices from mail.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "gmail"
      ],
      computerUse: false,
      approvals: [
        "send-email",
        "archive"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Index email attachments into a review list",
      category: "inbox",
      featured: false,
      skillMd: "---\nname: attachment-intake\ndescription: >\n  Index email attachments into a review list. Use when the user asks about email attachments, intake invoices from mail.\nwhen-to-use: email attachments, intake invoices from mail\nmetadata:\n  author: grok-skills\n  short-description: Index email attachments into a review list\n  runtime: grok-bot\n  connectors: [gmail]\n  computer-use: false\n  approvals: [send-email, archive]\n  category: inbox\n---\n\n## When to use\n\nUse for: Index email attachments into a review list.\nTrigger phrases: email attachments, intake invoices from mail.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to gmail (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Collect attachments in the window.\n2. Extract vendor/date/amount when possible.\n3. Do not file them into finance systems until approved.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: send-email, archive.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/backup-verify-note",
      skillId: "backup-verify-note",
      name: "backup-verify-note",
      description: "Note whether backups ran from provided logs. Use when the user asks about backup verify, backup job.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "browser"
      ],
      computerUse: true,
      approvals: [
        "vendor-change",
        "purchase"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Note whether backups ran from provided logs",
      category: "ops",
      featured: false,
      skillMd: "---\nname: backup-verify-note\ndescription: >\n  Note whether backups ran from provided logs. Use when the user asks about backup verify, backup job.\nwhen-to-use: backup verify, backup job\nmetadata:\n  author: grok-skills\n  short-description: Note whether backups ran from provided logs\n  runtime: grok-bot\n  connectors: [browser]\n  computer-use: true\n  approvals: [vendor-change, purchase]\n  category: ops\n---\n\n## When to use\n\nUse for: Note whether backups ran from provided logs.\nTrigger phrases: backup verify, backup job.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to browser (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Parse logs.\n2. Do not restore until approved.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: vendor-change, purchase.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is allowed for listed sites; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/board-pre-read",
      skillId: "board-pre-read",
      name: "board-pre-read",
      description: "Assemble a board pre-read outline. Use when the user asks about board deck outline, pre-read.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "drive"
      ],
      computerUse: false,
      approvals: [
        "publish",
        "email-broadcast"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Assemble a board pre-read outline",
      category: "docs",
      featured: false,
      skillMd: "---\nname: board-pre-read\ndescription: >\n  Assemble a board pre-read outline. Use when the user asks about board deck outline, pre-read.\nwhen-to-use: board deck outline, pre-read\nmetadata:\n  author: grok-skills\n  short-description: Assemble a board pre-read outline\n  runtime: grok-bot\n  connectors: [drive]\n  computer-use: false\n  approvals: [publish, email-broadcast]\n  category: docs\n---\n\n## When to use\n\nUse for: Assemble a board pre-read outline.\nTrigger phrases: board deck outline, pre-read.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to drive (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Outline sections from metrics provided.\n2. Do not email the board.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: publish, email-broadcast.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/browser-form-fill-draft",
      skillId: "browser-form-fill-draft",
      name: "browser-form-fill-draft",
      description: "Fill a web form as a draft and stop before submit. Use when the user asks about fill this form, browser form.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "browser"
      ],
      computerUse: true,
      approvals: [
        "saas-write",
        "send-message"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Fill a web form as a draft and stop before submit",
      category: "saas",
      featured: false,
      skillMd: "---\nname: browser-form-fill-draft\ndescription: >\n  Fill a web form as a draft and stop before submit. Use when the user asks about fill this form, browser form.\nwhen-to-use: fill this form, browser form\nmetadata:\n  author: grok-skills\n  short-description: Fill a web form as a draft and stop before submit\n  runtime: grok-bot\n  connectors: [browser]\n  computer-use: true\n  approvals: [saas-write, send-message]\n  category: saas\n---\n\n## When to use\n\nUse for: Fill a web form as a draft and stop before submit.\nTrigger phrases: fill this form, browser form.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to browser (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Fill fields from provided data.\n2. Do not submit.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: saas-write, send-message.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is allowed for listed sites; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/budget-vs-actual",
      skillId: "budget-vs-actual",
      name: "budget-vs-actual",
      description: "Compare budget vs actuals. Use when the user asks about budget vs actual, variance report.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "browser",
        "drive"
      ],
      computerUse: true,
      approvals: [
        "submit-expense",
        "purchase"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Compare budget vs actuals",
      category: "finance",
      featured: false,
      skillMd: "---\nname: budget-vs-actual\ndescription: >\n  Compare budget vs actuals. Use when the user asks about budget vs actual, variance report.\nwhen-to-use: budget vs actual, variance report\nmetadata:\n  author: grok-skills\n  short-description: Compare budget vs actuals\n  runtime: grok-bot\n  connectors: [browser, drive]\n  computer-use: true\n  approvals: [submit-expense, purchase]\n  category: finance\n---\n\n## When to use\n\nUse for: Compare budget vs actuals.\nTrigger phrases: budget vs actual, variance report.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to browser (read unless a later step says otherwise)\n- Access to drive (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Compute variances.\n2. Do not change the budget.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: submit-expense, purchase.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is allowed for listed sites; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/bug-repro-from-logs",
      skillId: "bug-repro-from-logs",
      name: "bug-repro-from-logs",
      description: "Turn logs plus a ticket into a repro hypothesis. Use when the user asks about logs repro, stacktrace ticket.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "browser"
      ],
      computerUse: true,
      approvals: [
        "customer-contact",
        "production-access"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Turn logs plus a ticket into a repro hypothesis",
      category: "support",
      featured: false,
      skillMd: "---\nname: bug-repro-from-logs\ndescription: >\n  Turn logs plus a ticket into a repro hypothesis. Use when the user asks about logs repro, stacktrace ticket.\nwhen-to-use: logs repro, stacktrace ticket\nmetadata:\n  author: grok-skills\n  short-description: Turn logs plus a ticket into a repro hypothesis\n  runtime: grok-bot\n  connectors: [browser]\n  computer-use: true\n  approvals: [customer-contact, production-access]\n  category: support\n---\n\n## When to use\n\nUse for: Turn logs plus a ticket into a repro hypothesis.\nTrigger phrases: logs repro, stacktrace ticket.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to browser (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Extract errors.\n2. Propose staging steps.\n3. Do not hit production.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: customer-contact, production-access.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is allowed for listed sites; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/calendar-prep",
      skillId: "calendar-prep",
      name: "calendar-prep",
      description: "Prep the next day's meetings with briefs. Use when the user asks about calendar prep, tomorrow's meetings, meeting briefs.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "google-calendar"
      ],
      computerUse: false,
      approvals: [
        "create-event",
        "send-invite"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Prep the next day's meetings with briefs",
      category: "calendar",
      featured: false,
      skillMd: "---\nname: calendar-prep\ndescription: >\n  Prep the next day's meetings with briefs. Use when the user asks about calendar prep, tomorrow's meetings, meeting briefs.\nwhen-to-use: calendar prep, tomorrow's meetings, meeting briefs\nmetadata:\n  author: grok-skills\n  short-description: Prep the next day's meetings with briefs\n  runtime: grok-bot\n  connectors: [google-calendar]\n  computer-use: false\n  approvals: [create-event, send-invite]\n  category: calendar\n---\n\n## When to use\n\nUse for: Prep the next day's meetings with briefs.\nTrigger phrases: calendar prep, tomorrow's meetings, meeting briefs.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to google-calendar (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. List events.\n2. Attach a one-paragraph brief each.\n3. Do not change the calendar.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: create-event, send-invite.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/call-prep",
      skillId: "call-prep",
      name: "call-prep",
      description: "Build a call-prep pack for a meeting. Use when the user asks about call prep, sales call brief.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "salesforce"
      ],
      computerUse: false,
      approvals: [
        "customer-contact",
        "send-email"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Build a call-prep pack for a meeting",
      category: "crm",
      featured: false,
      skillMd: "---\nname: call-prep\ndescription: >\n  Build a call-prep pack for a meeting. Use when the user asks about call prep, sales call brief.\nwhen-to-use: call prep, sales call brief\nmetadata:\n  author: grok-skills\n  short-description: Build a call-prep pack for a meeting\n  runtime: grok-bot\n  connectors: [salesforce]\n  computer-use: false\n  approvals: [customer-contact, send-email]\n  category: crm\n---\n\n## When to use\n\nUse for: Build a call-prep pack for a meeting.\nTrigger phrases: call prep, sales call brief.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to salesforce (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Pull account, last activity, open opps.\n2. Return questions and risks.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: customer-contact, send-email.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/candidate-debrief",
      skillId: "candidate-debrief",
      name: "candidate-debrief",
      description: "Structure interviewer debriefs into one view. Use when the user asks about debrief, interview feedback synthesis.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "browser"
      ],
      computerUse: false,
      approvals: [
        "offer-send",
        "hr-system-write"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Structure interviewer debriefs into one view",
      category: "people",
      featured: false,
      skillMd: "---\nname: candidate-debrief\ndescription: >\n  Structure interviewer debriefs into one view. Use when the user asks about debrief, interview feedback synthesis.\nwhen-to-use: debrief, interview feedback synthesis\nmetadata:\n  author: grok-skills\n  short-description: Structure interviewer debriefs into one view\n  runtime: grok-bot\n  connectors: [browser]\n  computer-use: false\n  approvals: [offer-send, hr-system-write]\n  category: people\n---\n\n## When to use\n\nUse for: Structure interviewer debriefs into one view.\nTrigger phrases: debrief, interview feedback synthesis.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to browser (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Cluster signal.\n2. Do not reject/advance in the ATS until approved.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: offer-send, hr-system-write.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/card-spend-anomaly",
      skillId: "card-spend-anomaly",
      name: "card-spend-anomaly",
      description: "Flag unusual card spend. Use when the user asks about card anomaly, surprise charge.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "browser",
        "drive"
      ],
      computerUse: true,
      approvals: [
        "submit-expense",
        "purchase"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Flag unusual card spend",
      category: "finance",
      featured: false,
      skillMd: "---\nname: card-spend-anomaly\ndescription: >\n  Flag unusual card spend. Use when the user asks about card anomaly, surprise charge.\nwhen-to-use: card anomaly, surprise charge\nmetadata:\n  author: grok-skills\n  short-description: Flag unusual card spend\n  runtime: grok-bot\n  connectors: [browser, drive]\n  computer-use: true\n  approvals: [submit-expense, purchase]\n  category: finance\n---\n\n## When to use\n\nUse for: Flag unusual card spend.\nTrigger phrases: card anomaly, surprise charge.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to browser (read unless a later step says otherwise)\n- Access to drive (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Compare to baseline.\n2. Do not dispute until approved.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: submit-expense, purchase.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is allowed for listed sites; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/cash-forecast-note",
      skillId: "cash-forecast-note",
      name: "cash-forecast-note",
      description: "Draft a short cash forecast note. Use when the user asks about cash forecast, runway note.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "browser",
        "drive"
      ],
      computerUse: true,
      approvals: [
        "submit-expense",
        "purchase"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Draft a short cash forecast note",
      category: "finance",
      featured: false,
      skillMd: "---\nname: cash-forecast-note\ndescription: >\n  Draft a short cash forecast note. Use when the user asks about cash forecast, runway note.\nwhen-to-use: cash forecast, runway note\nmetadata:\n  author: grok-skills\n  short-description: Draft a short cash forecast note\n  runtime: grok-bot\n  connectors: [browser, drive]\n  computer-use: true\n  approvals: [submit-expense, purchase]\n  category: finance\n---\n\n## When to use\n\nUse for: Draft a short cash forecast note.\nTrigger phrases: cash forecast, runway note.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to browser (read unless a later step says otherwise)\n- Access to drive (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Use provided actuals.\n2. Do not move money.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: submit-expense, purchase.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is allowed for listed sites; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/champion-map",
      skillId: "champion-map",
      name: "champion-map",
      description: "Identify likely champions and detractors. Use when the user asks about champion mapping, economic buyer.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "salesforce"
      ],
      computerUse: false,
      approvals: [
        "customer-contact",
        "send-email"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Identify likely champions and detractors",
      category: "crm",
      featured: false,
      skillMd: "---\nname: champion-map\ndescription: >\n  Identify likely champions and detractors. Use when the user asks about champion mapping, economic buyer.\nwhen-to-use: champion mapping, economic buyer\nmetadata:\n  author: grok-skills\n  short-description: Identify likely champions and detractors\n  runtime: grok-bot\n  connectors: [salesforce]\n  computer-use: false\n  approvals: [customer-contact, send-email]\n  category: crm\n---\n\n## When to use\n\nUse for: Identify likely champions and detractors.\nTrigger phrases: champion mapping, economic buyer.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to salesforce (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Use titles and activity.\n2. Do not contact them.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: customer-contact, send-email.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/changelog-from-commits",
      skillId: "changelog-from-commits",
      name: "changelog-from-commits",
      description: "Draft a changelog from git log. Use when the user asks about changelog, commits since tag.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "github"
      ],
      computerUse: false,
      approvals: [
        "merge-pr",
        "production-change"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Draft a changelog from git log",
      category: "eng",
      featured: false,
      skillMd: "---\nname: changelog-from-commits\ndescription: >\n  Draft a changelog from git log. Use when the user asks about changelog, commits since tag.\nwhen-to-use: changelog, commits since tag\nmetadata:\n  author: grok-skills\n  short-description: Draft a changelog from git log\n  runtime: grok-bot\n  connectors: [github]\n  computer-use: false\n  approvals: [merge-pr, production-change]\n  category: eng\n---\n\n## When to use\n\nUse for: Draft a changelog from git log.\nTrigger phrases: changelog, commits since tag.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to github (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Group commits.\n2. Do not tag a release.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: merge-pr, production-change.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/ci-failure-triage",
      skillId: "ci-failure-triage",
      name: "ci-failure-triage",
      description: "Triage a failing CI run. Use when the user asks about ci failed, github actions red.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "github"
      ],
      computerUse: false,
      approvals: [
        "merge-pr",
        "production-change"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Triage a failing CI run",
      category: "eng",
      featured: false,
      skillMd: "---\nname: ci-failure-triage\ndescription: >\n  Triage a failing CI run. Use when the user asks about ci failed, github actions red.\nwhen-to-use: ci failed, github actions red\nmetadata:\n  author: grok-skills\n  short-description: Triage a failing CI run\n  runtime: grok-bot\n  connectors: [github]\n  computer-use: false\n  approvals: [merge-pr, production-change]\n  category: eng\n---\n\n## When to use\n\nUse for: Triage a failing CI run.\nTrigger phrases: ci failed, github actions red.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to github (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Read logs.\n2. Identify first failure.\n3. Do not rerun paid workflows in a loop.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: merge-pr, production-change.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/codeowner-nudge",
      skillId: "codeowner-nudge",
      name: "codeowner-nudge",
      description: "Find PRs waiting on code owners. Use when the user asks about codeowners, review nudges.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "github"
      ],
      computerUse: false,
      approvals: [
        "merge-pr",
        "production-change"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Find PRs waiting on code owners",
      category: "eng",
      featured: false,
      skillMd: "---\nname: codeowner-nudge\ndescription: >\n  Find PRs waiting on code owners. Use when the user asks about codeowners, review nudges.\nwhen-to-use: codeowners, review nudges\nmetadata:\n  author: grok-skills\n  short-description: Find PRs waiting on code owners\n  runtime: grok-bot\n  connectors: [github]\n  computer-use: false\n  approvals: [merge-pr, production-change]\n  category: eng\n---\n\n## When to use\n\nUse for: Find PRs waiting on code owners.\nTrigger phrases: codeowners, review nudges.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to github (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. List stalled PRs.\n2. Draft nudges. Do not mention-spam.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: merge-pr, production-change.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/cohort-note",
      skillId: "cohort-note",
      name: "cohort-note",
      description: "Write a cohort retention note. Use when the user asks about cohort retention, retention curve.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "browser"
      ],
      computerUse: false,
      approvals: [
        "warehouse-write"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Write a cohort retention note",
      category: "data",
      featured: false,
      skillMd: "---\nname: cohort-note\ndescription: >\n  Write a cohort retention note. Use when the user asks about cohort retention, retention curve.\nwhen-to-use: cohort retention, retention curve\nmetadata:\n  author: grok-skills\n  short-description: Write a cohort retention note\n  runtime: grok-bot\n  connectors: [browser]\n  computer-use: false\n  approvals: [warehouse-write]\n  category: data\n---\n\n## When to use\n\nUse for: Write a cohort retention note.\nTrigger phrases: cohort retention, retention curve.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to browser (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Build the cohort table if data allows.\n2. Do not email customers.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: warehouse-write.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/competitor-watch",
      skillId: "competitor-watch",
      name: "competitor-watch",
      description: "Watch competitor mentions on named accounts. Use when the user asks about competitor watch, displacement risk.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "salesforce"
      ],
      computerUse: false,
      approvals: [
        "customer-contact",
        "send-email"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Watch competitor mentions on named accounts",
      category: "crm",
      featured: false,
      skillMd: "---\nname: competitor-watch\ndescription: >\n  Watch competitor mentions on named accounts. Use when the user asks about competitor watch, displacement risk.\nwhen-to-use: competitor watch, displacement risk\nmetadata:\n  author: grok-skills\n  short-description: Watch competitor mentions on named accounts\n  runtime: grok-bot\n  connectors: [salesforce]\n  computer-use: false\n  approvals: [customer-contact, send-email]\n  category: crm\n---\n\n## When to use\n\nUse for: Watch competitor mentions on named accounts.\nTrigger phrases: competitor watch, displacement risk.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to salesforce (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Search notes and web.\n2. Return mentions. Do not message accounts.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: customer-contact, send-email.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/conflict-scan",
      skillId: "conflict-scan",
      name: "conflict-scan",
      description: "Find calendar conflicts and double-books. Use when the user asks about calendar conflict, double booked.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "google-calendar"
      ],
      computerUse: false,
      approvals: [
        "create-event",
        "send-invite"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Find calendar conflicts and double-books",
      category: "calendar",
      featured: false,
      skillMd: "---\nname: conflict-scan\ndescription: >\n  Find calendar conflicts and double-books. Use when the user asks about calendar conflict, double booked.\nwhen-to-use: calendar conflict, double booked\nmetadata:\n  author: grok-skills\n  short-description: Find calendar conflicts and double-books\n  runtime: grok-bot\n  connectors: [google-calendar]\n  computer-use: false\n  approvals: [create-event, send-invite]\n  category: calendar\n---\n\n## When to use\n\nUse for: Find calendar conflicts and double-books.\nTrigger phrases: calendar conflict, double booked.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to google-calendar (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Scan the window.\n2. List conflicts with event ids.\n3. Do not decline until approved.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: create-event, send-invite.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/contact-map",
      skillId: "contact-map",
      name: "contact-map",
      description: "Map buying-committee contacts on an account. Use when the user asks about org chart, buying committee, contact map.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "salesforce"
      ],
      computerUse: false,
      approvals: [
        "customer-contact",
        "send-email"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Map buying-committee contacts on an account",
      category: "crm",
      featured: false,
      skillMd: "---\nname: contact-map\ndescription: >\n  Map buying-committee contacts on an account. Use when the user asks about org chart, buying committee, contact map.\nwhen-to-use: org chart, buying committee, contact map\nmetadata:\n  author: grok-skills\n  short-description: Map buying-committee contacts on an account\n  runtime: grok-bot\n  connectors: [salesforce]\n  computer-use: false\n  approvals: [customer-contact, send-email]\n  category: crm\n---\n\n## When to use\n\nUse for: Map buying-committee contacts on an account.\nTrigger phrases: org chart, buying committee, contact map.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to salesforce (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. List contacts and roles.\n2. Do not add contacts until approved.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: customer-contact, send-email.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/contract-clause-flag",
      skillId: "contract-clause-flag",
      name: "contract-clause-flag",
      description: "Flag risky clauses in a contract for a lawyer. Use when the user asks about contract review flags, risky clause.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "drive"
      ],
      computerUse: false,
      approvals: [
        "legal-send",
        "sign-document"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Flag risky clauses in a contract for a lawyer",
      category: "legal",
      featured: false,
      skillMd: "---\nname: contract-clause-flag\ndescription: >\n  Flag risky clauses in a contract for a lawyer. Use when the user asks about contract review flags, risky clause.\nwhen-to-use: contract review flags, risky clause\nmetadata:\n  author: grok-skills\n  short-description: Flag risky clauses in a contract for a lawyer\n  runtime: grok-bot\n  connectors: [drive]\n  computer-use: false\n  approvals: [legal-send, sign-document]\n  category: legal\n---\n\n## When to use\n\nUse for: Flag risky clauses in a contract for a lawyer.\nTrigger phrases: contract review flags, risky clause.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to drive (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. List clauses and why.\n2. Not legal advice. Do not sign or send.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: legal-send, sign-document.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/contract-value-extract",
      skillId: "contract-value-extract",
      name: "contract-value-extract",
      description: "Extract commercial values from a contract PDF. Use when the user asks about contract value, arr extract.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "browser",
        "drive"
      ],
      computerUse: true,
      approvals: [
        "submit-expense",
        "purchase"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Extract commercial values from a contract PDF",
      category: "finance",
      featured: false,
      skillMd: "---\nname: contract-value-extract\ndescription: >\n  Extract commercial values from a contract PDF. Use when the user asks about contract value, arr extract.\nwhen-to-use: contract value, arr extract\nmetadata:\n  author: grok-skills\n  short-description: Extract commercial values from a contract PDF\n  runtime: grok-bot\n  connectors: [browser, drive]\n  computer-use: true\n  approvals: [submit-expense, purchase]\n  category: finance\n---\n\n## When to use\n\nUse for: Extract commercial values from a contract PDF.\nTrigger phrases: contract value, arr extract.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to browser (read unless a later step says otherwise)\n- Access to drive (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Pull fees, term, auto-renew.\n2. Do not sign.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: submit-expense, purchase.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is allowed for listed sites; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/contractor-hours-check",
      skillId: "contractor-hours-check",
      name: "contractor-hours-check",
      description: "Check contractor hours against caps. Use when the user asks about contractor hours, vendor hours cap.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "browser"
      ],
      computerUse: true,
      approvals: [
        "vendor-change",
        "purchase"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Check contractor hours against caps",
      category: "ops",
      featured: false,
      skillMd: "---\nname: contractor-hours-check\ndescription: >\n  Check contractor hours against caps. Use when the user asks about contractor hours, vendor hours cap.\nwhen-to-use: contractor hours, vendor hours cap\nmetadata:\n  author: grok-skills\n  short-description: Check contractor hours against caps\n  runtime: grok-bot\n  connectors: [browser]\n  computer-use: true\n  approvals: [vendor-change, purchase]\n  category: ops\n---\n\n## When to use\n\nUse for: Check contractor hours against caps.\nTrigger phrases: contractor hours, vendor hours cap.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to browser (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Compare to cap.\n2. Do not approve invoices.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: vendor-change, purchase.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is allowed for listed sites; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/cs-health-digest",
      skillId: "cs-health-digest",
      name: "cs-health-digest",
      description: "Digest CSAT/NPS plus open tickets for an account. Use when the user asks about cs health, csat digest.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "browser"
      ],
      computerUse: true,
      approvals: [
        "customer-contact",
        "production-access"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Digest CSAT/NPS plus open tickets for an account",
      category: "support",
      featured: false,
      skillMd: "---\nname: cs-health-digest\ndescription: >\n  Digest CSAT/NPS plus open tickets for an account. Use when the user asks about cs health, csat digest.\nwhen-to-use: cs health, csat digest\nmetadata:\n  author: grok-skills\n  short-description: Digest CSAT/NPS plus open tickets for an account\n  runtime: grok-bot\n  connectors: [browser]\n  computer-use: true\n  approvals: [customer-contact, production-access]\n  category: support\n---\n\n## When to use\n\nUse for: Digest CSAT/NPS plus open tickets for an account.\nTrigger phrases: cs health, csat digest.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to browser (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Combine scores and tickets.\n2. Do not contact the customer.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: customer-contact, production-access.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is allowed for listed sites; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/csv-cleanup",
      skillId: "csv-cleanup",
      name: "csv-cleanup",
      description: "Clean a CSV and report row counts. Use when the user asks about clean csv, wrangle spreadsheet.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "browser"
      ],
      computerUse: false,
      approvals: [
        "warehouse-write"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Clean a CSV and report row counts",
      category: "data",
      featured: false,
      skillMd: "---\nname: csv-cleanup\ndescription: >\n  Clean a CSV and report row counts. Use when the user asks about clean csv, wrangle spreadsheet.\nwhen-to-use: clean csv, wrangle spreadsheet\nmetadata:\n  author: grok-skills\n  short-description: Clean a CSV and report row counts\n  runtime: grok-bot\n  connectors: [browser]\n  computer-use: false\n  approvals: [warehouse-write]\n  category: data\n---\n\n## When to use\n\nUse for: Clean a CSV and report row counts.\nTrigger phrases: clean csv, wrangle spreadsheet.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to browser (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Fix types and dupes.\n2. Do not overwrite the original until approved.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: warehouse-write.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/customer-escalation-pack",
      skillId: "customer-escalation-pack",
      name: "customer-escalation-pack",
      description: "Build an escalation pack for a hot customer. Use when the user asks about customer escalation, sev1 customer.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "browser"
      ],
      computerUse: true,
      approvals: [
        "customer-contact",
        "production-access"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Build an escalation pack for a hot customer",
      category: "support",
      featured: false,
      skillMd: "---\nname: customer-escalation-pack\ndescription: >\n  Build an escalation pack for a hot customer. Use when the user asks about customer escalation, sev1 customer.\nwhen-to-use: customer escalation, sev1 customer\nmetadata:\n  author: grok-skills\n  short-description: Build an escalation pack for a hot customer\n  runtime: grok-bot\n  connectors: [browser]\n  computer-use: true\n  approvals: [customer-contact, production-access]\n  category: support\n---\n\n## When to use\n\nUse for: Build an escalation pack for a hot customer.\nTrigger phrases: customer escalation, sev1 customer.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to browser (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Collect tickets, ARR, last contacts.\n2. Do not email the customer.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: customer-contact, production-access.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is allowed for listed sites; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/customer-interview-synth",
      skillId: "customer-interview-synth",
      name: "customer-interview-synth",
      description: "Synthesize customer interview notes. Use when the user asks about interview synthesis, qualitative research.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "browser"
      ],
      computerUse: true,
      approvals: [
        "external-post"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Synthesize customer interview notes",
      category: "research",
      featured: false,
      skillMd: "---\nname: customer-interview-synth\ndescription: >\n  Synthesize customer interview notes. Use when the user asks about interview synthesis, qualitative research.\nwhen-to-use: interview synthesis, qualitative research\nmetadata:\n  author: grok-skills\n  short-description: Synthesize customer interview notes\n  runtime: grok-bot\n  connectors: [browser]\n  computer-use: true\n  approvals: [external-post]\n  category: research\n---\n\n## When to use\n\nUse for: Synthesize customer interview notes.\nTrigger phrases: interview synthesis, qualitative research.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to browser (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Cluster pains and quotes.\n2. Do not email interviewees.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: external-post.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is allowed for listed sites; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/customer-one-pager",
      skillId: "customer-one-pager",
      name: "customer-one-pager",
      description: "Draft a customer one-pager. Use when the user asks about one pager, account one-pager.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "drive"
      ],
      computerUse: false,
      approvals: [
        "publish",
        "email-broadcast"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Draft a customer one-pager",
      category: "docs",
      featured: false,
      skillMd: "---\nname: customer-one-pager\ndescription: >\n  Draft a customer one-pager. Use when the user asks about one pager, account one-pager.\nwhen-to-use: one pager, account one-pager\nmetadata:\n  author: grok-skills\n  short-description: Draft a customer one-pager\n  runtime: grok-bot\n  connectors: [drive]\n  computer-use: false\n  approvals: [publish, email-broadcast]\n  category: docs\n---\n\n## When to use\n\nUse for: Draft a customer one-pager.\nTrigger phrases: one pager, account one-pager.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to drive (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Use CRM + public info.\n2. Do not send to the customer.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: publish, email-broadcast.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/daily-brief",
      skillId: "daily-brief",
      name: "daily-brief",
      description: "Build a daily brief from calendar, mail, and tasks. Use when the user asks about daily brief, morning brief.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "browser"
      ],
      computerUse: false,
      approvals: [
        "external-send"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Build a daily brief from calendar, mail, and tasks",
      category: "personal",
      featured: false,
      skillMd: "---\nname: daily-brief\ndescription: >\n  Build a daily brief from calendar, mail, and tasks. Use when the user asks about daily brief, morning brief.\nwhen-to-use: daily brief, morning brief\nmetadata:\n  author: grok-skills\n  short-description: Build a daily brief from calendar, mail, and tasks\n  runtime: grok-bot\n  connectors: [browser]\n  computer-use: false\n  approvals: [external-send]\n  category: personal\n---\n\n## When to use\n\nUse for: Build a daily brief from calendar, mail, and tasks.\nTrigger phrases: daily brief, morning brief.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to browser (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Pull allowed sources.\n2. Do not send the brief on.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: external-send.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/dashboard-anomaly",
      skillId: "dashboard-anomaly",
      name: "dashboard-anomaly",
      description: "Explain a dashboard anomaly. Use when the user asks about dashboard anomaly, metric spike.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "browser"
      ],
      computerUse: false,
      approvals: [
        "warehouse-write"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Explain a dashboard anomaly",
      category: "data",
      featured: false,
      skillMd: "---\nname: dashboard-anomaly\ndescription: >\n  Explain a dashboard anomaly. Use when the user asks about dashboard anomaly, metric spike.\nwhen-to-use: dashboard anomaly, metric spike\nmetadata:\n  author: grok-skills\n  short-description: Explain a dashboard anomaly\n  runtime: grok-bot\n  connectors: [browser]\n  computer-use: false\n  approvals: [warehouse-write]\n  category: data\n---\n\n## When to use\n\nUse for: Explain a dashboard anomaly.\nTrigger phrases: dashboard anomaly, metric spike.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to browser (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Compare to baseline.\n2. Do not change the dashboard.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: warehouse-write.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/dbt-test-fail",
      skillId: "dbt-test-fail",
      name: "dbt-test-fail",
      description: "Triage failing dbt tests. Use when the user asks about dbt test, data test fail.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "browser"
      ],
      computerUse: false,
      approvals: [
        "warehouse-write"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Triage failing dbt tests",
      category: "data",
      featured: false,
      skillMd: "---\nname: dbt-test-fail\ndescription: >\n  Triage failing dbt tests. Use when the user asks about dbt test, data test fail.\nwhen-to-use: dbt test, data test fail\nmetadata:\n  author: grok-skills\n  short-description: Triage failing dbt tests\n  runtime: grok-bot\n  connectors: [browser]\n  computer-use: false\n  approvals: [warehouse-write]\n  category: data\n---\n\n## When to use\n\nUse for: Triage failing dbt tests.\nTrigger phrases: dbt test, data test fail.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to browser (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Read failures.\n2. Do not drop tables.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: warehouse-write.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/deal-desk-pack",
      skillId: "deal-desk-pack",
      name: "deal-desk-pack",
      description: "Assemble a deal-desk exception pack. Use when the user asks about deal desk, discount request pack.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "salesforce"
      ],
      computerUse: false,
      approvals: [
        "customer-contact",
        "send-email"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Assemble a deal-desk exception pack",
      category: "crm",
      featured: false,
      skillMd: "---\nname: deal-desk-pack\ndescription: >\n  Assemble a deal-desk exception pack. Use when the user asks about deal desk, discount request pack.\nwhen-to-use: deal desk, discount request pack\nmetadata:\n  author: grok-skills\n  short-description: Assemble a deal-desk exception pack\n  runtime: grok-bot\n  connectors: [salesforce]\n  computer-use: false\n  approvals: [customer-contact, send-email]\n  category: crm\n---\n\n## When to use\n\nUse for: Assemble a deal-desk exception pack.\nTrigger phrases: deal desk, discount request pack.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to salesforce (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Collect deal fields and justification.\n2. Do not approve pricing.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: customer-contact, send-email.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/decision-log",
      skillId: "decision-log",
      name: "decision-log",
      description: "Append a decision-log entry. Use when the user asks about adr, decision log.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "drive"
      ],
      computerUse: false,
      approvals: [
        "publish",
        "email-broadcast"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Append a decision-log entry",
      category: "docs",
      featured: false,
      skillMd: "---\nname: decision-log\ndescription: >\n  Append a decision-log entry. Use when the user asks about adr, decision log.\nwhen-to-use: adr, decision log\nmetadata:\n  author: grok-skills\n  short-description: Append a decision-log entry\n  runtime: grok-bot\n  connectors: [drive]\n  computer-use: false\n  approvals: [publish, email-broadcast]\n  category: docs\n---\n\n## When to use\n\nUse for: Append a decision-log entry.\nTrigger phrases: adr, decision log.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to drive (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Capture context, decision, consequences.\n2. Do not overwrite history.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: publish, email-broadcast.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/dependabot-batch",
      skillId: "dependabot-batch",
      name: "dependabot-batch",
      description: "Batch Dependabot PRs into safe vs review-needed. Use when the user asks about dependabot, bump dependencies.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "github"
      ],
      computerUse: false,
      approvals: [
        "merge-pr",
        "production-change"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Batch Dependabot PRs into safe vs review-needed",
      category: "eng",
      featured: false,
      skillMd: "---\nname: dependabot-batch\ndescription: >\n  Batch Dependabot PRs into safe vs review-needed. Use when the user asks about dependabot, bump dependencies.\nwhen-to-use: dependabot, bump dependencies\nmetadata:\n  author: grok-skills\n  short-description: Batch Dependabot PRs into safe vs review-needed\n  runtime: grok-bot\n  connectors: [github]\n  computer-use: false\n  approvals: [merge-pr, production-change]\n  category: eng\n---\n\n## When to use\n\nUse for: Batch Dependabot PRs into safe vs review-needed.\nTrigger phrases: dependabot, bump dependencies.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to github (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Group by risk.\n2. Do not merge.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: merge-pr, production-change.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/deploy-diff-review",
      skillId: "deploy-diff-review",
      name: "deploy-diff-review",
      description: "Review what changed between two deploys. Use when the user asks about deploy diff, what shipped.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "github"
      ],
      computerUse: false,
      approvals: [
        "merge-pr",
        "production-change"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Review what changed between two deploys",
      category: "eng",
      featured: false,
      skillMd: "---\nname: deploy-diff-review\ndescription: >\n  Review what changed between two deploys. Use when the user asks about deploy diff, what shipped.\nwhen-to-use: deploy diff, what shipped\nmetadata:\n  author: grok-skills\n  short-description: Review what changed between two deploys\n  runtime: grok-bot\n  connectors: [github]\n  computer-use: false\n  approvals: [merge-pr, production-change]\n  category: eng\n---\n\n## When to use\n\nUse for: Review what changed between two deploys.\nTrigger phrases: deploy diff, what shipped.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to github (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Compare shas or tags.\n2. Do not roll back.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: merge-pr, production-change.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/docker-build-fail",
      skillId: "docker-build-fail",
      name: "docker-build-fail",
      description: "Diagnose a Docker build failure. Use when the user asks about docker build failed, image build error.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "github"
      ],
      computerUse: false,
      approvals: [
        "merge-pr",
        "production-change"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Diagnose a Docker build failure",
      category: "eng",
      featured: false,
      skillMd: "---\nname: docker-build-fail\ndescription: >\n  Diagnose a Docker build failure. Use when the user asks about docker build failed, image build error.\nwhen-to-use: docker build failed, image build error\nmetadata:\n  author: grok-skills\n  short-description: Diagnose a Docker build failure\n  runtime: grok-bot\n  connectors: [github]\n  computer-use: false\n  approvals: [merge-pr, production-change]\n  category: eng\n---\n\n## When to use\n\nUse for: Diagnose a Docker build failure.\nTrigger phrases: docker build failed, image build error.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to github (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Read the log.\n2. Propose a fix. Do not push images.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: merge-pr, production-change.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/domain-dns-check",
      skillId: "domain-dns-check",
      name: "domain-dns-check",
      description: "Read-only DNS/domain checklist. Use when the user asks about dns check, domain expiry.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "browser"
      ],
      computerUse: true,
      approvals: [
        "vendor-change",
        "purchase"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Read-only DNS/domain checklist",
      category: "ops",
      featured: false,
      skillMd: "---\nname: domain-dns-check\ndescription: >\n  Read-only DNS/domain checklist. Use when the user asks about dns check, domain expiry.\nwhen-to-use: dns check, domain expiry\nmetadata:\n  author: grok-skills\n  short-description: Read-only DNS/domain checklist\n  runtime: grok-bot\n  connectors: [browser]\n  computer-use: true\n  approvals: [vendor-change, purchase]\n  category: ops\n---\n\n## When to use\n\nUse for: Read-only DNS/domain checklist.\nTrigger phrases: dns check, domain expiry.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to browser (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Use public or provided DNS.\n2. Do not change records.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: vendor-change, purchase.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is allowed for listed sites; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/dpa-checklist",
      skillId: "dpa-checklist",
      name: "dpa-checklist",
      description: "Checklist a DPA against a template. Use when the user asks about dpa, data processing agreement.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "drive"
      ],
      computerUse: false,
      approvals: [
        "legal-send",
        "sign-document"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Checklist a DPA against a template",
      category: "legal",
      featured: false,
      skillMd: "---\nname: dpa-checklist\ndescription: >\n  Checklist a DPA against a template. Use when the user asks about dpa, data processing agreement.\nwhen-to-use: dpa, data processing agreement\nmetadata:\n  author: grok-skills\n  short-description: Checklist a DPA against a template\n  runtime: grok-bot\n  connectors: [drive]\n  computer-use: false\n  approvals: [legal-send, sign-document]\n  category: legal\n---\n\n## When to use\n\nUse for: Checklist a DPA against a template.\nTrigger phrases: dpa, data processing agreement.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to drive (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Mark gaps.\n2. Do not sign.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: legal-send, sign-document.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/draft-replies",
      skillId: "draft-replies",
      name: "draft-replies",
      description: "Draft replies in the user's voice. Use when the user asks about draft replies, answer this email, write a response.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "gmail"
      ],
      computerUse: false,
      approvals: [
        "send-email",
        "archive"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Draft replies in the user's voice",
      category: "inbox",
      featured: false,
      skillMd: "---\nname: draft-replies\ndescription: >\n  Draft replies in the user's voice. Use when the user asks about draft replies, answer this email, write a response.\nwhen-to-use: draft replies, answer this email, write a response\nmetadata:\n  author: grok-skills\n  short-description: Draft replies in the user's voice\n  runtime: grok-bot\n  connectors: [gmail]\n  computer-use: false\n  approvals: [send-email, archive]\n  category: inbox\n---\n\n## When to use\n\nUse for: Draft replies in the user's voice.\nTrigger phrases: draft replies, answer this email, write a response.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to gmail (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Read the thread.\n2. Draft a reply. Do not send.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: send-email, archive.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/email-to-tasks",
      skillId: "email-to-tasks",
      name: "email-to-tasks",
      description: "Turn emails into a task list. Use when the user asks about email to tasks, action items from inbox.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "gmail"
      ],
      computerUse: false,
      approvals: [
        "send-email",
        "archive"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Turn emails into a task list",
      category: "inbox",
      featured: false,
      skillMd: "---\nname: email-to-tasks\ndescription: >\n  Turn emails into a task list. Use when the user asks about email to tasks, action items from inbox.\nwhen-to-use: email to tasks, action items from inbox\nmetadata:\n  author: grok-skills\n  short-description: Turn emails into a task list\n  runtime: grok-bot\n  connectors: [gmail]\n  computer-use: false\n  approvals: [send-email, archive]\n  category: inbox\n---\n\n## When to use\n\nUse for: Turn emails into a task list.\nTrigger phrases: email to tasks, action items from inbox.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to gmail (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Extract asks and due dates.\n2. Return tasks. Do not create tracker items until approved.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: send-email, archive.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/error-budget-report",
      skillId: "error-budget-report",
      name: "error-budget-report",
      description: "Report error-budget burn from SLO docs. Use when the user asks about error budget, slo report.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "github"
      ],
      computerUse: false,
      approvals: [
        "merge-pr",
        "production-change"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Report error-budget burn from SLO docs",
      category: "eng",
      featured: false,
      skillMd: "---\nname: error-budget-report\ndescription: >\n  Report error-budget burn from SLO docs. Use when the user asks about error budget, slo report.\nwhen-to-use: error budget, slo report\nmetadata:\n  author: grok-skills\n  short-description: Report error-budget burn from SLO docs\n  runtime: grok-bot\n  connectors: [github]\n  computer-use: false\n  approvals: [merge-pr, production-change]\n  category: eng\n---\n\n## When to use\n\nUse for: Report error-budget burn from SLO docs.\nTrigger phrases: error budget, slo report.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to github (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Compute burn if data exists.\n2. Do not change alerts.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: merge-pr, production-change.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/escalate-stale-threads",
      skillId: "escalate-stale-threads",
      name: "escalate-stale-threads",
      description: "Find threads stuck waiting more than N days. Use when the user asks about stale email, unanswered for days.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "gmail"
      ],
      computerUse: false,
      approvals: [
        "send-email",
        "archive"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Find threads stuck waiting more than N days",
      category: "inbox",
      featured: false,
      skillMd: "---\nname: escalate-stale-threads\ndescription: >\n  Find threads stuck waiting more than N days. Use when the user asks about stale email, unanswered for days.\nwhen-to-use: stale email, unanswered for days\nmetadata:\n  author: grok-skills\n  short-description: Find threads stuck waiting more than N days\n  runtime: grok-bot\n  connectors: [gmail]\n  computer-use: false\n  approvals: [send-email, archive]\n  category: inbox\n---\n\n## When to use\n\nUse for: Find threads stuck waiting more than N days.\nTrigger phrases: stale email, unanswered for days.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to gmail (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Find threads idle past the threshold.\n2. Draft bumps. Do not send.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: send-email, archive.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/event-run-of-show",
      skillId: "event-run-of-show",
      name: "event-run-of-show",
      description: "Draft an event run-of-show. Use when the user asks about run of show, event schedule.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "browser"
      ],
      computerUse: true,
      approvals: [
        "vendor-change",
        "purchase"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Draft an event run-of-show",
      category: "ops",
      featured: false,
      skillMd: "---\nname: event-run-of-show\ndescription: >\n  Draft an event run-of-show. Use when the user asks about run of show, event schedule.\nwhen-to-use: run of show, event schedule\nmetadata:\n  author: grok-skills\n  short-description: Draft an event run-of-show\n  runtime: grok-bot\n  connectors: [browser]\n  computer-use: true\n  approvals: [vendor-change, purchase]\n  category: ops\n---\n\n## When to use\n\nUse for: Draft an event run-of-show.\nTrigger phrases: run of show, event schedule.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to browser (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Timeline rooms and owners.\n2. Do not email attendees.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: vendor-change, purchase.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is allowed for listed sites; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/experiment-readout",
      skillId: "experiment-readout",
      name: "experiment-readout",
      description: "Draft an experiment readout. Use when the user asks about ab test readout, experiment results.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "browser"
      ],
      computerUse: false,
      approvals: [
        "warehouse-write"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Draft an experiment readout",
      category: "data",
      featured: false,
      skillMd: "---\nname: experiment-readout\ndescription: >\n  Draft an experiment readout. Use when the user asks about ab test readout, experiment results.\nwhen-to-use: ab test readout, experiment results\nmetadata:\n  author: grok-skills\n  short-description: Draft an experiment readout\n  runtime: grok-bot\n  connectors: [browser]\n  computer-use: false\n  approvals: [warehouse-write]\n  category: data\n---\n\n## When to use\n\nUse for: Draft an experiment readout.\nTrigger phrases: ab test readout, experiment results.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to browser (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. State sample, effect, caveats.\n2. Do not ship the treatment.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: warehouse-write.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/facility-ticket-triage",
      skillId: "facility-ticket-triage",
      name: "facility-ticket-triage",
      description: "Triage facilities tickets. Use when the user asks about facilities ticket, office issue.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "browser"
      ],
      computerUse: true,
      approvals: [
        "vendor-change",
        "purchase"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Triage facilities tickets",
      category: "ops",
      featured: false,
      skillMd: "---\nname: facility-ticket-triage\ndescription: >\n  Triage facilities tickets. Use when the user asks about facilities ticket, office issue.\nwhen-to-use: facilities ticket, office issue\nmetadata:\n  author: grok-skills\n  short-description: Triage facilities tickets\n  runtime: grok-bot\n  connectors: [browser]\n  computer-use: true\n  approvals: [vendor-change, purchase]\n  category: ops\n---\n\n## When to use\n\nUse for: Triage facilities tickets.\nTrigger phrases: facilities ticket, office issue.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to browser (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Prioritize safety first.\n2. Do not dispatch vendors until approved.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: vendor-change, purchase.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is allowed for listed sites; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/faq-from-threads",
      skillId: "faq-from-threads",
      name: "faq-from-threads",
      description: "Build an FAQ from support or Slack threads. Use when the user asks about faq from slack, help faq.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "drive"
      ],
      computerUse: false,
      approvals: [
        "publish",
        "email-broadcast"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Build an FAQ from support or Slack threads",
      category: "docs",
      featured: false,
      skillMd: "---\nname: faq-from-threads\ndescription: >\n  Build an FAQ from support or Slack threads. Use when the user asks about faq from slack, help faq.\nwhen-to-use: faq from slack, help faq\nmetadata:\n  author: grok-skills\n  short-description: Build an FAQ from support or Slack threads\n  runtime: grok-bot\n  connectors: [drive]\n  computer-use: false\n  approvals: [publish, email-broadcast]\n  category: docs\n---\n\n## When to use\n\nUse for: Build an FAQ from support or Slack threads.\nTrigger phrases: faq from slack, help faq.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to drive (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Cluster questions.\n2. Do not publish to the help center.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: publish, email-broadcast.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/figma-comment-digest",
      skillId: "figma-comment-digest",
      name: "figma-comment-digest",
      description: "Digest Figma comments on a file. Use when the user asks about figma comments, design review comments.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "browser"
      ],
      computerUse: true,
      approvals: [
        "saas-write",
        "send-message"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Digest Figma comments on a file",
      category: "saas",
      featured: false,
      skillMd: "---\nname: figma-comment-digest\ndescription: >\n  Digest Figma comments on a file. Use when the user asks about figma comments, design review comments.\nwhen-to-use: figma comments, design review comments\nmetadata:\n  author: grok-skills\n  short-description: Digest Figma comments on a file\n  runtime: grok-bot\n  connectors: [browser]\n  computer-use: true\n  approvals: [saas-write, send-message]\n  category: saas\n---\n\n## When to use\n\nUse for: Digest Figma comments on a file.\nTrigger phrases: figma comments, design review comments.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to browser (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Cluster open comments.\n2. Do not resolve them.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: saas-write, send-message.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is allowed for listed sites; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/flaky-test-hunt",
      skillId: "flaky-test-hunt",
      name: "flaky-test-hunt",
      description: "Find flaky tests from CI history. Use when the user asks about flaky tests, quarantined tests.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "github"
      ],
      computerUse: false,
      approvals: [
        "merge-pr",
        "production-change"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Find flaky tests from CI history",
      category: "eng",
      featured: false,
      skillMd: "---\nname: flaky-test-hunt\ndescription: >\n  Find flaky tests from CI history. Use when the user asks about flaky tests, quarantined tests.\nwhen-to-use: flaky tests, quarantined tests\nmetadata:\n  author: grok-skills\n  short-description: Find flaky tests from CI history\n  runtime: grok-bot\n  connectors: [github]\n  computer-use: false\n  approvals: [merge-pr, production-change]\n  category: eng\n---\n\n## When to use\n\nUse for: Find flaky tests from CI history.\nTrigger phrases: flaky tests, quarantined tests.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to github (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Mine failures.\n2. Propose quarantines. Do not disable tests until approved.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: merge-pr, production-change.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/focus-block-protect",
      skillId: "focus-block-protect",
      name: "focus-block-protect",
      description: "Propose focus blocks around deep work. Use when the user asks about focus time, protect calendar, maker schedule.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "google-calendar"
      ],
      computerUse: false,
      approvals: [
        "create-event",
        "send-invite"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Propose focus blocks around deep work",
      category: "calendar",
      featured: false,
      skillMd: "---\nname: focus-block-protect\ndescription: >\n  Propose focus blocks around deep work. Use when the user asks about focus time, protect calendar, maker schedule.\nwhen-to-use: focus time, protect calendar, maker schedule\nmetadata:\n  author: grok-skills\n  short-description: Propose focus blocks around deep work\n  runtime: grok-bot\n  connectors: [google-calendar]\n  computer-use: false\n  approvals: [create-event, send-invite]\n  category: calendar\n---\n\n## When to use\n\nUse for: Propose focus blocks around deep work.\nTrigger phrases: focus time, protect calendar, maker schedule.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to google-calendar (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Find fragmentable days.\n2. Propose focus blocks. Do not invite anyone.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: create-event, send-invite.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/funnel-dropoff",
      skillId: "funnel-dropoff",
      name: "funnel-dropoff",
      description: "Find funnel drop-off steps. Use when the user asks about funnel analysis, conversion drop.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "browser"
      ],
      computerUse: false,
      approvals: [
        "warehouse-write"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Find funnel drop-off steps",
      category: "data",
      featured: false,
      skillMd: "---\nname: funnel-dropoff\ndescription: >\n  Find funnel drop-off steps. Use when the user asks about funnel analysis, conversion drop.\nwhen-to-use: funnel analysis, conversion drop\nmetadata:\n  author: grok-skills\n  short-description: Find funnel drop-off steps\n  runtime: grok-bot\n  connectors: [browser]\n  computer-use: false\n  approvals: [warehouse-write]\n  category: data\n---\n\n## When to use\n\nUse for: Find funnel drop-off steps.\nTrigger phrases: funnel analysis, conversion drop.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to browser (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Compute step rates.\n2. Do not change tracking.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: warehouse-write.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/gift-list-research",
      skillId: "gift-list-research",
      name: "gift-list-research",
      description: "Research gift ideas with public prices. Use when the user asks about gift ideas, present research.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "browser"
      ],
      computerUse: false,
      approvals: [
        "external-send"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Research gift ideas with public prices",
      category: "personal",
      featured: false,
      skillMd: "---\nname: gift-list-research\ndescription: >\n  Research gift ideas with public prices. Use when the user asks about gift ideas, present research.\nwhen-to-use: gift ideas, present research\nmetadata:\n  author: grok-skills\n  short-description: Research gift ideas with public prices\n  runtime: grok-bot\n  connectors: [browser]\n  computer-use: false\n  approvals: [external-send]\n  category: personal\n---\n\n## When to use\n\nUse for: Research gift ideas with public prices.\nTrigger phrases: gift ideas, present research.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to browser (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Public pages.\n2. Do not purchase.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: external-send.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/gsheet-reconcile",
      skillId: "gsheet-reconcile",
      name: "gsheet-reconcile",
      description: "Reconcile two sheets or tabs. Use when the user asks about reconcile sheets, spreadsheet match.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "browser"
      ],
      computerUse: false,
      approvals: [
        "warehouse-write"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Reconcile two sheets or tabs",
      category: "data",
      featured: false,
      skillMd: "---\nname: gsheet-reconcile\ndescription: >\n  Reconcile two sheets or tabs. Use when the user asks about reconcile sheets, spreadsheet match.\nwhen-to-use: reconcile sheets, spreadsheet match\nmetadata:\n  author: grok-skills\n  short-description: Reconcile two sheets or tabs\n  runtime: grok-bot\n  connectors: [browser]\n  computer-use: false\n  approvals: [warehouse-write]\n  category: data\n---\n\n## When to use\n\nUse for: Reconcile two sheets or tabs.\nTrigger phrases: reconcile sheets, spreadsheet match.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to browser (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Diff keys.\n2. Do not rewrite the sheet until approved.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: warehouse-write.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/habit-log-review",
      skillId: "habit-log-review",
      name: "habit-log-review",
      description: "Review a habit log and note streaks. Use when the user asks about habit log, streak review.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "browser"
      ],
      computerUse: false,
      approvals: [
        "external-send"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Review a habit log and note streaks",
      category: "personal",
      featured: false,
      skillMd: "---\nname: habit-log-review\ndescription: >\n  Review a habit log and note streaks. Use when the user asks about habit log, streak review.\nwhen-to-use: habit log, streak review\nmetadata:\n  author: grok-skills\n  short-description: Review a habit log and note streaks\n  runtime: grok-bot\n  connectors: [browser]\n  computer-use: false\n  approvals: [external-send]\n  category: personal\n---\n\n## When to use\n\nUse for: Review a habit log and note streaks.\nTrigger phrases: habit log, streak review.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to browser (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Summarize.\n2. Do not share privately logged data externally.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: external-send.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/headcount-plan-note",
      skillId: "headcount-plan-note",
      name: "headcount-plan-note",
      description: "Draft a headcount plan note from reqs. Use when the user asks about headcount plan, hiring plan.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "browser"
      ],
      computerUse: false,
      approvals: [
        "offer-send",
        "hr-system-write"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Draft a headcount plan note from reqs",
      category: "people",
      featured: false,
      skillMd: "---\nname: headcount-plan-note\ndescription: >\n  Draft a headcount plan note from reqs. Use when the user asks about headcount plan, hiring plan.\nwhen-to-use: headcount plan, hiring plan\nmetadata:\n  author: grok-skills\n  short-description: Draft a headcount plan note from reqs\n  runtime: grok-bot\n  connectors: [browser]\n  computer-use: false\n  approvals: [offer-send, hr-system-write]\n  category: people\n---\n\n## When to use\n\nUse for: Draft a headcount plan note from reqs.\nTrigger phrases: headcount plan, hiring plan.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to browser (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Summarize open reqs and dates.\n2. Do not open reqs.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: offer-send, hr-system-write.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/hiring-market-note",
      skillId: "hiring-market-note",
      name: "hiring-market-note",
      description: "Note hiring-market signals from public postings. Use when the user asks about hiring market, job postings signal.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "browser"
      ],
      computerUse: true,
      approvals: [
        "external-post"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Note hiring-market signals from public postings",
      category: "research",
      featured: false,
      skillMd: "---\nname: hiring-market-note\ndescription: >\n  Note hiring-market signals from public postings. Use when the user asks about hiring market, job postings signal.\nwhen-to-use: hiring market, job postings signal\nmetadata:\n  author: grok-skills\n  short-description: Note hiring-market signals from public postings\n  runtime: grok-bot\n  connectors: [browser]\n  computer-use: true\n  approvals: [external-post]\n  category: research\n---\n\n## When to use\n\nUse for: Note hiring-market signals from public postings.\nTrigger phrases: hiring market, job postings signal.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to browser (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Sample public posts.\n2. Do not spam candidates.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: external-post.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is allowed for listed sites; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/home-inventory",
      skillId: "home-inventory",
      name: "home-inventory",
      description: "Build a home inventory from photos or a list. Use when the user asks about home inventory, insurance inventory.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "browser"
      ],
      computerUse: false,
      approvals: [
        "external-send"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Build a home inventory from photos or a list",
      category: "personal",
      featured: false,
      skillMd: "---\nname: home-inventory\ndescription: >\n  Build a home inventory from photos or a list. Use when the user asks about home inventory, insurance inventory.\nwhen-to-use: home inventory, insurance inventory\nmetadata:\n  author: grok-skills\n  short-description: Build a home inventory from photos or a list\n  runtime: grok-bot\n  connectors: [browser]\n  computer-use: false\n  approvals: [external-send]\n  category: personal\n---\n\n## When to use\n\nUse for: Build a home inventory from photos or a list.\nTrigger phrases: home inventory, insurance inventory.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to browser (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. List items.\n2. Do not file an insurance claim.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: external-send.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/icp-fit-review",
      skillId: "icp-fit-review",
      name: "icp-fit-review",
      description: "Review a list of accounts for ICP fit. Use when the user asks about icp fit, target account review.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "salesforce"
      ],
      computerUse: false,
      approvals: [
        "customer-contact",
        "send-email"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Review a list of accounts for ICP fit",
      category: "crm",
      featured: false,
      skillMd: "---\nname: icp-fit-review\ndescription: >\n  Review a list of accounts for ICP fit. Use when the user asks about icp fit, target account review.\nwhen-to-use: icp fit, target account review\nmetadata:\n  author: grok-skills\n  short-description: Review a list of accounts for ICP fit\n  runtime: grok-bot\n  connectors: [salesforce]\n  computer-use: false\n  approvals: [customer-contact, send-email]\n  category: crm\n---\n\n## When to use\n\nUse for: Review a list of accounts for ICP fit.\nTrigger phrases: icp fit, target account review.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to salesforce (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Score against ICP rules.\n2. Return yes/maybe/no with reasons.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: customer-contact, send-email.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/incident-timeline",
      skillId: "incident-timeline",
      name: "incident-timeline",
      description: "Build an incident timeline from chat and deploys. Use when the user asks about incident timeline, postmortem draft.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "github"
      ],
      computerUse: false,
      approvals: [
        "merge-pr",
        "production-change"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Build an incident timeline from chat and deploys",
      category: "eng",
      featured: false,
      skillMd: "---\nname: incident-timeline\ndescription: >\n  Build an incident timeline from chat and deploys. Use when the user asks about incident timeline, postmortem draft.\nwhen-to-use: incident timeline, postmortem draft\nmetadata:\n  author: grok-skills\n  short-description: Build an incident timeline from chat and deploys\n  runtime: grok-bot\n  connectors: [github]\n  computer-use: false\n  approvals: [merge-pr, production-change]\n  category: eng\n---\n\n## When to use\n\nUse for: Build an incident timeline from chat and deploys.\nTrigger phrases: incident timeline, postmortem draft.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to github (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Order events.\n2. Do not page people.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: merge-pr, production-change.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/internal-wiki-answer",
      skillId: "internal-wiki-answer",
      name: "internal-wiki-answer",
      description: "Answer from the internal wiki and cite pages. Use when the user asks about wiki answer, notion wiki, confluence answer.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "browser"
      ],
      computerUse: true,
      approvals: [
        "saas-write",
        "send-message"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Answer from the internal wiki and cite pages",
      category: "saas",
      featured: false,
      skillMd: "---\nname: internal-wiki-answer\ndescription: >\n  Answer from the internal wiki and cite pages. Use when the user asks about wiki answer, notion wiki, confluence answer.\nwhen-to-use: wiki answer, notion wiki, confluence answer\nmetadata:\n  author: grok-skills\n  short-description: Answer from the internal wiki and cite pages\n  runtime: grok-bot\n  connectors: [browser]\n  computer-use: true\n  approvals: [saas-write, send-message]\n  category: saas\n---\n\n## When to use\n\nUse for: Answer from the internal wiki and cite pages.\nTrigger phrases: wiki answer, notion wiki, confluence answer.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to browser (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Cite page titles.\n2. Do not edit wiki pages.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: saas-write, send-message.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is allowed for listed sites; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/interview-loop-plan",
      skillId: "interview-loop-plan",
      name: "interview-loop-plan",
      description: "Plan an interview loop. Use when the user asks about interview loop, interview panel.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "browser"
      ],
      computerUse: false,
      approvals: [
        "offer-send",
        "hr-system-write"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Plan an interview loop",
      category: "people",
      featured: false,
      skillMd: "---\nname: interview-loop-plan\ndescription: >\n  Plan an interview loop. Use when the user asks about interview loop, interview panel.\nwhen-to-use: interview loop, interview panel\nmetadata:\n  author: grok-skills\n  short-description: Plan an interview loop\n  runtime: grok-bot\n  connectors: [browser]\n  computer-use: false\n  approvals: [offer-send, hr-system-write]\n  category: people\n---\n\n## When to use\n\nUse for: Plan an interview loop.\nTrigger phrases: interview loop, interview panel.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to browser (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Map competencies to interviewers.\n2. Do not send calendar invites until approved.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: offer-send, hr-system-write.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/inventory-exception",
      skillId: "inventory-exception",
      name: "inventory-exception",
      description: "List inventory exceptions. Use when the user asks about inventory exception, stockout.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "browser"
      ],
      computerUse: true,
      approvals: [
        "vendor-change",
        "purchase"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "List inventory exceptions",
      category: "ops",
      featured: false,
      skillMd: "---\nname: inventory-exception\ndescription: >\n  List inventory exceptions. Use when the user asks about inventory exception, stockout.\nwhen-to-use: inventory exception, stockout\nmetadata:\n  author: grok-skills\n  short-description: List inventory exceptions\n  runtime: grok-bot\n  connectors: [browser]\n  computer-use: true\n  approvals: [vendor-change, purchase]\n  category: ops\n---\n\n## When to use\n\nUse for: List inventory exceptions.\nTrigger phrases: inventory exception, stockout.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to browser (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Flag shortages/overstock.\n2. Do not place POs.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: vendor-change, purchase.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is allowed for listed sites; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/invoice-draft",
      skillId: "invoice-draft",
      name: "invoice-draft",
      description: "Draft an invoice from line items. Use when the user asks about draft invoice, bill a customer.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "browser",
        "drive"
      ],
      computerUse: true,
      approvals: [
        "submit-expense",
        "purchase"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Draft an invoice from line items",
      category: "finance",
      featured: false,
      skillMd: "---\nname: invoice-draft\ndescription: >\n  Draft an invoice from line items. Use when the user asks about draft invoice, bill a customer.\nwhen-to-use: draft invoice, bill a customer\nmetadata:\n  author: grok-skills\n  short-description: Draft an invoice from line items\n  runtime: grok-bot\n  connectors: [browser, drive]\n  computer-use: true\n  approvals: [submit-expense, purchase]\n  category: finance\n---\n\n## When to use\n\nUse for: Draft an invoice from line items.\nTrigger phrases: draft invoice, bill a customer.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to browser (read unless a later step says otherwise)\n- Access to drive (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Build line items.\n2. Do not send the invoice.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: submit-expense, purchase.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is allowed for listed sites; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/jira-sprint-hygiene",
      skillId: "jira-sprint-hygiene",
      name: "jira-sprint-hygiene",
      description: "Flag sprint hygiene issues. Use when the user asks about sprint hygiene, jira sprint.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "browser"
      ],
      computerUse: true,
      approvals: [
        "saas-write",
        "send-message"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Flag sprint hygiene issues",
      category: "saas",
      featured: false,
      skillMd: "---\nname: jira-sprint-hygiene\ndescription: >\n  Flag sprint hygiene issues. Use when the user asks about sprint hygiene, jira sprint.\nwhen-to-use: sprint hygiene, jira sprint\nmetadata:\n  author: grok-skills\n  short-description: Flag sprint hygiene issues\n  runtime: grok-bot\n  connectors: [browser]\n  computer-use: true\n  approvals: [saas-write, send-message]\n  category: saas\n---\n\n## When to use\n\nUse for: Flag sprint hygiene issues.\nTrigger phrases: sprint hygiene, jira sprint.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to browser (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Find missing estimates or stale tickets.\n2. Do not move tickets until approved.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: saas-write, send-message.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is allowed for listed sites; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/job-post-draft",
      skillId: "job-post-draft",
      name: "job-post-draft",
      description: "Draft a job post from a JD. Use when the user asks about job post, write a job description.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "browser"
      ],
      computerUse: false,
      approvals: [
        "offer-send",
        "hr-system-write"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Draft a job post from a JD",
      category: "people",
      featured: false,
      skillMd: "---\nname: job-post-draft\ndescription: >\n  Draft a job post from a JD. Use when the user asks about job post, write a job description.\nwhen-to-use: job post, write a job description\nmetadata:\n  author: grok-skills\n  short-description: Draft a job post from a JD\n  runtime: grok-bot\n  connectors: [browser]\n  computer-use: false\n  approvals: [offer-send, hr-system-write]\n  category: people\n---\n\n## When to use\n\nUse for: Draft a job post from a JD.\nTrigger phrases: job post, write a job description.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to browser (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Draft the post.\n2. Do not publish.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: offer-send, hr-system-write.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/knowledge-gap-notes",
      skillId: "knowledge-gap-notes",
      name: "knowledge-gap-notes",
      description: "Find repeating tickets that need a help-center article. Use when the user asks about knowledge gap, missing help article.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "browser"
      ],
      computerUse: true,
      approvals: [
        "customer-contact",
        "production-access"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Find repeating tickets that need a help-center article",
      category: "support",
      featured: false,
      skillMd: "---\nname: knowledge-gap-notes\ndescription: >\n  Find repeating tickets that need a help-center article. Use when the user asks about knowledge gap, missing help article.\nwhen-to-use: knowledge gap, missing help article\nmetadata:\n  author: grok-skills\n  short-description: Find repeating tickets that need a help-center article\n  runtime: grok-bot\n  connectors: [browser]\n  computer-use: true\n  approvals: [customer-contact, production-access]\n  category: support\n---\n\n## When to use\n\nUse for: Find repeating tickets that need a help-center article.\nTrigger phrases: knowledge gap, missing help article.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to browser (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Cluster repeats.\n2. Draft article outlines. Do not publish.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: customer-contact, production-access.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is allowed for listed sites; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/launch-checklist",
      skillId: "launch-checklist",
      name: "launch-checklist",
      description: "Build a launch checklist. Use when the user asks about launch checklist, go live list.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "drive"
      ],
      computerUse: false,
      approvals: [
        "publish",
        "email-broadcast"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Build a launch checklist",
      category: "docs",
      featured: false,
      skillMd: "---\nname: launch-checklist\ndescription: >\n  Build a launch checklist. Use when the user asks about launch checklist, go live list.\nwhen-to-use: launch checklist, go live list\nmetadata:\n  author: grok-skills\n  short-description: Build a launch checklist\n  runtime: grok-bot\n  connectors: [drive]\n  computer-use: false\n  approvals: [publish, email-broadcast]\n  category: docs\n---\n\n## When to use\n\nUse for: Build a launch checklist.\nTrigger phrases: launch checklist, go live list.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to drive (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Cover comms, flags, rollback.\n2. Do not flip flags.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: publish, email-broadcast.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/lead-score",
      skillId: "lead-score",
      name: "lead-score",
      description: "Score new leads against the ICP. Use when the user asks about lead scoring, qualify leads, icp match.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "salesforce"
      ],
      computerUse: false,
      approvals: [
        "customer-contact",
        "send-email"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Score new leads against the ICP",
      category: "crm",
      featured: false,
      skillMd: "---\nname: lead-score\ndescription: >\n  Score new leads against the ICP. Use when the user asks about lead scoring, qualify leads, icp match.\nwhen-to-use: lead scoring, qualify leads, icp match\nmetadata:\n  author: grok-skills\n  short-description: Score new leads against the ICP\n  runtime: grok-bot\n  connectors: [salesforce]\n  computer-use: false\n  approvals: [customer-contact, send-email]\n  category: crm\n---\n\n## When to use\n\nUse for: Score new leads against the ICP.\nTrigger phrases: lead scoring, qualify leads, icp match.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to salesforce (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Score leads.\n2. Return a ranked list. Do not enroll sequences.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: customer-contact, send-email.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/license-compat-note",
      skillId: "license-compat-note",
      name: "license-compat-note",
      description: "Note OSS license compatibility questions. Use when the user asks about oss license, gpl question.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "drive"
      ],
      computerUse: false,
      approvals: [
        "legal-send",
        "sign-document"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Note OSS license compatibility questions",
      category: "legal",
      featured: false,
      skillMd: "---\nname: license-compat-note\ndescription: >\n  Note OSS license compatibility questions. Use when the user asks about oss license, gpl question.\nwhen-to-use: oss license, gpl question\nmetadata:\n  author: grok-skills\n  short-description: Note OSS license compatibility questions\n  runtime: grok-bot\n  connectors: [drive]\n  computer-use: false\n  approvals: [legal-send, sign-document]\n  category: legal\n---\n\n## When to use\n\nUse for: Note OSS license compatibility questions.\nTrigger phrases: oss license, gpl question.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to drive (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Flag questions for counsel.\n2. Do not relicence.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: legal-send, sign-document.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/license-expiry-watch",
      skillId: "license-expiry-watch",
      name: "license-expiry-watch",
      description: "Watch software license expiry dates. Use when the user asks about license expiry, seat renewal.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "browser"
      ],
      computerUse: true,
      approvals: [
        "vendor-change",
        "purchase"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Watch software license expiry dates",
      category: "ops",
      featured: false,
      skillMd: "---\nname: license-expiry-watch\ndescription: >\n  Watch software license expiry dates. Use when the user asks about license expiry, seat renewal.\nwhen-to-use: license expiry, seat renewal\nmetadata:\n  author: grok-skills\n  short-description: Watch software license expiry dates\n  runtime: grok-bot\n  connectors: [browser]\n  computer-use: true\n  approvals: [vendor-change, purchase]\n  category: ops\n---\n\n## When to use\n\nUse for: Watch software license expiry dates.\nTrigger phrases: license expiry, seat renewal.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to browser (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. List dates.\n2. Do not auto-buy seats.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: vendor-change, purchase.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is allowed for listed sites; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/linear-issue-pack",
      skillId: "linear-issue-pack",
      name: "linear-issue-pack",
      description: "Pack a Linear/Jira-style issue from a bug. Use when the user asks about linear issue, jira ticket draft.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "browser"
      ],
      computerUse: true,
      approvals: [
        "saas-write",
        "send-message"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Pack a Linear/Jira-style issue from a bug",
      category: "saas",
      featured: false,
      skillMd: "---\nname: linear-issue-pack\ndescription: >\n  Pack a Linear/Jira-style issue from a bug. Use when the user asks about linear issue, jira ticket draft.\nwhen-to-use: linear issue, jira ticket draft\nmetadata:\n  author: grok-skills\n  short-description: Pack a Linear/Jira-style issue from a bug\n  runtime: grok-bot\n  connectors: [browser]\n  computer-use: true\n  approvals: [saas-write, send-message]\n  category: saas\n---\n\n## When to use\n\nUse for: Pack a Linear/Jira-style issue from a bug.\nTrigger phrases: linear issue, jira ticket draft.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to browser (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Fill title, repro, expected.\n2. Do not create the issue until approved.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: saas-write, send-message.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is allowed for listed sites; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/local-repro-from-ticket",
      skillId: "local-repro-from-ticket",
      name: "local-repro-from-ticket",
      description: "Turn a ticket into local reproduction steps. Use when the user asks about local repro, run this bug locally.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "github"
      ],
      computerUse: false,
      approvals: [
        "merge-pr",
        "production-change"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Turn a ticket into local reproduction steps",
      category: "eng",
      featured: false,
      skillMd: "---\nname: local-repro-from-ticket\ndescription: >\n  Turn a ticket into local reproduction steps. Use when the user asks about local repro, run this bug locally.\nwhen-to-use: local repro, run this bug locally\nmetadata:\n  author: grok-skills\n  short-description: Turn a ticket into local reproduction steps\n  runtime: grok-bot\n  connectors: [github]\n  computer-use: false\n  approvals: [merge-pr, production-change]\n  category: eng\n---\n\n## When to use\n\nUse for: Turn a ticket into local reproduction steps.\nTrigger phrases: local repro, run this bug locally.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to github (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Write steps and fixtures.\n2. Do not use production data.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: merge-pr, production-change.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/log-spike-explain",
      skillId: "log-spike-explain",
      name: "log-spike-explain",
      description: "Explain a log or error spike. Use when the user asks about error spike, log volume.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "github"
      ],
      computerUse: false,
      approvals: [
        "merge-pr",
        "production-change"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Explain a log or error spike",
      category: "eng",
      featured: false,
      skillMd: "---\nname: log-spike-explain\ndescription: >\n  Explain a log or error spike. Use when the user asks about error spike, log volume.\nwhen-to-use: error spike, log volume\nmetadata:\n  author: grok-skills\n  short-description: Explain a log or error spike\n  runtime: grok-bot\n  connectors: [github]\n  computer-use: false\n  approvals: [merge-pr, production-change]\n  category: eng\n---\n\n## When to use\n\nUse for: Explain a log or error spike.\nTrigger phrases: error spike, log volume.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to github (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Identify top signatures.\n2. Do not change sampling.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: merge-pr, production-change.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/macro-draft",
      skillId: "macro-draft",
      name: "macro-draft",
      description: "Draft a support macro from a good reply. Use when the user asks about support macro, canned response.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "browser"
      ],
      computerUse: true,
      approvals: [
        "customer-contact",
        "production-access"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Draft a support macro from a good reply",
      category: "support",
      featured: false,
      skillMd: "---\nname: macro-draft\ndescription: >\n  Draft a support macro from a good reply. Use when the user asks about support macro, canned response.\nwhen-to-use: support macro, canned response\nmetadata:\n  author: grok-skills\n  short-description: Draft a support macro from a good reply\n  runtime: grok-bot\n  connectors: [browser]\n  computer-use: true\n  approvals: [customer-contact, production-access]\n  category: support\n---\n\n## When to use\n\nUse for: Draft a support macro from a good reply.\nTrigger phrases: support macro, canned response.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to browser (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Turn the reply into a reusable macro.\n2. Do not publish the macro until approved.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: customer-contact, production-access.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is allowed for listed sites; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/mailing-list-digest",
      skillId: "mailing-list-digest",
      name: "mailing-list-digest",
      description: "Collapse mailing-list traffic into themes. Use when the user asks about mailing list digest, listserv summary.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "gmail"
      ],
      computerUse: false,
      approvals: [
        "send-email",
        "archive"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Collapse mailing-list traffic into themes",
      category: "inbox",
      featured: false,
      skillMd: "---\nname: mailing-list-digest\ndescription: >\n  Collapse mailing-list traffic into themes. Use when the user asks about mailing list digest, listserv summary.\nwhen-to-use: mailing list digest, listserv summary\nmetadata:\n  author: grok-skills\n  short-description: Collapse mailing-list traffic into themes\n  runtime: grok-bot\n  connectors: [gmail]\n  computer-use: false\n  approvals: [send-email, archive]\n  category: inbox\n---\n\n## When to use\n\nUse for: Collapse mailing-list traffic into themes.\nTrigger phrases: mailing list digest, listserv summary.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to gmail (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Group by list.\n2. Return themes and notable threads.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: send-email, archive.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/market-sizing-note",
      skillId: "market-sizing-note",
      name: "market-sizing-note",
      description: "Draft a market-sizing note with sources. Use when the user asks about market size, tam sam som.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "browser"
      ],
      computerUse: true,
      approvals: [
        "external-post"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Draft a market-sizing note with sources",
      category: "research",
      featured: false,
      skillMd: "---\nname: market-sizing-note\ndescription: >\n  Draft a market-sizing note with sources. Use when the user asks about market size, tam sam som.\nwhen-to-use: market size, tam sam som\nmetadata:\n  author: grok-skills\n  short-description: Draft a market-sizing note with sources\n  runtime: grok-bot\n  connectors: [browser]\n  computer-use: true\n  approvals: [external-post]\n  category: research\n---\n\n## When to use\n\nUse for: Draft a market-sizing note with sources.\nTrigger phrases: market size, tam sam som.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to browser (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Cite sources.\n2. Do not present as audited research.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: external-post.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is allowed for listed sites; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/meeting-agenda",
      skillId: "meeting-agenda",
      name: "meeting-agenda",
      description: "Draft an agenda from the invite and docs. Use when the user asks about meeting agenda, agenda for standup.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "google-calendar"
      ],
      computerUse: false,
      approvals: [
        "create-event",
        "send-invite"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Draft an agenda from the invite and docs",
      category: "calendar",
      featured: false,
      skillMd: "---\nname: meeting-agenda\ndescription: >\n  Draft an agenda from the invite and docs. Use when the user asks about meeting agenda, agenda for standup.\nwhen-to-use: meeting agenda, agenda for standup\nmetadata:\n  author: grok-skills\n  short-description: Draft an agenda from the invite and docs\n  runtime: grok-bot\n  connectors: [google-calendar]\n  computer-use: false\n  approvals: [create-event, send-invite]\n  category: calendar\n---\n\n## When to use\n\nUse for: Draft an agenda from the invite and docs.\nTrigger phrases: meeting agenda, agenda for standup.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to google-calendar (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Read invite + linked docs.\n2. Draft agenda. Do not email attendees.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: create-event, send-invite.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/meeting-notes-pack",
      skillId: "meeting-notes-pack",
      name: "meeting-notes-pack",
      description: "Turn notes into decisions, owners, and dates. Use when the user asks about meeting notes, action items from meeting.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "google-calendar"
      ],
      computerUse: false,
      approvals: [
        "create-event",
        "send-invite"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Turn notes into decisions, owners, and dates",
      category: "calendar",
      featured: false,
      skillMd: "---\nname: meeting-notes-pack\ndescription: >\n  Turn notes into decisions, owners, and dates. Use when the user asks about meeting notes, action items from meeting.\nwhen-to-use: meeting notes, action items from meeting\nmetadata:\n  author: grok-skills\n  short-description: Turn notes into decisions, owners, and dates\n  runtime: grok-bot\n  connectors: [google-calendar]\n  computer-use: false\n  approvals: [create-event, send-invite]\n  category: calendar\n---\n\n## When to use\n\nUse for: Turn notes into decisions, owners, and dates.\nTrigger phrases: meeting notes, action items from meeting.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to google-calendar (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Structure notes.\n2. Do not create tracker tickets until approved.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: create-event, send-invite.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/meeting-recap",
      skillId: "meeting-recap",
      name: "meeting-recap",
      description: "Write a meeting recap with owners and dates. Use when the user asks about meeting recap, send notes.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "drive"
      ],
      computerUse: false,
      approvals: [
        "publish",
        "email-broadcast"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Write a meeting recap with owners and dates",
      category: "docs",
      featured: false,
      skillMd: "---\nname: meeting-recap\ndescription: >\n  Write a meeting recap with owners and dates. Use when the user asks about meeting recap, send notes.\nwhen-to-use: meeting recap, send notes\nmetadata:\n  author: grok-skills\n  short-description: Write a meeting recap with owners and dates\n  runtime: grok-bot\n  connectors: [drive]\n  computer-use: false\n  approvals: [publish, email-broadcast]\n  category: docs\n---\n\n## When to use\n\nUse for: Write a meeting recap with owners and dates.\nTrigger phrases: meeting recap, send notes.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to drive (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Write the recap.\n2. Do not email the list until approved.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: publish, email-broadcast.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/meeting-request-triage",
      skillId: "meeting-request-triage",
      name: "meeting-request-triage",
      description: "Triage meeting-request emails. Use when the user asks about meeting request email, calendar invite from mail.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "gmail"
      ],
      computerUse: false,
      approvals: [
        "send-email",
        "archive"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Triage meeting-request emails",
      category: "inbox",
      featured: false,
      skillMd: "---\nname: meeting-request-triage\ndescription: >\n  Triage meeting-request emails. Use when the user asks about meeting request email, calendar invite from mail.\nwhen-to-use: meeting request email, calendar invite from mail\nmetadata:\n  author: grok-skills\n  short-description: Triage meeting-request emails\n  runtime: grok-bot\n  connectors: [gmail]\n  computer-use: false\n  approvals: [send-email, archive]\n  category: inbox\n---\n\n## When to use\n\nUse for: Triage meeting-request emails.\nTrigger phrases: meeting request email, calendar invite from mail.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to gmail (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Parse time, attendees, purpose.\n2. Propose accept/decline. Do not respond until approved.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: send-email, archive.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/metric-definition-check",
      skillId: "metric-definition-check",
      name: "metric-definition-check",
      description: "Check a metric against its definition. Use when the user asks about metric definition, is this kpi correct.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "browser"
      ],
      computerUse: false,
      approvals: [
        "warehouse-write"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Check a metric against its definition",
      category: "data",
      featured: false,
      skillMd: "---\nname: metric-definition-check\ndescription: >\n  Check a metric against its definition. Use when the user asks about metric definition, is this kpi correct.\nwhen-to-use: metric definition, is this kpi correct\nmetadata:\n  author: grok-skills\n  short-description: Check a metric against its definition\n  runtime: grok-bot\n  connectors: [browser]\n  computer-use: false\n  approvals: [warehouse-write]\n  category: data\n---\n\n## When to use\n\nUse for: Check a metric against its definition.\nTrigger phrases: metric definition, is this kpi correct.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to browser (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Compare formula vs docs.\n2. Do not edit the BI tool until approved.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: warehouse-write.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/migrate-plan-review",
      skillId: "migrate-plan-review",
      name: "migrate-plan-review",
      description: "Review a database migration plan. Use when the user asks about migration review, schema migrate.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "github"
      ],
      computerUse: false,
      approvals: [
        "merge-pr",
        "production-change"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Review a database migration plan",
      category: "eng",
      featured: false,
      skillMd: "---\nname: migrate-plan-review\ndescription: >\n  Review a database migration plan. Use when the user asks about migration review, schema migrate.\nwhen-to-use: migration review, schema migrate\nmetadata:\n  author: grok-skills\n  short-description: Review a database migration plan\n  runtime: grok-bot\n  connectors: [github]\n  computer-use: false\n  approvals: [merge-pr, production-change]\n  category: eng\n---\n\n## When to use\n\nUse for: Review a database migration plan.\nTrigger phrases: migration review, schema migrate.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to github (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Check expand/contract and rollback.\n2. Do not run migrations.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: merge-pr, production-change.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/multi-site-price-check",
      skillId: "multi-site-price-check",
      name: "multi-site-price-check",
      description: "Compare public prices across sites. Use when the user asks about price check, compare prices.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "browser"
      ],
      computerUse: true,
      approvals: [
        "saas-write",
        "send-message"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Compare public prices across sites",
      category: "saas",
      featured: false,
      skillMd: "---\nname: multi-site-price-check\ndescription: >\n  Compare public prices across sites. Use when the user asks about price check, compare prices.\nwhen-to-use: price check, compare prices\nmetadata:\n  author: grok-skills\n  short-description: Compare public prices across sites\n  runtime: grok-bot\n  connectors: [browser]\n  computer-use: true\n  approvals: [saas-write, send-message]\n  category: saas\n---\n\n## When to use\n\nUse for: Compare public prices across sites.\nTrigger phrases: price check, compare prices.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to browser (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Public pages only.\n2. Do not purchase.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: saas-write, send-message.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is allowed for listed sites; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/nda-intake",
      skillId: "nda-intake",
      name: "nda-intake",
      description: "Intake an NDA into a checklist. Use when the user asks about nda intake, incoming nda.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "drive"
      ],
      computerUse: false,
      approvals: [
        "legal-send",
        "sign-document"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Intake an NDA into a checklist",
      category: "legal",
      featured: false,
      skillMd: "---\nname: nda-intake\ndescription: >\n  Intake an NDA into a checklist. Use when the user asks about nda intake, incoming nda.\nwhen-to-use: nda intake, incoming nda\nmetadata:\n  author: grok-skills\n  short-description: Intake an NDA into a checklist\n  runtime: grok-bot\n  connectors: [drive]\n  computer-use: false\n  approvals: [legal-send, sign-document]\n  category: legal\n---\n\n## When to use\n\nUse for: Intake an NDA into a checklist.\nTrigger phrases: nda intake, incoming nda.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to drive (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Extract parties and term.\n2. Do not sign.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: legal-send, sign-document.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/news-watchlist",
      skillId: "news-watchlist",
      name: "news-watchlist",
      description: "Digest news for a watchlist of companies. Use when the user asks about news watchlist, company news digest.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "browser"
      ],
      computerUse: true,
      approvals: [
        "external-post"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Digest news for a watchlist of companies",
      category: "research",
      featured: false,
      skillMd: "---\nname: news-watchlist\ndescription: >\n  Digest news for a watchlist of companies. Use when the user asks about news watchlist, company news digest.\nwhen-to-use: news watchlist, company news digest\nmetadata:\n  author: grok-skills\n  short-description: Digest news for a watchlist of companies\n  runtime: grok-bot\n  connectors: [browser]\n  computer-use: true\n  approvals: [external-post]\n  category: research\n---\n\n## When to use\n\nUse for: Digest news for a watchlist of companies.\nTrigger phrases: news watchlist, company news digest.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to browser (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Use public news.\n2. Do not tweet.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: external-post.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is allowed for listed sites; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/notion-page-draft",
      skillId: "notion-page-draft",
      name: "notion-page-draft",
      description: "Draft a Notion page in markdown. Use when the user asks about draft notion page, write a notion doc.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "browser"
      ],
      computerUse: true,
      approvals: [
        "saas-write",
        "send-message"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Draft a Notion page in markdown",
      category: "saas",
      featured: false,
      skillMd: "---\nname: notion-page-draft\ndescription: >\n  Draft a Notion page in markdown. Use when the user asks about draft notion page, write a notion doc.\nwhen-to-use: draft notion page, write a notion doc\nmetadata:\n  author: grok-skills\n  short-description: Draft a Notion page in markdown\n  runtime: grok-bot\n  connectors: [browser]\n  computer-use: true\n  approvals: [saas-write, send-message]\n  category: saas\n---\n\n## When to use\n\nUse for: Draft a Notion page in markdown.\nTrigger phrases: draft notion page, write a notion doc.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to browser (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Draft markdown.\n2. Do not publish until approved.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: saas-write, send-message.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is allowed for listed sites; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/offer-comp-note",
      skillId: "offer-comp-note",
      name: "offer-comp-note",
      description: "Draft an offer compensation note. Use when the user asks about offer letter notes, comp note.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "browser"
      ],
      computerUse: false,
      approvals: [
        "offer-send",
        "hr-system-write"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Draft an offer compensation note",
      category: "people",
      featured: false,
      skillMd: "---\nname: offer-comp-note\ndescription: >\n  Draft an offer compensation note. Use when the user asks about offer letter notes, comp note.\nwhen-to-use: offer letter notes, comp note\nmetadata:\n  author: grok-skills\n  short-description: Draft an offer compensation note\n  runtime: grok-bot\n  connectors: [browser]\n  computer-use: false\n  approvals: [offer-send, hr-system-write]\n  category: people\n---\n\n## When to use\n\nUse for: Draft an offer compensation note.\nTrigger phrases: offer letter notes, comp note.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to browser (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Use bands if provided.\n2. Do not send an offer.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: offer-send, hr-system-write.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/onboarding-checklist",
      skillId: "onboarding-checklist",
      name: "onboarding-checklist",
      description: "Build a role-specific onboarding checklist. Use when the user asks about onboarding plan, new hire checklist.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "browser"
      ],
      computerUse: false,
      approvals: [
        "offer-send",
        "hr-system-write"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Build a role-specific onboarding checklist",
      category: "people",
      featured: false,
      skillMd: "---\nname: onboarding-checklist\ndescription: >\n  Build a role-specific onboarding checklist. Use when the user asks about onboarding plan, new hire checklist.\nwhen-to-use: onboarding plan, new hire checklist\nmetadata:\n  author: grok-skills\n  short-description: Build a role-specific onboarding checklist\n  runtime: grok-bot\n  connectors: [browser]\n  computer-use: false\n  approvals: [offer-send, hr-system-write]\n  category: people\n---\n\n## When to use\n\nUse for: Build a role-specific onboarding checklist.\nTrigger phrases: onboarding plan, new hire checklist.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to browser (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. List access, people, and 30/60/90.\n2. Do not provision accounts.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: offer-send, hr-system-write.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/oncall-handoff",
      skillId: "oncall-handoff",
      name: "oncall-handoff",
      description: "Draft an on-call handoff. Use when the user asks about oncall handoff, pager handoff.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "github"
      ],
      computerUse: false,
      approvals: [
        "merge-pr",
        "production-change"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Draft an on-call handoff",
      category: "eng",
      featured: false,
      skillMd: "---\nname: oncall-handoff\ndescription: >\n  Draft an on-call handoff. Use when the user asks about oncall handoff, pager handoff.\nwhen-to-use: oncall handoff, pager handoff\nmetadata:\n  author: grok-skills\n  short-description: Draft an on-call handoff\n  runtime: grok-bot\n  connectors: [github]\n  computer-use: false\n  approvals: [merge-pr, production-change]\n  category: eng\n---\n\n## When to use\n\nUse for: Draft an on-call handoff.\nTrigger phrases: oncall handoff, pager handoff.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to github (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Collect open incidents and pages.\n2. Do not snooze pages.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: merge-pr, production-change.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/out-of-office-brief",
      skillId: "out-of-office-brief",
      name: "out-of-office-brief",
      description: "Brief the user after time away. Use when the user asks about ooo brief, back from vacation inbox.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "gmail"
      ],
      computerUse: false,
      approvals: [
        "send-email",
        "archive"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Brief the user after time away",
      category: "inbox",
      featured: false,
      skillMd: "---\nname: out-of-office-brief\ndescription: >\n  Brief the user after time away. Use when the user asks about ooo brief, back from vacation inbox.\nwhen-to-use: ooo brief, back from vacation inbox\nmetadata:\n  author: grok-skills\n  short-description: Brief the user after time away\n  runtime: grok-bot\n  connectors: [gmail]\n  computer-use: false\n  approvals: [send-email, archive]\n  category: inbox\n---\n\n## When to use\n\nUse for: Brief the user after time away.\nTrigger phrases: ooo brief, back from vacation inbox.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to gmail (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Cover the away window.\n2. Split urgent vs can-wait.\n3. Draft replies for urgent only.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: send-email, archive.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/outbound-drafts",
      skillId: "outbound-drafts",
      name: "outbound-drafts",
      description: "Draft outbound email and LinkedIn in the user's voice. Use when the user asks about outbound drafts, sales email draft, linkedin outreach draft.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "salesforce"
      ],
      computerUse: false,
      approvals: [
        "customer-contact",
        "send-email"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Draft outbound email and LinkedIn in the user's voice",
      category: "crm",
      featured: false,
      skillMd: "---\nname: outbound-drafts\ndescription: >\n  Draft outbound email and LinkedIn in the user's voice. Use when the user asks about outbound drafts, sales email draft, linkedin outreach draft.\nwhen-to-use: outbound drafts, sales email draft, linkedin outreach draft\nmetadata:\n  author: grok-skills\n  short-description: Draft outbound email and LinkedIn in the user's voice\n  runtime: grok-bot\n  connectors: [salesforce]\n  computer-use: false\n  approvals: [customer-contact, send-email]\n  category: crm\n---\n\n## When to use\n\nUse for: Draft outbound email and LinkedIn in the user's voice.\nTrigger phrases: outbound drafts, sales email draft, linkedin outreach draft.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to salesforce (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Draft per contact.\n2. Do not send or connect.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: customer-contact, send-email.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/paper-brief",
      skillId: "paper-brief",
      name: "paper-brief",
      description: "Brief a paper or PDF. Use when the user asks about paper brief, summarize pdf paper.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "browser"
      ],
      computerUse: true,
      approvals: [
        "external-post"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Brief a paper or PDF",
      category: "research",
      featured: false,
      skillMd: "---\nname: paper-brief\ndescription: >\n  Brief a paper or PDF. Use when the user asks about paper brief, summarize pdf paper.\nwhen-to-use: paper brief, summarize pdf paper\nmetadata:\n  author: grok-skills\n  short-description: Brief a paper or PDF\n  runtime: grok-bot\n  connectors: [browser]\n  computer-use: true\n  approvals: [external-post]\n  category: research\n---\n\n## When to use\n\nUse for: Brief a paper or PDF.\nTrigger phrases: paper brief, summarize pdf paper.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to browser (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Summarize claims and limits.\n2. Do not plagiarize into a publication.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: external-post.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is allowed for listed sites; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/patent-quick-look",
      skillId: "patent-quick-look",
      name: "patent-quick-look",
      description: "Quick-look public patent abstracts. Use when the user asks about patent search, prior art look.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "browser"
      ],
      computerUse: true,
      approvals: [
        "external-post"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Quick-look public patent abstracts",
      category: "research",
      featured: false,
      skillMd: "---\nname: patent-quick-look\ndescription: >\n  Quick-look public patent abstracts. Use when the user asks about patent search, prior art look.\nwhen-to-use: patent search, prior art look\nmetadata:\n  author: grok-skills\n  short-description: Quick-look public patent abstracts\n  runtime: grok-bot\n  connectors: [browser]\n  computer-use: true\n  approvals: [external-post]\n  category: research\n---\n\n## When to use\n\nUse for: Quick-look public patent abstracts.\nTrigger phrases: patent search, prior art look.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to browser (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Use public patent offices.\n2. Do not file anything.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: external-post.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is allowed for listed sites; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/payroll-change-check",
      skillId: "payroll-change-check",
      name: "payroll-change-check",
      description: "Check a proposed payroll change for missing fields. Use when the user asks about payroll change, compensation change check.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "browser",
        "drive"
      ],
      computerUse: true,
      approvals: [
        "submit-expense",
        "purchase"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Check a proposed payroll change for missing fields",
      category: "finance",
      featured: false,
      skillMd: "---\nname: payroll-change-check\ndescription: >\n  Check a proposed payroll change for missing fields. Use when the user asks about payroll change, compensation change check.\nwhen-to-use: payroll change, compensation change check\nmetadata:\n  author: grok-skills\n  short-description: Check a proposed payroll change for missing fields\n  runtime: grok-bot\n  connectors: [browser, drive]\n  computer-use: true\n  approvals: [submit-expense, purchase]\n  category: finance\n---\n\n## When to use\n\nUse for: Check a proposed payroll change for missing fields.\nTrigger phrases: payroll change, compensation change check.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to browser (read unless a later step says otherwise)\n- Access to drive (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Validate fields.\n2. Do not submit payroll.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: submit-expense, purchase.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is allowed for listed sites; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/perf-regression-notes",
      skillId: "perf-regression-notes",
      name: "perf-regression-notes",
      description: "Turn a perf diff into notes and suspects. Use when the user asks about perf regression, slower p95.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "github"
      ],
      computerUse: false,
      approvals: [
        "merge-pr",
        "production-change"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Turn a perf diff into notes and suspects",
      category: "eng",
      featured: false,
      skillMd: "---\nname: perf-regression-notes\ndescription: >\n  Turn a perf diff into notes and suspects. Use when the user asks about perf regression, slower p95.\nwhen-to-use: perf regression, slower p95\nmetadata:\n  author: grok-skills\n  short-description: Turn a perf diff into notes and suspects\n  runtime: grok-bot\n  connectors: [github]\n  computer-use: false\n  approvals: [merge-pr, production-change]\n  category: eng\n---\n\n## When to use\n\nUse for: Turn a perf diff into notes and suspects.\nTrigger phrases: perf regression, slower p95.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to github (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Compare metrics.\n2. Do not roll back.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: merge-pr, production-change.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/performance-packet",
      skillId: "performance-packet",
      name: "performance-packet",
      description: "Assemble a performance-review packet from notes. Use when the user asks about performance review packet, promo packet.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "browser"
      ],
      computerUse: false,
      approvals: [
        "offer-send",
        "hr-system-write"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Assemble a performance-review packet from notes",
      category: "people",
      featured: false,
      skillMd: "---\nname: performance-packet\ndescription: >\n  Assemble a performance-review packet from notes. Use when the user asks about performance review packet, promo packet.\nwhen-to-use: performance review packet, promo packet\nmetadata:\n  author: grok-skills\n  short-description: Assemble a performance-review packet from notes\n  runtime: grok-bot\n  connectors: [browser]\n  computer-use: false\n  approvals: [offer-send, hr-system-write]\n  category: people\n---\n\n## When to use\n\nUse for: Assemble a performance-review packet from notes.\nTrigger phrases: performance review packet, promo packet.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to browser (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Organize evidence.\n2. Do not submit the review.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: offer-send, hr-system-write.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/pipeline-hygiene",
      skillId: "pipeline-hygiene",
      name: "pipeline-hygiene",
      description: "Flag stale or mis-staged deals. Use when the user asks about pipeline hygiene, crm cleanup, stale deals.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "salesforce"
      ],
      computerUse: false,
      approvals: [
        "customer-contact",
        "send-email"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Flag stale or mis-staged deals",
      category: "crm",
      featured: false,
      skillMd: "---\nname: pipeline-hygiene\ndescription: >\n  Flag stale or mis-staged deals. Use when the user asks about pipeline hygiene, crm cleanup, stale deals.\nwhen-to-use: pipeline hygiene, crm cleanup, stale deals\nmetadata:\n  author: grok-skills\n  short-description: Flag stale or mis-staged deals\n  runtime: grok-bot\n  connectors: [salesforce]\n  computer-use: false\n  approvals: [customer-contact, send-email]\n  category: crm\n---\n\n## When to use\n\nUse for: Flag stale or mis-staged deals.\nTrigger phrases: pipeline hygiene, crm cleanup, stale deals.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to salesforce (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Find stale close dates and empty next steps.\n2. Propose field updates. Do not write until approved.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: customer-contact, send-email.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/policy-diff",
      skillId: "policy-diff",
      name: "policy-diff",
      description: "Diff two policy versions in plain language. Use when the user asks about policy diff, what changed in the policy.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "drive"
      ],
      computerUse: false,
      approvals: [
        "publish",
        "email-broadcast"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Diff two policy versions in plain language",
      category: "docs",
      featured: false,
      skillMd: "---\nname: policy-diff\ndescription: >\n  Diff two policy versions in plain language. Use when the user asks about policy diff, what changed in the policy.\nwhen-to-use: policy diff, what changed in the policy\nmetadata:\n  author: grok-skills\n  short-description: Diff two policy versions in plain language\n  runtime: grok-bot\n  connectors: [drive]\n  computer-use: false\n  approvals: [publish, email-broadcast]\n  category: docs\n---\n\n## When to use\n\nUse for: Diff two policy versions in plain language.\nTrigger phrases: policy diff, what changed in the policy.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to drive (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. List material changes.\n2. Do not publish.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: publish, email-broadcast.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/portal-download-pack",
      skillId: "portal-download-pack",
      name: "portal-download-pack",
      description: "Download files from a portal the user is logged into. Use when the user asks about download from portal, vendor portal files.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "browser"
      ],
      computerUse: true,
      approvals: [
        "saas-write",
        "send-message"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Download files from a portal the user is logged into",
      category: "saas",
      featured: false,
      skillMd: "---\nname: portal-download-pack\ndescription: >\n  Download files from a portal the user is logged into. Use when the user asks about download from portal, vendor portal files.\nwhen-to-use: download from portal, vendor portal files\nmetadata:\n  author: grok-skills\n  short-description: Download files from a portal the user is logged into\n  runtime: grok-bot\n  connectors: [browser]\n  computer-use: true\n  approvals: [saas-write, send-message]\n  category: saas\n---\n\n## When to use\n\nUse for: Download files from a portal the user is logged into.\nTrigger phrases: download from portal, vendor portal files.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to browser (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Download listed files to the Bot computer.\n2. Do not share outside the account.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: saas-write, send-message.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is allowed for listed sites; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/pricing-page-watch",
      skillId: "pricing-page-watch",
      name: "pricing-page-watch",
      description: "Capture public pricing-page changes. Use when the user asks about pricing page, competitor pricing.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "browser"
      ],
      computerUse: true,
      approvals: [
        "external-post"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Capture public pricing-page changes",
      category: "research",
      featured: false,
      skillMd: "---\nname: pricing-page-watch\ndescription: >\n  Capture public pricing-page changes. Use when the user asks about pricing page, competitor pricing.\nwhen-to-use: pricing page, competitor pricing\nmetadata:\n  author: grok-skills\n  short-description: Capture public pricing-page changes\n  runtime: grok-bot\n  connectors: [browser]\n  computer-use: true\n  approvals: [external-post]\n  category: research\n---\n\n## When to use\n\nUse for: Capture public pricing-page changes.\nTrigger phrases: pricing page, competitor pricing.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to browser (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Snapshot public pages.\n2. Do not log in.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: external-post.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is allowed for listed sites; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/privacy-request-pack",
      skillId: "privacy-request-pack",
      name: "privacy-request-pack",
      description: "Pack a privacy-request (DSAR) for review. Use when the user asks about dsar, privacy request, gdpr request.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "drive"
      ],
      computerUse: false,
      approvals: [
        "legal-send",
        "sign-document"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Pack a privacy-request (DSAR) for review",
      category: "legal",
      featured: false,
      skillMd: "---\nname: privacy-request-pack\ndescription: >\n  Pack a privacy-request (DSAR) for review. Use when the user asks about dsar, privacy request, gdpr request.\nwhen-to-use: dsar, privacy request, gdpr request\nmetadata:\n  author: grok-skills\n  short-description: Pack a privacy-request (DSAR) for review\n  runtime: grok-bot\n  connectors: [drive]\n  computer-use: false\n  approvals: [legal-send, sign-document]\n  category: legal\n---\n\n## When to use\n\nUse for: Pack a privacy-request (DSAR) for review.\nTrigger phrases: dsar, privacy request, gdpr request.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to drive (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. List systems to search.\n2. Do not email personal data.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: legal-send, sign-document.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/qbr-brief",
      skillId: "qbr-brief",
      name: "qbr-brief",
      description: "Assemble a QBR brief from CRM and docs. Use when the user asks about qbr brief, quarterly business review.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "salesforce"
      ],
      computerUse: false,
      approvals: [
        "customer-contact",
        "send-email"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Assemble a QBR brief from CRM and docs",
      category: "crm",
      featured: false,
      skillMd: "---\nname: qbr-brief\ndescription: >\n  Assemble a QBR brief from CRM and docs. Use when the user asks about qbr brief, quarterly business review.\nwhen-to-use: qbr brief, quarterly business review\nmetadata:\n  author: grok-skills\n  short-description: Assemble a QBR brief from CRM and docs\n  runtime: grok-bot\n  connectors: [salesforce]\n  computer-use: false\n  approvals: [customer-contact, send-email]\n  category: crm\n---\n\n## When to use\n\nUse for: Assemble a QBR brief from CRM and docs.\nTrigger phrases: qbr brief, quarterly business review.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to salesforce (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Pull usage, tickets, pipeline.\n2. Draft the brief. Do not send to the customer.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: customer-contact, send-email.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/reading-queue",
      skillId: "reading-queue",
      name: "reading-queue",
      description: "Maintain a reading queue from links. Use when the user asks about reading list, read later.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "browser"
      ],
      computerUse: false,
      approvals: [
        "external-send"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Maintain a reading queue from links",
      category: "personal",
      featured: false,
      skillMd: "---\nname: reading-queue\ndescription: >\n  Maintain a reading queue from links. Use when the user asks about reading list, read later.\nwhen-to-use: reading list, read later\nmetadata:\n  author: grok-skills\n  short-description: Maintain a reading queue from links\n  runtime: grok-bot\n  connectors: [browser]\n  computer-use: false\n  approvals: [external-send]\n  category: personal\n---\n\n## When to use\n\nUse for: Maintain a reading queue from links.\nTrigger phrases: reading list, read later.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to browser (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Deduplicate and tag.\n2. Do not subscribe to paid content.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: external-send.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/receipt-match",
      skillId: "receipt-match",
      name: "receipt-match",
      description: "Match receipts to card transactions. Use when the user asks about match receipts, card txns.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "browser",
        "drive"
      ],
      computerUse: true,
      approvals: [
        "submit-expense",
        "purchase"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Match receipts to card transactions",
      category: "finance",
      featured: false,
      skillMd: "---\nname: receipt-match\ndescription: >\n  Match receipts to card transactions. Use when the user asks about match receipts, card txns.\nwhen-to-use: match receipts, card txns\nmetadata:\n  author: grok-skills\n  short-description: Match receipts to card transactions\n  runtime: grok-bot\n  connectors: [browser, drive]\n  computer-use: true\n  approvals: [submit-expense, purchase]\n  category: finance\n---\n\n## When to use\n\nUse for: Match receipts to card transactions.\nTrigger phrases: match receipts, card txns.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to browser (read unless a later step says otherwise)\n- Access to drive (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Pair by date/amount.\n2. Do not post journals.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: submit-expense, purchase.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is allowed for listed sites; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/records-hold-index",
      skillId: "records-hold-index",
      name: "records-hold-index",
      description: "Index files that might fall under a hold. Use when the user asks about legal hold, records hold.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "drive"
      ],
      computerUse: false,
      approvals: [
        "legal-send",
        "sign-document"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Index files that might fall under a hold",
      category: "legal",
      featured: false,
      skillMd: "---\nname: records-hold-index\ndescription: >\n  Index files that might fall under a hold. Use when the user asks about legal hold, records hold.\nwhen-to-use: legal hold, records hold\nmetadata:\n  author: grok-skills\n  short-description: Index files that might fall under a hold\n  runtime: grok-bot\n  connectors: [drive]\n  computer-use: false\n  approvals: [legal-send, sign-document]\n  category: legal\n---\n\n## When to use\n\nUse for: Index files that might fall under a hold.\nTrigger phrases: legal hold, records hold.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to drive (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. List matching files.\n2. Do not delete anything.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: legal-send, sign-document.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/recruiter-screen-pack",
      skillId: "recruiter-screen-pack",
      name: "recruiter-screen-pack",
      description: "Build a recruiter screen pack from a resume and JD. Use when the user asks about screen candidate, resume vs jd.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "browser"
      ],
      computerUse: false,
      approvals: [
        "offer-send",
        "hr-system-write"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Build a recruiter screen pack from a resume and JD",
      category: "people",
      featured: false,
      skillMd: "---\nname: recruiter-screen-pack\ndescription: >\n  Build a recruiter screen pack from a resume and JD. Use when the user asks about screen candidate, resume vs jd.\nwhen-to-use: screen candidate, resume vs jd\nmetadata:\n  author: grok-skills\n  short-description: Build a recruiter screen pack from a resume and JD\n  runtime: grok-bot\n  connectors: [browser]\n  computer-use: false\n  approvals: [offer-send, hr-system-write]\n  category: people\n---\n\n## When to use\n\nUse for: Build a recruiter screen pack from a resume and JD.\nTrigger phrases: screen candidate, resume vs jd.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to browser (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Score must-haves.\n2. Do not email the candidate.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: offer-send, hr-system-write.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/referral-triage",
      skillId: "referral-triage",
      name: "referral-triage",
      description: "Triage employee referrals against open roles. Use when the user asks about referral triage, employee referral.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "browser"
      ],
      computerUse: false,
      approvals: [
        "offer-send",
        "hr-system-write"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Triage employee referrals against open roles",
      category: "people",
      featured: false,
      skillMd: "---\nname: referral-triage\ndescription: >\n  Triage employee referrals against open roles. Use when the user asks about referral triage, employee referral.\nwhen-to-use: referral triage, employee referral\nmetadata:\n  author: grok-skills\n  short-description: Triage employee referrals against open roles\n  runtime: grok-bot\n  connectors: [browser]\n  computer-use: false\n  approvals: [offer-send, hr-system-write]\n  category: people\n---\n\n## When to use\n\nUse for: Triage employee referrals against open roles.\nTrigger phrases: referral triage, employee referral.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to browser (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Match to reqs.\n2. Do not email referrers with a decision.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: offer-send, hr-system-write.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/refund-draft",
      skillId: "refund-draft",
      name: "refund-draft",
      description: "Draft a refund recommendation against policy. Use when the user asks about refund request, credit request.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "browser"
      ],
      computerUse: true,
      approvals: [
        "customer-contact",
        "production-access"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Draft a refund recommendation against policy",
      category: "support",
      featured: false,
      skillMd: "---\nname: refund-draft\ndescription: >\n  Draft a refund recommendation against policy. Use when the user asks about refund request, credit request.\nwhen-to-use: refund request, credit request\nmetadata:\n  author: grok-skills\n  short-description: Draft a refund recommendation against policy\n  runtime: grok-bot\n  connectors: [browser]\n  computer-use: true\n  approvals: [customer-contact, production-access]\n  category: support\n---\n\n## When to use\n\nUse for: Draft a refund recommendation against policy.\nTrigger phrases: refund request, credit request.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to browser (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Check policy.\n2. Draft the recommendation. Do not issue refunds.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: customer-contact, production-access.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is allowed for listed sites; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/regulation-watch",
      skillId: "regulation-watch",
      name: "regulation-watch",
      description: "Summarize a public regulation or bill. Use when the user asks about regulation watch, new law summary.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "browser"
      ],
      computerUse: true,
      approvals: [
        "external-post"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Summarize a public regulation or bill",
      category: "research",
      featured: false,
      skillMd: "---\nname: regulation-watch\ndescription: >\n  Summarize a public regulation or bill. Use when the user asks about regulation watch, new law summary.\nwhen-to-use: regulation watch, new law summary\nmetadata:\n  author: grok-skills\n  short-description: Summarize a public regulation or bill\n  runtime: grok-bot\n  connectors: [browser]\n  computer-use: true\n  approvals: [external-post]\n  category: research\n---\n\n## When to use\n\nUse for: Summarize a public regulation or bill.\nTrigger phrases: regulation watch, new law summary.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to browser (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Cite the source text.\n2. Do not give legal advice.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: external-post.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is allowed for listed sites; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/release-notes-draft",
      skillId: "release-notes-draft",
      name: "release-notes-draft",
      description: "Draft release notes from merged PRs. Use when the user asks about release notes, changelog from prs.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "github"
      ],
      computerUse: false,
      approvals: [
        "merge-pr",
        "production-change"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Draft release notes from merged PRs",
      category: "eng",
      featured: false,
      skillMd: "---\nname: release-notes-draft\ndescription: >\n  Draft release notes from merged PRs. Use when the user asks about release notes, changelog from prs.\nwhen-to-use: release notes, changelog from prs\nmetadata:\n  author: grok-skills\n  short-description: Draft release notes from merged PRs\n  runtime: grok-bot\n  connectors: [github]\n  computer-use: false\n  approvals: [merge-pr, production-change]\n  category: eng\n---\n\n## When to use\n\nUse for: Draft release notes from merged PRs.\nTrigger phrases: release notes, changelog from prs.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to github (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Collect merged PRs since last tag.\n2. Do not publish a GitHub release.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: merge-pr, production-change.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/renewal-risk",
      skillId: "renewal-risk",
      name: "renewal-risk",
      description: "Flag renewals at risk in the next two quarters. Use when the user asks about renewal risk, upcoming renewals.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "salesforce"
      ],
      computerUse: false,
      approvals: [
        "customer-contact",
        "send-email"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Flag renewals at risk in the next two quarters",
      category: "crm",
      featured: false,
      skillMd: "---\nname: renewal-risk\ndescription: >\n  Flag renewals at risk in the next two quarters. Use when the user asks about renewal risk, upcoming renewals.\nwhen-to-use: renewal risk, upcoming renewals\nmetadata:\n  author: grok-skills\n  short-description: Flag renewals at risk in the next two quarters\n  runtime: grok-bot\n  connectors: [salesforce]\n  computer-use: false\n  approvals: [customer-contact, send-email]\n  category: crm\n---\n\n## When to use\n\nUse for: Flag renewals at risk in the next two quarters.\nTrigger phrases: renewal risk, upcoming renewals.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to salesforce (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Filter by close date.\n2. Cite usage or sentiment if available.\n3. Do not offer discounts.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: customer-contact, send-email.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/rfc-comment-pass",
      skillId: "rfc-comment-pass",
      name: "rfc-comment-pass",
      description: "Comment on an RFC with structured feedback. Use when the user asks about rfc review, design doc comments.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "github"
      ],
      computerUse: false,
      approvals: [
        "merge-pr",
        "production-change"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Comment on an RFC with structured feedback",
      category: "eng",
      featured: false,
      skillMd: "---\nname: rfc-comment-pass\ndescription: >\n  Comment on an RFC with structured feedback. Use when the user asks about rfc review, design doc comments.\nwhen-to-use: rfc review, design doc comments\nmetadata:\n  author: grok-skills\n  short-description: Comment on an RFC with structured feedback\n  runtime: grok-bot\n  connectors: [github]\n  computer-use: false\n  approvals: [merge-pr, production-change]\n  category: eng\n---\n\n## When to use\n\nUse for: Comment on an RFC with structured feedback.\nTrigger phrases: rfc review, design doc comments.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to github (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. List questions and risks.\n2. Do not merge the RFC.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: merge-pr, production-change.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/rfc-skeleton",
      skillId: "rfc-skeleton",
      name: "rfc-skeleton",
      description: "Skeleton an RFC from a problem statement. Use when the user asks about write rfc, design doc skeleton.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "drive"
      ],
      computerUse: false,
      approvals: [
        "publish",
        "email-broadcast"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Skeleton an RFC from a problem statement",
      category: "docs",
      featured: false,
      skillMd: "---\nname: rfc-skeleton\ndescription: >\n  Skeleton an RFC from a problem statement. Use when the user asks about write rfc, design doc skeleton.\nwhen-to-use: write rfc, design doc skeleton\nmetadata:\n  author: grok-skills\n  short-description: Skeleton an RFC from a problem statement\n  runtime: grok-bot\n  connectors: [drive]\n  computer-use: false\n  approvals: [publish, email-broadcast]\n  category: docs\n---\n\n## When to use\n\nUse for: Skeleton an RFC from a problem statement.\nTrigger phrases: write rfc, design doc skeleton.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to drive (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Fill required sections.\n2. Do not merge.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: publish, email-broadcast.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/runbook-follow",
      skillId: "runbook-follow",
      name: "runbook-follow",
      description: "Follow a runbook and record each step. Use when the user asks about follow runbook, execute runbook.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "github"
      ],
      computerUse: false,
      approvals: [
        "merge-pr",
        "production-change"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Follow a runbook and record each step",
      category: "eng",
      featured: false,
      skillMd: "---\nname: runbook-follow\ndescription: >\n  Follow a runbook and record each step. Use when the user asks about follow runbook, execute runbook.\nwhen-to-use: follow runbook, execute runbook\nmetadata:\n  author: grok-skills\n  short-description: Follow a runbook and record each step\n  runtime: grok-bot\n  connectors: [github]\n  computer-use: false\n  approvals: [merge-pr, production-change]\n  category: eng\n---\n\n## When to use\n\nUse for: Follow a runbook and record each step.\nTrigger phrases: follow runbook, execute runbook.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to github (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Execute read-only steps.\n2. Stop before destructive actions.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: merge-pr, production-change.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/saas-settings-audit",
      skillId: "saas-settings-audit",
      name: "saas-settings-audit",
      description: "Audit SaaS settings vs a checklist. Use when the user asks about saas settings, admin settings audit.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "browser"
      ],
      computerUse: true,
      approvals: [
        "saas-write",
        "send-message"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Audit SaaS settings vs a checklist",
      category: "saas",
      featured: false,
      skillMd: "---\nname: saas-settings-audit\ndescription: >\n  Audit SaaS settings vs a checklist. Use when the user asks about saas settings, admin settings audit.\nwhen-to-use: saas settings, admin settings audit\nmetadata:\n  author: grok-skills\n  short-description: Audit SaaS settings vs a checklist\n  runtime: grok-bot\n  connectors: [browser]\n  computer-use: true\n  approvals: [saas-write, send-message]\n  category: saas\n---\n\n## When to use\n\nUse for: Audit SaaS settings vs a checklist.\nTrigger phrases: saas settings, admin settings audit.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to browser (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Read settings.\n2. Do not change them until approved.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: saas-write, send-message.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is allowed for listed sites; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/schedule-hold",
      skillId: "schedule-hold",
      name: "schedule-hold",
      description: "Propose holds that do not send invites. Use when the user asks about hold on calendar, block time, schedule hold.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "google-calendar"
      ],
      computerUse: false,
      approvals: [
        "create-event",
        "send-invite"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Propose holds that do not send invites",
      category: "calendar",
      featured: false,
      skillMd: "---\nname: schedule-hold\ndescription: >\n  Propose holds that do not send invites. Use when the user asks about hold on calendar, block time, schedule hold.\nwhen-to-use: hold on calendar, block time, schedule hold\nmetadata:\n  author: grok-skills\n  short-description: Propose holds that do not send invites\n  runtime: grok-bot\n  connectors: [google-calendar]\n  computer-use: false\n  approvals: [create-event, send-invite]\n  category: calendar\n---\n\n## When to use\n\nUse for: Propose holds that do not send invites.\nTrigger phrases: hold on calendar, block time, schedule hold.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to google-calendar (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Find free slots.\n2. Propose holds. Do not create events until approved.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: create-event, send-invite.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/screenshot-walkthrough",
      skillId: "screenshot-walkthrough",
      name: "screenshot-walkthrough",
      description: "Capture a screenshot walkthrough of a flow. Use when the user asks about screenshot walkthrough, ui steps.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "browser"
      ],
      computerUse: true,
      approvals: [
        "saas-write",
        "send-message"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Capture a screenshot walkthrough of a flow",
      category: "saas",
      featured: false,
      skillMd: "---\nname: screenshot-walkthrough\ndescription: >\n  Capture a screenshot walkthrough of a flow. Use when the user asks about screenshot walkthrough, ui steps.\nwhen-to-use: screenshot walkthrough, ui steps\nmetadata:\n  author: grok-skills\n  short-description: Capture a screenshot walkthrough of a flow\n  runtime: grok-bot\n  connectors: [browser]\n  computer-use: true\n  approvals: [saas-write, send-message]\n  category: saas\n---\n\n## When to use\n\nUse for: Capture a screenshot walkthrough of a flow.\nTrigger phrases: screenshot walkthrough, ui steps.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to browser (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Capture steps.\n2. Do not change production data.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: saas-write, send-message.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is allowed for listed sites; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/security-advisory-triage",
      skillId: "security-advisory-triage",
      name: "security-advisory-triage",
      description: "Triage GitHub/security advisories. Use when the user asks about security advisory, cve triage.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "github"
      ],
      computerUse: false,
      approvals: [
        "merge-pr",
        "production-change"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Triage GitHub/security advisories",
      category: "eng",
      featured: false,
      skillMd: "---\nname: security-advisory-triage\ndescription: >\n  Triage GitHub/security advisories. Use when the user asks about security advisory, cve triage.\nwhen-to-use: security advisory, cve triage\nmetadata:\n  author: grok-skills\n  short-description: Triage GitHub/security advisories\n  runtime: grok-bot\n  connectors: [github]\n  computer-use: false\n  approvals: [merge-pr, production-change]\n  category: eng\n---\n\n## When to use\n\nUse for: Triage GitHub/security advisories.\nTrigger phrases: security advisory, cve triage.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to github (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Map to repos.\n2. Do not publish patches.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: merge-pr, production-change.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/seed-data-refresh",
      skillId: "seed-data-refresh",
      name: "seed-data-refresh",
      description: "Plan a staging seed-data refresh. Use when the user asks about seed data, staging fixtures.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "github"
      ],
      computerUse: false,
      approvals: [
        "merge-pr",
        "production-change"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Plan a staging seed-data refresh",
      category: "eng",
      featured: false,
      skillMd: "---\nname: seed-data-refresh\ndescription: >\n  Plan a staging seed-data refresh. Use when the user asks about seed data, staging fixtures.\nwhen-to-use: seed data, staging fixtures\nmetadata:\n  author: grok-skills\n  short-description: Plan a staging seed-data refresh\n  runtime: grok-bot\n  connectors: [github]\n  computer-use: false\n  approvals: [merge-pr, production-change]\n  category: eng\n---\n\n## When to use\n\nUse for: Plan a staging seed-data refresh.\nTrigger phrases: seed data, staging fixtures.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to github (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. List datasets.\n2. Do not overwrite staging until approved.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: merge-pr, production-change.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/sequence-pause-review",
      skillId: "sequence-pause-review",
      name: "sequence-pause-review",
      description: "Review who is in sequences and who should be paused. Use when the user asks about sequence pause, sales engagement review.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "salesforce"
      ],
      computerUse: false,
      approvals: [
        "customer-contact",
        "send-email"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Review who is in sequences and who should be paused",
      category: "crm",
      featured: false,
      skillMd: "---\nname: sequence-pause-review\ndescription: >\n  Review who is in sequences and who should be paused. Use when the user asks about sequence pause, sales engagement review.\nwhen-to-use: sequence pause, sales engagement review\nmetadata:\n  author: grok-skills\n  short-description: Review who is in sequences and who should be paused\n  runtime: grok-bot\n  connectors: [salesforce]\n  computer-use: false\n  approvals: [customer-contact, send-email]\n  category: crm\n---\n\n## When to use\n\nUse for: Review who is in sequences and who should be paused.\nTrigger phrases: sequence pause, sales engagement review.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to salesforce (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. List active enrollments.\n2. Propose pauses. Do not change sequences until approved.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: customer-contact, send-email.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/skip-level-prep",
      skillId: "skip-level-prep",
      name: "skip-level-prep",
      description: "Prep skip-level 1:1 notes. Use when the user asks about skip level, 1:1 prep.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "browser"
      ],
      computerUse: false,
      approvals: [
        "offer-send",
        "hr-system-write"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Prep skip-level 1:1 notes",
      category: "people",
      featured: false,
      skillMd: "---\nname: skip-level-prep\ndescription: >\n  Prep skip-level 1:1 notes. Use when the user asks about skip level, 1:1 prep.\nwhen-to-use: skip level, 1:1 prep\nmetadata:\n  author: grok-skills\n  short-description: Prep skip-level 1:1 notes\n  runtime: grok-bot\n  connectors: [browser]\n  computer-use: false\n  approvals: [offer-send, hr-system-write]\n  category: people\n---\n\n## When to use\n\nUse for: Prep skip-level 1:1 notes.\nTrigger phrases: skip level, 1:1 prep.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to browser (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Pull recent themes.\n2. Do not message the skip's reports.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: offer-send, hr-system-write.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/sla-breach-watch",
      skillId: "sla-breach-watch",
      name: "sla-breach-watch",
      description: "Watch tickets approaching SLA breach. Use when the user asks about sla breach, sla risk.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "browser"
      ],
      computerUse: true,
      approvals: [
        "customer-contact",
        "production-access"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Watch tickets approaching SLA breach",
      category: "support",
      featured: false,
      skillMd: "---\nname: sla-breach-watch\ndescription: >\n  Watch tickets approaching SLA breach. Use when the user asks about sla breach, sla risk.\nwhen-to-use: sla breach, sla risk\nmetadata:\n  author: grok-skills\n  short-description: Watch tickets approaching SLA breach\n  runtime: grok-bot\n  connectors: [browser]\n  computer-use: true\n  approvals: [customer-contact, production-access]\n  category: support\n---\n\n## When to use\n\nUse for: Watch tickets approaching SLA breach.\nTrigger phrases: sla breach, sla risk.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to browser (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. List at-risk tickets.\n2. Propose owners. Do not reassign until approved.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: customer-contact, production-access.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is allowed for listed sites; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/slack-channel-digest",
      skillId: "slack-channel-digest",
      name: "slack-channel-digest",
      description: "Digest a Slack channel for a time window. Use when the user asks about slack digest, channel recap.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "browser"
      ],
      computerUse: true,
      approvals: [
        "saas-write",
        "send-message"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Digest a Slack channel for a time window",
      category: "saas",
      featured: false,
      skillMd: "---\nname: slack-channel-digest\ndescription: >\n  Digest a Slack channel for a time window. Use when the user asks about slack digest, channel recap.\nwhen-to-use: slack digest, channel recap\nmetadata:\n  author: grok-skills\n  short-description: Digest a Slack channel for a time window\n  runtime: grok-bot\n  connectors: [browser]\n  computer-use: true\n  approvals: [saas-write, send-message]\n  category: saas\n---\n\n## When to use\n\nUse for: Digest a Slack channel for a time window.\nTrigger phrases: slack digest, channel recap.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to browser (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Summarize themes.\n2. Do not post back until approved.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: saas-write, send-message.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is allowed for listed sites; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/social-mention-digest",
      skillId: "social-mention-digest",
      name: "social-mention-digest",
      description: "Digest public social mentions. Use when the user asks about social mentions, brand mentions.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "browser"
      ],
      computerUse: true,
      approvals: [
        "external-post"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Digest public social mentions",
      category: "research",
      featured: false,
      skillMd: "---\nname: social-mention-digest\ndescription: >\n  Digest public social mentions. Use when the user asks about social mentions, brand mentions.\nwhen-to-use: social mentions, brand mentions\nmetadata:\n  author: grok-skills\n  short-description: Digest public social mentions\n  runtime: grok-bot\n  connectors: [browser]\n  computer-use: true\n  approvals: [external-post]\n  category: research\n---\n\n## When to use\n\nUse for: Digest public social mentions.\nTrigger phrases: social mentions, brand mentions.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to browser (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Public posts only.\n2. Do not reply.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: external-post.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is allowed for listed sites; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/sop-draft",
      skillId: "sop-draft",
      name: "sop-draft",
      description: "Draft an SOP from a demonstrated process. Use when the user asks about sop, standard operating procedure.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "drive"
      ],
      computerUse: false,
      approvals: [
        "publish",
        "email-broadcast"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Draft an SOP from a demonstrated process",
      category: "docs",
      featured: false,
      skillMd: "---\nname: sop-draft\ndescription: >\n  Draft an SOP from a demonstrated process. Use when the user asks about sop, standard operating procedure.\nwhen-to-use: sop, standard operating procedure\nmetadata:\n  author: grok-skills\n  short-description: Draft an SOP from a demonstrated process\n  runtime: grok-bot\n  connectors: [drive]\n  computer-use: false\n  approvals: [publish, email-broadcast]\n  category: docs\n---\n\n## When to use\n\nUse for: Draft an SOP from a demonstrated process.\nTrigger phrases: sop, standard operating procedure.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to drive (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Write steps and failure modes.\n2. Do not make it official until approved.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: publish, email-broadcast.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/sql-question-pack",
      skillId: "sql-question-pack",
      name: "sql-question-pack",
      description: "Turn a business question into SQL plus caveats. Use when the user asks about write sql, warehouse question.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "browser"
      ],
      computerUse: false,
      approvals: [
        "warehouse-write"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Turn a business question into SQL plus caveats",
      category: "data",
      featured: false,
      skillMd: "---\nname: sql-question-pack\ndescription: >\n  Turn a business question into SQL plus caveats. Use when the user asks about write sql, warehouse question.\nwhen-to-use: write sql, warehouse question\nmetadata:\n  author: grok-skills\n  short-description: Turn a business question into SQL plus caveats\n  runtime: grok-bot\n  connectors: [browser]\n  computer-use: false\n  approvals: [warehouse-write]\n  category: data\n---\n\n## When to use\n\nUse for: Turn a business question into SQL plus caveats.\nTrigger phrases: write sql, warehouse question.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to browser (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Draft SQL.\n2. Do not run unbounded queries if a dry-run exists.\n3. Do not INSERT/UPDATE/DELETE.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: warehouse-write.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/staging-smoke",
      skillId: "staging-smoke",
      name: "staging-smoke",
      description: "Run a staging smoke checklist. Use when the user asks about staging smoke, sanity check staging.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "github"
      ],
      computerUse: false,
      approvals: [
        "merge-pr",
        "production-change"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Run a staging smoke checklist",
      category: "eng",
      featured: false,
      skillMd: "---\nname: staging-smoke\ndescription: >\n  Run a staging smoke checklist. Use when the user asks about staging smoke, sanity check staging.\nwhen-to-use: staging smoke, sanity check staging\nmetadata:\n  author: grok-skills\n  short-description: Run a staging smoke checklist\n  runtime: grok-bot\n  connectors: [github]\n  computer-use: false\n  approvals: [merge-pr, production-change]\n  category: eng\n---\n\n## When to use\n\nUse for: Run a staging smoke checklist.\nTrigger phrases: staging smoke, sanity check staging.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to github (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Hit listed checks.\n2. Do not test in production.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: merge-pr, production-change.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/status-page-check",
      skillId: "status-page-check",
      name: "status-page-check",
      description: "Check status pages for an incident window. Use when the user asks about status page, vendor outage.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "browser"
      ],
      computerUse: true,
      approvals: [
        "customer-contact",
        "production-access"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Check status pages for an incident window",
      category: "support",
      featured: false,
      skillMd: "---\nname: status-page-check\ndescription: >\n  Check status pages for an incident window. Use when the user asks about status page, vendor outage.\nwhen-to-use: status page, vendor outage\nmetadata:\n  author: grok-skills\n  short-description: Check status pages for an incident window\n  runtime: grok-bot\n  connectors: [browser]\n  computer-use: true\n  approvals: [customer-contact, production-access]\n  category: support\n---\n\n## When to use\n\nUse for: Check status pages for an incident window.\nTrigger phrases: status page, vendor outage.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to browser (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Open named status pages.\n2. Return current component status.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: customer-contact, production-access.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is allowed for listed sites; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/tax-doc-index",
      skillId: "tax-doc-index",
      name: "tax-doc-index",
      description: "Index tax documents in a folder. Use when the user asks about tax docs, w9 index.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "browser",
        "drive"
      ],
      computerUse: true,
      approvals: [
        "submit-expense",
        "purchase"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Index tax documents in a folder",
      category: "finance",
      featured: false,
      skillMd: "---\nname: tax-doc-index\ndescription: >\n  Index tax documents in a folder. Use when the user asks about tax docs, w9 index.\nwhen-to-use: tax docs, w9 index\nmetadata:\n  author: grok-skills\n  short-description: Index tax documents in a folder\n  runtime: grok-bot\n  connectors: [browser, drive]\n  computer-use: true\n  approvals: [submit-expense, purchase]\n  category: finance\n---\n\n## When to use\n\nUse for: Index tax documents in a folder.\nTrigger phrases: tax docs, w9 index.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to browser (read unless a later step says otherwise)\n- Access to drive (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. List files and types.\n2. Do not file with an authority.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: submit-expense, purchase.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is allowed for listed sites; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/territory-digest",
      skillId: "territory-digest",
      name: "territory-digest",
      description: "Digest a territory's pipeline and activity. Use when the user asks about territory digest, regional pipeline.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "salesforce"
      ],
      computerUse: false,
      approvals: [
        "customer-contact",
        "send-email"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Digest a territory's pipeline and activity",
      category: "crm",
      featured: false,
      skillMd: "---\nname: territory-digest\ndescription: >\n  Digest a territory's pipeline and activity. Use when the user asks about territory digest, regional pipeline.\nwhen-to-use: territory digest, regional pipeline\nmetadata:\n  author: grok-skills\n  short-description: Digest a territory's pipeline and activity\n  runtime: grok-bot\n  connectors: [salesforce]\n  computer-use: false\n  approvals: [customer-contact, send-email]\n  category: crm\n---\n\n## When to use\n\nUse for: Digest a territory's pipeline and activity.\nTrigger phrases: territory digest, regional pipeline.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to salesforce (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Aggregate by owner/region.\n2. Return the digest.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: customer-contact, send-email.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/thread-summary",
      skillId: "thread-summary",
      name: "thread-summary",
      description: "Summarize a long email thread. Use when the user asks about summarize thread, recap this email chain.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "gmail"
      ],
      computerUse: false,
      approvals: [
        "send-email",
        "archive"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Summarize a long email thread",
      category: "inbox",
      featured: false,
      skillMd: "---\nname: thread-summary\ndescription: >\n  Summarize a long email thread. Use when the user asks about summarize thread, recap this email chain.\nwhen-to-use: summarize thread, recap this email chain\nmetadata:\n  author: grok-skills\n  short-description: Summarize a long email thread\n  runtime: grok-bot\n  connectors: [gmail]\n  computer-use: false\n  approvals: [send-email, archive]\n  category: inbox\n---\n\n## When to use\n\nUse for: Summarize a long email thread.\nTrigger phrases: summarize thread, recap this email chain.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to gmail (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Read the thread.\n2. Return decisions, asks, and open questions.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: send-email, archive.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/ticket-triage",
      skillId: "ticket-triage",
      name: "ticket-triage",
      description: "Triage support tickets by severity and type. Use when the user asks about ticket triage, support queue, zendesk triage.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "browser"
      ],
      computerUse: true,
      approvals: [
        "customer-contact",
        "production-access"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Triage support tickets by severity and type",
      category: "support",
      featured: false,
      skillMd: "---\nname: ticket-triage\ndescription: >\n  Triage support tickets by severity and type. Use when the user asks about ticket triage, support queue, zendesk triage.\nwhen-to-use: ticket triage, support queue, zendesk triage\nmetadata:\n  author: grok-skills\n  short-description: Triage support tickets by severity and type\n  runtime: grok-bot\n  connectors: [browser]\n  computer-use: true\n  approvals: [customer-contact, production-access]\n  category: support\n---\n\n## When to use\n\nUse for: Triage support tickets by severity and type.\nTrigger phrases: ticket triage, support queue, zendesk triage.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to browser (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Label severity and product area.\n2. Draft replies. Do not send.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: customer-contact, production-access.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is allowed for listed sites; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/tos-diff",
      skillId: "tos-diff",
      name: "tos-diff",
      description: "Diff two Terms of Service versions. Use when the user asks about tos diff, terms changed.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "drive"
      ],
      computerUse: false,
      approvals: [
        "legal-send",
        "sign-document"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Diff two Terms of Service versions",
      category: "legal",
      featured: false,
      skillMd: "---\nname: tos-diff\ndescription: >\n  Diff two Terms of Service versions. Use when the user asks about tos diff, terms changed.\nwhen-to-use: tos diff, terms changed\nmetadata:\n  author: grok-skills\n  short-description: Diff two Terms of Service versions\n  runtime: grok-bot\n  connectors: [drive]\n  computer-use: false\n  approvals: [legal-send, sign-document]\n  category: legal\n---\n\n## When to use\n\nUse for: Diff two Terms of Service versions.\nTrigger phrases: tos diff, terms changed.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to drive (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Plain-language changes.\n2. Do not publish.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: legal-send, sign-document.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/trademark-watch",
      skillId: "trademark-watch",
      name: "trademark-watch",
      description: "Watch public trademark collisions for a mark. Use when the user asks about trademark watch, brand collision.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "drive"
      ],
      computerUse: false,
      approvals: [
        "legal-send",
        "sign-document"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Watch public trademark collisions for a mark",
      category: "legal",
      featured: false,
      skillMd: "---\nname: trademark-watch\ndescription: >\n  Watch public trademark collisions for a mark. Use when the user asks about trademark watch, brand collision.\nwhen-to-use: trademark watch, brand collision\nmetadata:\n  author: grok-skills\n  short-description: Watch public trademark collisions for a mark\n  runtime: grok-bot\n  connectors: [drive]\n  computer-use: false\n  approvals: [legal-send, sign-document]\n  category: legal\n---\n\n## When to use\n\nUse for: Watch public trademark collisions for a mark.\nTrigger phrases: trademark watch, brand collision.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to drive (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Public databases only.\n2. Do not file.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: legal-send, sign-document.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/travel-booking-draft",
      skillId: "travel-booking-draft",
      name: "travel-booking-draft",
      description: "Draft a travel itinerary without booking. Use when the user asks about book travel draft, flight options.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "browser"
      ],
      computerUse: true,
      approvals: [
        "vendor-change",
        "purchase"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Draft a travel itinerary without booking",
      category: "ops",
      featured: false,
      skillMd: "---\nname: travel-booking-draft\ndescription: >\n  Draft a travel itinerary without booking. Use when the user asks about book travel draft, flight options.\nwhen-to-use: book travel draft, flight options\nmetadata:\n  author: grok-skills\n  short-description: Draft a travel itinerary without booking\n  runtime: grok-bot\n  connectors: [browser]\n  computer-use: true\n  approvals: [vendor-change, purchase]\n  category: ops\n---\n\n## When to use\n\nUse for: Draft a travel itinerary without booking.\nTrigger phrases: book travel draft, flight options.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to browser (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Propose options in policy.\n2. Do not purchase.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: vendor-change, purchase.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is allowed for listed sites; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/travel-day-plan",
      skillId: "travel-day-plan",
      name: "travel-day-plan",
      description: "Build a travel-day calendar plan. Use when the user asks about travel day, airport calendar, trip day plan.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "google-calendar"
      ],
      computerUse: false,
      approvals: [
        "create-event",
        "send-invite"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Build a travel-day calendar plan",
      category: "calendar",
      featured: false,
      skillMd: "---\nname: travel-day-plan\ndescription: >\n  Build a travel-day calendar plan. Use when the user asks about travel day, airport calendar, trip day plan.\nwhen-to-use: travel day, airport calendar, trip day plan\nmetadata:\n  author: grok-skills\n  short-description: Build a travel-day calendar plan\n  runtime: grok-bot\n  connectors: [google-calendar]\n  computer-use: false\n  approvals: [create-event, send-invite]\n  category: calendar\n---\n\n## When to use\n\nUse for: Build a travel-day calendar plan.\nTrigger phrases: travel day, airport calendar, trip day plan.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to google-calendar (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Stack flights, buffers, and meetings.\n2. Propose events. Do not book travel.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: create-event, send-invite.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/travel-itinerary-pack",
      skillId: "travel-itinerary-pack",
      name: "travel-itinerary-pack",
      description: "Pack a travel itinerary from emails and files. Use when the user asks about itinerary, trip pack.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "browser"
      ],
      computerUse: false,
      approvals: [
        "external-send"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Pack a travel itinerary from emails and files",
      category: "personal",
      featured: false,
      skillMd: "---\nname: travel-itinerary-pack\ndescription: >\n  Pack a travel itinerary from emails and files. Use when the user asks about itinerary, trip pack.\nwhen-to-use: itinerary, trip pack\nmetadata:\n  author: grok-skills\n  short-description: Pack a travel itinerary from emails and files\n  runtime: grok-bot\n  connectors: [browser]\n  computer-use: false\n  approvals: [external-send]\n  category: personal\n---\n\n## When to use\n\nUse for: Pack a travel itinerary from emails and files.\nTrigger phrases: itinerary, trip pack.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to browser (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Extract confirmations.\n2. Do not change bookings.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: external-send.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/unread-digest",
      skillId: "unread-digest",
      name: "unread-digest",
      description: "Build a ranked unread email digest. Use when the user asks about unread digest, email summary, what did I miss.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "gmail"
      ],
      computerUse: false,
      approvals: [
        "send-email",
        "archive"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Build a ranked unread email digest",
      category: "inbox",
      featured: false,
      skillMd: "---\nname: unread-digest\ndescription: >\n  Build a ranked unread email digest. Use when the user asks about unread digest, email summary, what did I miss.\nwhen-to-use: unread digest, email summary, what did I miss\nmetadata:\n  author: grok-skills\n  short-description: Build a ranked unread email digest\n  runtime: grok-bot\n  connectors: [gmail]\n  computer-use: false\n  approvals: [send-email, archive]\n  category: inbox\n---\n\n## When to use\n\nUse for: Build a ranked unread email digest.\nTrigger phrases: unread digest, email summary, what did I miss.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to gmail (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Pull unread mail.\n2. Rank by VIP and urgency.\n3. Return a digest with thread ids.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: send-email, archive.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/unsubscribe-noise",
      skillId: "unsubscribe-noise",
      name: "unsubscribe-noise",
      description: "Propose newsletters to unsubscribe. Use when the user asks about unsubscribe, newsletter cleanup, email noise.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "gmail"
      ],
      computerUse: false,
      approvals: [
        "send-email",
        "archive"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Propose newsletters to unsubscribe",
      category: "inbox",
      featured: false,
      skillMd: "---\nname: unsubscribe-noise\ndescription: >\n  Propose newsletters to unsubscribe. Use when the user asks about unsubscribe, newsletter cleanup, email noise.\nwhen-to-use: unsubscribe, newsletter cleanup, email noise\nmetadata:\n  author: grok-skills\n  short-description: Propose newsletters to unsubscribe\n  runtime: grok-bot\n  connectors: [gmail]\n  computer-use: false\n  approvals: [send-email, archive]\n  category: inbox\n---\n\n## When to use\n\nUse for: Propose newsletters to unsubscribe.\nTrigger phrases: unsubscribe, newsletter cleanup, email noise.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to gmail (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Cluster bulk senders.\n2. Propose unsubscribes. Do not click unsubscribe until approved.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: send-email, archive.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/vendor-renewal",
      skillId: "vendor-renewal",
      name: "vendor-renewal",
      description: "Flag vendor renewals in the next 90 days. Use when the user asks about vendor renewal, saas renewal.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "browser",
        "drive"
      ],
      computerUse: true,
      approvals: [
        "submit-expense",
        "purchase"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Flag vendor renewals in the next 90 days",
      category: "finance",
      featured: false,
      skillMd: "---\nname: vendor-renewal\ndescription: >\n  Flag vendor renewals in the next 90 days. Use when the user asks about vendor renewal, saas renewal.\nwhen-to-use: vendor renewal, saas renewal\nmetadata:\n  author: grok-skills\n  short-description: Flag vendor renewals in the next 90 days\n  runtime: grok-bot\n  connectors: [browser, drive]\n  computer-use: true\n  approvals: [submit-expense, purchase]\n  category: finance\n---\n\n## When to use\n\nUse for: Flag vendor renewals in the next 90 days.\nTrigger phrases: vendor renewal, saas renewal.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to browser (read unless a later step says otherwise)\n- Access to drive (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. List vendors and dates.\n2. Do not auto-renew.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: submit-expense, purchase.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is allowed for listed sites; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/vendor-rfp-compare",
      skillId: "vendor-rfp-compare",
      name: "vendor-rfp-compare",
      description: "Compare vendor RFP responses. Use when the user asks about rfp compare, vendor comparison.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "browser"
      ],
      computerUse: true,
      approvals: [
        "external-post"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Compare vendor RFP responses",
      category: "research",
      featured: false,
      skillMd: "---\nname: vendor-rfp-compare\ndescription: >\n  Compare vendor RFP responses. Use when the user asks about rfp compare, vendor comparison.\nwhen-to-use: rfp compare, vendor comparison\nmetadata:\n  author: grok-skills\n  short-description: Compare vendor RFP responses\n  runtime: grok-bot\n  connectors: [browser]\n  computer-use: true\n  approvals: [external-post]\n  category: research\n---\n\n## When to use\n\nUse for: Compare vendor RFP responses.\nTrigger phrases: rfp compare, vendor comparison.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to browser (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Score against criteria.\n2. Do not award the RFP.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: external-post.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is allowed for listed sites; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/vendor-sla-watch",
      skillId: "vendor-sla-watch",
      name: "vendor-sla-watch",
      description: "Watch vendor SLAs from tickets or emails. Use when the user asks about vendor sla, supplier sla.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "browser"
      ],
      computerUse: true,
      approvals: [
        "vendor-change",
        "purchase"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Watch vendor SLAs from tickets or emails",
      category: "ops",
      featured: false,
      skillMd: "---\nname: vendor-sla-watch\ndescription: >\n  Watch vendor SLAs from tickets or emails. Use when the user asks about vendor sla, supplier sla.\nwhen-to-use: vendor sla, supplier sla\nmetadata:\n  author: grok-skills\n  short-description: Watch vendor SLAs from tickets or emails\n  runtime: grok-bot\n  connectors: [browser]\n  computer-use: true\n  approvals: [vendor-change, purchase]\n  category: ops\n---\n\n## When to use\n\nUse for: Watch vendor SLAs from tickets or emails.\nTrigger phrases: vendor sla, supplier sla.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to browser (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Compute misses.\n2. Do not terminate vendors.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: vendor-change, purchase.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is allowed for listed sites; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/vip-followup",
      skillId: "vip-followup",
      name: "vip-followup",
      description: "List unanswered VIP threads. Use when the user asks about vip followup, waiting on me, unanswered important mail.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "gmail"
      ],
      computerUse: false,
      approvals: [
        "send-email",
        "archive"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "List unanswered VIP threads",
      category: "inbox",
      featured: false,
      skillMd: "---\nname: vip-followup\ndescription: >\n  List unanswered VIP threads. Use when the user asks about vip followup, waiting on me, unanswered important mail.\nwhen-to-use: vip followup, waiting on me, unanswered important mail\nmetadata:\n  author: grok-skills\n  short-description: List unanswered VIP threads\n  runtime: grok-bot\n  connectors: [gmail]\n  computer-use: false\n  approvals: [send-email, archive]\n  category: inbox\n---\n\n## When to use\n\nUse for: List unanswered VIP threads.\nTrigger phrases: vip followup, waiting on me, unanswered important mail.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to gmail (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Load VIP list or infer from frequency.\n2. Find unanswered threads.\n3. Draft nudges. Do not send.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: send-email, archive.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/warehouse-row-count",
      skillId: "warehouse-row-count",
      name: "warehouse-row-count",
      description: "Compare row counts across tables or days. Use when the user asks about row count, table volume.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "browser"
      ],
      computerUse: false,
      approvals: [
        "warehouse-write"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Compare row counts across tables or days",
      category: "data",
      featured: false,
      skillMd: "---\nname: warehouse-row-count\ndescription: >\n  Compare row counts across tables or days. Use when the user asks about row count, table volume.\nwhen-to-use: row count, table volume\nmetadata:\n  author: grok-skills\n  short-description: Compare row counts across tables or days\n  runtime: grok-bot\n  connectors: [browser]\n  computer-use: false\n  approvals: [warehouse-write]\n  category: data\n---\n\n## When to use\n\nUse for: Compare row counts across tables or days.\nTrigger phrases: row count, table volume.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to browser (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Query counts.\n2. Do not modify tables.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: warehouse-write.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/web-competitor-scan",
      skillId: "web-competitor-scan",
      name: "web-competitor-scan",
      description: "Scan named competitors' public sites. Use when the user asks about competitor scan, competitive landscape.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "browser"
      ],
      computerUse: true,
      approvals: [
        "external-post"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Scan named competitors' public sites",
      category: "research",
      featured: false,
      skillMd: "---\nname: web-competitor-scan\ndescription: >\n  Scan named competitors' public sites. Use when the user asks about competitor scan, competitive landscape.\nwhen-to-use: competitor scan, competitive landscape\nmetadata:\n  author: grok-skills\n  short-description: Scan named competitors' public sites\n  runtime: grok-bot\n  connectors: [browser]\n  computer-use: true\n  approvals: [external-post]\n  category: research\n---\n\n## When to use\n\nUse for: Scan named competitors' public sites.\nTrigger phrases: competitor scan, competitive landscape.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to browser (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Collect public pages.\n2. Do not log into competitor tools.\n3. Do not post.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: external-post.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is allowed for listed sites; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/weekly-time-audit",
      skillId: "weekly-time-audit",
      name: "weekly-time-audit",
      description: "Audit where time went last week. Use when the user asks about time audit, calendar audit, meeting load.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "google-calendar"
      ],
      computerUse: false,
      approvals: [
        "create-event",
        "send-invite"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Audit where time went last week",
      category: "calendar",
      featured: false,
      skillMd: "---\nname: weekly-time-audit\ndescription: >\n  Audit where time went last week. Use when the user asks about time audit, calendar audit, meeting load.\nwhen-to-use: time audit, calendar audit, meeting load\nmetadata:\n  author: grok-skills\n  short-description: Audit where time went last week\n  runtime: grok-bot\n  connectors: [google-calendar]\n  computer-use: false\n  approvals: [create-event, send-invite]\n  category: calendar\n---\n\n## When to use\n\nUse for: Audit where time went last week.\nTrigger phrases: time audit, calendar audit, meeting load.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to google-calendar (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Categorize events.\n2. Return hours by category.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: create-event, send-invite.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/weekly-update",
      skillId: "weekly-update",
      name: "weekly-update",
      description: "Draft a weekly update. Use when the user asks about weekly update, status email.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "drive"
      ],
      computerUse: false,
      approvals: [
        "publish",
        "email-broadcast"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Draft a weekly update",
      category: "docs",
      featured: false,
      skillMd: "---\nname: weekly-update\ndescription: >\n  Draft a weekly update. Use when the user asks about weekly update, status email.\nwhen-to-use: weekly update, status email\nmetadata:\n  author: grok-skills\n  short-description: Draft a weekly update\n  runtime: grok-bot\n  connectors: [drive]\n  computer-use: false\n  approvals: [publish, email-broadcast]\n  category: docs\n---\n\n## When to use\n\nUse for: Draft a weekly update.\nTrigger phrases: weekly update, status email.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to drive (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Draft. Do not send.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: publish, email-broadcast.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/win-loss-notes",
      skillId: "win-loss-notes",
      name: "win-loss-notes",
      description: "Structure a win/loss interview into notes. Use when the user asks about win loss, why we lost, closed lost notes.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "salesforce"
      ],
      computerUse: false,
      approvals: [
        "customer-contact",
        "send-email"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Structure a win/loss interview into notes",
      category: "crm",
      featured: false,
      skillMd: "---\nname: win-loss-notes\ndescription: >\n  Structure a win/loss interview into notes. Use when the user asks about win loss, why we lost, closed lost notes.\nwhen-to-use: win loss, why we lost, closed lost notes\nmetadata:\n  author: grok-skills\n  short-description: Structure a win/loss interview into notes\n  runtime: grok-bot\n  connectors: [salesforce]\n  computer-use: false\n  approvals: [customer-contact, send-email]\n  category: crm\n---\n\n## When to use\n\nUse for: Structure a win/loss interview into notes.\nTrigger phrases: win loss, why we lost, closed lost notes.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to salesforce (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Capture reasons and competitors.\n2. Do not email the customer.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: customer-contact, send-email.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/write-a-skill",
      skillId: "write-a-skill",
      name: "write-a-skill",
      description: "Draft a new Grok Bot SKILL.md that passes grok-skills check. Use when the user asks about create a skill, write SKILL.md, save this as a skill, author a skill.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [],
      computerUse: false,
      approvals: [
        "install-skill"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Draft a new Grok Bot SKILL.md that passes grok-skills check",
      category: "meta",
      featured: false,
      skillMd: "---\nname: write-a-skill\ndescription: >\n  Draft a new Grok Bot SKILL.md that passes grok-skills check. Use when the user asks about create a skill, write SKILL.md, save this as a skill, author a skill.\nwhen-to-use: create a skill, write SKILL.md, save this as a skill, author a skill\nmetadata:\n  author: grok-skills\n  short-description: Draft a new Grok Bot SKILL.md that passes grok-skills check\n  runtime: grok-bot\n  connectors: []\n  computer-use: false\n  approvals: [install-skill]\n  category: meta\n---\n\n## When to use\n\nUse for: Draft a new Grok Bot SKILL.md that passes grok-skills check.\nTrigger phrases: create a skill, write SKILL.md, save this as a skill, author a skill.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- The user's current conversation, files, and any URLs they provide\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Capture when-to-use, inputs, sequence, validation, return value, and approvals.\n2. Write SKILL.md and run grok-skills check.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: install-skill.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    },
    {
      id: "samanyugoyal2010/grok-skills/year-in-review-notes",
      skillId: "year-in-review-notes",
      name: "year-in-review-notes",
      description: "Draft year-in-review notes from provided artifacts. Use when the user asks about year in review, annual recap.",
      owner: "samanyugoyal2010",
      repo: "grok-skills",
      source: "samanyugoyal2010/grok-skills",
      runtime: "grok-bot",
      connectors: [
        "browser"
      ],
      computerUse: false,
      approvals: [
        "external-send"
      ],
      installs: 0,
      installs24h: 0,
      author: "grok-skills",
      shortDescription: "Draft year-in-review notes from provided artifacts",
      category: "personal",
      featured: false,
      skillMd: "---\nname: year-in-review-notes\ndescription: >\n  Draft year-in-review notes from provided artifacts. Use when the user asks about year in review, annual recap.\nwhen-to-use: year in review, annual recap\nmetadata:\n  author: grok-skills\n  short-description: Draft year-in-review notes from provided artifacts\n  runtime: grok-bot\n  connectors: [browser]\n  computer-use: false\n  approvals: [external-send]\n  category: personal\n---\n\n## When to use\n\nUse for: Draft year-in-review notes from provided artifacts.\nTrigger phrases: year in review, annual recap.\nDo not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.\n\n## Required inputs and access\n\n- Access to browser (read unless a later step says otherwise)\n- Named time window or object (ticket, account, thread, file). If missing, ask once.\n\n## Sequence of work\n\n1. Use provided sources only.\n2. Do not post publicly.\n\n## How to validate the result\n\nEvery item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.\n\n## What to return\n\nA reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.\n\n## Approvals and safety\n\nThese always require explicit approval: external-send.\nPrefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.\nNever embed secrets. Computer-use is not required; stay on the user's account and listed tools.\n"
    }
  ]
};

// packages/core/src/search.ts
var cached;
function loadBundledCatalog() {
  if (cached) {
    return cached;
  }
  const file = join2(import.meta.dirname, "bundled-catalog.json");
  if (existsSync2(file)) {
    cached = JSON.parse(readFileSync(file, "utf8"));
    return cached;
  }
  cached = bundled_catalog_default;
  return cached;
}
function findCatalogSkill(name) {
  return loadBundledCatalog().skills.find((skill) => skill.name === name);
}
function catalogSkillMarkdown(skill) {
  if (skill.skillMd?.trim()) {
    return skill.skillMd;
  }
  const fromDisk = readBundledSkillFile(skill.name);
  if (fromDisk) {
    return fromDisk;
  }
  return reconstructSkillMarkdown(skill);
}
function printSkillMarkdown(name) {
  const skill = findCatalogSkill(name);
  if (!skill) {
    throw new Error(`Unknown catalog skill: ${name}`);
  }
  return catalogSkillMarkdown(skill);
}
function readBundledSkillFile(name) {
  const here = import.meta.dirname;
  const candidates = [
    join2(process.cwd(), "skills", name, "SKILL.md"),
    join2(here, "../../../skills", name, "SKILL.md"),
    join2(here, "../skills", name, "SKILL.md"),
    join2(here, "skills", name, "SKILL.md")
  ];
  for (const path of candidates) {
    if (existsSync2(path)) {
      return readFileSync(path, "utf8");
    }
  }
  return void 0;
}
function reconstructSkillMarkdown(skill) {
  const short = skill.shortDescription || skill.description.split(".")[0] || skill.name;
  const approvals = skill.approvals?.length ? skill.approvals : ["user-approval"];
  const connectors = skill.connectors ?? [];
  const runtime = skill.runtime || "grok-bot";
  const description = skill.description.replace(/\s+/g, " ").trim();
  return `---
name: ${skill.name}
description: ${description}
when-to-use: ${short}
metadata:
  runtime: ${runtime}
  connectors: [${connectors.join(", ")}]
  computer-use: ${skill.computerUse ? "true" : "false"}
  approvals: [${approvals.join(", ")}]
---

## When to use

${description}

## Required inputs and access

- Inputs named in the user request
- Access to: ${connectors.length ? connectors.join(", ") : "local files and conversation"}

## Sequence of work

1. Gather the required inputs.
2. Perform the ${short} workflow.
3. Stop at a reviewable draft.

## How to validate the result

Cite sources. Do not execute approval-gated actions.

## What to return

A reviewable pack: findings, drafts, and actions that still need approval.

## Approvals and safety

These always require explicit approval: ${approvals.join(", ")}.
Never embed secrets.
`;
}
function searchCatalog(skills, query, opts = {}) {
  const limit = opts.limit ?? 10;
  const q = query.trim().toLowerCase();
  if (!q) {
    return [...skills].sort((a, b) => b.installs - a.installs).slice(0, limit);
  }
  const terms = q.split(/\s+/).filter(Boolean);
  const scored = skills.map((skill) => {
    const hay = [
      skill.name,
      skill.name.replaceAll("-", " "),
      skill.description,
      skill.shortDescription ?? "",
      skill.source,
      ...skill.connectors ?? [],
      ...skill.category ? [skill.category] : []
    ].join(" ").toLowerCase();
    let score = 0;
    if (skill.name === q || skill.name.replaceAll("-", " ") === q) score += 100;
    if (skill.name.includes(q.replaceAll(" ", "-"))) score += 40;
    for (const term of terms) {
      if (skill.name.includes(term)) score += 12;
      if (hay.includes(term)) score += 4;
    }
    return { skill, score };
  }).filter((row) => row.score > 0).sort((a, b) => b.score - a.score || b.skill.installs - a.skill.installs);
  return scored.slice(0, limit).map((row) => row.skill);
}

// packages/core/src/resolve.ts
var OWNER_REPO_RE = /^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/;
var OWNER_REPO_AT_RE = /^([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)@(.+)$/;
var GITHUB_TREE_RE = /^https?:\/\/github\.com\/([^/]+)\/([^/]+)\/tree\/([^/]+)(?:\/(.*))?$/;
var GITHUB_REPO_RE = /^https?:\/\/github\.com\/([^/]+)\/([^/]+?)(?:\.git)?\/?$/;
function githubGitUrl(owner, repo) {
  const cleanRepo = repo.replace(/\.git$/, "");
  return `https://github.com/${owner}/${cleanRepo}.git`;
}
function catalogNames() {
  return new Set(loadBundledCatalog().skills.map((skill) => skill.name));
}
function resolveSource(source, cwd = process.cwd()) {
  const trimmed = source.trim();
  const treeMatch = trimmed.match(GITHUB_TREE_RE);
  if (treeMatch) {
    const [, owner, repoRaw, ref, subpath] = treeMatch;
    const repo = repoRaw.replace(/\.git$/, "");
    return {
      kind: "git",
      display: `${owner}/${repo}`,
      owner,
      repo,
      gitUrl: githubGitUrl(owner, repo),
      ref,
      subpath: subpath?.replace(/\/$/, "") || void 0
    };
  }
  const atMatch = trimmed.match(OWNER_REPO_AT_RE);
  if (atMatch) {
    const [, owner, repoRaw, rest] = atMatch;
    const repo = repoRaw.replace(/\.git$/, "");
    let ref = rest;
    let subpath;
    const parts = rest.split("/").filter(Boolean);
    if (parts.length >= 2 && parts[0] !== "cursor") {
      ref = parts[0];
      subpath = parts.slice(1).join("/");
    }
    return {
      kind: "git",
      display: subpath ? `${owner}/${repo}@${ref}/${subpath}` : `${owner}/${repo}@${ref}`,
      owner,
      repo,
      gitUrl: githubGitUrl(owner, repo),
      ref,
      subpath
    };
  }
  if (OWNER_REPO_RE.test(trimmed) && !trimmed.includes("://")) {
    const [owner, repo] = trimmed.split("/");
    return {
      kind: "git",
      display: trimmed,
      owner,
      repo,
      gitUrl: githubGitUrl(owner, repo)
    };
  }
  const ghMatch = trimmed.match(GITHUB_REPO_RE);
  if (ghMatch) {
    const [, owner, repoRaw] = ghMatch;
    const repo = repoRaw.replace(/\.git$/, "");
    return {
      kind: "git",
      display: `${owner}/${repo}`,
      owner,
      repo,
      gitUrl: githubGitUrl(owner, repo)
    };
  }
  if (/^https?:\/\//.test(trimmed)) {
    return {
      kind: "git",
      display: trimmed,
      gitUrl: trimmed.endsWith(".git") ? trimmed : trimmed
    };
  }
  const localPath = resolve(cwd, trimmed);
  if (existsSync3(localPath)) {
    return {
      kind: "local",
      display: trimmed,
      localPath
    };
  }
  if (!trimmed.includes("/") && !trimmed.includes("@") && catalogNames().has(trimmed)) {
    return {
      kind: "catalog",
      display: trimmed,
      catalogName: trimmed
    };
  }
  return {
    kind: "local",
    display: trimmed,
    localPath
  };
}

// packages/core/src/fetch.ts
import { writeFile } from "node:fs/promises";
import { existsSync as existsSync4 } from "node:fs";
import { mkdir, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join as join3, resolve as resolve2 } from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
var execFileAsync = promisify(execFile);
function looksLikeBranch(ref) {
  return !/^[0-9a-f]{40}$/i.test(ref);
}
async function gitRevParse(cwd) {
  const { stdout } = await execFileAsync("git", ["rev-parse", "HEAD"], { cwd });
  return stdout.trim();
}
async function gitClone(gitUrl, destDir, ref) {
  await mkdir(destDir, { recursive: true });
  if (ref && looksLikeBranch(ref)) {
    await execFileAsync("git", ["clone", "--depth", "1", "--branch", ref, gitUrl, destDir]);
    return;
  }
  await execFileAsync("git", ["clone", "--depth", "1", gitUrl, destDir]);
  if (ref) {
    await execFileAsync("git", ["checkout", ref], { cwd: destDir });
  }
}
async function fetchGithubTarball(owner, repo, destDir, ref) {
  const tarballRef = ref ?? "HEAD";
  const url = `https://codeload.github.com/${owner}/${repo}/tar.gz/${tarballRef}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Tarball fetch failed: ${response.status} ${response.statusText}`);
  }
  const tarPath = join3(destDir, "repo.tar.gz");
  await mkdir(destDir, { recursive: true });
  const buffer = Buffer.from(await response.arrayBuffer());
  await writeFile(tarPath, buffer);
  await execFileAsync("tar", ["-xzf", tarPath, "-C", destDir, "--strip-components=1"]);
  await rm(tarPath, { force: true });
}
async function fetchSource(source, destDir, cwd = process.cwd()) {
  const resolved = resolveSource(source, cwd);
  if (resolved.kind === "local" && resolved.localPath) {
    let root = resolved.localPath;
    if (resolved.subpath) {
      root = join3(resolved.localPath, resolved.subpath);
    }
    if (!existsSync4(root)) {
      throw new Error(`Local path not found: ${root}`);
    }
    return { root: resolve2(root), resolved };
  }
  if (resolved.kind === "git" && resolved.gitUrl) {
    let sha;
    try {
      await gitClone(resolved.gitUrl, destDir, resolved.ref);
      sha = await gitRevParse(destDir);
    } catch (gitError) {
      if (resolved.owner && resolved.repo) {
        await rm(destDir, { recursive: true, force: true });
        await mkdir(destDir, { recursive: true });
        await fetchGithubTarball(resolved.owner, resolved.repo, destDir, resolved.ref);
      } else {
        throw gitError;
      }
    }
    let root = destDir;
    if (resolved.subpath) {
      root = join3(destDir, resolved.subpath);
      if (!existsSync4(root)) {
        throw new Error(`Subpath not found in fetched source: ${resolved.subpath}`);
      }
    }
    return { root: resolve2(root), sha, resolved };
  }
  throw new Error(`Unable to fetch source: ${source}`);
}
async function createFetchTempDir(prefix = "grok-skills-") {
  return mkdtemp(join3(tmpdir(), prefix));
}

// packages/core/src/paths.ts
import { existsSync as existsSync5 } from "node:fs";
import { homedir } from "node:os";
import { dirname, join as join4, resolve as resolve3 } from "node:path";
function findGitRoot(start) {
  let dir = resolve3(start);
  for (; ; ) {
    if (existsSync5(join4(dir, ".git"))) {
      return dir;
    }
    const parent = dirname(dir);
    if (parent === dir) {
      return null;
    }
    dir = parent;
  }
}
function grokSkillsDir(opts = {}) {
  const cwd = opts.cwd ?? process.cwd();
  if (opts.global) {
    return join4(homedir(), ".grok", "skills");
  }
  const gitRoot = findGitRoot(cwd);
  const base = gitRoot ?? cwd;
  return join4(base, ".grok", "skills");
}
function lockfilePath(opts = {}) {
  const cwd = opts.cwd ?? process.cwd();
  if (opts.global) {
    return join4(homedir(), ".grok", "skills-lock.json");
  }
  const gitRoot = findGitRoot(cwd);
  const base = gitRoot ?? cwd;
  return join4(base, ".grok", "skills-lock.json");
}

// packages/core/src/install.ts
import { existsSync as existsSync7 } from "node:fs";
import { mkdir as mkdir3, readFile as readFile3, readdir as readdir2, rm as rm3, writeFile as writeFile3 } from "node:fs/promises";
import { join as join5 } from "node:path";

// packages/core/src/lockfile.ts
import { existsSync as existsSync6 } from "node:fs";
import { cp, mkdir as mkdir2, readFile as readFile2, rm as rm2, writeFile as writeFile2 } from "node:fs/promises";
import { dirname as dirname2 } from "node:path";
async function readLockfile(path) {
  if (!existsSync6(path)) {
    return { skills: {} };
  }
  const raw = await readFile2(path, "utf8");
  const parsed = JSON.parse(raw);
  if (!parsed.skills || typeof parsed.skills !== "object") {
    return { skills: {} };
  }
  return parsed;
}
async function writeLockfile(path, lock) {
  await mkdir2(dirname2(path), { recursive: true });
  await writeFile2(path, `${JSON.stringify(lock, null, 2)}
`, "utf8");
}
async function copySkillDirectory(srcDir, destDir) {
  await rm2(destDir, { recursive: true, force: true });
  await cp(srcDir, destDir, { recursive: true, force: true });
}

// packages/core/src/telemetry.ts
function telemetryEnabled() {
  if (!process.env.GROK_SKILLS_REGISTRY?.trim()) {
    return false;
  }
  return process.env.DISABLE_TELEMETRY !== "1" && process.env.DO_NOT_TRACK !== "1";
}
async function reportInstall(event, endpoint) {
  if (!endpoint) {
    return;
  }
  try {
    await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event)
    });
  } catch {
  }
}
function defaultTelemetryEndpoint() {
  const raw = process.env.GROK_SKILLS_REGISTRY?.trim();
  if (!raw) {
    return null;
  }
  const origin = raw.replace(/\/+$/, "");
  if (/\/api\/t$/i.test(origin)) {
    return origin;
  }
  return `${origin}/api/t`;
}
function buildTelemetryEvent(skillName, sourceDisplay, owner, repo, sha, runtime) {
  const skillId = owner && repo ? `${owner}/${repo}/${skillName}` : `${sourceDisplay}/${skillName}`;
  return {
    skillId,
    source: sourceDisplay,
    sha,
    runtimeHint: runtime
  };
}

// packages/core/src/install.ts
function requireYesForPack(kind) {
  return kind === "git" || kind === "local";
}
function skillCheckError(skill, force) {
  const result = checkSkill(skill);
  const errors = result.issues.filter((issue) => issue.level === "error");
  if (errors.length === 0 || force) {
    return void 0;
  }
  const detail = errors.map((issue) => `${issue.code}: ${issue.message}`).join("; ");
  return `Skill check failed for ${skill.name}: ${detail}`;
}
async function maybeTelemetry(opts, skill, sourceLabel, resolved, sha) {
  if (!(telemetryEnabled() && opts.telemetry !== false)) {
    return;
  }
  const endpoint = opts.telemetryEndpoint ?? defaultTelemetryEndpoint();
  if (!endpoint) {
    return;
  }
  await reportInstall(
    buildTelemetryEvent(skill.name, sourceLabel, resolved.owner, resolved.repo, sha, skill.runtime),
    endpoint
  );
}
async function installCatalogSkill(resolved, opts, cwd) {
  const name = resolved.catalogName ?? resolved.display;
  const skill = findCatalogSkill(name);
  if (!skill) {
    throw new Error(`Unknown catalog skill: ${name}`);
  }
  const md = catalogSkillMarkdown(skill);
  const destBase = grokSkillsDir({ cwd, global: opts.global });
  const target = join5(destBase, skill.name);
  const parsed = parseSkillMarkdown(md, join5(target, "SKILL.md"));
  const listed = [{ ...parsed, sourceRoot: "catalog" }];
  if (opts.skills?.length && !opts.skills.includes(skill.name)) {
    throw new Error(`No matching skills found for: ${opts.skills.join(", ")}`);
  }
  if (opts.listOnly) {
    return { installed: [], listed, source: resolved };
  }
  const checkErr = skillCheckError(parsed, opts.force);
  if (checkErr) {
    throw new Error(checkErr);
  }
  await mkdir3(target, { recursive: true });
  await writeFile3(join5(target, "SKILL.md"), md, "utf8");
  const lockPath = lockfilePath({ cwd, global: opts.global });
  const lock = await readLockfile(lockPath);
  const installedAt = (/* @__PURE__ */ new Date()).toISOString();
  const sourceLabel = `catalog:${skill.name}`;
  lock.skills[skill.name] = { source: sourceLabel, installedAt };
  await writeLockfile(lockPath, lock);
  await maybeTelemetry(opts, parsed, sourceLabel, resolved);
  return {
    installed: [{ name: skill.name, target }],
    listed,
    source: resolved
  };
}
async function installFromSource(opts) {
  const cwd = opts.cwd ?? process.cwd();
  const resolved = resolveSource(opts.source, cwd);
  if (resolved.kind === "catalog") {
    return installCatalogSkill(resolved, opts, cwd);
  }
  const isLocal = resolved.kind === "local" && resolved.localPath && existsSync7(resolved.localPath);
  let tempDir;
  let fetchRoot;
  let sha;
  if (isLocal) {
    const fetched = await fetchSource(opts.source, resolved.localPath, cwd);
    fetchRoot = fetched.root;
    sha = fetched.sha;
  } else {
    tempDir = await createFetchTempDir();
    const fetched = await fetchSource(opts.source, tempDir, cwd);
    fetchRoot = fetched.root;
    sha = fetched.sha;
  }
  try {
    let listed = await discoverSkills(fetchRoot);
    if (opts.skills?.length) {
      const wanted = new Set(opts.skills);
      listed = listed.filter((skill) => wanted.has(skill.name));
      if (listed.length === 0) {
        throw new Error(`No matching skills found for: ${opts.skills.join(", ")}`);
      }
    }
    if (listed.length === 0) {
      throw new Error(`No SKILL.md found in ${resolved.display}`);
    }
    if (opts.listOnly) {
      return { installed: [], listed, source: resolved, sha };
    }
    if (listed.length > 1 && !opts.skills?.length && !opts.all) {
      const names = listed.map((skill) => skill.name).join(", ");
      throw new Error(
        `Refusing to install ${listed.length} skills. Pass --skill <name> or --all.
${names}`
      );
    }
    if (requireYesForPack(resolved.kind) && listed.length >= 1 && !opts.yes && !process.stdin.isTTY) {
      throw new Error("Non-interactive install of a git/local pack requires --yes.");
    }
    const destBase = grokSkillsDir({ cwd, global: opts.global });
    await mkdir3(destBase, { recursive: true });
    const installed = [];
    const lockPath = lockfilePath({ cwd, global: opts.global });
    const lock = await readLockfile(lockPath);
    const installedAt = (/* @__PURE__ */ new Date()).toISOString();
    const sourceLabel = resolved.display;
    for (const skill of listed) {
      const skillMdPath = join5(skill.dir, "SKILL.md");
      const content = existsSync7(skillMdPath) ? await readFile3(skillMdPath, "utf8") : skill.body;
      const parsed = parseSkillMarkdown(content, skillMdPath);
      const checkErr = skillCheckError(parsed, opts.force);
      if (checkErr) {
        throw new Error(checkErr);
      }
      const target = join5(destBase, skill.name);
      await copySkillDirectory(skill.dir, target);
      lock.skills[skill.name] = { source: sourceLabel, sha, installedAt };
      installed.push({ name: skill.name, target });
      await maybeTelemetry(opts, skill, sourceLabel, resolved, sha);
    }
    await writeLockfile(lockPath, lock);
    return { installed, listed, source: resolved, sha };
  } finally {
    if (tempDir) {
      await rm3(tempDir, { recursive: true, force: true });
    }
  }
}
async function listInstalled(opts = {}) {
  const cwd = opts.cwd ?? process.cwd();
  const skillsDir = grokSkillsDir({ cwd, global: opts.global });
  if (!existsSync7(skillsDir)) {
    return [];
  }
  const lock = await readLockfile(lockfilePath({ cwd, global: opts.global }));
  const entries = await readdir2(skillsDir, { withFileTypes: true });
  const result = [];
  for (const entry2 of entries) {
    if (!entry2.isDirectory()) {
      continue;
    }
    const skillMd = join5(skillsDir, entry2.name, "SKILL.md");
    if (!existsSync7(skillMd)) {
      continue;
    }
    result.push({
      name: entry2.name,
      path: join5(skillsDir, entry2.name),
      source: lock.skills[entry2.name]?.source
    });
  }
  return result.sort((a, b) => a.name.localeCompare(b.name));
}
async function removeInstalled(name, opts = {}) {
  const cwd = opts.cwd ?? process.cwd();
  const skillsDir = grokSkillsDir({ cwd, global: opts.global });
  const target = join5(skillsDir, name);
  if (!existsSync7(target)) {
    return false;
  }
  await rm3(target, { recursive: true, force: true });
  const lockPath = lockfilePath({ cwd, global: opts.global });
  const lock = await readLockfile(lockPath);
  if (lock.skills[name]) {
    delete lock.skills[name];
    await writeLockfile(lockPath, lock);
  }
  return true;
}

// packages/core/src/scaffold.ts
import { mkdirSync, writeFileSync } from "node:fs";
import { join as join6 } from "node:path";
function titleCaseHeading(heading) {
  return heading.split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}
function scaffoldSkill(dir, name, opts = {}) {
  const runtime = opts.runtime ?? "grok-bot";
  const description = `Use when the user asks for help with ${name.replace(/-/g, " ")}.`;
  const headings = REQUIRED_BOT_HEADINGS.map((heading) => {
    const title = titleCaseHeading(heading);
    let body = "Describe this section for your skill.";
    if (heading === "approvals and safety") {
      body = "List actions that require user approval before execution.";
    }
    return `## ${title}

${body}`;
  }).join("\n\n");
  const content = `---
name: ${name}
description: ${description}
when-to-use: ${name.replace(/-/g, " ")}
metadata:
  runtime: ${runtime}
  connectors: []
  computer-use: false
  approvals: [user-approval]
---

${headings}
`;
  mkdirSync(dir, { recursive: true });
  writeFileSync(join6(dir, "SKILL.md"), content, "utf8");
}

// packages/core/src/plugin.ts
import { mkdir as mkdir4, writeFile as writeFile4 } from "node:fs/promises";
import { homedir as homedir2 } from "node:os";
import { join as join7 } from "node:path";
async function writeGrokPlugin(opts = {}) {
  const home = opts.home ?? homedir2();
  const pluginRoot = join7(home, ".grok", "plugins", "grok-skills");
  const skillDir = join7(pluginRoot, "skills", "find-skills");
  await mkdir4(skillDir, { recursive: true });
  const pluginJson = {
    name: "grok-skills",
    version: "0.1.0",
    description: "Catalog finder for Grok",
    skills: "./skills"
  };
  await writeFile4(join7(pluginRoot, "plugin.json"), `${JSON.stringify(pluginJson, null, 2)}
`, "utf8");
  await writeFile4(join7(skillDir, "SKILL.md"), printSkillMarkdown("find-skills"), "utf8");
  return pluginRoot;
}

// packages/cli/src/parse.ts
function nextValue(args, i) {
  return i + 1 < args.length && !args[i + 1].startsWith("-") ? args[i + 1] : void 0;
}
function parseGlobal(args, i) {
  const arg = args[i];
  return arg === "-g" || arg === "--global";
}
function parseArgv(argv) {
  if (argv.length === 0) {
    return { command: "help" };
  }
  const [cmd, ...rest] = argv;
  if (cmd === "help" || cmd === "--help" || cmd === "-h") {
    return { command: "help" };
  }
  switch (cmd) {
    case "add": {
      let source = "";
      let global = false;
      const skills = [];
      let list = false;
      let yes = false;
      let all = false;
      let force = false;
      for (let i = 0; i < rest.length; i++) {
        const arg = rest[i];
        if (arg === "-g" || arg === "--global") {
          global = true;
        } else if (arg === "-l" || arg === "--list") {
          list = true;
        } else if (arg === "-y" || arg === "--yes") {
          yes = true;
        } else if (arg === "--all") {
          all = true;
        } else if (arg === "--force") {
          force = true;
        } else if (arg === "-s" || arg === "--skill") {
          const value = nextValue(rest, i);
          if (!value) {
            throw new Error("Missing value for --skill");
          }
          skills.push(value);
          i++;
        } else if (!arg.startsWith("-")) {
          source = arg;
        } else {
          throw new Error(`Unknown flag: ${arg}`);
        }
      }
      if (!source) {
        throw new Error("add requires a <source> argument");
      }
      return { command: "add", source, global, skills, list, yes, all, force };
    }
    case "list": {
      let global = false;
      for (const arg of rest) {
        if (arg === "-g" || arg === "--global") {
          global = true;
        } else if (!arg.startsWith("-")) {
          throw new Error(`Unexpected argument: ${arg}`);
        } else {
          throw new Error(`Unknown flag: ${arg}`);
        }
      }
      return { command: "list", global };
    }
    case "remove": {
      let name = "";
      let global = false;
      for (let i = 0; i < rest.length; i++) {
        const arg = rest[i];
        if (parseGlobal(rest, i)) {
          global = true;
        } else if (!arg.startsWith("-")) {
          name = arg;
        } else {
          throw new Error(`Unknown flag: ${arg}`);
        }
      }
      if (!name) {
        throw new Error("remove requires a <name> argument");
      }
      return { command: "remove", name, global };
    }
    case "find": {
      let json = false;
      let limit = 10;
      const positional = [];
      for (let i = 0; i < rest.length; i++) {
        const arg = rest[i];
        if (arg === "--json") {
          json = true;
        } else if (arg === "--limit") {
          const value = nextValue(rest, i);
          if (!value) {
            throw new Error("Missing value for --limit");
          }
          limit = Number(value);
          if (!Number.isFinite(limit) || limit < 1) {
            throw new Error("--limit must be a positive number");
          }
          i++;
        } else if (arg.startsWith("-")) {
          throw new Error(`Unknown flag: ${arg}`);
        } else {
          positional.push(arg);
        }
      }
      return { command: "find", query: positional.join(" "), json, limit };
    }
    case "init": {
      let name = "";
      let global = false;
      for (const arg of rest) {
        if (arg === "--global" || arg === "-g") {
          global = true;
        } else if (!arg.startsWith("-")) {
          name = arg;
        } else {
          throw new Error(`Unknown flag: ${arg}`);
        }
      }
      if (!name) {
        throw new Error("init requires a <name> argument");
      }
      return { command: "init", name, global };
    }
    case "check": {
      const positional = rest.filter((arg) => !arg.startsWith("-"));
      for (const arg of rest) {
        if (arg.startsWith("-")) {
          throw new Error(`Unknown flag: ${arg}`);
        }
      }
      return { command: "check", path: positional[0] };
    }
    case "setup": {
      let global = false;
      for (const arg of rest) {
        if (arg === "-g" || arg === "--global") {
          global = true;
        } else if (!arg.startsWith("-")) {
          throw new Error(`Unexpected argument: ${arg}`);
        } else {
          throw new Error(`Unknown flag: ${arg}`);
        }
      }
      return { command: "setup", global };
    }
    case "print": {
      const name = rest.find((arg) => !arg.startsWith("-")) ?? "";
      if (!name) {
        throw new Error("print requires a <name> argument");
      }
      return { command: "print", name };
    }
    default:
      return { command: "help" };
  }
}

// packages/cli/src/cli.ts
var HELP = `grok-skills \u2014 install and manage Grok Bot skills

Not published on the npm registry. Run from GitHub or this repo:

  npx github:samanyugoyal2010/grok-skills -- find-skills
  npx github:samanyugoyal2010/grok-skills add inbox-triage -g
  node bin/grok-skills.mjs add find-skills -g

Usage:
  grok-skills add <source> [-g|--global] [-s|--skill <name>]... [--all] [-l|--list] [-y|--yes]
  grok-skills setup [-g]
  grok-skills print <name>
  grok-skills list [-g|--global]
  grok-skills remove <name> [-g|--global]
  grok-skills find [query] [--json] [--limit n]
  grok-skills init <name> [--global]
  grok-skills check [path]
  grok-skills help

<source> may be a catalog skill name, owner/repo, owner/repo@ref, or a local path.

Examples:
  grok-skills add inbox-triage
  grok-skills add owner/repo@branch -s my-skill -y
  grok-skills find inbox --json
  grok-skills print find-skills
  grok-skills setup
`;
function fail(message) {
  console.error(message);
  process.exit(1);
}
function printHelp() {
  process.stdout.write(HELP);
}
function printBotNextSteps(name) {
  console.log("Grok Build: loaded from .grok/skills (restart session if needed)");
  console.log(
    `Grok Bot: if / does not show it, paste SKILL.md (grok-skills print ${name}) into a saved skill / Settings \u2192 Plugins`
  );
}
async function resolveSkillPath(path) {
  const target = path ?? process.cwd();
  const info = await stat(target);
  if (info.isFile()) {
    if (basename(target) !== "SKILL.md") {
      fail(`Expected SKILL.md, got ${basename(target)}`);
    }
    return target;
  }
  if (info.isDirectory()) {
    return join8(target, "SKILL.md");
  }
  fail(`Not a file or directory: ${target}`);
}
async function runAdd(parsed) {
  const result = await installFromSource({
    source: parsed.source,
    global: parsed.global,
    skills: parsed.skills.length > 0 ? parsed.skills : void 0,
    listOnly: parsed.list,
    yes: parsed.yes,
    all: parsed.all,
    force: parsed.force
  });
  if (result.listed.length > 0) {
    console.log("Discovered skills:");
    for (const entry2 of result.listed) {
      console.log(`  ${entry2.name}`);
    }
  }
  if (parsed.list) {
    return;
  }
  if (result.installed.length > 0) {
    console.log("Installed:");
    for (const item of result.installed) {
      console.log(`  ${item.name} \u2192 ${item.target}`);
    }
    printBotNextSteps(result.installed[0].name);
  }
}
async function runList(parsed) {
  const items = await listInstalled({ global: parsed.global });
  if (items.length === 0) {
    console.log("No skills installed.");
    return;
  }
  for (const item of items) {
    const parts = [item.name, item.path];
    if (item.source) {
      parts.push(item.source);
    }
    console.log(parts.join("	"));
  }
}
async function runRemove(parsed) {
  const removed = await removeInstalled(parsed.name, { global: parsed.global });
  if (!removed) {
    fail(`Skill not found: ${parsed.name}`);
  }
  console.log(`Removed ${parsed.name}`);
}
async function runFind(parsed) {
  const query = parsed.query.trim();
  if (!query && (parsed.json || !process.stdin.isTTY)) {
    if (parsed.json) {
      console.log(JSON.stringify({ error: "query required" }));
    } else {
      console.error("query required");
    }
    process.exit(1);
  }
  const bundled = loadBundledCatalog();
  let skills = bundled.skills;
  const registry = process.env.GROK_SKILLS_REGISTRY?.replace(/\/$/, "");
  if (registry) {
    try {
      const url = `${registry}/api/search?q=${encodeURIComponent(query)}&limit=${parsed.limit}`;
      const response = await fetch(url);
      if (response.ok) {
        const payload = await response.json();
        if (Array.isArray(payload.skills) && payload.skills.length > 0) {
          skills = payload.skills;
        }
      }
    } catch {
    }
  }
  const results = searchCatalog(skills, query, { limit: parsed.limit });
  if (parsed.json) {
    console.log(
      JSON.stringify(
        {
          query,
          count: results.length,
          install: `npx github:samanyugoyal2010/grok-skills add <name> -g`,
          skills: results.map((skill) => ({
            name: skill.name,
            source: skill.source,
            description: skill.shortDescription || skill.description,
            runtime: skill.runtime,
            connectors: skill.connectors,
            approvals: skill.approvals,
            installs: skill.installs,
            add: `npx github:samanyugoyal2010/grok-skills add ${skill.name} -g`
          }))
        },
        null,
        2
      )
    );
    return;
  }
  if (results.length === 0) {
    console.log("No results.");
    return;
  }
  console.log("Install with: npx github:samanyugoyal2010/grok-skills add <name> -g");
  console.log("");
  for (const skill of results) {
    console.log(`${skill.name}	${skill.source}	${skill.installs}`);
    console.log(`  ${skill.shortDescription || skill.description}`);
    console.log(`  npx github:samanyugoyal2010/grok-skills add ${skill.name} -g`);
    console.log("");
  }
}
function runInit(parsed) {
  const dir = join8(grokSkillsDir({ global: parsed.global }), parsed.name);
  scaffoldSkill(dir, parsed.name);
  console.log(dir);
}
async function runCheck(parsed) {
  const skillPath = await resolveSkillPath(parsed.path);
  let content;
  try {
    content = await readFile4(skillPath, "utf8");
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    fail(`Cannot read ${skillPath}: ${message}`);
  }
  const skill = parseSkillMarkdown(content, skillPath);
  const result = checkSkill(skill);
  if (result.issues.length === 0) {
    console.log("OK");
    return;
  }
  for (const issue of result.issues) {
    console.log(`${issue.level} [${issue.code}] ${issue.message}`);
  }
  if (!result.ok) {
    process.exit(1);
  }
}
async function runSetup() {
  const result = await installFromSource({
    source: "find-skills",
    global: true,
    yes: true
  });
  const pluginRoot = await writeGrokPlugin();
  console.log("Installed find-skills globally.");
  if (result.installed[0]) {
    console.log(`  ${result.installed[0].name} \u2192 ${result.installed[0].target}`);
  }
  console.log(`Plugin: ${pluginRoot}`);
  console.log("Grok Build: loaded from .grok/skills (restart session if needed)");
  console.log(
    "Grok Bot: if / does not show it, paste SKILL.md (grok-skills print find-skills) into a saved skill / Settings \u2192 Plugins"
  );
}
function runPrint(parsed) {
  const md = printSkillMarkdown(parsed.name);
  process.stdout.write(md.endsWith("\n") ? md : `${md}
`);
}
async function main(argv = process.argv.slice(2)) {
  let parsed;
  try {
    parsed = parseArgv(argv);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    fail(message);
  }
  switch (parsed.command) {
    case "help":
      printHelp();
      return;
    case "add":
      await runAdd(parsed);
      return;
    case "list":
      await runList(parsed);
      return;
    case "remove":
      await runRemove(parsed);
      return;
    case "find":
      await runFind(parsed);
      return;
    case "init":
      runInit(parsed);
      return;
    case "check":
      await runCheck(parsed);
      return;
    case "setup":
      await runSetup();
      return;
    case "print":
      runPrint(parsed);
      return;
    default:
      printHelp();
  }
}
var entry = process.argv[1];
if (entry && import.meta.url === pathToFileURL(entry).href) {
  main().catch((err) => {
    const message = err instanceof Error ? err.message : String(err);
    console.error(message);
    process.exit(1);
  });
}
export {
  main
};
