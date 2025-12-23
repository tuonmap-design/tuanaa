import React, { useState, useEffect, useRef } from 'react';
import { Send, Image, Smile, User, LogOut, MessageCircle } from 'lucide-react';

const ZaloChatApp = () => {
  const [currentScreen, setCurrentScreen] = useState('login');
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState({});
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [loginUsername, setLoginUsername] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const emojis = ['😀', '😂', '😍', '🥰', '😊', '😎', '🤔', '😢', '😡', '👍', '❤️', '🎉', '🔥', '💯'];

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleRegister = () => {
    setError('');

    if (!registerUsername.trim() || !registerPassword.trim()) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    if (users[registerUsername]) {
      setError('Tên đăng nhập đã có người sử dụng, vui lòng chọn tên khác');
      return;
    }

    setUsers({
      ...users,
      [registerUsername]: {
        username: registerUsername,
        password: registerPassword,
        avatar: `https://ui-avatars.com/api/?name=${registerUsername}&background=random`
      }
    });

    setError('');
    setRegisterUsername('');
    setRegisterPassword('');
    alert('Đăng ký thành công! Vui lòng đăng nhập');
    setCurrentScreen('login');
  };

  const handleLogin = () => {
    setError('');

    if (!loginUsername.trim() || !loginPassword.trim()) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    const user = users[loginUsername];
    if (!user || user.password !== loginPassword) {
      setError('Tên đăng nhập hoặc mật khẩu không đúng');
      return;
    }

    setCurrentUser(user);
    setCurrentScreen('chat');
    setError('');
    setLoginUsername('');
    setLoginPassword('');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedUser(null);
    setMessages([]);
    setCurrentScreen('login');
  };

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedUser) return;

    const newMessage = {
      id: Date.now(),
      from: currentUser.username,
      to: selectedUser,
      text: messageInput,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      type: 'text'
    };

    setMessages([...messages, newMessage]);
    setMessageInput('');
    setShowEmojiPicker(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && selectedUser) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newMessage = {
          id: Date.now(),
          from: currentUser.username,
          to: selectedUser,
          image: event.target.result,
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          type: 'image'
        };
        setMessages([...messages, newMessage]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEmojiClick = (emoji) => {
    setMessageInput(messageInput + emoji);
    setShowEmojiPicker(false);
  };

  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter') {
      action();
    }
  };

  const getConversationMessages = () => {
    if (!selectedUser) return [];
    return messages.filter(
      msg => (msg.from === currentUser.username && msg.to === selectedUser) ||
             (msg.from === selectedUser && msg.to === currentUser.username)
    );
  };

  const otherUsers = Object.values(users).filter(u => u.username !== currentUser?.username);

  if (currentScreen === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <MessageCircle className="w-16 h-16 mx-auto text-blue-500 mb-4" />
            <h1 className="text-3xl font-bold text-gray-800">Zalo Chat</h1>
            <p className="text-gray-600 mt-2">Đăng nhập để trò chuyện</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tên đăng nhập</label>
              <input
                type="text"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, handleLogin)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nhập tên đăng nhập"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, handleLogin)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nhập mật khẩu"
              />
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <button
              onClick={handleLogin}
              className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition"
            >
              Đăng nhập
            </button>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => setCurrentScreen('register')}
              className="text-blue-500 hover:text-blue-600 font-medium"
            >
              Chưa có tài khoản? Đăng ký ngay
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentScreen === 'register') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <User className="w-16 h-16 mx-auto text-purple-500 mb-4" />
            <h1 className="text-3xl font-bold text-gray-800">Tạo tài khoản</h1>
            <p className="text-gray-600 mt-2">Đăng ký để bắt đầu trò chuyện</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tên đăng nhập</label>
              <input
                type="text"
                value={registerUsername}
                onChange={(e) => setRegisterUsername(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, handleRegister)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Chọn tên đăng nhập"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu</label>
              <input
                type="password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, handleRegister)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Tạo mật khẩu"
              />
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <button
              onClick={handleRegister}
              className="w-full bg-purple-500 text-white py-3 rounded-lg font-semibold hover:bg-purple-600 transition"
            >
              Đăng ký
            </button>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => setCurrentScreen('login')}
              className="text-purple-500 hover:text-purple-600 font-medium"
            >
              Đã có tài khoản? Đăng nhập
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r flex flex-col">
        <div className="bg-blue-500 text-white p-4 flex items-center justify-between">
          <div className="flex items-center">
            <img
              src={currentUser.avatar}
              alt="Avatar"
              className="w-10 h-10 rounded-full mr-3"
            />
            <div>
              <h2 className="font-semibold">{currentUser.username}</h2>
              <p className="text-xs text-blue-100">Đang hoạt động</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="hover:bg-blue-600 p-2 rounded-lg transition"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b">
          <h3 className="font-semibold text-gray-700 mb-2">Danh sách người dùng</h3>
        </div>

        <div className="flex-1 overflow-y-auto">
          {otherUsers.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              Chưa có người dùng khác
            </div>
          ) : (
            otherUsers.map(user => (
              <div
                key={user.username}
                onClick={() => setSelectedUser(user.username)}
                className={`p-4 flex items-center cursor-pointer hover:bg-gray-50 transition ${
                  selectedUser === user.username ? 'bg-blue-50' : ''
                }`}
              >
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-12 h-12 rounded-full mr-3"
                />
                <div>
                  <h4 className="font-semibold text-gray-800">{user.username}</h4>
                  <p className="text-sm text-gray-500">Nhấn để trò chuyện</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            <div className="bg-white border-b p-4 flex items-center">
              <img
                src={users[selectedUser]?.avatar}
                alt={selectedUser}
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <h3 className="font-semibold text-gray-800">{selectedUser}</h3>
                <p className="text-sm text-green-500">Đang hoạt động</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {getConversationMessages().map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${msg.from === currentUser.username ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-md ${msg.from === currentUser.username ? 'order-2' : 'order-1'}`}>
                    {msg.type === 'text' ? (
                      <div
                        className={`px-4 py-2 rounded-2xl ${
                          msg.from === currentUser.username
                            ? 'bg-blue-500 text-white'
                            : 'bg-white text-gray-800'
                        }`}
                      >
                        {msg.text}
                      </div>
                    ) : (
                      <img
                        src={msg.image}
                        alt="Sent"
                        className="max-w-xs rounded-lg shadow-md"
                      />
                    )}
                    <p className="text-xs text-gray-500 mt-1 px-2">{msg.timestamp}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="bg-white border-t p-4">
              {showEmojiPicker && (
                <div className="mb-2 flex flex-wrap gap-2 p-2 bg-gray-50 rounded-lg">
                  {emojis.map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => handleEmojiClick(emoji)}
                      className="text-2xl hover:bg-gray-200 p-2 rounded transition"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                  title="Gửi ảnh"
                >
                  <Image className="w-6 h-6 text-gray-600" />
                </button>
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                  title="Chọn icon"
                >
                  <Smile className="w-6 h-6 text-gray-600" />
                </button>
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, handleSendMessage)}
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 transition"
                  title="Gửi tin nhắn"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center text-gray-500">
              <MessageCircle className="w-20 h-20 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2">Chào mừng đến với Zalo Chat</h3>
              <p>Chọn một người dùng để bắt đầu trò chuyện</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
