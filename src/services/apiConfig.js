const PROD_URL_REMOTE = ``;
const DEV_URL_REMOTE = `http://caac-2402-d000-a500-aaa8-645f-8c34-c4c6-c7d6.ngrok.io`;

export const asDev = true;

const conf = {
    serverUrl: !asDev ? PROD_URL_REMOTE : DEV_URL_REMOTE,
    basePath: !asDev ? `api/v1` : `wood-worker`,
    redirect: ``
};

export default conf;
