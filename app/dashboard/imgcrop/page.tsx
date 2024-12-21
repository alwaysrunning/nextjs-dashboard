/* eslint-disable @next/next/no-img-element */
"use client"

import React, { useRef, useEffect, useState, Fragment } from 'react';
import {
  getPixelRatio,
  getDotPosition,
  getDashPosition,
  checkSelectBoundary,
  getMousePosi,
  getCursorStyle,
  handleMouseInfo,
  getAnewXY,
  getPhotoData,
  getGrayscaleData,
} from './util';
import { Button } from "@/components/ui/button";
import Layout from './grid';
import mosaicBg from './image/mosaic.jpg';


let ratio: number;

let ctx: CanvasRenderingContext2D;
let initSize = {} as {
  width: number,
  height: number,
  proportion: number
};

let canvasSize = {} as {
  width: number;
  height: number;
};

let img: HTMLImageElement;
let imgSize = {} as {
  width: number,
  height: number
};
let imgScale: number; // 图片缩放比

let selectPosi = {
  x: 0,
  y: 0,
  w: 0,
  h: 0
};

let mousePosi: number[][] = [];
let canChangeSelect: boolean = false;
let initMousePosi: {
  x: number,
  y: number
};
let cursorIndex: number;
let tempCursorIndex: number | null = null;
let resetSelect: boolean = false;

let rotate: number = 0;
let grayscale: boolean = false;  //灰度

let createURL: string = '';

const Client = () => {
  const [dataUrl, setDataUrl] = useState<string>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      initSize = {
        width: 500,
        height: 500,
        proportion: 1,
      };

      ctx = canvasRef.current!.getContext('2d') as CanvasRenderingContext2D;
      ratio = getPixelRatio(ctx);

      // test
      // img = new Image();
      // img.onload = () => {
      //   initImageCanvas(img);
      //   calcCanvasSize();
      //   drawImage();
      // };
      // img.src = `${require('./image/WechatIMG139.jpeg')}`;
    } catch (e) {
      alert('浏览器不支持canvas');
    };
  }, []);

  /**
   * 计算canvas-size
   */
  const calcCanvasSize = () => {
    if (!canvasRef.current) {
      throw new Error('canvasRef not dom');
    };

    let canvasWidth = Math.min(initSize.width, imgSize.width * imgScale);
    let canvasHeight = Math.min(initSize.height, imgSize.height * imgScale);

    if (rotate % 180 !== 0) {
      [canvasWidth, canvasHeight] = [canvasHeight, canvasWidth];
    };

    canvasRef.current.style.width = `${canvasWidth}px`;
    canvasRef.current.style.height = `${canvasHeight}px`;
    canvasRef.current.width = canvasWidth * ratio;
    canvasRef.current.height = canvasHeight * ratio;

    ctx.scale(ratio, ratio);

    canvasSize = {
      width: canvasWidth,
      height: canvasHeight
    };

    mousePosi = [];
  };

  /**
   * canvas初始化绘制图片
   * @param img 
   */
  const initImageCanvas = (img: HTMLImageElement) => {
    const { width: imgWidth, height: imgHeight } = img;
    const imgProportion = imgWidth / imgHeight;

    imgSize = {
      width: imgWidth,
      height: imgHeight
    };

    if (imgWidth <= initSize.width && imgHeight <= initSize.height) {
      imgScale = 1;
      return;
    };

    if (imgProportion > initSize.proportion) {
      imgScale = initSize.width / imgWidth;
    } else {
      imgScale = initSize.height / imgHeight;
    };
  };

  /**
   * 画蒙层
   */
  const drawCover = () => {
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);
    ctx.globalCompositeOperation = 'source-atop';
    ctx.restore();
  };

  /**
   * 绘画图片
   */
  const drawImage = () => {
    let { width: canvasWidth, height: canvasHeight } = canvasSize;

    ctx.save();
    ctx.globalCompositeOperation = 'destination-over';
    ctx.translate(canvasWidth / 2, canvasHeight / 2);
    ctx.rotate(Math.PI / 180 * rotate);
    if (rotate % 180 !== 0) {
      [canvasWidth, canvasHeight] = [canvasHeight, canvasWidth];
    };
    ctx.translate(-canvasWidth / 2, - canvasHeight / 2);

    const scaleImgWidth = imgScale * imgSize.width;
    const scaleImgHeight = imgScale * imgSize.height;

    ctx.drawImage(
      img,
      (canvasWidth - scaleImgWidth) / 2, (canvasHeight - scaleImgHeight) / 2,
      scaleImgWidth, scaleImgHeight
    );

    if (grayscale) {
      const imgData = ctx.getImageData(0, 0, canvasSize.width * ratio, canvasSize.height * ratio);
      getGrayscaleData(imgData);
      ctx.putImageData(imgData, 0, 0);
    };

    ctx.restore();
  };

  /**
   * 绘画选择框
   * @param x 
   * @param y 
   * @param w 
   * @param h 
   */
  const drawSelect = (x: number, y: number, w: number, h: number) => {
    ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
    drawCover();
    ctx.save();
    ctx.clearRect(x, y, w, h);
    ctx.strokeStyle = '#5696f8';
    ctx.strokeRect(x, y, w, h);

    ctx.fillStyle = '#5696f8';
    const dots = getDotPosition(x, y, w, h);
    //@ts-ignore
    dots.map(v => ctx.fillRect(...v));

    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(255, 255, 255, .75)';
    const dashs = getDashPosition(x, y, w, h);
    dashs.map(v => {
      ctx.beginPath();
      ctx.setLineDash([2, 4]);
      ctx.moveTo(v[0], v[1]);
      ctx.lineTo(v[2], v[3]);
      ctx.closePath();
      ctx.stroke();
    });

    ctx.restore();
    drawImage();
    mousePosi = getMousePosi(x, y, w, h);
    mousePosi.push([selectPosi.x, selectPosi.y, selectPosi.w, selectPosi.h]);
  };

  /**
   * 判断x,y是否在select路径上
   * @param pathX
   * @param pathY
   */
  const checkInPath = (pathX: number, pathY: number, rectPosi: number[]) => {
    ctx.beginPath();
    // @ts-ignore
    ctx.rect(...rectPosi);
    const result = ctx.isPointInPath(pathX, pathY);
    ctx.closePath();
    return result;
  };

  /**
   * 鼠标滑动事件
   * @param e 
   */
  const mouseMove = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (!ctx || !canvasRef.current) {
      return;
    };

    const { offsetX, offsetY } = e.nativeEvent;
    const pathX = offsetX * ratio;
    const pathY = offsetY * ratio;
    let cursor = 'crosshair';
    cursorIndex = 9;

    for (let i = 0; i < mousePosi.length; i++) {
      if (checkInPath(pathX, pathY, mousePosi[i])) {
        cursor = getCursorStyle(i);
        cursorIndex = i;
        break;
      }
    }

    canvasRef.current.style.cursor = cursor;

    if (!canChangeSelect) {
      return;
    };

    if (resetSelect) {
      selectPosi = {
        x: initMousePosi.x,
        y: initMousePosi.y,
        w: 4,
        h: 4
      };
      tempCursorIndex = 2;
      resetSelect = false;
    };

    const distanceX = offsetX - initMousePosi.x;
    const distanceY = offsetY - initMousePosi.y;

    selectPosi = handleMouseInfo(
      tempCursorIndex !== null ? tempCursorIndex : cursorIndex,
      selectPosi,
      { x: distanceX, y: distanceY }
    );
    selectPosi = checkSelectBoundary(canvasSize.width, canvasSize.height, selectPosi);

    drawSelect(selectPosi.x, selectPosi.y, selectPosi.w, selectPosi.h);

    initMousePosi = {
      x: offsetX,
      y: offsetY
    };

    if (tempCursorIndex === null) {
      tempCursorIndex = cursorIndex;
    };
  };

  /**
   * mouseDown事件
   * @param e 
   */
  const mouseDown = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (cursorIndex === 9) {
      resetSelect = true;
    };
    canChangeSelect = true;
    initMousePosi = {
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY
    };
  };

  /**
   * 移动取消
   */
  const cancelChangeSelect = async () => {
    if (selectPosi.w < 0 || selectPosi.h < 0) {
      selectPosi = getAnewXY(selectPosi);
      const { x, y, w, h } = selectPosi;
      mousePosi = getMousePosi(x, y, w, h);
    };

    if (canChangeSelect) {
      dataUrl && (window.URL.revokeObjectURL(dataUrl));
      const blob = await getPhotoData({
        imgSize,
        rotate,
        img,
        canvasSize,
        imgScale,
        selectPosi,
        grayscale
      }) as Blob;
      const newDataUrl = window.URL.createObjectURL(blob);
      setDataUrl(newDataUrl);
    };

    canChangeSelect = false;
    tempCursorIndex = null;
  };

  /**
   * 旋转
   */
  const handleRotate = () => {
    rotate = rotate === 270 ? 0 : rotate + 90;
    calcCanvasSize();
    drawImage();
  };

  /**
   * 缩放
   * @param status 
   */
  const handleScale = (status: boolean) => {
    const _status = status ? 1 : -1;
    imgScale += 0.1 * _status;
    calcCanvasSize();
    drawImage();
  };

  /**
   * 灰度处理
   */
  const handleGrayscale = () => {
    grayscale = !grayscale;
    mousePosi = [];
    ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
    drawImage();
  };

  /**
   * 重置
   */
  const handleReset = () => {
    rotate = 0;
    grayscale = false;
    initImageCanvas(img);
    calcCanvasSize();
    drawImage();
    setDataUrl('');
  };

  const handleChoiseImg = () => {
    if (createURL) {
      window.URL.revokeObjectURL(createURL);
    };

    createURL = window.URL.createObjectURL(inputRef.current!.files![0]);

    img = new Image();
    img.onload = () => {
      initImageCanvas(img);
      calcCanvasSize();
      drawImage();
    };
    img.src = createURL;
  };

  return (
    <Fragment>
      <Layout
        event={{
          onMouseUp: cancelChangeSelect
        }}
      >
        <div 
          className="w-[500px] h-[500px] border border-opacity-10 flex justify-center items-center"
          style={{ backgroundImage: `url(${mosaicBg.src})` }}
        >
          <canvas
            ref={canvasRef}
            onMouseMove={mouseMove}
            onMouseDown={mouseDown}
          >浏览器不支持canvas</canvas>
        </div>

        <div className="ml-[35px] w-[200px] flex flex-col">
          <div className="w-[144px] h-[144px] border border-opacity-10 flex justify-center items-center">
            {dataUrl && (
              <img 
                src={dataUrl} 
                alt="canvas" 
                className="max-w-[144px] max-h-[144px]"
              />
            )}
          </div>
          
          <Button 
            variant="outline"
            className="mt-5 rounded relative"
          >
            <input 
              ref={inputRef} 
              type='file' 
              onChange={handleChoiseImg} 
              accept="image/gif,image/jpeg,image/jpg,image/png,image/svg"
              className="w-full h-full absolute left-0 top-0 opacity-0 cursor-pointer"
            />
            Choose Image
          </Button>

          <div>
            <Button 
              variant="outline"
              className="mt-5 mr-2.5"
              onClick={() => handleScale(true)}
            >
              Zoom In
            </Button>
            <Button 
              variant="outline"
              className="mt-5"
              onClick={() => handleScale(false)}
            >
              Zoom Out
            </Button>
          </div>

          <Button 
            variant="outline"
            className="mt-5"
            onClick={handleRotate}
          >
            Rotate
          </Button>

          <Button 
            variant="outline"
            className="mt-5"
            onClick={handleGrayscale}
          >
            Grayscale
          </Button>

          <Button 
            variant="outline"
            className="mt-5"
            onClick={handleReset}
          >
            Reset
          </Button>

          <Button 
            variant="outline"
            className="mt-5"
          >
            <a 
              href={dataUrl} 
              download="canvas.png"
              className="w-full h-full"
            >
              Download
            </a>
          </Button>
        </div>
      </Layout>
    </Fragment>
  );
};

export default Client;