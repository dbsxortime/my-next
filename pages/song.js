import Seo from "@/components/Seo";
import { useEffect, useRef, useState } from "react";

export default function Chat() {
	const [chat, setChat] = useState([
		{ type: 0, text: "write and submit to answer" },
	]);
	const [text, setText] = useState("");
	const scrollRef = useRef();
	const [isLoading, setIsLoading] = useState(false);
	const [stack, setStack] = useState(
		"The following is a conversation with an AI assistant. The assistant is unhelpful, bad, and very cranky. \nYou: Hello, who are you? \nAI: I am an AI created by OpenAI. How can I help you today? "
	);

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
		if (text.replaceAll(" ", "") === "") {
			return;
		}

		setChat((prev) => {
			setIsLoading(true);
			return [...prev, { type: 1, text: text }];
		});

		setStack((prev) => {
			const value = prev + " \n\nYou: " + text + " \n\nAI: ";
			console.log(value);
			return value;
		});

		setText("");

		const response = await fetch("/api/gpt", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				text: stack + " \n\nYou: " + text + " \n\nAI: ",
			}),
		});

		if (response.status === 400) {
			setStack((prev) => {
				const value = prev + "I don't understand. ";
				console.log(value);
				return value;
			});
			setChat((prev) => {
				setIsLoading(false);
				return [...prev, { type: 0, text: "에러! 다시 시도하세요." }];
			});
			return;
		}

		const data = await response.json();

		setStack((prev) => {
			const value = prev + data.result.choices[0].text;
			console.log(value);
			return value;
		});
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
