// @ts-nocheck
import { Scanner as ReactQrScanner } from "@yudiel/react-qr-scanner";
import clsx from "clsx";
import React from "react";
import ReactDOM from "react-dom";
import ReactDOMServer from "react-dom/server";
import * as ReactPDF from "react-pdf";
import ReactPlayer from "react-player";
import ReactPlayerYoutube from "react-player/youtube";
import sanitizeHTML from "sanitize-html";
import Sweetalert2 from "sweetalert2";

async function getAsyncImport(path: string): Promise<any>
{
  const allImports = await import(pathname(path));
  return Object.entries(allImports).reduce(async (init, [key, value]) => ({ ...init, [key]: await value }), {})
}

ReactPDF.pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'https://esm.sh/pdfjs-dist@4.4.168/build/pdf.worker.min.mjs',
  import.meta.url,
).toString()

function parseMarkup(inputString: string): string {
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

function purifyHTML(inputString: string) {
  const clean = sanitizeHTML(inputString, {
    allowedTags: [], // No tags allowed, effectively removing all HTML
  });
  console.log(clean);
  return clean;
}
export {
  clsx, getAsyncImport, parseMarkup, purifyHTML, React,
  ReactDOM, ReactDOMServer, ReactPDF, ReactPlayer,
  ReactPlayerYoutube,
  ReactQrScanner, Sweetalert2
};

const imports = {
  React,
  ReactDOM,
  ReactDOMServer,
  ReactPlayer,
  ReactPlayerYoutube,
  ReactQrScanner,
  Sweetalert2,
  ReactPDF,
  getAsyncImport,
  clsx,
  purifyHTML,
  parseMarkup
}
export default imports