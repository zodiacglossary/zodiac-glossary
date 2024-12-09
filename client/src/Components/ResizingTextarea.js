import React from "react";

function ResizingTextarea(props) {

	// The following derives the number of lines in the text by
	// counting both newlines and lines that are longer than a given line width.
	// Ends up counting 1 extra line, so subtract 1 from total.
	// CDC 09.12.2024
	let numLines = props.value.split('\n').reduce((total, line) => total + Math.floor(line.length / props.characterWidth) + 1, 0);
	let height = Math.max(numLines, 4) * 1.3; // constant that approximates the text height

	return <textarea 
		style={{
			height: `${height}vw`,
			...props.style,
		}}
		className={props.className}
		id={props.id}
		placeholder={props.placeholder}
		value={props.value}
		onChange={e => props.onChange(e)}
	/>;
}

export default ResizingTextarea;