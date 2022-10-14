import { DefaultTheme } from "styled-components";

const size = {
  small: "800px",
  medium: "1100px",
  large: "1700px",
}

export const theme: DefaultTheme = {
  red: "#E51013",
  black: {
    veryDark: "#141414",
    darker: "#181818",
    lighter: "#2F2F2F",
  },
  white: {
    lighter: "#fff",
    darker: "#e5e5e5",
  },
  small: `(max-width: ${size.small})`,
  medium: `(max-width: ${size.medium})`,
  large: `(max-width: ${size.large})`,
};