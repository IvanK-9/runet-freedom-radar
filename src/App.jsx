import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import SpeedometerGauge from './components/SpeedometerGauge';
import FotnBadgeCard from './components/FotnBadgeCard';
import DualTimelineChart from './components/DualTimelineChart';
import TimeScrubber from './components/TimeScrubber';
import EventFeed from './components/EventFeed';
import EventDetailModal from './components/EventDetailModal';
import SimulatorModal from './components/SimulatorModal';
import MethodologyModal from './components/MethodologyModal';

import { historicalEvents } from './data/historicalEvents';
import { 
  calculateBalanceAtDate, 
  generateTimelineSeries, 
  getFotnForYear 
} from './utils/calculator';

export default function App() {
  const [events, setEvents] = useState(historicalEvents);
  const [customEvents, setCustomEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState('2026-02-15');
  
  // Modals state
  const [selectedEventModal, setSelectedEventModal] = useState(null);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);

  // Re-generate time series when events change
  const timelineData = useMemo(() => {
    return generateTimelineSeries(events);
  }, [events]);

  // Current year & month
  const currentYear = useMemo(() => {
    return new Date(currentDate).getFullYear();
  }, [currentDate]);

  // Dual index calculation for current date
  const { 
    iNar, 
    iTech, 
    deltaGap, 
    gapStatus, 
    pressureWeight, 
    defenseWeight, 
    failWeight 
  } = useMemo(() => {
    return calculateBalanceAtDate(events, currentDate);
  }, [events, currentDate]);

  // Global Net Freedom Benchmark (GNFB) score for current year
  const currentFotn = useMemo(() => {
    return getFotnForYear(currentYear);
  }, [currentYear]);

  // Add simulated event from LLM modal
  const handleAddSimulatedEvent = (newEvent) => {
    const formatted = {
      ...newEvent,
      id: `sim-${Date.now()}`
    };
    setEvents(prev => [formatted, ...prev]);
    setCustomEvents(prev => [formatted, ...prev]);
    setCurrentDate(formatted.date);
  };

  // Reset to original events
  const handleResetEvents = () => {
    setEvents(historicalEvents);
    setCustomEvents([]);
  };

  // Reset to latest 2026 date
  const handleResetToCurrent = () => {
    setCurrentDate('2026-02-15');
  };

  return (
    <div className="min-h-screen bg-[#070a10] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Background Decorative Grid */}
      <div className="fixed inset-0 bg-grid-pattern opacity-100 pointer-events-none" />
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-cyan-600/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-red-600/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Navbar Header with Delta indicator */}
      <Header
        onOpenSimulator={() => setIsSimulatorOpen(true)}
        onOpenMethodology={() => setIsMethodologyOpen(true)}
        onResetToCurrent={handleResetToCurrent}
        totalEvents={events.length}
        fotnScore={currentFotn.score}
        currentYear={currentYear}
        deltaGap={deltaGap}
        gapStatus={gapStatus}
      />

      {/* Main Content Dashboard */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 z-10">
        
        {/* Top Hero Grid: Dual-Needle Speedometer (Left) & Net Freedom Benchmark Card (Right) */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SpeedometerGauge
            iTech={iTech}
            iNar={iNar}
            deltaGap={deltaGap}
            gapStatus={gapStatus}
            pressureWeight={pressureWeight}
            defenseWeight={defenseWeight}
            failWeight={failWeight}
          />

          <FotnBadgeCard
            fotn={currentFotn}
            currentYear={currentYear}
            onOpenMethodology={() => setIsMethodologyOpen(true)}
          />
        </section>

        {/* Middle Section: Dual Timeline Chart & Interactive Scrubber */}
        <section className="space-y-4">
          <DualTimelineChart
            timelineData={timelineData}
            currentDate={currentDate}
            onSelectDate={setCurrentDate}
          />

          <TimeScrubber
            timelineData={timelineData}
            currentDate={currentDate}
            onSelectDate={setCurrentDate}
          />
        </section>

        {/* Bottom Section: Filterable Event Feed */}
        <section>
          <EventFeed
            events={events}
            currentDate={currentDate}
            onSelectEvent={setSelectedEventModal}
            onSelectDate={setCurrentDate}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 mt-12 text-xs text-slate-500 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-mono text-slate-400 font-semibold">Runet Freedom Radar</span> — Двухконтурная модель: «Нарратив vs. Физика сети» & Freedom on the Net.
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMethodologyOpen(true)} 
              className="text-slate-400 hover:text-cyan-400 transition-colors"
            >
              Методология расхождения (Δ)
            </button>
            <span>•</span>
            <button 
              onClick={() => setIsSimulatorOpen(true)} 
              className="text-slate-400 hover:text-cyan-400 transition-colors"
            >
              LLM-симулятор
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {selectedEventModal && (
        <EventDetailModal
          event={selectedEventModal}
          onClose={() => setSelectedEventModal(null)}
        />
      )}

      {isSimulatorOpen && (
        <SimulatorModal
          onClose={() => setIsSimulatorOpen(false)}
          onAddSimulatedEvent={handleAddSimulatedEvent}
          onResetEvents={handleResetEvents}
          customCount={customEvents.length}
        />
      )}

      {isMethodologyOpen && (
        <MethodologyModal
          onClose={() => setIsMethodologyOpen(false)}
        />
      )}
    </div>
  );
}
