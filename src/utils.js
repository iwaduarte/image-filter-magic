// https://stackoverflow.com/a/14731922/7350853

const resizeAspectRatio = (imageWidth, imageHeight, maxWidth, maxHeight) => {
  const ratio = Math.min(maxWidth / imageWidth, maxHeight / imageHeight);
  return { width: imageWidth * ratio, height: imageHeight * ratio };
};

export { resizeAspectRatio };
