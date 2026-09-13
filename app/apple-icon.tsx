import { ImageResponse } from "next/og"

export const size = { width: 180, height: 180 }
export const contentType = "image/png"

const VERDE = "#22C358"
const FUNDO = "#1A1B1F"

const anel = (top: number) => ({
  position: "absolute" as const,
  left: 26,
  top,
  width: 40,
  height: 40,
  borderRadius: 40,
  border: `9px solid ${VERDE}`,
})

const lamina = (centroDoAnelY: number, rotacao: number) => ({
  position: "absolute" as const,
  left: 62,
  top: centroDoAnelY - 5,
  width: 96,
  height: 10,
  borderRadius: 10,
  background: VERDE,
  transform: `rotate(${rotacao}deg)`,
  transformOrigin: "left center",
})

const AppleIcon = () =>
  new ImageResponse(
    <div
      style={{
        display: "flex",
        position: "relative",
        width: "100%",
        height: "100%",
        background: FUNDO,
      }}
    >
      <div style={anel(30)} />
      <div style={anel(104)} />
      <div style={lamina(59, 38)} />
      <div style={lamina(133, -38)} />
    </div>,
    size,
  )

export default AppleIcon
