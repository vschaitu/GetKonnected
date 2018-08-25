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

    gridplace : {
        ...container,
        height:"90%",
        width:"100%"
    },
    ...headerLinksStyle(theme)
});

export default homeStyle;