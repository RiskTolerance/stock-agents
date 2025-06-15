
    import type { TextClassificationOutput, TextClassificationSingle } from '@xenova/transformers';
    import { pipeline } from '@xenova/transformers'
    import type { NewsArticle } from '../index'

    const classifySentiment = await pipeline(
      'sentiment-analysis',
      'mrm8488/distilroberta-finetuned-financial-news-sentiment-analysis'
    );

    const getSentiment = async (text: string[]) => {
      const result = await classifySentiment(text , { topk: undefined });
      console.log(result);
      return result;
    }

    export const sentimentAnalysis = async (news: NewsArticle[]) => {
      const sentimentAnalysis = news.map((newsItem: NewsArticle) => {
        // get the sentiment of the news article content
        return getSentiment(newsItem.content as string[]).then((sentiment) => {
          console.log("sentiment", sentiment);
          const sentimentResults = sentiment.map((item) => {
            console.log("sentiment results", item)
          });
          
          return {
            title: newsItem.title,
            description: newsItem.description,
            publishedAt: newsItem.publishedAt,
            content: newsItem.content,
            sentiment: sentiment,
          }
        });
      });
      return sentimentAnalysis;
    }