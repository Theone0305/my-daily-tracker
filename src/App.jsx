import React, { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";

import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  signInWithCustomToken,
  signInAnonymously
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  onSnapshot
} from 'firebase/firestore';
import { 
  Check, 
  Trash2, 
  LogOut, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  Smile,
  Meh,
  Frown,
  Sun,
  CloudRain,
  Loader2,
  ShoppingCart,
  ListTodo,
  Users,
  Link as LinkIcon,
  X
} from 'lucide-react';

// --- Firebase Configuration ---
const firebaseConfig = {
  apiKey: "AIzaSyAVlVw-5ibKUchfWv01BXDAwlI55mEQGAw",
  authDomain: "daily-to-do-96685.firebaseapp.com",
  projectId: "daily-to-do-96685",
  storageBucket: "daily-to-do-96685.firebasestorage.app",
  messagingSenderId: "816606348460",
  appId: "1:816606348460:web:190fac127753fe32580b09",
  measurementId: "G-0VKBVWRSQW"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'my-daily-tracker';
// 给你的应用起个名字，用于区分数据存储路径

// --- Mood Definitions ---
const MOODS = [
  { value: 1, icon: CloudRain, label: '糟糕', color: 'text-blue-600', bg: 'bg-blue-100' },
  { value: 2, icon: Frown, label: '低落', color: 'text-indigo-500', bg: 'bg-indigo-100' },
  { value: 3, icon: Meh, label: '平淡', color: 'text-gray-500', bg: 'bg-gray-100' },
  { value: 4, icon: Smile, label: '不错', color: 'text-orange-500', bg: 'bg-orange-100' },
  { value: 5, icon: Sun, label: '超棒', color: 'text-yellow-500', bg: 'bg-yellow-100' },
];

// --- Utility: Date String ---
const getDateString = (date) => {
  const offset = date.getTimezoneOffset() * 60000;
  return (new Date(date - offset)).toISOString().slice(0, 10);
};

// --- Auth Form Component ---
const AuthForm = ({ setUser }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      let msg = "操作失败，请重试。";
      if (err.code === 'auth/invalid-email') msg = "邮箱格式不正确。";
      if (err.code === 'auth/user-not-found') msg = "用户不存在。";
      if (err.code === 'auth/wrong-password') msg = "密码错误。";
      if (err.code === 'auth/email-already-in-use') msg = "该邮箱已被注册。";
      if (err.code === 'auth/operation-not-allowed') msg = "请使用下方游客试用按钮。";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await signInAnonymously(auth);
    } catch (err) {
      setError("游客登录失败，请稍后重试。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-indigo-600 p-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">DailyLog</h1>
          <p className="text-indigo-100">记录每一天的点滴与进步</p>
        </div>
        <div className="p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            {isLogin ? '欢迎回来' : '创建新账号'}
          </h2>
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">{error}</div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
              <input type="email" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">密码</label>
              <input type="password" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition flex justify-center items-center">
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (isLogin ? '登录' : '注册')}
            </button>
          </form>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <button type="button" onClick={handleGuestLogin} disabled={loading} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-lg transition flex justify-center items-center">
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : '游客免注册试用'}
            </button>
          </div>
          <div className="mt-6 text-center">
            <button onClick={() => setIsLogin(!isLogin)} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
              {isLogin ? '没有账号？点击注册' : '已有账号？点击登录'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Dashboard Component ---
const Dashboard = ({ user }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [todos, setTodos] = useState([]);
  const [shoppingList, setShoppingList] = useState([]);
  const [mood, setMood] = useState(null);
  
  const [newItemText, setNewItemText] = useState('');
  const [loadingData, setLoadingData] = useState(true);
  const [activeTab, setActiveTab] = useState('todo'); // 'todo' or 'shopping'
  
  // Sharing State
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareCode, setShareCode] = useState('');
  const [tempShareCode, setTempShareCode] = useState('');

  const dateStr = getDateString(currentDate);

  // Load Share Code from LocalStorage on mount
  useEffect(() => {
    const savedCode = localStorage.getItem('dailyLog_shareCode');
    if (savedCode) setShareCode(savedCode);
  }, []);

  // Data Fetching
  useEffect(() => {
    if (!user) return;
    setLoadingData(true);

    let docRef;
    if (shareCode) {
      // Public Shared Path: artifacts/{appId}/public/data/shared_logs/{shareCode}_{dateStr}
      docRef = doc(db, 'artifacts', appId, 'public', 'data', 'shared_logs', `${shareCode}_${dateStr}`);
    } else {
      // Private User Path: artifacts/{appId}/users/{userId}/dailyLogs/{dateStr}
      docRef = doc(db, 'artifacts', appId, 'users', user.uid, 'dailyLogs', dateStr);
    }
    
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setTodos(data.todos || []);
        setShoppingList(data.shoppingList || []);
        setMood(data.mood || null);
      } else {
        setTodos([]);
        setShoppingList([]);
        setMood(null);
      }
      setLoadingData(false);
    }, (error) => {
      console.error("Error fetching data:", error);
      setLoadingData(false);
    });

    return () => unsubscribe();
  }, [user, dateStr, shareCode]);

  // Save Data Helper
  const saveData = async (newTodos, newShopping, newMood) => {
    if (!user) return;
    try {
      let docRef;
      if (shareCode) {
        docRef = doc(db, 'artifacts', appId, 'public', 'data', 'shared_logs', `${shareCode}_${dateStr}`);
      } else {
        docRef = doc(db, 'artifacts', appId, 'users', user.uid, 'dailyLogs', dateStr);
      }

      await setDoc(docRef, {
        todos: newTodos !== undefined ? newTodos : todos,
        shoppingList: newShopping !== undefined ? newShopping : shoppingList,
        mood: newMood !== undefined ? newMood : mood,
        date: dateStr,
        updatedBy: user.email || 'Anonymous',
        lastUpdated: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.error("Error saving:", err);
    }
  };

  // --- Item Handlers (Generic for Todo and Shopping) ---
  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    
    const item = {
      id: Date.now().toString(),
      text: newItemText.trim(),
      completed: false
    };

    if (activeTab === 'todo') {
      const newStats = [...todos, item];
      setTodos(newStats);
      saveData(newStats, undefined, undefined);
    } else {
      const newStats = [...shoppingList, item];
      setShoppingList(newStats);
      saveData(undefined, newStats, undefined);
    }
    setNewItemText('');
  };

  const toggleItem = (id) => {
    if (activeTab === 'todo') {
      const newStats = todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
      setTodos(newStats);
      saveData(newStats, undefined, undefined);
    } else {
      const newStats = shoppingList.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
      setShoppingList(newStats);
      saveData(undefined, newStats, undefined);
    }
  };

  const deleteItem = (id) => {
    if (activeTab === 'todo') {
      const newStats = todos.filter(t => t.id !== id);
      setTodos(newStats);
      saveData(newStats, undefined, undefined);
    } else {
      const newStats = shoppingList.filter(t => t.id !== id);
      setShoppingList(newStats);
      saveData(undefined, newStats, undefined);
    }
  };

  const handleMoodSelect = (moodValue) => {
    setMood(moodValue);
    saveData(undefined, undefined, moodValue);
  };

  // --- Share Logic ---
  const handleJoinShare = () => {
    if (tempShareCode.trim()) {
      const code = tempShareCode.trim();
      setShareCode(code);
      localStorage.setItem('dailyLog_shareCode', code);
      setShowShareModal(false);
    }
  };

  const handleLeaveShare = () => {
    setShareCode('');
    localStorage.removeItem('dailyLog_shareCode');
    setShowShareModal(false);
  };

  // Progress Calc
  const currentList = activeTab === 'todo' ? todos : shoppingList;
  const completedCount = currentList.filter(t => t.completed).length;
  const progress = currentList.length === 0 ? 0 : Math.round((completedCount / currentList.length) * 100);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className={`shadow-sm sticky top-0 z-10 transition-colors duration-300 ${shareCode ? 'bg-indigo-900 text-white' : 'bg-white text-gray-800'}`}>
        <div className="max-w-3xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${shareCode ? 'bg-white text-indigo-900' : 'bg-indigo-600 text-white'}`}>
              {shareCode ? <Users size={18} /> : 'D'}
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight hidden sm:block">
                {shareCode ? `共享空间: ${shareCode}` : 'DailyLog'}
              </h1>
              {shareCode && <span className="text-xs opacity-80 block sm:hidden">共享中</span>}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowShareModal(true)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition ${
                shareCode 
                  ? 'bg-indigo-800 hover:bg-indigo-700 text-indigo-100' 
                  : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
              }`}
            >
              <LinkIcon size={14} />
              {shareCode ? '同步设置' : '开启同步'}
            </button>
            
            <button 
              onClick={() => signOut(auth)}
              className={`p-2 rounded-full transition ${shareCode ? 'hover:bg-indigo-800 text-indigo-200' : 'hover:bg-gray-100 text-gray-600'}`}
              title="退出登录"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 relative animate-in fade-in zoom-in duration-200">
            <button onClick={() => setShowShareModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-800">多人同步 / 共享</h3>
              <p className="text-sm text-gray-500 mt-1">输入相同的“共享码”，即可与朋友共同管理待办和购物清单。</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">共享码 (Room ID)</label>
                <input 
                  type="text" 
                  value={tempShareCode}
                  onChange={(e) => setTempShareCode(e.target.value)}
                  placeholder="例如: happy-home-2024"
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              
              <button 
                onClick={handleJoinShare}
                disabled={!tempShareCode.trim()}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white font-bold py-3 rounded-xl transition"
              >
                加入/切换空间
              </button>

              {shareCode && (
                <button 
                  onClick={handleLeaveShare}
                  className="w-full bg-white border border-red-200 text-red-600 hover:bg-red-50 font-bold py-3 rounded-xl transition"
                >
                  退出共享 (回到个人模式)
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 max-w-3xl mx-auto w-full p-4 space-y-6">
        {/* Date Navigator */}
        <div className="bg-white rounded-2xl shadow-sm p-4 flex items-center justify-between">
          <button onClick={() => {
            const d = new Date(currentDate); d.setDate(d.getDate() - 1); setCurrentDate(d);
          }} className="p-2 hover:bg-gray-100 rounded-full transition">
            <ChevronLeft size={24} className="text-gray-600" />
          </button>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 text-gray-800 font-bold text-lg">
              <Calendar size={18} className="text-indigo-500" />
              {currentDate.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <span className="text-xs text-gray-400 font-medium">
              {dateStr === getDateString(new Date()) ? '今天' : '历史记录'}
            </span>
          </div>
          <button onClick={() => {
            const d = new Date(currentDate); d.setDate(d.getDate() + 1); setCurrentDate(d);
          }} className="p-2 hover:bg-gray-100 rounded-full transition">
            <ChevronRight size={24} className="text-gray-600" />
          </button>
        </div>

        {loadingData ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-indigo-500 w-8 h-8" />
          </div>
        ) : (
          <>
            {/* Mood Section */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-gray-800 font-semibold mb-4 flex items-center gap-2">
                {shareCode ? '今日大家的心情' : '今日心情'}
                {mood && <span className="text-xs font-normal text-green-600 bg-green-50 px-2 py-0.5 rounded-full">已记录</span>}
              </h3>
              <div className="grid grid-cols-5 gap-2 sm:gap-4">
                {MOODS.map((m) => {
                  const isSelected = mood === m.value;
                  const Icon = m.icon;
                  return (
                    <button
                      key={m.value}
                      onClick={() => handleMoodSelect(m.value)}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200 ${
                        isSelected 
                          ? `${m.bg} ring-2 ring-offset-2 ring-indigo-500 scale-105 shadow-sm` 
                          : 'hover:bg-gray-50 text-gray-400 grayscale hover:grayscale-0'
                      }`}
                    >
                      <Icon size={32} className={isSelected ? m.color : ''} strokeWidth={isSelected ? 2.5 : 2} />
                      <span className={`text-xs font-medium ${isSelected ? 'text-gray-800' : 'text-gray-400'}`}>{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 bg-gray-200/50 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('todo')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                  activeTab === 'todo' ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <ListTodo size={16} />
                待办事项 ({todos.filter(t => !t.completed).length})
              </button>
              <button
                onClick={() => setActiveTab('shopping')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                  activeTab === 'shopping' ? 'bg-white shadow text-pink-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <ShoppingCart size={16} />
                购物清单 ({shoppingList.filter(t => !t.completed).length})
              </button>
            </div>

            {/* List Section */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col min-h-[400px]">
              <div className={`p-6 border-b border-gray-100 bg-gradient-to-r ${activeTab === 'todo' ? 'from-indigo-50' : 'from-pink-50'} to-white`}>
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <h3 className={`text-xl font-bold ${activeTab === 'todo' ? 'text-gray-800' : 'text-pink-900'}`}>
                      {activeTab === 'todo' ? '待办清单' : '购物清单'}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {currentList.length === 0 
                        ? (activeTab === 'todo' ? "今天还没有任务..." : "冰箱是空的？加点东西吧！")
                        : `已完成 ${completedCount} / ${currentList.length}`}
                    </p>
                  </div>
                  {currentList.length > 0 && (
                    <div className={`radial-progress ${activeTab === 'todo' ? 'text-indigo-600' : 'text-pink-600'} text-xs font-bold`} style={{ "--value": progress, "--size": "2.5rem" }}>
                      {progress}%
                    </div>
                  )}
                </div>
                <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-500 ease-out ${activeTab === 'todo' ? 'bg-indigo-500' : 'bg-pink-500'}`} style={{ width: `${progress}%` }} />
                </div>
              </div>

              {/* Add Input */}
              <div className="p-4 border-b border-gray-100">
                <form onSubmit={handleAddItem} className="flex gap-2">
                  <input
                    type="text"
                    className={`flex-1 px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 ${activeTab === 'todo' ? 'focus:ring-indigo-500' : 'focus:ring-pink-500'} outline-none text-gray-800 placeholder-gray-400 transition`}
                    placeholder={activeTab === 'todo' ? "添加一个新的任务..." : "需要买什么？例如: 牛奶"}
                    value={newItemText}
                    onChange={(e) => setNewItemText(e.target.value)}
                  />
                  <button
                    type="submit"
                    disabled={!newItemText.trim()}
                    className={`${activeTab === 'todo' ? 'bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300' : 'bg-pink-600 hover:bg-pink-700 disabled:bg-pink-300'} text-white p-3 rounded-xl transition shadow-sm flex items-center justify-center`}
                  >
                    <Plus size={24} />
                  </button>
                </form>
              </div>

              {/* List Content */}
              <div className="flex-1 overflow-y-auto p-2">
                {currentList.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                      {activeTab === 'todo' ? <Check className="text-gray-300" size={32} /> : <ShoppingCart className="text-gray-300" size={32} />}
                    </div>
                    <p>{activeTab === 'todo' ? '暂无任务' : '暂无购物项'}</p>
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {currentList.map((item) => (
                      <li 
                        key={item.id}
                        className={`group flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${
                          item.completed ? 'bg-gray-50' : 'bg-white hover:shadow-sm border border-transparent hover:border-gray-100'
                        }`}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <button
                            onClick={() => toggleItem(item.id)}
                            className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors duration-200 ${
                              item.completed 
                                ? (activeTab === 'todo' ? 'bg-indigo-500 border-indigo-500' : 'bg-pink-500 border-pink-500') + ' text-white'
                                : `border-gray-300 text-transparent ${activeTab === 'todo' ? 'hover:border-indigo-400' : 'hover:border-pink-400'}`
                            }`}
                          >
                            <Check size={14} strokeWidth={3} />
                          </button>
                          <span className={`truncate select-none transition-all duration-200 ${
                            item.completed ? 'text-gray-400 line-through' : 'text-gray-700 font-medium'
                          }`}>
                            {item.text}
                          </span>
                        </div>
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="text-gray-300 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition opacity-0 group-hover:opacity-100 focus:opacity-100"
                        >
                          <Trash2 size={18} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

// --- Main Root ---
export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
         try { await signInWithCustomToken(auth, __initial_auth_token); } catch (e) { console.error(e); }
      }
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setAuthLoading(false);
      });
      return () => unsubscribe();
    };
    initAuth();
  }, []);

  if (authLoading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-indigo-600" /></div>;
  return user ? <Dashboard user={user} /> : <AuthForm setUser={setUser} />;
}