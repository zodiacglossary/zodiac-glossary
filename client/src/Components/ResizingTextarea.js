import React from "react";

// The following derives the number of lines in the text by
// counting both newlines and lines that are longer than a given line width.
// CDC 09.12.2024
function getNumLines(text, lineWidth) {
	return text.split('\n').reduce((total, line) => total + Math.floor(line.length / lineWidth) + 1, 0);
}

function ResizingTextarea(props) {

	let numLines = getNumLines(props.value, props.characterWidth);	
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