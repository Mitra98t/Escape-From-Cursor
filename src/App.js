import { useRef, useEffect, useState } from 'react';
import './App.css';

import { gsap } from "gsap";

function luminance(r, g, b) {
  var a = [r, g, b].map(function (v) {
    v /= 255;
    return v <= 0.03928
      ? v / 12.92
      : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}
function contrast(rgb1, rgb2) {
  var lum1 = luminance(rgb1[0], rgb1[1], rgb1[2]);
  var lum2 = luminance(rgb2[0], rgb2[1], rgb2[2]);
  var brightest = Math.max(lum1, lum2);
  var darkest = Math.min(lum1, lum2);
  return (brightest + 0.05)
    / (darkest + 0.05);
}
contrast([255, 255, 255], [255, 255, 0]); // 1.074 for yellow
contrast([255, 255, 255], [0, 0, 255]); // 8.592 for blue


function App() {
  const hasWindow = typeof window !== 'undefined';
  const boxRef = useRef()
  const [endPos, setEndPos] = useState({ x: 0, y: 0 })
  const [windDim, setWindDim] = useState({ w: 0, h: 0 })
  const [color, setColor] = useState("#FF0000")
  const [isTextWhite, setIsTextWhite] = useState(false)
  const [isWon, setIsWon] = useState(false)
  const [frase, setFrase] = useState("Click Me!")
  const frasi = [
    "Eh, volevi",
    "Ciuccia",
    "C'eri quasi",
    "Lisciami le mele",
    "Sudicio",
    "Ciucciami il calzino",
  ]


  const getWindowDimensions = () => {
    const width = hasWindow ? window.innerWidth : null;
    const height = hasWindow ? window.innerHeight : null;
    setWindDim({ w: width, h: height })
    setEndPos({ x: (window.innerWidth / 2) - 104, y: (window.innerHeight / 2) - 56 })
  }

  useEffect(() => {
    getWindowDimensions()
  }, [])

  useEffect(() => {
    gsap.to(boxRef.current, {
      x: endPos.x,
      y: endPos.y,
      ease: "power",
      duration: ".4"
    });
  }, [endPos])

  const generatePos = () => {
    let w = 0
    let h = 0
    let oldw = endPos.x
    let oldh = endPos.y
    var cycle = false

    do {
      w = Math.random() * windDim.w
      h = Math.random() * windDim.h
      w = w > windDim.w / 2 ? w - 208 : w
      h = h > windDim.h / 2 ? h - 112 : h
      let distance = Math.round(Math.sqrt((oldw - w) ^ 2 + (oldh - h) ^ 2))
      cycle = distance > 21
    } while (!cycle)

    setEndPos({ x: w, y: h })
    setFrase(frasi[Math.floor(Math.random() * frasi.length)])

    let color = '#' + Math.floor(Math.random() * 16777215).toString(16)
    let r = parseInt(color.slice(1, 3), 16);
    let g = parseInt(color.slice(3, 5), 16);
    let b = parseInt(color.slice(5, 7), 16);

    if (contrast([r, g, b], [0, 0, 0]) > 5)
      setIsTextWhite(false)
    else
      setIsTextWhite(true)

    setColor(color)

  }

  if (isWon)
    return (
      <div className='wrapper w-full min-h-screen h-full font-mono flex flex-col items-center justify-center select-none'>
        <p className='z-40 font-black text-8xl'>YOU WON</p>
      </div>
    )
  else
    return (
      <div className={" bg-gradient-to-tl from-gray-900 to-gray-700 w-full min-h-screen h-full font-mono flex flex-col items-start justify-start gap-16 select-none "}>
        <div
          style={{
            backgroundColor: color,
            boxShadow: "0px 0px 40px 2px" + color,
            transition: "color .4s ease",
            WebkitTransition: "color .4s ease",
            MozTransition: "color .4s ease",

            transition: "background-color .4s ease",
            WebkitTransition: "background-color .4s ease",
            MozTransition: "background-color .4s ease",
          }}
          className={'random-pos w-52 h-28 rounded-lg font-black flex flex-row items-center justify-center bg-red-500 text-center cursor-pointer ' + (isTextWhite ? " text-white " : " text-black ")}
          ref={boxRef}
          onMouseEnter={generatePos}
          onClick={() => setIsWon(true)}
        >
          <p className='text-3xl'>{frase}</p>
        </div>

      </div >
    );
}

export default App;
