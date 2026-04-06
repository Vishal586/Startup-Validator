import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { submitIdea } from "../services/api";
import styles from "./HomePage.module.css";

export default function HomePage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ title: "", description: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        if (error) setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.title.trim() || !form.description.trim()) {
            setError("Both title and description are required.");
            return;
        }
        if (form.description.trim().length < 20) {
            setError("Description should be at least 20 characters for a meaningful analysis.");
            return;
        }
        setLoading(true);
        setError("");
        try {
            const res = await submitIdea(form);
            navigate(`/ideas/${res.data.data._id}`);
        } catch (err) {
            setError(err.response?.data?.error || "Something went wrong. Please try again.");
            setLoading(false);
        }
    };

    const titleLen = form.title.length;
    const descLen = form.description.length;

    return (
        <div className={styles.page}>
            {/* Hero */}
            <section className={styles.hero}>
                <div className={styles.heroBadge}>
                    <span className={styles.dot} />
                    AI-Powered Analysis
                </div>
                <h1 className={styles.heroTitle}>
                    Turn your idea into
                    <br />
                    <span className={styles.heroGradient}>a validated roadmap</span>
                </h1>
                <p className={styles.heroSub}>
                    Submit your startup concept and receive an instant AI-generated report covering
                    market fit, competitors, risk assessment, and your path to profitability.
                </p>
                <div className={styles.heroStats}>
                    <div className={styles.stat}><span>8</span> Fields Analyzed</div>
                    <div className={styles.statDivider} />
                    <div className={styles.stat}><span>3</span> Competitors Mapped</div>
                    <div className={styles.statDivider} />
                    <div className={styles.stat}><span>~15s</span> Analysis Time</div>
                </div>
            </section>

            {/* Form */}
            <section className={styles.formSection}>
                <div className={styles.formCard}>
                    <div className={styles.formHeader}>
                        <h2 className={styles.formTitle}>Describe your idea</h2>
                        <p className={styles.formSub}>Be specific — the more context you provide, the better the analysis.</p>
                    </div>

                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.field}>
                            <div className={styles.labelRow}>
                                <label className={styles.label}>Startup Title</label>
                                <span className={`${styles.counter} ${titleLen > 180 ? styles.warn : ""}`}>
                                    {titleLen}/200
                                </span>
                            </div>
                            <input
                                type="text"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                placeholder="e.g. AI-powered legal document reviewer for SMBs"
                                className={styles.input}
                                maxLength={200}
                                disabled={loading}
                                autoFocus
                            />
                        </div>

                        <div className={styles.field}>
                            <div className={styles.labelRow}>
                                <label className={styles.label}>Idea Description</label>
                                <span className={`${styles.counter} ${descLen > 1800 ? styles.warn : ""}`}>
                                    {descLen}/2000
                                </span>
                            </div>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Describe the problem you're solving, your target audience, and how your solution works. The more detail you provide, the more accurate your analysis will be."
                                className={styles.textarea}
                                maxLength={2000}
                                rows={6}
                                disabled={loading}
                            />
                        </div>

                        {error && (
                            <div className={styles.errorBox}>
                                <span className={styles.errorIcon}>⚠</span>
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className={styles.submitBtn}
                            disabled={loading || !form.title.trim() || !form.description.trim()}
                        >
                            {loading ? (
                                <span className={styles.btnLoading}>
                                    <span className={styles.spinner} />
                                    Analyzing your idea...
                                </span>
                            ) : (
                                <span className={styles.btnContent}>
                                    <span>Validate My Idea</span>
                                    <span className={styles.btnArrow}>→</span>
                                </span>
                            )}
                        </button>

                        {loading && (
                            <p className={styles.loadingHint}>
                                Our AI is researching your market, mapping competitors, and generating your full report. This takes about 15–30 seconds.
                            </p>
                        )}
                    </form>
                </div>

                {/* How it works */}
                <div className={styles.steps}>
                    {[
                        { num: "01", title: "Submit", desc: "Describe your startup idea with as much context as possible." },
                        { num: "02", title: "Analyze", desc: "Our AI evaluates market, competitors, risk, and profitability." },
                        { num: "03", title: "Report", desc: "Receive a structured validation report you can act on." },
                    ].map((step) => (
                        <div key={step.num} className={styles.step}>
                            <span className={styles.stepNum}>{step.num}</span>
                            <div>
                                <h3 className={styles.stepTitle}>{step.title}</h3>
                                <p className={styles.stepDesc}>{step.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}