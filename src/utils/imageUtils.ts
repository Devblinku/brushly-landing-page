/**
 * Convert File to base64 data URL
 */
export function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Convert data URL to File
 */
export function dataURLtoFile(dataUrl: string, filename: string): File {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

/**
 * Check if a URL is a data URL (base64)
 */
export function isDataURL(url: string): boolean {
  return url.startsWith('data:image/');
}

/**
 * Extract all image URLs from TipTap JSON content
 */
export function extractImageUrls(content: any): string[] {
  const imageUrls: string[] = [];
  
  const traverse = (node: any) => {
    if (!node || typeof node !== 'object') return;
    
    if (node.type === 'image' && node.attrs?.src) {
      imageUrls.push(node.attrs.src);
    }
    
    if (node.content && Array.isArray(node.content)) {
      node.content.forEach(traverse);
    }
  };
  
  traverse(content);
  return imageUrls;
}

/**
 * Replace image URLs in TipTap JSON content
 */
export function replaceImageUrls(content: any, urlMap: Record<string, string>): any {
  const replace = (node: any): any => {
    if (!node || typeof node !== 'object') return node;
    
    if (node.type === 'image' && node.attrs?.src && urlMap[node.attrs.src]) {
      return {
        ...node,
        attrs: {
          ...node.attrs,
          src: urlMap[node.attrs.src],
        },
      };
    }
    
    if (node.content && Array.isArray(node.content)) {
      return {
        ...node,
        content: node.content.map(replace),
      };
    }
    
    return node;
  };
  
  return replace(content);
}

