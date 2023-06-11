async function getMomentoToken({ resolveVariable }) {
  const authToken = await resolveVariable('ssm:/momento/cache/token, true');

  const base64 = authToken.replace(/-/g, '+').replace(/_/g, '/');
  return JSON.parse(Buffer.from(base64, 'base64').toString());
}

async function getMomentoUrl(params) {
  const token = await getMomentoToken(params);

  return `https://rest.cache.${token.endpoint}`;
}

async function getMomentoApiKey(params) {
  const token = await getMomentoToken(params);

  return token.api_key;
}

module.exports = {
  getMomentoUrl,
  getMomentoApiKey,
};
