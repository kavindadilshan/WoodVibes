const PROD_URL_REMOTE = ``;
const DEV_URL_REMOTE = `http://d662-61-245-171-81.ngrok.io`;

export const asDev = true;

const conf = {
    serverUrl: !asDev ? PROD_URL_REMOTE : DEV_URL_REMOTE,
    basePath: !asDev ? `api/v1` : `wood-worker`,
    redirect: ``
};

export default conf;
