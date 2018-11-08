import React from "react";
import Icon from "./Icon";

const ButtonIcon = ({ type, color, style, onClick }) => (
	<Icon
		className="material-icons"
		style={{
			color: color,
			fontSize: "1.1em",
			marginLeft: "0.3em",
			...style
		}}
		onClick={()=> {!!onClick && onClick()}}
	>
		{type}
	</Icon>
);

export default ButtonIcon;
