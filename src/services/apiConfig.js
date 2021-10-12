const PROD_URL_REMOTE = ``;
const DEV_URL_REMOTE = `http://18.216.175.49:8080`;

export const asDev = true;

const conf = {
    serverUrl: !asDev ? PROD_URL_REMOTE : DEV_URL_REMOTE,
    basePath: !asDev ? `api/v1` : `wood-worker`,
    redirect: ``
};

export default conf;
