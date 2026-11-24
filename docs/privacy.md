# Privacy — Trial Room V1

Customer photographs are temporary processing inputs, not permanent product data.

- Never permanently stored
- Never used for model training
- Never used for marketing or profiling
- Never shared with unrelated customers or merchants
- Never added to analytics or error-monitoring payloads
- Private S3-compatible buckets, server-side encryption, randomized object keys
- Short-lived signed URLs
- Session TTL: 30 minutes; max asset lifetime: 60 minutes
- Cleanup worker: every 5 minutes; explicit deletion on session close/expiry
- No image bytes in PostgreSQL, logs, or monitoring