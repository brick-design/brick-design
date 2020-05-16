// cheap lodash replacements

/**
 * drop-in replacement for _.get
 * @param obj
 * @param location
 * @param defaultValue
 */
export function get<T>(obj: any, location: string, defaultValue: T): T {
	return location
		.split('.')
		.reduce((a, c) => (a && a[c] ? a[c] : defaultValue || obj), obj) as T
}

/**
 * drop-in replacement for _.without
 */
export function without<T>(items: T[], item: T) {
	return items.filter(i => i !== item)
}

/**
 * drop-in replacement for _.isString
 * @param input
 */
export function isString(input: any) {
	return typeof input === 'string'
}

/**
 * drop-in replacement for _.isString
 * @param input
 */
export function isObject(input: any) {
	return typeof input === 'object'
}

/**
 * repalcement for _.xor
 * @param itemsA
 * @param itemsB
 */
export function xor<T extends string | number>(itemsA: T[], itemsB: T[]): T[] {
	const map = new Map<T, number>()
	const insertItem = (item: T) =>
		map.set(item, map.has(item) ? map.get(item)! + 1 : 1)
	itemsA.forEach(insertItem)
	itemsB.forEach(insertItem)

	const result: T[] = []
	map.forEach((count, key) => {
		if (count === 1) {
			result.push(key)
		}
	})
	return result
}

/**
 * replacement for _.intersection
 * @param itemsA
 * @param itemsB
 */
export function intersection<T>(itemsA: T[], itemsB: T[]) {
	return itemsA.filter(t => itemsB.indexOf(t) > -1)
}


function is(x:any, y:any) {
	if (x === y) {
		return x !== 0 || y !== 0 || 1 / x === 1 / y
	} else {
		return x !== x && y !== y
	}
}

export  function shallowEqual(objA:any, objB:any) {
	if (is(objA, objB)) return true

	if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
		return false
	}
	const keysA = Object.keys(objA)
	const keysB = Object.keys(objB)

	if (keysA.length !== keysB.length) return false

	for (let key of keysA) {
		if (!Object.prototype.hasOwnProperty.call(objB, key) || !is(objA[key], objB[key])) {
			return false
		}
	}

	return true
}
