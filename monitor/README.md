# Monitor overview

This container is a pipeline which will "monitor" stocks and update the database with the results of each run. 

## Continuous monitoring workflow
This workflow watches for pending monitoring jobs and saves data that is needed for stock performance evaluation (anything included in stored time-series). It will also query for new news stories, insider trades, and house/senate trades. Information that is important for time-series computation or logging will be saved to the database. It will also check for new news stories or insider/house/senate trades and, if found, it will flag re-evaluation.

The primary workflow happens every minute for every stock:

1. Query time-series data -> save to db.
2. Re-calculate short-term technical indicators (momentum, momentum_3d) -> save to db.
3. Query news, insider/house/senate trading for new information (diff with current) -> save new results to db.
4. Save result, clear the queue, add a re-evaluation to the queue if necessary (new news/trading information, or technical indicator threshold/reversal).