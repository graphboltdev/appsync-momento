import { runtime, util } from '@aws-appsync/utils';

export function request(ctx) {
  if (ctx.stash.cacheItem) {
    // If we have a cache hit, we can return early
    runtime.earlyReturn(ctx.stash.cacheItem);
  }

  return {
    method: 'GET',
    params: {
      query: {
        action: 'query',
        format: 'json',
        prop: 'extracts',
        exintro: 'true',
        titles: ctx.args.title,
        explaintext: 'true',
        exsentences: 10,
      },
    },
    resourcePath: '/w/api.php',
  };
}

export function response(ctx) {
  if (ctx.result.statusCode == 200) {
    const body = JSON.parse(ctx.result.body);
    for (var key in body.query.pages) {
      if (
        body.query.pages[key].title.toLowerCase() ===
        ctx.args.title.toLowerCase()
      ) {
        return body.query.pages[key];
      }
    }
    util.error('Not Found');
  } else {
    util.error('Error');
  }
}
