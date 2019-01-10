import React from "react";
import {
	FormControl,
	InputAdornment,
	TextField
} from "material-ui";

const TextInput = ({
	floatingText = "",
	type,
	passwordToggler,
	showPassword,
	adornment,
	value,
	onChange,
	errorText,
	classes,
	onKeyUp,
	multiline = false,
	placeholder,
	required,
	min,
	helpPopover,
	helpTitle,
	onBlur,
	helpDescription,
	autoFocus,
	id,
	style,
	max,
	disabled
}) => (
	<FormControl
		style={{
			width: "100%",
			marginTop: 0
		}}
	>
		<TextField
			onBlur={onBlur}
			autoFocus={autoFocus}
			label={
				<div style={{display: 'flex'}}>
					{`${floatingText}${required ? "*" : ""}` }
				</div>
			}
			value={value}
			variant="outlined"
			multiline={multiline}
			style={{
				marginTop: 0,
				width: "100%",
				...style
			}}
			placeholder={placeholder}
			InputProps={{
				startAdornment: "",
				inputProps: {
					min: min,
					id: id,
					max: max,
					style: {
						fontSize: '15px'
					}
				},
				endAdornment: adornment ? (
					<InputAdornment position="end">
						{adornment}
					</InputAdornment>
				) : (
					""
				)
			}}
			FormHelperTextProps={{
				error: !!errorText,
				className: 'error-text'
			}}
			color="secondary"
			type={type}
			disabled={!!disabled}
			onKeyUp={onKeyUp}
			onChange={onChange}
			margin="normal"
			helperText={errorText}
			error={!!errorText}
		/>
	</FormControl>
);

export default TextInput;
