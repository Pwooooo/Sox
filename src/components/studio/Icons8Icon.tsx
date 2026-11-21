export function Icons8Icon({
  name,
  filled = false,
  dark = false,
  className = 'size-4',
}: {
  name: string
  filled?: boolean
  dark?: boolean
  className?: string
}) {
  const style = filled ? 'ios-filled' : 'ios'
  const color = dark ? '0a0a0a' : 'ffffff'
  return (
    <img
      src={`https://img.icons8.com/${style}/48/${color}/${name}.png`}
      alt={name}
      draggable={false}
      className={`${className} object-contain select-none transition-opacity ${filled ? 'opacity-100' : 'opacity-75'}`}
    />
  )
}
