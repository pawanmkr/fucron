# 🧠 @pawanmkr/fucron

**fucron** is a lightweight, in-memory timeout-based task handler designed for scenarios where short-lived locks or scheduled actions need to execute **once** after a delay — without relying on cron jobs or heavy queues.

> “This is not a job queue. This is not a scheduler. This is something new.”

---

## 💡 Why fucron?

In one of my backend systems, I needed to **lock** database rows while a virtual assistant was working on them, and then **automatically unlock them** after 10 minutes (or sooner if the session expired). Initially, I used a cron job that polled the database to unlock expired rows — but that felt inefficient and crude.

Then I realized: why not just use `setTimeout` to schedule the unlock when locking the row?

This idea grew into **fucron** — a simple API to manage these ephemeral tasks using native `setTimeout`, with visibility and control.

---

## 🚫 What fucron is NOT

- ❌ Not a job queue like `bull`, `bee-queue`, or `rabbitmq`.
- ❌ Not a recurring scheduler like `node-cron` or `agenda`.
- ❌ Not meant for persistent scheduling (state is lost on restart).

---

## ✅ What fucron IS

- ✅ A wrapper around `setTimeout` with task tracking.
- ✅ Best for short-lived in-memory tasks (e.g., unlocking, notifying, marking stale).
- ✅ Meant for **ephemeral** actions — especially where polling feels overkill.
- ✅ Simple API for scheduling, cancelling, and inspecting pending timeouts.

---

## 📦 Installation

```bash
npm install @pawanmkr/fucron
````

---

## 🚀 Usage

```ts
import { scheduler } from "@pawanmkr/fucron";

// Schedule a job to run after 5 seconds
const taskId = await scheduler.schedule(() => {
    console.log("Task executed after 5s");
}, 5000);

// Cancel it before execution
scheduler.unschedule(taskId);

// Check pending tasks
console.log("Pending:", scheduler.pending());
```

---

## 🔧 API Reference

### `scheduler.schedule(callback: Function, runInMs: number): Promise<number>`

Schedules a task to run after `runInMs` milliseconds.

* Returns a promise that resolves with a `taskId` when the job is scheduled.
* If the callback throws, the promise will reject.
* Automatically removes the task from internal tracking after execution.

---

### `scheduler.unschedule(taskId: number): void`

Cancels a pending task by its ID.

---

### `scheduler.pending(): number`

Returns the number of currently scheduled (but not yet executed) tasks.

---

### `scheduler.onExhausted(fn: Function): any`

Utility for triggering a function when needed (placeholder for future features).

---

## 🧪 Use Cases

* Unlocking database rows after a fixed time
* Temporary status changes (e.g., set to “active” for 30s)
* Scheduling non-critical time-delayed actions
* In-memory rate limiting or cooling-off logic

---

## ⚠️ Caveats

* State is in-memory only. All tasks are lost on process restart.
* Not suitable for long-term, durable scheduling (use cron/queues for that).
* Too many concurrent timers may cause memory pressure (depending on usage). Bettor memory management will be introduced in next release.

---

## 👨‍🔧 Author

Made with ❤️ by [@pawanmkr](https://github.com/pawanmkr)
