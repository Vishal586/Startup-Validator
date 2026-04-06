import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchIdeaById, deleteIdeaById } from "../services/api";
import styles from "./IdeaDetailPage.module.css";

const ScoreBar = ({ score }) => {
    const color = score >= 70 ? "#34c98a" : score >= 40 ? "#f5a623" : "#f05454";
    const label = score >= 70 ? "High Potential" : score >= 40 ? "Moderate Potential" : "Low Potential";
    return (
        <div className={styles.scoreBarWrapper}>
            <div className={styles.scoreBarHeader}>
                <span className={styles.scoreValue} style={{ color }}>{score}</span>
                <span className={styles.scoreOutOf}>/100</span>
                <span className={styles.scoreTag} style={{ color, background: `${color}18` }}>{label}</span>
            </div>
            <div className={styles.scoreBarTrack}>
                <div
                    className={styles.scoreBarFill}
                    style={{ width: `${score}%`, background: color }}
                />
            </div>
        </div>
    );
};

const RiskCard = ({ level }) => {
    const map = {
        Low: { color: "#34c98a", icon: "◎", desc: "Well-defined market with manageable execution challenges." },
        Medium: { color: "#f5a623", icon: "◑", desc: "Some market uncertainty or execution complexity to navigate." },
        High: { color: "#f05454", icon: "◉", desc: "Significant market, technical, or competitive risks present." },
    };
    const { color, icon, desc } = map[level] || map["Medium"];
    return (
        <div className={styles.riskCard} style={{ "--risk-color": color }}>
            <span className={styles.riskIcon}>{icon}</span>
            <div>
                <div className={styles.riskLevel}>{level} Risk</div>
                <div className={styles.riskDesc}>{desc}</div>
            </div>
        </div>
    );
};

const Section = ({ icon, title, children }) => (
    <div className={styles.section}>
        <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>{icon}</span>
            <h3 className={styles.sectionTitle}>{title}</h3>
        </div>
        <div className={styles.sectionBody}>{children}</div>
    </div>
);

export default function IdeaDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [idea, setIdea] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetchIdeaById(id);
                setIdea(res.data.data);
            } catch (err) {
                setError(err.response?.status === 404 ? "Idea not found." : "Failed to load report.");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    const handleDelete = async () => {
        if (!window.confirm("Permanently delete this idea?")) return;
        setDeleting(true);
        try {
            await deleteIdeaById(id);
            navigate("/dashboard");
        } catch {
            alert("Failed to delete. Please try again.");
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className={styles.center}>
                <div className={styles.loader} />
                <p>Loading report…</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.center}>
                <p className={styles.errorText}>{error}</p>
                <Link to="/dashboard" className={styles.backLink}>← Back to Dashboard</Link>
            </div>
        );
    }

    const { title, description, status, report, createdAt } = idea;
    const formatDate = (d) => new Date(d).toLocaleDateString("en-US", {
        weekday: "long", month: "long", day: "numeric", year: "numeric"
    });

    return (
        <div className={styles.page}>
            {/* Breadcrumb */}
            <div className={styles.breadcrumb}>
                <Link to="/" className={styles.breadLink}>Validate</Link>
                <span className={styles.breadSep}>›</span>
                <Link to="/dashboard" className={styles.breadLink}>Dashboard</Link>
                <span className={styles.breadSep}>›</span>
                <span className={styles.breadCurrent}>Report</span>
            </div>

            {/* Idea Header */}
            <div className={styles.ideaHeader}>
                <div className={styles.ideaHeaderLeft}>
                    <div className={styles.ideaMeta}>
                        <span className={styles.metaDate}>{formatDate(createdAt)}</span>
                        <span className={`${styles.statusPill} ${styles[status]}`}>
                            {status === "completed" ? "✓ Analysis Complete" :
                                status === "failed" ? "✗ Analysis Failed" : "⏳ Analyzing"}
                        </span>
                    </div>
                    <h1 className={styles.ideaTitle}>{title}</h1>
                    <p className={styles.ideaDesc}>{description}</p>
                </div>

                <button
                    className={styles.deleteBtn}
                    onClick={handleDelete}
                    disabled={deleting}
                >
                    {deleting ? "Deleting…" : "Delete Idea"}
                </button>
            </div>

            {/* Failed State */}
            {status === "failed" && (
                <div className={styles.failedBox}>
                    <h3>Analysis Failed</h3>
                    <p>The AI analysis could not be completed. This may be due to an API issue. Please try submitting a new idea.</p>
                    <Link to="/" className={styles.retryLink}>Try Again →</Link>
                </div>
            )}

            {/* Analyzing State */}
            {status === "analyzing" && (
                <div className={styles.analyzingBox}>
                    <div className={styles.bigSpinner} />
                    <h3>Analyzing Your Idea…</h3>
                    <p>Our AI is researching your market, mapping competitors, and calculating profitability. Refresh in a moment.</p>
                </div>
            )}

            {/* Completed Report */}
            {status === "completed" && report && (
                <div className={styles.report}>
                    {/* Top metrics */}
                    <div className={styles.metricsRow}>
                        <div className={styles.metricCard}>
                            <span className={styles.metricLabel}>Profitability Score</span>
                            <ScoreBar score={report.profitability_score} />
                        </div>
                        <div className={styles.metricCard}>
                            <span className={styles.metricLabel}>Risk Level</span>
                            <RiskCard level={report.risk_level} />
                        </div>
                    </div>

                    {/* Main sections */}
                    <div className={styles.sectionsGrid}>
                        <Section icon="⟐" title="Problem Statement">
                            <p>{report.problem}</p>
                        </Section>

                        <Section icon="◎" title="Customer Persona">
                            <p>{report.customer}</p>
                        </Section>

                        <Section icon="⊕" title="Market Overview">
                            <p>{report.market}</p>
                        </Section>

                        <Section icon="⊘" title="Competitors">
                            <div className={styles.competitorList}>
                                {report.competitors.map((c, i) => (
                                    <div key={i} className={styles.competitor}>
                                        <div className={styles.competitorHeader}>
                                            <span className={styles.competitorNum}>{String(i + 1).padStart(2, "0")}</span>
                                            <span className={styles.competitorName}>{c.name}</span>
                                        </div>
                                        <p className={styles.competitorDiff}>{c.differentiation}</p>
                                    </div>
                                ))}
                            </div>
                        </Section>

                        <Section icon="⌥" title="Recommended Tech Stack">
                            <div className={styles.techStack}>
                                {report.tech_stack.map((tech, i) => (
                                    <span key={i} className={styles.techChip}>{tech}</span>
                                ))}
                            </div>
                        </Section>

                        <Section icon="◈" title="Analyst Justification">
                            <p>{report.justification}</p>
                        </Section>
                    </div>

                    {/* Footer actions */}
                    <div className={styles.reportFooter}>
                        <Link to="/" className={styles.newIdeaBtn}>+ Validate Another Idea</Link>
                        <Link to="/dashboard" className={styles.dashboardBtn}>← Back to Dashboard</Link>
                    </div>
                </div>
            )}
        </div>
    );
}