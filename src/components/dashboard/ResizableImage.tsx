import React, { useEffect, useRef } from 'react';
import { NodeViewWrapper, type ReactNodeViewProps } from '@tiptap/react';

interface ResizableImageProps extends ReactNodeViewProps {}

const ResizableImage: React.FC<ResizableImageProps> = ({
  node,
  updateAttributes,
  selected,
}) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { src, alt, width, height } = (node.attrs || {}) as {
    src: string;
    alt?: string;
    width?: number | string;
    height?: number | string;
  };

  useEffect(() => {
    if (!imgRef.current) return;

    // Load image to get natural dimensions
    const img = imgRef.current;
    if (!img.complete) {
      img.onload = () => {
        if (!width && !height && img.naturalWidth) {
          // Set initial dimensions based on natural size
          const maxWidth = 800;
          const aspectRatio = img.naturalHeight / img.naturalWidth;
          const initialWidth = Math.min(img.naturalWidth, maxWidth);
          const initialHeight = initialWidth * aspectRatio;
          updateAttributes({ width: initialWidth, height: initialHeight });
        }
      };
    }
  }, [src]);

  const handleMouseDown = (e: React.MouseEvent, handle: 'se' | 'sw' | 'ne' | 'nw') => {
    e.preventDefault();
    e.stopPropagation();

    if (!imgRef.current) return;

    const img = imgRef.current;
    const rect = img.getBoundingClientRect();
    const currentWidth = width ? (typeof width === 'number' ? width : parseInt(String(width))) : rect.width;
    const currentHeight = height ? (typeof height === 'number' ? height : parseInt(String(height))) : rect.height;

    const startPosX = e.clientX;
    const startWidth = currentWidth;
    const startHeight = currentHeight;
    const aspectRatio = startHeight / startWidth;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startPosX;

      let newWidth = startWidth;

      // Calculate new dimensions based on handle
      switch (handle) {
        case 'se': // Southeast (bottom-right)
        case 'ne': // Northeast (top-right)
          newWidth = Math.max(50, startWidth + deltaX);
          break;
        case 'sw': // Southwest (bottom-left)
        case 'nw': // Northwest (top-left)
          newWidth = Math.max(50, startWidth - deltaX);
          break;
      }

      const newHeight = newWidth * aspectRatio;

      updateAttributes({ width: Math.round(newWidth), height: Math.round(newHeight) });
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const currentWidth = width ? (typeof width === 'number' ? width : parseInt(String(width))) : 'auto';
  const currentHeight = height ? (typeof height === 'number' ? height : parseInt(String(height))) : 'auto';

  return (
    <NodeViewWrapper
      ref={wrapperRef}
      className={`relative inline-block my-4 ${selected ? 'ring-2 ring-cyan-500' : ''}`}
    >
      <div className="relative inline-block">
        <img
          ref={imgRef}
          src={src}
          alt={alt || ''}
          style={{
            width: typeof currentWidth === 'number' ? `${currentWidth}px` : currentWidth === 'auto' ? undefined : currentWidth,
            height: typeof currentHeight === 'number' ? `${currentHeight}px` : currentHeight === 'auto' ? undefined : currentHeight,
            maxWidth: '100%',
            display: 'block',
          }}
          className="rounded-lg"
          draggable={false}
        />
        {selected && (
          <>
            {/* Resize handles */}
            <div
              className="absolute bottom-0 right-0 w-4 h-4 bg-cyan-500 border-2 border-white rounded cursor-nwse-resize"
              style={{ transform: 'translate(50%, 50%)' }}
              onMouseDown={(e) => handleMouseDown(e, 'se')}
            />
            <div
              className="absolute bottom-0 left-0 w-4 h-4 bg-cyan-500 border-2 border-white rounded cursor-nesw-resize"
              style={{ transform: 'translate(-50%, 50%)' }}
              onMouseDown={(e) => handleMouseDown(e, 'sw')}
            />
            <div
              className="absolute top-0 right-0 w-4 h-4 bg-cyan-500 border-2 border-white rounded cursor-nesw-resize"
              style={{ transform: 'translate(50%, -50%)' }}
              onMouseDown={(e) => handleMouseDown(e, 'ne')}
            />
            <div
              className="absolute top-0 left-0 w-4 h-4 bg-cyan-500 border-2 border-white rounded cursor-nwse-resize"
              style={{ transform: 'translate(-50%, -50%)' }}
              onMouseDown={(e) => handleMouseDown(e, 'nw')}
            />
          </>
        )}
      </div>
    </NodeViewWrapper>
  );
};

export default ResizableImage;

