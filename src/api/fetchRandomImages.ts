export async function fetchRandomImages() {
	const res = await fetch("https://api.unsplash.com/photos/random?count=4", {
		method: "GET",
		headers: {
			Authorization: `Client-ID ${import.meta.env.VITE_UNSPLASH_ACCESS_KEY}`,
		},
	});
	if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
	return res.json();
}
