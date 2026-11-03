export default function Watermark() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center select-none">
      <div className="text-center rotate-[-12deg] opacity-[0.06]">
        <div className="text-[clamp(2.5rem,7vw,7rem)] leading-tight font-semibold tracking-widest">
          挫其锐，解其纷
        </div>
        <div className="text-[clamp(2.5rem,7vw,7rem)] leading-tight font-semibold tracking-widest">
          和其光，同其尘
        </div>
        <div className="mt-6 text-[clamp(1.5rem,3vw,3rem)] tracking-[0.8em]">
          是谓玄同
        </div>
      </div>
    </div>
  )
}