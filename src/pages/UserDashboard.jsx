import React, { useState, useEffect, useCallback } from 'react';
import { Award, Feather, History, ChevronRight, BarChart, XCircle, CheckCircle, Clock, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


import PersonalizedInsightCard from '../components/PersonalizedInsightCard';






// ============================================================
// CONSTANTS & CONFIG
// ============================================================
const API_BASE_URL = 'https://hope-connect-server.onrender.com/api';

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

// ============================================================
// UTILITY FUNCTIONS
// ============================================================
const assessmentUtils = {
  canTakeAssessment: (latestAssessment) => {
    if (!latestAssessment) return true;
    const lastDate = new Date(latestAssessment.dateTaken).toDateString();
    const today = new Date().toDateString();
    return lastDate !== today;
  },

  getScoreInterpretation: (score) => {
    if (score === undefined || score === null) {
      return { text: "No assessment taken yet.", color: "text-gray-600" };
    }
    if (score >= 20) return { text: "Severe indication. Please connect with a counselor immediately.", color: "text-red-600", badge: "bg-red-500" };
    if (score >= 10) return { text: "Moderate concern. Consider reaching out.", color: "text-yellow-600", badge: "bg-yellow-500" };
    if (score >= 5) return { text: "Mild concern. Keep monitoring your well-being.", color: "text-blue-600", badge: "bg-blue-500" };
    return { text: "Minimal concern. Keep up the good work!", color: "text-green-600", badge: "bg-green-500" };
  },

  formatDate: (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  },

  calculateTotalScore: (answers) => {
    return answers.reduce((sum, current) => sum + (current.value || 0), 0);
  }
};

// ============================================================
// API SERVICE
// ============================================================
const assessmentService = {
  fetchHistory: async (token) => {
    const response = await fetch(`${API_BASE_URL}/assessments`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch assessment history.");
    }
    
    return data;
  },

  submitAssessment: async (token, payload) => {
    const response = await fetch(`${API_BASE_URL}/assessments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Submission failed. Please check server logs.");
    }
    
    return data;
  }
};

// ============================================================
// UI COMPONENTS
// ============================================================
const LoadingIndicator = () => (
  <div className="flex items-center justify-center p-8 text-blue-600">
    <svg className="animate-spin h-6 w-6 mr-3" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    Loading Data...
  </div>
);

const LoadingButton = () => (
  <div className="flex items-center justify-center">
    <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    Saving...
  </div>
);

const StatusMessage = ({ message }) => {
  if (!message) return null;
  
  return (
    <div className={`p-4 mb-6 rounded-xl shadow-md flex items-center ${
      message.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
    }`}>
      {message.type === 'error' ? <XCircle className="w-5 h-5 mr-3" /> : <CheckCircle className="w-5 h-5 mr-3" />}
      <p>{message.text}</p>
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

// ============================================================
// ASSESSMENT CARD COMPONENTS
// ============================================================
const AssessmentCard = ({ canTakeAssessment, onStartAssessment }) => (
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
      className={`w-full py-3 rounded-xl font-semibold transition ${
        canTakeAssessment
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
);

const ProgressCard = ({ latestAssessment, onViewHistory }) => {
  const interpretation = assessmentUtils.getScoreInterpretation(latestAssessment?.score);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition duration-300">
      <div className="flex items-center space-x-4 mb-4">
        <History className="w-8 h-8 text-green-600 p-1.5 bg-green-100 rounded-full" />
        <h2 className="text-xl font-bold text-gray-800">Your Progress</h2>
      </div>
      {latestAssessment ? (
        <>
          <p className="text-gray-600 mb-2">
           Past Stress Level Score: <span className={`text-2xl font-extrabold ${interpretation.color}`}>{latestAssessment.score}</span>
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
  );
};

// ============================================================
// QUESTION COMPONENT
// ============================================================
const AssessmentQuestion = ({ question, selectedValue, onSelect }) => (
  <div className="p-4 bg-gray-50 rounded-xl shadow-sm">
    <p className="font-semibold text-gray-800 mb-3">{question.id}. {question.text}</p>
    <div className="flex flex-wrap gap-4 justify-between">
      {ASSESSMENT_OPTIONS.map((option) => (
        <label 
          key={option.value}
          className={`flex items-center p-3 text-sm rounded-lg cursor-pointer transition w-full sm:w-[calc(50%-8px)] lg:w-[calc(25%-12px)]
            ${selectedValue === option.value 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-400'
            }`}
        >
          <input
            type="radio"
            name={`q_${question.id}`}
            value={option.value}
            checked={selectedValue === option.value}
            onChange={() => onSelect(option.value)}
            className="hidden"
          />
          <span className="font-medium">{option.label}</span>
        </label>
      ))}
    </div>
  </div>
);



// const VictimDashboard = ({ user, latestAssessment, onStartAssessment, onViewHistory }) => {


  const VictimDashboard = ({ 
  user, 
  latestAssessment, 
  assessmentHistory,    // ✅ FIX
  onStartAssessment, 
  onViewHistory 
}) => {




    const navigate = useNavigate(); 
    const counselor = JSON.parse(localStorage.getItem("assignedCounselor"));


  const canTakeAssessment =
    !latestAssessment ||
    new Date(latestAssessment.dateTaken).toDateString() !== new Date().toDateString();

  return (
    <div className="space-y-8">







      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AssessmentCard 
          canTakeAssessment={canTakeAssessment}
          onStartAssessment={onStartAssessment}
        />
        <ProgressCard 
          latestAssessment={latestAssessment}
          onViewHistory={onViewHistory}
        />
      </div>


          <PersonalizedInsightCard
            latestAssessment={assessmentHistory[0]}
            assessmentHistory={assessmentHistory}
            onBookSession={() => navigate('/appointments', { state: { view: 'schedule' } })}
            onChatCounselor={() => navigate('/chat', { state: { otherUser: counselor } })}
          />



      <h2 className="text-2xl font-bold text-gray-900 pt-4 border-t mt-8">
        Counselor & Scheduling
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* ✅ Chat with Counselor Card */}
        <div className="bg-white p-6 rounded-xl shadow-lg text-center border border-gray-200">
          <div className="mx-auto w-fit p-2 bg-blue-50 rounded-full mb-2">
            <Award className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">Connect with Counselor</h3>
          <p className="text-sm text-gray-500 mb-4">
            Reach out and chat with your counselor securely.
          </p>

            <button
            onClick={() => navigate('/chat', { state: { otherUser: counselor } })}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-semibold shadow"
            >
            Chat with Counselor
            </button>
        </div>


            {/* New Schedule Appointment Card */}
        <div className="bg-white p-6 rounded-xl shadow-lg text-center border border-gray-200">
            <div className="mx-auto w-fit p-2 bg-blue-50 rounded-full mb-2">
                <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Schedule Appointment</h3>
            <p className="text-sm text-gray-500 mb-4">
                Book a session with your counselor.
            </p>
            <button
                onClick={() => navigate('/appointments', { state: { view: 'schedule' } })} // Or set internal state
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-semibold shadow"
            >
                Book Now
            </button>
        </div>

        {/* View Appointments Card */}
        <div className="bg-white p-6 rounded-xl shadow-lg text-center border border-gray-200">
            <div className="mx-auto w-fit p-2 bg-purple-50 rounded-full mb-2">
                <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">View Appointments</h3>
            <p className="text-sm text-gray-500 mb-4">
                See your scheduled, completed, and cancelled sessions.
            </p>
            <button
                onClick={() => navigate('/appointments')} // Or set internal state
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition font-semibold shadow"
            >
                View History
            </button>
        </div>

      </div>
    </div>
  );
};






const SelfAssessmentForm = ({ token, onSubmissionComplete, onCancel }) => {
  const [answers, setAnswers] = useState(
    ASSESSMENT_QUESTIONS.map(q => ({ questionIndex: q.id, value: null }))
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleOptionChange = (qIndex, value) => {
    setAnswers(prev => prev.map(a =>
      a.questionIndex === qIndex ? { ...a, value } : a
    ));
    if (error) setError(null);
  };

  const isFormComplete = answers.every(a => a.value !== null);
  const totalScore = assessmentUtils.calculateTotalScore(answers);

  const handleSubmit = async () => {
    if (!isFormComplete) {
      setError("Please answer all questions before submitting.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const payload = {
      score: totalScore,
      answers: answers.map(a => ({ 
        questionIndex: a.questionIndex, 
        value: a.value 
      })),
    };

    try {
      await assessmentService.submitAssessment(token, payload);
      onSubmissionComplete();
    } catch (err) {
      setError(err.message);
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
          <AssessmentQuestion
            key={q.id}
            question={q}
            selectedValue={answers.find(a => a.questionIndex === q.id)?.value}
            onSelect={(value) => handleOptionChange(q.id, value)}
          />
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
          {isLoading ? <LoadingButton /> : `Submit Assessment (Score: ${totalScore})`}
        </button>
      </div>
    </div>
  );
};

const AssessmentHistory = ({ history, onBack }) => {
  const formatDate = assessmentUtils.formatDate;
  const getScoreInterpretation = assessmentUtils.getScoreInterpretation;

return (
  <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-3xl shadow-xl border border-gray-100">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
        <div className="p-2 bg-green-100 rounded-xl">
          <History className="w-7 h-7 text-green-600" />
        </div>
        <span>Assessment History</span>
        <span className="text-lg font-normal text-gray-500">({history.length})</span>
      </h2>
      <button
        onClick={onBack}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-all duration-200"
      >
        <ChevronRight className="w-4 h-4 transform rotate-180" />
        Back to Dashboard
      </button>
    </div>

    {history.length === 0 ? (
      <div className="text-center p-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300">
        <div className="inline-flex p-4 bg-white rounded-full mb-4 shadow-sm">
          <History className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-600 text-lg font-medium">No assessments yet</p>
        <p className="text-gray-500 text-sm mt-2">Complete your first assessment to see your history here</p>
      </div>
    ) : (
      <div className="space-y-4">
        <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Stress Level
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {history.map((assessment, index) => {
                const interpretation = getScoreInterpretation(assessment.score);
                return (
                  <tr 
                    key={assessment._id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium text-gray-900">
                          {formatDate(assessment.dateTaken)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-gray-900">{assessment.score}</span>
                        <span className="text-sm text-gray-500 font-medium">/24</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-4 py-2 inline-flex text-xs font-bold rounded-xl text-white shadow-sm ${interpretation.badge}`}>
                        {interpretation.text.split('.')[0]}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        <div className="flex items-center gap-2 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center bg-amber-400 rounded-full">
            <span className="text-white text-xs font-bold">!</span>
          </div>
          <p className="text-sm font-semibold text-amber-900">
            Lower scores indicate better wellbeing
          </p>
        </div>
      </div>
    )}
  </div>
);
};

// ============================================================
// CUSTOM HOOKS
// ============================================================
const useAssessmentData = (token) => {
  const [assessmentHistory, setAssessmentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  const fetchAssessmentHistory = useCallback(async () => {
    if (!token) {
      setMessage({ type: 'error', text: "Authentication token missing." });
      setLoading(false);
      return;
    }

    try {
      const data = await assessmentService.fetchHistory(token);
      setAssessmentHistory(data);
      setMessage(null);
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchAssessmentHistory();
    }
  }, [token, fetchAssessmentHistory]);

  return { assessmentHistory, loading, message, setMessage, refetchHistory: fetchAssessmentHistory };
};

// ============================================================
// MAIN DASHBOARD COMPONENT
// ============================================================
export default function UserDashboard({ currentUser, authToken }) {
  const [mockUser] = useState(currentUser || { name: "Victim User", role: "victim" });
  const [token] = useState(authToken || "YOUR_AUTH_TOKEN_HERE"); 
  const [currentView, setCurrentView] = useState('dashboard');


  

  const { assessmentHistory, loading, message, setMessage, refetchHistory } = useAssessmentData(token);

  const handleAssessmentComplete = () => {
    refetchHistory();
    setCurrentView('results');
  };


  const renderContent = () => {
    switch (currentView) {
      case 'assessment':
        return (
          <SelfAssessmentForm 
            token={token}
            onSubmissionComplete={handleAssessmentComplete}
            onCancel={() => setCurrentView('dashboard')}
          />
        );
      case 'results':
        return (
          <AssessmentHistory 
            history={assessmentHistory} 
            onBack={() => setCurrentView('dashboard')} 
          />
        );
      case 'dashboard':
      default:
        return (



          <VictimDashboard 
            user={mockUser} 
            latestAssessment={assessmentHistory[0]}
            assessmentHistory={assessmentHistory}   // ✅ FIX HERE
            onStartAssessment={() => setCurrentView('assessment')}
            onViewHistory={() => setCurrentView('results')}
          />




        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto pt-9">
        <header className="mb-8 border-b pb-4 pt-3">
          <h1 className="text-3xl font-extrabold text-gray-900">
            {mockUser.role === 'victim' ? "My Hope Connect Dashboard" : "Dashboard"}
          </h1>
          <p className="text-gray-600">Welcome back, <span className="font-semibold text-blue-600">{mockUser.name}</span>.</p>
        </header>

        <StatusMessage message={message} />
        
        {loading ? <LoadingIndicator /> : renderContent()}
      </div>
    </div>
  );
}