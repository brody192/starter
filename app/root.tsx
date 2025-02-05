import {
	ClientHints,
	ExternalScripts,
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	json,
	useEffect,
	useNavigation,
	useNonce,
	useRouteLoaderData,
	useTranslation,
} from "saaskitty/client";
import type { LoaderFunctionArgs, SerializeFrom } from "saaskitty/server";

export const handle = {
	i18n: ["common", "saaskitty"],
	scripts({ id, data, params, matches, location, parentsData }) {
		return [];
	},
} satisfies RouteHandle<SerializeFrom<typeof loader>>;

export async function loader({ context }: LoaderFunctionArgs) {
	const headers = new Headers();

	return json(
		{
			colorScheme: context.colorScheme,
			config: {
				appDesc: context.config.APP_DESCRIPTION,
				appEnv: context.config.APP_ENV,
				appName: context.config.APP_NAME,
				appVersion: context.config.APP_VERSION,
			},
			language: context.i18n.language,
			timezone: context.timezone,
		},
		{
			headers,
		},
	);
}

export function Layout({ children }: { children: React.ReactNode }) {
	const data = useRouteLoaderData<typeof loader>("root") || {
		colorScheme: "light",
		config: {},
		csrfToken: "",
		honeypotInputProps: {},
		language: "en",
		timezone: "UTC",
	};
	const navigation = useNavigation();
	const nonce = useNonce();
	const { i18n, t } = useTranslation(["common", "saaskitty"]);

	useEffect(() => {
		if (navigation.state === "loading") {
		} else {
		}
	}, [navigation.state]);

	useEffect(() => {
		i18n.changeLanguage(data.language);
	}, [data.language, i18n]);

	return (
		<html lang={data.language} dir={i18n.dir()}>
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
				<ClientHints nonce={nonce.script} />
				<script
					// biome-ignore lint/security/noDangerouslySetInnerHtml: for global config.
					dangerouslySetInnerHTML={{
						__html: `window.__config = ${JSON.stringify(data.config)}`,
					}}
					nonce={nonce.script}
				/>
			</head>

			<body>
				{children} {t("common:hello")} {t("saaskitty:errors.badRequest")}
				<ScrollRestoration nonce={nonce.script} />
				<Scripts nonce={nonce.script} />
				<ExternalScripts />
			</body>
		</html>
	);
}

export default function App() {
	return <Outlet />;
}
