import React from "react";
import { Icon } from "material-ui";

export default ({ className, children, style, onClick }) => (
	<Icon className={className} style={style} onClick={onClick}>
		{children}
	</Icon>
);
