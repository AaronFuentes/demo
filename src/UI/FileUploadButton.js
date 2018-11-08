import React from "react";
import { Button } from "material-ui";
import { CircularProgress } from "material-ui/Progress";

const FileUploadButton = ({
	onChange,
	image,
	text,
	accept,
	color,
	textStyle,
	textPosition,
	icon,
	buttonStyle,
	flat,
	loading,
	loadingColor = 'inherit',
	style
}) => (
	<React.Fragment>
		<input
			type="file"
			{...(image? { accept: "image/*"} : {})}
			{...(accept? { accept: accept} : {})}
			id={"raised-button-file"}
			onChange={onChange}
			{...(loading? { disabled: true } : {})}
			style={{
				cursor: "pointer",
				position: "absolute",
				top: 0,
				width: 0,
				bottom: 0,
				right: 0,
				left: 0,
				opacity: 0
			}}
		/>
		<label htmlFor="raised-button-file" style={style}>
			<Button
				variant={flat ? "flat" : "raised"}
				component="span"
				disableRipple={loading}
				disabled={loading}
				style={{
					...buttonStyle,
					...textStyle,
					backgroundColor: color
				}}
			>
				{text}
				{loading ? (
					<div
						style={{
							color: "white",
							marginLeft: "0.3em"
						}}
					>
						<CircularProgress size={12} color={loadingColor} />
					</div>
				) : (
					icon
				)}
			</Button>
		</label>
	</React.Fragment>
);

export default FileUploadButton;
