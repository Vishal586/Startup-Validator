import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchIdeas, deleteIdeaById } from "../services/api";
import styles from "./DashboardPage.module.css";

const RiskBadge = ({ level }) => {
    const cls = level === "Low" ? styles.low : level === "High" ? styles.high : styles.medium;
    return <span className={`${styles.badge} ${cls}`}>{level}</span>;
};

const ScoreRing = ({ score }) => {
    const color = score >= 70 ? "#34c98a" : score >= 40 ? "#f5a623" : "#f05454";
    return (
        <div className={styles.scoreRing} style={{ "--score-color": color }}>
            <span className={styles.scoreNum}>{score}</span>
            <span className={styles.scoreLabel}>/ 100</span>
        </div>
    );
};

export default function DashboardPage() {
    const [ideas, setIdeas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deletingId, setDeletingId] = useState(null);
    const navigate = useNavigate();

    const loadIdeas = async () => {
        try {
            const res = await fetchIdeas();
            setIdeas(res.data.data);
        } catch {
            setError("Failed to load ideas. Is the server running?");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadIdeas(); }, []);

    const handleDelete = async (e, id) => {
        e.preventDefault();
        e.stopPropagation();
        if (!window.confirm("Delete this idea? This cannot be undone.")) return;
        setDeletingId(id);
        try {
            await deleteIdeaById(id);
            setIdeas((prev) => prev.filter((i) => i._id !== id));
        } catch {
            alert("Failed to delete. Please try again.");
        } finally {
            setDeletingId(null);
        }
    };

    const formatDate = (d) =>
        new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

    const statusLabel = (s) => ({
        completed: "✓ Complete",
        analyzing: "⏳ Analyzing",
        failed: "✗ Failed",
        pending: "· Pending",
    }[s] || s);

    if (loading) {
        return (
            <div className={styles.center}>
                <div className={styles.loader} />
                <p>Loading your ideas...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.center}>
                <p className={styles.errorText}>{error}</p>
                <button className={styles.retryBtn} onClick={loadIdeas}>Retry</button>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Your Ideas</h1>
                    <p className={styles.sub}>{ideas.length} idea{ideas.length !== 1 ? "s" : ""} validated</p>
                </div>
                <Link to="/" className={styles.newBtn}>
                    <span>+</span> New Idea
                </Link>
            </div>

            {ideas.length === 0 ? (
                <div className={styles.empty}>
                    <div className={styles.emptyIcon}>◈</div>
                    <h2 className={styles.emptyTitle}>No ideas yet</h2>
                    <p className={styles.emptyDesc}>Submit your first startup idea to get an AI-powered validation report.</p>
                    <Link to="/" className={styles.emptyBtn}>Validate an Idea →</Link>
                </div>
            ) : (
                <div className={styles.grid}>
                    {ideas.map((idea, i) => (
                        <Link
                            key={idea._id}
                            to={`/ideas/${idea._id}`}
                            className={styles.card}
                            style={{ animationDelay: `${i * 0.06}s` }}
                        >
                            <div className={styles.cardTop}>
                                <div className={styles.cardMeta}>
                                    <span className={`${styles.statusChip} ${styles[idea.status]}`}>
                                        {statusLabel(idea.status)}
                                    </span>
                                    <span className={styles.date}>{formatDate(idea.createdAt)}</span>
                                </div>
                                <button
                                    className={styles.deleteBtn}
                                    onClick={(e) => handleDelete(e, idea._id)}
                                    disabled={deletingId === idea._id}
                                    title="Delete idea"
                                >
                                    {deletingId === idea._id ? "..." : "✕"}
                                </button>
                            </div>

                            <h3 className={styles.cardTitle}>{idea.title}</h3>
                            <p className={styles.cardDesc}>
                                {idea.description.length > 120
                                    ? idea.description.slice(0, 120) + "…"
                                    : idea.description}
                            </p>

                            {idea.status === "completed" && (
                                <div className={styles.cardFooter}>
                                    {idea.report?.risk_level && (
                                        <RiskBadge level={idea.report.risk_level} />
                                    )}
                                    {idea.report?.profitability_score != null && (
                                        <ScoreRing score={idea.report.profitability_score} />
                                    )}
                                    <span className={styles.viewLink}>View Report →</span>
                                </div>
                            )}

                            {idea.status === "analyzing" && (
                                <div className={styles.cardFooter}>
                                    <span className={styles.analyzingChip}>
                                        <span className={styles.miniSpinner} /> Generating report…
                                    </span>
                                </div>
                            )}

                            {idea.status === "failed" && (
                                <div className={styles.cardFooter}>
                                    <span className={styles.failedChip}>Analysis failed</span>
                                </div>
                            )}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}