import type { Config } from "tailwindcss";
import flowbite from "flowbite-react/tailwind";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    flowbite.content(),
  ],
  theme: {
    extend: {
      colors: {
        txt: "#E7F1E4",
        bg: "#00484c",
        myP: "#00af6b",
        myS: "#012351",
        ac: "#16869c",
      },
      backgroundImage: {
        "custom-gradient":
          "linear-gradient(110deg, rgba(0,72,76,1) 0%, rgba(0,72,76,1) 19%, rgba(0,175,107,1) 100%)",
      },
      boxShadow: {
        sm: "0px 7px 13px 2px rgb(38, 38, 38)",
        xs: "-0px 5px 10px 1px rgb(38, 38, 38)",
        xxs: "1px 4px 10px 1px rgb(38, 38, 38)",
        micro: "1px 1px 4px rgb(38, 38, 38)",
      },
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
      },
      screens: {
        xxs: "380px",
        xs: "480px",
        nav: "830px",
      },
      width: {
        "80%": "80%",
        "98%": "98%",
        "45%": "43%",
        "50vh": "35vw",
        "70vh": "85vw",
        "almost-screen": "99vw",
      },
    },
  },
  plugins: [flowbite.plugin()],
};

export default config;
