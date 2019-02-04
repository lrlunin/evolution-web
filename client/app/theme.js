import {createMuiTheme} from "@material-ui/core";

import primary from '@material-ui/core/colors/green';
import secondary from '@material-ui/core/colors/amber';

const theme = createMuiTheme({
  style: {
    flex: {
      off: '0 0 auto'
    }
  }
  , palette: {
    primary: {
      light: primary[400]
      , main: primary[600]
      , dark: primary[800]
    },
    secondary: secondary
  }
  , typography: {
    useNextVariants: true
    , h1: {
      fontSize: '2.0em'
    }
    , h2: {
      fontSize: '1.8em'
    }
    , h3: {
      fontSize: '1.6em'
      , fontWeight: '400'
    }
    , h4: {
      fontSize: '1.4em'
      , fontWeight: '400'
    }
    , h5: {
      fontSize: '1.2em'
      , fontWeight: '500'
    }
    , h6: {
      fontSize: '1.1em'
      , fontWeight: '500'
    }
    , button: {
      lineHeight: 1.25
    }
  }
});

// theme.style = {
//   noFlex: {
//     flex: '0 0 auto'
//   }
// };

export default theme;