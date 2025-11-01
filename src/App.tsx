import { useState } from "react";
import type { UnsplashImage } from "./utils/types";
import { cn } from "./utils/cn";
import { useQuery } from "@tanstack/react-query";
import { fetchRandomImages } from "./api/fetchRandomImages";
import { useDebounce } from "./hooks/useDebounce";
import { searchImages } from "./api/searchImages";

export default function App() {
	const [userName, setUserName] = useState("");
	const [fontType, setFontType] = useState("");
	const [fontColor, setFontColor] = useState("");
	const [searchItem, setSearchItem] = useState("");
	const [page, setPage] = useState(1);
	const [currentPage, setCurrentPage] = useState<number | null>(null);

	const debouncedSearch = useDebounce(searchItem, 500);

	const {
		data: searchData = {},
		isFetching,
		isError,
	} = useQuery({
		queryKey: ["searchImages", debouncedSearch, page],
		queryFn: () => searchImages(debouncedSearch, page),
		enabled: !!debouncedSearch,
	});

	const {
		data: images = [],
		isLoading,
		error,
	} = useQuery<UnsplashImage[]>({
		queryKey: ["randomImages"],
		queryFn: fetchRandomImages,
		staleTime: 1000 * 60 * 60,
		gcTime: 1000 * 60 * 60,
	});

	const [selectedIndex, setSelectedIndex] = useState(0);

	if (isLoading) {
		return <div className="grid place-items-center min-h-screen">Loading...</div>;
	}

	if (error) {
		return <div className="grid place-items-center min-h-screen">Error loading images</div>;
	}

	return (
		<main className="flex flex-col w-full items-center justify-center min-h-screen p-6">
			<div className="w-full flex flex-col items-center gap-10">
				<h1 className="text-[36px] flex flex-col leading-[1.3em] w-full font-bold text-center">
					<span className="w-full block"> Personalized</span>
					<span className="w-full block">Thank You Card</span>
				</h1>
				<div className="w-full flex gap-10">
					<div className="w-[40%]">
						<div className="flex flex-col gap-6">
							<div className="flex flex-col gap-2 relative">
								<h2>Search for image</h2>
								<input
									className="border border-gray-200 w-full px-3 h-10 rounded-md focus:outline-0 focus-within:ring-2 focus-within:ring-blue-500"
									placeholder="Search for image"
									type="search"
									value={searchItem}
									onChange={(e) => setSearchItem(e.target.value)}
								/>
								<div className="grid grid-cols-[repeat(auto-fill,minmax(40px,1fr))] bg-red-500 p-4 z-100 gap-4 mt-4 absolute left-0 right-0 top-1/2 h-[250px]">
									{isFetching && <p>Loading...</p>}
									{isError && <p>Error fetching images</p>}
									{searchData?.results?.map((img) => (
										<img
											key={img.id}
											src={img.urls.small}
											alt={img.alt_description || "Unsplash image"}
											className="w-full h-48 object-cover cursor-pointer rounded"
											onClick={() => setSelectedIndex(img.id)}
										/>
									))}
								</div>
							</div>
							<div className="flex flex-col gap-2">
								<h2>Select image</h2>
								<div className="flex w-full justify-between gap-x-2 xl:gap-x-8">
									{images.map((img, i) => (
										<button
											key={img.id}
											onClick={() => setSelectedIndex(i)}
											className={cn(
												"aspect-square rounded-sm xl:rounded-2xl overflow-hidden cursor-pointer bg-blue-500 outline-0 focus-within:border-2 focus-within:border-white focus-within:ring-2 focus-within:ring-blue-500",
												selectedIndex === i
													? "border-2 border-white ring-blue-500 ring-2"
													: "opacity-50"
											)}
										>
											<img
												src={img.urls.small}
												alt={img.alt_description || "Unsplash image"}
												className="w-full h-full object-cover"
											/>
										</button>
									))}
								</div>
							</div>
							<div className="flex flex-col gap-2">
								<h2>Enter your name</h2>
								<input
									className="border border-gray-200 w-full px-3 h-10 rounded-md focus:outline-0 focus-within:ring-2 focus-within:ring-blue-500"
									placeholder="Enter your name"
									type="text"
									value={userName}
									onChange={(e) => setUserName(e.target.value)}
								/>
							</div>
							<div className="flex flex-col gap-2">
								<h2>Choose your font</h2>
								<select
									className="px-3 py-2 border border-gray-200 rounded-md focus-within:ring-2 focus-within:ring-blue-500 focus:outline-0"
									value={fontType}
									onChange={(e) => setFontType(e.target.value)}
								>
									{["Inter", "Poppins", "Arial", "Times New Roman"].map((item) => (
										<option value={item} key={item}>
											{item}
										</option>
									))}
								</select>
							</div>
							<div className="flex flex-col gap-2">
								<h2>Choose your colour</h2>
								<select
									className="px-3 py-2 border border-gray-200 rounded-md focus-within:ring-2 focus-within:ring-blue-500 focus:outline-0"
									value={fontColor}
									onChange={(e) => setFontColor(e.target.value)}
								>
									{["red", "green", "purple", "white"].map((item) => (
										<option value={item} key={item}>
											{item.charAt(0).toUpperCase() + item.slice(1)}
										</option>
									))}
								</select>
							</div>
						</div>
						<button className="w-full inline-block h-10 mt-10 rounded-sm bg-blue-500 focus-within:border-2 focus-within:border-white outline-0 text-white focus-within:ring-2 focus-within:ring-blue-500">
							Download
						</button>
					</div>

					<div className="w-[60%] aspect-4/5 rounded-md md:rounded-2xl overflow-hidden relative">
						<img
							src={images[selectedIndex].urls.small}
							alt=""
							className="w-full h-full object-cover"
						/>
						<h2
							className="absolute text-white font-bold text-[40px] leading-[1.2em] text-center z-10 top-6 left-1/2 -translate-x-1/2 px-4 w-full max-w-[90%]"
							style={{ fontFamily: fontType, color: fontColor }}
						>
							Thank You
						</h2>

						<h2
							className="absolute text-white font-bold text-[40px] text-center z-10 bottom-6 left-1/2 -translate-x-1/2 px-4 w-full wrap-break-word max-w-[90%] leading-[1em]"
							style={{ fontFamily: fontType, color: fontColor }}
						>
							{userName}
						</h2>
					</div>
				</div>
			</div>
		</main>
	);
}
