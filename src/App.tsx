/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  BookOpen, 
  Trophy,
  Filter,
  ChevronRight,
  ExternalLink,
  Info
} from 'lucide-react';
import { questions } from './data/questions';
import { Difficulty, GrammarPoint, Question, Option } from './types';

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | 'All'>('All');
  const [categoryFilter, setCategoryFilter] = useState<GrammarPoint | 'All'>('All');

  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      const diffMatch = difficultyFilter === 'All' || q.difficulty === difficultyFilter;
      const catMatch = categoryFilter === 'All' || q.category === categoryFilter;
      return diffMatch && catMatch;
    });
  }, [difficultyFilter, categoryFilter]);

  const currentQuestion = filteredQuestions[currentIndex];

  const handleOptionSelect = (option: Option) => {
    if (isSubmitted) return;
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    if (!selectedOption || isSubmitted) return;
    setIsSubmitted(true);
    if (selectedOption.isCorrect) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setScore(0);
    setIsFinished(false);
  };

  const getEncouragement = (score: number, total: number) => {
    const ratio = score / total;
    if (ratio === 1) return "太棒了！你是语法大师！";
    if (ratio >= 0.8) return "做得好！继续保持！";
    if (ratio >= 0.6) return "不错，再接再厉！";
    return "加油，多练习会进步的！";
  };

  if (filteredQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-[#F5F5F0] flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-sm text-center max-w-md">
          <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-serif font-medium mb-2">未找到匹配题目</h2>
          <p className="text-gray-500 mb-6">尝试调整筛选条件以查看更多题目。</p>
          <button 
            onClick={() => { setDifficultyFilter('All'); setCategoryFilter('All'); }}
            className="px-6 py-2 bg-[#5A5A40] text-white rounded-full hover:bg-[#4A4A30] transition-colors"
          >
            重置筛选
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-[#1A1A1A] font-sans selection:bg-[#5A5A40]/20">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-bottom border-black/5 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#5A5A40] rounded-xl flex items-center justify-center text-white">
              <BookOpen size={24} />
            </div>
            <div>
              <h1 className="text-xl font-serif font-bold tracking-tight">GrammarMaster</h1>
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Interactive Learning</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {!isFinished && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-500">
                <span>进度: {currentIndex + 1} / {filteredQuestions.length}</span>
                <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#5A5A40] transition-all duration-500" 
                    style={{ width: `${((currentIndex + 1) / filteredQuestions.length) * 100}%` }}
                  />
                </div>
              </div>
            )}
            <button 
              onClick={handleReset}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
              title="重新开始"
            >
              <RotateCcw size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {!isFinished ? (
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Filters (Only show on first question or as a toggle) */}
              {currentIndex === 0 && !isSubmitted && (
                <div className="flex flex-wrap gap-4 items-center bg-white/50 p-4 rounded-2xl border border-black/5">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Filter size={16} />
                    <span className="font-medium">筛选:</span>
                  </div>
                  <select 
                    value={difficultyFilter}
                    onChange={(e) => setDifficultyFilter(e.target.value as any)}
                    className="bg-white border border-black/10 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-[#5A5A40]/20"
                  >
                    <option value="All">所有难度</option>
                    {Object.values(Difficulty).map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <select 
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value as any)}
                    className="bg-white border border-black/10 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-[#5A5A40]/20"
                  >
                    <option value="All">所有知识点</option>
                    {Object.values(GrammarPoint).map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
              )}

              {/* Question Card */}
              <div className="bg-white rounded-[32px] p-8 sm:p-12 shadow-sm border border-black/5 relative overflow-hidden">
                {/* Background Accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#5A5A40]/5 rounded-bl-full -mr-16 -mt-16" />
                
                {/* Tags */}
                <div className="flex gap-2 mb-8">
                  <span className="px-3 py-1 bg-[#5A5A40]/10 text-[#5A5A40] text-[10px] font-bold uppercase tracking-wider rounded-full">
                    {currentQuestion.category}
                  </span>
                  <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${
                    currentQuestion.difficulty === Difficulty.Beginner ? 'bg-emerald-100 text-emerald-700' :
                    currentQuestion.difficulty === Difficulty.Intermediate ? 'bg-amber-100 text-amber-700' :
                    'bg-rose-100 text-rose-700'
                  }`}>
                    {currentQuestion.difficulty}
                  </span>
                </div>

                {/* Sentence */}
                <h2 className="text-2xl sm:text-4xl font-serif leading-relaxed mb-12">
                  {currentQuestion.sentence.split('____').map((part, i, arr) => (
                    <span key={i}>
                      {part}
                      {i < arr.length - 1 && (
                        <span className={`inline-block min-w-[120px] border-b-2 mx-2 text-center transition-all duration-300 ${
                          isSubmitted 
                            ? (selectedOption?.isCorrect ? 'text-emerald-600 border-emerald-600' : 'text-rose-600 border-rose-600')
                            : (selectedOption ? 'text-[#5A5A40] border-[#5A5A40]' : 'border-gray-300')
                        }`}>
                          {selectedOption ? selectedOption.text : '____'}
                        </span>
                      )}
                    </span>
                  ))}
                </h2>

                {/* Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
                  {currentQuestion.options.map((option) => (
                    <button
                      key={option.id}
                      disabled={isSubmitted}
                      onClick={() => handleOptionSelect(option)}
                      className={`group relative flex items-center justify-between p-5 rounded-2xl border-2 text-left transition-all duration-200 ${
                        selectedOption?.id === option.id
                          ? (isSubmitted 
                              ? (option.isCorrect ? 'bg-emerald-50 border-emerald-500 text-emerald-900' : 'bg-rose-50 border-rose-500 text-rose-900')
                              : 'bg-[#5A5A40]/5 border-[#5A5A40] text-[#5A5A40]')
                          : (isSubmitted && option.isCorrect ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-white border-black/5 hover:border-black/20')
                      } ${isSubmitted ? 'cursor-default' : 'cursor-pointer active:scale-[0.98]'}`}
                    >
                      <div className="flex items-center gap-4">
                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-colors ${
                          selectedOption?.id === option.id ? 'bg-[#5A5A40] text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'
                        }`}>
                          {option.id.toUpperCase()}
                        </span>
                        <span className="font-medium text-lg">{option.text}</span>
                      </div>
                      {isSubmitted && option.isCorrect && <CheckCircle2 className="text-emerald-500" size={24} />}
                      {isSubmitted && selectedOption?.id === option.id && !option.isCorrect && <XCircle className="text-rose-500" size={24} />}
                    </button>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex justify-end">
                  {!isSubmitted ? (
                    <button
                      onClick={handleSubmit}
                      disabled={!selectedOption}
                      className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-bold transition-all ${
                        selectedOption 
                          ? 'bg-[#5A5A40] text-white shadow-lg shadow-[#5A5A40]/20 hover:translate-y-[-2px]' 
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      提交答案
                      <ChevronRight size={20} />
                    </button>
                  ) : (
                    <button
                      onClick={handleNext}
                      className="flex items-center gap-2 px-8 py-4 bg-[#5A5A40] text-white rounded-2xl font-bold shadow-lg shadow-[#5A5A40]/20 hover:translate-y-[-2px] transition-all"
                    >
                      {currentIndex === filteredQuestions.length - 1 ? '查看结果' : '下一题'}
                      <ArrowRight size={20} />
                    </button>
                  )}
                </div>
              </div>

              {/* Explanation Card */}
              <AnimatePresence>
                {isSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-white rounded-[32px] p-8 shadow-sm border border-black/5 overflow-hidden"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className={`p-2 rounded-xl ${selectedOption?.isCorrect ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                        <Info size={24} />
                      </div>
                      <h3 className="text-xl font-serif font-bold">详解卡片</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <section>
                          <h4 className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">正确答案</h4>
                          <p className="text-lg font-bold text-emerald-600">{currentQuestion.explanation.correctAnswer}</p>
                        </section>
                        <section>
                          <h4 className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">语法规则</h4>
                          <p className="text-gray-700 leading-relaxed">{currentQuestion.explanation.rule}</p>
                        </section>
                      </div>
                      <div className="space-y-6">
                        <section>
                          <h4 className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">经典例句</h4>
                          <p className="text-gray-700 italic border-l-4 border-gray-100 pl-4">{currentQuestion.explanation.example}</p>
                        </section>
                        <section>
                          <h4 className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">常见错误辨析</h4>
                          <p className="text-gray-700">{currentQuestion.explanation.commonMistake}</p>
                        </section>
                        {currentQuestion.reviewLink && (
                          <a 
                            href={currentQuestion.reviewLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-[#5A5A40] font-bold hover:underline"
                          >
                            复习相关知识点 <ExternalLink size={14} />
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            /* Results View */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto text-center py-12"
            >
              <div className="bg-white rounded-[48px] p-12 shadow-xl border border-black/5">
                <div className="w-24 h-24 bg-[#5A5A40] rounded-full flex items-center justify-center text-white mx-auto mb-8 shadow-lg shadow-[#5A5A40]/30">
                  <Trophy size={48} />
                </div>
                <h2 className="text-4xl font-serif font-bold mb-4">练习完成！</h2>
                <p className="text-gray-500 text-lg mb-8">{getEncouragement(score, filteredQuestions.length)}</p>
                
                <div className="flex justify-center gap-12 mb-12">
                  <div>
                    <p className="text-5xl font-serif font-bold text-[#5A5A40]">{score}</p>
                    <p className="text-xs uppercase tracking-widest text-gray-400 font-bold mt-2">正确题数</p>
                  </div>
                  <div className="w-px h-16 bg-gray-100" />
                  <div>
                    <p className="text-5xl font-serif font-bold text-gray-300">{filteredQuestions.length}</p>
                    <p className="text-xs uppercase tracking-widest text-gray-400 font-bold mt-2">总题数</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={handleReset}
                    className="flex items-center justify-center gap-2 px-8 py-4 bg-[#5A5A40] text-white rounded-2xl font-bold hover:translate-y-[-2px] transition-all shadow-lg shadow-[#5A5A40]/20"
                  >
                    <RotateCcw size={20} />
                    再练一遍
                  </button>
                  <button 
                    onClick={() => { setDifficultyFilter('All'); setCategoryFilter('All'); handleReset(); }}
                    className="flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-black/5 text-gray-700 rounded-2xl font-bold hover:bg-gray-50 transition-all"
                  >
                    更换筛选条件
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="max-w-4xl mx-auto px-6 py-12 text-center text-gray-400 text-sm">
        <p>© 2026 GrammarMaster · 助力初中英语语法提升</p>
      </footer>
    </div>
  );
}
