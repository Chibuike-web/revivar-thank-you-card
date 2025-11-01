import { fontOptions } from "../utils/data";
import type { FontTypePickerProps } from "../utils/types";

export const FontTypePicker = ({ fontType, setFontType }: FontTypePickerProps) => (
	<div className="flex flex-col gap-2">
		<h2>Choose your font</h2>
		<select
			className="px-3 py-2 border border-gray-200 rounded-md focus-within:ring-2 focus-within:ring-blue-500 focus:outline-0"
			value={fontType}
			onChange={(e) => setFontType(e.target.value)}
		>
			{fontOptions.map((item) => (
				<option value={item.value} key={item.value}>
					{item.label}
				</option>
			))}
		</select>
	</div>
);
