import colors from "windicss/colors";
import aspectRatio from "windicss/plugin/aspect-ratio";
import filters from "windicss/plugin/filters";
import forms from "windicss/plugin/forms";
import lineClamp from "windicss/plugin/line-clamp";
import scrollSnap from "windicss/plugin/scroll-snap";
import typography from "windicss/plugin/typography";

export default {
  darkMode: "class",
  plugins: [aspectRatio, filters, forms, lineClamp, scrollSnap, typography],
  theme: {
    extend: {
      colors: {
        primary: colors.blue,
        secondary: colors.coolGray,
        success: colors.green,
        info: colors.lightBlue,
        warning: colors.amber,
        danger: colors.red,
        dark: colors.coolGray,
        light: colors.coolGray,
      },
    },
  },
};
