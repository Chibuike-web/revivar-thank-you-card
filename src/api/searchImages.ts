export async function searchImages(query: string, page: number) {
	const res = await fetch(
		`https://api.unsplash.com/search/photos?query=${query}&page=${page}&per_page=10`,
		{
			method: "GET",
			headers: {
				Authorization: `Client-ID ${import.meta.env.VITE_UNSPLASH_ACCESS_KEY}`,
			},
		}
	);
	return res.json();
}
