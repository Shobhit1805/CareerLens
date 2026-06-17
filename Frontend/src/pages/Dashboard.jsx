import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  FileText,
  Download,
  Trophy,
  Target,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  Loader2,
} from "lucide-react";
import useAuth from "../hooks/useAuth";
import useAI from "../hooks/useAI";
import Navbar from "../components/shared/Navbar";
import ChatPanel from "../components/dashboard/ChatPanel";
import MatchScoreCard from "../components/dashboard/MatchScoreCard";
import SkillGapCard from "../components/dashboard/SkillGapCard";
import QuestionCard from "../components/dashboard/QuestionCard";
import StrengthCard from "../components/dashboard/StrengthCard";
import RoadmapCard from "../components/dashboard/RoadmapCard";
import PastAnalyses from "../components/dashboard/PastAnalyses";

const tabs = [
  { id: "skillGaps", label: "Skill Gaps", icon: AlertCircle },
  { id: "strengths", label: "Strengths", icon: CheckCircle2 },
  { id: "technical", label: "Technical", icon: FileText },
  { id: "behavioral", label: "Behavioral", icon: MessageSquare },
  { id: "roadmap", label: "30-Day Plan", icon: TrendingUp },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const {
    result,
    analyses,
    loading,
    error,
    analyzeResume,
    downloadResume,
    fetchAnalyses,
    loadAnalysis,
  } = useAI();

  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [activeTab, setActiveTab] = useState("skillGaps");
  const [showChat, setShowChat] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    fetchAnalyses();
  }, []);

  useEffect(() => {
    if (result) setActiveTab("skillGaps");
  }, [result]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resumeFile || !jobDescription) return;
    await analyzeResume(resumeFile, jobDescription);
    await fetchAnalyses();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") setResumeFile(file);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        user={user}
        result={result}
        showChat={showChat}
        setShowChat={setShowChat}
        onLogout={handleLogout}
      />

      <div className={`transition-all duration-300 ${showChat ? "mr-96" : ""}`}>
        <div className="max-w-7xl mx-auto px-6 py-8 flex gap-6">
          {/* Sidebar */}
          <div className="w-56 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sticky top-20">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Past Analyses
                </h3>
                <span className="text-xs text-gray-400">{analyses.length}</span>
              </div>
              <PastAnalyses
                analyses={analyses}
                onLoad={loadAnalysis}
                loading={loading}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0 space-y-6">
            {/* Upload Form */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm page-enter">
              <div className="p-5 border-b border-gray-50">
                <h1 className="text-lg font-bold text-gray-900">
                  Analyze Your Resume
                </h1>
                <p className="text-xs text-gray-400 mt-0.5">
                  Upload your resume and paste a job description to get
                  AI-powered insights
                </p>
              </div>

              <div className="p-5">
                {error && (
                  <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-5 text-sm">
                    <AlertCircle size={15} />
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* File Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Resume (PDF)
                      </label>
                      <div
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsDragging(true);
                        }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                        onClick={() =>
                          document.getElementById("resumeInput").click()
                        }
                        className={`relative border-2 border-dashed rounded-xl p-5 text-center transition-all cursor-pointer ${
                          isDragging
                            ? "border-black bg-gray-50"
                            : resumeFile
                              ? "border-green-300 bg-green-50"
                              : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <input
                          id="resumeInput"
                          type="file"
                          accept=".pdf"
                          className="hidden"
                          onChange={(e) => setResumeFile(e.target.files[0])}
                        />
                        {resumeFile ? (
                          <>
                            <CheckCircle2
                              size={22}
                              className="text-green-500 mx-auto mb-1.5"
                            />
                            <p className="text-sm font-medium text-green-700">
                              {resumeFile.name}
                            </p>
                            <p className="text-xs text-green-500 mt-0.5">
                              Click to change
                            </p>
                          </>
                        ) : (
                          <>
                            <Upload
                              size={22}
                              className="text-gray-400 mx-auto mb-1.5"
                            />
                            <p className="text-sm text-gray-600">
                              Drop PDF here or{" "}
                              <span className="text-black font-medium">
                                browse
                              </span>
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              Max 5MB
                            </p>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Job Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Job Description
                      </label>
                      <textarea
                        className="w-full h-36 px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all bg-white resize-none"
                        placeholder="Paste the job description here..."
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !resumeFile || !jobDescription}
                    className="w-full bg-black text-white py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />{" "}
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles size={16} /> Analyze Resume
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Results */}
            {result && (
              <div className="space-y-5 page-enter">
                {/* Match Score + Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <MatchScoreCard
                      score={result.matchScore}
                      summary={result.matchSummary}
                    />
                  </div>
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => downloadResume(result.atsResume)}
                      disabled={loading}
                      className="flex items-center justify-center gap-2 bg-black text-white px-4 py-3 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 flex-1"
                    >
                      <Download size={15} />
                      Download ATS Resume
                    </button>
                    <button
                      onClick={() => navigate("/interview")}
                      className="flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-3 rounded-xl text-sm font-medium hover:bg-gray-50 transition-all flex-1"
                    >
                      <Trophy size={15} />
                      Start Mock Interview
                    </button>
                  </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex overflow-x-auto border-b border-gray-100 px-2">
                    {tabs.map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`flex items-center gap-1.5 px-4 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${
                            activeTab === tab.id
                              ? "border-black text-black"
                              : "border-transparent text-gray-500 hover:text-gray-700"
                          }`}
                        >
                          <Icon size={14} />
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>

                  <div className="p-5">
                    {activeTab === "skillGaps" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {result.skillGaps?.map((gap, i) => (
                          <SkillGapCard key={i} gap={gap} />
                        ))}
                      </div>
                    )}
                    {activeTab === "strengths" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {result.strengths?.map((strength, i) => (
                          <StrengthCard key={i} strength={strength} />
                        ))}
                      </div>
                    )}
                    {activeTab === "technical" && (
                      <div className="space-y-3">
                        {result.technicalQuestions?.map((q, i) => (
                          <QuestionCard key={i} q={q} />
                        ))}
                      </div>
                    )}
                    {activeTab === "behavioral" && (
                      <div className="space-y-3">
                        {result.behavioralQuestions?.map((q, i) => (
                          <QuestionCard key={i} q={q} />
                        ))}
                      </div>
                    )}
                    {activeTab === "roadmap" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {result.thirtyDayRoadmap?.map((week, i) => (
                          <RoadmapCard key={i} week={week} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showChat && <ChatPanel onClose={() => setShowChat(false)} />}
    </div>
  );
};

export default Dashboard;
