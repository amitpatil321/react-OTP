import "./component/react-otp/ReactOtp.css"
// side-effect import so bundlers/processors that handle CSS imports will
// process the component stylesheet. When building for distribution we
// also configure rollup-postcss to inject styles into the JS bundle so
// consumers don't need to import the CSS manually.
import "./component/react-otp/ReactOtp.css"

export { default as ReactOtp } from "./component/react-otp/ReactOtp"
export type { ReactOtpProps } from "./component/react-otp/ReactOtp"
