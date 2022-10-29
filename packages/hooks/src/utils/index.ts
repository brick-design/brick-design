
export function css(el): CSSStyleDeclaration {
	const style = el && el.style;
	if (style) {
		let cssResult;
		if (getComputedStyle) {
			cssResult = getComputedStyle(el, '');
		} else if (el.currentStyle) {
			cssResult = el.currentStyle;
		}
		return cssResult;
	}
}

export function formatUnit(target: string | null) {
	return isNaN(Number.parseInt(target)) ? null : Number.parseInt(target);
}


