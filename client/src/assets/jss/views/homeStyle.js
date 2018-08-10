// home page styling

import { container } from '../mainStyle.js';
import headerLinksStyle from '../components/headerLinksStyle.jsx';


const homeStyle = theme => ({
    container: {
        ...container,
        maxWidth: "100%",
        zIndex: "2",
        position: "relative",
        color: "#FFFFFF"

    },
    ...headerLinksStyle(theme)
});

export default homeStyle;