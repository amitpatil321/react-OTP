import { useEffect, useState } from "react"
import "./App.css"
import { Hamburger } from "./component/Hamburger"
import ReactOtp from "./component/react-otp/ReactOtp"

const CustomInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className={`border border-gray-500 focus:border-blue-600 rounded-lg w-10 h-10 text-center ${props.className}`}
  />
)

function App() {
  const [isOpen, setOpen] = useState(true)
  // const [value, setValue] = useState<string>("")
  const [length, setLength] = useState<number>(4)
  const [separator, setSeparator] = useState<string>("-")
  const [placeholder, setPlaceholder] = useState("_")
  const [otp, setOtp] = useState<string>("")
  // const [completed, setCompleted] = useState<boolean>(false)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setOpen(true)
      } else setOpen(false)
    }

    window.addEventListener("resize", handleResize)
    handleResize()

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div className="flex md:flex-row flex-col w-full h-dvh overflow-hidden">
      <div
        className={`absolute md:static bg-white shadow-xl w-4/5 sm:w-2/3 md:w-[30%] lg:w-[25%] xl:w-1/5 h-dvh transform transition-transform duration-300 ease-in-out z-10 flex-shrink-0
      ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="flex justify-between items-center px-3 py-4 border-gray-200 border-b">
          <div className="font-medium text-gray-700 text-lg">Controls</div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="md:hidden hover:bg-gray-200 px-3 py-1 rounded-lg text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-5 p-4 controls">
          <div>
            <label htmlFor="value" className="block mb-1 font-medium text-gray-700 text-sm">
              Value
            </label>
            <input
              type="text"
              id="value"
              placeholder="Value"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="length" className="block mb-1 font-medium text-gray-700 text-sm">
              No. of Inputs
            </label>
            <input
              type="number"
              id="length"
              placeholder="Length"
              value={length}
              max={10}
              min={1}
              onChange={(e) => setLength(Number(e.target.value))}
            />
          </div>

          <div>
            <label htmlFor="separator" className="block mb-1 font-medium text-gray-700 text-sm">
              Separator
            </label>
            <input
              type="text"
              id="separator"
              maxLength={1}
              value={separator}
              placeholder="Separator"
              onChange={(e) => setSeparator(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="placeholder" className="block mb-1 font-medium text-gray-700 text-sm">
              Placeholder
            </label>
            <input
              type="text"
              id="placeholder"
              value={placeholder}
              placeholder="Placeholder"
              onChange={(e) => setPlaceholder(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="relative flex flex-col flex-wrap justify-center items-center gap-6 px-4 py-8 w-full h-full">
        <button
          type="button"
          className="md:hidden top-4 left-4 absolute hover:bg-gray-100 rounded-md"
          onClick={() => setOpen(true)}
        >
          <Hamburger />
        </button>
        <ReactOtp
          value={otp}
          length={length}
          onChange={setOtp}
          inputType="text"
          defaultFocus={true}
          slots={{
            Container: (props) => <div {...props} />,
            Input: (props) => <CustomInput {...props} />,
            Separator: (props) => <span {...props}>-</span>
          }}
        />
        <div className="flex flex-row gap-4">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setOtp("")
            }}
          >
            Clear
          </button>
          <button type="button" className="btn btn-primary" onClick={() => alert(otp)}>
            Submit
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
