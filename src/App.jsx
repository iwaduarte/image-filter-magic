import { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import { resizeAspectRatio } from "./utils.js";
import "./App.css";

const { Canvas, Image: FabricImage } = fabric;

const App = () => {
  const canvasRef = useRef(null);
  const [fabricCanvas, setFabricCanvas] = useState(null);
  const [canvas, setCanvas] = useState(null);

  useEffect(() => {
    const _fabricCanvas = new Canvas(canvasRef.current);
    _fabricCanvas.hoverCursor = "pointer";
    setFabricCanvas(_fabricCanvas);
    const canvas = document.createElement("canvas");
    setCanvas(canvas);
  }, []);

  const handleImageChange = (e) => {
    fabricCanvas.clear();
    const file = e.target?.files[0];
    if (!file) return;

    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const { width, height } = resizeAspectRatio(
        img.width,
        img.height,
        800,
        800
      );
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, width, height);
      const dataURI = canvas.toDataURL();
      new FabricImage.fromURL(
        dataURI,
        (img) => {
          fabricCanvas.add(img).setActiveObject(img).renderAll();
        },
        {
          hasControls: false,
          lockMovementX: true,
          lockMovementY: true,
          lockScalingY: true,
          lockScalingX: true,
        }
      );
    };
  };

  const resetImage = () => {
    const image =
      fabricCanvas.getActiveObject() || fabricCanvas.getObjects()[0];

    if (!image) return;

    image.filters = [];
    image.applyFilters();
    fabricCanvas.renderAll();
  };

  const handleFilter = (type) => {
    const filter = {
      sepia: new FabricImage.filters.Sepia(),
      vintage: new FabricImage.filters.Vintage(),
      blur: new FabricImage.filters.Blur({ blur: 0.25 }),
    };

    const image =
      fabricCanvas.getActiveObject() || fabricCanvas.getObjects()[0];

    if (!filter[type] || !image) return;

    image?.filters.push(filter[type]);
    image?.applyFilters();
    fabricCanvas.renderAll();
  };

  const saveImage = () => {
    const image =
      fabricCanvas.getActiveObject() || fabricCanvas.getObjects()[0];
    if (!image) return;

    const link = document.createElement("a");
    link.download = "image-filtered.png";
    link.href = fabricCanvas.toDataURL({
      format: "png",
      quality: 1,
    });
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="App">
      <label htmlFor="file"> Add Image </label>
      <input
        name="file"
        id="file"
        type="file"
        onChange={handleImageChange}
        accept="image/*"
      />

      <div className="actions">
        <button onClick={() => handleFilter("vintage")}>
          Add/Increase Vintage
        </button>
        <button onClick={() => handleFilter("sepia")}>
          Add/Increase Sepia
        </button>
        <button onClick={() => handleFilter("blur")}> Add/Increase Blur</button>
        <button onClick={resetImage}> Reset</button>
        <button onClick={saveImage}> Download Image </button>
      </div>
      <canvas ref={canvasRef} width={800} height={800} />
    </div>
  );
};

export default App;
