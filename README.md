# ReactOtp

Lightweight, accessible, and flexible React OTP (one-time passcode) input component with a slots API. Use it as-is for a simple, styled OTP row or supply custom slot components for deep UI-library integration (ShadCN, AntD, MUI, etc.).

> Note: This repository contains a small OTP input component intended for use inside apps. The implementation uses a slots prop to let you replace the container, input and separator elements.

## Key features

- Controlled API (pass `value` + `onChange`).
- Slots-based customization: replace `Container`, `Input`, or `Separator` elements.
- Keyboard-friendly: auto-advance on input, backspace moves back and clears, arrow/navigation-friendly.
- Paste support: paste a full code into any input and it will populate the inputs (truncated to length).
- Minimal CSS included (in `src/component/react-otp/ReactOtp.css`) and easy to theme.

## Usage (quick)

```tsx
import React, { useState } from "react"
import ReactOtp from "./src/component/react-otp/ReactOtp"

function Verify() {
  const [code, setCode] = useState("")

  return (
    <ReactOtp length={6} value={code} onChange={setCode} inputType="text" defaultFocus={true} />
  )
}
```

## Props

The component is implemented in `src/component/react-otp/ReactOtp.tsx` and exposes the following props:

- `value: string` — (required) the full concatenated OTP value (controlled mode).
- `length: number` — (required) number of digits/inputs to render.
- `onChange: (val: string) => void` — (required) called with the concatenated value whenever any digit changes.
- `inputType?: 'text' | 'password'` — input `type` attribute applied to each input (default: `'text'`).
- `defaultFocus?: boolean` — focus the first input on mount when true (default: `false`).
- `slots?: { Container?: ElementType, Input?: ElementType, Separator?: ElementType }` — optional slot components to replace the internal elements.

Notes about the slots API:

- `Container` receives standard `HTMLAttributes<HTMLElement>` and is used to wrap the inputs.
- `Input` receives standard `InputHTMLAttributes<HTMLInputElement>` and must accept/forward the `ref` (or otherwise accept a `ref` prop) so the component can manage focus. The component spreads `ref`, `value`, `onChange`, `onKeyDown`, `onPaste`, `onFocus`, `maxLength`, `type`, `id`, `data-testid`, and `aria-label` onto each Input.
- `Separator` receives `HTMLAttributes<HTMLElement>` and is rendered between every input (except after the last one).

Important behavioral contract:

- The component is controlled — you must pass `value` and update it in `onChange` for the UI to reflect changes.
- `onChange` receives the full concatenated string (eg. `"12__3_"` where `_` is an empty char) after the update.

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
.otp-container {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
}
.otp-input {
  width: 40px;
  height: 40px;
  text-align: center;
  border-radius: 8px;
  border: 1px solid #bebebe;
}
.otp-input:focus {
  border-color: var(--otp-color, #007bff);
  outline: none;
}
```

## Slots examples

The component uses a `slots` prop with the shape `{ Container?, Input?, Separator? }` — pass React component types (ElementType). Below are examples for plain inputs and integrating UI libraries.

1. Plain inputs (default behavior)

```tsx
<ReactOtp length={4} value={code} onChange={setCode} />
```

2. Using a custom `Container` and `Separator`

```tsx
const Row = (props: React.HTMLAttributes<HTMLElement>) => (
	<div {...props} style={{ display: 'flex', gap: 8 }} />
)

const Dash = () => <span style={{ width: 8 }}>—</span>

<ReactOtp
	length={6}
	value={code}
	onChange={setCode}
	slots={{ Container: Row, Separator: Dash }}
/>
```

3. ShadCN / Tailwind (shadcn generally uses plain inputs so it works out-of-the-box)

```tsx
import { Input } from "your-shadcn-inputs"

;<ReactOtp length={6} value={code} onChange={setCode} slots={{ Input }} />
```

4. Ant Design (AntD) — AntD's `Input` supports `ref`, so you can pass it directly. If you need to attach additional props, wrap it.

```tsx
import { Input as AntdInput } from 'antd'

<ReactOtp length={6} value={code} onChange={setCode} slots={{ Input: AntdInput }} />

// Or wrap to ensure className/size:
const AntdWrapped = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
	<AntdInput {...props} style={{ width: 48, textAlign: 'center' }} />
)

<ReactOtp length={6} value={code} onChange={setCode} slots={{ Input: AntdWrapped }} />
```

5. MUI (Material UI) — MUI's `TextField` uses `inputRef` instead of forwarding `ref` directly on functional components; create a small wrapper that maps `ref` to `inputRef`.

```tsx
import TextField from '@mui/material/TextField'
import React from 'react'

const MuiInputWrapper = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
	(props, ref) => {
		// TextField expects `inputRef` for the underlying input element
		const { className, ...rest } = props
		return (
			<TextField
				{...(rest as any)}
				inputRef={ref}
				variant="outlined"
				size="small"
				inputProps={{ style: { textAlign: 'center' }, inputMode: 'numeric' }}
			/>
		)
	}
)

<ReactOtp length={6} value={code} onChange={setCode} slots={{ Input: MuiInputWrapper }} />
```

Important: the `Input` you pass must accept the usual input props and allow focus management via a forwarded `ref`. If a UI library does not forward refs, wrap it and map `ref` to the library's inputRef prop (as shown for MUI).

## Accessibility

- Each input receives an `aria-label` in the format `OTP input {index + 1} of {length}` by default. You can replace inputs via slots and provide your own accessible labels if you prefer.
- `autoComplete="off"` is set on inputs to avoid unwanted autofill. If you need browser or SMS autofill support, consider adding `autoComplete="one-time-code"` on the first input in a custom `Input` slot.
- Use `inputMode="numeric"` or `type="tel"` on Numeric OTP inputs inside your custom slot to hint numeric keyboards.

## Behavior details & edge cases

- Controlled component: supply `value` and update it in `onChange`. The component maintains an internal `code` state synced from `value` prop.
- On input: the component replaces the character at the input index, calls `onChange` with the new concatenated value and advances focus to the next input.
- Backspace: pressing Backspace clears the current index, calls `onChange`, and moves focus to the previous input (if any).
- Paste: pasting into any input will populate from that input onward; pasted text is truncated to `length`.

Common edge-cases:

- If `value` is undefined at mount, a development-mode console warning is printed (component expects a controlled `value`).
- If you pass an `Input` that doesn't forward `ref` or accept `onChange`/`value`, the focus and typing behavior will break — wrap the library component and ensure it maps/forwards the necessary props.

## Dos and Don'ts

Dos:

- Do use the slots API to keep visual consistency with the rest of your UI library.
- Do pass a controlled `value` and implement `onChange` in the parent.
- Do forward refs when wrapping library inputs so focus is handled correctly.

Don'ts:

- Don't try to control individual digits from outside — the parent should manage the entire concatenated code string.
- Don't pass a non-ref-forwarding component as `Input` without a wrapper that maps `ref`.
- Don't set `type="number"` on inputs — use `inputMode` or `type="tel"` for numeric input hints.

## Troubleshooting

- Inputs not focusing or typing: ensure your `Input` slot forwards the `ref` to the actual <input> element.
- Paste not populating correctly: confirm you didn't alter the `onPaste` prop in your custom Input and that the component received clipboard data.
- Styling conflicts: prefer wrapping with a custom `Container` or a wrapper `Input` to apply your library's styles.

## Testing suggestions

- Unit tests to cover: controlled updates, paste behavior, backspace navigation and focus movement, onChange called with expected concatenated value.

## Contributing

PRs welcome — open an issue or PR if you want features such as masked inputs, animation, autofocus control per-input, or improved autofill handling.

## License

Choose and add your license here (e.g. MIT).
