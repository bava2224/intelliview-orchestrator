# Celery Task Timeouts & Soft Limits

## Overview

This project uses Celery task execution limits to prevent long-running or stuck tasks from blocking worker processes.

## Soft Time Limit

- Configuration: `task_soft_time_limit = 25 * 60`
- When the soft limit is exceeded, Celery raises a `SoftTimeLimitExceeded` exception.
- The exception is caught in `process_interview_session`, logged, and re-raised for proper task failure handling.

## Hard Time Limit

- Configuration: `task_time_limit = 30 * 60`
- If the task continues running after the hard time limit, Celery forcefully terminates the worker process.

## Logging

When a soft timeout occurs:

- A timeout message is logged using `logger.error()`.
- The `FAILURE_COUNT` metric is incremented with the label `soft_time_limit_exceeded`.
- The exception is re-raised to allow Celery to handle task failure correctly.

## Benefits

- Prevents workers from getting stuck indefinitely.
- Improves worker availability.
- Provides clear timeout logs for debugging.
- Ensures long-running tasks are handled safely.