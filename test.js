const scan = ["https://anime-sama.fr/catalogue/a-couple-of-cuckoos/scan/vf/episodes.js", "A Couple Of Cuckoos"];

fetch(scan[0])
.then((response) => {
	if (!response.ok)
		throw new Error('Network response was not ok');
	return (response.text());
})
.then((text) => {

	// text = '{' + text + '}';
	// text = text.replaceAll('var ', '"');
	// text = text.replaceAll('= ', '":'); 
	// text = text.replaceAll('];', '],');
	// text = text.replaceAll("'", '"');
	// text = text.replaceAll('],\n\n', '],');
	// text = text.replaceAll(',}', '}');
	text = newMethodScans(text);
	// for (let i = 0; i < text.length; i++)
	// {
	// 	if (text[i] === ',')
	// 	{
	// 		if ((text[i + 1] === '\n' && text[i + 2] === ']') || text[i + 1] === ']')
	// 			text = text.slice(0, i) + text.slice(i + 2);
	// 	}
	// }
	// let parsed = JSON.parse(text);
	// setScanData(parsed);
	// setNbChapter(Object.keys(parsed).length);
})
.catch((error) => console.warn('Erreur lors du fetch:', error));




