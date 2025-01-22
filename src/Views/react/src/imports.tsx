// @ts-nocheck
export { Scanner as ReactQrScanner } from "@yudiel/react-qr-scanner";
export { default as clsx } from "clsx";
export { default as React } from "react";
export { default as ReactDOMClient } from "react-dom";
export { default as ReactDOM } from "react-dom/client";
export { default as ReactDOMServer } from "react-dom/server";
export { default as ReactPlayer } from "react-player";
export { default as ReactPlayerYoutube } from "react-player/youtube";
export { default as Sweetalert2 } from "sweetalert2";
import React from "react";
import * as RPDF from "react-pdf";
import sanitizeHTML from "sanitize-html";

// @ts-ignore
export const pathname = window.pathname;
// @ts-ignore
export const URI_PREFIX = window.URI_PREFIX;

export function htmlToString(jsx: JSX.Element) {
  return ReactDOMServer.renderToString(jsx)
}

export function parseMarkup(inputString: string) {
  if (!inputString) return "";
  // Replace custom markup tags with corresponding HTML tags
  inputString = inputString.replace(/\[b\](.*?)\[\/b\]/g, '<b>$1</b>');        // Bold
  inputString = inputString.replace(/\[i\](.*?)\[\/i\]/g, '<i>$1</i>');        // Italic
  inputString = inputString.replace(/\[h\](.*?)\[\/h\]/g, "<h1>$1</h1>");      // Header
  inputString = inputString.replace(/\[u\](.*?)\[\/u\]/g, '<u>$1</u>');        // Underline
  inputString = inputString.replace(/\[s\](.*?)\[\/s\]/g, '<strike>$1</strike>'); // Strikethrough
  inputString = inputString.replace(/\[c\](.*?)\[\/c\]/g, '<div class="center">$1</div>'); // center
  inputString = inputString.replace(/\[r\](.*?)\[\/r\]/g, '<div class="left">$1</div>'); // right align
  inputString = inputString.replace(/\[l\](.*?)\[\/l\]/g, '<div class="right">$1</div>'); // left align
  // Image tag replacement
  inputString = inputString.replace(/\[img=(https?:\/\/[^ ]+)\](.*?)\[\/img\]/g, '<img src="$1" alt="$2" />'); // Image
  // Anchor (link) tag replacement
  inputString = inputString.replace(/\[a=([^\]]+)\](.*?)\[\/a\]/g, (match, url, text) => {
    // Handle relative and absolute URLs
    let href = url.trim();
    if (href.startsWith('http://') || href.startsWith('https://')) {
      // Keep the absolute link as it is
      return `<a href="${href}" target="_blank">${text}</a>`;
    } else if (href.startsWith('/') || href.startsWith('./')) {
      // Prepend the origin for relative paths
      href = window.location.origin + href;
      return `<a href="${href}" target="_blank">${text}</a>`;
    } else {
      // If it doesn't start with http/https, assume it's a relative link and prepend "https://"
      href = 'https://' + href;
      return `<a href="${href}" target="_blank">${text}</a>`;
    }
  });

  // Function to handle unordered and ordered lists with nested [ul] and [ol]
  function replaceListTags(input, tag) {
    const regex = new RegExp(`\\[${tag}\\]([\\s\\S]*?)\\[\\/(${tag})\\]`, 'g');
    return input.replace(regex, (match, content) => {
      // Recursively replace [ul] and [ol] within list items
      content = content
        .replace(/\[li\](.*?)\[\/li\]/g, '<li>$1</li>'); // Replace [li] with <li>
      return `<${tag}>${content}</${tag}>`; // Wrap the list content in <ul> or <ol>
    });
  }

  // Replace [ul] and [ol] with corresponding HTML tags
  inputString = replaceListTags(inputString, 'ul');
  inputString = replaceListTags(inputString, 'ol');

  // Return the transformed HTML
  return inputString;
}

export function useParseMarkup() {
  const [htmlParsed, setHTMLParsed] = React.useState<{[key: string]: any}>({});
  const [integrityCheck, setIntegrityCheck] = React.useState<{[key: string]: string}>()
  const parseHTML = React.useCallback((inputString: string, key: string) => {
    if (!Object.keys(htmlParsed).includes(key)) {
      const newhtmlParsed = {
        ...htmlParsed,
        [key]: parseMarkup(inputString)?.split("\n").map((v: any) =>
          <React.Fragment><section dangerouslySetInnerHTML={{ __html: v }} /><br /></React.Fragment>)
      }
      setHTMLParsed(newhtmlParsed);
      setIntegrityCheck({...integrityCheck, [key]: inputString})
    } else {
      if (integrityCheck[key] !== inputString) {
        const newhtmlParsed = {
          ...htmlParsed,
          [key]: parseMarkup(inputString)?.split("\n").map((v: any) =>
            <React.Fragment><section dangerouslySetInnerHTML={{ __html: v }} /><br /></React.Fragment>)
        }
        setHTMLParsed(newhtmlParsed);
        setIntegrityCheck({...integrityCheck, [key]: inputString})
      }
    }
  }, [htmlParsed, integrityCheck]);
  return {
    parseHTML,
    htmlParsed: React.useMemo(() => htmlParsed, [htmlParsed])
  }
}

export function purifyHTML(inputString: string) {
  const clean = sanitizeHTML(inputString, {
    allowedTags: [], // No tags allowed, effectively removing all HTML
  });
  console.log(clean);
  return clean;
}

/* @vite-ignore */
RPDF.pdfjs.GlobalWorkerOptions.workerSrc = new URL(
/* @vite-ignore */
  'https://esm.sh/pdfjs-dist@4.4.168/build/pdf.worker.min.mjs',
/* @vite-ignore */
  import.meta.url,
/* @vite-ignore */
).toString()

export const ReactPDF = RPDF