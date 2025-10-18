import React, { useState, useEffect } from 'react';
import { 
  Home, Activity, BarChart3, Settings, Coffee, 
  Music, AlertTriangle, MapPin, Battery, Wifi, Signal,
  User, Download, Share2, Heart
} from 'lucide-react';

const SafeDriveAI = () => {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [wellnessScore, setWellnessScore] = useState(85);
  const [tripType, setTripType] = useState(null);
  const [tripDuration, setTripDuration] = useState(0);
  const [lastBreak, setLastBreak] = useState(0);
  const [weather, setWeather] = useState({ temp: 28, condition: 'sunny' });
  const [timeOfDay, setTimeOfDay] = useState('day');
  const [batteryLevel, setBatteryLevel] = useState(85);
  
  const [recentTrips, setRecentTrips] = useState([
    { id: 1, date: 'Today, 9:30 AM', route: 'Home → Office', score: 88, duration: '45 min', distance: '12 km' },
    { id: 2, date: 'Today, 6:15 PM', route: 'Office → Home', score: 82, duration: '50 min', distance: '12 km' },
    { id: 3, date: 'Yesterday, 2:00 PM', route: 'Office → Client', score: 75, duration: '35 min', distance: '8 km' }
  ]);
  
  const [fatigueEvents, setFatigueEvents] = useState([]);
  const [drivingMetrics, setDrivingMetrics] = useState({
    smoothness: 92,
    focus: 88,
    reaction: 85
  });

  // Enhanced monitoring simulation
  useEffect(() => {
    let interval;
    if (isMonitoring) {
      interval = setInterval(() => {
        setTripDuration(prev => prev + 1);
        setLastBreak(prev => prev + 1);
        setBatteryLevel(prev => Math.max(10, prev - 0.1));
        
        // Dynamic wellness score based on time and conditions
        setWellnessScore(prev => {
          const timeFactor = timeOfDay === 'night' ? 0.8 : 1;
          const breakFactor = lastBreak > 1800 ? 0.7 : 1; // 30 minutes
          const randomVariation = (Math.random() - 0.5) * 10;
          
          const newScore = Math.max(20, Math.min(100, 
            prev - (2 * timeFactor * breakFactor) + randomVariation
          ));
          
          // Add fatigue events at thresholds
          if (prev >= 70 && newScore < 70 && !fatigueEvents.some(e => e.time === tripDuration)) {
            const newEvent = {
              time: tripDuration,
              type: 'Mild Fatigue',
              score: Math.round(newScore),
              message: 'You\'re showing early signs of fatigue'
            };
            setFatigueEvents(events => [...events, newEvent]);
          }
          
          if (prev >= 50 && newScore < 50 && !fatigueEvents.some(e => e.time === tripDuration)) {
            const newEvent = {
              time: tripDuration,
              type: 'Moderate Fatigue',
              score: Math.round(newScore),
              message: 'Consider taking a break soon'
            };
            setFatigueEvents(events => [...events, newEvent]);
          }
          
          return newScore;
        });
        
        // Update driving metrics
        setDrivingMetrics(prev => ({
          smoothness: Math.max(60, prev.smoothness + (Math.random() - 0.5) * 5),
          focus: Math.max(50, prev.focus - 0.2),
          reaction: Math.max(55, prev.reaction - 0.3)
        }));
        
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isMonitoring, tripDuration, lastBreak, timeOfDay, fatigueEvents]);

  // Enhanced alert system
  const getAlertLevel = (score) => {
    if (score >= 80) return { 
      level: 'Optimal', 
      color: 'bg-green-500', 
      textColor: 'text-green-600', 
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      emoji: '😊',
      description: 'You\'re driving safely'
    };
    if (score >= 60) return { 
      level: 'Mild Fatigue', 
      color: 'bg-yellow-500', 
      textColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      emoji: '😐',
      description: 'Stay alert'
    };
    if (score >= 40) return { 
      level: 'Moderate Fatigue', 
      color: 'bg-orange-500', 
      textColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      emoji: '😔',
      description: 'Take a break soon'
    };
    return { 
      level: 'Severe Drowsiness', 
      color: 'bg-red-500', 
      textColor: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      emoji: '😴',
      description: 'Pull over immediately'
    };
  };

  const alertLevel = getAlertLevel(wellnessScore);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m ${secs}s`;
  };

  const startTrip = (type) => {
    setTripType(type);
    setIsMonitoring(true);
    setCurrentScreen('monitoring');
    setWellnessScore(85);
    setTripDuration(0);
    setLastBreak(0);
    setFatigueEvents([]);
    setTimeOfDay(Math.random() > 0.5 ? 'day' : 'night');
    setWeather({
      temp: 20 + Math.floor(Math.random() * 15),
      condition: ['sunny', 'cloudy', 'rainy'][Math.floor(Math.random() * 3)]
    });
  };

  const endTrip = () => {
    setIsMonitoring(false);
    // Save trip to recent trips
    const newTrip = {
      id: recentTrips.length + 1,
      date: 'Just now',
      route: `${tripType} Trip`,
      score: Math.round(wellnessScore),
      duration: formatTime(tripDuration),
      distance: `${Math.round(tripDuration / 30)} km`
    };
    setRecentTrips(prev => [newTrip, ...prev.slice(0, 4)]);
    setCurrentScreen('summary');
  };

  const takeBreak = () => {
    setLastBreak(0);
    setWellnessScore(prev => Math.min(100, prev + 25));
    setDrivingMetrics(prev => ({
      ...prev,
      focus: Math.min(100, prev.focus + 15),
      reaction: Math.min(100, prev.reaction + 10)
    }));
  };

  // Enhanced Home Screen
  const HomeScreen = () => (
    <div className="space-y-6 animate-fade-in">
      {/* Weather & Status Bar */}
      <div className="bg-white rounded-3xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-4xl">
              {weather.condition === 'sunny' ? '☀️' : weather.condition === 'rainy' ? '🌧️' : '☁️'}
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{weather.temp}°C</div>
              <div className="text-sm text-gray-500 capitalize">{weather.condition}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 text-gray-600">
              <Battery className="w-5 h-5" />
              <span className="font-semibold">{Math.round(batteryLevel)}%</span>
            </div>
            <div className="text-sm text-gray-500">{timeOfDay === 'day' ? 'Day Drive' : 'Night Drive'}</div>
          </div>
        </div>
      </div>

      {/* Quick Start Card */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-3xl shadow-xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-4 right-4 bg-white bg-opacity-20 rounded-full px-3 py-1 text-sm">
          🚀 AI Powered
        </div>
        <h2 className="text-2xl font-bold mb-2">Ready to Drive?</h2>
        <p className="text-blue-100 mb-6">Start monitoring for safer journey</p>
        <div className="grid grid-cols-3 gap-4">
          {[
            { id: 'commute', name: 'Commute', icon: '🚗', desc: 'Daily', duration: '<1h', color: 'from-green-500 to-emerald-600' },
            { id: 'roadtrip', name: 'Road Trip', icon: '🛣️', desc: 'Long', duration: '2h+', color: 'from-orange-500 to-red-600' },
            { id: 'fleet', name: 'Fleet', icon: '🚚', desc: 'Professional', duration: '4h+', color: 'from-purple-500 to-indigo-600' }
          ].map(type => (
            <button
              key={type.id}
              onClick={() => startTrip(type.id)}
              className={`bg-gradient-to-br ${type.color} rounded-2xl p-5 transition-all transform hover:scale-105 hover:shadow-lg backdrop-blur-lg`}
            >
              <div className="text-3xl mb-2">{type.icon}</div>
              <div className="font-bold text-lg">{type.name}</div>
              <div className="text-xs text-white text-opacity-80">{type.duration}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Wellness Overview */}
      <div className="bg-white rounded-3xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Wellness Overview</h2>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Last updated: 5 min ago
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-4 border border-green-200">
            <div className="text-3xl font-bold text-green-600 mb-1">{Math.round(wellnessScore)}</div>
            <div className="text-sm text-green-700">Current Score</div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-cyan-100 rounded-2xl p-4 border border-blue-200">
            <div className="text-3xl font-bold text-blue-600 mb-1">{recentTrips.length}</div>
            <div className="text-sm text-blue-700">Trips This Week</div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Driving Focus</span>
            <div className="flex items-center gap-2">
              <div className="w-20 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all" 
                  style={{ width: `${drivingMetrics.focus}%` }}
                ></div>
              </div>
              <span className="text-sm font-semibold text-gray-700">{Math.round(drivingMetrics.focus)}%</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Reaction Time</span>
            <div className="flex items-center gap-2">
              <div className="w-20 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all" 
                  style={{ width: `${drivingMetrics.reaction}%` }}
                ></div>
              </div>
              <span className="text-sm font-semibold text-gray-700">{Math.round(drivingMetrics.reaction)}%</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Smoothness</span>
            <div className="flex items-center gap-2">
              <div className="w-20 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all" 
                  style={{ width: `${drivingMetrics.smoothness}%` }}
                ></div>
              </div>
              <span className="text-sm font-semibold text-gray-700">{Math.round(drivingMetrics.smoothness)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Trips with Enhanced UI */}
      <div className="bg-white rounded-3xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Recent Trips</h2>
          <button className="text-blue-600 text-sm font-semibold">View All</button>
        </div>
        <div className="space-y-3">
          {recentTrips.slice(0, 3).map((trip) => (
            <div key={trip.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold">
                  {trip.score}
                </div>
                <div>
                  <div className="font-semibold text-gray-800">{trip.route}</div>
                  <div className="text-sm text-gray-500 flex items-center gap-2">
                    <span>{trip.date}</span>
                    <span>•</span>
                    <span>{trip.duration}</span>
                    <span>•</span>
                    <span>{trip.distance}</span>
                  </div>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                trip.score >= 80 ? 'bg-green-100 text-green-700' :
                trip.score >= 60 ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {trip.score >= 80 ? 'Excellent' : trip.score >= 60 ? 'Good' : 'Needs Rest'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Safety Tips */}
      <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-3xl shadow-lg p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="text-3xl flex-shrink-0">💡</div>
          <div>
            <div className="font-bold text-lg mb-2">Safety First! 🛡️</div>
            <div className="text-amber-100 space-y-1">
              <div>• Take 15-min breaks every 2 hours</div>
              <div>• Stay hydrated during long drives</div>
              <div>• Avoid driving during your normal sleep hours</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Enhanced Monitoring Screen
  const MonitoringScreen = () => (
    <div className="space-y-6 animate-slide-up">
      {/* Enhanced Header */}
      <div className="bg-white rounded-3xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={endTrip}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200">
              ←
            </div>
          </button>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="font-semibold text-sm">LIVE</span>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">{tripType?.toUpperCase()} MODE</div>
              <div className="text-lg font-bold text-gray-800">{formatTime(tripDuration)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Camera View */}
      <div className="bg-gray-900 rounded-3xl shadow-lg p-6 relative overflow-hidden">
        <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2 z-10">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          AI MONITORING
        </div>
        
        {/* Face Detection Visualization */}
        <div className="flex items-center justify-center h-64 relative">
          <div className="relative">
            {/* Face outline */}
            <div className="w-40 h-48 border-4 border-green-400 rounded-full opacity-80" 
                 style={{borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%'}} />
            
            {/* Eyes */}
            <div className="absolute top-16 left-8 w-6 h-6 bg-green-400 rounded-full animate-blink" />
            <div className="absolute top-16 right-8 w-6 h-6 bg-green-400 rounded-full animate-blink" style={{animationDelay: '0.2s'}} />
            
            {/* Mouth */}
            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-12 h-2 bg-green-400 rounded-full" />
            
            {/* Detection points */}
            <div className="absolute top-12 left-4 w-2 h-2 bg-yellow-400 rounded-full animate-ping" />
            <div className="absolute top-12 right-4 w-2 h-2 bg-yellow-400 rounded-full animate-ping" style={{animationDelay: '0.5s'}} />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4 text-center text-white">
          <div>
            <div className="text-green-400 font-bold">👁️ Eyes</div>
            <div className="text-xs text-gray-400">Tracking</div>
          </div>
          <div>
            <div className="text-green-400 font-bold">😮 Yawn</div>
            <div className="text-xs text-gray-400">0 detected</div>
          </div>
          <div>
            <div className="text-green-400 font-bold">🎯 Focus</div>
            <div className="text-xs text-gray-400">Good</div>
          </div>
        </div>
      </div>

      {/* Enhanced Wellness Metrics */}
      <div className="bg-white rounded-3xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-800">Wellness Metrics</h3>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${alertLevel.color}`}></div>
            <span className={`font-bold ${alertLevel.textColor}`}>{alertLevel.level}</span>
          </div>
        </div>

        <div className="space-y-4">
          {/* Main Score */}
          <div className="text-center">
            <div className="text-5xl font-bold text-gray-800 mb-2">{Math.round(wellnessScore)}</div>
            <div className="text-sm text-gray-500">Overall Wellness Score</div>
          </div>

          {/* Progress Bar */}
          <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full ${alertLevel.color} transition-all duration-1000 ease-out`}
              style={{ width: `${wellnessScore}%` }}
            />
          </div>

          {/* Sub-metrics */}
          <div className="grid grid-cols-3 gap-4 pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{Math.round(drivingMetrics.focus)}%</div>
              <div className="text-xs text-gray-500">Focus</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{Math.round(drivingMetrics.reaction)}%</div>
              <div className="text-xs text-gray-500">Reaction</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{Math.round(drivingMetrics.smoothness)}%</div>
              <div className="text-xs text-gray-500">Smoothness</div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Alert System */}
      {wellnessScore < 70 && (
        <div className={`${alertLevel.bgColor} border ${alertLevel.borderColor} rounded-3xl shadow-lg p-6 animate-pulse`}>
          <div className="flex items-center gap-4">
            <div className="text-3xl">{alertLevel.emoji}</div>
            <div className="flex-1">
              <div className={`font-bold text-lg ${alertLevel.textColor} mb-1`}>
                {alertLevel.level} Detected
              </div>
              <div className="text-sm text-gray-700">
                {alertLevel.description}
              </div>
              {wellnessScore < 40 && (
                <div className="mt-2 text-xs text-red-600 font-semibold">
                  🚨 CRITICAL: Pull over safely when possible
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={takeBreak}
          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
        >
          <Coffee className="w-8 h-8 mb-2 mx-auto" />
          <div className="font-bold">Take Break</div>
          <div className="text-sm opacity-90">Refresh +25 pts</div>
        </button>
        <button className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
          <Music className="w-8 h-8 mb-2 mx-auto" />
          <div className="font-bold">Energy Mode</div>
          <div className="text-sm opacity-90">Play upbeat</div>
        </button>
      </div>

      {/* Enhanced Nearby Rest Stops */}
      <div className="bg-white rounded-3xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-500" />
          Recommended Stops
        </h3>
        <div className="space-y-3">
          {[
            { name: 'Dhaba Junction', distance: '2.3 km', rating: 4.2, type: '☕', time: '5 min', features: ['Food', 'Restrooms'] },
            { name: 'HP Petrol Pump', distance: '4.1 km', rating: 4.5, type: '⛽', time: '8 min', features: ['Fuel', 'Snacks'] },
            { name: 'Hotel Paradise', distance: '7.8 km', rating: 4.0, type: '🏨', time: '12 min', features: ['AC Rest', 'Food'] }
          ].map((stop, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 cursor-pointer transition-colors">
              <div className="flex items-center gap-4">
                <div className="text-3xl">{stop.type}</div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-800">{stop.name}</div>
                  <div className="text-sm text-gray-500 flex items-center gap-2">
                    <span>{stop.distance}</span>
                    <span>•</span>
                    <span>⭐ {stop.rating}</span>
                    <span>•</span>
                    <span>{stop.time} away</span>
                  </div>
                  <div className="flex gap-1 mt-1">
                    {stop.features.map((feature, fIdx) => (
                      <span key={fIdx} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors">
                Navigate
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Enhanced Summary Screen
  const SummaryScreen = () => {
    const avgScore = Math.round((wellnessScore + drivingMetrics.focus + drivingMetrics.reaction) / 3);
    const tripRating = avgScore >= 80 ? 'Excellent' : avgScore >= 60 ? 'Good' : 'Needs Improvement';
    
    return (
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl shadow-lg p-8 text-white text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold mb-2">Trip Completed!</h2>
          <p className="text-green-100">You arrived safely with AI monitoring</p>
        </div>

        {/* Trip Overview */}
        <div className="bg-white rounded-3xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Trip Overview</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Route Type</span>
              <span className="font-bold text-gray-800 capitalize">{tripType} Trip</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Duration</span>
              <span className="font-bold text-gray-800">{formatTime(tripDuration)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Distance</span>
              <span className="font-bold text-gray-800">{Math.round(tripDuration / 30)} km</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Time of Day</span>
              <span className="font-bold text-gray-800 capitalize">{timeOfDay}</span>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-3xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Performance Summary</h3>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="text-3xl font-bold text-green-600">{avgScore}</div>
              <div className="text-xs text-gray-600 mt-1">Avg Score</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-xl border border-orange-200">
              <div className="text-3xl font-bold text-orange-600">{fatigueEvents.length}</div>
              <div className="text-xs text-gray-600 mt-1">Alerts</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="text-3xl font-bold text-blue-600">1</div>
              <div className="text-xs text-gray-600 mt-1">Breaks</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-200">
              <div className="text-3xl font-bold text-purple-600">{Math.round(drivingMetrics.smoothness)}%</div>
              <div className="text-xs text-gray-600 mt-1">Smoothness</div>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-3 p-4 bg-gray-50 rounded-xl">
            <span className="text-2xl">{
              tripRating === 'Excellent' ? '⭐⭐⭐⭐⭐' :
              tripRating === 'Good' ? '⭐⭐⭐' : '⭐⭐'
            }</span>
            <span className="text-gray-700 font-semibold">Overall Rating: {tripRating}</span>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-3xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Trip Timeline</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-1">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-800">Trip Started</div>
                <div className="text-sm text-gray-500">Score: 85 • Optimal driving conditions</div>
              </div>
            </div>
            
            {fatigueEvents.map((event, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0 mt-1">
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-800">{event.type}</div>
                  <div className="text-sm text-gray-500">
                    {formatTime(event.time)} • Score dropped to {event.score}
                  </div>
                </div>
              </div>
            ))}
            
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                <Coffee className="w-5 h-5 text-blue-500" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-800">Break Taken</div>
                <div className="text-sm text-gray-500">Wellness score improved by 25 points</div>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-1">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-800">Arrived Safely</div>
                <div className="text-sm text-gray-500">Trip completed with {Math.round(wellnessScore)} final score</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-3xl shadow-lg p-6 text-white">
          <div className="flex items-start gap-4">
            <div className="text-3xl">💡</div>
            <div className="flex-1">
              <h3 className="text-lg font-bold mb-2">Personalized Insights</h3>
              <ul className="space-y-2 text-purple-100">
                <li>• You showed fatigue after {formatTime(Math.floor(tripDuration / 2))} of driving</li>
                <li>• Plan 15-min breaks every 90 minutes for optimal performance</li>
                <li>• Your driving smoothness was excellent ({Math.round(drivingMetrics.smoothness)}%)</li>
                <li>• Consider shorter trips during {timeOfDay} hours for better focus</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button className="bg-white border-2 border-gray-200 text-gray-700 rounded-2xl p-4 font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
            <Download className="w-5 h-5" />
            Download Report
          </button>
          <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl p-4 font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2">
            <Share2 className="w-5 h-5" />
            Share Achievement
          </button>
        </div>

        <button
          onClick={() => {
            setCurrentScreen('home');
            setTripType(null);
            setWellnessScore(85);
            setTripDuration(0);
            setFatigueEvents([]);
          }}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl p-4 font-bold text-lg hover:shadow-lg transition-all transform hover:scale-105"
        >
          Back to Dashboard
        </button>
      </div>
    );
  };

  // Enhanced Settings Screen
  const SettingsScreen = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Settings</h2>
        
        <div className="space-y-6">
          {/* Profile */}
          <div>
            <h3 className="font-bold text-gray-700 mb-3">Driver Profile</h3>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                <User className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-gray-800">Alex Driver</div>
                <div className="text-sm text-gray-500">Professional Driver • 5 years experience</div>
              </div>
              <button className="text-blue-500 text-sm font-semibold">Edit</button>
            </div>
          </div>

          {/* Alert Sensitivity */}
          <div>
            <h3 className="font-bold text-gray-700 mb-3">Alert Sensitivity</h3>
            <div className="space-y-2">
              {[
                { level: 'Sensitive', desc: 'Get alerts early (Recommended for safety)', value: 'high' },
                { level: 'Moderate', desc: 'Balanced alerts for most drivers', value: 'medium' },
                { level: 'Relaxed', desc: 'Fewer alerts, more focused driving', value: 'low' }
              ].map((option, idx) => (
                <label key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                  <input type="radio" name="sensitivity" defaultChecked={idx === 0} className="w-4 h-4 mt-1" />
                  <div>
                    <div className="text-gray-700 font-medium">{option.level}</div>
                    <div className="text-xs text-gray-500">{option.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Privacy & Data */}
          <div>
            <h3 className="font-bold text-gray-700 mb-3">Privacy & Data</h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div>
                  <div className="text-gray-700 font-medium">On-Device Processing</div>
                  <div className="text-xs text-gray-500">Process data locally for privacy</div>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5" />
              </label>
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div>
                  <div className="text-gray-700 font-medium">Camera Access</div>
                  <div className="text-xs text-gray-500">Required for fatigue detection</div>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5" />
              </label>
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div>
                  <div className="text-gray-700 font-medium">Location Services</div>
                  <div className="text-xs text-gray-500">For rest stop recommendations</div>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5" />
              </label>
            </div>
          </div>

          {/* Emergency Contact */}
          <div>
            <h3 className="font-bold text-gray-700 mb-3">Emergency Contact</h3>
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700 font-semibold">Primary Contact</span>
                <button className="text-blue-500 text-sm font-semibold">Edit</button>
              </div>
              <div className="text-sm text-gray-600">Sarah Johnson</div>
              <div className="text-sm text-gray-500">+1 (555) 123-4567</div>
            </div>
          </div>

          {/* App Preferences */}
          <div>
            <h3 className="font-bold text-gray-700 mb-3">App Preferences</h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-3 bg-gray-50 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors">
                <div className="font-medium">Theme</div>
                <div className="text-xs text-gray-500">Dark Mode</div>
              </button>
              <button className="p-3 bg-gray-50 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors">
                <div className="font-medium">Units</div>
                <div className="text-xs text-gray-500">Metric</div>
              </button>
            </div>
          </div>

          {/* Data Management */}
          <div className="pt-4 border-t border-gray-200">
            <button className="w-full p-4 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
              <span>🗑️</span>
              Delete All Trip Data
            </button>
          </div>

          {/* About */}
          <div className="pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
            <div className="mb-2 flex items-center justify-center gap-2">
              <Heart className="w-4 h-4 text-red-500" />
              <span>SafeDrive AI v2.0.0</span>
            </div>
            <div className="flex justify-center gap-4">
              <button className="text-blue-500 hover:text-blue-600">Privacy Policy</button>
              <button className="text-blue-500 hover:text-blue-600">Terms of Service</button>
              <button className="text-blue-500 hover:text-blue-600">Help & Support</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Main Render
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Enhanced Status Bar */}
      <div className="bg-white shadow-sm px-6 py-3">
        <div className="max-w-md mx-auto flex items-center justify-between text-sm">
          <div className="flex items-center gap-4 text-gray-800 font-semibold">
            <span>9:41 AM</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              Bangalore
            </span>
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <Signal className="w-4 h-4" />
            <Wifi className="w-4 h-4" />
            <div className="flex items-center gap-1">
              <Battery className="w-5 h-5" />
              <span>{Math.round(batteryLevel)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* App Container */}
      <div className="max-w-md mx-auto pb-24">
        {/* Enhanced Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white px-6 py-8 rounded-b-3xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">SafeDrive AI</h1>
              <p className="text-blue-100 text-sm mt-1">Intelligent Driver Wellness Monitoring</p>
            </div>
            <div className="w-14 h-14 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center text-2xl backdrop-blur-lg">
              🚗
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          {currentScreen === 'home' && <HomeScreen />}
          {currentScreen === 'monitoring' && <MonitoringScreen />}
          {currentScreen === 'summary' && <SummaryScreen />}
          {currentScreen === 'settings' && <SettingsScreen />}
        </div>
      </div>

      {/* Enhanced Bottom Navigation */}
      {currentScreen !== 'monitoring' && currentScreen !== 'summary' && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl">
          <div className="max-w-md mx-auto px-6 py-3">
            <div className="flex items-center justify-around">
              {[
                { icon: Home, label: 'Home', screen: 'home' },
                { icon: Activity, label: 'Analytics', screen: 'analytics' },
                { icon: BarChart3, label: 'Stats', screen: 'stats' },
                { icon: Settings, label: 'Settings', screen: 'settings' }
              ].map((item) => (
                <button
                  key={item.screen}
                  onClick={() => setCurrentScreen(item.screen)}
                  className={`flex flex-col items-center gap-1 transition-all ${
                    currentScreen === item.screen 
                      ? 'text-blue-600 transform scale-110' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <item.icon className="w-6 h-6" />
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SafeDriveAI;
