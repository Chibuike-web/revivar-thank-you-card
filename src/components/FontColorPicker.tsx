import { colorOptions } from "../utils/data";
import type { FontColorPickerProps } from "../utils/types";

export default function FontColorPicker({ fontColor, setFontColor }: FontColorPickerProps) {
	return (
		<div className="flex flex-col gap-2">
			<h2>Choose your colour</h2>
			<select
				className="px-3 py-2 border border-gray-200 rounded-md focus-within:ring-2 focus-within:ring-blue-500 focus:outline-0"
				value={fontColor}
				onChange={(e) => setFontColor(e.target.value)}
			>
				{colorOptions.map((item) => (
					<option value={item.value} key={item.value}>
						{item.label}
					</option>
				))}
			</select>
		</div>
	);
}
