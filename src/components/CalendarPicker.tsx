import { useState } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  isBefore, 
  startOfDay 
} from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarPickerProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
}

export default function CalendarPicker({ selectedDate, onDateSelect }: CalendarPickerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-sm uppercase tracking-widest font-medium">
          {format(currentMonth, 'MMMM yyyy', { locale: fr })}
        </h4>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    return (
      <div className="grid grid-cols-7 mb-2">
        {days.map((day) => (
          <div key={day} className="text-[10px] uppercase tracking-widest text-white/30 text-center font-bold">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, 'd');
        const cloneDay = day;
        const isDisabled = !isSameMonth(day, monthStart) || isBefore(day, startOfDay(new Date()));
        const isSelected = selectedDate && isSameDay(day, selectedDate);

        days.push(
          <div
            key={day.toString()}
            className={`relative h-10 flex items-center justify-center cursor-pointer text-sm transition-all rounded-lg
              ${isDisabled ? 'text-white/10 cursor-not-allowed' : 'hover:bg-white/10'}
              ${isSelected ? 'bg-white text-black font-bold hover:bg-white' : ''}
            `}
            onClick={() => !isDisabled && onDateSelect(cloneDay)}
          >
            <span>{formattedDate}</span>
            {isSameDay(day, new Date()) && !isSelected && (
              <div className="absolute bottom-1 w-1 h-1 bg-white rounded-full"></div>
            )}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7 gap-1" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="space-y-1">{rows}</div>;
  };

  return (
    <div className="p-6 bg-black border border-white/10 rounded-2xl shadow-2xl">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
}
