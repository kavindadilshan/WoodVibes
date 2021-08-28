const PROD_URL_REMOTE = ``;
const DEV_URL_REMOTE = ``;

export const asDev = true;

const conf = {
    serverUrl: !asDev ? PROD_URL_REMOTE : DEV_URL_REMOTE,
    basePath: !asDev ? `/api/v1` : `/api/v1`,
    redirect: ``
};

export default conf;
