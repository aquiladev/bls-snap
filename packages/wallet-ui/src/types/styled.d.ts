/* eslint-disable import/no-unassigned-import */

import 'styled-components';

/**
 * styled-component default theme extension
 */
declare module 'styled-components' {
  /* eslint-disable @typescript-eslint/consistent-type-definitions */
  export interface DefaultTheme {
    fonts: Record<string, string>;
    fontSizes: Record<string, string>;
    breakpoints: string[];
    mediaQueries: Record<string, string>;
    radii: Record<string, string>;
    shadows: Record<string, string>;
    colors: Record<string, Record<string, string>>;
    palette: {
      grey: {
        black: string;
        grey1: string;
        grey2: string;
        grey3: string;
        grey4: string;
        white: string;
      };
      primary: {
        light: string;
        main: string;
        dark: string;
        contrastText: string;
      };
      secondary: {
        light: string;
        main: string;
        dark: string;
        contrastText: string;
      };
      error: {
        light: string;
        main: string;
        dark: string;
        contrastText: string;
      };
      warning: {
        light: string;
        main: string;
        dark: string;
        contrastText: string;
      };
      info: {
        light: string;
        main: string;
        dark: string;
        contrastText: string;
      };
      success: {
        light: string;
        main: string;
        dark: string;
        contrastText: string;
      };
    };
    spacing: {
      none: string;
      tiny: string;
      tiny2: string;
      small: string;
      base: string;
      medium: string;
      large: string;
      xLarge: string;
      xxLarge: string;
    };
    typography: {
      p1: {
        fontFamily: string;
        fontWeight: number;
        fontSize: string;
        lineHeight: string;
      };
      p2: {
        fontFamily: string;
        fontWeight: number;
        fontSize: string;
        lineHeight: string;
      };
      c1: {
        fontFamily: string;
        fontWeight: number;
        fontSize: string;
        lineHeight: string;
      };
      c2: {
        fontFamily: string;
        fontWeight: number;
        fontSize: string;
        lineHeight: string;
      };
      c3: {
        fontFamily: string;
        fontWeight: number;
        fontSize: string;
        lineHeight: string;
      };
      i1: {
        fontFamily: string;
        fontWeight: number;
        fontSize: string;
        lineHeight: string;
      };
      i2: {
        fontFamily: string;
        fontWeight: number;
        fontSize: string;
        lineHeight: string;
      };
      i3: {
        fontFamily: string;
        fontWeight: number;
        fontSize: string;
        lineHeight: string;
      };
      i4: {
        fontFamily: string;
        fontWeight: number;
        fontSize: string;
        lineHeight: string;
      };
      h1: {
        fontFamily: string;
        fontWeight: number;
        fontSize: string;
        lineHeight: string;
      };
      h2: {
        fontFamily: string;
        fontWeight: number;
        fontSize: string;
        lineHeight: string;
      };
      h3: {
        fontFamily: string;
        fontWeight: number;
        fontSize: string;
        lineHeight: string;
      };
      h4: {
        fontFamily: string;
        fontWeight: number;
        fontSize: string;
        lineHeight: string;
      };
      bold: {
        fontFamily: string;
        fontWeight: number;
      };
      regular: {
        fontFamily: string;
        fontWeight: number;
      };
    };
    shadow: {
      large: {
        boxShadow: string;
      };
      menuFixedTop: {
        boxShadow: string;
      };
      dropDown: {
        boxShadow: string;
      };
      toolTip: {
        boxShadow: string;
      };
      dividerBottom: {
        boxShadow: string;
      };
      dividerTop: {
        boxShadow: string;
      };
    };
    corner: {
      none: string;
      tiny: string;
      small: string;
      medium: string;
      large: string;
    };
    modal: {
      base: string;
      noPadding: string;
    };
  }
}
