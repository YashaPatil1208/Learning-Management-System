import Layout from '../../components/layout/Layout';
import { timetable, courses } from '../../data/mockData';
import { Badge } from '../../components/ui/Badge';
import { Clock, MapPin } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const TIME_SLOTS = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00'];

const formatTime = (t) => {
  const [h, m] = t.split(':');
  const hr = parseInt(h);
  return `${hr > 12 ? hr - 12 : hr}:${m} ${hr >= 12 ? 'PM' : 'AM'}`;
};

const courseColorMap = {
  indigo: 'bg-indigo-50 border-indigo-200 text-indigo-800',
  sky:    'bg-sky-50 border-sky-200 text-sky-800',
  emerald:'bg-emerald-50 border-emerald-200 text-emerald-800',
  amber:  'bg-amber-50 border-amber-200 text-amber-800',
  rose:   'bg-rose-50 border-rose-200 text-rose-800',
};

const typeColors = {
  lecture: 'primary',
  lab: 'success',
  tutorial: 'warning',
};

export default function Timetable() {
  const todayName = DAYS[new Date().getDay() - 1] || 'Monday';

  const getClassAt = (day, timeSlot) => {
    return timetable.find(t => {
      if (t.dayOfWeek !== day) return false;
      const slotStart = parseInt(timeSlot.split(':')[0]);
      const classStart = parseInt(t.startTime.split(':')[0]);
      const classEnd = parseInt(t.endTime.split(':')[0]);
      return slotStart >= classStart && slotStart < classEnd;
    });
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900">Weekly Timetable</h1>
        <p className="text-sm text-slate-500 mt-0.5">Semester 5 · CS-2023-A · Academic Year 2024–25</p>
      </div>

      {/* Today's summary */}
      <div className="mb-6 p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
        <p className="text-sm font-semibold text-indigo-800 mb-3">Today — {todayName}</p>
        <div className="flex flex-wrap gap-3">
          {timetable.filter(t => t.dayOfWeek === todayName).map(cls => {
            const course = courses.find(c => c.id === cls.courseId);
            return (
              <div key={cls.id} className="flex items-center gap-2 bg-white border border-indigo-100 rounded-lg px-3 py-2 text-sm">
                <Clock size={14} className="text-indigo-500" />
                <span className="font-medium text-slate-700">{formatTime(cls.startTime)} — {formatTime(cls.endTime)}</span>
                <span className="text-indigo-600 font-semibold">{course?.code}</span>
                <span className="text-slate-500">{cls.room}</span>
                <Badge variant={typeColors[cls.type] || 'default'}>{cls.type}</Badge>
              </div>
            );
          })}
          {timetable.filter(t => t.dayOfWeek === todayName).length === 0 && (
            <p className="text-sm text-indigo-600">No classes today 🎉</p>
          )}
        </div>
      </div>

      {/* Timetable grid */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="w-20 px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Time</th>
              {DAYS.map(day => (
                <th key={day} className={`px-3 py-3 text-center text-xs font-medium uppercase tracking-wide ${day === todayName ? 'text-indigo-700 bg-indigo-50' : 'text-slate-500'}`}>
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {TIME_SLOTS.map((slot) => (
              <tr key={slot} className="hover:bg-slate-50/50">
                <td className="px-4 py-2 text-xs text-slate-400 font-medium whitespace-nowrap w-20">
                  {formatTime(slot)}
                </td>
                {DAYS.map(day => {
                  const cls = getClassAt(day, slot);
                  const course = cls ? courses.find(c => c.id === cls.courseId) : null;
                  const isFirst = cls && cls.startTime === slot;
                  return (
                    <td key={day} className={`px-2 py-1.5 text-center align-top ${day === todayName ? 'bg-indigo-50/30' : ''}`}>
                      {cls && isFirst ? (
                        <div className={`rounded-lg border p-2 text-left ${courseColorMap[course?.color] || courseColorMap.indigo}`}>
                          <p className="text-xs font-bold leading-tight">{course?.code}</p>
                          <p className="text-xs leading-tight mt-0.5 opacity-75 line-clamp-1">{course?.name}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <MapPin size={9} className="opacity-60" />
                            <span className="text-[10px] opacity-70">{cls.room}</span>
                          </div>
                          <Badge variant={typeColors[cls.type] || 'default'} className="mt-1 text-[9px]">{cls.type}</Badge>
                        </div>
                      ) : cls && !isFirst ? (
                        <div className={`rounded-lg border p-1 opacity-30 ${courseColorMap[course?.color] || courseColorMap.indigo}`}>
                          <div className="h-3" />
                        </div>
                      ) : null}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-3">
        {Object.entries(typeColors).map(([type, variant]) => (
          <div key={type} className="flex items-center gap-1.5 text-xs text-slate-500">
            <Badge variant={variant}>{type}</Badge>
          </div>
        ))}
        <span className="text-xs text-slate-400 ml-2">Today is highlighted in indigo</span>
      </div>
    </Layout>
  );
}
