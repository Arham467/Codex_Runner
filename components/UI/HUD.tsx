/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React, { useState, useEffect, useRef } from 'react';
import { Heart, Zap, Trophy, MapPin, Diamond, Rocket, ArrowUpCircle, Shield, Activity, PlusCircle, Play, Settings, X, Volume2, Pause, RotateCcw, Github } from 'lucide-react';
import { useStore } from '../../store';
import { GameStatus, LETTER_COLORS, LEVEL_TARGETS, ShopItem, RUN_SPEED_BASE } from '../../types';
import { audio } from '../System/Audio';

// Available Shop Items
// Custom Cuttlefish Icon to mimic fa-cuttlefish
const CuttlefishIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className={className} fill="currentColor">
        <path d="M348 305.5c-17.5 31.6-57.4 54.5-96 54.5-56.6 0-104-47.4-104-104s47.4-104 104-104c38.6 0 78.5 22.9 96 54.5 13.7-50.9 41.7-93.3 87-117.8-45.3-49.6-110.5-80.7-183-80.7-137 0-248 111-248 248S115 504 252 504c72.5 0 137.7-31.1 183-80.7-45.3-24.5-73.3-66.9-87-117.8z"/>
    </svg>
);

const SHOP_ITEMS: ShopItem[] = [
    {
        id: 'DOUBLE_JUMP',
        name: 'DOUBLE JUMP',
        description: 'Jump again in mid-air. Essential for high obstacles.',
        cost: 1000,
        icon: ArrowUpCircle,
        oneTime: true
    },
    {
        id: 'MAX_LIFE',
        name: 'MAX LIFE UP',
        description: 'Permanently adds a heart slot and heals you.',
        cost: 1500,
        icon: Activity
    },
    {
        id: 'HEAL',
        name: 'REPAIR KIT',
        description: 'Restores 1 Life point instantly.',
        cost: 1000,
        icon: PlusCircle
    },
    {
        id: 'IMMORTAL',
        name: 'IMMORTALITY',
        description: 'Unlock Ability: Press Space/Tap to be invincible for 5s.',
        cost: 3000,
        icon: Shield,
        oneTime: true
    }
];

const ShopScreen: React.FC = () => {
    const { score, buyItem, closeShop, hasDoubleJump, hasImmortality } = useStore();
    const [items, setItems] = useState<ShopItem[]>([]);

    useEffect(() => {
        // Select 3 random items, filtering out one-time items already bought
        let pool = SHOP_ITEMS.filter(item => {
            if (item.id === 'DOUBLE_JUMP' && hasDoubleJump) return false;
            if (item.id === 'IMMORTAL' && hasImmortality) return false;
            return true;
        });

        // Shuffle and pick 3
        pool = pool.sort(() => 0.5 - Math.random());
        setItems(pool.slice(0, 3));
    }, []);

    return (
        <div className="absolute inset-0 bg-black/90 z-[100] text-white pointer-events-auto backdrop-blur-md overflow-y-auto">
             <div className="flex flex-col items-center justify-center min-h-full py-8 px-4">
                 <h2 className="text-3xl md:text-4xl font-black text-cyan-400 mb-2 font-cyber tracking-widest text-center">CYBER SHOP</h2>
                 <div className="flex items-center text-yellow-400 mb-6 md:mb-8">
                     <span className="text-base md:text-lg mr-2">AVAILABLE CREDITS:</span>
                     <span className="text-xl md:text-2xl font-bold">{score.toLocaleString()}</span>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl w-full mb-8">
                     {items.map(item => {
                         const Icon = item.icon;
                         const canAfford = score >= item.cost;
                         return (
                             <div key={item.id} className="bg-gray-900/80 border border-gray-700 p-4 md:p-6 rounded-xl flex flex-col items-center text-center hover:border-cyan-500 transition-colors">
                                 <div className="bg-gray-800 p-3 md:p-4 rounded-full mb-3 md:mb-4">
                                     <Icon className="w-6 h-6 md:w-8 md:h-8 text-cyan-400" />
                                 </div>
                                 <h3 className="text-lg md:text-xl font-bold mb-2">{item.name}</h3>
                                 <p className="text-gray-400 text-xs md:text-sm mb-4 h-10 md:h-12 flex items-center justify-center">{item.description}</p>
                                 <button 
                                    onClick={() => buyItem(item.id as any, item.cost)}
                                    disabled={!canAfford}
                                    className={`px-4 md:px-6 py-2 rounded font-bold w-full text-sm md:text-base ${canAfford ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:brightness-110' : 'bg-gray-700 cursor-not-allowed opacity-50'}`}
                                 >
                                     {item.cost} GEMS
                                 </button>
                             </div>
                         );
                     })}
                 </div>

                 <button 
                    onClick={closeShop}
                    className="flex items-center px-8 md:px-10 py-3 md:py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg md:text-xl rounded hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,0,255,0.4)]"
                 >
                     RESUME MISSION <Play className="ml-2 w-5 h-5" fill="white" />
                 </button>
             </div>
        </div>
    );
};

const SettingsScreen: React.FC = () => {
    const { masterVolume, setMasterVolume, setStatus } = useStore();

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value);
        setMasterVolume(val);
        audio.setVolume(val);
    };

    return (
        <div className="absolute inset-0 flex items-center justify-center z-[110] bg-black/90 backdrop-blur-md p-4 pointer-events-auto animate-in fade-in zoom-in-95 duration-300">
            <div className="relative w-full max-w-sm bg-gray-900 border border-white/10 rounded-3xl p-8 shadow-[0_0_50px_rgba(0,255,255,0.1)]">
                <button 
                  onClick={() => setStatus(GameStatus.MENU)}
                  className="absolute top-4 right-4 text-white/50 hover:text-white"
                >
                    <X className="w-6 h-6" />
                </button>

                <h2 className="text-2xl font-black text-cyan-400 font-cyber mb-10 tracking-widest text-center uppercase">System Settings</h2>

                <div className="space-y-8">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center text-white/80 font-bold uppercase tracking-wider text-sm">
                                <Volume2 className="mr-2 w-4 h-4 text-cyan-400" /> Master Volume
                            </div>
                            <span className="text-cyan-400 font-mono text-sm">{Math.round(masterVolume * 100)}%</span>
                        </div>
                        <input 
                            type="range" 
                            min="0" 
                            max="1" 
                            step="0.01" 
                            value={masterVolume} 
                            onChange={handleVolumeChange}
                            className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                        />
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <p className="text-white/20 text-[10px] font-mono tracking-widest uppercase">Encryption: Active</p>
                </div>
            </div>
        </div>
    );
};

const CreatorScreen: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    return (
        <div className="absolute inset-0 flex items-center justify-center z-[250] bg-black/90 backdrop-blur-xl p-4 pointer-events-auto animate-in fade-in zoom-in-95 duration-300">
            <div className="relative w-full max-w-lg bg-black border border-cyan-500/30 rounded-[2rem] shadow-[0_0_80px_rgba(0,255,255,0.15)] flex flex-col overflow-hidden">
                {/* Background Glows */}
                <div className="absolute -top-24 -left-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

                {/* Close Button - Increased hit area for mobile */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                  }}
                  className="absolute top-2 right-2 md:top-4 md:right-4 p-4 text-white/40 hover:text-white hover:bg-white/10 rounded-full transition-all z-[260] touch-manipulation"
                  aria-label="Close modal"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="p-6 md:p-10">
                    <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="w-14 h-14 md:w-20 md:h-20 rounded-full border-2 border-cyan-500 flex items-center justify-center mb-4 md:mb-6 shadow-[0_0_20px_rgba(0,255,255,0.3)] shrink-0">
                            <CuttlefishIcon className="w-8 h-8 md:w-12 md:h-12 text-cyan-400" />
                        </div>

                        <h2 className="text-xl md:text-3xl font-black text-white mb-1.5 font-cyber tracking-widest uppercase leading-tight">
                            TAWFIQUR <span className="text-cyan-400">ARHAM</span>
                        </h2>
                        
                        <div className="h-0.5 w-12 md:w-20 bg-gradient-to-r from-cyan-500 to-purple-500 mb-4 md:mb-6 shrink-0"></div>

                        <p className="text-gray-300 text-xs md:text-sm leading-relaxed font-medium mb-6 md:mb-8 max-w-sm">
                            Sophomore Computer Science student at The University of Southern Mississippi with a strong focus on machine learning and data science. Proficient in Python, C++, and front-end development, with leadership experience in marketing and operations. Passionate about building AI research through hands-on projects.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center w-full max-w-sm mb-6 md:mb-8">
                            <a 
                                href="https://app.joinhandshake.com/profiles/ta27" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="group relative flex-1 inline-flex items-center justify-center px-5 py-2.5 md:py-3 bg-transparent border-2 border-cyan-500 text-cyan-400 font-bold text-xs rounded-full hover:bg-cyan-500 hover:text-black transition-all duration-300 shadow-[0_0_10px_rgba(0,255,255,0.15)] hover:shadow-[0_0_20px_rgba(0,255,255,0.4)] tracking-[0.1em] uppercase touch-manipulation"
                            >
                                HANDSHAKE
                            </a>
                            <a 
                                href="https://github.com/Arham467" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="group relative flex-1 inline-flex items-center justify-center px-5 py-2.5 md:py-3 bg-transparent border-2 border-purple-500 text-purple-400 font-bold text-xs rounded-full hover:bg-purple-500 hover:text-white transition-all duration-300 shadow-[0_0_10px_rgba(168,85,247,0.15)] hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] tracking-[0.1em] uppercase touch-manipulation"
                            >
                                <Github className="w-4 h-4 mr-2" /> GITHUB
                            </a>
                        </div>

                        <div className="flex flex-col items-center opacity-30 mt-auto">
                            <p className="text-white text-[8px] md:text-[10px] font-mono tracking-[0.4em] uppercase mb-1">Developer Identity Verified</p>
                            <div className="flex space-x-1">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="w-1 h-1 bg-cyan-500 rounded-full"></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const PauseScreen: React.FC = () => {
    const { setStatus, restartGame } = useStore();

    return (
        <div className="absolute inset-0 flex items-center justify-center z-[110] bg-black/70 backdrop-blur-md p-4 pointer-events-auto animate-in fade-in duration-300">
            <div className="w-full max-w-xs space-y-4">
                <h2 className="text-4xl font-black text-white font-cyber mb-12 tracking-[0.3em] text-center uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">PAUSED</h2>
                
                <button 
                    onClick={() => setStatus(GameStatus.PLAYING)}
                    className="w-full flex items-center justify-center py-4 bg-cyan-500 text-black font-black text-xl rounded-xl hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(0,255,255,0.4)]"
                >
                    RESUME <Play className="ml-2 w-6 h-6 fill-black" />
                </button>

                <button 
                    onClick={() => { audio.init(); restartGame(); }}
                    className="w-full flex items-center justify-center py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold text-lg rounded-xl hover:bg-white/20 transition-all"
                >
                    RESTART <RotateCcw className="ml-2 w-5 h-5" />
                </button>

                <button 
                    onClick={() => setStatus(GameStatus.MENU)}
                    className="w-full flex items-center justify-center py-4 text-white/50 hover:text-white transition-all text-sm font-mono tracking-widest"
                >
                    QUIT TO MAIN MENU
                </button>
            </div>
        </div>
    );
};

export const HUD: React.FC = () => {
  const { score, lives, maxLives, collectedLetters, status, level, restartGame, startGame, setStatus, gemsCollected, distance, isImmortalityActive, speed } = useStore();
  const target = LEVEL_TARGETS[level] || LEVEL_TARGETS[1];
  const lastNonCreatorStatus = useRef<GameStatus>(status);

  useEffect(() => {
    if (status !== GameStatus.CREATOR) {
        lastNonCreatorStatus.current = status;
    }
  }, [status]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            if (status === GameStatus.PLAYING) {
                setStatus(GameStatus.PAUSED);
            } else if (status === GameStatus.PAUSED) {
                setStatus(GameStatus.PLAYING);
            }
        }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status, setStatus]);

  // Common container style
  const containerClass = "absolute inset-0 pointer-events-none flex flex-col justify-between p-4 md:p-8 z-50";

  if (status === GameStatus.SHOP) {
      return <ShopScreen />;
  }

  if (status === GameStatus.SETTINGS) {
      return <SettingsScreen />;
  }

  if (status === GameStatus.CREATOR) {
      return <CreatorScreen onClose={() => setStatus(lastNonCreatorStatus.current)} />;
  }

  if (status === GameStatus.PAUSED) {
      return <PauseScreen />;
  }

  if (status === GameStatus.MENU) {
      return (
          <div className="absolute inset-0 flex items-center justify-center z-[100] bg-black/80 backdrop-blur-sm p-4 pointer-events-auto">
              {/* Settings Button */}
              <button 
                onClick={() => setStatus(GameStatus.SETTINGS)}
                className="absolute top-8 right-8 p-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-full hover:bg-white/10 hover:border-cyan-500/50 transition-all text-white/70 hover:text-cyan-400 z-[120]"
              >
                  <Settings className="w-6 h-6" />
              </button>

              <button 
                onClick={() => setStatus(GameStatus.CREATOR)}
                className="absolute top-24 right-8 w-12 h-12 flex items-center justify-center bg-white/5 backdrop-blur-md border border-white/10 rounded-full hover:bg-white/10 hover:border-cyan-500/50 transition-all text-white/70 hover:text-cyan-400 z-[120] shadow-[0_0_15px_rgba(0,255,255,0.1)] group"
              >
                  <CuttlefishIcon className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </button>
              
              {/* Central Content */}
              <div className="flex flex-col items-center justify-center space-y-8 animate-in zoom-in-95 duration-500">
                <button 
                    onClick={() => { audio.init(); startGame(); }}
                    className="group relative px-12 py-5 bg-white/10 backdrop-blur-md border border-white/20 text-white font-black text-2xl rounded-2xl hover:bg-white/20 transition-all shadow-[0_0_30px_rgba(0,255,255,0.2)] hover:shadow-[0_0_50px_rgba(0,255,255,0.4)] hover:border-cyan-400 overflow-hidden tracking-[0.2em]"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/40 via-purple-500/40 to-pink-500/40 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                    <span className="relative z-10 flex items-center justify-center">
                        START ADVENTURE <Play className="ml-3 w-6 h-6 fill-white" />
                    </span>
                </button>

                <p className="text-cyan-400/60 text-[10px] min-[375px]:text-xs md:text-base font-mono tracking-[0.2em] md:tracking-[0.3em] uppercase animate-pulse text-center px-4">
                    [ ARROWS / SWIPE TO MOVE ]
                </p>
              </div>
              
              {/* Footer */}
              <div className="absolute bottom-8 left-0 w-full text-center text-white/30 font-mono text-[10px] md:text-xs tracking-[0.2em] uppercase z-[110]">
                  © 2026 CODEX RUNNER &bull; BUILT BY TA
              </div>
          </div>
      );
  }

  if (status === GameStatus.GAME_OVER) {
      return (
          <div className="absolute inset-0 bg-black/90 z-[100] text-white pointer-events-auto backdrop-blur-sm overflow-y-auto">
              <div className="flex flex-col items-center justify-center min-h-full py-8 px-4">
                <h1 className="text-4xl md:text-6xl font-black text-white mb-6 drop-shadow-[0_0_10px_rgba(255,0,0,0.8)] font-cyber text-center">GAME OVER</h1>
                
                <div className="grid grid-cols-1 gap-3 md:gap-4 text-center mb-8 w-full max-w-md">
                    <div className="bg-gray-900/80 p-3 md:p-4 rounded-lg border border-gray-700 flex items-center justify-between">
                        <div className="flex items-center text-yellow-400 text-sm md:text-base"><Trophy className="mr-2 w-4 h-4 md:w-5 md:h-5"/> LEVEL</div>
                        <div className="text-xl md:text-2xl font-bold font-mono">{level} / 3</div>
                    </div>
                    <div className="bg-gray-900/80 p-3 md:p-4 rounded-lg border border-gray-700 flex items-center justify-between">
                        <div className="flex items-center text-cyan-400 text-sm md:text-base"><Diamond className="mr-2 w-4 h-4 md:w-5 md:h-5"/> GEMS COLLECTED</div>
                        <div className="text-xl md:text-2xl font-bold font-mono">{gemsCollected}</div>
                    </div>
                    <div className="bg-gray-900/80 p-3 md:p-4 rounded-lg border border-gray-700 flex items-center justify-between">
                        <div className="flex items-center text-purple-400 text-sm md:text-base"><MapPin className="mr-2 w-4 h-4 md:w-5 md:h-5"/> DISTANCE</div>
                        <div className="text-xl md:text-2xl font-bold font-mono">{Math.floor(distance)} LY</div>
                    </div>
                     <div className="bg-gray-800/50 p-3 md:p-4 rounded-lg flex items-center justify-between mt-2">
                        <div className="flex items-center text-white text-sm md:text-base">TOTAL SCORE</div>
                        <div className="text-2xl md:text-3xl font-bold font-cyber text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">{score.toLocaleString()}</div>
                    </div>
                </div>

                <button 
                  onClick={() => { audio.init(); restartGame(); }}
                  className="px-8 md:px-10 py-3 md:py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg md:text-xl rounded hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,255,255,0.4)]"
                >
                    RUN AGAIN
                </button>

                <button 
                  onClick={() => { audio.init(); restartGame(); setStatus(GameStatus.MENU); }}
                  className="mt-4 text-sm font-mono tracking-[0.2em] text-white/70 hover:text-white hover:underline transition-all uppercase"
                >
                    RETURN TO MAIN MENU
                </button>
              </div>
          </div>
      );
  }

  if (status === GameStatus.VICTORY) {
    return (
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/90 to-black/95 z-[100] text-white pointer-events-auto backdrop-blur-md overflow-y-auto">
            <div className="flex flex-col items-center justify-center min-h-full py-8 px-4">
                <Rocket className="w-16 h-16 md:w-24 md:h-24 text-yellow-400 mb-4 animate-bounce drop-shadow-[0_0_15px_rgba(255,215,0,0.6)]" />
                <h1 className="text-3xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-500 to-pink-500 mb-2 drop-shadow-[0_0_20px_rgba(255,165,0,0.6)] font-cyber text-center leading-tight">
                    MISSION COMPLETE
                </h1>
                <p className="text-cyan-300 text-sm md:text-2xl font-mono mb-8 tracking-widest text-center">
                    THE ANSWER TO THE UNIVERSE HAS BEEN FOUND
                </p>
                
                <div className="grid grid-cols-1 gap-4 text-center mb-8 w-full max-w-md">
                    <div className="bg-black/60 p-6 rounded-xl border border-yellow-500/30 shadow-[0_0_15px_rgba(255,215,0,0.1)]">
                        <div className="text-xs md:text-sm text-gray-400 mb-1 tracking-wider">FINAL SCORE</div>
                        <div className="text-3xl md:text-4xl font-bold font-cyber text-yellow-400">{score.toLocaleString()}</div>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="bg-black/60 p-4 rounded-lg border border-white/10">
                            <div className="text-xs text-gray-400">GEMS</div>
                            <div className="text-xl md:text-2xl font-bold text-cyan-400">{gemsCollected}</div>
                        </div>
                        <div className="bg-black/60 p-4 rounded-lg border border-white/10">
                             <div className="text-xs text-gray-400">DISTANCE</div>
                            <div className="text-xl md:text-2xl font-bold text-purple-400">{Math.floor(distance)} LY</div>
                        </div>
                     </div>
                </div>

                <button 
                  onClick={() => { audio.init(); restartGame(); }}
                  className="px-8 md:px-12 py-4 md:py-5 bg-white text-black font-black text-lg md:text-xl rounded hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)] tracking-widest"
                >
                    RESTART MISSION
                </button>
            </div>
        </div>
    );
  }

  return (
    <div className={containerClass}>
        {/* Top Bar */}
        <div className="flex justify-between items-start w-full relative">
            <div className="flex flex-col">
                <div className="text-2xl min-[375px]:text-3xl md:text-5xl font-bold text-cyan-400 drop-shadow-[0_0_10px_#00ffff] font-cyber">
                    {score.toLocaleString()}
                </div>
            </div>
            
            {/* Level Indicator - Absolute positioned but responsive spacing */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 text-[10px] min-[375px]:text-xs md:text-lg text-purple-300 font-bold tracking-wider font-mono bg-black/50 px-2 py-0.5 md:px-3 md:py-1 rounded-full border border-purple-500/30 backdrop-blur-sm whitespace-nowrap">
                LVL {level} <span className="text-gray-500 text-[8px] md:text-sm">/ 3</span>
            </div>

            <div className="flex items-center space-x-2 md:space-x-4">
                <div className="flex space-x-1 md:space-x-2">
                    {[...Array(maxLives)].map((_, i) => (
                        <Heart 
                            key={i} 
                            className={`w-4 h-4 min-[375px]:w-6 min-[375px]:h-6 md:w-8 md:h-8 ${i < lives ? 'text-pink-500 fill-pink-500' : 'text-gray-800 fill-gray-800'} drop-shadow-[0_0_5px_#ff0054]`} 
                        />
                    ))}
                </div>

                <button 
                    onClick={() => setStatus(GameStatus.PAUSED)}
                    className="p-1.5 md:p-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-full hover:bg-white/10 text-white/70 hover:text-white pointer-events-auto transition-all"
                >
                    <Pause className="w-4 h-4 md:w-6 md:h-6" fill="currentColor" />
                </button>
            </div>
        </div>
        
        {/* Active Skill Indicator */}
        {isImmortalityActive && (
             <div className="absolute top-20 md:top-24 left-1/2 transform -translate-x-1/2 text-yellow-400 font-bold text-lg md:text-2xl animate-pulse flex items-center drop-shadow-[0_0_10px_gold]">
                 <Shield className="mr-2 fill-yellow-400 w-5 h-5 md:w-6 md:h-6" /> IMMORTAL
             </div>
        )}

        {/* Level Collection Status - Just below Top Bar */}
        <div className="absolute top-12 min-[375px]:top-16 md:top-24 left-1/2 transform -translate-x-1/2 flex space-x-1 md:space-x-3 w-full justify-center px-4">
            {target.map((char, idx) => {
                const isCollected = collectedLetters.includes(idx);
                const color = LETTER_COLORS[char] || '#ffffff';

                return (
                    <div 
                        key={idx}
                        style={{
                            borderColor: isCollected ? color : 'rgba(55, 65, 81, 1)',
                            // Use dark text (almost black) when collected to contrast with neon background
                            color: isCollected ? 'rgba(0, 0, 0, 0.8)' : 'rgba(55, 65, 81, 1)',
                            boxShadow: isCollected ? `0 0 20px ${color}` : 'none',
                            backgroundColor: isCollected ? color : 'rgba(0, 0, 0, 0.9)'
                        }}
                        className={`w-8 h-10 md:w-10 md:h-12 flex items-center justify-center border-2 font-black text-lg md:text-xl font-cyber rounded-lg transform transition-all duration-300`}
                    >
                        {char}
                    </div>
                );
            })}
        </div>

        {/* Bottom Overlay */}
        <div className="w-full flex justify-end items-end">
             <div className="flex items-center space-x-2 text-cyan-500 opacity-70">
                 <Zap className="w-4 h-4 md:w-6 md:h-6 animate-pulse" />
                 <span className="font-mono text-base md:text-xl">SPEED {Math.round((speed / RUN_SPEED_BASE) * 100)}%</span>
             </div>
        </div>
    </div>
  );
};
