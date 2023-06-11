import { util } from '@aws-appsync/utils';

export function request(ctx) {
  // generate a cache key
  const cacheKey = util.base64Encode(ctx.args.title.toLowerCase());

  return {
    method: 'GET',
    params: {
      query: {
        // momento token placeholder.
        // Will be replaced at deployment time with the actual token from SSM
        token: '#token#',
      },
    },
    resourcePath: `/cache/get/wikipedia/${cacheKey}`,
  };
}

export function response(ctx) {
  if (ctx.result.statusCode == 200) {
    if (ctx.result.body) {
      const value = JSON.parse(ctx.result.body);
      console.log('cache hit', { value });
      ctx.stash.cacheItem = value;
      return value;
    } else {
      console.log('cache miss');
    }
  } else {
    console.error('cache get failed', ctx.result);
  }
}
