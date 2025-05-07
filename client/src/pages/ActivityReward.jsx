import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Mic, Star, CheckCircle, Trophy } from 'lucide-react';

const ActivityReward = () => {
  // User state from backend
  const [userData, setUserData] = useState({
    pocketMoney: 0,
    level: 1,
    streakDays: 0,
    character: 'ninja',
    completedToday: 0
  });
  
  // Activities state
  const [activities, setActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const maxActivities = 5;
  
  // Speech recognition state
  const [isRecording, setIsRecording] = useState(false);
  const [spokenText, setSpokenText] = useState('');
  const [processingActivity, setProcessingActivity] = useState(false);
  
  // Reward display state
  const [showReward, setShowReward] = useState(false);
  const [currentReward, setCurrentReward] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Web Speech API reference
  const recognitionRef = useRef(null);

  // Character styles
  const characters = {
    ninja: {
      idle: "🥷",
      happy: "🥷💪",
      colors: "from-purple-500 to-indigo-600",
      secondaryColor: "bg-indigo-100"
    },
    astronaut: {
      idle: "👨‍🚀",
      happy: "👨‍🚀🚀",
      colors: "from-blue-500 to-cyan-600",
      secondaryColor: "bg-blue-100"
    },
    wizard: {
      idle: "🧙‍♂️",
      happy: "🧙‍♂️✨",
      colors: "from-amber-500 to-pink-600",
      secondaryColor: "bg-amber-100"
    }
  };

  // Fetch user data and today's activities on component mount
  useEffect(() => {
    fetchUserData();
    fetchTodayActivities();
  }, []);

  // Initialize Speech Recognition
  useEffect(() => {
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      console.error('Speech recognition not supported in this browser');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSpokenText(transcript);
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
          // Ignore errors when stopping an already stopped recognition
        }
      }
    };
  }, []);

  // API Functions
  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user/profile');
      if (!response.ok) throw new Error('Failed to fetch user data');
      
      const data = await response.json();
      setUserData({
        pocketMoney: data.pocketMoney || 0,
        level: data.level || 1,
        streakDays: data.streakDays || 0,
        character: data.character || 'ninja',
        completedToday: data.completedToday || 0
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Don't set fallback data - keep initial empty state
    }
  };

  const fetchTodayActivities = async () => {
    setLoadingActivities(true);
    try {
      const response = await fetch('/api/activities/today');
      if (!response.ok) throw new Error('Failed to fetch activities');
      
      const data = await response.json();
      
      // Initialize empty activities if none are returned
      if (!data.activities || data.activities.length === 0) {
        // Create 5 empty activity slots
        const emptyActivities = Array.from({ length: maxActivities }, (_, index) => ({
          id: index,
          text: '',
          completed: false,
          points: 0
        }));
        setActivities(emptyActivities);
      } else {
        setActivities(data.activities);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
      // Create 5 empty activity slots if fetch fails
      const emptyActivities = Array.from({ length: maxActivities }, (_, index) => ({
        id: index,
        text: '',
        completed: false,
        points: 0
      }));
      setActivities(emptyActivities);
    } finally {
      setLoadingActivities(false);
    }
  };

  const saveActivityToBackend = async (activityText) => {
    setProcessingActivity(true);
    try {
      const response = await fetch('/api/activities/record', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          activityText,
          timestamp: new Date().toISOString()
        }),
      });
      
      if (!response.ok) throw new Error('Failed to save activity');
      
      const data = await response.json();
      
      // Update local state with the backend-determined reward
      updateStateWithReward(data);
      
      return data;
    } catch (error) {
      console.error('Error saving activity:', error);
      alert('Could not save your activity. Please try again!');
      return null;
    } finally {
      setProcessingActivity(false);
    }
  };

  const updateStateWithReward = (responseData) => {
    // Update activities
    const updatedActivities = [...activities];
    const emptySlotIndex = updatedActivities.findIndex(a => !a.completed);
    
    if (emptySlotIndex !== -1) {
      updatedActivities[emptySlotIndex] = {
        id: responseData.activityId,
        text: responseData.activityText,
        completed: true,
        points: responseData.rewardPoints
      };
      setActivities(updatedActivities);
    }
    
    // Update user data
    setUserData(prev => ({
      ...prev,
      pocketMoney: responseData.newPocketMoney,
      level: responseData.newLevel,
      streakDays: responseData.streakDays,
      completedToday: prev.completedToday + 1
    }));
    
    // Show reward animation
    setCurrentReward({
      points: responseData.rewardPoints,
      message: responseData.rewardMessage
    });
    setShowReward(true);
    setTimeout(() => setShowReward(false), 3000);
    
    // Show confetti if all activities completed
    if (responseData.allCompleted) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
    }
  };

  // Speech Recording Functions
  const startRecording = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser');
      return;
    }
    
    setIsRecording(true);
    setSpokenText('');
    
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

  const handleSaveActivity = async () => {
    if (!spokenText.trim() || processingActivity) return;
    
    const completedActivities = activities.filter(a => a.completed).length;
    const remainingActivities = maxActivities - completedActivities;
    
    if (remainingActivities <= 0) {
      alert('You have already completed all activities for today!');
      return;
    }
    
    const result = await saveActivityToBackend(spokenText);
    if (result) {
      setSpokenText('');
    }
  };

  // Animation and UI elements
  const [bounceFrame, setBounceFrame] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setBounceFrame(prev => (prev + 1) % 20);
    }, 50);
    return () => clearInterval(interval);
  }, []);
  
  const translateY = bounceFrame < 10 ? bounceFrame : 20 - bounceFrame;
  const completedActivities = activities.filter(a => a.completed).length;
  const progressPercentage = (completedActivities / maxActivities) * 100;
  const currentCharacter = characters[userData.character] || characters.ninja;

  const handleNavigateBack = () => {
    // Implementation depends on your routing solution
    console.log('Navigate back');
    // Example: history.goBack();
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 font-sans">
      {/* Top header */}
      <div className={`bg-gradient-to-r ${currentCharacter.colors} text-white p-4 flex items-center justify-between shadow-md`}>
        <div className="flex items-center">
          <button 
            className="mr-3 hover:bg-white hover:bg-opacity-20 p-1 rounded-full"
            onClick={handleNavigateBack}
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">Daily Activity & Unlock Rewards</h1>
        </div>
        <div className="flex items-center space-x-2">
          <div className="bg-white bg-opacity-25 px-3 py-1 rounded-full flex items-center">
            <span className="mr-1">⭐</span>
            <span className="font-bold">{userData.level}</span>
          </div>
          <div className="bg-white bg-opacity-25 px-3 py-1 rounded-full flex items-center">
            <span className="mr-1">💰</span>
            <span className="font-bold">{userData.pocketMoney}</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-4 overflow-y-auto">
        {loadingActivities ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Character and progress */}
            <div className={`${currentCharacter.secondaryColor} rounded-xl p-6 mb-6 shadow-md relative overflow-hidden`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-bold text-2xl mb-1">Daily Quests</h2>
                  {userData.streakDays > 0 && (
                    <div className="flex items-center">
                      <div className="flex mr-2">
                        {[...Array(Math.min(userData.streakDays, 5))].map((_, i) => (
                          <div key={i} className="text-yellow-500 -ml-1">🔥</div>
                        ))}
                      </div>
                      <span className="text-gray-700 text-sm">{userData.streakDays} day streak!</span>
                    </div>
                  )}
                </div>
                <div className="text-6xl" style={{ transform: `translateY(-${translateY/2}px)` }}>
                  {completedActivities === maxActivities ? currentCharacter.happy : currentCharacter.idle}
                </div>
              </div>
              
              <div className="relative pt-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="font-bold text-gray-700">{completedActivities}/{maxActivities} Quests</span>
                  </div>
                  {completedActivities === maxActivities && (
                    <span className="text-green-600 font-bold flex items-center">
                      <Trophy size={16} className="mr-1" /> All Complete!
                    </span>
                  )}
                </div>
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full bg-gradient-to-r ${currentCharacter.colors} transition-all duration-1000 ease-out`}
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Activities list */}
            <div className="bg-white rounded-xl p-4 mb-6 shadow-md">
              <h2 className="font-bold text-lg mb-4">My Activities</h2>
              <div className="space-y-3">
                {activities.map((activity, index) => (
                  <div 
                    key={activity.id || index}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                      activity.completed 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-300 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center flex-1">
                        {activity.completed ? (
                          <div className="bg-green-500 text-white rounded-full p-1 mr-3 flex-shrink-0">
                            <CheckCircle size={18} />
                          </div>
                        ) : (
                          <div className="w-7 h-7 rounded-full border-2 border-gray-400 mr-3 flex-shrink-0 flex items-center justify-center text-xs font-bold text-gray-500">
                            {index + 1}
                          </div>
                        )}
                        <span className={`${activity.completed ? 'font-medium' : 'text-gray-500'}`}>
                          {activity.completed ? activity.text : `Activity ${index + 1}`}
                        </span>
                      </div>
                      {activity.completed && activity.points > 0 && (
                        <div className="flex items-center bg-yellow-100 px-2 py-1 rounded-full text-yellow-700 font-bold text-sm ml-2">
                          +{activity.points} 💰
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Voice recording */}
            <div className="bg-white rounded-xl p-5 shadow-md">
              <h2 className="font-bold text-lg mb-4">Record New Activity</h2>
              
              {completedActivities >= maxActivities ? (
                <div className="text-center p-6 bg-yellow-50 rounded-xl border-2 border-yellow-200">
                  <div className="text-5xl mb-3">🏆</div>
                  <p className="text-gray-700 font-bold text-lg">Amazing job! All activities completed!</p>
                  <p className="text-gray-500 mt-1">Come back tomorrow for new activities</p>
                </div>
              ) : (
                <>
                  <div className="mb-4 p-4 bg-gray-50 rounded-xl min-h-16 border-2 border-dashed border-gray-300">
                    {isRecording ? (
                      <div className="flex items-center justify-center">
                        <div className="flex space-x-1">
                          <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                          <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                        <span className="ml-3 text-red-500 font-medium">Recording your activity...</span>
                      </div>
                    ) : (
                      <p className="text-gray-700">{spokenText || "Tap the mic button to record your activity"}</p>
                    )}
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={isRecording ? stopRecording : startRecording}
                      disabled={processingActivity}
                      className={`flex-1 py-3 flex items-center justify-center rounded-xl font-bold text-white shadow-md transition ${
                        isRecording 
                          ? 'bg-red-500 hover:bg-red-600' 
                          : processingActivity
                            ? 'bg-gray-400'
                            : `bg-gradient-to-r ${currentCharacter.colors} hover:opacity-90`
                      }`}
                    >
                      <Mic size={20} className="mr-2" />
                      <span>{isRecording ? 'Stop Recording' : 'Record Activity'}</span>
                    </button>
                    
                    <button
                      onClick={handleSaveActivity}
                      disabled={!spokenText || processingActivity}
                      className={`flex-1 py-3 flex items-center justify-center rounded-xl font-bold shadow-md transition ${
                        spokenText && !processingActivity
                          ? 'bg-green-500 text-white hover:bg-green-600' 
                          : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      {processingActivity ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <Star size={20} className="mr-2" />
                          <span>Save Activity</span>
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>

      {/* Reward popup animation */}
      {showReward && currentReward && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-white rounded-xl p-6 shadow-xl animate-bounce-up text-center">
            <div className="text-4xl mb-2">🎉</div>
            <h3 className="text-xl font-bold text-green-600">Activity Complete!</h3>
            <p className="text-gray-600 my-2">{currentReward.message || "Great job!"}</p>
            <div className="text-yellow-500 font-bold mt-2 text-2xl flex items-center justify-center">
              +{currentReward.points} 💰
            </div>
          </div>
        </div>
      )}

      {/* Confetti effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-40">
          {[...Array(50)].map((_, i) => {
            const size = Math.random() * 12 + 5;
            const left = Math.random() * 100;
            const animDuration = Math.random() * 3 + 2;
            const delay = Math.random() * 0.5;
            const color = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500'][Math.floor(Math.random() * 6)];
            
            return (
              <div 
                key={i}
                className={`absolute ${color} rounded-full animate-confetti`}
                style={{
                  width: size + 'px',
                  height: size + 'px',
                  left: left + '%',
                  top: '-20px',
                  animationDelay: delay + 's'
                }}
              />
            );
          })}
        </div>
      )}

      <style jsx>{`
        @keyframes bounceUp {
          0% { transform: translateY(50px); opacity: 0; }
          60% { transform: translateY(-20px); opacity: 1; }
          80% { transform: translateY(5px); }
          100% { transform: translateY(0); }
        }
        @keyframes confetti {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .animate-bounce-up {
          animation: bounceUp 1s ease-out forwards;
        }
        .animate-confetti {
          animation: confetti var(--duration, 3s) ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ActivityReward;