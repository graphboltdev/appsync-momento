import { runtime, util } from '@aws-appsync/utils';

export function request(ctx) {
  if (ctx.stash.cacheItem) {
    // If we have a cache hit, we can return early
    runtime.earlyReturn(ctx.stash.cacheItem);
  }

  // generate a cache key
  const cacheKey = util.base64Encode(ctx.args.title.toLowerCase());

  return {
    method: 'POST',
    params: {
      query: {
        // one week cache
        ttl_milliseconds: 1000 * 60 * 60 * 24 * 7,
        // momento token placeholder.
        // Will be replaced at deployment time with the actual token from SSM
        token: '#token#',
      },
      body: ctx.prev.result,
    },
    resourcePath: `/cache/set/wikipedia/${cacheKey}`,
  };
}

export function response(ctx) {
  const body = JSON.parse(ctx.result.body);
  if (ctx.result.statusCode !== 200 || body.result !== 'OK') {
    console.error('cache put failed', ctx.result);
  } else {
    console.log('item save to cache');
  }

  return ctx.prev.result;
}
