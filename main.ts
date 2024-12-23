// For HTTP Execution
import { parseArgs } from "jsr:@std/cli/parse-args";
import { DOMParser } from "jsr:@b-fuze/deno-dom";
import { minify } from "npm:html-minifier";

const parsedArgs = parseArgs(Deno.args);

const htmlPath = parsedArgs._[0];

try {
  const html = await Deno.readTextFile(htmlPath.toString());

  const vDOM = new DOMParser().parseFromString(html, "text/html");

  const htmlRoot = vDOM.querySelector("[root]");
  const styleRoot = vDOM.querySelector("style");

  const scriptRoot = vDOM.querySelector("script");

  if (scriptRoot) {
    console.error("✘ Invalid html file");
    console.error("✘ Script element not allowed");
    Deno.exit(1);
  }

  if (htmlRoot) {
    const template = minify(
      `
      <svg fill="none" viewBox="0 0 1500 800" width="1500" height="800" xmlns="http://www.w3.org/2000/svg">
        <foreignObject width="100%" height="100%">
          <div xmlns="http://www.w3.org/1999/xhtml">
            ${htmlRoot.innerHTML}
            ${
        styleRoot ? `<style type="text/css">${styleRoot.innerHTML}</style>` : ""
      }
          </div>
        </foreignObject>
      </svg> /* Generated by https://github.com/EdamAme-x/github-readme-buildex */`,
      {
        caseSensitive: true,
        collapseBooleanAttributes: true,
        collapseInlineTagWhitespace: true,
        collapseWhitespace: true,
        conservativeCollapse: true,
        continueOnParseError: true,
        decodeEntities: true,
        html5: true,
        includeAutoGeneratedTags: true,
        minifyCSS: true,
        minifyURLs: true,
        preserveLineBreaks: false,
        preventAttributesEscaping: true,
        quoteCharacter: true,
        removeAttributeQuotes: true,
        removeComments: true,
        removeEmptyAttributes: true,
        removeEmptyElements: true,
        removeOptionalTags: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        removeTagWhitespace: true,
        sortAttributes: true,
        sortClassName: true,
        trimCustomFragments: true,
        useShortDoctype: true,
      },
    );

    console.log(template);
  } else {
    console.error("✘ Invalid html file");
    console.error("✘ Required element <~ root> not found");
    Deno.exit(1);
  }
} catch (_) {
  console.log(_);
  console.error("✘ Invalid html file path");
  Deno.exit(1);
}
