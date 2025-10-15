import { ThemeConfig } from "antd";

export const theme: ThemeConfig = {
  token: {
    colorPrimary: "#00BCD4",
  },
  components: {
    Card: {
      bodyPaddingSM: 8,
      headerBg: "#f0f2f5",
    },
    Modal: {
      paddingContentVerticalSM: 2,
      paddingContentHorizontalSM: 2,
    },
  },
};
