import React from "react";
import Grid from "material-ui/Grid";

const GridWrapper = ({
	children,
	alignItems,
	alignContent,
	style,
	spacing = 8,
	justify,
	id,
	onKeyUp
}) => (
	<Grid
		id={id}
		container
		justify={justify}
		alignItems={alignItems}
		alignContent={alignContent}
		onKeyUp={onKeyUp}
		style={style}
		spacing={spacing}
	>
		{children}
	</Grid>
);

export default GridWrapper;
