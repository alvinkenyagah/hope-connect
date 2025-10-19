import React, { useState, useEffect, useCallback } from 'react';
import { Award, Feather, History, ChevronRight, BarChart, XCircle, CheckCircle, Clock } from 'lucide-react';

// Sample questions based on a common well-being scale (like PHQ-9 or GAD-7)
const ASSESSMENT_QUESTIONS = [
    { id: 1, text: "Little interest or pleasure in doing things" },
    { id: 2, text: "Feeling down, depressed, or hopeless" },
    { id: 3, text: "Trouble falling or staying asleep, or sleeping too much" },
    { id: 4, text: "Feeling tired or having little energy" },
    { id: 5, text: "Poor appetite or overeating" },
    { id: 6, text: "Feeling bad about yourself—or that you are a failure" },
    { id: 7, text: "Trouble concentrating on things, such as reading or watching TV" },
    { id: 8, text: "Moving or speaking so slowly that other people could have noticed" },
];

const ASSESSMENT_OPTIONS = [
    { value: 0, label: "Not at all" },
    { value: 1, label: "Several days" },
    { value: 2, label: "More than half the days" },
    { value: 3, label: "Nearly every day" },
];


const API_BASE_URL = 'https://hope-connect-server.onrender.com/api';

// Simple Component to display a loading state
const LoadingIndicator = () => (
    <div className="flex items-center justify-center p-8 text-blue-600">
        <svg className="animate-spin h-6 w-6 mr-3" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Loading Data...
    </div>
);


// -------------------------------------------------------------
// MAIN COMPONENT: Dashboard (Routing between views)
// -------------------------------------------------------------
export default function UserDashboard({ currentUser, authToken }) {
    // State to manage the user's session data
    // NOTE: In a real app, currentUser and authToken would come from your global auth context/store.
    // We are mocking a currentUser here for display purposes.
    const [mockUser, setMockUser] = useState(currentUser || { name: "Victim User", role: "victim" });
    const [token, setToken] = useState(authToken || "YOUR_AUTH_TOKEN_HERE"); 

    const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard', 'assessment', 'results'
    const [assessmentHistory, setAssessmentHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null); // Success/Error messages

    // -------------------------------------------------------------
    // Data Fetching Logic (History)
    // -------------------------------------------------------------
    const fetchAssessmentHistory = useCallback(async () => {
        if (!token) {
            setMessage({ type: 'error', text: "Authentication token missing." });
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/assessments`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();
            
            if (response.ok) {
                setAssessmentHistory(data);
            } else {
                setMessage({ type: 'error', text: data.message || "Failed to fetch assessment history." });
            }
        } catch (error) {
            setMessage({ type: 'error', text: "Network error while fetching history." });
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (token) {
            fetchAssessmentHistory();
        }
    }, [token, fetchAssessmentHistory]);


    // -------------------------------------------------------------
    // View Rendering based on currentView state
    // -------------------------------------------------------------
    const renderContent = () => {
        switch (currentView) {
            case 'assessment':
                return <SelfAssessmentForm 
                            token={token}
                            onSubmissionComplete={() => {
                                fetchAssessmentHistory();
                                setCurrentView('results');
                            }}
                            onCancel={() => setCurrentView('dashboard')}
                        />;
            case 'results':
                return <AssessmentHistory history={assessmentHistory} onBack={() => setCurrentView('dashboard')} />;
            case 'dashboard':
            default:
                return (
                    <VictimDashboard 
                        user={mockUser} 
                        latestAssessment={assessmentHistory[0]}
                        onStartAssessment={() => setCurrentView('assessment')}
                        onViewHistory={() => setCurrentView('results')}
                    />
                );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8 ">
            <div className="max-w-4xl mx-auto pt-9">
                {/* Header */}
                <header className="mb-8 border-b pb-4 pt-3">
                    <h1 className="text-3xl font-extrabold text-gray-900">
                        {mockUser.role === 'victim' ? "My Hope Connect Dashboard" : "Dashboard"}
                    </h1>
                    <p className="text-gray-600">Welcome back, <span className="font-semibold text-blue-600">{mockUser.name}</span>.</p>
                </header>

                {/* Status Message Display */}
                {message && (
                    <div className={`p-4 mb-6 rounded-xl shadow-md flex items-center ${message.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                        {message.type === 'error' ? <XCircle className="w-5 h-5 mr-3" /> : <CheckCircle className="w-5 h-5 mr-3" />}
                        <p>{message.text}</p>
                    </div>
                )}
                
                {loading ? <LoadingIndicator /> : renderContent()}
            </div>
        </div>
    );
}


// -------------------------------------------------------------
// SUB-COMPONENT: Victim Dashboard Landing
// -------------------------------------------------------------
const VictimDashboard = ({ user, latestAssessment, onStartAssessment, onViewHistory }) => {
    // Logic to determine readiness for new assessment (simple check: if latest is from today)
    const canTakeAssessment = !latestAssessment || (new Date(latestAssessment.dateTaken).toDateString() !== new Date().toDateString());
    
    // Simple interpretation of the score (0-24 total score)
    const getScoreInterpretation = (score) => {
        if (score === undefined || score === null) return "No assessment taken yet.";
        if (score >= 20) return { text: "Severe indication. Please connect with a counselor immediately.", color: "text-red-600" };
        if (score >= 10) return { text: "Moderate concern. Consider reaching out.", color: "text-yellow-600" };
        if (score >= 5) return { text: "Mild concern. Keep monitoring your well-being.", color: "text-blue-600" };
        return { text: "Minimal concern. Keep up the good work!", color: "text-green-600" };
    };

    const interpretation = getScoreInterpretation(latestAssessment?.score);

    return (
        <div className="space-y-8">
            {/* Quick Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 1. Self-Assessment Card */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition duration-300">
                    <div className="flex items-center space-x-4 mb-4">
                        <Feather className="w-8 h-8 text-purple-600 p-1.5 bg-purple-100 rounded-full" />
                        <h2 className="text-xl font-bold text-gray-800">Daily Well-being Check</h2>
                    </div>
                    <p className="text-gray-600 mb-4">
                        Take a quick, confidential assessment to track your progress and identify areas for support.
                    </p>
                    <button
                        onClick={onStartAssessment}
                        disabled={!canTakeAssessment}
                        className={`w-full py-3 rounded-xl font-semibold transition ${canTakeAssessment
                            ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                        {canTakeAssessment ? 'Start Assessment Now' : <><Clock className="inline w-5 h-5 mr-2"/> Ready Tomorrow</>}
                    </button>
                    {!canTakeAssessment && (
                        <p className="text-sm text-center text-gray-500 mt-2">You can take one assessment per day.</p>
                    )}
                </div>

                {/* 2. Assessment History Card */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition duration-300">
                    <div className="flex items-center space-x-4 mb-4">
                        <History className="w-8 h-8 text-green-600 p-1.5 bg-green-100 rounded-full" />
                        <h2 className="text-xl font-bold text-gray-800">Your Progress</h2>
                    </div>
                    {latestAssessment ? (
                        <>
                            <p className="text-gray-600 mb-2">
                                Last Score: <span className={`text-2xl font-extrabold ${interpretation.color}`}>{latestAssessment.score} / 24</span>
                            </p>
                            <p className={`text-sm mb-4 ${interpretation.color}`}>{interpretation.text}</p>
                            <button
                                onClick={onViewHistory}
                                className="w-full py-3 bg-gray-100 text-blue-600 rounded-xl font-semibold hover:bg-gray-200 transition flex items-center justify-center"
                            >
                                View Detailed History <ChevronRight className="w-5 h-5 ml-2" />
                            </button>
                        </>
                    ) : (
                        <>
                            <p className="text-gray-500 mb-4">No assessments recorded yet. Start your first check-in!</p>
                            <div className="w-full py-3 bg-gray-100 text-gray-500 rounded-xl text-center font-semibold cursor-default">
                                No History Available
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Placeholder for future features */}
            <h2 className="text-2xl font-bold text-gray-900 pt-4 border-t mt-8">Counselor & Scheduling</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FeaturePlaceholder icon={<Award className="w-6 h-6 text-orange-600" />} title="Connect with Counselor" description="Find and start a chat session." />
                <FeaturePlaceholder icon={<Clock className="w-6 h-6 text-blue-600" />} title="Schedule Appointment" description="Book a session with your counselor." />
                <FeaturePlaceholder icon={<BarChart className="w-6 h-6 text-purple-600" />} title="Personalized Insights" description="Deep analysis of your well-being trends." />
            </div>
        </div>
    );
};

const FeaturePlaceholder = ({ icon, title, description }) => (
    <div className="bg-white p-4 rounded-xl shadow-md text-center border border-dashed border-gray-300">
        <div className="mx-auto w-fit p-2 bg-gray-50 rounded-full mb-2">{icon}</div>
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
    </div>
);


// -------------------------------------------------------------
// SUB-COMPONENT: Assessment Quiz Form
// -------------------------------------------------------------
const SelfAssessmentForm = ({ token, onSubmissionComplete, onCancel }) => {
    const [answers, setAnswers] = useState(ASSESSMENT_QUESTIONS.map(q => ({
        questionIndex: q.id,
        value: null, // null means not answered
    })));
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleOptionChange = (qIndex, value) => {
        setAnswers(prev => prev.map(a =>
            a.questionIndex === qIndex ? { ...a, value: value } : a
        ));
        // Clear error when user starts interacting
        if (error) setError(null);
    };

    const calculateTotalScore = () => {
        return answers.reduce((sum, current) => sum + (current.value || 0), 0);
    };

    const isFormComplete = answers.every(a => a.value !== null);

    const handleSubmit = async () => {
        if (!isFormComplete) {
            setError("Please answer all questions before submitting.");
            return;
        }

        setIsLoading(true);
        setError(null);
        const totalScore = calculateTotalScore();

        const payload = {
            score: totalScore,
            answers: answers.map(a => ({ 
                questionIndex: a.questionIndex, 
                value: a.value 
            })),
        };

        try {
            const response = await fetch(`${API_BASE_URL}/assessments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            
            if (response.ok) {
                // Success!
                onSubmissionComplete();
            } else {
                // Handle daily limit or other server errors
                setError(data.message || "Submission failed. Please check server logs.");
            }
        } catch (err) {
            setError("Network error: Could not connect to the server.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-2xl border border-blue-200">
            <h2 className="text-2xl font-bold text-blue-700 mb-4 flex items-center">
                <Feather className="w-7 h-7 mr-2"/> Self-Assessment Questionnaire
            </h2>
            <p className="text-gray-600 mb-6 border-b pb-4">
                Please answer the following questions based on how often you have been bothered by these problems over the last two weeks.
            </p>

            {error && (
                <div className="p-3 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 flex items-center">
                    <XCircle className="w-5 h-5 mr-2" />
                    {error}
                </div>
            )}

            <div className="space-y-6">
                {ASSESSMENT_QUESTIONS.map((q) => (
                    <div key={q.id} className="p-4 bg-gray-50 rounded-xl shadow-sm">
                        <p className="font-semibold text-gray-800 mb-3">{q.id}. {q.text}</p>
                        <div className="flex flex-wrap gap-4 justify-between">
                            {ASSESSMENT_OPTIONS.map((option) => (
                                <label 
                                    key={option.value}
                                    className={`flex items-center p-3 text-sm rounded-lg cursor-pointer transition w-full sm:w-[calc(50%-8px)] lg:w-[calc(25%-12px)]
                                        ${answers.find(a => a.questionIndex === q.id)?.value === option.value 
                                            ? 'bg-blue-600 text-white shadow-md' 
                                            : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-400'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name={`q_${q.id}`}
                                        value={option.value}
                                        checked={answers.find(a => a.questionIndex === q.id)?.value === option.value}
                                        onChange={() => handleOptionChange(q.id, option.value)}
                                        className="hidden" // Hide native radio button
                                    />
                                    <span className="font-medium">{option.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 pt-4 border-t flex justify-between space-x-4">
                <button
                    onClick={onCancel}
                    className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={isLoading || !isFormComplete}
                    className="flex-1 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transform transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    {isLoading ? <LoadingIndicatorButton /> : `Submit Assessment (Score: ${calculateTotalScore()})`}
                </button>
            </div>
        </div>
    );
};

const LoadingIndicatorButton = () => (
    <div className="flex items-center justify-center">
        <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Saving...
    </div>
);


// -------------------------------------------------------------
// SUB-COMPONENT: Assessment History View
// -------------------------------------------------------------
const AssessmentHistory = ({ history, onBack }) => {
    
    // Simple interpretation of the score (0-24 total score)
    const getScoreInterpretation = (score) => {
        if (score >= 20) return { text: "Severe", color: "bg-red-500" };
        if (score >= 10) return { text: "Moderate", color: "bg-yellow-500" };
        if (score >= 5) return { text: "Mild", color: "bg-blue-500" };
        return { text: "Minimal", color: "bg-green-500" };
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <History className="w-6 h-6 mr-2 text-green-600"/> Assessment History ({history.length} Records)
            </h2>

            <button
                onClick={onBack}
                className="mb-6 flex items-center text-blue-600 hover:text-blue-700 transition"
            >
                <ChevronRight className="w-5 h-5 mr-1 transform rotate-180" /> Back to Dashboard
            </button>

            {history.length === 0 ? (
                <div className="text-center p-8 bg-gray-50 rounded-xl text-gray-600">
                    You haven't completed any assessments yet.
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Score (Max 24)
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {history.map((assessment) => {
                                const interpretation = getScoreInterpretation(assessment.score);
                                return (
                                    <tr key={assessment._id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {formatDate(assessment.dateTaken)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <span className="font-bold text-lg">{assessment.score}</span> / 24
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full text-white ${interpretation.color}`}>
                                                {interpretation.text}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};
