import React, { useState, useMemo } from 'react';
import { 
  Droplets, 
  CloudRain, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  ChevronRight,
  Waves,
  Mountain,
  Code
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { predictWaterLevel, WaterLevel, pythonCodeSnippet } from './services/waterfallAI';

const waterfalls = [
  { name: 'น้ำตกพลิ้ว', desc: 'น้ำตกขนาดใหญ่ มีปลาพลวงจำนวนมาก', altitude: 'ต่ำ' },
  { name: 'คลองนารายณ์', desc: 'น้ำตกที่มีความสำคัญทางประวัติศาสตร์', altitude: 'ต่ำ' },
  { name: 'ตรอกนอง', desc: 'น้ำตกที่มีความสวยงามและเงียบสงบ', altitude: 'กลาง' },
  { name: 'สอยดาว', desc: 'น้ำตกบนเขาสูง ชัน และมีโอกาสน้ำหลากเร็ว', altitude: 'สูงมาก' },
  { name: 'กระทิง', desc: 'น้ำตกที่มีหลายชั้น สวยงามในอุทยานแห่งชาติ', altitude: 'กลาง' },
  { name: 'คลองไพบูลย์', desc: 'น้ำตกที่เหมาะกับการเล่นน้ำและพักผ่อน', altitude: 'ต่ำ' },
  { name: 'เขาสิบห้าชั้น', desc: 'น้ำตกในป่าลึก มีความลาดชันสูง', altitude: 'สูง' },
];

const months = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];

export default function App() {
  const [selectedWaterfall, setSelectedWaterfall] = useState(waterfalls[0].name);
  const [rainfall, setRainfall] = useState<number>(0);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [prediction, setPrediction] = useState<WaterLevel | null>(null);
  const [showCode, setShowCode] = useState(false);

  const handlePredict = () => {
    const result = predictWaterLevel({
      waterfallName: selectedWaterfall,
      rainfall24h: rainfall,
      month: selectedMonth
    });
    setPrediction(result);
  };

  const getStatusColor = (level: WaterLevel) => {
    switch (level) {
      case 'ปริมาณน้ำน้อย': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'ปริมาณน้ำพอดี (เหมาะกับการเล่น)': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'ปริมาณน้ำมาก (อันตราย)': return 'text-rose-600 bg-rose-50 border-rose-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getStatusIcon = (level: WaterLevel) => {
    switch (level) {
      case 'ปริมาณน้ำน้อย': return <Info className="w-6 h-6" />;
      case 'ปริมาณน้ำพอดี (เหมาะกับการเล่น)': return <CheckCircle2 className="w-6 h-6" />;
      case 'ปริมาณน้ำมาก (อันตราย)': return <AlertTriangle className="w-6 h-6" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-blue-600 mb-2">
              <Waves className="w-6 h-6" />
              <span className="text-sm font-bold tracking-widest uppercase">Chanthaburi Waterfalls</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
              ระบบคาดการณ์ระดับน้ำ <span className="text-blue-600">AI</span>
            </h1>
            <p className="text-slate-500 mt-2 max-w-xl">
              วิเคราะห์ปริมาณน้ำในน้ำตก 7 แห่งของจังหวัดจันทบุรี โดยใช้ข้อมูลปริมาณน้ำฝนและลักษณะทางกายภาพของพื้นที่
            </p>
          </div>
          <button 
            onClick={() => setShowCode(!showCode)}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 transition-colors text-sm font-medium text-slate-600"
          >
            <Code className="w-4 h-4" />
            {showCode ? 'Hide Python Logic' : 'View Python Logic'}
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Input Panel */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-500" />
                กรอกข้อมูลเพื่อทำนาย
              </h2>

              <div className="space-y-5">
                {/* Waterfall Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    เลือกน้ำตก
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {waterfalls.map((wf) => (
                      <button
                        key={wf.name}
                        onClick={() => setSelectedWaterfall(wf.name)}
                        className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                          selectedWaterfall === wf.name 
                            ? 'border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500' 
                            : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Mountain className={`w-4 h-4 ${selectedWaterfall === wf.name ? 'text-blue-500' : 'text-slate-400'}`} />
                          <span className="text-sm font-medium">{wf.name}</span>
                        </div>
                        <div className="text-[10px] px-2 py-0.5 rounded-full bg-white/50 border border-slate-200 text-slate-400">
                          ระดับ: {wf.altitude}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rainfall Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    ปริมาณน้ำฝนสะสม (24 ชม.)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={rainfall}
                      onChange={(e) => setRainfall(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      placeholder="0"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">mm</span>
                  </div>
                  <div className="mt-2 flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                    <span>ไม่มีฝน</span>
                    <span>ฝนตกหนัก</span>
                    <span>น้ำป่าไหลหลาก</span>
                  </div>
                </div>

                {/* Month Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    เดือนที่เดินทาง
                  </label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none"
                  >
                    {months.map((m, i) => (
                      <option key={m} value={i + 1}>{m}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handlePredict}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <CloudRain className="w-5 h-5" />
                  ทำนายผลลัพธ์
                </button>
              </div>
            </div>
          </div>

          {/* Result Panel */}
          <div className="lg:col-span-7 space-y-8">
            <AnimatePresence mode="wait">
              {prediction ? (
                <motion.div
                  key={prediction}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`rounded-3xl p-8 border-2 ${getStatusColor(prediction)} shadow-xl shadow-slate-200/50`}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-widest opacity-60">ผลการวิเคราะห์ AI</span>
                      <h3 className="text-3xl font-black mt-1 leading-tight">{prediction}</h3>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/40 backdrop-blur-sm">
                      {getStatusIcon(prediction)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-white/30 p-4 rounded-2xl">
                      <span className="block text-[10px] font-bold uppercase opacity-60 mb-1">น้ำตก</span>
                      <span className="text-sm font-bold">{selectedWaterfall}</span>
                    </div>
                    <div className="bg-white/30 p-4 rounded-2xl">
                      <span className="block text-[10px] font-bold uppercase opacity-60 mb-1">ปริมาณฝน</span>
                      <span className="text-sm font-bold">{rainfall} mm</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-black/5 text-sm leading-relaxed italic">
                    {prediction === 'ปริมาณน้ำน้อย' && "💡 คำแนะนำ: น้ำอาจน้อยเกินไปสำหรับการเล่นน้ำที่สนุกสนาน แต่ยังสามารถเดินชมธรรมชาติได้"}
                    {prediction === 'ปริมาณน้ำพอดี (เหมาะกับการเล่น)' && "✅ คำแนะนำ: สภาพน้ำอยู่ในเกณฑ์ดี เหมาะแก่การพักผ่อนและเล่นน้ำอย่างปลอดภัย"}
                    {prediction === 'ปริมาณน้ำมาก (อันตราย)' && "⚠️ คำเตือน: ปริมาณน้ำสูงและไหลเชี่ยว มีความเสี่ยงน้ำป่าไหลหลาก ห้ามลงเล่นน้ำเด็ดขาด"}
                  </div>
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-200 rounded-3xl text-slate-400 text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <Droplets className="w-8 h-8" />
                  </div>
                  <p className="font-medium">กรุณากรอกข้อมูลและกดปุ่มทำนาย<br/>เพื่อดูผลวิเคราะห์ระดับน้ำ</p>
                </div>
              )}
            </AnimatePresence>

            {/* Waterfall Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {waterfalls.filter(w => w.name === selectedWaterfall).map(w => (
                <div key={w.name} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 col-span-full">
                  <h4 className="font-bold flex items-center gap-2 mb-2">
                    <Mountain className="w-4 h-4 text-slate-400" />
                    ข้อมูลกายภาพ: {w.name}
                  </h4>
                  <p className="text-sm text-slate-500 mb-4">{w.desc}</p>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between text-[10px] font-bold uppercase text-slate-400 mb-1">
                        <span>ความสูงชัน</span>
                        <span>{w.altitude}</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500" 
                          style={{ width: w.altitude === 'สูงมาก' ? '100%' : w.altitude === 'สูง' ? '75%' : w.altitude === 'กลาง' ? '50%' : '25%' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Python Code Section */}
            <AnimatePresence>
              {showCode && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="bg-slate-900 rounded-3xl p-6 text-slate-300 font-mono text-xs leading-relaxed">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-rose-500" />
                        <div className="w-3 h-3 rounded-full bg-amber-500" />
                        <div className="w-3 h-3 rounded-full bg-emerald-500" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">model_training.py</span>
                    </div>
                    <pre className="whitespace-pre-wrap">
                      {pythonCodeSnippet}
                    </pre>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-slate-200 text-center text-slate-400 text-xs">
          <p>© 2024 Chanthaburi Waterfall AI Prediction System. ข้อมูลนี้เป็นการจำลองเพื่อการศึกษาเท่านั้น</p>
        </footer>
      </div>
    </div>
  );
}
