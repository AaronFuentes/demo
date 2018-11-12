import React from "react";
import Grid from "material-ui/Grid";

const GridItem = ({ children, lg, md, xs, style, onClick, className }) => (
	<Grid item xs={xs} md={md} lg={lg} style={style} onClick={onClick} className={className}>
		{children}
	</Grid>
);

export default GridItem;
