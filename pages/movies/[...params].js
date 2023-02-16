import Seo from "@/components/Seo";
import { useRouter } from "next/router";

export default function Detail({ params }) {
	// const router = useRouter({ params });
	const [title, id] = params || [];

	return (
		<>
			<Seo title={title} />
			<h3>{title || "Loading... "}</h3>
		</>
	);
}

export async function getServerSideProps({ params: { params } }) {
	return {
		props: {
			params,
		},
	};
}
