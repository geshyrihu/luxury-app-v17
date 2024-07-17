export function getWeekRange(week: string): { start: Date; end: Date } {
  const [year, weekNumber] = week.split('-W').map(Number);
  const firstDayOfYear = new Date(year, 0, 1);
  const firstMonday = new Date(firstDayOfYear);

  // Ajustar al primer lunes del año
  const firstDayOfWeek = firstMonday.getDay() || 7;
  if (firstDayOfWeek !== 1) {
    firstMonday.setDate(firstMonday.getDate() + (1 - firstDayOfWeek));
  }

  // Calcular el inicio de la semana (lunes) basado en el número de semana
  const startOfWeek = new Date(
    firstMonday.getTime() + (weekNumber - 1) * 7 * 24 * 60 * 60 * 1000
  );
  const monday = new Date(startOfWeek);

  // Calcular el fin de la semana (domingo)
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return { start: monday, end: sunday };
}

export function filterWeeklyReport(
  data: any[],
  week: string,
  dateField: 'fechaProgamacion' | 'dateRequest'
): any[] {
  const { start, end } = getWeekRange(week);
  return data.filter((item) => {
    if (!item[dateField]) {
      console.warn(`Item with missing ${dateField}:`, item);
      return false;
    }

    const [day, month, year] = item[dateField].split('-').map(Number);
    const itemDate = new Date(year, month - 1, day);
    return itemDate >= start && itemDate <= end;
  });
}

export function onWeekChange(
  event: Event,
  data: any[],
  dateField: 'fechaProgamacion' | 'dateRequest',
  callback: (filteredData: any[]) => void
): void {
  const input = event.target as HTMLInputElement;
  const selectedWeek = input.value;
  const filteredData = filterWeeklyReport(data, selectedWeek, dateField);
  callback(filteredData);
}
