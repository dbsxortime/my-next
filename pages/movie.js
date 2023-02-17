import Seo from "@/components/Seo";
import { useRouter } from "next/router";

export default function Moive({ results }) {
	const router = useRouter();

	const onClick = (movie) => {
		router.push(`/movies/${movie.title}/${movie.id}`);
	};

	return (
		<div className="container">
			<Seo title="Movie" />
			{results?.map((movie) => (
				<div
					onClick={() => {
						onClick(movie);
					}}
					className="movie"
					key={movie.id}
				>
					<img
						src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
						alt={movie.original_title}
					/>
					<h4>{movie.original_title}</h4>
				</div>
			))}
			<style jsx>{`
				.container {
					display: grid;
					grid-template-columns: 1fr 1fr;
					padding: 20px;
					gap: 20px;
				}
				.movie img {
					max-width: 100%;
					border-radius: 12px;
					transition: transform 0.2s ease-in-out;
					box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
				}
				.movie:hover img {
					transform: scale(1.05) translateY(-10px);
				}
				.movie h4 {
					font-size: 18px;
					text-align: center;
				}
			`}</style>
		</div>
	);
}

export async function getServerSideProps() {
	const { results } = await (
		await fetch("http://0.0.0.0:3000/api/movies")
	).json();
	return {
		props: {
			results,
		},
	};
}
