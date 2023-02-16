import Seo from "@/components/Seo";
import { useEffect, useRef, useState } from "react";

export default function Chat() {
	const [chat, setChat] = useState([
		{ type: 0, text: "write and submit to answer" },
	]);
	const [text, setText] = useState("");
	const scrollRef = useRef();
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		scrollRef.current.scrollIntoView({
			behavior: "smooth",
			block: "end",
			inline: "nearest",
		});
	}, [chat]);

	const inputHandler = (e) => {
		if (!isLoading) setText(e.target.value);
	};

	const handleOnKeyPress = (e) => {
		if (!isLoading && e.key === "Enter") {
			onButtonHandler();
		}
	};

	const onButtonHandler = async () => {
		if (text !== "")
			setChat((prev) => {
				setIsLoading(true);
				return [...prev, { type: 1, text: text }];
			});
		setText("");
		const response = await fetch("/api/gpt", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ text: text }),
		});

		const data = await response.json();

		setChat((prev) => {
			setIsLoading(false);
			return [...prev, { type: 0, text: data.result.choices[0].text }];
		});
	};

	return (
		<div className="container">
			<Seo title="Chat" />
			<div className="screen">
				{chat.map((text, idx) => {
					return (
						<div
							key={idx}
							className={`chat${text.type !== 0 ? " bot" : ""}`}
						>
							{text.text}
						</div>
					);
				})}
				<div ref={scrollRef} />
			</div>

			<div className="send">
				<input
					value={text}
					onChange={inputHandler}
					onKeyDown={handleOnKeyPress}
				/>
				<button onClick={onButtonHandler}>전송</button>
			</div>

			<style jsx>{`
				.screen {
					width: 320px;
					height: 500px;
					display: flex;
					justify-content: flex-start;
					align-items: center;
					flex-direction: column;
					margin: 50px auto;
					overflow: auto;
				}
				.chat {
					background: #c1cddf;
					padding: 8px;
					max-width: 200px;
					border-radius: 4px;
					margin-left: 10px;
					margin-right: auto;
					margin-top: 10px;
					word-break: break-word;
				}

				.bot {
					background: #b4cdb9;
					margin-left: auto;
					margin-right: 10px;
				}

				.send {
					width: 100%;
					height: 50px;
					border-collapse: collapse;
					display: flex;
					justify-content: center;
				}

				input {
					width: 55%;
					height: 48px;
					border: 1px solid #999;
					padding: 0;
					padding-left: 20px;
				}

				button {
					width: 15%;
					height: 50px;
					padding: 2px 3px;
					background-color: #fff;
					border: 1px solid #999;
				}
			`}</style>
		</div>
	);
}