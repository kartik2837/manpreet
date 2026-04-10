// import React, { useState, useRef, useEffect, type MouseEvent } from 'react';

// interface ZoomableImageProps {
//   src: string | undefined;
//   alt: string;
// }

// interface Offset {
//   x: number;
//   y: number;
// }

// const ZoomableImage: React.FC<ZoomableImageProps> = ({ src, alt }) => {
//   const [isZoomed, setIsZoomed] = useState<boolean>(false);
//   const [offset, setOffset] = useState<Offset>({ x: 0, y: 0 });
//   const [start, setStart] = useState<Offset>({ x: 0, y: 0 });
//   const [isDragging, setIsDragging] = useState<boolean>(false);
//   const imgRef = useRef<HTMLImageElement>(null);

//   const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
//     if (e.button === 0) {
//       setStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
//       setIsDragging(true);
//       e.preventDefault();
//     }
//   };

//   const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
//     if (isDragging) {
//       setOffset({
//         x: e.clientX - start.x,
//         y: e.clientY - start.y,
//       });
//     }
//   };

//   const handleMouseUp = () => {
//     setIsDragging(false);
//   };

//   const handleContextMenu = (e: MouseEvent<HTMLDivElement>) => {
//     e.preventDefault();
//   };

//   const toggleZoom = () => {
//     setIsZoomed(!isZoomed);
//     setOffset({ x: 0, y: 0 });
//     console.log("toggle zoom ----- ",isZoomed)
//   };

//   useEffect(() => {
//     if (imgRef.current) {
//       imgRef.current.style.cursor = isDragging ? 'grabbing' : 'grab';
//     }
//   }, [isDragging]);

//   return (
//     <div
//       style={{
//         overflow: 'hidden',
//         cursor: isZoomed ? 'zoom-out' : 'zoom-in',
//         width: isZoomed ? '100%' : '100%',
//         height: 'auto',
//         position: 'relative',
        
//       }}
//       onClick={toggleZoom}
//       onMouseDown={handleMouseDown}
//       onMouseMove={handleMouseMove}
//       onMouseUp={handleMouseUp}
//       onMouseLeave={handleMouseUp}
//       onContextMenu={handleContextMenu}
//     >
//       <img
//         ref={imgRef}
//         src={src}
//         alt={alt}
//         style={{
//           width: isZoomed ? '200%' : '200%',
//           height: isZoomed ? '200%' : 'auto',
//           transform: `translate(${offset.x}px, ${offset.y}px)`,
//           transition: isDragging ? 'none' : 'transform 0.3s',
//           userSelect: 'none',
//         }}
//       />
//     </div>
//   );
// };

// export default ZoomableImage;












import React, { useRef, useState } from "react";

interface Props {
  src: string;
  alt?: string;
}

const ZoomableImage: React.FC<Props> = ({ src, alt }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [bgPosition, setBgPosition] = useState("0% 0%");
  const [zoom, setZoom] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } =
      containerRef.current!.getBoundingClientRect();

    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setBgPosition(`${x}% ${y}%`);
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setZoom(true)}
      onMouseLeave={() => setZoom(false)}
      onMouseMove={handleMouseMove}
      style={{
        width: "400px",
        height: "400px",
        overflow: "hidden",
        position: "relative",
        cursor: "zoom-in",
        border: "1px solid #ddd",
        borderRadius: "10px",
      }}
    >
      {/* Background Zoom Layer */}
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundImage: `url(${src})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: bgPosition,
          backgroundSize: zoom ? "200%" : "100%",
          transition: "background-size 0.3s ease",
        }}
      />

      {/* Normal Image */}
      <img
        src={src}
        alt={alt}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "contain",
          opacity: zoom ? 0 : 1,
          transition: "opacity 0.3s ease",
          pointerEvents: "none",
        }}
      />
    </div>
  );
};

export default ZoomableImage;































