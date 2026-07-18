export interface Env {
  APP_URL: string;
  CRON_SECRET: string;
}

export default {
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    const url = `${env.APP_URL}/api/cron`;

    console.log(`[cron] Triggered at ${new Date(event.scheduledTime).toISOString()}`);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${env.CRON_SECRET}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      console.error(`[cron] Failed with status ${response.status}:`, result);
      throw new Error(`Cron job failed: ${response.status}`);
    }

    console.log("[cron] Success:", result);
  },

  // Allow manual trigger via HTTP for testing
  async fetch(request: Request, env: Env): Promise<Response> {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
      return new Response("Unauthorized", { status: 401 });
    }

    const url = `${env.APP_URL}/api/cron`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${env.CRON_SECRET}`,
      },
    });

    const result = await response.text();
    return new Response(result, {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });
  },
};
