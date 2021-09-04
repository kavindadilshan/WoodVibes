const PROD_URL_REMOTE = ``;
const DEV_URL_REMOTE = `http://d712-112-134-159-52.ngrok.io`;

export const asDev = true;

const conf = {
    serverUrl: !asDev ? PROD_URL_REMOTE : DEV_URL_REMOTE,
    basePath: !asDev ? `api/v1` : `wood-worker`,
    redirect: ``
};

export default conf;
