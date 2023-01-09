import { createGlobalStyle, DefaultTheme } from 'styled-components';

const breakpoints = ['600px', '768px', '992px'];

/**
 * Common theme properties.
 */
export const theme = {
  fonts: {
    default:
      '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
    code: 'ui-monospace,Menlo,Monaco,"Cascadia Mono","Segoe UI Mono","Roboto Mono","Oxygen Mono","Ubuntu Monospace","Source Code Pro","Fira Mono","Droid Sans Mono","Courier New", monospace',
  },
  fontSizes: {
    heading: '5.2rem',
    mobileHeading: '3.6rem',
    title: '2.4rem',
    large: '2rem',
    text: '1.6rem',
    small: '1.4rem',
  },
  radii: {
    default: '24px',
    button: '8px',
  },
  breakpoints,
  mediaQueries: {
    small: `@media screen and (max-width: ${breakpoints[0]})`,
    medium: `@media screen and (min-width: ${breakpoints[1]})`,
    large: `@media screen and (min-width: ${breakpoints[2]})`,
  },
  shadows: {
    default: '0px 7px 42px rgba(0, 0, 0, 0.1)',
    button: '0px 0px 16.1786px rgba(0, 0, 0, 0.15);',
  },
  palette: {
    grey: {
      black: '#292A6C',
      grey1: '#7F80A4',
      grey2: '#A9AAC2',
      grey3: '#D4D4E1',
      grey4: '#F7F7F9',
      white: '#FFFFFF',
    },
    primary: {
      light: '#D4D4E2',
      main: '#292A6C',
      dark: '#212256',
      contrastText: '#FFFFFF',
    },
    secondary: {
      light: '#FFEAE8',
      main: '#FB4C43',
      dark: '#C93D36',
      contrastText: '#FFFFFF',
    },
    error: {
      light: '#FCF2F3',
      main: '#D73A49',
      dark: '#B92534',
      contrastText: '#FFFFFF',
    },
    warning: {
      light: '#FEF5EF',
      main: '#F66A0A',
      dark: '#C65507',
      contrastText: '#FFFFFF',
    },
    info: {
      light: '#EAF6FF',
      main: '#037DD6',
      dark: '#0260A4',
      contrastText: '#FFFFFF',
    },
    success: {
      light: '#CAF4D1',
      main: '#4CD964',
      dark: '#219E37',
      contrastText: '#FFFFFF',
    },
  },
  spacing: {
    none: '0px',
    tiny: '4px',
    tiny2: '8px',
    small: '16px',
    base: '24px',
    medium: '32px',
    large: '40px',
    xLarge: '48px',
    xxLarge: '64px',
  },
  typography: {
    p1: {
      fontFamily: 'Roboto Regular',
      fontWeight: 400,
      fontSize: '16px',
      lineHeight: '22.4px',
    },
    p2: {
      fontFamily: 'Roboto Regular',
      fontWeight: 400,
      fontSize: '14px',
      lineHeight: '19.6px',
    },
    c1: {
      fontFamily: 'Roboto Regular',
      fontWeight: 400,
      fontSize: '12px',
      lineHeight: '16.8px',
    },
    c2: {
      fontFamily: 'Roboto Regular',
      fontWeight: 400,
      fontSize: '10px',
      lineHeight: '14px',
    },
    c3: {
      fontFamily: 'Roboto Regular',
      fontWeight: 400,
      fontSize: '8px',
      lineHeight: '11.2px',
    },
    i1: {
      fontFamily: '"Font Awesome 5 Pro"',
      fontWeight: 400,
      fontSize: '12px',
      lineHeight: '16.8px',
    },
    i2: {
      fontFamily: '"Font Awesome 5 Pro"',
      fontWeight: 400,
      fontSize: '14px',
      lineHeight: '19.6px',
    },
    i3: {
      fontFamily: '"Font Awesome 5 Pro"',
      fontWeight: 400,
      fontSize: '16px',
      lineHeight: '22.4px',
    },
    i4: {
      fontFamily: '"Font Awesome 5 Pro"',
      fontWeight: 400,
      fontSize: '24px',
      lineHeight: '33.6px',
    },
    h1: {
      fontFamily: 'Roboto Bold',
      fontWeight: 700,
      fontSize: '40px',
      lineHeight: '56px',
    },
    h2: {
      fontFamily: 'Roboto Bold',
      fontWeight: 700,
      fontSize: '32px',
      lineHeight: '44.8px',
    },
    h3: {
      fontFamily: 'Roboto Bold',
      fontWeight: 700,
      fontSize: '24px',
      lineHeight: '33.6px',
    },
    h4: {
      fontFamily: 'Roboto Bold',
      fontWeight: 700,
      fontSize: '18px',
      lineHeight: '25.2px',
    },
    bold: {
      fontFamily: 'Roboto Bold',
      fontWeight: 700,
    },
    regular: {
      fontFamily: 'Roboto Regular',
      fontWeight: 400,
    },
  },
  shadow: {
    large: {
      boxShadow: '0px 50px 70px -20px rgba(106, 115, 125, 0.2)',
    },
    menuFixedTop: {
      boxShadow: '0px -4px 12px -8px rgba(0, 0, 0, 0.25)',
    },
    dropDown: {
      boxShadow: '0px 14px 24px -6px rgba(106, 115, 125, 0.2)',
    },
    toolTip: {
      boxShadow: '0px 6px 24px -6px rgba(106, 115, 125, 0.2)',
    },
    dividerBottom: {
      boxShadow: 'inset 0px -1px 0px #F2F4F6',
    },
    dividerTop: {
      boxShadow: 'inset 0px 1px 0px #F2F4F6;',
    },
  },
  corner: {
    none: '0px',
    tiny: '4px',
    small: '8px',
    medium: '16px',
    large: '24px',
  },
  modal: {
    base: '328px',
    noPadding: '376px',
  },
};

/**
 * Light theme color properties.
 */
export const light: DefaultTheme = {
  colors: {
    background: {
      default: '#FFFFFF',
      alternative: '#F2F4F6',
      inverse: '#141618',
    },
    icon: {
      default: '#141618',
      alternative: '#BBC0C5',
    },
    text: {
      default: '#24272A',
      muted: '#6A737D',
      alternative: '#535A61',
      inverse: '#FFFFFF',
    },
    border: {
      default: '#BBC0C5',
    },
    primary: {
      default: '#6F4CFF',
      inverse: '#FFFFFF',
    },
    card: {
      default: '#FFFFFF',
    },
    error: {
      default: '#d73a49',
      alternative: '#b92534',
      muted: '#d73a4919',
    },
  },
  ...theme,
};

/**
 * Dark theme color properties
 */
export const dark: DefaultTheme = {
  colors: {
    background: {
      default: '#24272A',
      alternative: '#141618',
      inverse: '#FFFFFF',
    },
    icon: {
      default: '#FFFFFF',
      alternative: '#BBC0C5',
    },
    text: {
      default: '#FFFFFF',
      muted: '#FFFFFF',
      alternative: '#D6D9DC',
      inverse: '#24272A',
    },
    border: {
      default: '#848C96',
    },
    primary: {
      default: '#6F4CFF',
      inverse: '#FFFFFF',
    },
    card: {
      default: '#141618',
    },
    error: {
      default: '#d73a49',
      alternative: '#b92534',
      muted: '#d73a4919',
    },
  },
  ...theme,
};

/**
 * Default style applied to the app.
 *
 * @param props - Styled Components props.
 * @returns Global style React component.
 */
export const GlobalStyle = createGlobalStyle`
  html {
    /* 62.5% of the base size of 16px = 10px.*/
    font-size: 62.5%;
  }

  body {
    background-color: ${(props) => props.theme.colors.background.default};
    color: ${(props) => props.theme.colors.text.default};
    font-family: ${(props) => props.theme.fonts.code};
    font-size: ${(props) => props.theme.fontSizes.text};
    margin: 0;
  }

  * {
    transition: background-color .1s linear;
  }

  h1, h2, h3, h4, h5, h6 {
    font-size: ${(props) => props.theme.fontSizes.heading};
    ${(props) => props.theme.mediaQueries.small} {
      font-size: ${(props) => props.theme.fontSizes.mobileHeading};
    }
  }

  code {
    background-color: ${(props) => props.theme.colors.background.alternative};
    padding: 1.2rem;
    font-weight: normal;
    font-size: ${(props) => props.theme.fontSizes.text};
  }

  button {
    font-size: ${(props) => props.theme.fontSizes.small};
    border-radius: ${(props) => props.theme.radii.button};
    background-color: ${(props) => props.theme.colors.background.inverse};
    color: ${(props) => props.theme.colors.text.inverse};
    border: 1px solid ${(props) => props.theme.colors.background.inverse};
    font-weight: bold;
    padding: 1rem;
    min-height: 4.2rem;
    cursor: pointer;
    transition: all .2s ease-in-out;

    &:hover {
      background-color: transparent;
      border: 1px solid ${(props) => props.theme.colors.background.inverse};
      color: ${(props) => props.theme.colors.text.default};
    }

    &:disabled,
    &[disabled] {
      border: 1px solid ${(props) => props.theme.colors.background.inverse};
      cursor: not-allowed;
    }

    &:disabled:hover,
    &[disabled]:hover {
      background-color: ${(props) => props.theme.colors.background.inverse};
      color: ${(props) => props.theme.colors.text.inverse};
      border: 1px solid ${(props) => props.theme.colors.background.inverse};
    }
  }
`;

export enum VariantOptions {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
}

export type Variant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'error'
  | 'warning'
  | 'info';
