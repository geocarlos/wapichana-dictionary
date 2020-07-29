export const getLetter = key => {
	if ((key[0].toLowerCase() === 'c' || key[0].toLowerCase() === 'n') && key[1].toLowerCase() === 'h') {
		return key.substring(0, 2).toUpperCase();
	}
	if (/\W/.test(key[0])) {
		return key[1].toUpperCase();
	}
	return key[0].toUpperCase();
}