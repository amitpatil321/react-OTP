# React Smart Otp

Lightweight, accessible, and flexible React OTP (one-time passcode) input component with a slots API. Use it as-is for a simple, styled OTP row or supply custom slot components for deep UI-library integration (ShadCN, AntD, MUI, etc.).

## Key features

- Controlled API (pass `value` and `onChange`).
- Slots-based customization: replace `Container`, `Input`, or `Separator` elements.
- Keyboard-friendly: auto-advance on input, backspace moves back and clears.
- Paste support: paste a full code into any input and it will populate the inputs (truncated to length).
- Minimal CSS included (in `src/component/react-otp/ReactOtp.css`) and easy to theme.

## Usage 

### Simple Example

```tsx
import React, { useState } from 'react'
import ReactOtp from './src/component/react-otp/ReactOtp'

function Verify() {
	const [code, setCode] = useState('')

	return (
		<ReactOtp
			length={6}
			value={code}
			onChange={setCode}
			inputType="text"
			defaultFocus={true}
		/>
	)
}
```
### Using Slots (Shadcn)  

```js
import { useState } from "react";
import { ReactOtp } from "react-smart-otp";
import "react-smart-otp/dist/index.css";
import { Button } from "./components/ui/button";
import { Card, CardContent } from "./components/ui/card";
import { Input } from "./components/ui/input";

function App() {
  const [otp, setOtp] = useState("");

  return (
    <>
      <ReactOtp
        value={otp}
        length={4}
        onChange={setOtp}
        defaultFocus={true}
        slots={{
          Container: ({ children }) => (
            <Card>
              <CardContent
                style={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                {children}
              </CardContent>
            </Card>
          ),
          Input: (props) => <Input className="w-10 text-center" {...props} />,
          Separator: (props) => <span {...props}>-</span>,
        }}
      />
      <br />
      <Button onClick={() => setOtp("")}>Clear</Button>
    </>
  );
}

export default App;

```
## ReactOtp Component Props

| Prop | Type | Required | Default | Description |
|------|------|-----------|----------|-------------|
| **value** | `string` | ✅ Yes | — | The full concatenated OTP value (controlled mode). |
| **length** | `number` | ✅ Yes | — | Number of digits/inputs to render. |
| **onChange** | `(val: string) => void` | ✅ Yes | — | Called with the concatenated value whenever any digit changes. |
| **inputType** | `'text' \| 'password' \| 'number'` | ❌ No | `'text'` | Input `type` attribute applied to each input. |
| **defaultFocus** | `boolean` | ❌ No | `false` | Focus the first input on mount when true. |
| **slots** | `{ Container?: ElementType; Input?: ElementType; Separator?: ElementType }` | ❌ No | — | Optional slot components to replace internal elements. |

---

## Slots API

| Slot | Receives | Description |
|------|-----------|-------------|
| **Container** | `HTMLAttributes<HTMLElement>` | Used to wrap all inputs. |
| **Input** | `InputHTMLAttributes<HTMLInputElement>` | Rendered for each digit. Component spreads `ref`, `value`, `onChange`, `onKeyDown`, `onPaste`, `onFocus`, `maxLength`, `type`, `id`, `data-testid`, and `aria-label`. |
| **Separator** | `HTMLAttributes<HTMLElement>` | Rendered between each input, except after the last one. |

---

## ⚠️ Warning
When providing a custom Input slot, do not override the following props:
ref, value, onChange, onFocus, onKeyDown, onPaste, type, maxLength, id, data-testid, or aria-label.

These are managed internally by the ReactOtp component. Overriding them may cause broken focus handling, incorrect value updates, or other unexpected behavior.

## Behavioral Contract

- The component is **controlled** — you must pass `value` and update it via `onChange` for the UI to reflect changes.  
- `onChange` receives the **full concatenated string**, e.g. `"1234"`.

## Styling / Theming

Minimal CSS is included in `src/component/react-otp/ReactOtp.css` — the primary class names are:

- `.otp-container` — wrapper element.
- `.otp-input` — default class applied to each input element.

You can style the component by:
- Passing slot components that render library inputs or custom inputs.
- Overriding or extending `.otp-input` in your app CSS.
- Wrapping the component and applying utilities (Tailwind) to the custom `Container` slot.

Example CSS (already included):

```css
.otp-container { display: flex; gap: 10px; align-items: center; justify-content: center; }
.otp-input { width: 40px; height: 40px; text-align: center; border-radius: 8px; border: 1px solid #bebebe }
.otp-input:focus { border-color: var(--otp-color, #007bff); outline: none }
```

## Accessibility

- Each input receives an `aria-label` in the format `OTP input {index + 1} of {length}` by default. You can replace inputs via slots and provide your own accessible labels if you prefer.
- `autoComplete="off"` is set on inputs to avoid unwanted autofill. If you need browser or SMS autofill support, consider adding `autoComplete="one-time-code"` on the first input in a custom `Input` slot.

## 🤝 Contributing

We welcome contributions from the community!

You can contribute in two ways:

Feel free to [open issues](https://github.com/amitpatil321/react-smart-otp/issues/new/choose) and [pull requests](https://github.com/amitpatil321/react-smart-otp/pulls)!

## License

Choose and add your license here (e.g. MIT).
