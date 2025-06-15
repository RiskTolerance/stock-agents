import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
dayjs.extend(utc);

const NEWS_API_KEY = process.env.NEWS_API_KEY;
const NEWS_BASE_URL = 'https://gnews.io/api/v4/search';

export interface GNewsOptions {
  lang?: string;
  country?: string;
  max?: number;
  in?: string;
  from?: string;
  to?: string;
  sortby?: 'publishedAt' | 'relevance';
}

export async function fetchGNews(query: string, options: GNewsOptions = {}): Promise<any> {
  const params = new URLSearchParams({
    q: query,
    lang: options.lang || 'en',
    country: options.country || 'us',
    max: String(options.max || 10),
    in: options.in || 'title,description',
    from: options.from || dayjs().subtract(3, 'week').utc().format('YYYY-MM-DDTHH:mm:ss[Z]'),
    to: options.to || dayjs().utc().format('YYYY-MM-DDTHH:mm:ss[Z]'),
    sortby: options.sortby || 'relevance',
    apikey: NEWS_API_KEY || '',
  });
  const url = `${NEWS_BASE_URL}?${params.toString()}`;
  console.log('GNews URL:', url);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`GNews API error: ${response.status} ${response.statusText}`);
  }
  const news = await response.json();
  return news;
}
