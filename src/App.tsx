import { useEffect, useRef, useState } from "react";
import type { UnsplashImage } from "./utils/types";
import { cn } from "./utils/cn";
import { useQuery } from "@tanstack/react-query";
import { fetchRandomImages } from "./api/fetchRandomImages";
import { useDebounce } from "./hooks/useDebounce";
import { searchImages } from "./api/searchImages";
import { toPng } from "html-to-image";
import FontColorPicker from "./components/FontColorPicker";
import { FontTypePicker } from "./components/FontTypePicker";

export default function App() {
	const [userName, setUserName] = useState("");
	const [fontType, setFontType] = useState("");
	const [fontColor, setFontColor] = useState("");
	const [searchItem, setSearchItem] = useState("");
	const [page, setPage] = useState(1);
	const [searchImage, setSearchImage] = useState("");
	const [isOpen, setIsOpen] = useState(false);
	const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

	const debouncedSearch = useDebounce(searchItem, 500);

	useEffect(() => {
		if (!searchItem) {
			setIsOpen(false);
		}
	}, [searchItem]);

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

	const cardRef = useRef<HTMLDivElement>(null);
	const downloadImage = async () => {
		if (cardRef.current) {
			const dataUrl = await toPng(cardRef.current);
			const link = document.createElement("a");
			link.href = dataUrl;
			link.download = "thank-you-card.png";
			link.click();
			setTimeout(() => {
				setUserName("");
				setFontColor("");
				setFontType("");
				setSelectedIndex(null);
				setSearchItem("");
			}, 300);
		}
	};

	if (isLoading) return <div className="grid place-items-center min-h-screen">Loading...</div>;

	if (error)
		return <div className="grid place-items-center min-h-screen">Error loading images</div>;

	return (
		<main className="flex flex-col w-full items-center justify-center min-h-screen p-6">
			<div className="w-full flex flex-col items-center gap-10">
				<h1 className="text-[48px] text-balance flex flex-col leading-[1.3em] w-full font-bold text-center">
					Personalized Thank You Card
				</h1>
				<div className="w-full flex flex-col gap-y-20 md:gap-x-10 md:flex-row">
					<div className="md:w-[40%]">
						<div className="flex flex-col gap-6">
							<div className="flex flex-col gap-2 relative">
								<h2>Search for image</h2>
								<input
									className="border border-gray-200 w-full px-3 h-10 rounded-md focus:outline-0 focus-within:ring-2 focus-within:ring-blue-500"
									placeholder="Search for image"
									type="search"
									value={searchItem}
									onChange={(e) => {
										setSearchItem(e.target.value);
										setIsOpen(true);
									}}
								/>

								{isOpen && (
									<div className="absolute left-0 right-0 top-20 bg-white border border-gray-200 rounded-md shadow-lg p-4 max-h-100 overflow-y-scroll z-100">
										{isFetching && <p>Loading...</p>}
										{isError && <p>Error fetching images</p>}

										{!isFetching && !isError && searchData?.results?.length > 0 && (
											<div className="flex flex-col gap-4">
												<div className="grid grid-cols-[repeat(auto-fill,minmax(60px,1fr))] gap-4">
													{searchData.results.map((img: UnsplashImage) => (
														<button
															key={img.id}
															onClick={() => {
																setSearchImage(img.urls.small);
																setIsOpen(false);
																setSelectedIndex(null);
															}}
															className="focus:outline-none"
														>
															<img
																src={img.urls.small}
																alt={img.alt_description || "Unsplash image"}
																className="w-full h-full object-cover cursor-pointer rounded"
															/>
														</button>
													))}
												</div>
												<div className="flex justify-between items-center mt-4">
													<button
														className="px-3 py-1 bg-gray-200 font-medium rounded disabled:opacity-50 cursor-pointer hover:opacity-50"
														onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
														disabled={page === 1}
													>
														Previous
													</button>
													<span className="font-semibold">Page {page}</span>
													<button
														className="px-3 py-1 bg-blue-500 text-white font-medium rounded disabled:opacity-50 cursor-pointer hover:opacity-50"
														onClick={() => setPage((prev) => prev + 1)}
														disabled={searchData?.total_pages && page >= searchData.total_pages}
													>
														Next
													</button>
												</div>
											</div>
										)}
									</div>
								)}
							</div>
							<div className="flex flex-col gap-2">
								<h2>Select image</h2>
								<div className="flex w-full justify-between gap-x-2 xl:gap-x-8">
									{images.map((img, i) => (
										<button
											key={img.id}
											onClick={() => {
												setSelectedIndex(i);
												setSearchImage("");
												setSearchItem("");
											}}
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
							<FontTypePicker fontType={fontType} setFontType={setFontType} />
							<FontColorPicker fontColor={fontColor} setFontColor={setFontColor} />
						</div>
						<button
							className="w-full inline-block h-10 mt-10 rounded-sm bg-blue-500 focus-within:border-2 focus-within:border-white outline-0 text-white focus-within:ring-2 focus-within:ring-blue-500 hover:opacity-50 cursor-pointer"
							onClick={downloadImage}
						>
							Download
						</button>
					</div>

					{(searchImage || typeof selectedIndex === "number") && (
						<div className="md:w-[60%] aspect-4/5 overflow-hidden relative" ref={cardRef}>
							<img
								src={
									searchImage ||
									(typeof selectedIndex === "number" ? images[selectedIndex]?.urls.small : "")
								}
								alt="Selected"
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
					)}
				</div>
			</div>
		</main>
	);
}
