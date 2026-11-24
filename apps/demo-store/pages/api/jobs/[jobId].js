// In-memory job store for demo (resets on cold start — fine for founder demo)
const jobStore = new Map();

const PRODUCTS = {
  product_001: { name: "Black Oversized T-Shirt", color: "black", image: "/images/products/black-tshirt.jpg" },
  product_002: { name: "White Button-Down Shirt", color: "white", image: "/images/products/white-shirt.jpg" },
  product_003: { name: "Navy Striped T-Shirt", color: "navy", image: "/images/products/navy-tshirt.jpg" },
};

export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: { code: "METHOD_NOT_ALLOWED", message: "Only GET allowed" } });
  }

  const { jobId } = req.query;

  if (!jobId) {
    return res.status(400).json({ error: { code: "INVALID_JOB", message: "Job ID is required" } });
  }

  let job = jobStore.get(jobId);

  // Initialize job on first poll
  if (!job) {
    job = {
      job_id: jobId,
      status: "queued",
      progress_stage: null,
      result_url: null,
      error_code: null,
      message: "Job queued for virtual try-on generation.",
      created_at: new Date().toISOString(),
      demo: true,
    };
    jobStore.set(jobId, job);

    // Simulate progression: queued → processing → quality_checking → completed
    setTimeout(() => {
      job.status = "processing";
      job.progress_stage = "preprocessing";
      job.message = "Preparing your photograph and garment for try-on.";
      jobStore.set(jobId, job);
    }, 1500);

    setTimeout(() => {
      job.status = "quality_checking";
      job.progress_stage = "running_tryon";
      job.message = "Running virtual try-on model...";
      jobStore.set(jobId, job);
    }, 3000);

    setTimeout(() => {
      job.status = "completed";
      job.progress_stage = null;
      job.message = "Your try-on result is ready.";
      job.result_url = `/api/jobs/${jobId}/result`;
      jobStore.set(jobId, job);
    }, 4500);
  }

  res.status(200).json({
    job_id: job.job_id,
    status: job.status,
    progress_stage: job.progress_stage,
    result_url: job.result_url,
    error_code: job.error_code,
    message: job.message,
    demo: true,
    note: "Demo mode: job progression simulated. Production uses Celery background worker with real AI inference.",
  });
}

export const config = { api: { bodyParser: false } };