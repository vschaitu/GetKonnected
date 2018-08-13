import { container } from '../mainStyle.js';
import headerLinksStyle from './headerLinksStyle.jsx';


const appAuthStyle = theme => ({
    container: {
        ...container,
        maxWidth: "100%",
        zIndex: "2",
        position: "relative",
        color: "#FFFFFF"

    },
    ...headerLinksStyle(theme)
});

export default appAuthStyle;