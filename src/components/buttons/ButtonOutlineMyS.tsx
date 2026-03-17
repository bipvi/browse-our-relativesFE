export default function ButtonOutlineMyS({ link, txt, onclick, num }: {
  link?: string; txt: string; onclick?: (num: string) => void; num?: string
}) {
  return (
    <a href={link} onClick={() => onclick?.(num!)} className="inline-flex items-center rounded-lg px-5 shadow-md hover:bg-[#00cc7e] hover:border-none text-myS text-center text-sm font-medium border-2 border-bg hover:text-myS popup focus:outline-none focus:ring-4 focus:ring-cyan-300 cursor-pointer">
      {txt}
    </a>
  )
}
