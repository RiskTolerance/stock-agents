# Orchestrator overview

This container has the following responsiblities:

1. System startup. When the system first runs, or a stock sells and there are avalible liquid funds, this container will: 
   - query for stocks that meet specific criteria (filter against any previously held stocks within a specified date range). 
   - For each stock returned, a moitoring job will be queued to establish technical indicators. 
   - On completion of all monitoring jobs, the results will be queued for evaluation.
   - On completion of all evaluation jobs, the top x number of results will queued for purchase based on highest evaluation score (how the ratio of stock purchase is determined is yet to be decided). 

2. Queue monitoring, evaluation. Buy or sell stocks 
   - If stocks are held, schedule a new job for each ticker every minute.
   - If a monitoring job found reason, queue a re-evaluation.
   - If a evaluation job found reason, sell or purchase a stock and update currently held stocks.
   - If there are liquid funds above a threshhold, queue step 1.