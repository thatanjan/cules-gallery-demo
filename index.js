const parent = document.querySelector('.parent')
const input = document.getElementById('input')
const submitBtn = document.getElementById('submit')
let grid = document.querySelector('.grid')

const key = 'gpWLYxQhjlUWiFXdvXnToSn0J7j3kU9LJqrs44UXots'

var macyInstance = Macy({
	// See below for all available options.
	container: '.grid',
	breakAt: {
		1600: 5,
		1200: 4,
		900: 3,
		600: 2,
		400: 1,
	},
	margin: {
		x: 15,
		y: 15,
	},
})

const fixStartUpBug = () => {
	macyInstance.runOnImageLoad(function () {
		macyInstance.recalculate(true, true)
		var evt = document.createEvent('UIEvents')
		evt.initUIEvent('resize', true, false, window, 0)
		window.dispatchEvent(evt)
	}, true)
}

const addImagesInDom = images => {
	images.forEach(image => {
		let container = document.createElement('div')
		const img = document.createElement('img')

		img.src = image
		container.append(img)

		grid.append(container)
	})
}

const initializeImages = async () => {
	let { data: images } = await axios.get(
		`https://api.unsplash.com/photos/?client_id=${key}&per_page=50`
	)

	images = images.map(image => image.urls.regular)

	addImagesInDom(images)

	fixStartUpBug()
}

initializeImages()

const getImages = async query => {
	let {
		data: { results: images },
	} = await axios.get(
		`https://api.unsplash.com/search/photos/?client_id=${key}&query=${query}&per_page=50`
	)

	images = images.map(image => image.urls.regular)

	return images
}

const removeAllChild = parent => {
	while (parent.firstChild) {
		parent.removeChild(parent.firstChild)
	}
}

const handleSubmit = async event => {
	event.preventDefault()

	const query = input.value

	if (!query) return false

	const images = await getImages(query)

	removeAllChild(grid)

	addImagesInDom(images)

	fixStartUpBug()
}

submitBtn.addEventListener('click', handleSubmit)
