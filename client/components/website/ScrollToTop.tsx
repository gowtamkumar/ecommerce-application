"use client";

import React, { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";

const ScrollToTop: React.FC = () => {
	const [isVisible, setIsVisible] = useState(false);

	const toggleVisibility = () => {
		if (window.scrollY > 600) {
			setIsVisible(true);
		} else {
			setIsVisible(false);
		}
	};

	// Scroll to top smoothly
	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	useEffect(() => {
		window.addEventListener("scroll", toggleVisibility);
		return () => {
			window.removeEventListener("scroll", toggleVisibility);
		};
	}, []);

	return (
		<>
			{isVisible && (
				<button
					onClick={scrollToTop}
					className="z-50 fixed cursor-pointer bottom-5 right-5 p-3 bg-gray-700 rounded-full shadow-lg hover:bg-gray-900 transition-all"
					aria-label="Scroll to top"
				>
					<FaArrowUp color="white" size={20} />
				</button>
			)}
		</>
	);
};

export default ScrollToTop;
