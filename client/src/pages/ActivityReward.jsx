import React, { useState, useEffect, useRef } from 'react';
import { Mic, X, Check, Award, DollarSign, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const ActivityTracker = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [spokenText, setSpokenText] = useState('');
  const [visualWords, setVisualWords] = useState([]);
  const [activityInput, setActivityInput] = useState('');
  const [activities, setActivities] = useState([]);
  const [dailyLimit, setDailyLimit] = useState(5);
  const [showReward, setShowReward] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rewardAmount, setRewardAmount] = useState(0);
  const navigate = useNavigate();

  const { user } = useUser();

  const token = localStorage.getItem('token');

  // Web Speech API reference
  const recognitionRef = useRef(null);

  useEffect(() => {
    fetchActivities();
  }, []);

  
  const fetchActivities = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/auth/get-activities`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setActivities(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching activities:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      console.error('Speech recognition not supported in this browser');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSpokenText(transcript);
      setActivityInput(transcript);

      const words = transcript.split(' ').filter(word => word.trim() !== '');
      setVisualWords(words);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.error('Error stopping speech recognition', e);
        }
      }
    };
  }, []);

  const startRecording = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser');
      return;
    }

    setIsRecording(true);
    setSpokenText('');
    setVisualWords([]);

    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (!recognitionRef.current) return;

    try {
      recognitionRef.current.stop();
    } catch (error) {
      console.error('Error stopping speech recognition:', error);
    }

    setIsRecording(false);
  };

  const handleClearRecording = () => {
    setSpokenText('');
    setVisualWords([]);
    setActivityInput('');
  };

  const submitHandler = async () => {
    if (!activityInput.trim()) return;

    setIsLoading(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/auth/add-activity`,
        { activity: activityInput },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const earnedReward = response.data.reward || 0;
      setRewardAmount(earnedReward);

      await fetchActivities();

      setActivityInput('');
      setSpokenText('');
      setVisualWords([]);

      setShowReward(true);
      setTimeout(() => setShowReward(false), 3000);

      setIsLoading(false);
    } catch (error) {
      console.error("Error submitting activity:", error);
      setIsLoading(false);
    }
  };

  const isLimitReached = activities.length >= dailyLimit;

  return (
    <div className="flex flex-col h-screen bg-gray-100 font-sans">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 flex items-center justify-between shadow-md">
        <div className='flex items-center gap-3'>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center font-medium"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
        </button>
        <h1 className="text-xl font-bold">Daily Activity Tracker</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white bg-opacity-20 px-3 py-1 rounded-full">

            <span> ₹ {user.pocketMoney}</span>
          </div>
          <div className="text-sm bg-white bg-opacity-20 px-3 py-1 rounded-full">
            {activities.length}/{dailyLimit} Activities
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 flex flex-col max-w-lg mx-auto w-full">

        {/* Activity Input Form */}
        {!isLimitReached ? (
          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 mb-4">
            <h2 className="font-bold text-lg mb-4 flex items-center">
              <span className="mr-2">📝</span>Log Your Activity
            </h2>

            <div>
              <div className="mb-4">
                <div className="mb-2 p-6 bg-gray-50 rounded-xl min-h-32 border-2 border-dashed border-gray-300 relative">
                  {isRecording ? (
                    <div className="flex flex-wrap gap-2 items-center justify-center min-h-16">
                      {visualWords.length > 0 ? (
                        visualWords.map((word, index) => (
                          <div
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full animate-pop-in"
                            style={{ animationDelay: `${index * 0.1}s` }}
                          >
                            {word}
                          </div>
                        ))
                      ) : (
                        <div className="flex items-center justify-center">
                          <div className="flex space-x-1">
                            <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                            <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                          </div>
                          <span className="ml-3 text-red-500 font-medium">Listening...</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <textarea
                        value={activityInput}
                        onChange={(e) => setActivityInput(e.target.value)}
                        placeholder="Describe your activity here or use speech recording..."
                        className="w-full h-24 bg-transparent outline-none resize-none"
                      />

                      {activityInput && (
                        <button
                          type="button"
                          onClick={handleClearRecording}
                          className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-200"
                        >
                          <X size={16} className="text-gray-500" />
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={isLimitReached}
                  className={`py-2 px-4 flex items-center justify-center rounded-xl font-medium text-white shadow-md transition ${isRecording
                      ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                      : 'bg-blue-500 hover:bg-blue-600'
                    } ${isLimitReached ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Mic size={18} className="mr-2" />
                  <span>{isRecording ? 'Stop' : 'Record'}</span>
                </button>

                <button
                  onClick={submitHandler}
                  disabled={!activityInput.trim() || isLoading || isLimitReached}
                  className={`py-2 px-6 flex items-center justify-center rounded-xl font-medium text-white shadow-md transition bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90 ${(!activityInput.trim() || isLoading || isLimitReached) ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>Submitting...</span>
                    </div>
                  ) : (
                    <>
                      <Check size={18} className="mr-2" />
                      <span>Submit Activity</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 rounded-md">
            <p className="text-yellow-700">
              <span className="font-bold">Daily limit reached!</span> You've completed your 5 activities for today.
            </p>
          </div>
        )}

        {/* Completed Activities List */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100">
          <h2 className="font-bold text-lg mb-4 flex items-center">
            <span className="mr-2">✅</span>Completed Activities
          </h2>

          {isLoading && activities.length === 0 ? (
            <div className="flex justify-center p-6">
              <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
          ) : activities.length > 0 ? (
            <ul className="space-y-3">
              {activities.map((activity) => (
                <li
                  key={activity.id}
                  className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-center"
                >
                  <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <Check size={16} className="text-green-600" />
                  </div>
                  <p className="text-gray-700">{activity.activity || activity.text}</p>
                  {(
                    <div className="ml-auto bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full flex items-center">
                      <span>₹ {activity.reward.toFixed(2)}</span>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500 py-6">No activities completed yet. Add your first one!</p>
          )}
        </div>
      </div>

      {/* Reward Animation */}
      {showReward && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center animate-bounce-in">
            <div className="mx-auto w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <Award size={40} className="text-yellow-500" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Reward Unlocked!</h3>
            <div className="flex items-center justify-center mb-4">
              <div className="flex items-center bg-green-100 px-4 py-2 rounded-full">
                <span className="text-2xl font-bold text-green-600">₹ {rewardAmount.toFixed(2)}</span>
              </div>
            </div>
            <p className="text-gray-600 mb-4">Great job completing your activity!</p>
            <button
              onClick={() => setShowReward(false)}
              className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-2 px-6 rounded-lg font-medium"
            >
              Continue
            </button>
            <div className="relative mt-4">
              <div className="animate-money-flow">
                ₹
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes popIn {
          0% { transform: scale(0); opacity: 0; }
          70% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        .animate-pop-in {
          animation: popIn 0.5s ease-out forwards;
        }
        
        @keyframes bounceIn {
          0% { transform: scale(0.3); opacity: 0; }
          40% { transform: scale(1.1); }
          60% { transform: scale(0.9); }
          80% { transform: scale(1.03); }
          100% { transform: scale(1); opacity: 1; }
        }
        
        .animate-bounce-in {
          animation: bounceIn 0.6s ease-out forwards;
        }
        
        @keyframes moneyFlow {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          50% { transform: translate(-150px, -100px) scale(1.5); opacity: 0.7; }
          100% { transform: translate(-300px, -200px) scale(0.5); opacity: 0; }
        }
        
        .animate-money-flow {
          animation: moneyFlow 2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ActivityTracker;