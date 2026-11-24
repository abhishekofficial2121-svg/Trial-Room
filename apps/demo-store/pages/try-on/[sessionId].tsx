import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";

type Step = "consent" | "upload" | "validating" | "generating" | "result" | "error";

interface ValidationResponse {
  valid: boolean;
  category: string;
  workflow: string;
  checks: Record<string, boolean>;
  errors: string[];
  message: string;
}

interface JobStatus {
  job_id: string;
  status: string;
  progress_stage: string | null;
  result_url: string | null;
  error_code: string | null;
  message: string;
}

export default function TryOnFlow() {
  const router = useRouter();
  const { sessionId } = router.query as { sessionId: string };
  const [step, setStep] = useState<Step>("consent");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [validation, setValidation] = useState<ValidationResponse | null>(null);
  const [job, setJob] = useState<JobStatus | null>(null);
  const [pollInterval, setPollInterval] = useState<NodeJS.Timeout | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [adultConfirmed, setAdultConfirmed] = useState(false);

  useEffect(() => {
    return () => {
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [pollInterval]);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setError("Unsupported format. Please upload JPEG, PNG, or WebP.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("File too large. Maximum size is 10 MB.");
      return;
    }

    setUploadedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setError(null);
  };
  const handleUpload = async () => {
    if (!uploadedFile) return;

    setStep("validating");

    try {
      const uploadRes = await fetch(`/api/sessions/${sessionId}/upload`, {
        method: "POST",
      });
      await uploadRes.json();

      const validateRes = await fetch(`/api/sessions/${sessionId}/validate`, {
        method: "POST",
      });
      const validateData: ValidationResponse = await validateRes.json();
      setValidation(validateData);

      if (!validateData.valid) {
        setStep("error");
        setError(validateData.message || "Image validation failed.");
        return;
      }

      setStep("generating");
      startGeneration();
    } catch (err) {
      setStep("error");
      setError("Upload failed. Please try again.");
    }
  };

  const startGeneration = useCallback(async () => {
    try {
      const genRes = await fetch(`/api/sessions/${sessionId}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId }),
      });
      const genData = await genRes.json();

      if (!genData.job_id) {
        setStep("error");
        setError("Failed to start generation.");
        return;
      }

      setJob({
        job_id: genData.job_id,
        status: genData.status,
        progress_stage: null,
        result_url: null,
        error_code: null,
        message: genData.message,
      });

      const interval = setInterval(async () => {
        const statusRes = await fetch(`/api/jobs/${genData.job_id}`);
        const statusData: JobStatus = await statusRes.json();
        setJob(statusData);

        if (statusData.status === "completed") {
          if (pollInterval) clearInterval(pollInterval);
          setStep("result");
        } else if (statusData.status === "failed") {
          if (pollInterval) clearInterval(pollInterval);
          setStep("error");
          setError(statusData.error_code || "Generation failed.");
        }
      }, 1000);

      setPollInterval(interval);
    } catch (err) {
      setStep("error");
      setError("Generation failed. Please try again.");
    }
  }, [sessionId, pollInterval]);
  const handleChangePhoto = () => {
    setUploadedFile(null);
    setPreviewUrl(null);
    setValidation(null);
    setJob(null);
    setError(null);
    setStep("upload");
  };

  const handleTryAnother = () => {
    setUploadedFile(null);
    setPreviewUrl(null);
    setValidation(null);
    setJob(null);
    setError(null);
    setStep("consent");
    setAdultConfirmed(false);
  };

  const handleClose = () => {
    router.push("/");
  };

  if (step === "consent") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full border border-gray-200">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Trial Room</h1>
            <p className="text-gray-600 text-sm">Virtual Try-On Demo</p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-semibold text-amber-800 mb-2">⚠️ Adult Confirmation Required</h3>
            <p className="text-sm text-amber-700 mb-3">
              By continuing, you confirm you are 18 years or older and that this photograph
              contains only you (no minors). Your image is temporarily processed and deleted
              after your session expires.
            </p>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={adultConfirmed}
                onChange={(e) => setAdultConfirmed(e.target.checked)}
                className="mt-1 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">I confirm I am 18+ and this image contains only me</span>
            </label>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => setStep("upload")}
              disabled={!adultConfirmed}
              className={`w-full py-3 rounded-lg font-semibold transition ${
                adultConfirmed
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              Upload Photograph
            </button>
            <p className="text-xs text-gray-500 text-center">
              Supported: JPEG, PNG, WebP • Max 10 MB
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <button onClick={handleClose} className="text-gray-500 hover:text-gray-700 text-sm">
              Cancel & Return to Store
            </button>
          </div>
        </div>
      </div>
    );
  }
  if (step === "upload") {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <nav className="mb-6 flex items-center gap-2">
            <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
              ← Back
            </button>
            <span className="text-xs text-gray-400">/</span>
            <span className="text-xs font-medium text-gray-600">Upload</span>
          </nav>

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">See how this looks on you</h2>
            <p className="text-gray-600 mb-6">
              Upload a full-body photograph. One adult person only, front-facing or slightly
              angled. Face visibility is not required for clothing.
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700 text-sm">
                {error}
              </div>
            )}

            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
              <label className="cursor-pointer block">
                {previewUrl ? (
                  <>
                    <img src={previewUrl} alt="Preview" className="max-h-64 mx-auto rounded-lg mb-4 shadow" />
                    <p className="text-gray-600 text-sm mb-4">Selected photograph</p>
                    <button
                      onClick={handleUpload}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
                    >
                      Continue
                    </button>
                  </>
                ) : (
                  <>
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <p className="text-gray-600 text-sm mb-2">Click to upload photograph</p>
                    <p className="text-xs text-gray-400">JPEG, PNG, WebP • Max 10 MB</p>
                  </>
                )}
              </label>
            </div>

            <div className="mt-8 text-xs text-gray-400 text-center space-y-1">
              <p>• One adult person only</p>
              <p>• Full body visible (torso, arms, legs)</p>
              <p>• Face not required for clothing</p>
              <p>• Front-facing or slightly angled pose</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (step === "validating") {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin flex h-12 w-12 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-6"></div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Checking your image</h2>
          <p className="text-gray-600 mb-4">Validating photo quality and person visibility...</p>
          <div className="flex justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" style={{ animationDelay: "0.2s" }}></span>
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" style={{ animationDelay: "0.4s" }}></span>
          </div>
        </div>
      </div>
    );
  }
  if (step === "generating") {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <div className="text-center mb-8">
              <div className="animate-spin flex h-10 w-10 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4"></div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Creating your look...</h2>
              <p className="text-gray-600 text-sm">{job?.message || "Generating virtual try-on result..."}</p>
            </div>

            {job?.progress_stage && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <p className="text-xs font-medium text-gray-500 uppercase mb-2">Stage</p>
                <p className="text-sm text-gray-700">{job.progress_stage}</p>
              </div>
            )}

            <div className="text-xs text-gray-400 text-center">
              <p>This may take a moment. Please don't close this window.</p>
              <p className="mt-2">Demo mode: simulated generation (~5 seconds)</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (step === "result") {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <nav className="mb-6 flex items-center gap-2">
            <button onClick={handleChangePhoto} className="text-gray-400 hover:text-gray-600 text-sm">
              ← Change Photograph
            </button>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">Your Try-On Result</h3>
              <div className="aspect-[2/3] bg-white rounded-xl overflow-hidden border border-gray-200 shadow-inner">
                <img src={`/api/jobs/${job?.job_id || sessionId}/result`} alt="Try-on result" className="w-full h-full object-cover" />
              </div>
              <div className="mt-4 text-xs text-gray-400 text-center">
                AI-generated visualization • Front view • Demo mode
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">Product Reference</h3>
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400 text-xs">Garment</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Black Oversized T-Shirt</h4>
                    <p className="text-sm text-gray-500">T-Shirt • Black</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-sm font-semibold text-blue-800 mb-2">Important</h3>
                <p className="text-sm text-blue-700 mb-3">
                  This is an AI-generated visualization, not a guarantee of fit, sizing,
                  comfort, or physical appearance under all lighting conditions.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleChangePhoto}
                  className="w-full py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
                >
                  Change Photograph
                </button>
                <button
                  onClick={handleTryAnother}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                >
                  Try Another Product
                </button>
                <button
                  onClick={handleClose}
                  className="w-full py-3 text-gray-600 font-medium hover:text-gray-800 transition"
                >
                  Close Trial Room
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (step === "error") {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-6">{error || "An unexpected error occurred."}</p>
            <div className="space-y-3">
              <button
                onClick={handleChangePhoto}
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Try Again
              </button>
              <button
                onClick={handleClose}
                className="w-full py-3 text-gray-600 font-medium hover:text-gray-800 transition"
              >
                Return to Store
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}