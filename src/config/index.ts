const NHOST_REGION = process.env.NEXT_PUBLIC_NHOST_REGION!;
const NHOST_SUBDOMAIN = process.env.NEXT_PUBLIC_NHOST_SUBDOMAIN!;
const XHasuraAdminSecret = process.env.NEXT_PUBLIC_X_HASURA_ADMIN_SCERET!;
const XHasuraRole = process.env.NEXT_PUBLIC_X_HASURA_ROLE!;

const requestHeaders = {
  "Access-Control-Allow-Origin": `https://${NHOST_SUBDOMAIN}.auth.${NHOST_REGION}.nhost.run/v1`,
  "content-type": "application/json",
  "x-hasura-admin-secret": XHasuraAdminSecret!,
  "x-hasura-role": XHasuraRole!,
};

export {
  requestHeaders,
  NHOST_REGION,
  NHOST_SUBDOMAIN,
  XHasuraAdminSecret,
  XHasuraRole,
};
