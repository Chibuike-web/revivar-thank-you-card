export type UnsplashImage = {
	id: string;
	alt_description: string | null;
	urls: {
		raw: string;
		full: string;
		regular: string;
		small: string;
		thumb: string;
	};
	user: {
		name: string;
		username: string;
	};
};
