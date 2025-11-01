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

export type ColorOption = {
	label: string;
	value: string;
};

export type FontColorPickerProps = {
	fontColor: string;
	setFontColor: (color: string) => void;
};

export type FontOption = {
	label: string;
	value: string;
};

export type FontTypePickerProps = {
	fontType: string;
	setFontType: (font: string) => void;
};
