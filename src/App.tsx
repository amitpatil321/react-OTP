import { useState } from "react"
import "./App.css"
import OtpInput from "./component/OtpInput"

function App() {
  const [otp, setOtp] = useState<string | string[]>("")

  return (
    <div className="app">
      <OtpInput
        value="4567"
        length={4}
        onChange={setOtp}
        placeholder="_"
        disabled={false}
        readonly={false}
      />
      {otp}
    </div>
  )
}

export default App
