import React, { useState } from 'react';
import {
  X,
  Radio,
  Users,
  Send,
  Sparkles,
  ShieldCheck,
  Flame,
  Heart,
  Rocket,
  Music,
  Smile,
} from 'lucide-react';
import { useParty } from '../context/PartyContext';
import { useAudio } from '../context/AudioContext';

interface PartyRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PartyRoomModal: React.FC<PartyRoomModalProps> = ({ isOpen, onClose }) => {
  const {
    isInParty,
    roomId,
    room,
    isHost,
    latencyMs,
    recentReactions,
    joinRoom,
    leaveRoom,
    sendChatMessage,
    sendReaction,
    createRoom,
  } = useParty();

  const { currentTrack } = useAudio();
  const [inputRoomId, setInputRoomId] = useState('vibe-lounge');
  const [userName, setUserName] = useState('');
  const [chatInput, setChatInput] = useState('');

  if (!isOpen) return null;

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputRoomId.trim()) {
      joinRoom(inputRoomId.trim(), userName || undefined);
    }
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatInput.trim()) {
      sendChatMessage(chatInput.trim());
      setChatInput('');
    }
  };

  const reactionEmojis = ['🔥', '❤️', '🚀', '🎵', '👏', '⚡'];

  return (
    <div
      id="party-modal-overlay"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 select-none"
      onClick={onClose}
    >
      {/* Floating Reactions on Canvas */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {recentReactions.map(r => (
          <div
            key={r.id}
            className="absolute text-4xl animate-bounce"
            style={{
              left: `${r.x}%`,
              top: `${r.y}%`,
              transition: 'all 2s ease-out',
            }}
          >
            {r.emoji}
          </div>
        ))}
      </div>

      <div
        id="party-modal-content"
        className="relative w-full max-w-2xl bg-[#181818] border border-[#2e2e2e] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-emerald-950/60 to-[#181818] border-b border-[#282828] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  {isInParty ? room?.name || 'Party Room' : 'Listen Along • Party Mode'}
                </h2>
                {isInParty && (
                  <span className="text-[10px] bg-emerald-500 text-black font-bold px-2 py-0.5 rounded-full">
                    LIVE
                  </span>
                )}
              </div>
              <p className="text-xs text-[#a7a7a7]">
                Real-time WebSocket audio synchronization with &lt;150ms drift tolerance
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#282828] text-[#a7a7a7] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {!isInParty ? (
          <div className="p-6 space-y-6">
            <div className="bg-[#202020] rounded-xl p-5 border border-[#2e2e2e] space-y-4">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-[#b3b3b3] leading-relaxed">
                  Join a live party to stream tracks together with friends in real-time. When the host plays, pauses, or scrubs through the timeline, everyone's client stays in perfect sync.
                </div>
              </div>

              <form onSubmit={handleJoin} className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-[#a7a7a7] mb-1">
                    Your Display Name
                  </label>
                  <input
                    type="text"
                    value={userName}
                    onChange={e => setUserName(e.target.value)}
                    placeholder="e.g. Alex M."
                    className="w-full bg-[#121212] border border-[#333] rounded-lg px-3.5 py-2 text-sm text-white focus:border-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#a7a7a7] mb-1">
                    Room Code / ID
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputRoomId}
                      onChange={e => setInputRoomId(e.target.value)}
                      placeholder="e.g. vibe-lounge"
                      className="flex-1 bg-[#121212] border border-[#333] rounded-lg px-3.5 py-2 text-sm text-white focus:border-emerald-500 outline-none font-mono"
                      required
                    />
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm transition-all shadow"
                    >
                      Join Room
                    </button>
                  </div>
                </div>
              </form>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-[#727272]">Or start a fresh session as host:</span>
              <button
                onClick={() => createRoom('VIP Session')}
                className="px-4 py-2 rounded-lg bg-[#282828] hover:bg-[#333] text-white text-xs font-semibold border border-[#3e3e3e] transition-colors"
              >
                + Create New Room
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col min-h-0">
            {/* Active Room Top Info Banner */}
            <div className="px-6 py-3 bg-[#1e1e1e] border-b border-[#282828] flex items-center justify-between text-xs">
              <div className="flex items-center gap-4 text-[#a7a7a7]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-white font-semibold">
                    {isHost ? 'You are Host (Broadcasting)' : `Host: ${room?.hostName}`}
                  </span>
                </div>
                <div>Latency: <span className="font-mono text-emerald-400">{latencyMs}ms</span></div>
                <div>Room Code: <span className="font-mono text-white select-all">{roomId}</span></div>
              </div>

              <button
                onClick={leaveRoom}
                className="text-xs text-rose-400 hover:text-rose-300 font-medium"
              >
                Leave Room
              </button>
            </div>

            {/* Room Body: Split between Members & Live Chat */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#282828] overflow-hidden min-h-[280px]">
              {/* Left Column: Members List */}
              <div className="p-4 overflow-y-auto space-y-3 custom-scrollbar">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#727272]">
                  Listeners ({room?.members.length || 1})
                </span>

                <div className="space-y-2">
                  {room?.members.map(member => (
                    <div
                      key={member.id}
                      className="flex items-center gap-2.5 p-2 rounded-lg bg-[#202020] border border-[#282828]"
                    >
                      <img
                        src={member.avatarUrl}
                        alt={member.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-white truncate flex items-center gap-1">
                          <span>{member.name}</span>
                          {member.isHost && (
                            <span title="Room Host">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-[#727272] font-mono">
                          {member.latencyMs}ms ping
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Chat & Reaction Feed */}
              <div className="md:col-span-2 flex flex-col p-4 overflow-hidden">
                <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar text-xs">
                  {room?.messages.map(msg => (
                    <div
                      key={msg.id}
                      className={`p-2.5 rounded-lg max-w-[85%] ${
                        msg.isReaction
                          ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/20'
                          : 'bg-[#242424] text-white'
                      }`}
                    >
                      <span className="font-bold text-[#a7a7a7] mr-1.5">{msg.senderName}:</span>
                      <span>{msg.message}</span>
                    </div>
                  ))}
                </div>

                {/* Reaction Quick Bar */}
                <div className="pt-3 flex items-center gap-2">
                  <span className="text-[10px] text-[#727272] uppercase font-bold">React:</span>
                  <div className="flex items-center gap-1.5">
                    {reactionEmojis.map(emoji => (
                      <button
                        key={emoji}
                        onClick={() => sendReaction(emoji)}
                        className="w-7 h-7 rounded bg-[#242424] hover:bg-[#343434] hover:scale-110 active:scale-95 text-base flex items-center justify-center transition-all"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendChat} className="mt-2 flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    placeholder="Send a message to the room..."
                    className="flex-1 bg-[#121212] border border-[#333] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    className="p-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
