/**
 * Bookmarklet source code.
 * This file is NOT imported at runtime — it's used to generate the
 * bookmarklet href string (minified, URI-encoded).
 *
 * What it does:
 * 1. Reads getComputedStyle on visible elements only
 * 2. Counts frequency per color (most-used = most relevant)
 * 3. Opens magiklch.vercel.app/steal?colors=hex1,hex2,...
 */

const BOOKMARKLET_SOURCE = `
(function(){
  var freq={};
  var RGB_RE=/^rgba?\\(([^)]+)\\)/i;

  function toHex(r,g,b){
    return [r,g,b].map(function(x){
      var h=Math.max(0,Math.min(255,Math.round(x))).toString(16);
      return h.length<2?'0'+h:h;
    }).join('');
  }

  function addColor(val){
    if(!val)return;
    var m=val.match(RGB_RE);
    if(!m)return;
    var parts=m[1].split(/[,/\\s]+/).map(Number);
    if(parts.length<3||isNaN(parts[0]))return;
    if(parts.length>=4&&parts[3]===0)return;
    var hex=toHex(parts[0],parts[1],parts[2]);
    if(hex==='000000'&&parts.length>=4&&parts[3]<0.1)return;
    freq[hex]=(freq[hex]||0)+1;
  }

  var PROPS=['color','background-color','border-top-color','border-right-color','border-bottom-color','border-left-color','outline-color','fill','stroke'];
  var els=document.querySelectorAll('body *');
  var limit=Math.min(els.length,2000);
  for(var k=0;k<limit;k++){
    var cs=getComputedStyle(els[k]);
    PROPS.forEach(function(p){addColor(cs.getPropertyValue(p));});
  }

  var sorted=Object.keys(freq).sort(function(a,b){return freq[b]-freq[a];});
  var arr=sorted.slice(0,50);
  if(arr.length===0){alert('No colors found on this page.');return;}
  var url='MAGIKLCH_BASE_URL/steal?colors='+arr.join(',');
  window.open(url,'_blank');
})();
`;

/**
 * Generate the bookmarklet href string for a given base URL.
 */
export function generateBookmarkletHref(baseUrl: string): string {
  // Validate URL to prevent injection into bookmarklet JS
  const validated = new URL(baseUrl);
  if (!["http:", "https:"].includes(validated.protocol)) {
    throw new Error(`Invalid protocol: ${validated.protocol}`);
  }
  const code = BOOKMARKLET_SOURCE.replace("MAGIKLCH_BASE_URL", validated.origin)
    .replace(/\n\s*/g, "")
    .trim();
  return `javascript:void'Magiklch~Steal~Colors';${encodeURIComponent(code)}`;
}

/**
 * Default bookmarklet href using the production URL.
 * In development, override with window.location.origin.
 */
export const PRODUCTION_BASE_URL = "https://magiklch.vercel.app";
