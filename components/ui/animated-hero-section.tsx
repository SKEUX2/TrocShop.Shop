"use client"

import { useEffect, useRef } from "react"

const COLOR = "#FFFFFF"
const HIT_COLOR = "rgba(255, 255, 255, 0.08)"
const BALL_COLOR = "#ff4500"
const PADDLE_COLOR = "rgba(255, 255, 255, 0.3)"
const LETTER_SPACING = 1
const WORD_SPACING = 3

const PIXEL_MAP = {
  P: [
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
  ],
  R: [
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
    [1, 0, 1, 0],
    [1, 0, 0, 1],
  ],
  O: [
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
  ],
  M: [
    [1, 0, 0, 0, 1],
    [1, 1, 0, 1, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
  ],
  T: [
    [1, 1, 1, 1, 1],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
  ],
  I: [
    [1, 1, 1],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [1, 1, 1],
  ],
  N: [
    [1, 0, 0, 0, 1],
    [1, 1, 0, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 1, 1],
    [1, 0, 0, 0, 1],
  ],
  G: [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0],
    [1, 0, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
  ],
  S: [
    [1, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 1],
    [1, 1, 1, 1],
  ],
  A: [
    [0, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
  ],
  L: [
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 1, 1, 1],
  ],
  Y: [
    [1, 0, 0, 0, 1],
    [0, 1, 0, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
  ],
  U: [
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
  ],
  D: [
    [1, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 0],
  ],
  E: [
    [1, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 1, 1, 1],
  ],
  // Extra characters requested by Y999 STORE / TROCSHOP
  "9": [
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
    [0, 0, 0, 1],
    [1, 1, 1, 1],
  ],
  C: [
    [1, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 1, 1, 1],
  ],
  H: [
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
  ],
  " ": [
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
  ],
} as const

interface Pixel {
  x: number
  y: number
  size: number
  hit: boolean
  color: string
}

interface Ball {
  x: number
  y: number
  dx: number
  dy: number
  radius: number
}

interface Paddle {
  x: number
  y: number
  width: number
  height: number
  targetY: number
  isVertical: boolean
}

export function PromptingIsAllYouNeed() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pixelsRef = useRef<Pixel[]>([])
  const ballRef = useRef<Ball>({ x: 0, y: 0, dx: 0, dy: 0, radius: 0 })
  const paddlesRef = useRef<Paddle[]>([])
  const scaleRef = useRef(1)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = Math.min(window.innerHeight, 800) // Contain the playground height
      scaleRef.current = Math.min(canvas.width / 1000, canvas.height / 1000)
      initializeGame()
    }

    const initializeGame = () => {
      const scale = scaleRef.current
      const LARGE_PIXEL_SIZE = Math.max(4, 7 * scale)
      const SMALL_PIXEL_SIZE = Math.max(3, 4.5 * scale)
      const BALL_SPEED = Math.max(3.5, 5 * scale)

      pixelsRef.current = []
      // Spelling: "TROCSHOP" and "STORE"
      const words = ["TROCSHOP", "STORE"]

      const calculateWordWidth = (word: string, pixelSize: number) => {
        return (
          word.split("").reduce((width, letter) => {
            const letterKey = letter.toUpperCase() as keyof typeof PIXEL_MAP
            const letterWidth = PIXEL_MAP[letterKey]?.[0]?.length ?? 0
            return width + letterWidth * pixelSize + LETTER_SPACING * pixelSize
          }, 0) -
          LETTER_SPACING * pixelSize
        )
      }

      const totalWidthLarge = calculateWordWidth(words[0], LARGE_PIXEL_SIZE)
      const totalWidthSmall = words[1].split(" ").reduce((width, word, index) => {
        return width + calculateWordWidth(word, SMALL_PIXEL_SIZE) + (index > 0 ? WORD_SPACING * SMALL_PIXEL_SIZE : 0)
      }, 0)
      const totalWidth = Math.max(totalWidthLarge, totalWidthSmall)
      const scaleFactor = (canvas.width * 0.9) / totalWidth

      const adjustedLargePixelSize = LARGE_PIXEL_SIZE * Math.min(1.0, scaleFactor)
      const adjustedSmallPixelSize = SMALL_PIXEL_SIZE * Math.min(1.0, scaleFactor)

      const largeTextHeight = 5 * adjustedLargePixelSize
      const smallTextHeight = 5 * adjustedSmallPixelSize
      const spaceBetweenLines = 6 * adjustedLargePixelSize
      const totalTextHeight = largeTextHeight + spaceBetweenLines + smallTextHeight

      let startY = (canvas.height - totalTextHeight) / 2

      words.forEach((word, wordIndex) => {
        const pixelSize = wordIndex === 0 ? adjustedLargePixelSize : adjustedSmallPixelSize
        const pixelColor = wordIndex === 0 ? "#ff4500" : "#ffffff" // TROCSHOP in brand orange, STORE in white
        
        const totalWidth =
          wordIndex === 0
            ? calculateWordWidth(word, adjustedLargePixelSize)
            : words[1].split(" ").reduce((width, w, index) => {
                return (
                  width +
                  calculateWordWidth(w, adjustedSmallPixelSize) +
                  (index > 0 ? WORD_SPACING * adjustedSmallPixelSize : 0)
                )
              }, 0)

        let startX = (canvas.width - totalWidth) / 2

        if (wordIndex === 1) {
          word.split(" ").forEach((subWord) => {
            subWord.split("").forEach((letter) => {
              const letterKey = letter.toUpperCase() as keyof typeof PIXEL_MAP
              const pixelMap = PIXEL_MAP[letterKey]
              if (!pixelMap) return

              for (let i = 0; i < pixelMap.length; i++) {
                for (let j = 0; j < (pixelMap[i] as readonly number[]).length; j++) {
                  if (pixelMap[i][j]) {
                    const x = startX + j * pixelSize
                    const y = startY + i * pixelSize
                    pixelsRef.current.push({ x, y, size: pixelSize, hit: false, color: pixelColor })
                  }
                }
              }
              startX += ((pixelMap[0] as readonly number[]).length + LETTER_SPACING) * pixelSize
            })
            startX += WORD_SPACING * adjustedSmallPixelSize
          })
        } else {
          word.split("").forEach((letter) => {
            const letterKey = letter.toUpperCase() as keyof typeof PIXEL_MAP
            const pixelMap = PIXEL_MAP[letterKey]
            if (!pixelMap) return

            for (let i = 0; i < pixelMap.length; i++) {
              for (let j = 0; j < (pixelMap[i] as readonly number[]).length; j++) {
                if (pixelMap[i][j]) {
                  const x = startX + j * pixelSize
                  const y = startY + i * pixelSize
                  pixelsRef.current.push({ x, y, size: pixelSize, hit: false, color: pixelColor })
                }
              }
            }
            startX += ((pixelMap[0] as readonly number[]).length + LETTER_SPACING) * pixelSize
          })
        }
        startY += wordIndex === 0 ? largeTextHeight + spaceBetweenLines : 0
      })

      // Initialize ball position near top right corner
      const ballStartX = canvas.width * 0.85
      const ballStartY = canvas.height * 0.15

      ballRef.current = {
        x: ballStartX,
        y: ballStartY,
        dx: -BALL_SPEED,
        dy: BALL_SPEED,
        radius: Math.max(3, adjustedLargePixelSize * 0.6),
      }

      const paddleWidth = Math.max(4, adjustedLargePixelSize * 1.2)
      const paddleLength = Math.max(45, 10 * adjustedLargePixelSize)

      paddlesRef.current = [
        {
          x: 4,
          y: canvas.height / 2 - paddleLength / 2,
          width: paddleWidth,
          height: paddleLength,
          targetY: canvas.height / 2 - paddleLength / 2,
          isVertical: true,
        },
        {
          x: canvas.width - paddleWidth - 4,
          y: canvas.height / 2 - paddleLength / 2,
          width: paddleWidth,
          height: paddleLength,
          targetY: canvas.height / 2 - paddleLength / 2,
          isVertical: true,
        },
        {
          x: canvas.width / 2 - paddleLength / 2,
          y: 4,
          width: paddleLength,
          height: paddleWidth,
          targetY: canvas.width / 2 - paddleLength / 2,
          isVertical: false,
        },
        {
          x: canvas.width / 2 - paddleLength / 2,
          y: canvas.height - paddleWidth - 4,
          width: paddleLength,
          height: paddleWidth,
          targetY: canvas.width / 2 - paddleLength / 2,
          isVertical: false,
        },
      ]
    }

    const updateGame = () => {
      const ball = ballRef.current
      const paddles = paddlesRef.current

      ball.x += ball.dx
      ball.y += ball.dy

      // Instantaneous paddle tracking to guarantee they are always under the ball
      paddles.forEach((paddle) => {
        if (paddle.isVertical) {
          paddle.targetY = ball.y - paddle.height / 2
          paddle.targetY = Math.max(0, Math.min(canvas.height - paddle.height, paddle.targetY))
          paddle.y = paddle.targetY
        } else {
          paddle.targetY = ball.x - paddle.width / 2
          paddle.targetY = Math.max(0, Math.min(canvas.width - paddle.width, paddle.targetY))
          paddle.x = paddle.targetY
        }
      })

      // Paddle collision resolution with safety offsetting to prevent sticking
      paddles.forEach((paddle) => {
        if (paddle.isVertical) {
          if (
            ball.x - ball.radius < paddle.x + paddle.width &&
            ball.x + ball.radius > paddle.x
          ) {
            if (ball.x < canvas.width / 2) {
              ball.dx = Math.abs(ball.dx)
              ball.x = paddle.x + paddle.width + ball.radius
            } else {
              ball.dx = -Math.abs(ball.dx)
              ball.x = paddle.x - ball.radius
            }
          }
        } else {
          if (
            ball.y - ball.radius < paddle.y + paddle.height &&
            ball.y + ball.radius > paddle.y
          ) {
            if (ball.y < canvas.height / 2) {
              ball.dy = Math.abs(ball.dy)
              ball.y = paddle.y + paddle.height + ball.radius
            } else {
              ball.dy = -Math.abs(ball.dy)
              ball.y = paddle.y - ball.radius
            }
          }
        }
      })

      // Boundary fallback checks
      if (ball.y - ball.radius < 0) {
        ball.dy = Math.abs(ball.dy)
        ball.y = ball.radius
      } else if (ball.y + ball.radius > canvas.height) {
        ball.dy = -Math.abs(ball.dy)
        ball.y = canvas.height - ball.radius
      }
      if (ball.x - ball.radius < 0) {
        ball.dx = Math.abs(ball.dx)
        ball.x = ball.radius
      } else if (ball.x + ball.radius > canvas.width) {
        ball.dx = -Math.abs(ball.dx)
        ball.x = canvas.width - ball.radius
      }

      pixelsRef.current.forEach((pixel) => {
        if (
          !pixel.hit &&
          ball.x + ball.radius > pixel.x &&
          ball.x - ball.radius < pixel.x + pixel.size &&
          ball.y + ball.radius > pixel.y &&
          ball.y - ball.radius < pixel.y + pixel.size
        ) {
          pixel.hit = true
          const centerX = pixel.x + pixel.size / 2
          const centerY = pixel.y + pixel.size / 2
          if (Math.abs(ball.x - centerX) > Math.abs(ball.y - centerY)) {
            ball.dx = -ball.dx
          } else {
            ball.dy = -ball.dy
          }
        }
      })
    }

    const drawGame = () => {
      if (!ctx) return

      // Transparent clearing to overlay on top of standard cinematic gradients & grain background seamlessly
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      pixelsRef.current.forEach((pixel) => {
        ctx.fillStyle = pixel.hit ? HIT_COLOR : pixel.color
        ctx.fillRect(pixel.x, pixel.y, pixel.size, pixel.size)
      })

      ctx.fillStyle = BALL_COLOR
      ctx.beginPath()
      ctx.arc(ballRef.current.x, ballRef.current.y, ballRef.current.radius, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = PADDLE_COLOR
      paddlesRef.current.forEach((paddle) => {
        ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height)
      })
    }

    let animationId: number
    const gameLoop = () => {
      updateGame()
      drawGame()
      animationId = requestAnimationFrame(gameLoop)
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)
    gameLoop()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <div className="flex flex-col items-center justify-center w-full h-full relative" id="interactive-hero-container">
      <canvas
        ref={canvasRef}
        className="w-full max-w-5xl h-[65%] min-h-[300px] opacity-90 drop-shadow-[0_0_25px_rgba(255,69,0,0.2)] md:drop-shadow-[0_0_40px_rgba(255,69,0,0.35)]"
        aria-label="TrocShop Store Pong Interactive Background Canvas"
      />
      <div className="mt-4 md:mt-6 text-center max-w-3xl px-6 select-none z-20">
        <p className="text-white font-extrabold text-lg sm:text-2xl md:text-3xl tracking-wide uppercase font-sans mb-1 drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
          Le premier réseau d'achat et de troc à Yamoussoukro
        </p>
        <p className="text-[#ff4500] text-[10px] sm:text-xs tracking-widest uppercase font-mono font-bold">
          INTERAGISSEZ • ÉCHANGEZ • SÉCURISEZ
        </p>
      </div>
    </div>
  )
}

export default PromptingIsAllYouNeed
