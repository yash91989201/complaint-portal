import { NhostProvider, NhostClient } from "@nhost/nextjs";
import type { AppProps } from "next/app";
import { NhostApolloProvider } from "@nhost/react-apollo";
import { NhostSession } from "@nhost/core";
import "@/styles/globals.css";
// custom components
import Layout from "@/components/shared/Layout";
// config constants
import { requestHeaders, NHOST_SUBDOMAIN, NHOST_REGION } from "@/config";
interface Props {
  nhostSession: NhostSession;
}

export default function MyApp({ Component, pageProps }: AppProps<Props>) {
  const nhost = new NhostClient({
    subdomain: NHOST_SUBDOMAIN,
    region: NHOST_REGION,
  });

  return (
    <NhostProvider nhost={nhost} initial={pageProps.nhostSession}>
      <NhostApolloProvider
        nhost={nhost}
        graphqlUrl={`https://${NHOST_SUBDOMAIN}.nhost.run/v1/graphql`}
        headers={requestHeaders}
      >
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </NhostApolloProvider>
    </NhostProvider>
  );
}
