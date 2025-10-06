import { useState } from "react"
import "./App.css"
import OtpInput from "./component/OtpInput"

function App() {
  const [otp, setOtp] = useState<string | string[]>("")

  return (
    <div className="app">
      <OtpInput length={4} value="3333" onChange={setOtp} />
      {otp}
    </div>
  )
}

export default App
