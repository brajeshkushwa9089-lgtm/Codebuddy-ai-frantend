import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import {
  MessageSquare,
  Send,
  Plus,
  Trash2,
  Edit2,
  Check,
  Bot,
  User,
  Loader2,
  Code2,
  Sparkles,
  AlertCircle,
} from 'lucide-react';

export default function TutorChatPage() {
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [language, setLanguage] = useState('python');

  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  // Renaming state
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const res = await api.get('/conversations');
      const list = res?.data?.conversations || [];
      setConversations(list);
      if (list.length > 0 && !activeConversationId) {
        selectConversation(list[0].id);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const selectConversation = async (id) => {
    setActiveConversationId(id);
    setError('');
    try {
      const res = await api.get(`/conversations/${id}`);
      setMessages(res?.data?.messages || []);
      if (res?.data?.conversation?.language) {
        setLanguage(res.data.conversation.language);
      }
    } catch (err) {
      setError(err.message || 'Failed to load conversation history');
    }
  };

  const handleNewConversation = async () => {
    try {
      const res = await api.post('/conversations', {
        title: `Tutoring Session (${language})`,
        language,
      });
      const newConvo = res?.data?.conversation;
      if (newConvo) {
        setConversations([newConvo, ...conversations]);
        setActiveConversationId(newConvo.id);
        setMessages([]);
      }
    } catch (err) {
      setError(err.message || 'Failed to start new conversation');
    }
  };

  const handleDeleteConversation = async (id, e) => {
    e.stopPropagation();
    try {
      await api.delete(`/conversations/${id}`);
      const remaining = conversations.filter((c) => c.id !== id);
      setConversations(remaining);
      if (activeConversationId === id) {
        if (remaining.length > 0) {
          selectConversation(remaining[0].id);
        } else {
          setActiveConversationId(null);
          setMessages([]);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to delete conversation');
    }
  };

  const handleStartRename = (convo, e) => {
    e.stopPropagation();
    setEditingId(convo.id);
    setEditTitle(convo.title);
  };

  const handleSaveRename = async (id, e) => {
    e.stopPropagation();
    try {
      await api.patch(`/conversations/${id}`, { title: editTitle });
      setConversations(
        conversations.map((c) => (c.id === id ? { ...c, title: editTitle } : c))
      );
      setEditingId(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || sending) return;

    const userText = inputMessage.trim();
    setInputMessage('');
    setError('');

    // Optimistically show user message
    const tempUserMsg = {
      id: 'temp-' + Date.now(),
      role: 'user',
      content: userText,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      setSending(true);

      // If no active conversation, create one first
      let currentConvoId = activeConversationId;
      if (!currentConvoId) {
        const createRes = await api.post('/conversations', {
          title: userText.slice(0, 30) + '...',
          language,
        });
        currentConvoId = createRes?.data?.conversation?.id;
        setActiveConversationId(currentConvoId);
        setConversations([createRes.data.conversation, ...conversations]);
      }

      const res = await api.post('/ai/chat', {
        conversationId: currentConvoId,
        message: userText,
        language,
      });

      const assistantReply = {
        id: 'reply-' + Date.now(),
        role: 'assistant',
        content: res.data.message,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantReply]);
    } catch (err) {
      setError(err.message || 'AI tutor failed to respond. Ensure AI provider is running.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex flex-col h-[calc(100vh-8rem)]">
      {/* Top Banner */}
      <div className="flex items-center justify-between pb-4 border-b border-dark-border mb-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-brand-400" />
            <span>AI Tutor Chat</span>
          </h1>
          <p className="text-xs text-slate-400">
            Ask concept questions, request examples, or discuss algorithms with your 24/7 mentor.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-dark-card border border-dark-border text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-brand-500 font-medium"
          >
            <option value="python">Python Context</option>
            <option value="c">C Context</option>
            <option value="cpp">C++ Context</option>
            <option value="javascript">JavaScript Context</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2 text-xs text-rose-300">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Chat Workspace */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 overflow-hidden">
        {/* Left Sidebar: Conversations List */}
        <div className="hidden md:flex flex-col bg-dark-card border border-dark-border rounded-2xl p-3 overflow-hidden">
          <button
            type="button"
            onClick={handleNewConversation}
            className="w-full py-2 px-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors mb-3"
          >
            <Plus className="w-4 h-4" />
            <span>New Conversation</span>
          </button>

          <div className="flex-1 overflow-y-auto space-y-1 pr-1">
            {conversations.map((convo) => {
              const isActive = convo.id === activeConversationId;
              const isEditing = editingId === convo.id;

              return (
                <div
                  key={convo.id}
                  onClick={() => selectConversation(convo.id)}
                  className={`group flex items-center justify-between p-2.5 rounded-xl text-xs cursor-pointer transition-all ${
                    isActive
                      ? 'bg-brand-600/20 border border-brand-500/40 text-brand-300'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-dark-hover'
                  }`}
                >
                  {isEditing ? (
                    <div className="flex items-center gap-1 w-full" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full bg-dark-bg px-2 py-0.5 rounded text-xs text-white border border-brand-500"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={(e) => handleSaveRename(convo.id, e)}
                        className="p-1 text-emerald-400 hover:text-emerald-300"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 truncate">
                        <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate font-medium">{convo.title}</span>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={(e) => handleStartRename(convo, e)}
                          className="p-1 hover:text-white"
                          title="Rename"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteConversation(convo.id, e)}
                          className="p-1 hover:text-rose-400"
                          title="Delete"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}

            {conversations.length === 0 && !loading && (
              <div className="text-center py-8 text-xs text-slate-500">
                No past conversations. Start a new one!
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Chat Window */}
        <div className="md:col-span-3 flex flex-col bg-dark-surface border border-dark-border rounded-2xl overflow-hidden">
          {/* Messages Flow */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-brand-600/10 text-brand-400 flex items-center justify-center">
                  <Bot className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white">How can CodeBuddy help you today?</h3>
                <p className="text-xs text-slate-400 max-w-md">
                  Ask about memory management in C, recursion in Python, vector algorithms in C++, or promises in JavaScript.
                </p>
                <div className="flex flex-wrap justify-center gap-2 pt-2">
                  {[
                    'Explain pointers like I am 5',
                    'How does quicksort work?',
                    'Difference between malloc and calloc',
                    'Why do we use async/await?',
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setInputMessage(preset)}
                      className="px-3 py-1.5 rounded-lg bg-dark-card hover:bg-dark-hover border border-dark-border text-slate-300 text-xs transition-colors"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((m, idx) => {
                const isAssistant = m.role === 'assistant';
                return (
                  <div
                    key={m.id || idx}
                    className={`flex items-start gap-3 ${isAssistant ? '' : 'flex-row-reverse'}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        isAssistant
                          ? 'bg-brand-600/20 text-brand-400 border border-brand-500/30'
                          : 'bg-dark-card border border-dark-border text-slate-300'
                      }`}
                    >
                      {isAssistant ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>

                    <div
                      className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                        isAssistant
                          ? 'bg-dark-card border border-dark-border text-slate-200'
                          : 'bg-brand-600 text-white shadow-md shadow-brand-500/10'
                      }`}
                    >
                      <div className="whitespace-pre-line font-sans">{m.content}</div>
                    </div>
                  </div>
                );
              })
            )}

            {sending && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-brand-600/20 text-brand-400 border border-brand-500/30 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-dark-card border border-dark-border rounded-2xl px-4 py-3 flex items-center gap-2 text-xs text-slate-400">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-400" />
                  <span>CodeBuddy is reasoning...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Message Input Form */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-dark-card border-t border-dark-border flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={`Ask a question about ${language.toUpperCase()}...`}
              className="flex-1 bg-dark-bg border border-dark-border rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-brand-500 font-sans"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || sending}
              className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-brand-500/20 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

