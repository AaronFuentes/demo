import React from "react";
import { Link } from "react-router-dom";

export default ({ to, children, id }) => (
	<Link
		to={to}
		id={id}
		style={{
			textDecoration: "none",
			color: "inherit"
		}}
	>
		{children}
	</Link>
);
