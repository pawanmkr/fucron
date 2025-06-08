class Scheduler {
    private tracker = new Map<number, number>();

    schedule(callback: Function, runInMs: number): Promise<number> {
        return new Promise((resolve, reject) => {
            try {
                const tid = setTimeout(async () => {
                    try {
                        await callback();
                        resolve(tid);
                    } catch (err) {
                        reject(err);
                    } finally {
                        this.tracker.delete(tid);
                    }
                }, runInMs);

                this.tracker.set(tid, runInMs);
                resolve(tid);
            } catch (err) {
                reject(err);
            }
        });
    }

    unschedule(id: number) {
        const tid = this.tracker.get(id);
        if (tid) {
            clearTimeout(tid);
            this.tracker.delete(id);
        } else {
            console.info(`timeout with ${id} does not exists`);
        }
    }

    pending(): number {
        return this.tracker.size;
    }

    onExhausted(func: Function) {
        return func();
    }
}

export const scheduler = new Scheduler();
